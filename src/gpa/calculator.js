(function () {
    __HCMUS__.gpa = __HCMUS__.gpa || {};

    class Calculation {
        constructor(state) {
            this.state = state;
            this.totalCredits = 0;
            this.notPassCredits = 0;
            this.totalScores = 0;
            this.totalFourScores = 0;
            this.notPassTotalScore = 0;
            this.gpa = 0;
            this.fourGPA = 0;
            this.notPassGPA = 0;
            this.removedCoursesSize = 0;
        }

        calculateGPA() {
            const { isCourseInSelectedYears, toFixed } = __HCMUS__.gpa.helpers;
            const state = this.state;
            console.clear();
            let howICalculated = "%c Điểm tính thế nào nhở ?%c \n\n";
            let cssLog = ["font-size:16px", "font-size:normal"];

            this.removedCoursesSize = 0;
            this.activeCoursesCount = 0;

            for (let i = 0; i < state.data.length; i++) {
                let item = state.data[i];
                if (!isCourseInSelectedYears(state, item)) continue;
                this.activeCoursesCount++;

                if (item.include && item.score >= 5 && item.credit > 0) {
                    this.totalCredits += item.credit;
                    this.totalScores += item.credit * item.score;
                    this.totalFourScores += item.credit * item.fourRounding;
                    howICalculated += " " + item.course + ":%c " + item.score + "%c x%c " + item.credit + "%c =%c " + (item.credit * item.score) + "%c \n";
                    cssLog.push("font-weight:bold;");
                    cssLog.push("font-weight:normal;");
                    cssLog.push("font-weight:bold;");
                    cssLog.push("font-weight:normal;");
                    cssLog.push("font-weight:bold;");
                    cssLog.push("font-weight:normal;");
                } else {
                    if (!item.isNoScore && item.score >= 0 && item.score < 5 && item.credit > 0 && !item.isAbsent) {
                        this.notPassCredits += item.credit;
                        this.notPassTotalScore += item.credit * item.score;
                    }
                    howICalculated += "%c " + item.course + ": " + item.score + " x " + item.credit + "%c \n";
                    cssLog.push("color:orange;text-decoration: line-through;");
                    cssLog.push("color:black;");
                }

                if (!item.include) this.removedCoursesSize++;
            }

            this.gpa = this.totalCredits > 0 ? this.totalScores / this.totalCredits : 0;
            this.fourGPA = this.totalCredits > 0 ? this.totalFourScores / this.totalCredits : 0;
            const denom = this.totalCredits + this.notPassCredits;
            this.notPassGPA = denom > 0 ? (this.totalScores + this.notPassTotalScore) / denom : 0;

            console.log("%c \n Chào nhé, GPA nè:\n %c" + toFixed(this.gpa) + "\n", "color:black", "color:blue; font-size: 30px;");
            console.log("%c \n Tổng tín chỉ:\n %c" + this.totalCredits + "\n", "color:black", "color:blue; font-size: 30px;");
            console.log("%c \n Tổng điểm:\n %c" + toFixed(this.totalScores) + "\n", "color:black", "color:blue; font-size: 30px;");
            console.log("%c \n Tổng học phần:\n %c" + this.activeCoursesCount + "\n", "color:black", "color:blue; font-size: 30px;");
            console.log("%c \n Tổng học phần trong GPA:\n %c" + (this.activeCoursesCount - this.removedCoursesSize) + "\n", "color:black", "color:blue; font-size: 30px;");

            howICalculated += "-------------\n" + "GPA : %c " + toFixed(this.totalScores) + " / " + this.totalCredits + " = " + toFixed(this.gpa);
            cssLog.push("font-weight:bold");

            let removedSection = "%c Không bao gồm những học phần sau đây: \n\n%c";
            let removedCss = ["font-size:16px", "font-size:normal"];

            for (let i = 0; i < state.exceptData.length; i++) {
                removedSection += "%c  loại bỏ: %c" + state.exceptData[i].course + " (" + state.exceptData[i].semester + ")" + "\n%c lý do: %c" + state.exceptData[i].whyExclude + "\n\n%c";
                removedCss.push("color:black");
                removedCss.push("color:blue");
                removedCss.push("color:black");
                removedCss.push("color:red");
                removedCss.push("color:black");
            }

            removedSection += "%c  " + this.removedCoursesSize + " học phần đã loại bỏ.%c\n";
            removedCss.push("color:red");
            removedCss.push("color:black");

            console.log(removedSection, ...removedCss);
            console.log(howICalculated, ...cssLog);
        }

        updateTargetPlanner() {
            const { isAllSemestersMode, isCourseInSelectedYears, isCourseInSemesterGpaScope, toFixed } = __HCMUS__.gpa.helpers;
            const state = this.state;
            let resBox = $('#targetGpaResult');
            if (!resBox.length) return;

            let customGpaVal = $('#targetCustomGpaInput').val() ? $('#targetCustomGpaInput').val().trim().replace(',', '.') : "";
            let parsedCustom = parseFloat(customGpaVal);

            let targetGpa = 8.0;
            let targetName = "";

            if (!isNaN(parsedCustom) && parsedCustom > 0 && parsedCustom <= 10) {
                targetGpa = parsedCustom;
                targetName = targetGpa + " điểm";
            } else {
                targetGpa = parseFloat($('#targetDegreeSelect').val()) || 8.0;
                let selText = $("#targetDegreeSelect option:selected").text();
                targetName = selText.split(' (')[0].trim();
                if (!targetName.startsWith("bằng") && !targetName.startsWith("Bằng") && isAllSemestersMode() && (!state.selectedAcademicYears || state.selectedAcademicYears.length === 0)) {
                    targetName = "bằng " + targetName;
                }
            }

            let isFullGraduation = isAllSemestersMode() && (!state.selectedAcademicYears || state.selectedAcademicYears.length === 0);
            if (isFullGraduation) {
                let targetCredits = parseInt($('#targetCreditsInput').val()) || 138;
                let remCredits = targetCredits - this.totalCredits;

                if (remCredits <= 0) {
                    resBox.html('Bạn đã tích lũy đủ ' + this.totalCredits + '/' + targetCredits + ' tín chỉ tốt nghiệp.');
                    return;
                }

                let reqTotalScore = targetCredits * targetGpa;
                let reqRemScore = reqTotalScore - this.totalScores;
                let reqAvgScore = reqRemScore / remCredits;

                if (reqAvgScore > 10.0) {
                    resBox.html('Cần trung bình ' + toFixed(reqAvgScore) + ' điểm/môn cho ' + remCredits + ' TC còn lại (Vượt quá 10.0 - Không đủ khả năng đạt ' + targetName + ').');
                } else if (reqAvgScore <= 0) {
                    resBox.html('Bạn đã đủ điểm đạt ' + targetName + '! Chỉ cần thi qua môn cho ' + remCredits + ' TC còn lại.');
                } else {
                    resBox.html('Để đạt ' + targetName + ', trung bình ' + remCredits + ' TC còn lại bạn cần đạt tối thiểu ' + toFixed(reqAvgScore) + ' điểm/môn.');
                }
            } else {
                let totalScopeCredits = 0;
                let completedScopeCredits = 0;
                let completedScopeScores = 0;

                state.data.forEach(item => {
                    if (!isCourseInSelectedYears(state, item)) return;
                    if (!isCourseInSemesterGpaScope(item)) return;
                    totalScopeCredits += item.credit;
                    if (item.score > 0 || (!item.isAbsent && !item.isNoScore)) {
                        completedScopeCredits += item.credit;
                        completedScopeScores += item.credit * item.score;
                    }
                });

                let remCredits = totalScopeCredits - completedScopeCredits;
                let scopeTitle = (isAllSemestersMode() && state.selectedAcademicYears && state.selectedAcademicYears.length > 0)
                    ? ("năm học " + state.selectedAcademicYears.join(', '))
                    : "học kỳ";

                if (remCredits <= 0) {
                    let scopeGpa = totalScopeCredits > 0 ? completedScopeScores / totalScopeCredits : 0;
                    resBox.html('Tất cả môn trong ' + scopeTitle + ' này đã có điểm (GPA: ' + toFixed(scopeGpa) + ').');
                    return;
                }

                let reqTotalScore = totalScopeCredits * targetGpa;
                let reqRemScore = reqTotalScore - completedScopeScores;
                let reqAvgScore = reqRemScore / remCredits;

                if (reqAvgScore > 10.0) {
                    resBox.html('Cần trung bình ' + toFixed(reqAvgScore) + ' điểm/môn cho ' + remCredits + ' TC chưa có điểm (Vượt quá 10.0 - Không đủ khả năng đạt GPA ' + scopeTitle + ' ' + targetName + ').');
                } else if (reqAvgScore <= 0) {
                    resBox.html('Bạn đã đủ điểm đạt GPA ' + scopeTitle + ' ' + targetName + '! Chỉ cần thi qua môn cho ' + remCredits + ' TC chưa có điểm còn lại.');
                } else {
                    resBox.html('Để đạt GPA ' + scopeTitle + ' ' + targetName + ', trung bình ' + remCredits + ' TC chưa có điểm còn lại bạn cần đạt tối thiểu ' + toFixed(reqAvgScore) + ' điểm/môn.');
                }
            }
        }

        applyRowColors() {
            const state = this.state;
            let allTrs = state.tab.find('tbody tr');
            for (let i = 0; i < allTrs.length; i++) {
                let idAttr = $(allTrs[i]).attr("id");
                let item = state.data.find(d => String(d.id) === String(idAttr));
                if (!item) continue;

                let rowEl = $(allTrs[i]);
                let childEls = rowEl.find('td, a, input, textarea');

                if (!item.include) {
                    if (item.whyExclude.includes("không tính")) {
                        rowEl.css({ "color": "blue", "text-decoration": "line-through" });
                        childEls.css({ "color": "blue", "text-decoration": "line-through" });
                    } else if (item.whyExclude.includes("bỏ chọn")) {
                        rowEl.css({ "color": "grey", "text-decoration": "line-through" });
                        childEls.css({ "color": "grey", "text-decoration": "line-through" });
                    } else {
                        rowEl.css({ "color": "red", "text-decoration": "line-through" });
                        childEls.css({ "color": "red", "text-decoration": "line-through" });
                    }
                } else {
                    if (item.isCustom || item.wasNoScore || item.isEdited || item.whyExclude !== "") {
                        rowEl.css({ "color": "blue", "text-decoration": "none" });
                        childEls.css({ "color": "blue", "text-decoration": "none" });
                    } else {
                        rowEl.css({ "color": "", "text-decoration": "" });
                        childEls.css({ "color": "", "text-decoration": "" });
                    }
                }
            }
        }

        formatCoursesTableAndCreateResultTable() {
            const { getDegreeInfo, toFixed, isAllSemestersMode, isCourseInSemesterGpaScope } = __HCMUS__.gpa.helpers;
            const { getSemesterData, drawGpaChartCanvas } = __HCMUS__.gpa.chart;
            const { applyYearFilterVisibility } = __HCMUS__.gpa.yearFilter;
            const state = this.state;

            let headTr = state.tab.find("thead tr")[0];
            let headTh = $($(headTr).find("th")[0]).clone();

            if (!state.tab.find("th:contains('Trong GPA')").length) {
                let thCb = headTh.clone().attr("title", "Tính hay không tính học phần này trong GPA");
                $(thCb).children().html("Trong GPA");
                $(headTr).prepend(thCb);

                for (let i = 0; i < state.rows.length; i++) {
                    let id = parseInt($(state.rows[i]).attr("id"));
                    let inc = (id && state.data[id - 1]) ? state.data[id - 1].include : false;
                    $(state.rows[i]).prepend('<td class="center gpa-checkbox" style="width:60px;"><input type="checkbox"' + (inc ? " checked " : "") + ' /><div hidden>' + (inc ? 1 : 0) + '</div></td>');
                }
            }

            let parentDiv = $("#lich-thi-dkhp")[0] || $("#aspnetForm")[0];

            // Read values BEFORE removing #tbGPA (same as bookmarklet_old.js)
            let currentTargetDegree = $('#targetDegreeSelect').val() || "8.0";
            let currentCustomGpa = $('#targetCustomGpaInput').val() || "";

            $("#tbGPA").remove();

            let degInfo = getDegreeInfo(this.gpa);
            let badgeText = '<b>' + degInfo.name + '</b>';
            if (degInfo.nextMin) {
                let diff = toFixed(degInfo.nextMin - this.gpa);
                badgeText += ' <span style="font-weight:normal;">(Còn thiếu <b>' + diff + '</b> GPA để đạt ' + degInfo.nextName + ')</span>';
            }

            let targetSectionHtml = '';

            if (isAllSemestersMode()) {
                let currentTargetCredits = $('#targetCreditsInput').val() || "138";
                targetSectionHtml = '<div id="targetGpaSection" style="margin-top: 15px; margin-bottom: 15px; padding: 12px 0; border-top: 1px solid #dce4ec; border-bottom: 1px solid #dce4ec; font-size: 14px; line-height: 1.6;">' +
                    '<div style="font-weight: bold; margin-bottom: 8px; color: #1b486a;">Ước lượng GPA mục tiêu tốt nghiệp:</div>' +
                    '<div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin-bottom: 8px;">' +
                    '<label id="targetCreditsInputWrapper">Tổng TC tốt nghiệp: <input type="number" id="targetCreditsInput" value="' + currentTargetCredits + '" min="1" style="width: 55px; text-align: center; border: 1px solid #c0c0c0; padding: 2px 4px;" /></label>' +
                    '<label><span id="targetDegreeSelectLabel">Mục tiêu bằng:</span> ' +
                    '<select id="targetDegreeSelect" style="border: 1px solid #c0c0c0; padding: 2px 4px;">' +
                    '<option value="9.0"' + (currentTargetDegree === "9.0" ? " selected" : "") + '>Xuất Sắc (&gt;= 9.0 / 3.6)</option>' +
                    '<option value="8.0"' + (currentTargetDegree === "8.0" ? " selected" : "") + '>Giỏi (&gt;= 8.0 / 3.2)</option>' +
                    '<option value="6.5"' + (currentTargetDegree === "6.5" ? " selected" : "") + '>Khá (&gt;= 6.5 / 2.5)</option>' +
                    '<option value="5.0"' + (currentTargetDegree === "5.0" ? " selected" : "") + '>Trung Bình (&gt;= 5.0 / 2.0)</option>' +
                    '</select>' +
                    '</label>' +
                    '<label>Hoặc GPA mục tiêu cụ thể: <input type="text" id="targetCustomGpaInput" value="' + currentCustomGpa + '" placeholder="Vd: 9.5" style="width: 60px; text-align: center; border: 1px solid #c0c0c0; padding: 2px 4px;" /></label>' +
                    '</div>' +
                    '<div id="targetGpaResult" style="margin-top: 6px; font-weight: bold;"></div>' +
                    '</div>';
            } else {
                let semTotalCredits = 0;
                state.data.forEach(item => { if (isCourseInSemesterGpaScope(item)) semTotalCredits += item.credit; });
                targetSectionHtml = '<div id="targetGpaSection" style="margin-top: 15px; margin-bottom: 15px; padding: 12px 0; border-top: 1px solid #dce4ec; border-bottom: 1px solid #dce4ec; font-size: 14px; line-height: 1.6;">' +
                    '<div style="font-weight: bold; margin-bottom: 8px; color: #1b486a;">Ước lượng GPA mục tiêu học kỳ (' + semTotalCredits + ' TC):</div>' +
                    '<div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin-bottom: 8px;">' +
                    '<label>Mục tiêu học kỳ: ' +
                    '<select id="targetDegreeSelect" style="border: 1px solid #c0c0c0; padding: 2px 4px;">' +
                    '<option value="9.0"' + (currentTargetDegree === "9.0" ? " selected" : "") + '>Xuất Sắc (&gt;= 9.0)</option>' +
                    '<option value="8.0"' + (currentTargetDegree === "8.0" ? " selected" : "") + '>Giỏi (&gt;= 8.0)</option>' +
                    '<option value="6.5"' + (currentTargetDegree === "6.5" ? " selected" : "") + '>Khá (&gt;= 6.5)</option>' +
                    '<option value="5.0"' + (currentTargetDegree === "5.0" ? " selected" : "") + '>Trung Bình (&gt;= 5.0)</option>' +
                    '</select>' +
                    '</label>' +
                    '<label>Hoặc GPA mục tiêu cụ thể: <input type="text" id="targetCustomGpaInput" value="' + currentCustomGpa + '" placeholder="Vd: 9.5" style="width: 60px; text-align: center; border: 1px solid #c0c0c0; padding: 2px 4px;" /></label>' +
                    '</div>' +
                    '<div id="targetGpaResult" style="margin-top: 6px; font-weight: bold;"></div>' +
                    '</div>';
            }

            let gpaFieldSet = $('<fieldset id="tbGPA"><legend>Thống kê GPA & Ước lượng mục tiêu</legend><div id="tbGPA_wrapper" class="dataTables_wrapper" role="grid"><table id="tbGPA_table" class="dkhp-table dataTable"><thead></thead><tbody role="alert" aria-live="polite" aria-relevant="all"></tbody></table></div>' + targetSectionHtml + '<p style="margin-top: 10px; color: blue;"><strong>(*)</strong>: Nhấn Ctrl+Shift+I và chọn tab Console để xem chi tiết tính toán.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Biểu đồ biến thiên GPA chỉ hiển thị khi tra cứu ở chế độ Tất cả năm học.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nếu bạn thấy hữu ích, hãy tặng cho tác giả gốc một Star <a href="https://github.com/dtrung98/GPABookmarklet" target="_blank">Tại Đây</a> hoặc <a href="https://github.com/DreamyWanderer/GPABookmarklet_Maintanence" target="_blank">Tại Đây</a> (hoặc tác giả version mới <a href="https://github.com/dorayakiiiiz/GPABookmarklet" target="_blank">Tại Đây</a>) nhé</p></fieldset>');

            let gpaTableHead = $(gpaFieldSet).find("thead")[0];
            let gpaTableBody = $(gpaFieldSet).find("tbody")[0];

            // Always clone a clean TH from main table without DataTable sort icon or fixed 60px width
            const gpaHeadCol1 = $($(headTr).find("th").not(":contains('Trong GPA')")[1] || $(headTr).find("th")[0]).clone();
            $(gpaHeadCol1).attr("title", "Tên mục").attr("style", "text-align: left; padding-left: 10px;").addClass("left").removeClass("sorting sorting_asc sorting_desc");
            $(gpaHeadCol1).html('Tên mục');

            const gpaHeadCol2 = $($(headTr).find("th").not(":contains('Trong GPA')")[0] || $(headTr).find("th")[0]).clone();
            $(gpaHeadCol2).attr("title", "Giá trị").attr("style", "text-align: center; margin: 0; padding: 6px 0;").addClass("center").removeClass("sorting sorting_asc sorting_desc");
            $(gpaHeadCol2).html('Giá trị');

            $(gpaTableHead).empty().append(gpaHeadCol1).append(gpaHeadCol2);

            $(gpaTableBody).empty();
            $(gpaTableBody).append('<tr class="odd"><td class="left">Điểm trung bình tích lũy (GPA)</td><td class="center gpa" id="calGPA"><b>' + toFixed(this.gpa) + '</b></td></tr>');
            $(gpaTableBody).append('<tr class="even"><td class="left">Điểm trung bình tích lũy (GPA) hệ 4</td><td class="center gpa" id="calGPA4"><b>' + toFixed(this.fourGPA) + '</b></td></tr>');
            $(gpaTableBody).append('<tr class="odd"><td class="left">Xếp loại học lực hiện tại</td><td class="center gpa" id="calDegreeBadge">' + badgeText + '</td></tr>');
            $(gpaTableBody).append('<tr class="even"><td class="left">Điểm trung bình học tập</td><td class="center gpa" id="calNotPassGPA">' + toFixed(this.notPassGPA) + '</td></tr>');
            $(gpaTableBody).append('<tr class="odd"><td class="left">Tổng tín chỉ đã tích luỹ</td><td class="center gpa" id="calSumCredit">' + this.totalCredits + ' tín chỉ</td></tr>');
            $(gpaTableBody).append('<tr class="even"><td class="left">Tổng điểm đã tích lũy</td><td class="center gpa" id="sumScore">' + toFixed(this.totalScores) + '</td></tr>');
            let totalCourses = (this.activeCoursesCount !== undefined ? this.activeCoursesCount : state.data.length);
            let inGpaCourses = (totalCourses - this.removedCoursesSize);
            $(gpaTableBody).append('<tr class="odd"><td class="left">Số học phần đã học</td><td class="center gpa" id="sumCourse">' + totalCourses + ' học phần</td></tr>');
            $(gpaTableBody).append('<tr class="even"><td class="left">Số học phần tính trong GPA</td><td class="center gpa" id="sumCalCourse">' + inGpaCourses + ' học phần</td></tr>');

            $(parentDiv).prepend(gpaFieldSet);

            // Render Semester GPA Trend Chart (Only in "All Semesters" mode)
            $('#gpaChartFieldSet').remove();
            if (isAllSemestersMode()) {
                let semData = getSemesterData(state);
                if (semData.length > 0) {
                    let chartFieldSet = $('<fieldset id="gpaChartFieldSet" style="margin-top: 15px;"><legend>Biểu đồ biến thiên GPA qua các học kỳ</legend>' +
                        '<div style="display: flex; justify-content: flex-end; gap: 20px; font-size: 12px; margin-bottom: 10px; font-weight: bold; padding: 0 10px;">' +
                        '<span style="color: #0284c7; display: flex; align-items: center; gap: 4px;"><span style="display:inline-block; width:10px; height:10px; background:#0284c7; border-radius:50%;"></span> GPA Học Kỳ</span>' +
                        '<span style="color: #059669; display: flex; align-items: center; gap: 4px;"><span style="display:inline-block; width:10px; height:10px; background:#059669; border-radius:50%;"></span> GPA Tích Lũy</span>' +
                        '</div>' +
                        '<div style="width: 100%; overflow-x: auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 0; box-sizing: border-box;">' +
                        '<canvas id="gpaTrendCanvas" style="width: 100%; height: 250px; display: block;"></canvas>' +
                        '</div>' +
                        '</fieldset>');

                    chartFieldSet.insertAfter(gpaFieldSet);

                    setTimeout(() => {
                        let canvasEl = $('#gpaTrendCanvas')[0];
                        if (canvasEl) {
                            drawGpaChartCanvas(canvasEl, semData);
                        }
                    }, 50);
                }
            }

            this.updateTargetPlanner();
            if (isAllSemestersMode() && state.selectedAcademicYears && state.selectedAcademicYears.length > 0) {
                $('#targetCreditsInputWrapper').hide();
                $('#targetDegreeSelectLabel').text('Mục tiêu năm học:');
            }

            this.applyRowColors();

            if (isAllSemestersMode()) {
                applyYearFilterVisibility(state);
            }
        }

        // Lightweight update: only refresh numeric values in existing #tbGPA_table
        // without rebuilding the whole fieldset (preserves user target inputs)
        updateGpaStats() {
            const { getDegreeInfo, toFixed, isAllSemestersMode, isCourseInSelectedYears, isCourseInSemesterGpaScope } = __HCMUS__.gpa.helpers;
            const { getSemesterData, drawGpaChartCanvas } = __HCMUS__.gpa.chart;
            const { applyYearFilterVisibility } = __HCMUS__.gpa.yearFilter;
            const state = this.state;

            if ($('#tbGPA').length === 0) {
                // Fieldset not created yet, do full build
                this.formatCoursesTableAndCreateResultTable();
                return;
            }

            let degInfo = getDegreeInfo(this.gpa);
            let badgeText = '<b>' + degInfo.name + '</b>';
            if (degInfo.nextMin) {
                let diff = toFixed(degInfo.nextMin - this.gpa);
                badgeText += ' <span style="font-weight:normal;">(Còn thiếu <b>' + diff + '</b> GPA để đạt ' + degInfo.nextName + ')</span>';
            }

            $('#calGPA').html('<b>' + toFixed(this.gpa) + '</b>');
            $('#calGPA4').html('<b>' + toFixed(this.fourGPA) + '</b>');
            $('#calDegreeBadge').html(badgeText);
            $('#calNotPassGPA').text(toFixed(this.notPassGPA));
            $('#calSumCredit').text(this.totalCredits + ' tín chỉ');
            let totalCourses = (this.activeCoursesCount !== undefined ? this.activeCoursesCount : state.data.length);
            let inGpaCourses = (totalCourses - this.removedCoursesSize);
            $('#sumCourse').text(totalCourses + ' học phần');
            $('#sumCalCourse').text(inGpaCourses + ' học phần');

            // Update semester/year TC label in target section heading
            if (!isAllSemestersMode()) {
                let semTotalCredits = 0;
                state.data.forEach(item => { if (isCourseInSemesterGpaScope(item)) semTotalCredits += item.credit; });
                let heading = $('#targetGpaSection div:first-child');
                if (heading.length) {
                    heading.html('Ước lượng GPA mục tiêu học kỳ (' + semTotalCredits + ' TC):');
                }
            } else if (state.selectedAcademicYears && state.selectedAcademicYears.length > 0) {
                let yearTotalCredits = 0;
                state.data.forEach(item => { if (isCourseInSelectedYears(state, item) && isCourseInSemesterGpaScope(item)) yearTotalCredits += item.credit; });
                let heading = $('#targetGpaSection div:first-child');
                if (heading.length) {
                    heading.html('Ước lượng GPA mục tiêu năm ' + state.selectedAcademicYears.join(', ') + ' (' + yearTotalCredits + ' TC):');
                }
                $('#targetCreditsInputWrapper').hide();
                $('#targetDegreeSelectLabel').text('Mục tiêu năm học:');
            } else {
                let heading = $('#targetGpaSection div:first-child');
                if (heading.length) {
                    heading.html('Ước lượng GPA mục tiêu tốt nghiệp:');
                }
                $('#targetCreditsInputWrapper').show();
                $('#targetDegreeSelectLabel').text('Mục tiêu bằng:');
            }

            this.updateTargetPlanner();

            // Redraw GPA Trend Chart canvas in "All Semesters" mode if present
            if (isAllSemestersMode()) {
                let semData = getSemesterData(state);
                let canvasEl = $('#gpaTrendCanvas')[0];
                if (canvasEl && semData && semData.length > 0) {
                    drawGpaChartCanvas(canvasEl, semData);
                }
            }

            // Update row colors in main courses table
            this.applyRowColors();

            if (isAllSemestersMode()) {
                applyYearFilterVisibility(state);
            }
        }
    }

    __HCMUS__.gpa.Calculation = Calculation;
})();
