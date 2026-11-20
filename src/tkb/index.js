(function () {
    window._initTimetablePlanner = function () {
        const { PORTAL_HOST_REG, PORTAL_LAYOUT_FIX_CSS, COURSE_PALETTES } = __HCMUS__.constants;
        const { parseSchedule, getCampus, getScheduleMinutes, minutesToHHMM } = __HCMUS__.schedule;
        const {
            analyzeCampusAndShiftMode,
            getShiftCardMeta,
            buildSessionDefinitions,
            renderShiftViewBody,
            renderPeriodViewBody
        } = __HCMUS__.timetableGrid;
        const { saveTkbToLocalStorage, loadTkbFromLocalStorage, clearTkbFromLocalStorage, hasRestorableTkbData } = __HCMUS__.tkbStorage;
        const { getThucHanhShifts, getBaiTapShifts, showSubClassModal } = __HCMUS__.tkbSubClass;
        const { injectFilterBar } = __HCMUS__.tkbFilter;

        if (!window.location.hostname.match(PORTAL_HOST_REG)) {
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
        $('<style>' + PORTAL_LAYOUT_FIX_CSS + '#tbPDTKQ{width:100%!important;margin:0!important}.tkb-selected-row{background-color:#e0f2fe!important}.ob_iBOv{display:none!important}</style>').appendTo('head');

        // Storage for selected classes (per semester)
        window._gpaSelectedClasses = {};

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

        function forEachTkbRowById(id, cb) {
            $('#tbPDTKQ tbody tr').each(function () {
                if ($(this).attr('data-tkb-id') === id) {
                    cb($(this));
                }
            });
        }

        // Re-inject checkboxes & highlights on DataTables sort/redraw
        $(document).off('draw.dt sort.dt', '#tbPDTKQ');
        $(document).on('draw.dt sort.dt', '#tbPDTKQ', function () {
            injectCheckboxes();
            let selectedList = Object.values(window._gpaSelectedClasses || {});
            selectedList.forEach(item => {
                forEachTkbRowById(item.id, function ($row) {
                    $row.addClass('tkb-selected-row');
                    $row.find('.tkb-class-cb').prop('checked', true);
                });
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
                forEachTkbRowById(item.id, function ($row) {
                    $row.addClass('tkb-selected-row');
                });
            });

            // Update summary text with bolding after colon
            $('#gpaTkbClassCount').text(selectedList.length + ' lớp học');
            $('#gpaTkbTotalCredits').text(totalCredits + ' TC');

            // Detect if selected classes contain both CS1 and CS2
            const { campusSet, isMixedCampus, isShiftView } = analyzeCampusAndShiftMode(
                selectedList,
                getAllSchedules
            );

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
                        let { time, sessionKey, isHalf, isBottomHalf } = getShiftCardMeta(s, campus);
                        if (sessionKey === 'evening') hasEveningClass = true;

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

                let sessions = buildSessionDefinitions(campusSet, hasEveningClass);

                tbodyHtml = renderShiftViewBody({
                    sessionMap,
                    sessions,
                    isMixedCampus,
                    showTuanBD: false
                });

            } else {
                // Standard grid for period selections (12 periods for CS1/NVC, 10 periods for CS2/LT)
                let hasCS1 = campusSet.has('cs1');
                let maxPeriods = hasCS1 ? 12 : 10;

                let gridMap = {};
                for (let d = 2; d <= 7; d++) {
                    gridMap[d] = {};
                }

                for (let d = 2; d <= 7; d++) {
                    let dayItems = [];

                    selectedList.forEach(item => {
                        let key = item.id || (item.code + '_' + item.className);
                        let palette = courseColorMap[key] || COURSE_PALETTES[0];
                        let hasSub = item.hasTH || item.hasBT || !!(item.selectedTH && item.selectedTH.scheduleStr) || !!(item.selectedBT && item.selectedBT.scheduleStr);

                        getAllSchedules(item).forEach(s => {
                            if (s.dayNum !== d) return;
                            let campus = getCampus(s, item);
                            let start = Math.max(1, Math.floor(s.startPeriod));
                            let end = Math.min(maxPeriods, Math.floor(s.endPeriod));

                            if (hasCS1 && campus === 'cs2' && s.startPeriod <= 6 && s.endPeriod >= 6) {
                                start = 7;
                                end = Math.min(maxPeriods, Math.floor(s.endPeriod) + 1);
                            }

                            let courseLabel = s.isTH
                                ? item.courseName + ' [TH]'
                                : (s.isBT ? item.courseName + ' [BT]' : item.courseName + (hasSub ? ' [LT]' : ''));
                            let classLabel = s.isTH
                                ? (item.selectedTH.nhom || item.className)
                                : (s.isBT ? (item.selectedBT.nhom || item.className) : item.className);

                            dayItems.push({
                                start: start,
                                end: end,
                                courseName: courseLabel,
                                className: classLabel,
                                room: s.room,
                                campus: campus,
                                palette: palette
                            });
                        });
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

                tbodyHtml = renderPeriodViewBody({
                    gridMap,
                    maxPeriods,
                    isMixedCampus,
                    basePeriodHeight: 32,
                    showTuanBD: false
                });
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

        function exceedsMaxCredits(courseName, credit) {
            let selectedList = Object.values(window._gpaSelectedClasses);
            let currentTotal = selectedList.reduce((sum, item) => sum + (item.credit || 0), 0);
            let addCredit = credit || 0;
            if (currentTotal + addCredit > 25) {
                alert(`Không thể chọn môn này!\n\nSố tín chỉ đã chọn hiện tại: ${currentTotal} TC.\nMôn vừa chọn (${courseName}) có ${addCredit} TC.\n\nNếu chọn thêm sẽ thành ${currentTotal + addCredit} TC, vượt quá giới hạn tối đa 25 tín chỉ cho phép trong một học kỳ!`);
                return true;
            }
            return false;
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
                if (exceedsMaxCredits(newItem.courseName, newItem.credit)) {
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
                    if (exceedsMaxCredits(itemToSelect.courseName, itemToSelect.credit)) {
                        cbEl.prop('checked', false);
                        return;
                    }
                    let selectedList = Object.values(window._gpaSelectedClasses);

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
                forEachTkbRowById(item.id, function ($row) {
                    $row.addClass('tkb-selected-row');
                    $row.find('.tkb-class-cb').prop('checked', true);
                });
            });
            renderTkbPanel();
            $(this).css({ 'opacity': '0.5', 'cursor': 'not-allowed', 'pointer-events': 'none' }).off('click').click(ev => ev.preventDefault());
        });
    };
})();
