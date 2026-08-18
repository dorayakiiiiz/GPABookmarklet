javascript: (function gpa() {
    const LOGO_BASE64 = "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";

    const currentHref = window.location.href;
    const dkhpReg = /(new-)?portal([1-9]|)\.hcmus\.edu\.vn\/SinhVien\.aspx\?(.*)pid=211/i;
    if (!currentHref.match(dkhpReg)) {
        const portalReg = /(new-)?portal([1-9]|)\.hcmus\.edu\.vn/i;
        if (currentHref.match(portalReg)) {
            alert("Vui lòng đi tới trang \"Tra cứu kết quả học tập\" trước");
        }
        return;
    }

    let tab = $("#tbDiemThiGK");
    if (!tab.length) return;

    // Fix Left Navbar White Gap on Scroll & Fix Table Side Indentation
    $('<style>#page-body{display:flex!important;align-items:stretch!important}#page-body-menu{height:auto!important;min-height:100%!important;flex-shrink:0!important}#page-body-content{flex-grow:1!important;min-width:0!important}#tbDiemThiGK{width:100%!important;margin:0!important}</style>').appendTo('head');

    let exceptData = [];
    let data = [];
    let rows = null;
    let isRunBookmarkAgain = false;

    function toFixed(num) {
        return Math.round(num * 1000) / 1000;
    }

    function getDegreeInfo(gpa) {
        if (gpa >= 9.0) return { name: "Xuất Sắc", minGpa: 9.0, nextMin: null, nextName: null };
        if (gpa >= 8.0) return { name: "Giỏi", minGpa: 8.0, nextMin: 9.0, nextName: "Xuất Sắc" };
        if (gpa >= 6.5) return { name: "Khá", minGpa: 6.5, nextMin: 8.0, nextName: "Giỏi" };
        if (gpa >= 5.0) return { name: "Trung Bình", minGpa: 5.0, nextMin: 6.5, nextName: "Khá" };
        return { name: "Yếu / Kém", minGpa: 0, nextMin: 5.0, nextName: "Trung Bình" };
    }

    function isAllSemestersMode() {
        let yearInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi_ob_CbocboNamHoc_gvDKHPLichThiTB').val() || "").trim();
        let yearVal = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi').val() || "").trim();
        return yearVal === "0" || yearInput.includes("Tất cả") || yearInput.includes("tất cả");
    }

    function initUserCourseData() {
        const exceptCourses = [
            "Anh văn",
            "Giáo dục quốc phòng",
            "Thể dục",
            "Tin học cơ sở",
            "Tin hoc co so",
            "Anh van",
            "Giao duc quoc phong",
            "The duc"
        ];

        rows = tab.find("tbody tr");
        data = [];
        exceptData = [];

        for (let i = 0; i < rows.length; i++) {
            const tds = $(rows[i]).find("td").not(".gpa-checkbox");
            const rawScoreText = $(tds[5]).text().trim().normalize();
            const parsedScore = parseFloat(rawScoreText.replace(',', '.'));
            const isAbsent = rawScoreText === "Vắng";
            const isNoScore = (isNaN(parsedScore) && !isAbsent) || rawScoreText === "" || rawScoreText === "-";

            let row = {
                id: i + 1,
                semester: $(tds[0]).text().trim().normalize(),
                course: $(tds[1]).text().trim().normalize(),
                credit: parseInt($(tds[2]).text().trim().normalize()) || 0,
                class: $(tds[3]).text().trim().normalize(),
                ldcode: $(tds[4]).text().trim().normalize(),
                score: !isNaN(parsedScore) ? parsedScore : 0,
                note: $(tds[6]).text().trim().normalize(),
                include: true,
                whyExclude: "",
                isAbsent: isAbsent,
                isNoScore: isNoScore,
                letter: "",
                fourRounding: 0
            };

            $(rows[i]).attr("id", row.id);

            if (!row.credit) {
                row.include = false;
                row.whyExclude += "Học phần không tín chỉ. ";
            } else if (row.isAbsent) {
                row.score = 0;
                row.include = false;
                row.whyExclude += "Vắng thi (chưa qua môn). ";
            } else if (row.isNoScore) {
                row.score = 0;
                row.include = false;
                row.whyExclude += "Chưa hoặc không có điểm. ";
            } else if (row.score < 5) {
                row.include = false;
                row.whyExclude += "Điểm nhỏ hơn 5, chưa qua môn. ";
            }

            for (let j = 0; j < exceptCourses.length; j++) {
                if (row.course.includes(exceptCourses[j])) {
                    row.include = false;
                    row.whyExclude += "Học phần không tính trong GPA. ";
                    break;
                }
            }

            for (let j = 0; j < data.length; j++) {
                if (data[j].course === row.course) {
                    data[j].include = false;
                    data[j].whyExclude = "Đã học lại. ";
                }
            }

            data.push(row);
            if (!row.include) exceptData.push(row);
        }
    }

    function addSupplementaryGrade() {
        let supplementaryGrade = [
            { score: 9, letter: "A+", fourRounding: 4.0 },
            { score: 8, letter: "A.", fourRounding: 3.5 },
            { score: 7, letter: "B+", fourRounding: 3.0 },
            { score: 6, letter: "B.", fourRounding: 2.5 },
            { score: 5, letter: "C.", fourRounding: 2.0 },
            { score: 4, letter: "D+", fourRounding: 1.5 },
            { score: 3, letter: "D.", fourRounding: 1.0 },
            { score: 0, letter: "F.", fourRounding: 0.0 }
        ];

        data.forEach(item => {
            if (item.score >= 0) {
                const lowerGrade = supplementaryGrade.find(grade => item.score >= grade.score);
                const upperGrade = supplementaryGrade.find(grade => item.score < grade.score);

                if (lowerGrade && upperGrade) {
                    const scoreDiff = upperGrade.score - lowerGrade.score;
                    const ratio = (item.score - lowerGrade.score) / scoreDiff;
                    item.letter = lowerGrade.letter;
                    item.fourRounding = toFixed(lowerGrade.fourRounding + ratio * (upperGrade.fourRounding - lowerGrade.fourRounding));
                } else {
                    item.letter = "A+";
                    item.fourRounding = 4.0;
                }
            }
        });

        // Insert headers if not present, cloning exact TH structure for gray gradient background
        if ($('#tbDiemThiGK thead tr th:contains("Thang chữ")').length === 0) {
            let thTemplate = $('#tbDiemThiGK thead tr th:eq(5)').clone();

            let thLetter = thTemplate.clone().attr("title", "Thang chữ");
            if (thLetter.find('.DataTables_sort_wrapper').length) {
                thLetter.find('.DataTables_sort_wrapper').html('Thang chữ<span class="DataTables_sort_icon css_right ui-icon ui-icon-carat-2-n-s"></span>');
            } else {
                thLetter.html('Thang chữ');
            }
            $('#tbDiemThiGK thead tr th:eq(5)').after(thLetter);

            let thFour = thTemplate.clone().attr("title", "Thang 4");
            if (thFour.find('.DataTables_sort_wrapper').length) {
                thFour.find('.DataTables_sort_wrapper').html('Thang 4<span class="DataTables_sort_icon css_right ui-icon ui-icon-carat-2-n-s"></span>');
            } else {
                thFour.html('Thang 4');
            }
            $('#tbDiemThiGK thead tr th:eq(6)').after(thFour);

            $('#tbDiemThiGK tbody tr').each(function () {
                let id = parseInt($(this).attr("id"));
                let letterGrade = (id && data[id - 1]) ? data[id - 1].letter : "";
                let fourRounding = (id && data[id - 1]) ? data[id - 1].fourRounding : 0;
                $('td:eq(5)', this).after('<td class="center gpa-letter-col">' + letterGrade + '</td><td class="center gpa-four-col">' + fourRounding + '</td>');
            });
        }

        // Update values in existing letter and grade 4 columns
        $('#tbDiemThiGK tbody tr').each(function () {
            let id = parseInt($(this).attr("id"));
            if (id && data[id - 1]) {
                $(this).find('.gpa-letter-col').text(data[id - 1].letter);
                $(this).find('.gpa-four-col').text(data[id - 1].fourRounding);
            }
        });
    }

    function renderEditableScoreCells() {
        $('#tbDiemThiGK tbody tr').each(function () {
            let id = parseInt($(this).attr("id"));
            if (!id || !data[id - 1]) return;
            let item = data[id - 1];

            let scoreTd = $(this).find("td").not(".gpa-checkbox").eq(5);
            if (!scoreTd.find(".gpa-score-input").length) {
                let valStr = (item.score > 0 || (!item.isAbsent && !item.isNoScore)) ? item.score : "";
                scoreTd.css({ 'text-align': 'center' });
                scoreTd.html(
                    '<div hidden>' + item.score + '</div>' +
                    '<input type="text" class="gpa-score-input" data-id="' + item.id + '" value="' + valStr + '" placeholder="-" title="Nhập/sửa điểm" style="width: 45px; text-align: center; border: 1px solid #c0c0c0; background: #ffffff; color: inherit; font-family: inherit; font-size: inherit; padding: 1px 2px;" />'
                );
            }
        });
    }

    class Calculation {
        constructor() {
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
            console.clear();

            let howICalculated = "%c Điểm tính thế nào nhở ?%c \n\n";
            let cssLog = ["font-size:16px", "font-size:normal"];

            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (item.include) {
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
                    if (item.whyExclude.includes("5")) {
                        this.notPassCredits += item.credit;
                        this.notPassTotalScore += item.credit * item.score;
                    }
                    howICalculated += "%c " + item.course + ": " + item.score + " x " + item.credit + "%c \n";
                    cssLog.push("color:orange;text-decoration: line-through;");
                    cssLog.push("color:black;");
                }
            }

            this.gpa = this.totalCredits > 0 ? this.totalScores / this.totalCredits : 0;
            this.fourGPA = this.totalCredits > 0 ? this.totalFourScores / this.totalCredits : 0;
            const denom = this.totalCredits + this.notPassCredits;
            this.notPassGPA = denom > 0 ? (this.totalScores + this.notPassTotalScore) / denom : 0;

            this.removedCoursesSize = 0;
            for (let i = 0; i < data.length; i++) {
                if (!data[i].include) this.removedCoursesSize++;
            }

            console.log("%c \n Chào nhé, GPA nè:\n %c" + toFixed(this.gpa) + "\n", "color:black", "color:blue; font-size: 30px;");
            console.log("%c \n Tổng tín chỉ:\n %c" + this.totalCredits + "\n", "color:black", "color:blue; font-size: 30px;");
            console.log("%c \n Tổng điểm:\n %c" + toFixed(this.totalScores) + "\n", "color:black", "color:blue; font-size: 30px;");
            console.log("%c \n Tổng học phần:\n %c" + data.length + "\n", "color:black", "color:blue; font-size: 30px;");
            console.log("%c \n Tổng học phần trong GPA:\n %c" + (data.length - this.removedCoursesSize) + "\n", "color:black", "color:blue; font-size: 30px;");

            howICalculated += "-------------\n" + "GPA : %c " + toFixed(this.totalScores) + " / " + this.totalCredits + " = " + toFixed(this.gpa);
            cssLog.push("font-weight:bold");

            let removedSection = "%c Không bao gồm những học phần sau đây: \n\n%c";
            let removedCss = ["font-size:16px", "font-size:normal"];

            for (let i = 0; i < exceptData.length; i++) {
                removedSection += "%c  loại bỏ: %c" + exceptData[i].course + " (" + exceptData[i].semester + ")" + "\n%c lý do: %c" + exceptData[i].whyExclude + "\n\n%c";
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
            if (!isAllSemestersMode()) return;

            let customGpaVal = $('#targetCustomGpaInput').val() ? $('#targetCustomGpaInput').val().trim().replace(',', '.') : "";
            let parsedCustom = parseFloat(customGpaVal);

            let targetGpa = 8.0;
            let targetName = "";

            if (!isNaN(parsedCustom) && parsedCustom > 0 && parsedCustom <= 10) {
                targetGpa = parsedCustom;
                targetName = targetGpa + " điểm";
            } else {
                targetGpa = parseFloat($('#targetDegreeSelect').val()) || 8.0;
                targetName = $("#targetDegreeSelect option:selected").text().split(' (')[0].trim();
                if (!targetName.startsWith("bằng") && !targetName.startsWith("Bằng")) {
                    targetName = "bằng " + targetName;
                }
            }

            let targetCredits = parseInt($('#targetCreditsInput').val()) || 138;
            let remCredits = targetCredits - this.totalCredits;
            let resBox = $('#targetGpaResult');

            if (!resBox.length) return;

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
        }

        formatCoursesTableAndCreateResultTable() {
            let headTr = tab.find("thead tr")[0];
            let headTh = $($(headTr).find("th")[0]).clone();

            if (!isRunBookmarkAgain && !tab.find("th:contains('Trong GPA')").length) {
                isRunBookmarkAgain = true;
                let thCb = headTh.clone().attr("title", "Tính hay không tính học phần này trong GPA");
                $(thCb).children().html("Trong GPA");
                $(headTr).prepend(thCb);

                for (let i = 0; i < rows.length; i++) {
                    let id = parseInt($(rows[i]).attr("id"));
                    let inc = (id && data[id - 1]) ? data[id - 1].include : false;
                    $(rows[i]).prepend('<td class="center gpa-checkbox" style="width:60px;"><input type="checkbox"' + (inc ? " checked " : "") + ' /><div hidden>' + (inc ? 1 : 0) + '</div></td>');
                }
            }

            let parentDiv = $("#lich-thi-dkhp")[0] || $("#aspnetForm")[0];

            // Preserve user target inputs if already entered
            let currentTargetCredits = $('#targetCreditsInput').val() || "138";
            let currentTargetDegree = $('#targetDegreeSelect').val() || "8.0";
            let currentCustomGpa = $('#targetCustomGpaInput').val() || "";

            $("#tbGPA").remove();

            let degInfo = getDegreeInfo(this.gpa);
            let badgeText = '<b>' + degInfo.name + '</b>';
            if (degInfo.nextMin) {
                let diff = toFixed(degInfo.nextMin - this.gpa);
                badgeText += ' <span style="font-weight:normal;">(Còn thiếu <b>' + diff + '</b> GPA để đạt ' + degInfo.nextName + ')</span>';
            }

            let showTargetPlanner = isAllSemestersMode();
            let targetSectionHtml = '';
            if (showTargetPlanner) {
                targetSectionHtml = '<div id="targetGpaSection" style="margin-top: 15px; margin-bottom: 15px; padding: 12px 0; border-top: 1px solid #dce4ec; border-bottom: 1px solid #dce4ec; font-size: 14px; line-height: 1.6;">' +
                    '<div style="font-weight: bold; margin-bottom: 8px; color: #1b486a;">Ước lượng GPA mục tiêu tốt nghiệp:</div>' +
                    '<div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin-bottom: 8px;">' +
                    '<label>Tổng TC tốt nghiệp: <input type="number" id="targetCreditsInput" value="' + currentTargetCredits + '" min="1" style="width: 55px; text-align: center; border: 1px solid #c0c0c0; padding: 2px 4px;" /></label>' +
                    '<label>Mục tiêu bằng: ' +
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
            }

            let gpaFieldSet = $('<fieldset id="tbGPA"><legend>Thống kê GPA & Dự đoán tốt nghiệp</legend><div id="tbGPA_wrapper" class="dataTables_wrapper" role="grid"><table id="tbGPA_table" class="dkhp-table dataTable"><thead></thead><tbody role="alert" aria-live="polite" aria-relevant="all"></tbody></table></div>' + targetSectionHtml + '<p style="margin-top: 10px; color: blue;"><strong>(*)</strong>: Nhấn Ctrl+Shift+I và chọn tab Console để xem chi tiết tính toán.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ước lượng GPA mục tiêu tốt nghiệp chỉ hiển thị khi tra cứu ở chế độ Tất cả năm học.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nếu bạn thấy hữu ích, hãy tặng cho tác giả gốc một Star <a href="https://github.com/dtrung98/GPABookmarklet" target="_blank">Tại Đây</a> hoặc <a href="https://github.com/DreamyWanderer/GPABookmarklet_Maintanence" target="_blank">Tại Đây</a> (hoặc tác giả version mới <a href="https://github.com/dorayakiiiiz/GPABookmarklet" target="_blank">Tại Đây</a>) nhé</p></fieldset>');

            let gpaTableHead = $(gpaFieldSet).find("thead")[0];
            let gpaTableBody = $(gpaFieldSet).find("tbody")[0];

            // Clone TH from main table so TH background gradient styling matches 100% (Anh 1)
            const gpaHeadCol1 = $($(headTr).find("th")[2]).clone();
            $(gpaHeadCol1).attr("title", "Tên mục");
            $(gpaHeadCol1).children().html("Tên mục");

            const gpaHeadCol2 = headTh.clone();
            $(gpaHeadCol2).attr("title", "Giá trị");
            $(gpaHeadCol2).children().html("Giá trị");

            $(gpaTableHead).append(gpaHeadCol1);
            $(gpaTableHead).append(gpaHeadCol2);

            $(gpaTableBody).append('<tr class="odd"><td class="left">Điểm trung bình tích lũy (GPA)</td><td class="center gpa" id="calGPA"><b>' + toFixed(this.gpa) + '</b></td></tr>');
            $(gpaTableBody).append('<tr class="odd"><td class="left">Điểm trung bình tích lũy (GPA) hệ 4</td><td class="center gpa" id="calGPA4"><b>' + toFixed(this.fourGPA) + '</b></td></tr>');
            $(gpaTableBody).append('<tr class="even"><td class="left">Xếp loại học lực hiện tại</td><td class="center gpa" id="calDegreeBadge">' + badgeText + '</td></tr>');
            $(gpaTableBody).append('<tr class="odd"><td class="left">Điểm trung bình học tập</td><td class="center gpa" id="calNotPassGPA">' + toFixed(this.notPassGPA) + '</td></tr>');
            $(gpaTableBody).append('<tr class="even"><td class="left">Tổng tín chỉ đã tích luỹ</td><td class="center gpa" id="calSumCredit">' + this.totalCredits + ' tín chỉ</td></tr>');
            $(gpaTableBody).append('<tr class="odd"><td class="left">Tổng điểm đã tích lũy</td><td class="center gpa" id="sumScore">' + toFixed(this.totalScores) + '</td></tr>');
            $(gpaTableBody).append('<tr class="even"><td class="left">Số học phần đã học</td><td class="center gpa" id="sumCourse">' + data.length + ' học phần</td></tr>');
            $(gpaTableBody).append('<tr class="odd"><td class="left">Số học phần tính trong GPA</td><td class="center gpa" id="sumCalCourse">' + (data.length - this.removedCoursesSize) + ' học phần</td></tr>');

            $(parentDiv).prepend(gpaFieldSet);

            if (showTargetPlanner) {
                this.updateTargetPlanner();
            }

            for (let i = 0; i < rows.length; i++) {
                let id = parseInt($(rows[i]).attr("id"));
                let item = data[id - 1];
                if (!item) continue;

                if (!item.include) {
                    if (item.whyExclude.includes("không tính"))
                        $(rows[i]).attr("style", "color:blue;text-decoration: line-through;");
                    else if (item.whyExclude === "")
                        $(rows[i]).attr("style", "color:grey;text-decoration: line-through;");
                    else
                        $(rows[i]).attr("style", "color:red;text-decoration: line-through;");
                } else {
                    if (item.whyExclude === "") {
                        $(rows[i]).removeAttr("style");
                    } else {
                        // User checked a course with exclude reason -> BLUE text, NO strikethrough! (Anh 4)
                        $(rows[i]).attr("style", "color:blue;text-decoration: none;");
                    }
                }
            }
        }
    }


    class ExportPdf {
        constructor(data, cal) {
            this.data = data;
            this.cal = cal;
        }

        exportToPdf() {
            let rawUserText = $('#user_tools span').text() || $('#user_tools').text() || "";
            let studentName = "TRÀ VĂN SỸ";
            if (rawUserText.includes("Xin chào")) {
                let match = rawUserText.match(/Xin\s+chào\s+([^|]+)/i);
                if (match && match[1]) {
                    studentName = match[1].trim();
                }
            }

            let degInfo = getDegreeInfo(this.cal.gpa);
            const now = new Date();
            const dateStr = 'Ngày ' + now.getDate() + ' tháng ' + (now.getMonth() + 1) + ' năm ' + now.getFullYear();

            let scopeText = "Tất cả";
            if (!isAllSemestersMode()) {
                let yearInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi_ob_CbocboNamHoc_gvDKHPLichThiTB').val() || "").trim();
                let hkInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_gvDKHPLichThi_ob_CbocboHocKy_gvDKHPLichThiTB').val() || "").trim();
                scopeText = "Học kỳ " + hkInput + " - Năm học " + yearInput;
            }

            let rowsHtml = '';
            let stt = 1;
            this.data.forEach(function (row) {
                if (row.include) {
                    let scoreVal = (row.score > 0 || (!row.isAbsent && !row.isNoScore)) ? toFixed(row.score) : "-";
                    let letterVal = row.letter || "-";
                    let fourVal = row.fourRounding ? toFixed(row.fourRounding) : "-";

                    let courseParts = row.course.split(' - ');
                    let courseCode = courseParts.length > 1 ? courseParts[0].trim() : (row.ldcode || '');
                    let courseName = courseParts.length > 1 ? courseParts.slice(1).join(' - ').trim() : row.course;

                    rowsHtml += '<tr>' +
                        '<td>' + stt++ + '</td>' +
                        '<td>' + courseCode + '</td>' +
                        '<td class="left">' + courseName + '</td>' +
                        '<td>' + row.credit + '</td>' +
                        '<td>' + scoreVal + '</td>' +
                        '<td>' + fourVal + '</td>' +
                        '<td>' + letterVal + '</td>' +
                        '</tr>';
                }
            });

            const logoSrc = "data:image/png;base64," + LOGO_BASE64;

            const printHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>BẢNG ĐIỂM HỌC TẬP - ' + studentName + '</title>' +
                '<style>' +
                '@page { size: A4; margin: 10mm 15mm; }' +
                'body { font-family: "Times New Roman", Times, serif; font-size: 13px; color: #000; line-height: 1.4; margin: 0; padding: 15px; }' +
                '.header-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }' +
                '.header-table td { vertical-align: middle; }' +
                '.logo-img { height: 60px; width: auto; }' +
                '.school-title { font-size: 11px; font-weight: bold; text-transform: uppercase; text-align: center; padding: 0 5px; }' +
                '.national-title { font-size: 11px; font-weight: bold; text-align: center; }' +
                '.doc-title { font-size: 18px; font-weight: bold; text-align: center; margin: 15px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; }' +
                '.student-info { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 13px; }' +
                '.student-info td { padding: 3px 5px; vertical-align: top; }' +
                '.transcript-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 12px; }' +
                '.transcript-table th, .transcript-table td { border: 1px solid #000; padding: 5px 6px; text-align: center; }' +
                '.transcript-table th { font-weight: bold; background-color: #f2f2f2; }' +
                '.transcript-table td.left { text-align: left; }' +
                '.summary-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }' +
                '.summary-table td { padding: 4px 5px; }' +
                '.footer-table { width: 100%; border-collapse: collapse; margin-top: 20px; text-align: center; font-size: 13px; }' +
                '.footer-table td { vertical-align: top; }' +
                '.footnote-note { margin-top: 20px; font-size: 11px; font-style: italic; color: #333; }' +
                '</style></head><body>' +
                '<table class="header-table"><tr>' +
                '<td style="width: 70px;"><img src="' + logoSrc + '" class="logo-img" /></td>' +
                '<td class="school-title">ĐẠI HỌC QUỐC GIA TP.HỒ CHÍ MINH<br>TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN</td>' +
                '<td style="width: 42%;" class="national-title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>Độc lập - Tự do - Hạnh phúc<br>-------------------</td>' +
                '</tr></table>' +
                '<div class="doc-title">BẢNG ĐIỂM HỌC TẬP</div>' +
                '<table class="student-info"><tr>' +
                '<td style="width: 50%;"><b>Họ và tên sinh viên:</b> ' + studentName + '</td>' +
                '<td style="width: 50%;"><b>Trình độ đào tạo:</b> Đại học chính quy</td>' +
                '</tr><tr>' +
                '<td><b>Trạng thái:</b> Đang học</td>' +
                '<td><b>Năm học:</b> ' + scopeText + '</td>' +
                '</tr></table>' +
                '<table class="transcript-table"><thead><tr>' +
                '<th style="width: 40px;">STT</th>' +
                '<th style="width: 90px;">Mã HP</th>' +
                '<th>Tên học phần</th>' +
                '<th style="width: 55px;">Số TC</th>' +
                '<th style="width: 80px;">Thang 10</th>' +
                '<th style="width: 70px;">Thang 4</th>' +
                '<th style="width: 70px;">Điểm chữ</th>' +
                '</tr></thead><tbody>' +
                rowsHtml +
                '</tbody></table>' +
                '<table class="summary-table"><tr>' +
                '<td style="width: 60%;"><b>Điểm trung bình tích lũy (thang 10):</b> ' + toFixed(this.cal.gpa) + '</td>' +
                '<td style="width: 40%;"><b>Tổng số tín chỉ tích lũy:</b> ' + this.cal.totalCredits + ' tín chỉ</td>' +
                '</tr><tr>' +
                '<td><b>Điểm trung bình tích lũy (thang 4):</b> ' + toFixed(this.cal.fourGPA) + '</td>' +
                '<td><b>Xếp loại học lực tích lũy:</b> ' + degInfo.name + '</td>' +
                '</tr></table>' +
                '<table class="footer-table"><tr>' +
                '<td style="width: 50%;"></td>' +
                '<td style="width: 50%;"><i>TP. Hồ Chí Minh, ' + dateStr + '</i><br><b>NGƯỜI LẬP BẢNG ĐIỂM</b><br><br><br><br><b>' + studentName + '</b></td>' +
                '</tr></table>' +
                '<div class="footnote-note">(*): Bảng điểm này không thay thế bảng điểm chính thức từ Phòng đào tạo.</div>' +
                '<script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };<\/script>' +
                '</body></html>';

            let printWin = window.open('', '_blank', 'width=900,height=800');
            if (printWin) {
                printWin.document.open();
                printWin.document.write(printHtml);
                printWin.document.close();
            } else {
                alert("Vui lòng cho phép mở popup trình duyệt để xuất file PDF!");
            }
        }
    }

    class SaveCoursesList {
        constructor(data, cal) {
            this.data = data;
            this.cal = cal;
        }

        saveToFileCSV() {
            let csv = 'Tên môn học, Số tín chỉ, Điểm, Điểm chữ, Điểm 4, Học kỳ, Lớp, Ghi chú\n';
            this.data.forEach(function (row) {
                if (row.include) {
                    csv += row.course + ', ' + row.credit + ', ' + row.score + ', ' + row.letter + ', ' + row.fourRounding + ', ' + row.semester + ', ' + row.class + ', ' + row.note + '\n';
                }
            });

            csv += "Điểm trung bình tích lũy (GPA): " + toFixed(this.cal.gpa) + "\n";
            csv += "Điểm trung bình tích lũy (GPA) hệ 4: " + toFixed(this.cal.fourGPA) + "\n";
            csv += "Điểm trung bình học tập: " + toFixed(this.cal.notPassGPA) + "\n";
            csv += "Số tín chỉ tích lũy: " + this.cal.totalCredits + "\n";
            csv += "Tổng điểm tích lũy: " + toFixed(this.cal.totalScores) + "\n";
            csv += "Tổng học phần: " + this.data.length + "\n";
            csv += "Tổng học phần trong GPA: " + (this.data.length - this.cal.removedCoursesSize) + "\n";

            let hiddenElement = document.createElement('a');
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent('\uFEFF' + csv);
            hiddenElement.target = '_blank';
            hiddenElement.download = 'GPA.csv';
            hiddenElement.click();
        }
    }

    // MAIN EXECUTION FLOW

    initUserCourseData();
    addSupplementaryGrade();
    renderEditableScoreCells();

    let cal = new Calculation();
    cal.calculateGPA();
    cal.formatCoursesTableAndCreateResultTable();

    // Safe DataTables destruction compatible with legacy DataTables 1.9 used by HCMUS Portal
    try {
        tab.dataTable().fnDestroy();
    } catch (e) { }

    tab.dataTable({
        "bPaginate": false,
        "bJQueryUI": true,
        "bAutoWidth": false,
        "aaSorting": [[1, "asc"]],
        "aoColumnDefs": [
            { "sWidth": '50%', "aTargets": [2] }
        ]
    });
    tab.css({ 'width': '100%', 'margin': '0' });

    // Checkbox toggle listener
    $('#tbDiemThiGK').off('change', '.gpa-checkbox input[type="checkbox"]');
    $('#tbDiemThiGK').on('change', '.gpa-checkbox input[type="checkbox"]', function () {
        let courseRow = $(this).closest("tr");
        let idCourse = parseInt($(courseRow).attr("id"));

        if (idCourse && data[idCourse - 1]) {
            data[idCourse - 1].include = $(this).is(":checked");
            $(this).siblings().first().text($(this).is(":checked") ? 1 : 0);

            addSupplementaryGrade();
            cal = new Calculation();
            cal.calculateGPA();
            cal.formatCoursesTableAndCreateResultTable();
        }
    });

    // Prevent Enter key in score input from submitting ASP.NET webform and reloading page!
    $('#tbDiemThiGK').off('keydown', '.gpa-score-input');
    $('#tbDiemThiGK').on('keydown', '.gpa-score-input', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            $(this).trigger('change');
            $(this).blur();
            return false;
        }
    });

    // Target Planner change listener
    $(document).off('input change', '#targetCreditsInput, #targetDegreeSelect, #targetCustomGpaInput');
    $(document).on('input change', '#targetCreditsInput, #targetDegreeSelect, #targetCustomGpaInput', function () {
        if (cal) {
            cal.updateTargetPlanner();
        }
    });

    // Score edit listener (What-If simulation with comma support)
    $('#tbDiemThiGK').off('input change', '.gpa-score-input');
    $('#tbDiemThiGK').on('input change', '.gpa-score-input', function () {
        let idCourse = parseInt($(this).attr("data-id"));
        if (!idCourse || !data[idCourse - 1]) return;

        let item = data[idCourse - 1];
        let val = $(this).val().trim().replace(',', '.');
        let newScore = parseFloat(val);

        if (val !== "" && !isNaN(newScore) && newScore >= 0 && newScore <= 10) {
            item.score = newScore;
            item.isAbsent = false;
            item.isNoScore = false;

            if (item.score >= 5) {
                if (item.whyExclude.includes("Điểm nhỏ hơn 5") || item.whyExclude.includes("Chưa hoặc") || item.whyExclude.includes("Vắng")) {
                    item.include = true;
                }
            } else {
                item.include = false;
                if (!item.whyExclude.includes("Điểm nhỏ hơn 5")) {
                    item.whyExclude += "Điểm nhỏ hơn 5, chưa qua môn. ";
                }
            }
        } else if (val === "") {
            item.score = 0;
            item.include = false;
            if (!item.whyExclude.includes("Chưa hoặc")) {
                item.whyExclude += "Chưa hoặc không có điểm. ";
            }
        }

        // Sync Checkbox state in DOM
        let courseRow = $('#tbDiemThiGK tbody tr#' + idCourse);
        courseRow.find(".gpa-checkbox input[type='checkbox']").prop("checked", item.include);
        courseRow.find(".gpa-checkbox div[hidden]").text(item.include ? 1 : 0);

        addSupplementaryGrade();
        cal = new Calculation();
        cal.calculateGPA();
        cal.formatCoursesTableAndCreateResultTable();
    });


    // Save CSV and PDF Buttons
    if (!$('#saveCoursesList')[0]) {
        let saveCoursesList = new SaveCoursesList(data, cal);
        let exportPdf = new ExportPdf(data, cal);

        let saveButton = $('#ob_iBbtnXemDiemThiContainer').clone().attr("id", "saveCoursesList");
        $(saveButton).attr("style", "width: 22%; display: inline-block; margin-right: 10px; margin-bottom: 10px;");
        $($(saveButton).find(".ob_iBC")[0]).text("Xuất bảng điểm (CSV)");
        $(saveButton).insertBefore('#tbDiemThiGK_wrapper');
        $(saveButton).click(function (event) {
            event.preventDefault();
            saveCoursesList.saveToFileCSV();
        });

        let pdfButton = $('#ob_iBbtnXemDiemThiContainer').clone().attr("id", "exportPdfList");
        $(pdfButton).attr("style", "width: 22%; display: inline-block; margin-bottom: 10px;");
        $($(pdfButton).find(".ob_iBC")[0]).text("Xuất bảng điểm (PDF)");
        $(pdfButton).insertAfter(saveButton);
        $(pdfButton).click(function (event) {
            event.preventDefault();
            exportPdf.exportToPdf();
        });
    }

})();