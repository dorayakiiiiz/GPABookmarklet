javascript: (function ketQuaDkhpModule() {
    window._initKetQuaDkhp = function () {
        const portalReg = /(new-)?portal\d*\.hcmus\.edu\.vn/i;
        if (!window.location.hostname.match(portalReg)) {
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

        // Parse schedule string e.g. "T7(3-5)" or "T3(2-5)-P.cs2:NĐH6.7"
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

        // Campus detection helper
        function getCampus(s, item) {
            let rm = (s && s.room ? s.room : '').toLowerCase();
            if (rm.includes('cs1')) return 'cs1';
            if (rm.includes('cs2')) return 'cs2';
            let loc = (item && item.diaDiem ? item.diaDiem : '').trim().toUpperCase();
            if (loc === 'NVC') return 'cs1';
            if (loc === 'LT') return 'cs2';
            return 'cs2';
        }

        // Convert period numbers to real-time minutes from 00:00 per campus
        function getScheduleMinutes(s, campus) {
            let startP = s.startPeriod;
            let endP = s.endPeriod;

            if (campus === 'cs1') {
                const CS1_START = { 1: 420, 2: 470, 3: 520, 4: 580, 5: 630, 6: 680, 7: 770, 8: 820, 9: 870, 10: 930, 11: 980, 12: 1030, 13: 1080, 14: 1130, 15: 1180 };
                const CS1_END = { 1: 470, 2: 520, 3: 570, 4: 630, 5: 680, 6: 730, 7: 820, 8: 870, 9: 920, 10: 980, 11: 1030, 12: 1080, 13: 1130, 14: 1180, 15: 1230 };

                let startMin = CS1_START[Math.floor(startP)] || (420 + (startP - 1) * 50);
                let endMin = CS1_END[Math.floor(endP)] || (470 + (endP - 1) * 50);
                return { startMin, endMin };
            } else {
                const CS2_START = { 1: 450, 2: 500, 3: 550, 4: 610, 5: 660, 6: 760, 7: 810, 8: 860, 9: 920, 10: 970 };
                const CS2_END = { 1: 500, 2: 550, 3: 600, 4: 660, 5: 710, 6: 810, 7: 860, 8: 910, 9: 970, 10: 1020 };

                let startMin = CS2_START[Math.floor(startP)];
                let endMin = CS2_END[Math.floor(endP)];

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

                    if (code && courseName && scheduleStr && scheduleStr !== "Chưa có môn học được duyệt.") {
                        let id = 'approved_' + code + '_' + className;
                        courses.push({
                            id: id,
                            code: code,
                            courseName: courseName,
                            className: className,
                            scheduleStr: scheduleStr,
                            tableType: 'approved'
                        });
                    }
                });
            }

            if ($('#tbSVKQ tbody tr').length) {
                $('#tbSVKQ tbody tr').each(function () {
                    let tds = $(this).find('td');
                    if (tds.length < 6) return;
                    let code = $(tds[0]).text().trim();
                    let courseName = $(tds[1]).text().trim();
                    let className = $(tds[2]).text().trim();
                    let scheduleStr = $(tds[5]).text().trim();

                    if (code && courseName && scheduleStr && scheduleStr !== "Sinh viên chưa đăng ký môn học.") {
                        let id = 'registered_' + code + '_' + className;
                        courses.push({
                            id: id,
                            code: code,
                            courseName: courseName,
                            className: className,
                            scheduleStr: scheduleStr,
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

            let panelHtml = `
            <fieldset id="gpaTkbFieldSet" style="margin-top: 15px; margin-bottom: 15px; border: 1px solid #CCCCCC; padding: 10px 15px; background: menu;">
                <legend>Thời khóa biểu</legend>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div id="gpaTkbSummary" style="font-size: 14px; color: #000; font-weight: normal;">
                        Tổng số: <span id="gpaTkbClassCount" style="font-weight: bold;">${courses.length} môn học</span>
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

            let courseColorMap = {};
            let colorIdx = 0;
            courses.forEach(item => {
                let key = item.id || (item.code + '_' + item.className);
                if (!(key in courseColorMap)) {
                    courseColorMap[key] = COURSE_PALETTES[colorIdx % COURSE_PALETTES.length];
                    colorIdx++;
                }
            });

            // Detect campus mix
            let campusSet = new Set();
            courses.forEach(item => {
                let scheds = parseSchedule(item.scheduleStr);
                scheds.forEach(s => {
                    campusSet.add(getCampus(s, item));
                });
            });
            let isMixedCampus = campusSet.has('cs1') && campusSet.has('cs2');

            // Update header column 1
            if (isMixedCampus) {
                $('#gpaTkbGrid thead tr th:first-child').text('Buổi').css('width', '90px');
            } else {
                $('#gpaTkbGrid thead tr th:first-child').text('Tiết').css('width', '50px');
            }

            let tbodyHtml = '';

            if (isMixedCampus) {
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

                        let campusTag = campus === 'cs1' ? 'NVC' : 'LT';
                        let periodText = `Tiết ${s.startPeriod}-${s.endPeriod}`;
                        let timeStr = `${minutesToHHMM(time.startMin)}-${minutesToHHMM(time.endMin)}`;

                        let cardHtml = `
                        <div class="tkb-session-card" style="background: ${palette.bg}; color: ${palette.text}; vertical-align: middle; padding: 5px 4px; font-size: 14px; text-align: center; line-height: 1.35; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; margin: 3px 0; border-radius: 3px;">
                            ${item.courseName}<br>
                            (${item.className})<br>
                            <span style="color: ${palette.roomText}; font-size: 12px;">[${campusTag}] ${s.room}</span><br>
                            <span style="color: ${palette.text}; font-size: 12px;">${periodText} (${timeStr})</span>
                        </div>`;

                        sessionMap[s.dayNum][sessionKey].push(cardHtml);
                    });
                });

                let sessions = [
                    { key: 'morning', label: 'Buổi sáng', timeLabel: '07g00 - 12g10' },
                    { key: 'afternoon', label: 'Buổi chiều', timeLabel: '12g40 - 18g00' }
                ];
                if (hasEveningClass) {
                    sessions.push({ key: 'evening', label: 'Buổi Tối', timeLabel: '18g00 - 20g30' });
                }

                let maxCardsAcrossAll = 1;
                sessions.forEach(sess => {
                    for (let d = 2; d <= 7; d++) {
                        let count = (sessionMap[d][sess.key] || []).length;
                        if (count > maxCardsAcrossAll) maxCardsAcrossAll = count;
                    }
                });

                let uniformRowHeight = Math.max(140, maxCardsAcrossAll * 88);

                sessions.forEach(sess => {
                    tbodyHtml += `<tr style="height: ${uniformRowHeight}px;">
                        <td style="border: 1px solid #CCCCCC; background: #fafafa; vertical-align: middle; padding: 8px 4px; font-size: 14px; line-height: 1.4; text-align: center;">
                            ${sess.label}<br><span style="font-weight: normal; font-size: 12px; color: #666;">${sess.timeLabel}</span>
                        </td>`;
                    for (let d = 2; d <= 7; d++) {
                        let cards = sessionMap[d][sess.key] || [];
                        if (cards.length > 0) {
                            let content = cards.map(c => {
                                if (cards.length === 1) {
                                    return c.replace(
                                        'style="',
                                        'style="height: calc(100% - 6px); display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; '
                                    );
                                }
                                return c;
                            }).join('');
                            tbodyHtml += `<td style="border: 1px solid #CCCCCC; vertical-align: middle; padding: 4px; height: ${uniformRowHeight}px;">${content}</td>`;
                        } else {
                            tbodyHtml += `<td style="border: 1px solid #CCCCCC;"></td>`;
                        }
                    }
                    tbodyHtml += `</tr>`;
                });

            } else {
                let isPureCS1 = campusSet.size === 1 && campusSet.has('cs1');
                let maxPeriods = isPureCS1 ? 12 : 10;

                let gridMap = {};
                let occupied = {};
                for (let d = 2; d <= 7; d++) {
                    gridMap[d] = {};
                    occupied[d] = {};
                    for (let p = 1; p <= maxPeriods; p++) {
                        occupied[d][p] = false;
                    }
                }

                courses.forEach(item => {
                    let key = item.id || (item.code + '_' + item.className);
                    let palette = courseColorMap[key] || COURSE_PALETTES[0];
                    let schedules = parseSchedule(item.scheduleStr);

                    schedules.forEach(s => {
                        if (s.dayNum >= 2 && s.dayNum <= 7) {
                            let start = Math.max(1, Math.floor(s.startPeriod));
                            let end = Math.min(maxPeriods, Math.floor(s.endPeriod));
                            let span = Math.max(1, end - start + 1);

                            gridMap[s.dayNum][start] = {
                                courseName: item.courseName,
                                className: item.className,
                                room: s.room,
                                span: span,
                                palette: palette
                            };
                        }
                    });
                });

                for (let p = 1; p <= maxPeriods; p++) {
                    tbodyHtml += `<tr style="height: 32px;"><td style="border: 1px solid #CCCCCC; font-weight: normal; background: #fafafa;">Tiết ${p}</td>`;
                    for (let d = 2; d <= 7; d++) {
                        if (occupied[d][p]) continue;

                        let cellData = gridMap[d][p];
                        if (cellData) {
                            let span = cellData.span;
                            let palette = cellData.palette;
                            for (let k = p; k < p + span && k <= maxPeriods; k++) {
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
            }

            $('#gpaTkbGrid tbody').html(tbodyHtml);
        }

        renderTkbPanel();
    };
})();
