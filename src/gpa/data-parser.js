(function () {
    __HCMUS__.gpa = __HCMUS__.gpa || {};

    function initUserCourseData(state) {
        const { isExceptCourseName, isCustomCourseInScope } = __HCMUS__.gpa.helpers;
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

        state.rows = state.tab.find("tbody tr").not(".gpa-custom-row");
        state.data = [];
        state.exceptData = [];

        for (let i = 0; i < state.rows.length; i++) {
            const tds = $(state.rows[i]).find("td").not(".gpa-checkbox");
            let rowKey = $(tds[0]).text().trim().normalize() + "_" + $(tds[1]).text().trim().normalize();
            $(state.rows[i]).attr('data-gpa-row-key', rowKey);

            let serverAttr = $(state.rows[i]).attr('data-server-score');
            if (serverAttr === undefined) {
                let serverText = $(tds[5]).find('div[hidden]').length ? $(tds[5]).find('div[hidden]').text().trim() : $(tds[5]).text().trim();
                let serverNum = parseFloat(serverText.replace(',', '.'));
                let serverIsAbsent = serverText === "Vắng" || serverText.toLowerCase().includes("vắng");
                let serverIsNo = (isNaN(serverNum) && !serverIsAbsent) || serverText === "" || serverText === "-" || serverText === "0";
                if (serverIsNo || serverIsAbsent) {
                    serverAttr = 'null';
                } else {
                    serverAttr = String(serverNum);
                }
                $(state.rows[i]).attr('data-server-score', serverAttr);
            }

            let originalScore = (serverAttr !== 'null') ? parseFloat(serverAttr) : null;
            let wasNoScore = (originalScore === null);

            const inputEl = $(tds[5]).find('.gpa-score-input');
            let rawScoreText = "";
            if (inputEl.length) {
                rawScoreText = inputEl.val().trim();
            } else if (window._gpaSavedEditedScores && window._gpaSavedEditedScores[rowKey] !== undefined) {
                rawScoreText = window._gpaSavedEditedScores[rowKey];
            } else {
                let textNode = $(tds[5]).clone().children().remove().end().text().trim();
                rawScoreText = textNode || $(tds[5]).text().trim();
            }

            let parsedScore = parseFloat(rawScoreText.replace(',', '.'));
            let isAbsent = rawScoreText === "Vắng" || rawScoreText.toLowerCase().includes("vắng");
            let isNoScore = (isNaN(parsedScore) && !isAbsent) || rawScoreText === "" || rawScoreText === "-";

            let isEdited = (!wasNoScore && originalScore !== null && !isNaN(parsedScore) && parsedScore !== originalScore);

            let row = {
                id: i + 1,
                semester: $(tds[0]).text().trim().normalize(),
                course: $(tds[1]).text().trim().normalize(),
                credit: parseInt($(tds[2]).text().trim().normalize()) || 0,
                class: $(tds[3]).text().trim().normalize(),
                ldcode: $(tds[4]).text().trim().normalize(),
                score: (!isNoScore && !isNaN(parsedScore)) ? parsedScore : 0,
                originalScore: originalScore,
                note: $(tds[6]).text().trim().normalize(),
                include: true,
                whyExclude: "",
                isAbsent: isAbsent,
                isNoScore: isNoScore,
                wasNoScore: wasNoScore,
                isEdited: isEdited,
                letter: "",
                fourRounding: 0,
                isCustom: false
            };

            $(state.rows[i]).attr("id", row.id);

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

            if (isExceptCourseName(row.course)) {
                row.include = false;
                row.whyExclude += "Học phần không tính trong GPA. ";
            }

            for (let j = 0; j < state.data.length; j++) {
                if (state.data[j].course === row.course) {
                    state.data[j].include = false;
                    state.data[j].whyExclude = "Đã học lại. ";
                }
            }

            let cbEl = $(state.rows[i]).find(".gpa-checkbox input[type='checkbox']");
            if (cbEl.length > 0) {
                row.include = cbEl.is(":checked");
                if (!row.include && !row.whyExclude) {
                    row.whyExclude = "Người dùng bỏ chọn. ";
                }
            }

            state.data.push(row);
            if (!row.include) state.exceptData.push(row);
        }

        // Append Custom Courses with semester scope check
        for (let k = 0; k < state.customCoursesList.length; k++) {
            let cItem = state.customCoursesList[k];
            if (!isCustomCourseInScope(cItem)) continue;
            cItem.id = state.data.length + 1;
            state.data.push(cItem);
            if (!cItem.include) state.exceptData.push(cItem);
        }
    }

    function addSupplementaryGrade(state) {
        const { toFixed } = __HCMUS__.gpa.helpers;
        let supplementaryGrade = [
            { score: 9, letter: "A+", fourRounding: 4.0 },
            { score: 8, letter: "A.", fourRounding: 3.5 },
            { score: 7, letter: "B+", fourRounding: 3.0 },
            { score: 6, letter: "B.", fourRounding: 2.5 },
            { score: 5, letter: "C.", fourRounding: 2.0 },
            { score: 4, letter: "D+", fourRounding: 1.5 },
            { score: 3, letter: "D.", fourRounding: 1.0 }
        ];

        state.data.forEach(item => {
            if (item.isNoScore) {
                item.letter = "-";
                item.fourRounding = 0;
            } else if (item.score >= 0) {
                if (item.score < 3) {
                    item.letter = "F";
                    item.fourRounding = 0;
                } else {
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

                if (item.isCustom) {
                    let cInList = state.customCoursesList.find(c => String(c.id) === String(item.id));
                    if (cInList) {
                        cInList.letter = item.letter;
                        cInList.fourRounding = item.fourRounding;
                    }
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
                let idAttr = $(this).attr("id");
                let item = state.data.find(d => String(d.id) === String(idAttr));
                let letterGrade = item ? (item.letter || "-") : "-";
                let fourRounding = item ? (item.fourRounding || 0) : 0;
                $('td:eq(5)', this).after('<td class="center gpa-letter-col">' + letterGrade + '</td><td class="center gpa-four-col">' + fourRounding + '</td>');
            });
        }

        // Update values in existing letter and grade 4 columns
        $('#tbDiemThiGK tbody tr').each(function () {
            let idAttr = $(this).attr("id");
            let item = state.data.find(d => String(d.id) === String(idAttr));
            if (item) {
                $(this).find('.gpa-letter-col').text(item.letter || "-");
                $(this).find('.gpa-four-col').text(item.fourRounding ? item.fourRounding : 0);
            }
        });
    }

    function renderEditableScoreCells(state) {
        $('#tbDiemThiGK tbody tr').each(function () {
            let id = parseInt($(this).attr("id"));
            if (!id || !state.data[id - 1]) return;
            let item = state.data[id - 1];

            let scoreTd = $(this).find("td").not(".gpa-checkbox").eq(5);
            if (!scoreTd.find(".gpa-score-input").length) {
                let valStr = (item.score > 0 || (!item.isAbsent && !item.isNoScore)) ? item.score : "";
                let inputStyle = "width: 45px; text-align: center; border: 1px solid #c0c0c0; background: #ffffff; padding: 1px 2px;";
                if (item.wasNoScore && item.score > 0) {
                    inputStyle += " color: blue;";
                } else {
                    inputStyle += " color: inherit;";
                }

                scoreTd.css({ 'text-align': 'center' });
                scoreTd.html(
                    '<div hidden>' + item.score + '</div>' +
                    '<input type="text" class="gpa-score-input" data-id="' + item.id + '" value="' + valStr + '" placeholder="-" title="Nhập/sửa điểm" style="' + inputStyle + '" />'
                );
            }
        });
    }

    function renderCustomCoursesInTable(state) {
        const { isCustomCourseInScope, autoResizeTextarea } = __HCMUS__.gpa.helpers;
        state.tab.find('tbody tr.gpa-custom-row').remove();
        state.customCoursesList.forEach(item => {
            if (!isCustomCourseInScope(item)) return;

            let inc = item.include;
            let semVal = (item.semester && item.semester !== '-') ? item.semester : '';
            let nameVal = (item.course && item.course !== '-') ? item.course : '';
            let creditVal = (item.credit && item.credit > 0) ? item.credit : '';
            let scoreValStr = (item.score > 0 || (!item.isAbsent && !item.isNoScore)) ? item.score : '';

            let dItem = state.data.find(d => String(d.id) === String(item.id)) || item;
            let displayLetter = (dItem && dItem.letter) ? dItem.letter : (item.letter || '-');
            let displayFour = (dItem && dItem.fourRounding !== undefined && dItem.fourRounding !== null) ? dItem.fourRounding : (item.fourRounding || 0);

            let rowColor = 'blue';
            let rowDecor = 'none';
            if (!inc) {
                rowDecor = 'line-through';
                if (item.whyExclude && item.whyExclude.includes('không tính')) {
                    rowColor = 'blue';
                } else if (item.whyExclude && item.whyExclude.includes('bỏ chọn')) {
                    rowColor = 'grey';
                } else {
                    rowColor = 'red';
                }
            }
            let trStyle = 'color: ' + rowColor + '; text-decoration: ' + rowDecor + ';';

            let trHtml = '<tr class="odd gpa-custom-row" id="' + item.id + '" style="' + trStyle + '">' +
                '<td class="center gpa-checkbox" style="width:60px;"><input type="checkbox"' + (inc ? " checked" : "") + ' /><div hidden>' + (inc ? 1 : 0) + '</div></td>' +
                '<td class="center" style="width: 80px;"><span style="display:none;">' + semVal + '_z</span><input type="text" class="gpa-custom-sem-input" data-id="' + item.id + '" value="' + semVal + '" placeholder="-" style="width: 65px; text-align: center; border: 1px solid #c0c0c0; background: transparent; color: inherit; font-family: inherit; font-size: inherit; padding: 1px 2px;" /></td>' +
                '<td class="left" style="padding: 2px 4px; vertical-align: middle;"><textarea class="gpa-custom-name-input" data-id="' + item.id + '" placeholder="-" title="' + nameVal + '" style="width: 100%; min-width: 100%; height: 26px; resize: none; border: 1px solid #c0c0c0; background: transparent; color: inherit; font-family: inherit; font-size: inherit; padding: 2px 4px; box-sizing: border-box; vertical-align: middle; overflow: hidden; line-height: 1.3;" rows="1">' + nameVal + '</textarea></td>' +
                '<td class="center" style="width: 60px;"><input type="text" class="gpa-custom-credit-input" data-id="' + item.id + '" value="' + creditVal + '" placeholder="-" style="width: 45px; text-align: center; border: 1px solid #c0c0c0; background: transparent; color: inherit; font-family: inherit; font-size: inherit; padding: 1px 2px;" /></td>' +
                '<td class="center" style="width: 60px;">DK</td>' +
                '<td class="center" style="width: 60px;"></td>' +
                '<td class="right" style="width: 60px; text-align: center;"><div hidden>' + item.score + '</div><input type="text" class="gpa-score-input" data-id="' + item.id + '" value="' + scoreValStr + '" placeholder="-" title="Nhập/sửa điểm" style="width: 45px; text-align: center; border: 1px solid #c0c0c0; background: transparent; color: inherit; font-family: inherit; font-size: inherit; padding: 1px 2px;" /></td>' +
                '<td class="center gpa-letter-col">' + displayLetter + '</td>' +
                '<td class="center gpa-four-col">' + displayFour + '</td>' +
                '<td class="left" style="vertical-align: middle;"><div style="display:flex; align-items:center; justify-content:space-between; width:100%; box-sizing:border-box;"><span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Môn dự kiến</span><button type="button" class="gpa-btn-del-custom" data-custom-id="' + item.id + '" title="Xóa môn dự kiến" style="background:#ef4444; color:#fff; border:none; border-radius:3px; padding:2px 6px; cursor:pointer; font-size:11px; margin-left:6px; flex-shrink:0;">Xóa</button></div></td>' +
                '</tr>';
            state.tab.find('tbody').append(trHtml);
        });

        // Resize after DOM layout is complete
        requestAnimationFrame(function () {
            state.tab.find('.gpa-custom-name-input').each(function () {
                autoResizeTextarea(this);
            });
        });
    }

    __HCMUS__.gpa.dataParser = {
        initUserCourseData,
        addSupplementaryGrade,
        renderEditableScoreCells,
        renderCustomCoursesInTable
    };
})();
