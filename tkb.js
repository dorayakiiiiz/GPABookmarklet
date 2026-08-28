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

        // Extract all schedule items (Lecture, selected Practical shift, selected Exercise shift) for a class
        function getAllSchedules(item) {
            let list = parseSchedule(item.scheduleStr);
            if (item.selectedTH && item.selectedTH.scheduleStr) {
                let thList = parseSchedule(item.selectedTH.scheduleStr);
                thList.forEach(s => { s.isTH = true; s.thNhom = item.selectedTH.nhom; s.subDiaDiem = item.selectedTH.diaDiem; });
                list = list.concat(thList);
            }
            if (item.selectedBT && item.selectedBT.scheduleStr) {
                let btList = parseSchedule(item.selectedBT.scheduleStr);
                btList.forEach(s => { s.isBT = true; s.btNhom = item.selectedBT.nhom; s.subDiaDiem = item.selectedBT.diaDiem; });
                list = list.concat(btList);
            }
            return list;
        }

        // Campus detection helper
        function getCampus(s, item) {
            let rm = (s && s.room ? s.room : '').toLowerCase();
            if (rm.includes('cs1')) return 'cs1';
            if (rm.includes('cs2')) return 'cs2';

            let subLoc = (s && s.subDiaDiem ? s.subDiaDiem : '').trim().toLowerCase();
            if (subLoc) {
                if (subLoc.includes('nguyễn văn cừ') || subLoc.includes('nguyen van cu') || subLoc.includes('nvc') || subLoc.includes('cs1')) return 'cs1';
                if (subLoc.includes('linh trung') || subLoc.includes('lt') || subLoc.includes('cs2')) return 'cs2';
            }

            let loc = (item && item.diaDiem ? item.diaDiem : '').trim().toLowerCase();
            if (loc.includes('nguyễn văn cừ') || loc.includes('nguyen van cu') || loc.includes('nvc') || loc.includes('cs1')) return 'cs1';
            if (loc.includes('linh trung') || loc.includes('lt') || loc.includes('cs2')) return 'cs2';
            return 'cs2';
        }

        // Convert period numbers to real-time minutes from 00:00 per campus
        function getScheduleMinutes(s, campus) {
            let startP = s.startPeriod;
            let endP = s.endPeriod;

            if (campus === 'cs1') {
                // CS1 Nguyễn Văn Cừ (NVC)
                const CS1_START = { 1: 420, 2: 470, 3: 520, 4: 580, 5: 630, 6: 680, 7: 770, 8: 820, 9: 870, 10: 930, 11: 980, 12: 1030, 13: 1080, 14: 1130, 15: 1180 };
                const CS1_END = { 1: 470, 2: 520, 3: 570, 4: 630, 5: 680, 6: 730, 7: 820, 8: 870, 9: 920, 10: 980, 11: 1030, 12: 1080, 13: 1130, 14: 1180, 15: 1230 };

                let startMin = CS1_START[Math.floor(startP)] || (420 + (startP - 1) * 50);
                let endMin = CS1_END[Math.floor(endP)] || (470 + (endP - 1) * 50);
                return { startMin, endMin };
            } else {
                // CS2 Linh Trung (LT)
                const CS2_START = { 1: 450, 2: 500, 3: 550, 4: 610, 5: 660, 6: 760, 7: 810, 8: 860, 9: 920, 10: 970 };
                const CS2_END = { 1: 500, 2: 550, 3: 600, 4: 660, 5: 710, 6: 810, 7: 860, 8: 910, 9: 970, 10: 1020 };

                let startMin = CS2_START[Math.floor(startP)];
                let endMin = CS2_END[Math.floor(endP)];

                // Handle TH/BT ca 2.5 tiết
                if (startP === 1 && endP === 2.5) { startMin = 450; endMin = 575; }
                else if (startP === 3.5 && endP === 5) { startMin = 585; endMin = 710; }
                else if (startP === 6 && endP === 7.5) { startMin = 760; endMin = 885; }
                else if (startP === 8.5 && endP === 10) { startMin = 895; endMin = 1020; }
                else {
                    if (!startMin) startMin = 450 + (startP - 1) * 50;
                    if (!endMin) endMin = 500 + (endP - 1) * 50;
                }

                return { startMin, endMin };
            }
        }

        function minutesToHHMM(m) {
            let hh = Math.floor(m / 60);
            let mm = m % 60;
            return (hh < 10 ? '0' + hh : hh) + 'g' + (mm < 10 ? '0' + mm : mm);
        }

        // Interval overlap check function between two items (real-time minute based across CS1 & CS2)
        function checkConflict(itemA, itemB) {
            let schedA = getAllSchedules(itemA);
            let schedB = getAllSchedules(itemB);

            let hasSubA = itemA.hasTH || itemA.hasBT || !!(itemA.selectedTH && itemA.selectedTH.scheduleStr) || !!(itemA.selectedBT && itemA.selectedBT.scheduleStr);
            let hasSubB = itemB.hasTH || itemB.hasBT || !!(itemB.selectedTH && itemB.selectedTH.scheduleStr) || !!(itemB.selectedBT && itemB.selectedBT.scheduleStr);

            for (let a of schedA) {
                for (let b of schedB) {
                    if (a.dayNum === b.dayNum) {
                        let campusA = getCampus(a, itemA);
                        let campusB = getCampus(b, itemB);

                        let timeA = getScheduleMinutes(a, campusA);
                        let timeB = getScheduleMinutes(b, campusB);

                        // True real-time overlap check:
                        if (timeA.startMin < timeB.endMin && timeB.startMin < timeA.endMin) {
                            let typeA = a.isTH ? ` [TH ${a.thNhom}]` : (a.isBT ? ` [BT ${a.btNhom}]` : (hasSubA ? ' [LT]' : ''));
                            let typeB = b.isTH ? ` [TH ${b.thNhom}]` : (b.isBT ? ` [BT ${b.btNhom}]` : (hasSubB ? ' [LT]' : ''));

                            let overlapPeriodStr = '';
                            if (campusA === campusB) {
                                let startOverlap = Math.max(a.startPeriod, b.startPeriod);
                                let endOverlap = Math.min(a.endPeriod, b.endPeriod);
                                overlapPeriodStr = `Tiết ${startOverlap}-${endOverlap}`;
                            } else {
                                let overlapStart = Math.max(timeA.startMin, timeB.startMin);
                                let overlapEnd = Math.min(timeA.endMin, timeB.endMin);
                                overlapPeriodStr = `${minutesToHHMM(overlapStart)}-${minutesToHHMM(overlapEnd)}`;
                            }

                            return {
                                conflict: true,
                                dayStr: a.dayStr,
                                overlapPeriodStr: overlapPeriodStr,
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

        // Fetch Exercise shifts via Portal Handler AJAX API
        function getBaiTapShifts(lmid, callback) {
            if (typeof window.getNhomLopMo === 'function') {
                window.getNhomLopMo('LopBaiTap', lmid, function (data) {
                    callback(data ? (data.LopMoBTs || []) : []);
                });
            } else {
                $.ajax({
                    type: "GET",
                    url: 'Modules/SVDangKyHocPhan/HandlerSVDKHP.ashx',
                    data: { method: 'LopBaiTap', lmid: lmid, dot: 1 },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    cache: false,
                    success: function (result) {
                        callback(result ? (result.LopMoBTs || []) : []);
                    },
                    error: function () {
                        callback([]);
                    }
                });
            }
        }

        // Show Modal Dialog for choosing a Practical or Exercise Sub-Class Shift matching Portal styling
        function showSubClassModal(typeTitle, courseName, className, list, onConfirm, onCancel) {
            $('#gpaSubClassModal').remove();

            let rowsHtml = '';
            list.forEach((item, idx) => {
                let isDefault = (idx === 0) ? 'checked' : '';
                let rowClass = (idx % 2 === 0) ? 'odd' : 'even';
                rowsHtml += `
                <tr class="${rowClass}">
                    <td class="center" style="text-align:center;"><input type="radio" name="gpaSubRadio" value="${idx}" ${isDefault} /></td>
                    <td class="center sorting_1">${item.Nhom || ('#' + (idx + 1))}</td>
                    <td class="center">${item.SiSo || 0}</td>
                    <td class="left">${item.DaDK || 0}</td>
                    <td class="left">${item.DiaDiem || 'Linh Trung'}</td>
                    <td class="left">${item.LichHoc || 'Chưa có lịch'}</td>
                </tr>`;
            });

            let modalHtml = `
            <div id="gpaSubClassModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999999; display:flex; align-items:center; justify-content:center;">
                <div style="background:#fff; border:10px solid #666; padding:15px; width:750px; max-width:95%; font-size:13px; font-family:tahoma,arial,sans-serif; box-sizing:border-box; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                    <h1 style="font-size:18px; color:#004b8d; margin-top:0; margin-bottom:10px; font-weight:bold; border-bottom:1px solid #ccc; padding-bottom:8px;">
                        ${typeTitle} - ${courseName} (${className})
                    </h1>
                    <p style="font-size:12px; margin-bottom:10px; color:#333;">Lớp <strong>${className}</strong> có ${list.length} ca ${typeTitle.toLowerCase()}. Vui lòng chọn 1 nhóm bên dưới:</p>
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
                        <div id="gpaSubBtnOk" class="ob_iBCN" style="width:80px; display:inline-block; cursor:pointer;">
                            <div class="ob_iBL"></div>
                            <div class="ob_iBR"></div>
                            <div class="ob_iBC"><div>Xác nhận</div></div>
                            <div class="ob_iBOv"></div>
                        </div>
                        <div id="gpaSubBtnCancel" class="ob_iBCN" style="width:70px; display:inline-block; cursor:pointer;">
                            <div class="ob_iBL"></div>
                            <div class="ob_iBR"></div>
                            <div class="ob_iBC"><div>Hủy</div></div>
                            <div class="ob_iBOv"></div>
                        </div>
                    </div>
                </div>
            </div>`;

            $('body').append(modalHtml);

            $('#gpaSubBtnOk, #gpaSubBtnCancel').on('mouseenter', function () {
                $(this).removeClass('ob_iBCN').addClass('ob_iBCO');
            }).on('mouseleave', function () {
                $(this).removeClass('ob_iBCO ob_iBCP').addClass('ob_iBCN');
            }).on('mousedown', function () {
                $(this).removeClass('ob_iBCO ob_iBCN').addClass('ob_iBCP');
            }).on('mouseup', function () {
                $(this).removeClass('ob_iBCP').addClass('ob_iBCO');
            });

            $('#gpaSubBtnOk').one('click', function () {
                let selIdx = parseInt($('input[name="gpaSubRadio"]:checked').val()) || 0;
                let selectedItem = list[selIdx];
                $('#gpaSubClassModal').remove();
                onConfirm({
                    nhom: selectedItem.Nhom || '',
                    scheduleStr: selectedItem.LichHoc || '',
                    diaDiem: selectedItem.DiaDiem || ''
                });
            });

            $('#gpaSubBtnCancel').one('click', function () {
                $('#gpaSubClassModal').remove();
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
                            <label style="font-size: 13px; font-weight: normal; color: #333; cursor: pointer; user-select: none; margin-right: 12px; display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;">
                                <input type="checkbox" id="gpaTkbShiftViewCb" style="vertical-align: middle; margin: 0 3px 0 0;" ${window._gpaTkbShiftView ? 'checked' : ''} /> Xem dưới dạng buổi
                            </label>
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

            $(document).off('change', '#gpaTkbShiftViewCb');
            $(document).on('change', '#gpaTkbShiftViewCb', function () {
                window._gpaTkbShiftViewManual = true;
                window._gpaTkbShiftView = $(this).is(':checked');
                renderTkbPanel();
            });

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

            // Detect if selected classes contain both CS1 and CS2
            let campusSet = new Set();
            let dayP6Map = {};
            selectedList.forEach(item => {
                let scheds = getAllSchedules(item);
                scheds.forEach(s => {
                    let campus = getCampus(s, item);
                    campusSet.add(campus);

                    let d = s.dayNum;
                    if (!dayP6Map[d]) dayP6Map[d] = { cs1: false, cs2: false };
                    if (campus === 'cs1' && s.startPeriod <= 6 && s.endPeriod >= 6) {
                        dayP6Map[d].cs1 = true;
                    }
                    if (campus === 'cs2' && s.startPeriod <= 6 && s.endPeriod >= 6) {
                        dayP6Map[d].cs2 = true;
                    }
                });
            });

            let isMixedCampus = campusSet.has('cs1') && campusSet.has('cs2');
            let isP6Overlap = false;
            for (let d in dayP6Map) {
                if (dayP6Map[d].cs1 && dayP6Map[d].cs2) {
                    isP6Overlap = true;
                    break;
                }
            }

            // Auto-switch to Shift View ONLY when transitioning into a NEW Period 6 overlap
            if (!window._hadP6Overlap && isP6Overlap) {
                window._gpaTkbShiftView = true;
            }

            window._hadP6Overlap = isP6Overlap;

            let isShiftView = !!window._gpaTkbShiftView;

            // Sync checkbox checked property in DOM
            $('#gpaTkbShiftViewCb').prop('checked', isShiftView);

            // Update table header column 1 label depending on mode
            if (isShiftView) {
                $('#gpaTkbGrid thead tr th:first-child').text('Buổi').css('width', '90px');
            } else {
                $('#gpaTkbGrid thead tr th:first-child').text('Tiết').css('width', '50px');
            }

            let tbodyHtml = '';

            if (isShiftView) {
                // Session-based Grid (Buổi Sáng / Buổi Chiều / Buổi Tối) when "Xem dưới dạng buổi" is checked
                let sessionMap = {};
                let hasEveningClass = false;

                for (let d = 2; d <= 7; d++) {
                    sessionMap[d] = { morning: [], afternoon: [], evening: [] };
                }

                selectedList.forEach(item => {
                    let key = item.id || (item.code + '_' + item.className);
                    let palette = courseColorMap[key] || COURSE_PALETTES[0];
                    let hasSub = item.hasTH || item.hasBT || !!(item.selectedTH && item.selectedTH.scheduleStr) || !!(item.selectedBT && item.selectedBT.scheduleStr);

                    function addSessionCard(s, typeTag) {
                        if (s.dayNum < 2 || s.dayNum > 7) return;
                        let campus = getCampus(s, item);
                        let time = getScheduleMinutes(s, campus);
                        let sessionKey = 'morning';
                        if (time.startMin >= 1080) {
                            sessionKey = 'evening';
                            hasEveningClass = true;
                        } else if (time.startMin >= 750) {
                            sessionKey = 'afternoon';
                        }

                        let campusPrefix = isMixedCampus ? (campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                        let periodText = `Tiết ${s.startPeriod}-${s.endPeriod}`;
                        let timeStr = `${minutesToHHMM(time.startMin)}-${minutesToHHMM(time.endMin)}`;

                        let periodSpan = Math.max(1, (s.endPeriod - s.startPeriod + 1));
                        let isHalf = periodSpan <= 3.5;
                        let midPeriod = (campus === 'cs1')
                            ? (sessionKey === 'morning' ? 3.5 : (sessionKey === 'afternoon' ? 9.5 : 14.5))
                            : (sessionKey === 'morning' ? 3 : (sessionKey === 'afternoon' ? 8 : 13));
                        let isBottomHalf = s.startPeriod >= midPeriod;

                        let cardHtml = `
                        <div class="tkb-session-card" style="background: ${palette.bg}; color: ${palette.text}; vertical-align: middle; padding: 4px 3px; font-size: 13px; text-align: center; line-height: 1.3; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; margin: 2px 0; border-radius: 3px;">
                            ${item.courseName}${typeTag}<br>
                            (${item.className})<br>
                            <span style="color: ${palette.roomText}; font-size: 11.5px;">${campusPrefix}${s.room}</span><br>
                            <span style="color: ${palette.text}; font-size: 11.5px;">${periodText} (${timeStr})</span>
                        </div>`;

                        sessionMap[s.dayNum][sessionKey].push({
                            courseName: item.courseName + typeTag,
                            className: item.className,
                            room: s.room,
                            campus: campus,
                            startPeriod: s.startPeriod,
                            endPeriod: s.endPeriod,
                            startMin: time.startMin,
                            endMin: time.endMin,
                            palette: palette,
                            isHalf: isHalf,
                            isBottomHalf: isBottomHalf
                        });
                    }

                    // 1. Lecture
                    let schedules = parseSchedule(item.scheduleStr);
                    schedules.forEach(s => addSessionCard(s, hasSub ? ' [LT]' : ''));

                    // 2. Practical
                    if (item.selectedTH && item.selectedTH.scheduleStr) {
                        let thSchedules = parseSchedule(item.selectedTH.scheduleStr);
                        thSchedules.forEach(sTH => { sTH.isTH = true; sTH.subDiaDiem = item.selectedTH.diaDiem; addSessionCard(sTH, ' [TH]'); });
                    }

                    // 3. Exercise
                    if (item.selectedBT && item.selectedBT.scheduleStr) {
                        let btSchedules = parseSchedule(item.selectedBT.scheduleStr);
                        btSchedules.forEach(sBT => { sBT.isBT = true; sBT.subDiaDiem = item.selectedBT.diaDiem; addSessionCard(sBT, ' [BT]'); });
                    }
                });

                let hasCS1 = campusSet.has('cs1');
                let hasCS2 = campusSet.has('cs2');

                let morningRange = '07g30 - 11g50';
                let afternoonRange = '12g40 - 17g00';
                let eveningRange = '17g30 - 20g00';

                if (hasCS1 && hasCS2) {
                    morningRange = '07g00 - 12g10';
                    afternoonRange = '12g40 - 18g00';
                    eveningRange = '17g30 - 20g30';
                } else if (hasCS1) {
                    morningRange = '07g00 - 12g10';
                    afternoonRange = '12g50 - 18g00';
                    eveningRange = '18g00 - 20g30';
                }

                let sessions = [
                    { key: 'morning', label: 'Buổi sáng', timeLabel: morningRange },
                    { key: 'afternoon', label: 'Buổi chiều', timeLabel: afternoonRange }
                ];
                if (hasEveningClass) {
                    sessions.push({ key: 'evening', label: 'Buổi Tối', timeLabel: eveningRange });
                }

                // Calculate max cards in any single cell across all sessions so all session rows have EQUAL height
                let maxCardsAcrossAll = 1;
                sessions.forEach(sess => {
                    for (let d = 2; d <= 7; d++) {
                        let count = (sessionMap[d][sess.key] || []).length;
                        if (count > maxCardsAcrossAll) maxCardsAcrossAll = count;
                    }
                });

                let uniformRowHeight = Math.max(180, maxCardsAcrossAll * 90);

                sessions.forEach(sess => {
                    tbodyHtml += `<tr style="height: ${uniformRowHeight}px;">
                        <td style="border: 1px solid #CCCCCC; background: #fafafa; vertical-align: middle; padding: 8px 4px; font-size: 14px; line-height: 1.4; text-align: center;">
                            ${sess.label}<br><span style="font-weight: normal; font-size: 12px; color: #666;">${sess.timeLabel}</span>
                        </td>`;
                    for (let d = 2; d <= 7; d++) {
                        let rawCards = sessionMap[d][sess.key] || [];
                        if (rawCards.length > 0) {
                            rawCards.sort((a, b) => a.startMin - b.startMin);

                            let cardClusters = [];
                            rawCards.forEach(card => {
                                let placed = false;
                                for (let cl of cardClusters) {
                                    let hasOverlap = cl.items.some(it => card.startMin < it.endMin && it.startMin < card.endMin);
                                    if (hasOverlap) {
                                        cl.items.push(card);
                                        placed = true;
                                        break;
                                    }
                                }
                                if (!placed) {
                                    cardClusters.push({ items: [card] });
                                }
                            });

                            let clusterHtmls = cardClusters.map(cl => {
                                if (cl.items.length === 1) {
                                    let cData = cl.items[0];
                                    let campusPrefix = isMixedCampus ? (cData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                                    let periodText = `Tiết ${cData.startPeriod}-${cData.endPeriod}`;
                                    let timeStr = `${minutesToHHMM(cData.startMin)}-${minutesToHHMM(cData.endMin)}`;

                                    let cardHtml = `
                                    <div class="tkb-session-card" style="background: ${cData.palette.bg}; color: ${cData.palette.text}; vertical-align: middle; padding: 4px 3px; font-size: 13px; text-align: center; line-height: 1.25; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; margin: 2px 0; border-radius: 3px; box-sizing: border-box;">
                                        <div>${cData.courseName}</div>
                                        <div style="font-size: 12px; opacity: 0.95;">(${cData.className})</div>
                                        <div style="color: ${cData.palette.roomText}; font-size: 11.5px; line-height: 1.15; margin-top: 1px;">${campusPrefix}${cData.room}</div>
                                        <div style="color: ${cData.palette.text}; font-size: 11.5px; line-height: 1.15; margin-top: 1px;">${periodText} (${timeStr})</div>
                                    </div>`;

                                    if (cData.isHalf) {
                                        let justify = cData.isBottomHalf ? 'flex-end' : 'flex-start';
                                        return `<div style="height: 50%; display: flex; flex-direction: column; justify-content: ${justify}; box-sizing: border-box;">
                                            ${cardHtml.replace('style="', 'style="min-height: calc(100% - 4px); height: calc(100% - 4px); display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; ')}
                                        </div>`;
                                    } else {
                                        return `<div style="height: 100%; display: flex; flex-direction: column; justify-content: center; box-sizing: border-box;">
                                            ${cardHtml.replace('style="', 'style="min-height: calc(100% - 4px); height: calc(100% - 4px); display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; ')}
                                        </div>`;
                                    }
                                } else {
                                    let mainPalette = cl.items[0].palette;
                                    let innerRowsHtml = cl.items.map((cData, idx) => {
                                        let campusPrefix = isMixedCampus ? (cData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                                        let periodText = `Tiết ${cData.startPeriod}-${cData.endPeriod}`;
                                        let timeStr = `${minutesToHHMM(cData.startMin)}-${minutesToHHMM(cData.endMin)}`;
                                        return `
                                            <div style="padding: 2px 0; line-height: 1.25;">
                                                <div>${cData.courseName}</div>
                                                <div style="font-size: 12px; opacity: 0.95;">(${cData.className})</div>
                                                <div style="color: ${cData.palette.roomText}; font-size: 11.5px; line-height: 1.15; margin-top: 1px;">${campusPrefix}${cData.room}</div>
                                                <div style="color: ${cData.palette.text}; font-size: 11.5px; line-height: 1.15; margin-top: 1px;">${periodText} (${timeStr})</div>
                                            </div>
                                            ${idx < cl.items.length - 1 ? `<div style="border-top: 1px solid ${mainPalette.text}; margin: 3px 6px; opacity: 0.45;"></div>` : ''}
                                        `;
                                    }).join('');

                                    return `
                                    <div class="tkb-session-card" style="background: ${mainPalette.bg}; color: ${mainPalette.text}; vertical-align: middle; padding: 4px 3px; font-size: 13px; text-align: center; line-height: 1.25; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; margin: 2px 0; border-radius: 3px; min-height: calc(100% - 4px); height: calc(100% - 4px); display: flex; flex-direction: column; justify-content: space-around; box-sizing: border-box;">
                                        ${innerRowsHtml}
                                    </div>`;
                                }
                            }).join('');
                            let justifyCell = 'space-between';
                            if (cardClusters.length === 1 && cardClusters[0].items.length === 1 && cardClusters[0].items[0].isHalf) {
                                justifyCell = cardClusters[0].items[0].isBottomHalf ? 'flex-end' : 'flex-start';
                            }
                            tbodyHtml += `<td style="border: 1px solid #CCCCCC; vertical-align: top; padding: 4px; height: ${uniformRowHeight}px; box-sizing: border-box;">
                                <div style="display: flex; flex-direction: column; align-items: stretch; justify-content: ${justifyCell}; height: 100%;">
                                    ${clusterHtmls}
                                </div>
                            </td>`;
                        } else {
                            tbodyHtml += `<td style="border: 1px solid #CCCCCC;"></td>`;
                        }
                    }
                    tbodyHtml += `</tr>`;
                });

            } else {
                // Standard grid for period selections (12 periods for CS1/NVC, 10 periods for CS2/LT)
                let hasCS1 = campusSet.has('cs1');
                let maxPeriods = hasCS1 ? 12 : 10;

                let gridMap = {};
                let occupied = {};
                for (let d = 2; d <= 7; d++) {
                    gridMap[d] = {};
                    occupied[d] = {};
                    for (let p = 1; p <= maxPeriods; p++) {
                        occupied[d][p] = false;
                    }
                }

                for (let d = 2; d <= 7; d++) {
                    let dayItems = [];

                    selectedList.forEach(item => {
                        let key = item.id || (item.code + '_' + item.className);
                        let palette = courseColorMap[key] || COURSE_PALETTES[0];
                        let hasSub = item.hasTH || item.hasBT || !!(item.selectedTH && item.selectedTH.scheduleStr) || !!(item.selectedBT && item.selectedBT.scheduleStr);

                        // 1. Lecture Schedule
                        let schedules = parseSchedule(item.scheduleStr);
                        schedules.forEach(s => {
                            if (s.dayNum === d) {
                                let campus = getCampus(s, item);
                                let start = Math.max(1, Math.floor(s.startPeriod));
                                let end = Math.min(maxPeriods, Math.floor(s.endPeriod));

                                if (hasCS1 && campus === 'cs2' && s.startPeriod <= 6 && s.endPeriod >= 6) {
                                    start = 7;
                                    end = Math.min(maxPeriods, Math.floor(s.endPeriod) + 1);
                                }

                                dayItems.push({
                                    start: start,
                                    end: end,
                                    courseName: item.courseName + (hasSub ? ' [LT]' : ''),
                                    className: item.className,
                                    room: s.room,
                                    campus: campus,
                                    palette: palette
                                });
                            }
                        });

                        // 2. Practical
                        if (item.selectedTH && item.selectedTH.scheduleStr) {
                            let thSchedules = parseSchedule(item.selectedTH.scheduleStr);
                            thSchedules.forEach(sTH => {
                                sTH.isTH = true;
                                sTH.subDiaDiem = item.selectedTH.diaDiem;
                                if (sTH.dayNum === d) {
                                    let campusTH = getCampus(sTH, item);
                                    let start = Math.max(1, Math.floor(sTH.startPeriod));
                                    let end = Math.min(maxPeriods, Math.floor(sTH.endPeriod));

                                    if (hasCS1 && campusTH === 'cs2' && sTH.startPeriod <= 6 && sTH.endPeriod >= 6) {
                                        start = 7;
                                        end = Math.min(maxPeriods, Math.floor(sTH.endPeriod) + 1);
                                    }

                                    dayItems.push({
                                        start: start,
                                        end: end,
                                        courseName: item.courseName + ' [TH]',
                                        className: item.selectedTH.nhom || item.className,
                                        room: sTH.room,
                                        campus: campusTH,
                                        palette: palette
                                    });
                                }
                            });
                        }

                        // 3. Exercise
                        if (item.selectedBT && item.selectedBT.scheduleStr) {
                            let btSchedules = parseSchedule(item.selectedBT.scheduleStr);
                            btSchedules.forEach(sBT => {
                                sBT.isBT = true;
                                sBT.subDiaDiem = item.selectedBT.diaDiem;
                                if (sBT.dayNum === d) {
                                    let campusBT = getCampus(sBT, item);
                                    let start = Math.max(1, Math.floor(sBT.startPeriod));
                                    let end = Math.min(maxPeriods, Math.floor(sBT.endPeriod));

                                    if (hasCS1 && campusBT === 'cs2' && sBT.startPeriod <= 6 && sBT.endPeriod >= 6) {
                                        start = 7;
                                        end = Math.min(maxPeriods, Math.floor(sBT.endPeriod) + 1);
                                    }

                                    dayItems.push({
                                        start: start,
                                        end: end,
                                        courseName: item.courseName + ' [BT]',
                                        className: item.selectedBT.nhom || item.className,
                                        room: sBT.room,
                                        campus: campusBT,
                                        palette: palette
                                    });
                                }
                            });
                        }
                    });

                    // Sort dayItems by start period ascending
                    dayItems.sort((a, b) => a.start - b.start);

                    // Cluster overlapping items
                    let clusters = [];
                    dayItems.forEach(it => {
                        let placed = false;
                        for (let cl of clusters) {
                            if (it.start <= cl.maxEnd && it.end >= cl.minStart) {
                                cl.items.push(it);
                                cl.minStart = Math.min(cl.minStart, it.start);
                                cl.maxEnd = Math.max(cl.maxEnd, it.end);
                                cl.span = cl.maxEnd - cl.minStart + 1;
                                placed = true;
                                break;
                            }
                        }
                        if (!placed) {
                            clusters.push({
                                minStart: it.start,
                                maxEnd: it.end,
                                span: it.end - it.start + 1,
                                items: [it]
                            });
                        }
                    });

                    clusters.forEach(cl => {
                        cl.items.forEach(it => { it.span = cl.span; });
                        gridMap[d][cl.minStart] = cl.items;
                    });
                }

                let uniformPeriodHeight = 32;
                for (let d = 2; d <= 7; d++) {
                    for (let pKey in gridMap[d]) {
                        let items = gridMap[d][pKey];
                        if (items && items.length > 0) {
                            let maxSpan = Math.max(...items.map(it => it.span));
                            let neededH = items.length === 1 ? (maxSpan * 32) : (items.length * 62 + 8);
                            let reqH = Math.ceil(neededH / maxSpan);
                            if (reqH > uniformPeriodHeight) {
                                uniformPeriodHeight = reqH;
                            }
                        }
                    }
                }

                for (let p = 1; p <= maxPeriods; p++) {
                    tbodyHtml += `<tr style="height: ${uniformPeriodHeight}px;"><td style="border: 1px solid #CCCCCC; font-weight: normal; background: #fafafa; height: ${uniformPeriodHeight}px; vertical-align: middle;">Tiết ${p}</td>`;
                    for (let d = 2; d <= 7; d++) {
                        if (occupied[d][p]) {
                            continue;
                        }

                        let items = gridMap[d][p];
                        if (items && items.length > 0) {
                            let maxSpan = Math.max(...items.map(it => it.span));
                            for (let k = p; k < p + maxSpan && k <= maxPeriods; k++) {
                                occupied[d][k] = true;
                            }

                            if (items.length === 1) {
                                let cellData = items[0];
                                let campusPrefix = isMixedCampus ? (cellData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                                tbodyHtml += `<td rowspan="${cellData.span}" style="border: 1px solid #CCCCCC; background: ${cellData.palette.bg}; color: ${cellData.palette.text}; vertical-align: middle; padding: 4px; font-size: 14px; text-align: center; line-height: 1.35; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; height: ${cellData.span * uniformPeriodHeight}px; box-sizing: border-box;">
                                    ${cellData.courseName}<br>(${cellData.className})<br><span style="color: ${cellData.palette.roomText}; font-size: 11.5px;">${campusPrefix}${cellData.room}</span>
                                </td>`;
                            } else {
                                let innerRowsHtml = items.map((cellData, idx) => {
                                    let campusPrefix = isMixedCampus ? (cellData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                                    return `
                                        <div style="padding: 1px 0; line-height: 1.25;">
                                            ${cellData.courseName}<br>(${cellData.className})<br><span style="color: ${cellData.palette.roomText}; font-size: 11px;">${campusPrefix}${cellData.room}</span>
                                        </div>
                                        ${idx < items.length - 1 ? `<div style="border-top: 1px solid ${items[0].palette.text}; margin: 3px 6px; opacity: 0.45;"></div>` : ''}
                                    `;
                                }).join('');

                                tbodyHtml += `<td rowspan="${maxSpan}" style="border: 1px solid #CCCCCC; background: ${items[0].palette.bg}; color: ${items[0].palette.text}; vertical-align: middle; padding: 4px 3px; font-size: 12.5px; text-align: center; line-height: 1.25; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; height: ${maxSpan * uniformPeriodHeight}px; box-sizing: border-box;">
                                    <div style="display: flex; flex-direction: column; justify-content: space-around; height: 100%; box-sizing: border-box;">
                                        ${innerRowsHtml}
                                    </div>
                                </td>`;
                            }
                        } else {
                            tbodyHtml += `<td style="border: 1px solid #CCCCCC; height: ${uniformPeriodHeight}px;"></td>`;
                        }
                    }
                    tbodyHtml += `</tr>`;
                }
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

        function disableTkbRestoreBtn() {
            let btn = $('#gpaTkbBtnRestore');
            if (btn.length && btn.css('opacity') !== '0.5') {
                btn.css({ 'opacity': '0.5', 'cursor': 'not-allowed', 'pointer-events': 'none' })
                    .off('click')
                    .on('click', ev => ev.preventDefault());
            }
        }

        $(document).off('change', '.tkb-class-cb');
        $(document).on('change', '.tkb-class-cb', function () {
            disableTkbRestoreBtn();
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

                // Check max 25 credits limit
                let currentSelectedList = Object.values(window._gpaSelectedClasses);
                let currentTotalCredits = currentSelectedList.reduce((sum, item) => sum + (item.credit || 0), 0);
                if (currentTotalCredits + newItem.credit > 25) {
                    alert(`Không thể chọn môn này!\n\nSố tín chỉ đã chọn hiện tại: ${currentTotalCredits} TC.\nMôn vừa chọn (${newItem.courseName}) có ${newItem.credit} TC.\n\nNếu chọn thêm sẽ thành ${currentTotalCredits + newItem.credit} TC, vượt quá giới hạn tối đa 25 tín chỉ cho phép trong một học kỳ!`);
                    cbEl.prop('checked', false);
                    return;
                }

                // Check if this course has Practical Lab Shifts (Nhóm TH - tds[8])
                let thLink = $(tds[8]).find('a');
                let thLmid = '';
                if (thLink.length) {
                    let onclickAttr = thLink.attr('onclick') || '';
                    let match = /showFormDKThucHanh\s*\(\s*["']([^"']+)["']/i.exec(onclickAttr);
                    if (match) {
                        thLmid = match[1];
                    }
                }
                newItem.hasTH = !!thLmid;

                // Check if this course has Exercise Shifts (Nhóm BT - tds[9])
                let btLink = $(tds[9]).find('a');
                let btLmid = '';
                if (btLink.length) {
                    let onclickAttr = btLink.attr('onclick') || '';
                    let match = /showFormDKBaiTap\s*\(\s*["']([^"']+)["']/i.exec(onclickAttr);
                    if (match) {
                        btLmid = match[1];
                    }
                }
                newItem.hasBT = !!btLmid;

                function processSelection(itemToSelect) {
                    // Check max 25 credits limit
                    let selectedList = Object.values(window._gpaSelectedClasses);
                    let totalCreds = selectedList.reduce((sum, item) => sum + (item.credit || 0), 0);
                    if (totalCreds + (itemToSelect.credit || 0) > 25) {
                        alert(`Không thể chọn môn này!\n\nSố tín chỉ đã chọn hiện tại: ${totalCreds} TC.\nMôn vừa chọn (${itemToSelect.courseName}) có ${itemToSelect.credit} TC.\n\nNếu chọn thêm sẽ thành ${totalCreds + itemToSelect.credit} TC, vượt quá giới hạn tối đa 25 tín chỉ cho phép trong một học kỳ!`);
                        cbEl.prop('checked', false);
                        return;
                    }

                    // Check conflict against currently selected classes
                    let conflicts = [];
                    for (let existingItem of selectedList) {
                        let confRes = checkConflict(itemToSelect, existingItem);
                        if (confRes.conflict) {
                            conflicts.push({ existingItem, confRes });
                        }
                    }

                    if (conflicts.length > 0) {
                        // Check if any conflicting slot already has 2 courses (adding itemToSelect would make 3 courses)
                        let isThirdCourse = false;
                        if (conflicts.length >= 2) {
                            isThirdCourse = true;
                        } else {
                            let existingConf = conflicts[0].existingItem;
                            for (let otherItem of selectedList) {
                                if (otherItem.id !== existingConf.id) {
                                    let otherCheck = checkConflict(existingConf, otherItem);
                                    if (otherCheck.conflict) {
                                        isThirdCourse = true;
                                        break;
                                    }
                                }
                            }
                        }

                        if (isThirdCourse) {
                            let conf = conflicts[0];
                            alert(`Cảnh báo trùng lịch học!\n\nLớp vừa chọn: "${conf.confRes.detailA}"\nbị trùng lịch với lớp đã chọn: "${conf.confRes.detailB}"\nvào ${conf.confRes.dayStr} (${conf.confRes.overlapPeriodStr}).\n\nKhông thể chọn môn này!`);
                            cbEl.prop('checked', false);
                            return;
                        }

                        let conf = conflicts[0];
                        let isConfirmed = confirm(`Cảnh báo trùng lịch học!\n\nLớp vừa chọn: "${conf.confRes.detailA}"\nbị trùng lịch với lớp đã chọn: "${conf.confRes.detailB}"\nvào ${conf.confRes.dayStr} (${conf.confRes.overlapPeriodStr}).\n\nBạn có muốn vẫn chọn môn này không? (Dành cho các môn học nối tiếp nhau)`);
                        if (!isConfirmed) {
                            cbEl.prop('checked', false);
                            return;
                        }
                    }

                    window._gpaSelectedClasses[classId] = itemToSelect;
                    saveTkbToLocalStorage();
                    renderTkbPanel();
                }

                function handleBtSelection(itemWithTH) {
                    if (btLmid) {
                        getBaiTapShifts(btLmid, function (btList) {
                            if (btList && btList.length > 0) {
                                showSubClassModal('Nhóm Bài Tập', itemWithTH.courseName, itemWithTH.className, btList, function (selectedBT) {
                                    itemWithTH.selectedBT = selectedBT;
                                    processSelection(itemWithTH);
                                }, function () {
                                    // User cancelled BT modal
                                    cbEl.prop('checked', false);
                                });
                            } else {
                                processSelection(itemWithTH);
                            }
                        });
                    } else {
                        processSelection(itemWithTH);
                    }
                }

                if (thLmid) {
                    getThucHanhShifts(thLmid, function (thList) {
                        if (thList && thList.length > 0) {
                            showSubClassModal('Nhóm Thực Hành', newItem.courseName, newItem.className, thList, function (selectedTH) {
                                newItem.selectedTH = selectedTH;
                                handleBtSelection(newItem);
                            }, function () {
                                // User cancelled TH modal
                                cbEl.prop('checked', false);
                            });
                        } else {
                            handleBtSelection(newItem);
                        }
                    });
                } else {
                    handleBtSelection(newItem);
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
            delete window._hadP6Overlap;
            delete window._gpaTkbShiftView;
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
            delete window._hadP6Overlap;
            delete window._gpaTkbShiftView;
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
