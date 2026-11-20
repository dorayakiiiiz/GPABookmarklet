(function () {
    // Parse schedule string e.g. "T5(1-4)-P.Thông báo sau" or "T3(2-5)-P.cs2:NĐH6.7"
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

    __HCMUS__.schedule = {
        parseSchedule,
        getCampus,
        getScheduleMinutes,
        minutesToHHMM
    };
})();
