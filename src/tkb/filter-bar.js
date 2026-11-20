(function () {
    // Inject Search & Filter Bar under "Danh sách lớp mở"
    function injectFilterBar() {
        if ($('#gpaTkbFilterBar').length > 0) return;

        let filterHtml = `
        <div id="gpaTkbFilterBar" style="margin-bottom: 12px; display: flex; align-items: center; gap: 15px; font-size: 14px; flex-wrap: wrap;">
            <div>
                <label style="font-weight: normal; margin-right: 4px;">Tìm môn học:</label>
                <input type="text" id="tkbSearchInput" placeholder="Nhập tên môn, mã MH, tên lớp..." style="width: 220px; padding: 3px 6px; border: 1px solid #c0c0c0; background: #fff; font-size: 12px; vertical-align: middle; box-sizing: border-box;" />
            </div>
            <div id="tkbKhoaContainer" style="position: relative; display: inline-block;">
                <label style="font-weight: normal; margin-right: 4px;">Khóa:</label>
                <button type="button" id="tkbKhoaBtn" style="padding: 3px 10px; border: 1px solid #c0c0c0; background: #fff; font-size: 13px; cursor: pointer; vertical-align: middle; border-radius: 3px; font-family: inherit;">
                    Tất cả ▾
                </button>
                <div id="tkbKhoaPopover" style="display: none; position: absolute; top: 100%; left: 45px; z-index: 9999; background: #ffffff; border: 1px solid #c0c0c0; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 8px 12px; min-width: 130px; margin-top: 4px;">
                    <div style="margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #eee;">
                        <label style="cursor: pointer; font-weight: bold; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                            <input type="checkbox" id="tkbKhoaCb_all" checked /> Tất cả
                        </label>
                    </div>
                    <div id="tkbKhoaList" style="display: flex; flex-direction: column; gap: 4px; max-height: 160px; overflow-y: auto;">
                    </div>
                </div>
            </div>
            <div id="tkbDayContainer" style="position: relative; display: inline-block;">
                <label style="font-weight: normal; margin-right: 4px;">Thứ:</label>
                <button type="button" id="tkbDayBtn" style="padding: 3px 10px; border: 1px solid #c0c0c0; background: #fff; font-size: 13px; cursor: pointer; vertical-align: middle; border-radius: 3px; font-family: inherit;">
                    Tất cả ▾
                </button>
                <div id="tkbDayPopover" style="display: none; position: absolute; top: 100%; left: 35px; z-index: 9999; background: #ffffff; border: 1px solid #c0c0c0; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 8px 12px; min-width: 120px; margin-top: 4px;">
                    <div style="margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #eee;">
                        <label style="cursor: pointer; font-weight: bold; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                            <input type="checkbox" id="tkbDayCb_all" checked /> Tất cả
                        </label>
                    </div>
                    <div id="tkbDayList" style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                            <input type="checkbox" class="tkb-day-cb" value="2" checked /> Thứ 2
                        </label>
                        <label style="cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                            <input type="checkbox" class="tkb-day-cb" value="3" checked /> Thứ 3
                        </label>
                        <label style="cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                            <input type="checkbox" class="tkb-day-cb" value="4" checked /> Thứ 4
                        </label>
                        <label style="cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                            <input type="checkbox" class="tkb-day-cb" value="5" checked /> Thứ 5
                        </label>
                        <label style="cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                            <input type="checkbox" class="tkb-day-cb" value="6" checked /> Thứ 6
                        </label>
                        <label style="cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                            <input type="checkbox" class="tkb-day-cb" value="7" checked /> Thứ 7
                        </label>
                    </div>
                </div>
            </div>
            <div id="tkbBtnResetFilter" class="ob_iBCN" style="width: 70px; display: inline-block; vertical-align: middle; cursor: pointer;">
                <div class="ob_iBL"></div>
                <div class="ob_iBR"></div>
                <div class="ob_iBC"><div>Reset</div></div>
                <div class="ob_iBOv"></div>
            </div>
        </div>`;

        if ($('#tbPDTKQ_wrapper').length > 0) {
            $(filterHtml).insertBefore('#tbPDTKQ_wrapper');
        } else {
            $(filterHtml).insertBefore('#tbPDTKQ');
        }

        // Populate unique Khóa list
        let khoaSet = new Set();
        $('#tbPDTKQ tbody tr').each(function () {
            let tds = $(this).find('td').not('.tkb-cb-cell');
            if (tds.length >= 7) {
                let k = $(tds[6]).text().trim();
                if (k && k !== '-' && k !== '0') {
                    khoaSet.add(k);
                }
            }
        });

        let sortedKhoa = Array.from(khoaSet).sort((a, b) => a.localeCompare(b));
        $('#tkbKhoaList').empty();
        sortedKhoa.forEach(k => {
            $('#tkbKhoaList').append(`
                <label style="cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                    <input type="checkbox" class="tkb-khoa-cb" value="${k}" checked /> Khóa ${k}
                </label>
            `);
        });

        function getSelectedKhoaList() {
            if ($('#tkbKhoaCb_all').is(':checked')) return null;
            let selected = [];
            $('.tkb-khoa-cb:checked').each(function () {
                selected.push($(this).val().trim());
            });
            let total = $('.tkb-khoa-cb').length;
            if (selected.length === 0 || selected.length === total) return null;
            return selected;
        }

        function updateKhoaBtnText() {
            let isAll = $('#tkbKhoaCb_all').is(':checked');
            let selected = [];
            $('.tkb-khoa-cb:checked').each(function () {
                selected.push($(this).val().trim());
            });
            let total = $('.tkb-khoa-cb').length;

            if (isAll || selected.length === 0 || selected.length === total) {
                $('#tkbKhoaBtn').html('Tất cả ▾');
            } else if (selected.length === 1) {
                $('#tkbKhoaBtn').html(`${selected[0]} ▾`);
            } else {
                $('#tkbKhoaBtn').html(`(${selected.length}): ${selected.join(', ')} ▾`);
            }
        }

        function getSelectedDayList() {
            if ($('#tkbDayCb_all').is(':checked')) return null;
            let selected = [];
            $('.tkb-day-cb:checked').each(function () {
                selected.push($(this).val().trim());
            });
            let total = $('.tkb-day-cb').length;
            if (selected.length === 0 || selected.length === total) return null;
            return selected;
        }

        function updateDayBtnText() {
            let isAll = $('#tkbDayCb_all').is(':checked');
            let selected = [];
            $('.tkb-day-cb:checked').each(function () {
                selected.push($(this).val().trim());
            });
            let total = $('.tkb-day-cb').length;

            if (isAll || selected.length === 0 || selected.length === total) {
                $('#tkbDayBtn').html('Tất cả ▾');
            } else if (selected.length === 1) {
                $('#tkbDayBtn').html(`T${selected[0]} ▾`);
            } else {
                let labels = selected.map(d => 'T' + d);
                $('#tkbDayBtn').html(`(${selected.length}): ${labels.join(', ')} ▾`);
            }
        }

        // Clean up any previously registered filter functions in DataTables 1.9 & 1.10
        if (typeof $.fn !== 'undefined' && typeof $.fn.dataTableExt !== 'undefined' && Array.isArray($.fn.dataTableExt.afnFiltering)) {
            $.fn.dataTableExt.afnFiltering = $.fn.dataTableExt.afnFiltering.filter(fn => fn._isTkbFilter !== true);
        }
        if (typeof $.fn !== 'undefined' && typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.ext && Array.isArray($.fn.dataTable.ext.search)) {
            $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(fn => fn._isTkbFilter !== true);
        }

        // Custom DataTables 1.9 / 1.10 search function
        let customSearchFn = function (oSettings, aData, iDataIndex) {
            if (oSettings && oSettings.nTable && oSettings.nTable.id === "tbPDTKQ") {
                let searchVal = ($('#tkbSearchInput').val() || '').trim().toLowerCase();
                let selectedKhoa = getSelectedKhoaList();
                let selectedDays = getSelectedDayList();

                if (!searchVal && selectedKhoa === null && selectedDays === null) {
                    return true;
                }

                let maMH = (aData[0] || '').toLowerCase();
                let tenMH = (aData[1] || '').toLowerCase();
                let tenLop = (aData[2] || '').toLowerCase();
                let khoa = (aData[6] || '').trim();
                let lichHoc = (aData[7] || '').trim();

                if (oSettings.aoData && oSettings.aoData[iDataIndex] && oSettings.aoData[iDataIndex].nTr) {
                    let tds = $(oSettings.aoData[iDataIndex].nTr).find('td').not('.tkb-cb-cell');
                    if (tds.length >= 8) {
                        maMH = $(tds[0]).text().trim().toLowerCase();
                        tenMH = $(tds[1]).text().trim().toLowerCase();
                        tenLop = $(tds[2]).text().trim().toLowerCase();
                        khoa = $(tds[6]).text().trim();
                        lichHoc = $(tds[7]).text().trim();
                    }
                }

                let matchSearch = !searchVal || tenMH.includes(searchVal) || maMH.includes(searchVal) || tenLop.includes(searchVal);
                let matchKhoa = (selectedKhoa === null) || selectedKhoa.includes(khoa);
                let matchDay = true;
                if (selectedDays !== null) {
                    let upperLich = lichHoc.toUpperCase();
                    matchDay = selectedDays.some(d => upperLich.includes("T" + d));
                }

                return matchSearch && matchKhoa && matchDay;
            }
            return true;
        };

        customSearchFn._isTkbFilter = true;

        if (typeof $.fn !== 'undefined' && typeof $.fn.dataTableExt !== 'undefined' && Array.isArray($.fn.dataTableExt.afnFiltering)) {
            $.fn.dataTableExt.afnFiltering.push(customSearchFn);
        } else if (typeof $.fn !== 'undefined' && typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.ext && Array.isArray($.fn.dataTable.ext.search)) {
            $.fn.dataTable.ext.search.push(customSearchFn);
        }

        // Attach Filter Listeners
        function triggerFilter() {
            let searchVal = ($('#tkbSearchInput').val() || '').trim().toLowerCase();
            let selectedKhoa = getSelectedKhoaList();
            let selectedDays = getSelectedDayList();

            let dtObj = $('#tbPDTKQ').dataTable();
            if (dtObj && dtObj.fnFilter) {
                dtObj.fnFilter('');
            } else {
                $('#tbPDTKQ tbody tr').each(function () {
                    let tds = $(this).find('td').not('.tkb-cb-cell');
                    if (tds.length < 8) return;

                    let maMH = $(tds[0]).text().trim().toLowerCase();
                    let tenMH = $(tds[1]).text().trim().toLowerCase();
                    let tenLop = $(tds[2]).text().trim().toLowerCase();
                    let khoa = $(tds[6]).text().trim();
                    let lichHoc = $(tds[7]).text().trim();

                    let matchSearch = !searchVal || tenMH.includes(searchVal) || maMH.includes(searchVal) || tenLop.includes(searchVal);
                    let matchKhoa = (selectedKhoa === null) || selectedKhoa.includes(khoa);
                    let matchDay = true;
                    if (selectedDays !== null) {
                        let upperLich = lichHoc.toUpperCase();
                        matchDay = selectedDays.some(d => upperLich.includes("T" + d));
                    }

                    if (matchSearch && matchKhoa && matchDay) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }
        }

        $(document).off('keyup input', '#tkbSearchInput');
        $(document).on('keyup input', '#tkbSearchInput', triggerFilter);

        $(document).off('click', '#tkbKhoaBtn');
        $(document).on('click', '#tkbKhoaBtn', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('#tkbDayPopover').hide();
            $('#tkbKhoaPopover').toggle();
        });

        $(document).off('click', '#tkbDayBtn');
        $(document).on('click', '#tkbDayBtn', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('#tkbKhoaPopover').hide();
            $('#tkbDayPopover').toggle();
        });

        $(document).off('click.tkbFilterOut');
        $(document).on('click.tkbFilterOut', function (e) {
            if (!$(e.target).closest('#tkbKhoaContainer, #tkbDayContainer').length) {
                $('#tkbKhoaPopover').hide();
                $('#tkbDayPopover').hide();
            }
        });

        $(document).off('change', '#tkbKhoaCb_all');
        $(document).on('change', '#tkbKhoaCb_all', function () {
            let isChecked = $(this).is(':checked');
            $('.tkb-khoa-cb').prop('checked', isChecked);
            updateKhoaBtnText();
            triggerFilter();
        });

        $(document).off('change', '.tkb-khoa-cb');
        $(document).on('change', '.tkb-khoa-cb', function () {
            let total = $('.tkb-khoa-cb').length;
            let checked = $('.tkb-khoa-cb:checked').length;
            $('#tkbKhoaCb_all').prop('checked', total > 0 && total === checked);
            updateKhoaBtnText();
            triggerFilter();
        });

        $(document).off('change', '#tkbDayCb_all');
        $(document).on('change', '#tkbDayCb_all', function () {
            let isChecked = $(this).is(':checked');
            $('.tkb-day-cb').prop('checked', isChecked);
            updateDayBtnText();
            triggerFilter();
        });

        $(document).off('change', '.tkb-day-cb');
        $(document).on('change', '.tkb-day-cb', function () {
            let total = $('.tkb-day-cb').length;
            let checked = $('.tkb-day-cb:checked').length;
            $('#tkbDayCb_all').prop('checked', total > 0 && total === checked);
            updateDayBtnText();
            triggerFilter();
        });

        $(document).off('mouseenter mouseleave mousedown mouseup click', '#tkbBtnResetFilter');
        $(document).on('mouseenter', '#tkbBtnResetFilter', function () {
            $(this).removeClass('ob_iBCN').addClass('ob_iBCO');
        }).on('mouseleave', '#tkbBtnResetFilter', function () {
            $(this).removeClass('ob_iBCO ob_iBCP').addClass('ob_iBCN');
        }).on('mousedown', '#tkbBtnResetFilter', function () {
            $(this).removeClass('ob_iBCO ob_iBCN').addClass('ob_iBCP');
        }).on('mouseup', '#tkbBtnResetFilter', function () {
            $(this).removeClass('ob_iBCP').addClass('ob_iBCO');
        }).on('click', '#tkbBtnResetFilter', function () {
            $('#tkbSearchInput').val('');
            $('#tkbKhoaCb_all').prop('checked', true);
            $('.tkb-khoa-cb').prop('checked', true);
            updateKhoaBtnText();
            $('#tkbDayCb_all').prop('checked', true);
            $('.tkb-day-cb').prop('checked', true);
            updateDayBtnText();
            triggerFilter();
        });
    }

    __HCMUS__.tkbFilter = {
        injectFilterBar
    };
})();
