javascript: (function tkbModule() {
    window._initTimetablePlanner = function () {
        const portalReg = /(new-)?portal\d*\.hcmus\.edu\.vn/i;
        if (!window.location.hostname.match(portalReg)) {
            alert("Vui lòng sử dụng Tool trên website HCMUS Portal!");
            return;
        }

        const tkbReg = /pid=327/i;
        if (!window.location.href.match(tkbReg)) {
            alert("Vui lòng đi tới trang \"Danh Sách Lớp Mở\" trước");
            return;
        }

        let tab = $("#tbPDTKQ");
        if (!tab.length) return;

        // Fix layout widths & Add custom styles for selection rows & hide Obout button overlay glitch
        $('<style>#page-body{display:flex!important;align-items:stretch!important}#page-body-menu{height:auto!important;min-height:100%!important;flex-shrink:0!important}#page-body-content{flex-grow:1!important;min-width:0!important}#tbPDTKQ{width:100%!important;margin:0!important}.tkb-selected-row{background-color:#e0f2fe!important}.ob_iBOv{display:none!important}</style>').appendTo('head');

        // Storage for selected classes (per semester)
        window._gpaSelectedClasses = {};

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

        // Curated harmonious color palettes for timetable blocks
        const COURSE_PALETTES = [
            { bg: "#e0f2fe", text: "#0369a1", roomText: "#0284c7" }, // Sky Blue
            { bg: "#fef3c7", text: "#b45309", roomText: "#d97706" }, // Warm Amber
            { bg: "#dcfce7", text: "#15803d", roomText: "#16a34a" }, // Soft Mint
            { bg: "#f3e8ff", text: "#6b21a8", roomText: "#7e22ce" }, // Lavender
            { bg: "#ffe4e6", text: "#be123c", roomText: "#e11d48" }, // Coral Rose
            { bg: "#ccfbf1", text: "#0f766e", roomText: "#0d9488" }, // Teal
            { bg: "#ffedd5", text: "#c2410c", roomText: "#ea580c" }, // Peach / Orange
            { bg: "#e0e7ff", text: "#4338ca", roomText: "#4f46e5" }, // Indigo
            { bg: "#fae8ff", text: "#86198f", roomText: "#a21caf" }, // Orchid
            { bg: "#ecfccb", text: "#4d7c0f", roomText: "#65a30d" }, // Lime
            { bg: "#f1f5f9", text: "#334155", roomText: "#475569" }, // Slate
            { bg: "#fee2e2", text: "#991b1b", roomText: "#dc2626" }  // Light Crimson
        ];

        // Parse schedule string e.g. "T5(1-4)-P.Thông báo sau" or "T2(6-9)-P.cs2:NhaThiDau_K"
        function parseSchedule(str) {
            if (!str) return [];
            let result = [];
            let regex = /T([2-7]|CN)\(([\d\.]+)-([\d\.]+)\)(?:-P\.([^,\;]+))?/gi;
            let match;
            while ((match = regex.exec(str)) !== null) {
                let dayStr = match[1];
                let dayNum = dayStr === "CN" ? 8 : parseInt(dayStr);
                let startPeriod = parseFloat(match[2]);
                let endPeriod = parseFloat(match[3]);
                let room = match[4] ? match[4].trim() : "Chưa có phòng";

                result.push({
                    dayStr: "Thứ " + (dayStr === "CN" ? "CN" : dayStr),
                    dayNum: dayNum,
                    startPeriod: startPeriod,
                    endPeriod: endPeriod,
                    room: room
                });
            }
            return result;
        }

        // Extract all schedule items (both Lecture and selected Practical shift) for a class
        function getAllSchedules(item) {
            let list = parseSchedule(item.scheduleStr);
            if (item.selectedTH && item.selectedTH.scheduleStr) {
                let thList = parseSchedule(item.selectedTH.scheduleStr);
                thList.forEach(s => { s.isTH = true; s.thNhom = item.selectedTH.nhom; });
                list = list.concat(thList);
            }
            return list;
        }

        // Interval overlap check function between two items (including Practical lab shifts)
        function checkConflict(itemA, itemB) {
            let schedA = getAllSchedules(itemA);
            let schedB = getAllSchedules(itemB);

            let hasTHA = itemA.hasTH || !!(itemA.selectedTH && itemA.selectedTH.scheduleStr);
            let hasTHB = itemB.hasTH || !!(itemB.selectedTH && itemB.selectedTH.scheduleStr);

            for (let a of schedA) {
                for (let b of schedB) {
                    if (a.dayNum === b.dayNum) {
                        let startOverlap = Math.max(a.startPeriod, b.startPeriod);
                        let endOverlap = Math.min(a.endPeriod, b.endPeriod);
                        if (startOverlap <= endOverlap) {
                            let typeA = hasTHA ? (a.isTH ? ` [TH ${a.thNhom}]` : ' [LT]') : '';
                            let typeB = hasTHB ? (b.isTH ? ` [TH ${b.thNhom}]` : ' [LT]') : '';
                            return {
                                conflict: true,
                                dayStr: a.dayStr,
                                overlapPeriodStr: `Tiết ${startOverlap}-${endOverlap}`,
                                detailA: itemA.courseName + typeA,
                                detailB: itemB.courseName + typeB
                            };
                        }
                    }
                }
            }
            return { conflict: false };
        }

        // Fetch Practical shifts via Portal Handler AJAX API
        function getThucHanhShifts(lmid, callback) {
            if (typeof window.getNhomLopMo === 'function') {
                window.getNhomLopMo('LopThucHanh', lmid, function (data) {
                    callback(data ? (data.LopMoTHs || []) : []);
                });
            } else {
                $.ajax({
                    type: "GET",
                    url: 'Modules/SVDangKyHocPhan/HandlerSVDKHP.ashx',
                    data: { method: 'LopThucHanh', lmid: lmid, dot: 1 },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    cache: false,
                    success: function (result) {
                        callback(result ? (result.LopMoTHs || []) : []);
                    },
                    error: function () {
                        callback([]);
                    }
                });
            }
        }

        // Show Modal Dialog for choosing a Practical Lab Shift matching Portal Fancybox & Obout styling 100%
        function showThModal(courseName, className, thList, onConfirm, onCancel) {
            $('#gpaThModal').remove();

            let rowsHtml = '';
            thList.forEach((th, idx) => {
                let isDefault = (idx === 0) ? 'checked' : '';
                let rowClass = (idx % 2 === 0) ? 'odd' : 'even';
                rowsHtml += `
                <tr class="${rowClass}">
                    <td class="center" style="text-align:center;"><input type="radio" name="gpaThRadio" value="${idx}" ${isDefault} /></td>
                    <td class="center sorting_1">${th.Nhom || ('#' + (idx + 1))}</td>
                    <td class="center">${th.SiSo || 0}</td>
                    <td class="left">${th.DaDK || 0}</td>
                    <td class="left">${th.DiaDiem || 'Linh Trung'}</td>
                    <td class="left">${th.LichHoc || 'Chưa có lịch'}</td>
                </tr>`;
            });

            let modalHtml = `
            <div id="gpaThModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999999; display:flex; align-items:center; justify-content:center;">
                <div style="background:#fff; border:10px solid #666; padding:15px; width:750px; max-width:95%; font-size:13px; font-family:tahoma,arial,sans-serif; box-sizing:border-box; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                    <h1 style="font-size:18px; color:#004b8d; margin-top:0; margin-bottom:10px; font-weight:bold; border-bottom:1px solid #ccc; padding-bottom:8px;">
                        Nhóm Thực Hành - ${courseName} (${className})
                    </h1>
                    <p style="font-size:12px; margin-bottom:10px; color:#333;">Lớp <strong>${className}</strong> có ${thList.length} ca thực hành. Vui lòng chọn 1 nhóm bên dưới:</p>
                    <div style="max-height:260px; overflow-y:auto; margin-bottom:15px; border:1px solid #ccc;">
                        <table cellpadding="0" cellspacing="0" border="0" class="dkhp-table dataTable" style="width:100%; border-collapse:collapse;">
                            <thead>
                                <tr role="row">
                                    <th class="ui-state-default center" style="width:45px;">Chọn</th>
                                    <th class="ui-state-default center" style="width:100px;">Nhóm</th>
                                    <th class="ui-state-default center" style="width:70px;">Sĩ số</th>
                                    <th class="ui-state-default left" style="width:70px;">Đăng Ký</th>
                                    <th class="ui-state-default left" style="width:130px;">Địa Điểm</th>
                                    <th class="ui-state-default left">Lịch Học</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; align-items:center;">
                        <div id="gpaThBtnOk" class="ob_iBCN" style="width:80px; display:inline-block; cursor:pointer;">
                            <div class="ob_iBL"></div>
                            <div class="ob_iBR"></div>
                            <div class="ob_iBC"><div>Xác nhận</div></div>
                            <div class="ob_iBOv"></div>
                        </div>
                        <div id="gpaThBtnCancel" class="ob_iBCN" style="width:70px; display:inline-block; cursor:pointer;">
                            <div class="ob_iBL"></div>
                            <div class="ob_iBR"></div>
                            <div class="ob_iBC"><div>Hủy</div></div>
                            <div class="ob_iBOv"></div>
                        </div>
                    </div>
                </div>
            </div>`;

            $('body').append(modalHtml);

            $('#gpaThBtnOk, #gpaThBtnCancel').on('mouseenter', function () {
                $(this).removeClass('ob_iBCN').addClass('ob_iBCO');
            }).on('mouseleave', function () {
                $(this).removeClass('ob_iBCO ob_iBCP').addClass('ob_iBCN');
            }).on('mousedown', function () {
                $(this).removeClass('ob_iBCO ob_iBCN').addClass('ob_iBCP');
            }).on('mouseup', function () {
                $(this).removeClass('ob_iBCP').addClass('ob_iBCO');
            });

            $('#gpaThBtnOk').one('click', function () {
                let selIdx = parseInt($('input[name="gpaThRadio"]:checked').val()) || 0;
                let selectedTH = thList[selIdx];
                $('#gpaThModal').remove();
                onConfirm({
                    nhom: selectedTH.Nhom || '',
                    scheduleStr: selectedTH.LichHoc || '',
                    diaDiem: selectedTH.DiaDiem || ''
                });
            });

            $('#gpaThBtnCancel').one('click', function () {
                $('#gpaThModal').remove();
                onCancel();
            });
        }

        // Add selection checkboxes to table
        function injectCheckboxes() {
            if ($('#tbPDTKQ thead tr th.tkb-cb-col').length === 0) {
                $('#tbPDTKQ thead tr').prepend('<th class="center ui-state-default tkb-cb-col" style="width:40px;"><div class="DataTables_sort_wrapper">Chọn</div></th>');
            }

            $('#tbPDTKQ tbody tr').each(function () {
                if ($(this).find('.tkb-cb-cell').length === 0) {
                    let tds = $(this).find('td');
                    let maMh = $(tds[0]).text().trim();
                    let tenLop = $(tds[2]).text().trim();
                    let lichHoc = $(tds[7]).text().trim();
                    let classId = maMh + "_" + tenLop + "_" + lichHoc;
                    $(this).attr('data-tkb-id', classId);

                    let isChecked = !!window._gpaSelectedClasses[classId];
                    let cbHtml = `<td class="center tkb-cb-cell" style="width:40px; text-align:center;"><input type="checkbox" class="tkb-class-cb" data-tkb-id="${classId}" ${isChecked ? "checked" : ""} /></td>`;
                    $(this).prepend(cbHtml);
                }
            });
        }

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
            if (typeof $.fn.dataTableExt !== 'undefined' && Array.isArray($.fn.dataTableExt.afnFiltering)) {
                $.fn.dataTableExt.afnFiltering = $.fn.dataTableExt.afnFiltering.filter(fn => fn._isTkbFilter !== true);
            }
            if (typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.ext && Array.isArray($.fn.dataTable.ext.search)) {
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

            if (typeof $.fn.dataTableExt !== 'undefined' && Array.isArray($.fn.dataTableExt.afnFiltering)) {
                $.fn.dataTableExt.afnFiltering.push(customSearchFn);
            } else if (typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.ext && Array.isArray($.fn.dataTable.ext.search)) {
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

        // Re-inject checkboxes & highlights on DataTables sort/redraw
        $(document).off('draw.dt sort.dt', '#tbPDTKQ');
        $(document).on('draw.dt sort.dt', '#tbPDTKQ', function () {
            injectCheckboxes();
            let selectedList = Object.values(window._gpaSelectedClasses || {});
            selectedList.forEach(item => {
                $(`#tbPDTKQ tbody tr[data-tkb-id="${item.id}"]`).addClass('tkb-selected-row');
                $(`#tbPDTKQ tbody tr[data-tkb-id="${item.id}"] .tkb-class-cb`).prop('checked', true);
            });
        });

        // Render Weekly Timetable Grid & Summary Panel
        function renderTkbPanel() {
            if ($('#gpaTkbFieldSet').length === 0) {
                let panelHtml = `
                <fieldset id="gpaTkbFieldSet" style="margin-top: 15px; margin-bottom: 15px; border: 1px solid #CCCCCC; padding: 10px 15px; background: menu;">
                    <legend>Thời khóa biểu</legend>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div id="gpaTkbSummary" style="font-size: 14px; color: #000; font-weight: normal;">
                            Đã chọn: <span id="gpaTkbClassCount" style="font-weight: bold;">0 lớp học</span> | Tổng số tín chỉ: <span id="gpaTkbTotalCredits" style="font-weight: bold;">0 TC</span>
                        </div>
                        <div id="gpaTkbActions">
                            <div id="gpaTkbBtnReset" class="ob_iBCN" style="width: 70px; display: inline-block; cursor: pointer; vertical-align: middle;">
                                <div class="ob_iBL"></div>
                                <div class="ob_iBR"></div>
                                <div class="ob_iBC"><div>Reset</div></div>
                                <div class="ob_iBOv"></div>
                            </div>
                        </div>
                    </div>
                    <div style="overflow-x: auto;">
                        <table id="gpaTkbGrid" style="width: 100%; table-layout: fixed; border-collapse: collapse; background: #fff; text-align: center; font-size: 14px; border: 1px solid #CCCCCC;">
                            <colgroup>
                                <col style="width: 50px;">
                                <col style="width: 15.83%;">
                                <col style="width: 15.83%;">
                                <col style="width: 15.83%;">
                                <col style="width: 15.83%;">
                                <col style="width: 15.83%;">
                                <col style="width: 15.83%;">
                            </colgroup>
                            <thead>
                                <tr style="background: #f2f2f2; height: 28px; font-weight: normal;">
                                    <th style="border: 1px solid #CCCCCC; font-weight: normal;">Tiết</th>
                                    <th style="border: 1px solid #CCCCCC; font-weight: normal;">Thứ 2</th>
                                    <th style="border: 1px solid #CCCCCC; font-weight: normal;">Thứ 3</th>
                                    <th style="border: 1px solid #CCCCCC; font-weight: normal;">Thứ 4</th>
                                    <th style="border: 1px solid #CCCCCC; font-weight: normal;">Thứ 5</th>
                                    <th style="border: 1px solid #CCCCCC; font-weight: normal;">Thứ 6</th>
                                    <th style="border: 1px solid #CCCCCC; font-weight: normal;">Thứ 7</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </fieldset>`;
                $(panelHtml).insertBefore('#ctl00_ContentPlaceHolder1_ctl00_fs_DS_LopMo');
            }

            let selectedList = Object.values(window._gpaSelectedClasses);
            let totalCredits = 0;

            // Map distinct color palette per selected class section (using unique item.id)
            let courseColorMap = {};
            let colorIdx = 0;
            selectedList.forEach(item => {
                let key = item.id || (item.code + '_' + item.className);
                if (!(key in courseColorMap)) {
                    courseColorMap[key] = COURSE_PALETTES[colorIdx % COURSE_PALETTES.length];
                    colorIdx++;
                }
            });

            // Reset table row background styles in #tbPDTKQ
            $('#tbPDTKQ tbody tr').removeClass('tkb-selected-row');

            selectedList.forEach(item => {
                totalCredits += item.credit;
                $(`#tbPDTKQ tbody tr[data-tkb-id="${item.id}"]`).addClass('tkb-selected-row');
            });

            // Update summary text with bolding after colon
            $('#gpaTkbClassCount').text(selectedList.length + ' lớp học');
            $('#gpaTkbTotalCredits').text(totalCredits + ' TC');

            // Build Grid Map for 10 Periods (Tiết 1-10) and Days 2-7
            let gridMap = {};
            let occupied = {};
            for (let d = 2; d <= 7; d++) {
                gridMap[d] = {};
                occupied[d] = {};
                for (let p = 1; p <= 10; p++) {
                    occupied[d][p] = false;
                }
            }

            selectedList.forEach(item => {
                let key = item.id || (item.code + '_' + item.className);
                let palette = courseColorMap[key] || COURSE_PALETTES[0];
                let hasTH = item.hasTH || !!(item.selectedTH && item.selectedTH.scheduleStr);

                // 1. Lecture Schedule
                let schedules = parseSchedule(item.scheduleStr);
                schedules.forEach(s => {
                    if (s.dayNum >= 2 && s.dayNum <= 7) {
                        let start = Math.max(1, Math.floor(s.startPeriod));
                        let end = Math.min(10, Math.floor(s.endPeriod));
                        let span = Math.max(1, end - start + 1);

                        gridMap[s.dayNum][start] = {
                            courseName: item.courseName + (hasTH ? ' [LT]' : ''),
                            className: item.className,
                            room: s.room,
                            span: span,
                            palette: palette
                        };
                    }
                });

                // 2. Selected Practical Shift Schedule (if any)
                if (item.selectedTH && item.selectedTH.scheduleStr) {
                    let thSchedules = parseSchedule(item.selectedTH.scheduleStr);
                    thSchedules.forEach(sTH => {
                        if (sTH.dayNum >= 2 && sTH.dayNum <= 7) {
                            let start = Math.max(1, Math.floor(sTH.startPeriod));
                            let end = Math.min(10, Math.floor(sTH.endPeriod));
                            let span = Math.max(1, end - start + 1);

                            gridMap[sTH.dayNum][start] = {
                                courseName: item.courseName + ' [TH]',
                                className: item.selectedTH.nhom || item.className,
                                room: sTH.room,
                                span: span,
                                palette: palette
                            };
                        }
                    });
                }
            });

            // Generate <tbody> HTML with rowspan
            let tbodyHtml = '';
            for (let p = 1; p <= 10; p++) {
                tbodyHtml += `<tr style="height: 32px;"><td style="border: 1px solid #CCCCCC; font-weight: normal; background: #fafafa;">Tiết ${p}</td>`;
                for (let d = 2; d <= 7; d++) {
                    if (occupied[d][p]) {
                        // Covered by a previous rowspan -> skip cell
                        continue;
                    }

                    let cellData = gridMap[d][p];
                    if (cellData) {
                        let span = cellData.span;
                        let palette = cellData.palette;
                        // Mark upcoming periods as occupied
                        for (let k = p; k < p + span && k <= 10; k++) {
                            occupied[d][k] = true;
                        }
                        tbodyHtml += `<td rowspan="${span}" style="border: 1px solid #CCCCCC; background: ${palette.bg}; color: ${palette.text}; vertical-align: middle; padding: 4px; font-size: 14px; text-align: center; line-height: 1.35; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;">
                            ${cellData.courseName}<br>(${cellData.className})<br><span style="color: ${palette.roomText}; font-size: 11.5px;">${cellData.room}</span>
                        </td>`;
                    } else {
                        tbodyHtml += `<td style="border: 1px solid #CCCCCC;"></td>`;
                    }
                }
                tbodyHtml += `</tr>`;
            }

            $('#gpaTkbGrid tbody').html(tbodyHtml);
        }

        // Initialize & Attach Event Handlers
        injectCheckboxes();
        renderTkbPanel();
        injectFilterBar();

        // Inject Restore History button ONCE on initial launch if saved data exists in LocalStorage
        if (hasRestorableTkbData() && $('#gpaTkbBtnRestore').length === 0) {
            let restoreBtnHtml = `
            <div id="gpaTkbBtnRestore" class="ob_iBCN" style="width: 140px; display: inline-block; margin-left: 10px; cursor: pointer; vertical-align: middle;">
                <div class="ob_iBL"></div>
                <div class="ob_iBR"></div>
                <div class="ob_iBC"><div>Khôi phục lịch sử</div></div>
                <div class="ob_iBOv"></div>
            </div>`;
            $('#gpaTkbActions').append(restoreBtnHtml);
        }

        $(document).off('change', '.tkb-class-cb');
        $(document).on('change', '.tkb-class-cb', function () {
            let classId = $(this).attr('data-tkb-id');
            let row = $(this).closest('tr');
            let tds = row.find('td').not('.tkb-cb-cell');
            let cbEl = $(this);

            if (cbEl.is(':checked')) {
                let newItem = {
                    id: classId,
                    code: $(tds[0]).text().trim(),
                    courseName: $(tds[1]).text().trim(),
                    className: $(tds[2]).text().trim(),
                    credit: parseInt($(tds[3]).text().trim()) || 0,
                    siSo: $(tds[4]).text().trim(),
                    daDk: $(tds[5]).text().trim(),
                    khoa: $(tds[6]).text().trim(),
                    scheduleStr: $(tds[7]).text().trim(),
                    nhomTh: $(tds[8]).text().trim(),
                    nhomBt: $(tds[9]).text().trim(),
                    diaDiem: $(tds[10]).text().trim()
                };

                // Check if this course has Practical Lab Shifts (Nhóm TH)
                let thLink = $(tds[8]).find('a');
                let lmid = '';
                if (thLink.length) {
                    let onclickAttr = thLink.attr('onclick') || '';
                    let match = /showFormDKThucHanh\s*\(\s*["']([^"']+)["']/i.exec(onclickAttr);
                    if (match) {
                        lmid = match[1];
                    }
                }
                newItem.hasTH = !!lmid;

                function processSelection(itemToSelect) {
                    // Check conflict against currently selected classes
                    let selectedList = Object.values(window._gpaSelectedClasses);
                    let hasConflict = false;
                    for (let existingItem of selectedList) {
                        let confRes = checkConflict(itemToSelect, existingItem);
                        if (confRes.conflict) {
                            alert(`Cảnh báo trùng lịch học!\n\nLớp vừa chọn: "${confRes.detailA}"\nbị trùng lịch với lớp đã chọn: "${confRes.detailB}"\nvào ${confRes.dayStr} (${confRes.overlapPeriodStr}).\n\nKhông thể chọn môn này!`);
                            hasConflict = true;
                            break;
                        }
                    }

                    if (hasConflict) {
                        // Block selection: uncheck checkbox & do not save item
                        cbEl.prop('checked', false);
                        return;
                    }

                    window._gpaSelectedClasses[classId] = itemToSelect;
                    saveTkbToLocalStorage();
                    renderTkbPanel();
                }

                if (lmid) {
                    // Fetch TH shifts and prompt user for selection
                    getThucHanhShifts(lmid, function (thList) {
                        if (thList && thList.length > 0) {
                            showThModal(newItem.courseName, newItem.className, thList, function (selectedTH) {
                                newItem.selectedTH = selectedTH;
                                processSelection(newItem);
                            }, function () {
                                // User cancelled modal
                                cbEl.prop('checked', false);
                            });
                        } else {
                            processSelection(newItem);
                        }
                    });
                } else {
                    processSelection(newItem);
                }
            } else {
                delete window._gpaSelectedClasses[classId];
                saveTkbToLocalStorage();
                renderTkbPanel();
            }
        });

        // Button hover styles (Portal ob_iB style)
        $(document).off('mouseenter mouseleave mousedown mouseup', '#gpaTkbBtnReset, #gpaTkbBtnRestore');
        $(document).on('mouseenter', '#gpaTkbBtnReset, #gpaTkbBtnRestore', function () {
            if ($(this).css('opacity') === '0.5') return;
            $(this).removeClass('ob_iBCN').addClass('ob_iBCO');
        }).on('mouseleave', '#gpaTkbBtnReset, #gpaTkbBtnRestore', function () {
            if ($(this).css('opacity') === '0.5') return;
            $(this).removeClass('ob_iBCO ob_iBCP').addClass('ob_iBCN');
        }).on('mousedown', '#gpaTkbBtnReset, #gpaTkbBtnRestore', function () {
            if ($(this).css('opacity') === '0.5') return;
            $(this).removeClass('ob_iBCO ob_iBCN').addClass('ob_iBCP');
        }).on('mouseup', '#gpaTkbBtnReset, #gpaTkbBtnRestore', function () {
            if ($(this).css('opacity') === '0.5') return;
            $(this).removeClass('ob_iBCP').addClass('ob_iBCO');
        });

        // Reset TKB & localStorage của học kỳ hiện tại
        $(document).off('click', '#gpaTkbBtnReset');
        $(document).on('click', '#gpaTkbBtnReset', function (e) {
            e.preventDefault();
            clearTkbFromLocalStorage();
            $('#tbPDTKQ tbody tr').removeClass('tkb-selected-row');
            $('#tbPDTKQ .tkb-class-cb').prop('checked', false);
            $('#gpaTkbBtnRestore').remove();
            renderTkbPanel();
        });

        // Khôi phục lịch sử TKB của học kỳ hiện tại
        $(document).off('click', '#gpaTkbBtnRestore');
        $(document).on('click', '#gpaTkbBtnRestore', function (e) {
            e.preventDefault();
            loadTkbFromLocalStorage();
            let selectedList = Object.values(window._gpaSelectedClasses || {});
            selectedList.forEach(item => {
                $(`#tbPDTKQ tbody tr[data-tkb-id="${item.id}"]`).addClass('tkb-selected-row');
                $(`#tbPDTKQ tbody tr[data-tkb-id="${item.id}"] .tkb-class-cb`).prop('checked', true);
            });
            renderTkbPanel();
            $(this).css({ 'opacity': '0.5', 'cursor': 'not-allowed', 'pointer-events': 'none' }).off('click').click(ev => ev.preventDefault());
        });
    };
})();
