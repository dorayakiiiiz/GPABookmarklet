(function mainRouter() {
    const { PORTAL_HOST_REG } = __HCMUS__.constants;
    if (!window.location.hostname.match(PORTAL_HOST_REG)) {
        alert("Vui lòng truy cập trang \"Tra cứu kết quả học tập\", \"Danh sách lớp mở\", \"Kết quả ĐKHP\" hoặc \"Đăng ký học phần\" trên Portal HCMUS để dùng Tool nhé!");
        return;
    }

    if (window.location.href.includes("pid=211")) {
        if (typeof window._initGpaCalculator === "function") {
            window._initGpaCalculator();
        }
    } else if (window.location.href.includes("pid=327")) {
        if (typeof window._initTimetablePlanner === "function") {
            window._initTimetablePlanner();
        }
    } else if (window.location.href.includes("pid=212")) {
        if (typeof window._initKetQuaDkhp === "function") {
            window._initKetQuaDkhp();
        }
    } else if (window.location.href.includes("DangKyHocPhan.aspx")) {
        if (typeof window._initAutoDangKyHocPhan === "function") {
            window._initAutoDangKyHocPhan();
        }
    } else {
        alert("Vui lòng truy cập trang \"Tra cứu kết quả học tập\", \"Danh sách lớp mở\", \"Kết quả ĐKHP\" hoặc \"Đăng ký học phần\" trên Portal HCMUS để dùng Tool nhé!");
    }
})();
