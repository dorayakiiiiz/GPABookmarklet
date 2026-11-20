(function () {
    __HCMUS__.gpa = __HCMUS__.gpa || {};

    function getSemesterData(state) {
        const { isCourseInSelectedYears, toFixed } = __HCMUS__.gpa.helpers;
        let semMap = {};
        state.data.forEach(item => {
            if (!isCourseInSelectedYears(state, item)) return;
            if (!item.include || !item.credit || item.score <= 0 || item.semester === '-' || !item.semester) return;
            let sem = item.semester.trim();
            if (!semMap[sem]) {
                semMap[sem] = { totalCredits: 0, totalScores: 0 };
            }
            semMap[sem].totalCredits += item.credit;
            semMap[sem].totalScores += item.credit * item.score;
        });

        let semesters = Object.keys(semMap);
        semesters.sort((a, b) => {
            let partsA = a.split('/');
            let partsB = b.split('/');
            let yearA = partsA[0] || a;
            let yearB = partsB[0] || b;
            if (yearA !== yearB) return yearA.localeCompare(yearB);
            let semA = parseInt(partsA[1]) || 0;
            let semB = parseInt(partsB[1]) || 0;
            return semA - semB;
        });

        let runningCredits = 0;
        let runningScores = 0;
        let result = [];

        semesters.forEach(sem => {
            let d = semMap[sem];
            let semGpa = d.totalCredits > 0 ? d.totalScores / d.totalCredits : 0;
            runningCredits += d.totalCredits;
            runningScores += d.totalScores;
            let cumGpa = runningCredits > 0 ? runningScores / runningCredits : 0;
            result.push({
                semester: sem,
                semGpa: toFixed(semGpa),
                cumGpa: toFixed(cumGpa),
                credits: d.totalCredits
            });
        });

        return result;
    }

    function drawGpaChartCanvas(canvas, semData) {
        if (!canvas || !semData || semData.length === 0) return;
        let ctx = canvas.getContext('2d');
        let dpr = window.devicePixelRatio || 1;
        let rect = canvas.getBoundingClientRect();
        let width = rect.width || 700;
        let height = 250;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, width, height);

        let paddingLeft = 45;
        let paddingRight = 30;
        let paddingTop = 35;
        let paddingBottom = 35;

        let chartWidth = width - paddingLeft - paddingRight;
        let chartHeight = height - paddingTop - paddingBottom;

        let minGpa = 4.0;
        semData.forEach(d => {
            if (d.semGpa < minGpa) minGpa = Math.max(0, Math.floor(d.semGpa - 0.5));
            if (d.cumGpa < minGpa) minGpa = Math.max(0, Math.floor(d.cumGpa - 0.5));
        });
        let maxGpa = 10.0;

        function getX(index) {
            if (semData.length === 1) return paddingLeft + chartWidth / 2;
            return paddingLeft + (index / (semData.length - 1)) * chartWidth;
        }

        function getY(gpa) {
            let ratio = (gpa - minGpa) / (maxGpa - minGpa);
            return paddingTop + chartHeight - ratio * chartHeight;
        }

        // Draw horizontal grid lines
        let gridLevels = [5.0, 6.5, 8.0, 9.0, 10.0].filter(v => v >= minGpa);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#e5e7eb';
        ctx.fillStyle = '#6b7280';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        gridLevels.forEach(val => {
            let y = getY(val);
            ctx.beginPath();
            ctx.setLineDash([3, 3]);
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(width - paddingRight, y);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillText(val.toFixed(1), paddingLeft - 6, y);
        });

        // X axis labels
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        semData.forEach((d, i) => {
            let x = getX(i);
            ctx.fillStyle = '#374151';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(d.semester, x, height - paddingBottom + 6);
        });

        // Function to draw line & dots
        function drawSeries(key, strokeColor, fillColor, labelOffset) {
            if (semData.length === 0) return;

            // Area fill
            if (fillColor && semData.length > 1) {
                ctx.beginPath();
                semData.forEach((d, i) => {
                    let x = getX(i);
                    let y = getY(d[key]);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                let lastX = getX(semData.length - 1);
                let firstX = getX(0);
                let bottomY = getY(minGpa);
                ctx.lineTo(lastX, bottomY);
                ctx.lineTo(firstX, bottomY);
                ctx.closePath();
                ctx.fillStyle = fillColor;
                ctx.fill();
            }

            // Line
            ctx.beginPath();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = strokeColor;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            semData.forEach((d, i) => {
                let x = getX(i);
                let y = getY(d[key]);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Dots & Values
            semData.forEach((d, i) => {
                let x = getX(i);
                let y = getY(d[key]);

                ctx.beginPath();
                ctx.arc(x, y, 4.5, 0, Math.PI * 2);
                ctx.fillStyle = strokeColor;
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#ffffff';
                ctx.stroke();

                ctx.fillStyle = strokeColor;
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(d[key].toFixed(2), x, y + labelOffset);
            });
        }

        // Draw Semester GPA Line (Blue)
        let blueGrad = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
        blueGrad.addColorStop(0, 'rgba(2, 132, 199, 0.12)');
        blueGrad.addColorStop(1, 'rgba(2, 132, 199, 0.0)');
        drawSeries('semGpa', '#0284c7', blueGrad, -12);

        // Draw Cumulative GPA Line (Green)
        drawSeries('cumGpa', '#059669', null, 12);
    }

    __HCMUS__.gpa.chart = {
        getSemesterData,
        drawGpaChartCanvas
    };
})();
