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

  const SESSION_KEY = "luong_hau_auth_session_v5";

  // Danh mục quyền hạn theo vai trò (Role-Based Access Control)
  const PERMISSIONS = {
    ADMIN: ["view_internal", "view_admin", "manage_users", "manage_cms", "publish", "delete_all", "view_restricted_docs", "view_secretary_dashboard"],
    BI_THU: ["view_internal", "view_admin", "manage_cms", "publish", "delete_all", "view_restricted_docs", "view_secretary_dashboard", "manage_attendance", "assign_tasks"],
    PHO_BI_THU: ["view_internal", "view_admin", "manage_cms", "publish", "view_restricted_docs", "view_secretary_dashboard", "manage_attendance"],
    CHI_UY_VIEN: ["view_internal", "view_admin", "manage_cms", "view_restricted_docs", "view_secretary_dashboard"],
    THU_KY: ["view_internal", "view_admin", "manage_cms", "draft_resolution"],
    EDITOR: ["view_admin", "manage_cms"],
    DANG_VIEN: ["view_internal", "view_party_docs", "view_schedule", "view_resolutions"],
    VIEWER: []
  };

  function removeVietnameseTones(str) {
    if (!str) return "";
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str.trim().toLowerCase();
  }

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

    // Xác thực đảng viên bằng Họ tên + Ngày sinh/Năm sinh/Số thẻ Đảng
    login(fullName, birthInput, role = null) {
      if (!fullName || !birthInput) {
        return { success: false, message: "Vui lòng nhập đầy đủ Họ và tên cùng Ngày tháng năm sinh (hoặc Số thẻ Đảng)." };
      }

      const inputNameNorm = removeVietnameseTones(fullName);
      const inputBirthClean = birthInput.trim().replace(/[-.]/g, "/");

      const members = (window.LHStore && window.LHStore.getPartyMembers()) || [];
      const matched = members.find(m => {
        const memberNameNorm = removeVietnameseTones(m.name);
        const isNameMatch = memberNameNorm === inputNameNorm || memberNameNorm.includes(inputNameNorm) || inputNameNorm.includes(memberNameNorm);

        const mDob = m.dob || "";
        const mYear = mDob.split("/")[2] || "";
        const mCard = m.party_card || "";

        const isDobMatch = (mDob && (inputBirthClean === mDob || inputBirthClean.includes(mDob))) ||
                           (mYear && inputBirthClean === mYear) ||
                           (mCard && inputBirthClean === mCard);

        return isNameMatch && isDobMatch;
      });

      if (!matched) {
        return {
          success: false,
          message: "Thông tin Họ tên hoặc Ngày sinh/Số thẻ Đảng chưa khớp với hồ sơ 22 Đảng viên Chi bộ Lương Hậu."
        };
      }

      // Xác định vai trò từ dữ liệu thực
      let userRole = role || "DANG_VIEN";
      const upperName = matched.name.toUpperCase();
      if (upperName.includes("HỒ VĂN MÃO") || upperName.includes("HO VAN MAO")) {
        userRole = "BI_THU";
      } else if (upperName.includes("NGUYỄN TRỌNG NGHĨA") || upperName.includes("NGUYEN TRONG NGHIA")) {
        userRole = "PHO_BI_THU";
      } else if (upperName.includes("HOÀNG HỮU RỚT") || upperName.includes("NGUYỄN THỊ MỪNG")) {
        userRole = "CHI_UY_VIEN";
      }

      const session = {
        stt: matched.stt,
        name: matched.name,
        dob: matched.dob,
        gender: matched.gender,
        partyCard: matched.party_card,
        phone: matched.phone,
        area: matched.area,
        role: userRole,
        loginAt: new Date().toISOString()
      };

      this.saveSession(session);
      if (window.LHStore) {
        window.LHStore.log(`Đảng viên đăng nhập: ${matched.name} (${userRole})`, matched.name);
      }

      return { success: true, user: session };
    }

    // Đăng nhập Quản trị viên CMS
    loginAdmin(username, password) {
      if ((username === "admin" && (password === "LuongHau@2026" || password === "admin123")) ||
          (username === "hovanmao" && password === "1989")) {
        const session = {
          stt: 0,
          name: username === "hovanmao" ? "Hồ Văn Mão (Bí thư Chi bộ)" : "Quản trị viên Hệ thống",
          role: "ADMIN",
          position: "Ban Quản trị & Điều hành Cổng Thông tin",
          loginAt: new Date().toISOString()
        };
        this.saveSession(session);
        if (window.LHStore) {
          window.LHStore.log(`Quản trị viên đăng nhập CMS: ${session.name}`, session.name);
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
          return { allowed: false, redirect: "/noi-bo/dang-nhap", reason: "Cần đăng nhập tài khoản quản trị" };
        }
        if (!this.hasPermission("view_admin")) {
          return { allowed: false, redirect: "/noi-bo/dashboard", reason: "Tài khoản không đủ quyền hạn truy cập CMS" };
        }
      }

      return { allowed: true };
    }
  }

  return new AuthEngine();
});
