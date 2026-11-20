(function () {
    __HCMUS__.gpa = __HCMUS__.gpa || {};

    function toFixed(num) {
        return Math.round(num * 1000) / 1000;
    }

    function getDegreeInfo(gpa) {
        if (gpa >= 9.0) return { name: "Xuất Sắc", minGpa: 9.0, nextMin: null, nextName: null };
        if (gpa >= 8.0) return { name: "Giỏi", minGpa: 8.0, nextMin: 9.0, nextName: "Xuất Sắc" };
        if (gpa >= 6.5) return { name: "Khá", minGpa: 6.5, nextMin: 8.0, nextName: "Giỏi" };
        if (gpa >= 5.0) return { name: "Trung Bình", minGpa: 5.0, nextMin: 6.5, nextName: "Khá" };
        return { name: "Yếu / Kém", minGpa: 0, nextMin: 5.0, nextName: "Trung Bình" };
    }

    function getSelectedYearAndHk() {
        let year = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi_ob_CbocboNamHoc_gvDKHPLichThiTB').val() || "").trim();
        if (!year || year === "0" || year.toLowerCase().includes("tất cả")) {
            year = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi').val() || "").trim();
        }
        let hk = ($('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_gvDKHPLichThi_ob_CbocboHocKy_gvDKHPLichThiTB').val() || "").trim();
        if (!hk) {
            hk = ($('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_gvDKHPLichThi').val() || "").trim();
        }
        return { year, hk };
    }

    function isAllSemestersMode() {
        let { year } = getSelectedYearAndHk();
        return !year || year === "0" || year.toLowerCase().includes("tất cả");
    }

    function getCourseAcademicYear(semesterStr) {
        if (!semesterStr) return "";
        let match = semesterStr.match(/(\d{2,4}-\d{2,4})/);
        return match ? match[1] : "";
    }

    function isCourseInSelectedYears(state, item) {
        if (!isAllSemestersMode()) return true;
        if (!state.selectedAcademicYears || state.selectedAcademicYears.length === 0) return true;
        let y = getCourseAcademicYear(item ? item.semester : "");
        if (!y) return true;
        return state.selectedAcademicYears.includes(y);
    }

    function getAvailableAcademicYears(state) {
        let yearSet = new Set();
        if (state.data && state.data.length) {
            state.data.forEach(d => {
                let y = getCourseAcademicYear(d.semester);
                if (y) yearSet.add(y);
            });
        }
        if (state.customCoursesList && state.customCoursesList.length) {
            state.customCoursesList.forEach(c => {
                let y = getCourseAcademicYear(c.semester);
                if (y) yearSet.add(y);
            });
        }
        return Array.from(yearSet).sort();
    }

    function isCourseInSemesterGpaScope(item) {
        if (!item || !item.credit || item.credit <= 0) return false;
        if (item.whyExclude && item.whyExclude.includes("không tính")) return false;
        if (item.whyExclude && item.whyExclude.includes("không tín chỉ")) return false;
        return true;
    }

    function autoResizeTextarea(el) {
        if (!el) return;
        el.style.height = '26px';
        el.style.height = Math.max(26, el.scrollHeight) + 'px';
    }

    function isExceptCourseName(courseName) {
        if (!courseName) return false;
        const exceptCourses = [
            "Anh văn",
            "Giáo dục quốc phòng",
            "Thể dục",
            "Tin học cơ sở",
            "Tin hoc co so",
            "Anh van",
            "Giao duc quoc phong",
            "The duc"
        ];
        let normalized = courseName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return exceptCourses.some(ex => {
            let normEx = ex.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return normalized.includes(normEx);
        });
    }

    function isCustomCourseInScope(cItem) {
        if (isAllSemestersMode()) return true;
        if (!cItem) return true;

        let { year, hk } = getSelectedYearAndHk();
        let targetSem = (year + '/' + hk).toLowerCase();
        let cSem = (cItem.semester || "").trim().toLowerCase();
        let addedSem = (cItem.addedInSem || "").trim().toLowerCase();

        if (!cSem || cSem === "-") return true;

        let match = cSem === targetSem || cSem === year.toLowerCase() || (addedSem !== "" && addedSem === targetSem);
        return match;
    }

    __HCMUS__.gpa.helpers = {
        toFixed,
        getDegreeInfo,
        getSelectedYearAndHk,
        isAllSemestersMode,
        getCourseAcademicYear,
        isCourseInSelectedYears,
        getAvailableAcademicYears,
        isCourseInSemesterGpaScope,
        autoResizeTextarea,
        isExceptCourseName,
        isCustomCourseInScope
    };
})();
