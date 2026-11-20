(function () {
    // --- LocalStorage helpers keyed accurately per semester ---
    function getTkbSemKey() {
        let year = "";
        let hk = "";

        // 1. Try reading from page H1 header e.g. "Danh sách lớp mở trong 26-27 / HK1"
        let h1Text = $("h1:contains('Danh sách lớp mở')").text().trim();
        if (h1Text) {
            let m = h1Text.match(/(\d{2}-\d{2})\s*\/\s*(?:HK)?\s*(\d+)/i);
            if (m) {
                year = m[1].trim();
                hk = m[2].trim();
            }
        }

        // 2. Fallback to Obout ComboBox values on pid=327
        if (!year) {
            let yearEl = $('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_ob_CbocboNamHocTB');
            let yearHidden = $('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_ctl00_ContentPlaceHolder1_ctl00_cboNamHoc');
            year = (yearEl.val() || yearHidden.val() || $('input[name*="cboNamHoc"]').val() || '').trim();
        }
        if (!hk) {
            let hkEl = $('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_ob_CbocboHocKyTB');
            let hkHidden = $('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_ctl00_ContentPlaceHolder1_ctl00_cboHocKy');
            hk = (hkEl.val() || hkHidden.val() || $('input[name*="cboHocKy"]').val() || '').trim();
        }

        // 3. Fallback to URL parameters
        if (!year || !hk) {
            let mYear = window.location.href.match(/namhoc=([\d-]+)/i);
            let mHk = window.location.href.match(/hocky=([\d]+)/i);
            if (mYear && !year) year = mYear[1];
            if (mHk && !hk) hk = mHk[1];
        }

        return 'tkb_selected_' + (year || 'default') + '_hk' + (hk || '1');
    }

    function saveTkbToLocalStorage() {
        try {
            let key = getTkbSemKey();
            if (window._gpaSelectedClasses && Object.keys(window._gpaSelectedClasses).length > 0) {
                localStorage.setItem(key, JSON.stringify(window._gpaSelectedClasses));
            } else {
                localStorage.removeItem(key);
            }
        } catch (e) { }
    }

    function loadTkbFromLocalStorage() {
        try {
            // Clean legacy fallback key if exists
            localStorage.removeItem('tkb_selected_unknown_0');

            let key = getTkbSemKey();
            let raw = localStorage.getItem(key);
            if (raw) {
                let parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    window._gpaSelectedClasses = parsed;
                    return;
                }
            }
        } catch (e) { }
        // If this semester has no saved data, start fresh with empty selection
        window._gpaSelectedClasses = {};
    }

    function clearTkbFromLocalStorage() {
        try {
            let key = getTkbSemKey();
            localStorage.removeItem(key);
            window._gpaSelectedClasses = {};
        } catch (e) { }
    }

    function hasRestorableTkbData() {
        try {
            let key = getTkbSemKey();
            let raw = localStorage.getItem(key);
            if (raw) {
                let parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
                    return true;
                }
            }
        } catch (e) { }
        return false;
    }

    __HCMUS__.tkbStorage = {
        getTkbSemKey,
        saveTkbToLocalStorage,
        loadTkbFromLocalStorage,
        clearTkbFromLocalStorage,
        hasRestorableTkbData
    };
})();
