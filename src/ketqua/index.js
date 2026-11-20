(function ketQuaDkhpModule() {
    window._initKetQuaDkhp = function () {
        const { PORTAL_HOST_REG, COURSE_PALETTES } = __HCMUS__.constants;
        const { parseSchedule, getCampus, getScheduleMinutes } = __HCMUS__.schedule;
        const { renderShiftViewBody, renderPeriodViewBody } = __HCMUS__.timetableGrid;

        if (!window.location.hostname.match(PORTAL_HOST_REG)) {
            alert("Vui lòng sử dụng Tool trên website HCMUS Portal!");
            return;
        }

        const pidReg = /pid=212/i;
        if (!window.location.href.match(pidReg)) {
            alert("Vui lòng đi tới trang \"Kết quả ĐKHP\" trước");
            return;
        }

        let tabApproved = $("#tbPDTKQ");
        let tabRegistered = $("#tbSVKQ");
        if (!tabApproved.length && !tabRegistered.length) return;

        // Fix layout widths
        $('<style>#page-body{display:flex!important;align-items:stretch!important}#page-body-menu{height:auto!important;min-height:100%!important;flex-shrink:0!important}#page-body-content{flex-grow:1!important;min-width:0!important}#tbPDTKQ, #tbSVKQ{width:100%!important;margin:0!important}.ob_iBOv{display:none!important}</style>').appendTo('head');

        // Interval overlap check function between two items
        function checkConflict(itemA, itemB) {
            let schedA = parseSchedule(itemA.scheduleStr);
            let schedB = parseSchedule(itemB.scheduleStr);

            for (let a of schedA) {
                for (let b of schedB) {
                    if (a.dayNum === b.dayNum) {
                        let campusA = getCampus(a, itemA);
                        let campusB = getCampus(b, itemB);

                        let timeA = getScheduleMinutes(a, campusA);
                        let timeB = getScheduleMinutes(b, campusB);

                        if (timeA.startMin < timeB.endMin && timeB.startMin < timeA.endMin) {
                            let isSameWeek = !!(itemA.tuanBD && itemB.tuanBD && itemA.tuanBD === itemB.tuanBD);
                            return {
                                conflict: true,
                                isSameWeek: isSameWeek,
                                dayStr: a.dayStr,
                                detailA: itemA.courseName + ' (' + itemA.className + ')',
                                detailB: itemB.courseName + ' (' + itemB.className + ')'
                            };
                        }
                    }
                }
            }
            return { conflict: false };
        }

        // Collect all course objects from page tables
        function collectPageCourses() {
            let courses = [];

            if ($('#tbPDTKQ tbody tr').length) {
                $('#tbPDTKQ tbody tr').each(function () {
                    let tds = $(this).find('td');
                    if (tds.length < 5) return;
                    let code = $(tds[0]).text().trim();
                    let courseName = $(tds[1]).text().trim();
                    let className = $(tds[2]).text().trim();
                    let scheduleStr = $(tds[4]).text().trim();
                    let tuanBD = tds.length >= 6 ? $(tds[5]).text().trim() : '';

                    if (code && courseName && scheduleStr && scheduleStr !== "Chưa có môn học được duyệt.") {
                        let id = 'approved_' + code + '_' + className;
                        courses.push({
                            id: id,
                            code: code,
                            courseName: courseName,
                            className: className,
                            scheduleStr: scheduleStr,
                            tuanBD: tuanBD,
                            tableType: 'approved'
                        });
                    }
                });
            }

            if (courses.length === 0 && $('#tbSVKQ tbody tr').length) {
                $('#tbSVKQ tbody tr').each(function () {
                    let tds = $(this).find('td');
                    if (tds.length < 6) return;
                    let code = $(tds[0]).text().trim();
                    let courseName = $(tds[1]).text().trim();
                    let className = $(tds[2]).text().trim();
                    let scheduleStr = $(tds[5]).text().trim();
                    let tuanBD = tds.length >= 7 ? $(tds[6]).text().trim() : '';

                    if (code && courseName && scheduleStr && scheduleStr !== "Sinh viên chưa đăng ký môn học.") {
                        let id = 'registered_' + code + '_' + className;
                        courses.push({
                            id: id,
                            code: code,
                            courseName: courseName,
                            className: className,
                            scheduleStr: scheduleStr,
                            tuanBD: tuanBD,
                            tableType: 'registered'
                        });
                    }
                });
            }

            return courses;
        }

        // Render Weekly Timetable Grid & Summary Panel
        function renderTkbPanel() {
            $('#gpaTkbFieldSet').remove();

            let courses = collectPageCourses();

            // Detect real conflicts (same start week)
            let realWarnings = [];
            for (let i = 0; i < courses.length; i++) {
                for (let j = i + 1; j < courses.length; j++) {
                    let conf = checkConflict(courses[i], courses[j]);
                    if (conf.conflict && conf.isSameWeek) {
                        realWarnings.push(`Cảnh báo: Môn ${conf.detailA} và ${conf.detailB} bị trùng lịch học và cùng tuần bắt đầu vào ${conf.dayStr}. Sinh viên lưu ý nguy cơ trùng lịch thi!`);
                    }
                }
            }

            let warningHtml = '';
            if (realWarnings.length > 0) {
                let warningList = realWarnings.map(w => `<div style="margin-bottom: 8px;">${w}</div>`).join('');
                warningHtml = `<div style="color: #ff3232ff; font-size: 16px; margin-bottom: 10px; line-height: 1.4;">${warningList}</div>`;
            }

            let panelHtml = `
            <fieldset id="gpaTkbFieldSet" style="margin-top: 15px; margin-bottom: 15px; border: 1px solid #CCCCCC; padding: 10px 15px; background: menu;">
                <legend>Thời khóa biểu</legend>
                ${warningHtml}
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div id="gpaTkbSummary" style="font-size: 14px; color: #000; font-weight: normal;">
                        Tổng số: <span id="gpaTkbClassCount" style="font-weight: bold;">${courses.length} môn học</span>
                    </div>
                    <div id="gpaTkbActions">
                        <label style="font-size: 13px; font-weight: normal; color: #333; cursor: pointer; user-select: none; margin-right: 4px; display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;">
                            <input type="checkbox" id="gpaTkbShiftViewCb" style="vertical-align: middle; margin: 0 3px 0 0;" ${window._gpaTkbShiftView ? 'checked' : ''} /> Xem dưới dạng buổi
                        </label>
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

            if ($('#ketqua-dkhp').length) {
                $(panelHtml).insertBefore('#ketqua-dkhp');
            } else if ($('#ctl00_ContentPlaceHolder1_ctl00_fs_DS_Mon_DaDuyet').length) {
                $(panelHtml).insertBefore('#ctl00_ContentPlaceHolder1_ctl00_fs_DS_Mon_DaDuyet');
            } else {
                $('#page-body-content').prepend(panelHtml);
            }

            $(document).off('change', '#gpaTkbShiftViewCb');
            $(document).on('change', '#gpaTkbShiftViewCb', function () {
                window._gpaTkbShiftViewManual = true;
                window._gpaTkbShiftView = $(this).is(':checked');
                renderTkbPanel();
            });

            let courseColorMap = {};
            let colorIdx = 0;
            courses.forEach(item => {
                let key = item.id || (item.code + '_' + item.className);
                if (!(key in courseColorMap)) {
                    courseColorMap[key] = COURSE_PALETTES[colorIdx % COURSE_PALETTES.length];
                    colorIdx++;
                }
            });

            // Detect campus mix & period 6 overlap on same day
            let campusSet = new Set();
            let dayP6Map = {};
            courses.forEach(item => {
                let scheds = parseSchedule(item.scheduleStr);
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

            if (!window._hadP6Overlap && isP6Overlap) {
                window._gpaTkbShiftView = true;
            }

            window._hadP6Overlap = isP6Overlap;

            let isShiftView = !!window._gpaTkbShiftView;

            // Sync checkbox checked property in DOM
            $('#gpaTkbShiftViewCb').prop('checked', isShiftView);

            // Update header column 1
            if (isShiftView) {
                $('#gpaTkbGrid thead tr th:first-child').text('Buổi').css('width', '90px');
            } else {
                $('#gpaTkbGrid thead tr th:first-child').text('Tiết').css('width', '50px');
            }

            let tbodyHtml = '';

            if (isShiftView) {
                let sessionMap = {};
                let hasEveningClass = false;

                for (let d = 2; d <= 7; d++) {
                    sessionMap[d] = { morning: [], afternoon: [], evening: [] };
                }

                courses.forEach(item => {
                    let key = item.id || (item.code + '_' + item.className);
                    let palette = courseColorMap[key] || COURSE_PALETTES[0];
                    let schedules = parseSchedule(item.scheduleStr);

                    schedules.forEach(s => {
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

                        let periodSpan = Math.max(1, (s.endPeriod - s.startPeriod + 1));
                        let isHalf = periodSpan <= 3.5;
                        let midPeriod = (campus === 'cs1')
                            ? (sessionKey === 'morning' ? 3.5 : (sessionKey === 'afternoon' ? 9.5 : 14.5))
                            : (sessionKey === 'morning' ? 3 : (sessionKey === 'afternoon' ? 8 : 13));
                        let isBottomHalf = s.startPeriod >= midPeriod;

                        sessionMap[s.dayNum][sessionKey].push({
                            courseName: item.courseName,
                            className: item.className,
                            room: s.room,
                            campus: campus,
                            startPeriod: s.startPeriod,
                            endPeriod: s.endPeriod,
                            startMin: time.startMin,
                            endMin: time.endMin,
                            palette: palette,
                            tuanBD: item.tuanBD,
                            isHalf: isHalf,
                            isBottomHalf: isBottomHalf
                        });
                    });
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

                tbodyHtml = renderShiftViewBody({
                    sessionMap,
                    sessions,
                    isMixedCampus,
                    showTuanBD: true
                });

            } else {
                let hasCS1 = campusSet.has('cs1');
                let maxPeriods = hasCS1 ? 12 : 10;

                let gridMap = {};
                for (let d = 2; d <= 7; d++) {
                    gridMap[d] = {};
                }

                function addCellToGrid(dayNum, startP, endP, data, campus) {
                    if (dayNum < 2 || dayNum > 7) return;
                    let start = Math.max(1, Math.floor(startP));
                    let end = Math.min(maxPeriods, Math.floor(endP));

                    if (hasCS1 && campus === 'cs2' && startP <= 6 && endP >= 6) {
                        start = 7;
                        end = Math.min(maxPeriods, Math.floor(endP) + 1);
                    }

                    let span = Math.max(1, end - start + 1);
                    data.start = start;
                    data.end = end;
                    data.span = span;

                    let placed = false;
                    for (let pKey in gridMap[dayNum]) {
                        let existingItems = gridMap[dayNum][pKey];
                        for (let ex of existingItems) {
                            if (start <= ex.end && ex.start <= end) {
                                gridMap[dayNum][pKey].push(data);
                                placed = true;
                                break;
                            }
                        }
                        if (placed) break;
                    }

                    if (!placed) {
                        if (!gridMap[dayNum][start]) gridMap[dayNum][start] = [];
                        gridMap[dayNum][start].push(data);
                    }
                }

                courses.forEach(item => {
                    let key = item.id || (item.code + '_' + item.className);
                    let palette = courseColorMap[key] || COURSE_PALETTES[0];
                    let schedules = parseSchedule(item.scheduleStr);

                    schedules.forEach(s => {
                        let campus = getCampus(s, item);
                        addCellToGrid(s.dayNum, s.startPeriod, s.endPeriod, {
                            courseName: item.courseName,
                            className: item.className,
                            room: s.room,
                            campus: campus,
                            tuanBD: item.tuanBD,
                            palette: palette
                        }, campus);
                    });
                });

                tbodyHtml = renderPeriodViewBody({
                    gridMap,
                    maxPeriods,
                    isMixedCampus,
                    basePeriodHeight: 30,
                    showTuanBD: true
                });
            }

            $('#gpaTkbGrid tbody').html(tbodyHtml);
        }

        renderTkbPanel();
    };
})();
