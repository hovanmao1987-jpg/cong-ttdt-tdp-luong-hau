/**
 * CỔNG THÔNG TIN SỐ LƯƠNG HẬU - AUTHENTICATION & RBAC ENGINE
 * Quản lý phiên làm việc, đối soát 22 Đảng viên & kiểm tra phân quyền bảo mật chặt chẽ
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.LHAuth = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const SESSION_KEY = "luong_hau_auth_session";

  // Danh mục quyền hạn theo vai trò (Role-Based Access Control)
  const PERMISSIONS = {
    ADMIN: ["view_internal", "view_admin", "manage_users", "manage_cms", "publish", "delete_all", "view_restricted_docs"],
    BI_THU: ["view_internal", "view_admin", "manage_cms", "publish", "delete_all", "view_restricted_docs", "view_secretary_dashboard"],
    PHO_BI_THU: ["view_internal", "view_admin", "manage_cms", "publish", "view_restricted_docs", "view_secretary_dashboard"],
    CHI_UY_VIEN: ["view_internal", "view_admin", "manage_cms", "view_restricted_docs"],
    THU_KY: ["view_internal", "view_admin", "manage_cms", "draft_resolution"],
    EDITOR: ["view_admin", "manage_cms"], // Không có quyền publish trực tiếp
    DANG_VIEN: ["view_internal", "view_party_docs"], // Không có quyền vào /quan-tri
    VIEWER: []
  };

  class AuthEngine {
    constructor() {
      this.currentSession = this.loadSession();
    }

    loadSession() {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn("Lỗi đọc session auth:", e);
      }
      return null;
    }

    saveSession(session, remember = true) {
      this.currentSession = session;
      const str = JSON.stringify(session);
      if (remember) {
        localStorage.setItem(SESSION_KEY, str);
      } else {
        sessionStorage.setItem(SESSION_KEY, str);
      }
    }

    clearSession() {
      this.currentSession = null;
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    }

    // Xác thực đảng viên bằng Họ tên + Ngày sinh/Năm sinh
    login(fullName, birthInput, role = null) {
      if (!fullName || !birthInput) {
        return { success: false, message: "Vui lòng nhập đầy đủ Họ và tên cùng Ngày tháng năm sinh." };
      }

      const nameClean = fullName.trim().toLowerCase();
      const birthClean = birthInput.trim().replace(/[-.]/g, "/");

      const members = (window.LHStore && window.LHStore.getPartyMembers()) || [];
      const matched = members.find(m => {
        const mName = m.name.toLowerCase();
        const mBirth = m.birth;
        const mYear = m.year;

        const isNameMatch = mName === nameClean || mName.includes(nameClean) || nameClean.includes(mName);
        const isBirthMatch = (mBirth && birthClean.includes(mBirth)) || (mYear && birthClean.includes(mYear));
        return isNameMatch && isBirthMatch;
      });

      if (!matched) {
        return {
          success: false,
          message: "Thông tin Họ và tên hoặc Ngày tháng năm sinh chưa khớp với danh sách 22 đồng chí Chi bộ Lương Hậu."
        };
      }

      // Xác định vai trò
      let userRole = role || "DANG_VIEN";
      if (matched.role.includes("Bí thư Chi bộ") && !matched.role.includes("Phó")) {
        userRole = "BI_THU";
      } else if (matched.role.includes("Phó Bí thư")) {
        userRole = "PHO_BI_THU";
      } else if (matched.role.includes("Chi ủy viên")) {
        userRole = "CHI_UY_VIEN";
      }

      const session = {
        id: matched.id,
        name: matched.name,
        role: userRole,
        position: matched.position,
        partyGroup: matched.group,
        loginAt: new Date().toISOString()
      };

      this.saveSession(session);
      if (window.LHStore) {
        window.LHStore.log(`Đảng viên đăng nhập thành công: ${matched.name} (${userRole})`, matched.name);
      }

      return { success: true, user: session };
    }

    // Đăng nhập CMS Admin khẩn cấp / Quản trị viên
    loginAdmin(username, password) {
      if (username === "admin" && password === "LuongHau@2026") {
        const session = {
          id: "ADMIN_01",
          name: "Quản trị viên Hệ thống",
          role: "ADMIN",
          position: "Ban biên tập & Quản trị cổng",
          loginAt: new Date().toISOString()
        };
        this.saveSession(session);
        if (window.LHStore) {
          window.LHStore.log("Quản trị viên đăng nhập CMS", "Admin");
        }
        return { success: true, user: session };
      }
      return { success: false, message: "Sai tài khoản hoặc mật khẩu quản trị." };
    }

    logout() {
      const user = this.currentSession ? this.currentSession.name : "Người dùng";
      if (window.LHStore) {
        window.LHStore.log(`Đăng xuất khỏi hệ thống: ${user}`, user);
      }
      this.clearSession();
    }

    isAuthenticated() {
      return !!this.currentSession;
    }

    getUser() {
      return this.currentSession;
    }

    hasPermission(perm) {
      if (!this.currentSession) return false;
      const role = this.currentSession.role;
      const perms = PERMISSIONS[role] || [];
      return perms.includes(perm);
    }

    // Kiểm tra bảo vệ route
    checkRouteGuard(path) {
      if (path.startsWith("/noi-bo") && path !== "/noi-bo/dang-nhap") {
        if (!this.isAuthenticated()) {
          return { allowed: false, redirect: "/noi-bo/dang-nhap", reason: "Chưa xác thực danh tính Đảng viên" };
        }
      }

      if (path.startsWith("/quan-tri")) {
        if (!this.isAuthenticated()) {
          return { allowed: false, redirect: "/noi-bo/dang-nhap", reason: "Cần đăng nhập quản trị" };
        }
        // Đảng viên thông thường không được vào quản trị nếu không có quyền
        if (!this.hasPermission("view_admin")) {
          return { allowed: false, redirect: "/noi-bo/dashboard", reason: "Tài khoản không đủ quyền hạn truy cập CMS" };
        }
      }

      return { allowed: true };
    }
  }

  return new AuthEngine();
});
