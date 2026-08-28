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

            if ($('#tbSVKQ tbody tr').length) {
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

                        let campusPrefix = isMixedCampus ? (campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                        let periodText = `Tiết ${s.startPeriod}-${s.endPeriod}`;
                        let timeStr = `${minutesToHHMM(time.startMin)}-${minutesToHHMM(time.endMin)}`;

                        let periodSpan = Math.max(1, (s.endPeriod - s.startPeriod + 1));
                        let isHalf = periodSpan <= 3.5;
                        let isBottomHalf = (sessionKey === 'morning' ? s.startPeriod >= 3.5 : (sessionKey === 'afternoon' ? s.startPeriod >= 8 : s.startPeriod >= 13));

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
                                    let tuanText = '';

                                    let cardHtml = `
                                    <div class="tkb-session-card" style="background: ${cData.palette.bg}; color: ${cData.palette.text}; vertical-align: middle; padding: 4px 3px; font-size: 13px; text-align: center; line-height: 1.3; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; margin: 2px 0; border-radius: 3px;">
                                        ${cData.courseName}<br>
                                        (${cData.className})<br>
                                        <span style="color: ${cData.palette.roomText}; font-size: 11.5px;">${campusPrefix}${cData.room}${tuanText}</span><br>
                                        <span style="color: ${cData.palette.text}; font-size: 11.5px;">${periodText} (${timeStr})</span>
                                    </div>`;

                                    if (cardClusters.length === 1) {
                                        if (cData.isHalf) {
                                            let justify = cData.isBottomHalf ? 'flex-end' : 'flex-start';
                                            return `<div style="height: 100%; display: flex; flex-direction: column; justify-content: ${justify}; box-sizing: border-box;">
                                                ${cardHtml.replace('style="', 'style="min-height: calc(50% - 4px); height: calc(50% - 4px); display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; ')}
                                            </div>`;
                                        } else {
                                            return cardHtml.replace(
                                                'style="',
                                                'style="min-height: calc(100% - 4px); height: calc(100% - 4px); display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; '
                                            );
                                        }
                                    }
                                    return cardHtml;
                                } else {
                                    let mainPalette = cl.items[0].palette;
                                    let isSameTuan = cl.items.length > 1 && cl.items.every(co => co.tuanBD && co.tuanBD === cl.items[0].tuanBD);
                                    let innerRowsHtml = cl.items.map((cData, idx) => {
                                        let campusPrefix = isMixedCampus ? (cData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                                        let periodText = `Tiết ${cData.startPeriod}-${cData.endPeriod}`;
                                        let timeStr = `${minutesToHHMM(cData.startMin)}-${minutesToHHMM(cData.endMin)}`;
                                        let tuanText = (!isSameTuan && cData.tuanBD) ? ` (Tuần BD: ${cData.tuanBD})` : '';
                                        return `
                                            <div style="padding: 2px 0; line-height: 1.3;">
                                                ${cData.courseName}<br>
                                                (${cData.className})<br>
                                                <span style="color: ${cData.palette.roomText}; font-size: 11.5px;">${campusPrefix}${cData.room}${tuanText}</span><br>
                                                <span style="color: ${cData.palette.text}; font-size: 11.5px;">${periodText} (${timeStr})</span>
                                            </div>
                                            ${idx < cl.items.length - 1 ? `<div style="border-top: 1px solid ${mainPalette.text}; margin: 3px 6px; opacity: 0.45;"></div>` : ''}
                                        `;
                                    }).join('');

                                    return `
                                    <div class="tkb-session-card" style="background: ${mainPalette.bg}; color: ${mainPalette.text}; vertical-align: middle; padding: 4px 3px; font-size: 13px; text-align: center; line-height: 1.3; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; margin: 2px 0; border-radius: 3px; min-height: calc(100% - 4px); height: calc(100% - 4px); display: flex; flex-direction: column; justify-content: space-around; box-sizing: border-box;">
                                        ${innerRowsHtml}
                                    </div>`;
                                }
                            }).join('');
                            tbodyHtml += `<td style="border: 1px solid #CCCCCC; vertical-align: top; padding: 4px; height: ${uniformRowHeight}px; box-sizing: border-box;">
                                <div style="display: flex; flex-direction: column; align-items: stretch; justify-content: space-around; height: 100%;">
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
                            tuanBD: item.tuanBD,
                            palette: palette
                        }, campus);
                    });
                });

                let uniformPeriodHeight = 30;
                for (let d = 2; d <= 7; d++) {
                    for (let pKey in gridMap[d]) {
                        let items = gridMap[d][pKey];
                        if (items && items.length > 0) {
                            let maxSpan = Math.max(...items.map(it => it.span));
                            let neededH = items.length === 1 ? (maxSpan * 30) : (items.length * 62 + 8);
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
                        if (occupied[d][p]) continue;

                        let items = gridMap[d][p];
                        if (items && items.length > 0) {
                            let maxSpan = Math.max(...items.map(it => it.span));
                            for (let k = p; k < p + maxSpan && k <= maxPeriods; k++) {
                                occupied[d][k] = true;
                            }

                            if (items.length === 1) {
                                let cellData = items[0];
                                tbodyHtml += `<td rowspan="${cellData.span}" style="border: 1px solid #CCCCCC; background: ${cellData.palette.bg}; color: ${cellData.palette.text}; vertical-align: middle; padding: 4px; font-size: 14px; text-align: center; line-height: 1.35; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; height: ${cellData.span * uniformPeriodHeight}px; box-sizing: border-box;">
                                    ${cellData.courseName}<br>(${cellData.className})<br><span style="color: ${cellData.palette.roomText}; font-size: 11.5px;">${cellData.room}</span>
                                </td>`;
                            } else {
                                let textColor = items[0].palette.text;
                                let isSameTuanBD = items.length > 1 && items.every(it => it.tuanBD && it.tuanBD === items[0].tuanBD);

                                let innerRowsHtml = items.map((cellData, idx) => {
                                    let tuanText = (!isSameTuanBD && cellData.tuanBD) ? ` (Tuần BD: ${cellData.tuanBD})` : '';
                                    return `
                                        <div style="padding: 1px 0; line-height: 1.25;">
                                            ${cellData.courseName}<br>(${cellData.className})<br><span style="color: ${cellData.palette.roomText}; font-size: 11px;">${cellData.room}${tuanText}</span>
                                        </div>
                                        ${idx < items.length - 1 ? `<div style="border-top: 1px solid ${textColor}; margin: 3px 6px; opacity: 0.45;"></div>` : ''}
                                    `;
                                }).join('');

                                tbodyHtml += `<td rowspan="${maxSpan}" style="border: 1px solid #CCCCCC; background: ${items[0].palette.bg}; color: ${textColor}; vertical-align: middle; padding: 4px 3px; font-size: 12.5px; text-align: center; line-height: 1.25; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; height: ${maxSpan * uniformPeriodHeight}px; box-sizing: border-box;">
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

        renderTkbPanel();
    };
})();
