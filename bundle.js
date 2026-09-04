(function gpa() {
    const LOGO_BASE64 = "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";

    window._initGpaCalculator = function () {
        const portalReg = /(new-)?portal\d*\.hcmus\.edu\.vn/i;
        if (!window.location.hostname.match(portalReg)) {
            alert("Vui lòng sử dụng Tool trên website HCMUS Portal!");
            return;
        }

        const dkhpReg = /pid=211/i;
        if (!window.location.href.match(dkhpReg)) {
            alert("Vui lòng đi tới trang \"Tra cứu kết quả học tập\" trước");
            return;
        }

        let tab = $("#tbDiemThiGK");
        if (!tab.length) return;

        // Fix Left Navbar White Gap on Scroll & Fix Table Side Indentation & Align Toolbar & Search
        $('<style>#page-body{display:flex!important;align-items:stretch!important}#page-body-menu{height:auto!important;min-height:100%!important;flex-shrink:0!important}#page-body-content{flex-grow:1!important;min-width:0!important}#tbDiemThiGK{width:100%!important;margin:0!important}.gpa-custom-name-input{text-align:left!important}.gpa-custom-name-input::placeholder,.gpa-custom-sem-input::placeholder,.gpa-custom-credit-input::placeholder,.gpa-score-input::placeholder{text-align:center!important}#tbDiemThiGK_wrapper .fg-toolbar:first-child{display:flex!important;align-items:center!important;justify-content:space-between!important}#tbDiemThiGK_wrapper .fg-toolbar:first-child:before,#tbDiemThiGK_wrapper .fg-toolbar:first-child:after{display:none!important}#gpaYearFilterWrapper{display:inline-flex!important;align-items:center!important;float:none!important;margin:0!important}#tbDiemThiGK_filter{float:none!important;display:inline-flex!important;align-items:center!important;margin:0 0 0 auto!important}#tbDiemThiGK_filter label{display:inline-flex!important;align-items:center!important;margin:0!important;float:none!important}#tbDiemThiGK_filter input{margin-left:5px!important;vertical-align:middle!important}</style>').appendTo('head');

        let customCoursesList = window._gpaCustomCoursesList || [];
        window._gpaCustomCoursesList = customCoursesList;
        let exceptData = [];
        let data = [];
        let rows = null;

        function loadGpaSimulationData() {
            try {
                let savedCustom = localStorage.getItem('gpa_saved_custom_courses');
                if (savedCustom) {
                    let parsed = JSON.parse(savedCustom);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        let uniqueCustom = [];
                        let seen = new Set();
                        parsed.forEach(c => {
                            let key = (c.id || '') + '_' + (c.semester || '') + '_' + (c.course || '');
                            if (!seen.has(key)) {
                                seen.add(key);
                                uniqueCustom.push(c);
                            }
                        });
                        window._gpaCustomCoursesList = uniqueCustom;
                        customCoursesList = uniqueCustom;
                    }
                }
                let savedScores = localStorage.getItem('gpa_saved_edited_scores');
                if (savedScores) {
                    window._gpaSavedEditedScores = JSON.parse(savedScores);
                }
            } catch (e) { }
        }

        function saveGpaSimulationData() {
            if (!window._gpaIsUserEditingOrRestored) {
                return;
            }
            try {
                if (window._gpaCustomCoursesList && window._gpaCustomCoursesList.length > 0) {
                    let existingRaw = localStorage.getItem('gpa_saved_custom_courses');
                    let existingCustom = existingRaw ? JSON.parse(existingRaw) : [];

                    let { year, hk } = getSelectedYearAndHk();
                    let targetSem = (year + '/' + hk).toLowerCase();

                    let otherSemCustom = existingCustom.filter(c => {
                        if (!c) return false;
                        if (isAllSemestersMode()) return false;
                        return !isCustomCourseInScope(c);
                    });

                    let mergedCustom = [...otherSemCustom, ...window._gpaCustomCoursesList];

                    let uniqueCustom = [];
                    let seen = new Set();
                    mergedCustom.forEach(c => {
                        let key = (c.id || '') + '_' + (c.semester || '') + '_' + (c.course || '');
                        if (!seen.has(key)) {
                            seen.add(key);
                            uniqueCustom.push(c);
                        }
                    });

                    localStorage.setItem('gpa_saved_custom_courses', JSON.stringify(uniqueCustom));
                }

                let savedScores = {};         // scores that differ from original → save
                let revertedKeys = [];         // scores restored to original → remove from LS

                $('#tbDiemThiGK tbody tr').not('.gpa-custom-row').each(function () {
                    let idAttr = $(this).attr("id");
                    let item = data.find(d => String(d.id) === String(idAttr));
                    let rowKey = $(this).attr('data-gpa-row-key');
                    let scoreInput = $(this).find('.gpa-score-input');

                    if (item && rowKey && scoreInput.length) {
                        let scoreVal = scoreInput.val().trim();
                        let serverAttr = $(this).attr('data-server-score');
                        let originalScoreStr = (serverAttr && serverAttr !== 'null') ? serverAttr : "";

                        let isChanged = scoreVal !== "" && (item.isEdited || item.wasNoScore || scoreVal !== originalScoreStr);
                        let isBlankEdit = scoreVal === "" && (item.isEdited || item.wasNoScore);

                        if (isChanged) {
                            savedScores[rowKey] = scoreVal;
                        } else {
                            // Score reverted to original or cleared → mark for removal
                            revertedKeys.push(rowKey);
                        }
                        _ = isBlankEdit; // suppress unused var warning
                    }
                });

                // Always merge new saved scores AND clean up reverted/blank keys from localStorage
                {
                    let existingRaw = localStorage.getItem('gpa_saved_edited_scores');
                    let merged = existingRaw ? JSON.parse(existingRaw) : {};
                    // Apply new/updated scores
                    Object.assign(merged, savedScores);
                    // Remove keys that are back to original or blank
                    revertedKeys.forEach(k => { delete merged[k]; });
                    if (Object.keys(merged).length > 0) {
                        localStorage.setItem('gpa_saved_edited_scores', JSON.stringify(merged));
                    } else {
                        localStorage.removeItem('gpa_saved_edited_scores');
                    }
                }
            } catch (e) { }
        }

        function getSelectedYearAndHk() {
            let year = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi_ob_CbocboNamHoc_gvDKHPLichThiTB').val() || "").trim();
            if (!year || year === "0" || year.toLowerCase().includes("tất cả")) {
                year = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi').val() || "").trim();
            }
            let hk = ($('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_gvDKHPLichThi_ob_CbocboHocKy_gvDKHPLichThiTB').val() || "").trim();
            if (!hk) {
                hk = ($('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_gvDKHPLichThi').val() || "").trim();
            }
            return { year, hk };
        }

        function hasRestorableData() {
            try {
                let savedCustom = localStorage.getItem('gpa_saved_custom_courses');
                let savedScores = localStorage.getItem('gpa_saved_edited_scores');
                let { year, hk } = getSelectedYearAndHk();

                if (savedCustom) {
                    let parsed = JSON.parse(savedCustom);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        let hasMatch = parsed.some(c => isCustomCourseInScope(c));
                        if (hasMatch) return true;
                    }
                }

                if (savedScores) {
                    let parsed = JSON.parse(savedScores);
                    let keys = Object.keys(parsed);
                    if (keys.length > 0) {
                        if (isAllSemestersMode()) {
                            return true;
                        } else {
                            let targetSem = (year + '/' + hk).toLowerCase();
                            let prefix = targetSem + "_";
                            let hasMatch = keys.some(k => k.toLowerCase().startsWith(prefix));
                            if (hasMatch) return true;
                        }
                    }
                }
            } catch (e) {
                // Ignore parsing errors silently
            }
            return false;
        }

        function restoreGpaSimulationData() {
            window._gpaIsUserEditingOrRestored = true;
            try {
                let savedCustom = localStorage.getItem('gpa_saved_custom_courses');
                if (savedCustom) {
                    let parsed = JSON.parse(savedCustom);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        let uniqueCustom = [];
                        let seen = new Set();

                        let itemsToLoad = isAllSemestersMode() ? parsed : parsed.filter(c => isCustomCourseInScope(c));

                        let merged = [...customCoursesList, ...itemsToLoad];
                        merged.forEach(c => {
                            let key = (c.id || '') + '_' + (c.semester || '') + '_' + (c.course || '');
                            if (!seen.has(key)) {
                                seen.add(key);
                                uniqueCustom.push(c);
                            }
                        });

                        window._gpaCustomCoursesList = uniqueCustom;
                        customCoursesList = uniqueCustom;
                    }
                }

                let savedScores = localStorage.getItem('gpa_saved_edited_scores');
                if (savedScores) {
                    let parsed = JSON.parse(savedScores);
                    window._gpaSavedEditedScores = window._gpaSavedEditedScores || {};
                    if (isAllSemestersMode()) {
                        window._gpaSavedEditedScores = parsed;
                    } else {
                        let { year, hk } = getSelectedYearAndHk();
                        let targetSem = (year + '/' + hk).toLowerCase();
                        let prefix = targetSem + "_";

                        Object.keys(parsed).forEach(k => {
                            if (k.toLowerCase().startsWith(prefix)) {
                                window._gpaSavedEditedScores[k] = parsed[k];
                            }
                        });
                    }
                }

                // Update DOM inputs with restored values so initUserCourseData reads them
                $('#tbDiemThiGK tbody tr').each(function () {
                    let scoreInput = $(this).find('.gpa-score-input');
                    let rowKey = $(this).attr('data-gpa-row-key');
                    if (rowKey && scoreInput.length && window._gpaSavedEditedScores && window._gpaSavedEditedScores[rowKey] !== undefined) {
                        let restoredVal = window._gpaSavedEditedScores[rowKey];
                        scoreInput.val(restoredVal);
                        let restoredNum = parseFloat(restoredVal.replace(',', '.'));
                        let courseRow = $(this);
                        let tds = courseRow.find("td").not(".gpa-checkbox");
                        let courseName = $(tds[1]).text().trim();
                        let isExcept = isExceptCourseName(courseName);

                        if (!isNaN(restoredNum) && restoredNum >= 5 && !isExcept) {
                            courseRow.find(".gpa-checkbox input[type='checkbox']").prop("checked", true);
                            courseRow.find(".gpa-checkbox div[hidden]").text("1");
                        } else if (!isNaN(restoredNum) && restoredNum < 5) {
                            courseRow.find(".gpa-checkbox input[type='checkbox']").prop("checked", false);
                            courseRow.find(".gpa-checkbox div[hidden]").text("0");
                        }
                    }
                });
            } catch (e) {
                console.error("[GPA RESTORE] Error during restore:", e);
            }
            refreshAllDataAndUI();
        }

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
            let { year } = getSelectedYearAndHk();
            return !year || year === "0" || year.toLowerCase().includes("tất cả");
        }

        let selectedAcademicYears = []; // Empty means "Tất cả" (all years)

        function getCourseAcademicYear(semesterStr) {
            if (!semesterStr) return "";
            let match = semesterStr.match(/(\d{2,4}-\d{2,4})/);
            return match ? match[1] : "";
        }

        function isCourseInSelectedYears(item) {
            if (!isAllSemestersMode()) return true;
            if (!selectedAcademicYears || selectedAcademicYears.length === 0) return true;
            let y = getCourseAcademicYear(item ? item.semester : "");
            if (!y) return true;
            return selectedAcademicYears.includes(y);
        }

        function getAvailableAcademicYears() {
            let yearSet = new Set();
            if (data && data.length) {
                data.forEach(d => {
                    let y = getCourseAcademicYear(d.semester);
                    if (y) yearSet.add(y);
                });
            }
            if (customCoursesList && customCoursesList.length) {
                customCoursesList.forEach(c => {
                    let y = getCourseAcademicYear(c.semester);
                    if (y) yearSet.add(y);
                });
            }
            return Array.from(yearSet).sort();
        }

        function applyYearFilterVisibility() {
            if (!isAllSemestersMode()) return;
            tab.find('tbody tr').each(function () {
                let idAttr = $(this).attr("id");
                let item = data.find(d => String(d.id) === String(idAttr)) ||
                    customCoursesList.find(c => String(c.id) === String(idAttr));
                if (!item) return;

                if (isCourseInSelectedYears(item)) {
                    $(this).css('display', '');
                } else {
                    $(this).css('display', 'none');
                }
            });

            tab.find('tbody tr:visible').each(function (idx) {
                $(this).removeClass('odd even').addClass(idx % 2 === 0 ? 'odd' : 'even');
            });
        }

        function updateYearFilterBtnText() {
            let btn = $('#gpaYearFilterBtn');
            if (!btn.length) return;
            if (!selectedAcademicYears || selectedAcademicYears.length === 0) {
                btn.text('Tất cả ▾');
                $('#gpaYearCheckAll').prop('checked', true);
            } else if (selectedAcademicYears.length === 1) {
                btn.text(selectedAcademicYears[0] + ' ▾');
                $('#gpaYearCheckAll').prop('checked', false);
            } else if (selectedAcademicYears.length <= 2) {
                btn.text(selectedAcademicYears.join(', ') + ' ▾');
                $('#gpaYearCheckAll').prop('checked', false);
            } else {
                btn.text(selectedAcademicYears.length + ' năm ▾');
                $('#gpaYearCheckAll').prop('checked', false);
            }
        }

        function applyYearFilter() {
            cal = new Calculation();
            cal.calculateGPA();
            cal.updateGpaStats();
            applyYearFilterVisibility();
        }

        function setupYearFilterDropdown() {
            if (!isAllSemestersMode()) return;
            let topToolbar = $('#tbDiemThiGK_wrapper .fg-toolbar').first();
            if (!topToolbar.length) return;

            let availableYears = getAvailableAcademicYears();
            if (availableYears.length === 0) return;

            if (!$('#gpaYearFilterWrapper').length) {
                let filterWrapper = $(
                    '<div id="gpaYearFilterWrapper" style="position: relative; display: inline-flex; align-items: center; font-family: inherit; margin: 0;">' +
                    '  <label style="font-weight: normal; margin-right: 4px; font-size: 13px; color: #000;">Năm học:</label>' +
                    '  <div id="gpaYearBtnContainer" style="position: relative; display: inline-block;">' +
                    '    <button type="button" id="gpaYearFilterBtn" style="padding: 2px 10px; height: 23px; border: 1px solid #c0c0c0; background: #fff; font-size: 13px; cursor: pointer; vertical-align: middle; border-radius: 3px; font-family: inherit; color: #000; box-sizing: border-box; line-height: 1;">' +
                    '      Tất cả ▾' +
                    '    </button>' +
                    '    <div id="gpaYearFilterDropdown" style="display: none; position: absolute; top: calc(100% + 4px); left: 0; z-index: 99999; background: #ffffff; border: 1px solid #c0c0c0; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 8px 12px; min-width: 130px; box-sizing: border-box;">' +
                    '      <div style="margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #eee;">' +
                    '        <label style="cursor: pointer; font-weight: bold; font-size: 12px; display: flex; align-items: center; gap: 6px; color: #000; margin: 0;">' +
                    '          <input type="checkbox" id="gpaYearCheckAll" checked style="cursor: pointer; margin: 0;" /> Tất cả' +
                    '        </label>' +
                    '      </div>' +
                    '      <div id="gpaYearCheckboxList" style="display: flex; flex-direction: column; gap: 4px; max-height: 160px; overflow-y: auto;"></div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>'
                );

                topToolbar.prepend(filterWrapper);

                $('#gpaYearFilterBtn').off('click').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $('#gpaYearFilterDropdown').slideToggle(120);
                });

                $('#gpaYearFilterDropdown').off('click').on('click', function (e) {
                    e.stopPropagation();
                });

                $(document).off('click.gpaYearFilter').on('click.gpaYearFilter', function () {
                    $('#gpaYearFilterDropdown').hide();
                });

                $('#gpaYearCheckAll').off('change').on('change', function () {
                    let isChecked = $(this).is(':checked');
                    $('.gpa-year-checkbox').prop('checked', isChecked);
                    if (isChecked) {
                        selectedAcademicYears = [];
                    } else {
                        selectedAcademicYears = [];
                        $(this).prop('checked', true);
                        $('.gpa-year-checkbox').prop('checked', true);
                    }
                    updateYearFilterBtnText();
                    applyYearFilter();
                });

                $('#gpaYearCheckboxList').off('change', '.gpa-year-checkbox').on('change', '.gpa-year-checkbox', function () {
                    let total = $('.gpa-year-checkbox').length;
                    let checkedEls = $('.gpa-year-checkbox:checked');
                    if (checkedEls.length === 0) {
                        $(this).prop('checked', true);
                        return;
                    }
                    if (checkedEls.length === total) {
                        selectedAcademicYears = [];
                        $('#gpaYearCheckAll').prop('checked', true);
                    } else {
                        $('#gpaYearCheckAll').prop('checked', false);
                        selectedAcademicYears = [];
                        checkedEls.each(function () {
                            selectedAcademicYears.push($(this).val());
                        });
                    }
                    updateYearFilterBtnText();
                    applyYearFilter();
                });
            }

            let checkListContainer = $('#gpaYearCheckboxList');
            checkListContainer.empty();
            availableYears.forEach(y => {
                let isChecked = selectedAcademicYears.length === 0 || selectedAcademicYears.includes(y);
                checkListContainer.append(
                    '<label style="cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 6px; color: #000; margin: 0;">' +
                    '  <input type="checkbox" class="gpa-year-checkbox" value="' + y + '"' + (isChecked ? ' checked' : '') + ' style="cursor: pointer; margin: 0;" /> Năm học ' + y +
                    '</label>'
                );
            });

            updateYearFilterBtnText();
            applyYearFilterVisibility();
        }

        function isCourseInSemesterGpaScope(item) {
            if (!item || !item.credit || item.credit <= 0) return false;
            if (item.whyExclude && item.whyExclude.includes("không tính")) return false;
            if (item.whyExclude && item.whyExclude.includes("không tín chỉ")) return false;
            return true;
        }

        function autoResizeTextarea(el) {
            if (!el) return;
            el.style.height = '26px';
            el.style.height = Math.max(26, el.scrollHeight) + 'px';
        }

        function getSemesterData() {
            let semMap = {};
            data.forEach(item => {
                if (!isCourseInSelectedYears(item)) return;
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

        function isExceptCourseName(courseName) {
            if (!courseName) return false;
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
            let normalized = courseName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return exceptCourses.some(ex => {
                let normEx = ex.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return normalized.includes(normEx);
            });
        }

        function isCustomCourseInScope(cItem) {
            if (isAllSemestersMode()) return true;
            if (!cItem) return true;

            let { year, hk } = getSelectedYearAndHk();
            let targetSem = (year + '/' + hk).toLowerCase();
            let cSem = (cItem.semester || "").trim().toLowerCase();
            let addedSem = (cItem.addedInSem || "").trim().toLowerCase();

            if (!cSem || cSem === "-") return true;

            let match = cSem === targetSem || cSem === year.toLowerCase() || (addedSem !== "" && addedSem === targetSem);
            return match;
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

            rows = tab.find("tbody tr").not(".gpa-custom-row");
            data = [];
            exceptData = [];

            for (let i = 0; i < rows.length; i++) {
                const tds = $(rows[i]).find("td").not(".gpa-checkbox");
                let rowKey = $(tds[0]).text().trim().normalize() + "_" + $(tds[1]).text().trim().normalize();
                $(rows[i]).attr('data-gpa-row-key', rowKey);

                let serverAttr = $(rows[i]).attr('data-server-score');
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
                    $(rows[i]).attr('data-server-score', serverAttr);
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

                if (isExceptCourseName(row.course)) {
                    row.include = false;
                    row.whyExclude += "Học phần không tính trong GPA. ";
                }

                for (let j = 0; j < data.length; j++) {
                    if (data[j].course === row.course) {
                        data[j].include = false;
                        data[j].whyExclude = "Đã học lại. ";
                    }
                }

                let cbEl = $(rows[i]).find(".gpa-checkbox input[type='checkbox']");
                if (cbEl.length > 0) {
                    row.include = cbEl.is(":checked");
                    if (!row.include && !row.whyExclude) {
                        row.whyExclude = "Người dùng bỏ chọn. ";
                    }
                }

                data.push(row);
                if (!row.include) exceptData.push(row);
            }

            // Append Custom Courses with semester scope check
            for (let k = 0; k < customCoursesList.length; k++) {
                let cItem = customCoursesList[k];
                if (!isCustomCourseInScope(cItem)) continue;
                cItem.id = data.length + 1;
                data.push(cItem);
                if (!cItem.include) exceptData.push(cItem);
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
                { score: 3, letter: "D.", fourRounding: 1.0 }
            ];

            data.forEach(item => {
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
                        let cInList = customCoursesList.find(c => String(c.id) === String(item.id));
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
                    let item = data.find(d => String(d.id) === String(idAttr));
                    let letterGrade = item ? (item.letter || "-") : "-";
                    let fourRounding = item ? (item.fourRounding || 0) : 0;
                    $('td:eq(5)', this).after('<td class="center gpa-letter-col">' + letterGrade + '</td><td class="center gpa-four-col">' + fourRounding + '</td>');
                });
            }

            // Update values in existing letter and grade 4 columns
            $('#tbDiemThiGK tbody tr').each(function () {
                let idAttr = $(this).attr("id");
                let item = data.find(d => String(d.id) === String(idAttr));
                if (item) {
                    $(this).find('.gpa-letter-col').text(item.letter || "-");
                    $(this).find('.gpa-four-col').text(item.fourRounding ? item.fourRounding : 0);
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

        function renderCustomCoursesInTable() {
            tab.find('tbody tr.gpa-custom-row').remove();
            customCoursesList.forEach(item => {
                if (!isCustomCourseInScope(item)) return;

                let inc = item.include;
                let semVal = (item.semester && item.semester !== '-') ? item.semester : '';
                let nameVal = (item.course && item.course !== '-') ? item.course : '';
                let creditVal = (item.credit && item.credit > 0) ? item.credit : '';
                let scoreValStr = (item.score > 0 || (!item.isAbsent && !item.isNoScore)) ? item.score : '';

                let dItem = data.find(d => String(d.id) === String(item.id)) || item;
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
                tab.find('tbody').append(trHtml);
            });

            // Resize after DOM layout is complete
            requestAnimationFrame(function () {
                tab.find('.gpa-custom-name-input').each(function () {
                    autoResizeTextarea(this);
                });
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

                this.removedCoursesSize = 0;
                this.activeCoursesCount = 0;

                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    if (!isCourseInSelectedYears(item)) continue;
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
                    if (!targetName.startsWith("bằng") && !targetName.startsWith("Bằng") && isAllSemestersMode() && (!selectedAcademicYears || selectedAcademicYears.length === 0)) {
                        targetName = "bằng " + targetName;
                    }
                }

                let isFullGraduation = isAllSemestersMode() && (!selectedAcademicYears || selectedAcademicYears.length === 0);
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

                    data.forEach(item => {
                        if (!isCourseInSelectedYears(item)) return;
                        if (!isCourseInSemesterGpaScope(item)) return;
                        totalScopeCredits += item.credit;
                        if (item.score > 0 || (!item.isAbsent && !item.isNoScore)) {
                            completedScopeCredits += item.credit;
                            completedScopeScores += item.credit * item.score;
                        }
                    });

                    let remCredits = totalScopeCredits - completedScopeCredits;
                    let scopeTitle = (isAllSemestersMode() && selectedAcademicYears && selectedAcademicYears.length > 0)
                        ? ("năm học " + selectedAcademicYears.join(', '))
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

            formatCoursesTableAndCreateResultTable() {
                let headTr = tab.find("thead tr")[0];
                let headTh = $($(headTr).find("th")[0]).clone();

                if (!tab.find("th:contains('Trong GPA')").length) {
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
                let noteTextHtml = '';

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
                    data.forEach(item => { if (isCourseInSemesterGpaScope(item)) semTotalCredits += item.credit; });
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
                let totalCourses = (this.activeCoursesCount !== undefined ? this.activeCoursesCount : data.length);
                let inGpaCourses = (totalCourses - this.removedCoursesSize);
                $(gpaTableBody).append('<tr class="odd"><td class="left">Số học phần đã học</td><td class="center gpa" id="sumCourse">' + totalCourses + ' học phần</td></tr>');
                $(gpaTableBody).append('<tr class="even"><td class="left">Số học phần tính trong GPA</td><td class="center gpa" id="sumCalCourse">' + inGpaCourses + ' học phần</td></tr>');

                $(parentDiv).prepend(gpaFieldSet);

                // Render Semester GPA Trend Chart (Only in "All Semesters" mode)
                $('#gpaChartFieldSet').remove();
                if (isAllSemestersMode()) {
                    let semData = getSemesterData();
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
                if (isAllSemestersMode() && selectedAcademicYears && selectedAcademicYears.length > 0) {
                    $('#targetCreditsInputWrapper').hide();
                    $('#targetDegreeSelectLabel').text('Mục tiêu năm học:');
                }

                let allTrs = tab.find('tbody tr');
                for (let i = 0; i < allTrs.length; i++) {
                    let idAttr = $(allTrs[i]).attr("id");
                    let item = data.find(d => String(d.id) === String(idAttr));
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

                if (isAllSemestersMode()) {
                    applyYearFilterVisibility();
                }
            }

            // Lightweight update: only refresh numeric values in existing #tbGPA_table
            // without rebuilding the whole fieldset (preserves user target inputs)
            updateGpaStats() {
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
                let totalCourses = (this.activeCoursesCount !== undefined ? this.activeCoursesCount : data.length);
                let inGpaCourses = (totalCourses - this.removedCoursesSize);
                $('#sumCourse').text(totalCourses + ' học phần');
                $('#sumCalCourse').text(inGpaCourses + ' học phần');

                // Update semester/year TC label in target section heading
                if (!isAllSemestersMode()) {
                    let semTotalCredits = 0;
                    data.forEach(item => { if (isCourseInSemesterGpaScope(item)) semTotalCredits += item.credit; });
                    let heading = $('#targetGpaSection div:first-child');
                    if (heading.length) {
                        heading.html('Ước lượng GPA mục tiêu học kỳ (' + semTotalCredits + ' TC):');
                    }
                } else if (selectedAcademicYears && selectedAcademicYears.length > 0) {
                    let yearTotalCredits = 0;
                    data.forEach(item => { if (isCourseInSelectedYears(item) && isCourseInSemesterGpaScope(item)) yearTotalCredits += item.credit; });
                    let heading = $('#targetGpaSection div:first-child');
                    if (heading.length) {
                        heading.html('Ước lượng GPA mục tiêu năm ' + selectedAcademicYears.join(', ') + ' (' + yearTotalCredits + ' TC):');
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
                    let semData = getSemesterData();
                    let canvasEl = $('#gpaTrendCanvas')[0];
                    if (canvasEl && semData && semData.length > 0) {
                        drawGpaChartCanvas(canvasEl, semData);
                    }
                }

                // Update row colors in main courses table
                let allTrs = tab.find('tbody tr');
                for (let i = 0; i < allTrs.length; i++) {
                    let idAttr = $(allTrs[i]).attr("id");
                    let item = data.find(d => String(d.id) === String(idAttr));
                    if (!item) continue;

                    let rowEl = $(allTrs[i]);
                    let childEls = rowEl.find('td, a, input, textarea');

                    if (!item.include) {
                        if (item.whyExclude.includes("không tính")) {
                            rowEl.css({ "color": "blue", "text-decoration": "line-through" });
                            childEls.css({ "color": "blue", "text-decoration": "line-through" });
                        } else {
                            rowEl.css({ "color": "red", "text-decoration": "line-through" });
                            childEls.css({ "color": "red", "text-decoration": "line-through" });
                        }
                    } else {
                        if (item.isCustom || item.wasNoScore || item.isEdited) {
                            rowEl.css({ "color": "blue", "text-decoration": "none" });
                            childEls.css({ "color": "blue", "text-decoration": "none" });
                        } else {
                            rowEl.css({ "color": "", "text-decoration": "" });
                            childEls.css({ "color": "", "text-decoration": "" });
                        }
                    }
                }

                if (isAllSemestersMode()) {
                    applyYearFilterVisibility();
                }
            }
        }


        class ExportPdf {
            constructor() { }

            exportToPdf() {
                let exportData = data.filter(d => isCourseInSelectedYears(d));
                let exportCal = cal;
                if (!exportCal) return;

                let rawUserText = $('#user_tools span').text() || $('#user_tools').text() || "";
                let studentName = "TRÀ VĂN SỸ";
                if (rawUserText.includes("Xin chào")) {
                    let match = rawUserText.match(/Xin\s+chào\s+([^|]+)/i);
                    if (match && match[1]) {
                        studentName = match[1].trim();
                    }
                }

                let degInfo = getDegreeInfo(exportCal.gpa);
                const now = new Date();
                const dateStr = 'Ngày ' + now.getDate() + ' tháng ' + (now.getMonth() + 1) + ' năm ' + now.getFullYear();

                let scopeText = "Tất cả";
                if (!isAllSemestersMode()) {
                    let yearInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi_ob_CbocboNamHoc_gvDKHPLichThiTB').val() || "").trim();
                    let hkInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_gvDKHPLichThi_ob_CbocboHocKy_gvDKHPLichThiTB').val() || "").trim();
                    scopeText = "Học kỳ " + hkInput + " - Năm học " + yearInput;
                } else if (selectedAcademicYears && selectedAcademicYears.length > 0) {
                    scopeText = "Năm học " + selectedAcademicYears.join(', ');
                }

                let rowsHtml = '';
                let stt = 1;
                exportData.forEach(function (row) {
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
                    '@page { size: A4; margin: 15mm 15mm; }' +
                    'body { font-family: "Times New Roman", Times, serif; font-size: 13px; color: #000; line-height: 1.4; margin: 0; padding: 10px; }' +
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
                    '<td style="width: 55%;"><b>Họ và tên sinh viên:</b> ' + studentName + '</td>' +
                    '<td style="width: 45%;"><b>Trình độ đào tạo:</b> Đại học chính quy</td>' +
                    '</tr><tr>' +
                    '<td style="width: 55%;"><b>Trạng thái:</b> Đang học</td>' +
                    '<td style="width: 45%;"><b>Năm học:</b> ' + scopeText + '</td>' +
                    '</tr></table>' +
                    '<table class="transcript-table"><thead><tr>' +
                    '<th style="width: 45px;">STT</th>' +
                    '<th style="width: 90px;">Mã HP</th>' +
                    '<th>Tên học phần</th>' +
                    '<th style="width: 55px;">Số TC</th>' +
                    '<th style="width: 75px;">Thang 10</th>' +
                    '<th style="width: 75px;">Thang 4</th>' +
                    '<th style="width: 75px;">Điểm chữ</th>' +
                    '</tr></thead><tbody>' + rowsHtml + '</tbody></table>' +
                    '<table class="summary-table"><tr>' +
                    '<td style="width: 55%;">' +
                    '<b>Điểm trung bình tích lũy (thang 10):</b> ' + toFixed(exportCal.gpa) + '<br>' +
                    '<b>Điểm trung bình tích lũy (thang 4):</b> ' + toFixed(exportCal.fourGPA) + '' +
                    '</td>' +
                    '<td style="width: 45%;">' +
                    '<b>Tổng số tín chỉ tích lũy:</b> ' + exportCal.totalCredits + ' tín chỉ<br>' +
                    '<b>Xếp loại học lực tích lũy:</b> ' + degInfo.name + '' +
                    '</td>' +
                    '</tr></table>' +
                    '<table class="footer-table"><tr>' +
                    '<td style="width: 50%;"></td>' +
                    '<td style="width: 50%;">' +
                    '<i>TP. Hồ Chí Minh, ' + dateStr + '</i><br>' +
                    '<b>NGƯỜI LẬP BẢNG ĐIỂM</b><br><br><br><br><br>' +
                    '<b>' + studentName + '</b>' +
                    '</td>' +
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
            constructor() { }

            saveToFileCSV() {
                let exportData = data.filter(d => isCourseInSelectedYears(d));
                let exportCal = cal;
                if (!exportCal) return;

                let rawUserText = $('#user_tools span').text() || $('#user_tools').text() || "";
                let studentName = "TRÀ VĂN SỸ";
                if (rawUserText.includes("Xin chào")) {
                    let match = rawUserText.match(/Xin\s+chào\s+([^|]+)/i);
                    if (match && match[1]) {
                        studentName = match[1].trim();
                    }
                }

                let degInfo = getDegreeInfo(exportCal.gpa);
                const now = new Date();
                const dateStr = 'Ngày ' + now.getDate() + ' tháng ' + (now.getMonth() + 1) + ' năm ' + now.getFullYear();

                let scopeText = "Tất cả";
                if (!isAllSemestersMode()) {
                    let yearInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi_ob_CbocboNamHoc_gvDKHPLichThiTB').val() || "").trim();
                    let hkInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_gvDKHPLichThi_ob_CbocboHocKy_gvDKHPLichThiTB').val() || "").trim();
                    scopeText = "Học kỳ " + hkInput + " - Năm học " + yearInput;
                } else if (selectedAcademicYears && selectedAcademicYears.length > 0) {
                    scopeText = "Năm học " + selectedAcademicYears.join(', ');
                }

                let rowsHtml = '';
                let stt = 1;
                exportData.forEach(function (row) {
                    if (row.include) {
                        let scoreVal = (row.score > 0 || (!row.isAbsent && !row.isNoScore)) ? toFixed(row.score) : "-";
                        let letterVal = row.letter || "-";
                        let fourVal = row.fourRounding ? toFixed(row.fourRounding) : "-";

                        let courseParts = row.course.split(' - ');
                        let courseCode = courseParts.length > 1 ? courseParts[0].trim() : (row.ldcode || '');
                        let courseName = courseParts.length > 1 ? courseParts.slice(1).join(' - ').trim() : row.course;

                        rowsHtml += '<tr height="40" style="height: 40px;">' +
                            '<td></td>' +
                            '<td style="border: 1px solid #000; text-align: center; vertical-align: middle; mso-number-format:\'\\@\';">' + stt++ + '</td>' +
                            '<td style="border: 1px solid #000; text-align: center; vertical-align: middle; mso-number-format:\'\\@\';">' + courseCode + '</td>' +
                            '<td style="border: 1px solid #000; text-align: left; vertical-align: middle; padding-left: 8px;">' + courseName + '</td>' +
                            '<td style="border: 1px solid #000; text-align: center; vertical-align: middle;">' + row.credit + '</td>' +
                            '<td style="border: 1px solid #000; text-align: center; vertical-align: middle;">' + scoreVal + '</td>' +
                            '<td style="border: 1px solid #000; text-align: center; vertical-align: middle;">' + fourVal + '</td>' +
                            '<td style="border: 1px solid #000; text-align: center; vertical-align: middle;">' + letterVal + '</td>' +
                            '</tr>';
                    }
                });

                let excelHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
                    '<head><meta charset="utf-8" />' +
                    '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>BangDiem</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
                    '<style>' +
                    'body, table, td, th { font-family: "Times New Roman", Times, serif; font-size: 11pt; color: #000; }' +
                    'table { border-collapse: collapse; width: 100%; }' +
                    'th, td { padding: 5px 8px; }' +
                    '</style>' +
                    '</head>' +
                    '<body>' +
                    '<table>' +
                    '<colgroup>' +
                    '  <col width="30" style="width: 30px;">' +
                    '  <col width="50" style="width: 50px;">' +
                    '  <col width="95" style="width: 95px;">' +
                    '  <col width="320" style="width: 320px;">' +
                    '  <col width="75" style="width: 75px;">' +
                    '  <col width="95" style="width: 95px;">' +
                    '  <col width="95" style="width: 95px;">' +
                    '  <col width="95" style="width: 95px;">' +
                    '</colgroup>' +
                    '<tr height="30" style="height: 30px;">' +
                    '<td></td>' +
                    '<td colspan="3" style="text-align: center; font-size: 10pt; font-weight: bold; white-space: nowrap; vertical-align: middle;">ĐẠI HỌC QUỐC GIA TP.HỒ CHÍ MINH</td>' +
                    '<td colspan="4" style="text-align: center; font-size: 10pt; font-weight: bold; white-space: nowrap; vertical-align: middle;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</td>' +
                    '</tr>' +
                    '<tr height="30" style="height: 30px;">' +
                    '<td></td>' +
                    '<td colspan="3" style="text-align: center; font-size: 10pt; font-weight: bold; white-space: nowrap; vertical-align: middle;">TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN</td>' +
                    '<td colspan="4" style="text-align: center; font-size: 10pt; font-weight: bold; white-space: nowrap; vertical-align: middle;">Độc lập - Tự do - Hạnh phúc</td>' +
                    '</tr>' +
                    '<tr height="24" style="height: 24px;"><td colspan="8">&nbsp;</td></tr>' +
                    '<tr height="48" style="height: 48px;">' +
                    '<td></td>' +
                    '<td colspan="7" style="text-align: center; font-size: 16pt; font-weight: bold; vertical-align: middle; white-space: nowrap;">BẢNG ĐIỂM HỌC TẬP</td>' +
                    '</tr>' +
                    '<tr height="24" style="height: 24px;"><td colspan="8">&nbsp;</td></tr>' +
                    '<tr height="32" style="height: 32px;">' +
                    '<td></td>' +
                    '<td colspan="3" style="font-size: 11pt; white-space: nowrap; vertical-align: middle;"><b>Họ và tên sinh viên:</b> ' + studentName + '</td>' +
                    '<td colspan="4" style="font-size: 11pt; white-space: nowrap; vertical-align: middle;"><b>Trình độ đào tạo:</b> Đại học chính quy</td>' +
                    '</tr>' +
                    '<tr height="32" style="height: 32px;">' +
                    '<td></td>' +
                    '<td colspan="3" style="font-size: 11pt; white-space: nowrap; vertical-align: middle;"><b>Trạng thái:</b> Đang học</td>' +
                    '<td colspan="4" style="font-size: 11pt; white-space: nowrap; vertical-align: middle;"><b>Năm học:</b> ' + scopeText + '</td>' +
                    '</tr>' +
                    '<tr height="24" style="height: 24px;"><td colspan="8">&nbsp;</td></tr>' +
                    '<thead>' +
                    '<tr height="40" style="height: 40px;">' +
                    '<th style="border: none; background: transparent;"></th>' +
                    '<th style="border: 1px solid #000; background-color: #f2f2f2; text-align: center; width: 50px; vertical-align: middle;">STT</th>' +
                    '<th style="border: 1px solid #000; background-color: #f2f2f2; text-align: center; width: 95px; vertical-align: middle;">Mã HP</th>' +
                    '<th style="border: 1px solid #000; background-color: #f2f2f2; text-align: left; width: 320px; vertical-align: middle; padding-left: 8px;">Tên học phần</th>' +
                    '<th style="border: 1px solid #000; background-color: #f2f2f2; text-align: center; width: 75px; vertical-align: middle;">Số TC</th>' +
                    '<th style="border: 1px solid #000; background-color: #f2f2f2; text-align: center; width: 95px; vertical-align: middle;">Thang 10</th>' +
                    '<th style="border: 1px solid #000; background-color: #f2f2f2; text-align: center; width: 95px; vertical-align: middle;">Thang 4</th>' +
                    '<th style="border: 1px solid #000; background-color: #f2f2f2; text-align: center; width: 95px; vertical-align: middle;">Điểm chữ</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>' + rowsHtml + '</tbody>' +
                    '<tr height="24" style="height: 24px;"><td colspan="8">&nbsp;</td></tr>' +
                    '<tr height="32" style="height: 32px;">' +
                    '<td></td>' +
                    '<td colspan="3" style="font-size: 11pt; white-space: nowrap; vertical-align: middle;"><b>Điểm trung bình tích lũy (thang 10):</b> ' + toFixed(exportCal.gpa) + '</td>' +
                    '<td colspan="4" style="font-size: 11pt; white-space: nowrap; vertical-align: middle;"><b>Tổng số tín chỉ tích lũy:</b> ' + exportCal.totalCredits + ' tín chỉ</td>' +
                    '</tr>' +
                    '<tr height="32" style="height: 32px;">' +
                    '<td></td>' +
                    '<td colspan="3" style="font-size: 11pt; white-space: nowrap; vertical-align: middle;"><b>Điểm trung bình tích lũy (thang 4):</b> ' + toFixed(exportCal.fourGPA) + '</td>' +
                    '<td colspan="4" style="font-size: 11pt; white-space: nowrap; vertical-align: middle;"><b>Xếp loại học lực tích lũy:</b> ' + degInfo.name + '</td>' +
                    '</tr>' +
                    '<tr height="24" style="height: 24px;"><td colspan="8">&nbsp;</td></tr>' +
                    '<tr height="32" style="height: 32px;">' +
                    '<td></td>' +
                    '<td colspan="3"></td>' +
                    '<td colspan="4" style="text-align: center; font-style: italic; font-size: 11pt; white-space: nowrap; vertical-align: middle;">TP. Hồ Chí Minh, ' + dateStr + '</td>' +
                    '</tr>' +
                    '<tr height="32" style="height: 32px;">' +
                    '<td></td>' +
                    '<td colspan="3"></td>' +
                    '<td colspan="4" style="text-align: center; font-weight: bold; font-size: 11pt; white-space: nowrap; vertical-align: middle;">NGƯỜI LẬP BẢNG ĐIỂM</td>' +
                    '</tr>' +
                    '<tr height="70" style="height: 70px;"><td colspan="8"></td></tr>' +
                    '<tr height="32" style="height: 32px;">' +
                    '<td></td>' +
                    '<td colspan="3"></td>' +
                    '<td colspan="4" style="text-align: center; font-weight: bold; font-size: 11pt; white-space: nowrap; vertical-align: middle;">' + studentName + '</td>' +
                    '</tr>' +
                    '<tr height="24" style="height: 24px;"><td colspan="8">&nbsp;</td></tr>' +
                    '<tr height="30" style="height: 30px;">' +
                    '<td></td>' +
                    '<td colspan="7" style="font-size: 10pt; font-style: italic; color: #444; vertical-align: middle;">(*): Bảng điểm này không thay thế bảng điểm chính thức từ Phòng đào tạo.</td>' +
                    '</tr>' +
                    '</table>' +
                    '</body></html>';

                let blob = new Blob(['\uFEFF' + excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
                let url = URL.createObjectURL(blob);
                let hiddenElement = document.createElement('a');
                hiddenElement.href = url;
                hiddenElement.download = 'BangDiem_' + studentName.replace(/\s+/g, '_') + '.xls';
                document.body.appendChild(hiddenElement);
                hiddenElement.click();
                setTimeout(() => {
                    document.body.removeChild(hiddenElement);
                    URL.revokeObjectURL(url);
                }, 100);
            }
        }

        // MAIN EXECUTION FLOW

        function refreshAllDataAndUI() {
            initUserCourseData();
            addSupplementaryGrade();
            renderEditableScoreCells();
            cal = new Calculation();
            cal.calculateGPA();
            cal.formatCoursesTableAndCreateResultTable();
            saveGpaSimulationData();
            // Render custom rows LAST — after all DOM manipulations and DataTables redraws
            // that happen inside addSupplementaryGrade/formatCoursesTableAndCreateResultTable.
            // If custom rows are appended earlier, those redraws wipe them from the tbody.
            renderCustomCoursesInTable();
            if (isAllSemestersMode()) {
                applyYearFilterVisibility();
                setupYearFilterDropdown();
            }
        }

        let cal = null;
        refreshAllDataAndUI();

        function getLiveScoreValue(a) {
            if (typeof a === 'string') {
                let match = a.match(/data-id=["']([^"']+)["']/);
                if (match && match[1]) {
                    let id = match[1];
                    let liveInput = $('#tbDiemThiGK input.gpa-score-input[data-id="' + id + '"]');
                    if (liveInput.length) {
                        let val = liveInput.val().trim().replace(',', '.');
                        let num = parseFloat(val);
                        return !isNaN(num) ? num : 0;
                    }
                }
                let valMatch = a.match(/value=["']([^"']*)["']/);
                if (valMatch && valMatch[1]) {
                    let num = parseFloat(valMatch[1].replace(',', '.'));
                    if (!isNaN(num)) return num;
                }
            }
            return parseFloat(a) || 0;
        }

        function getRowSortValue(tr, colIndex) {
            let $tr = $(tr);
            let tds = $tr.children('td');
            if (colIndex === 0) {
                return $tr.find('.gpa-checkbox input').is(':checked') ? 1 : 0;
            }
            if (colIndex === 1) {
                let semInput = $tr.find('.gpa-custom-sem-input');
                return semInput.length ? semInput.val().trim() : $(tds[1]).text().trim();
            }
            if (colIndex === 2) {
                let nameInput = $tr.find('.gpa-custom-name-input');
                return nameInput.length ? nameInput.val().trim() : $(tds[2]).text().trim();
            }
            if (colIndex === 3) {
                let creditInput = $tr.find('.gpa-custom-credit-input');
                let val = creditInput.length ? creditInput.val().trim() : $(tds[3]).text().trim();
                let num = parseFloat(val);
                return !isNaN(num) ? num : 0;
            }
            if (colIndex === 6) {
                let scoreInput = $tr.find('.gpa-score-input');
                let val = scoreInput.length ? scoreInput.val().trim().replace(',', '.') : $(tds[6]).text().trim().replace(',', '.');
                let num = parseFloat(val);
                return !isNaN(num) ? num : -1;
            }
            if (colIndex === 7) {
                return $tr.find('.gpa-letter-col').text().trim() || $(tds[7]).text().trim();
            }
            if (colIndex === 8) {
                let fourCol = $tr.find('.gpa-four-col');
                let val = fourCol.length ? fourCol.text().trim().replace(',', '.') : $(tds[8]).text().trim().replace(',', '.');
                let num = parseFloat(val);
                return !isNaN(num) ? num : -1;
            }
            return $(tds[colIndex]).text().trim();
        }

        // Custom DataTables 1.9 Numeric Sorter for Score Inputs (Reads Live DOM)
        try {
            $.fn.dataTableExt.oSort['gpa-score-asc'] = function (a, b) {
                return getLiveScoreValue(a) - getLiveScoreValue(b);
            };
            $.fn.dataTableExt.oSort['gpa-score-desc'] = function (a, b) {
                return getLiveScoreValue(b) - getLiveScoreValue(a);
            };
        } catch (e) { }

        // Safe DataTables destruction compatible with legacy DataTables 1.9 used by HCMUS Portal
        try {
            tab.dataTable().fnDestroy();
        } catch (e) { }

        tab.dataTable({
            "bPaginate": false,
            "bJQueryUI": true,
            "bAutoWidth": false,
            "aaSorting": [],
            "aoColumnDefs": [
                { "sWidth": '50%', "aTargets": [2] },
                { "sType": "gpa-score", "aTargets": [6, 8] },
                { "sType": "numeric", "aTargets": [3] }
            ],
            "fnDrawCallback": function (oSettings) {
                renderCustomCoursesInTable();

                if (oSettings && oSettings.aaSorting && oSettings.aaSorting.length > 0) {
                    let sortCol = oSettings.aaSorting[0][0];
                    let sortDir = oSettings.aaSorting[0][1];

                    let rows = tab.find('tbody tr').get();
                    rows.sort(function (a, b) {
                        let valA = getRowSortValue(a, sortCol);
                        let valB = getRowSortValue(b, sortCol);
                        let comp = 0;
                        if (typeof valA === 'number' && typeof valB === 'number') {
                            comp = valA - valB;
                        } else {
                            comp = String(valA).localeCompare(String(valB), 'vi', { numeric: true, sensitivity: 'base' });
                        }
                        return sortDir === 'asc' ? comp : -comp;
                    });

                    let tbody = tab.find('tbody');
                    $.each(rows, function (idx, row) {
                        tbody.append(row);
                    });
                    tab.find('tbody tr').each(function (idx) {
                        $(this).removeClass('odd even').addClass(idx % 2 === 0 ? 'odd' : 'even');
                    });
                }

                if (isAllSemestersMode()) {
                    applyYearFilterVisibility();
                }
            }
        });
        tab.css({ 'width': '100%', 'margin': '0' });

        if (isAllSemestersMode()) {
            setupYearFilterDropdown();
            applyYearFilterVisibility();
        }



        // Checkbox toggle listener
        $('#tbDiemThiGK').off('change', '.gpa-checkbox input[type="checkbox"]');
        $('#tbDiemThiGK').on('change', '.gpa-checkbox input[type="checkbox"]', function () {
            window._gpaIsUserEditingOrRestored = true;
            let courseRow = $(this).closest("tr");
            let idCourse = $(courseRow).attr("id");

            let item = data.find(d => String(d.id) === String(idCourse));
            if (item) {
                item.include = $(this).is(":checked");
            }
            $(this).siblings().first().text($(this).is(":checked") ? 1 : 0);

            refreshAllDataAndUI();
        });

        // Prevent Enter key in score inputs, target planner inputs, and custom inputs from submitting ASP.NET webform!
        $(document).off('keydown', '.gpa-score-input, #targetCreditsInput, #targetCustomGpaInput, .gpa-custom-sem-input, .gpa-custom-name-input, .gpa-custom-credit-input');
        $(document).on('keydown', '.gpa-score-input, #targetCreditsInput, #targetCustomGpaInput, .gpa-custom-sem-input, .gpa-custom-name-input, .gpa-custom-credit-input', function (e) {
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
            window._gpaIsUserEditingOrRestored = true;
            let idAttr = $(this).attr("data-id");
            let item = data.find(d => String(d.id) === String(idAttr));
            if (!item) return;

            let rawVal = $(this).val().trim().replace(',', '.');

            if (rawVal === "") {
                item.score = 0;
                item.include = false;
                item.isNoScore = true;
                item.isEdited = (item.originalScore !== null);
                item.whyExclude = "Chưa hoặc không có điểm. ";
            } else {
                let newScore = parseFloat(rawVal);
                if (!isNaN(newScore) && newScore >= 0 && newScore <= 10) {
                    item.score = newScore;
                    item.isAbsent = false;
                    item.isNoScore = false;
                    item.isEdited = (item.originalScore !== null && newScore !== item.originalScore);

                    if (item.score >= 5) {
                        item.include = true;
                        item.whyExclude = "";
                    } else {
                        item.include = false;
                        item.whyExclude = "Điểm nhỏ hơn 5, chưa qua môn. ";
                    }
                } else {
                    item.score = 0;
                    item.include = false;
                    item.isNoScore = true;
                    item.isEdited = (item.originalScore !== null);
                    item.whyExclude = "Điểm không hợp lệ (phải từ 0 đến 10). ";
                }
            }

            // Sync with customCoursesList if item is custom course
            if (item.isCustom) {
                let cInList = customCoursesList.find(c => String(c.id) === String(item.id));
                if (cInList) {
                    cInList.score = item.score;
                    cInList.letter = item.letter;
                    cInList.fourRounding = item.fourRounding;
                    cInList.include = item.include;
                    cInList.isNoScore = item.isNoScore;
                    cInList.whyExclude = item.whyExclude;
                    window._gpaCustomCoursesList = customCoursesList;
                }
            }

            // Update letter & 4.0 scale in memory & DOM without re-rendering inputs
            addSupplementaryGrade();
            let courseRow = $(this).closest("tr");
            courseRow.find('.gpa-letter-col').text(item.letter || '-');
            courseRow.find('.gpa-four-col').text(item.fourRounding || 0);

            // Sync Checkbox state in DOM
            courseRow.find(".gpa-checkbox input[type='checkbox']").prop("checked", item.include);
            courseRow.find(".gpa-checkbox div[hidden]").text(item.include ? 1 : 0);

            saveGpaSimulationData();

            // Recalculate GPA & update result summary stats without rebuilding fieldset
            // so user's Target GPA inputs are preserved
            if (cal) {
                let newCal = new Calculation();
                newCal.calculateGPA();
                newCal.updateGpaStats();
                cal = newCal;
            }
        });

        // Custom Course Inline Input Listeners
        $('#tbDiemThiGK').off('input change', '.gpa-custom-sem-input');
        $('#tbDiemThiGK').on('input change', '.gpa-custom-sem-input', function () {
            let idCourse = $(this).attr("data-id");
            let item = data.find(d => String(d.id) === String(idCourse));
            if (item) {
                item.semester = $(this).val().trim() || "-";
                let cInList = customCoursesList.find(c => String(c.id) === String(idCourse));
                if (cInList) cInList.semester = item.semester;
                $(this).siblings('span').text(item.semester + '_z');
                window._gpaCustomCoursesList = customCoursesList;
                saveGpaSimulationData();
            }
        });

        $('#tbDiemThiGK').off('input change', '.gpa-custom-name-input');
        $('#tbDiemThiGK').on('input change', '.gpa-custom-name-input', function () {
            let idCourse = $(this).attr("data-id");
            let item = data.find(d => String(d.id) === String(idCourse));
            if (item) {
                let val = $(this).val();
                item.course = val ? val : "-";
                $(this).attr("title", item.course);
                let cInList = customCoursesList.find(c => String(c.id) === String(idCourse));
                if (cInList) cInList.course = item.course;
                window._gpaCustomCoursesList = customCoursesList;
                saveGpaSimulationData();
            }
            autoResizeTextarea(this);
        });

        $('#tbDiemThiGK').off('input change', '.gpa-custom-credit-input');
        $('#tbDiemThiGK').on('input change', '.gpa-custom-credit-input', function () {
            let idCourse = $(this).attr("data-id");
            let item = data.find(d => String(d.id) === String(idCourse));
            if (item) {
                let val = parseInt($(this).val().trim()) || 0;
                item.credit = val > 0 ? val : 0;
                let cInList = customCoursesList.find(c => String(c.id) === String(idCourse));
                if (cInList) cInList.credit = item.credit;
                window._gpaCustomCoursesList = customCoursesList;
                saveGpaSimulationData();

                if (cal) {
                    let newCal = new Calculation();
                    newCal.calculateGPA();
                    newCal.updateGpaStats();
                    cal = newCal;
                }
            }
        });

        // Delete Custom Course Listener
        $(document).off('click', '.gpa-btn-del-custom');
        $(document).on('click', '.gpa-btn-del-custom', function (e) {
            e.preventDefault();
            window._gpaIsUserEditingOrRestored = true;
            let delId = $(this).attr('data-custom-id');
            if (delId) {
                // Read semester & course from DOM row for precise matching (avoids removing
                // multiple courses that happen to share the same legacy numeric id)
                let $row = $(this).closest('tr.gpa-custom-row');
                let delSem = $row.find('.gpa-custom-sem-input').val() || '';
                let delCourse = $row.find('.gpa-custom-name-input').val() || '';

                // Remove exactly ONE matching entry (first found) from in-memory list
                let removedOne = false;
                customCoursesList = customCoursesList.filter(c => {
                    if (!removedOne && String(c.id) === String(delId) &&
                        (c.semester || '') === delSem && (c.course || '') === delCourse) {
                        removedOne = true;
                        return false; // remove this one
                    }
                    return true;
                });
                window._gpaCustomCoursesList = customCoursesList;

                // Sync to localStorage immediately (handles empty-list case too)
                try {
                    let existingRaw = localStorage.getItem('gpa_saved_custom_courses');
                    let existingCustom = existingRaw ? JSON.parse(existingRaw) : [];
                    let lsRemovedOne = false;
                    let updatedCustom = existingCustom.filter(c => {
                        if (!lsRemovedOne && String(c.id) === String(delId) &&
                            (c.semester || '') === delSem && (c.course || '') === delCourse) {
                            lsRemovedOne = true;
                            return false;
                        }
                        return true;
                    });
                    localStorage.setItem('gpa_saved_custom_courses', JSON.stringify(updatedCustom));
                } catch (e2) { }

                refreshAllDataAndUI();
            }
        });

        // Add Custom Course Row Button & Save CSV/PDF Buttons
        if (!$('#btnAddCustomRow')[0]) {
            let addCustomButton = $('#ob_iBbtnXemDiemThiContainer').clone().attr("id", "btnAddCustomRow");
            $(addCustomButton).attr("style", "width: 21%; display: inline-block; margin-right: 8px; margin-bottom: 10px;");
            $($(addCustomButton).find(".ob_iBC")[0]).text("+ Thêm môn học dự kiến");
            $(addCustomButton).insertBefore('#tbDiemThiGK_wrapper');

            $(addCustomButton).click(function (e) {
                e.preventDefault();
                $('#gpaCustomAddPanel').slideToggle(150, function () {
                    if ($(this).is(':visible')) {
                        $('#gpaNewCourseName').focus();
                    }
                });
            });
        }

        if (!$('#saveCoursesList')[0]) {
            let saveCoursesList = new SaveCoursesList();
            let exportPdf = new ExportPdf();

            let saveButton = $('#ob_iBbtnXemDiemThiContainer').clone().attr("id", "saveCoursesList");
            $(saveButton).attr("style", "width: 19%; display: inline-block; margin-right: 8px; margin-bottom: 10px;");
            $($(saveButton).find(".ob_iBC")[0]).text("Xuất bảng điểm (Excel)");
            $(saveButton).insertAfter('#btnAddCustomRow');
            $(saveButton).click(function (event) {
                event.preventDefault();
                saveCoursesList.saveToFileCSV();
            });

            let pdfButton = $('#ob_iBbtnXemDiemThiContainer').clone().attr("id", "exportPdfList");
            $(pdfButton).attr("style", "width: 19%; display: inline-block; margin-right: 8px; margin-bottom: 10px;");
            $($(pdfButton).find(".ob_iBC")[0]).text("Xuất bảng điểm (PDF)");
            $(pdfButton).insertAfter(saveButton);
            $(pdfButton).click(function (event) {
                event.preventDefault();
                exportPdf.exportToPdf();
            });

            let resetButton = $('#ob_iBbtnXemDiemThiContainer').clone().attr("id", "resetGpaBookmarklet");
            $(resetButton).attr("style", "width: 11%; display: inline-block; margin-right: 8px; margin-bottom: 10px;");
            $($(resetButton).find(".ob_iBC")[0]).text("Reset");
            $(resetButton).insertAfter(pdfButton);
            $(resetButton).click(function (event) {
                event.preventDefault();

                if (isAllSemestersMode()) {
                    localStorage.removeItem('gpa_saved_custom_courses');
                    localStorage.removeItem('gpa_saved_edited_scores');
                    window._gpaSavedEditedScores = {};
                    customCoursesList = [];
                    window._gpaCustomCoursesList = [];
                    selectedAcademicYears = [];
                    if ($('#gpaYearFilterBtn').length) {
                        updateYearFilterBtnText();
                        setupYearFilterDropdown();
                    }
                } else {
                    let yearInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi_ob_CbocboNamHoc_gvDKHPLichThiTB').val() || "").trim().toLowerCase();
                    if (!yearInput || yearInput === "0") {
                        yearInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi').val() || "").trim().toLowerCase();
                    }
                    let hkInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_gvDKHPLichThi_ob_CbocboHocKy_gvDKHPLichThiTB').val() || "").trim().toLowerCase();
                    if (!hkInput) {
                        hkInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_gvDKHPLichThi').val() || "").trim().toLowerCase();
                    }
                    let targetSem = (yearInput + '/' + hkInput).toLowerCase();
                    let prefix = targetSem + "_";

                    // 1. Remove custom courses of this semester from LocalStorage & Memory
                    let savedCustom = localStorage.getItem('gpa_saved_custom_courses');
                    if (savedCustom) {
                        let parsed = JSON.parse(savedCustom);
                        let keptCustom = parsed.filter(c => !isCustomCourseInScope(c));
                        localStorage.setItem('gpa_saved_custom_courses', JSON.stringify(keptCustom));
                        window._gpaCustomCoursesList = keptCustom;
                        customCoursesList = keptCustom;
                    }

                    // 2. Remove edited scores of this semester from LocalStorage & Memory
                    let savedScores = localStorage.getItem('gpa_saved_edited_scores');
                    if (savedScores) {
                        let parsed = JSON.parse(savedScores);
                        let keptScores = {};
                        Object.keys(parsed).forEach(k => {
                            if (!k.toLowerCase().startsWith(prefix)) {
                                keptScores[k] = parsed[k];
                            }
                        });
                        localStorage.setItem('gpa_saved_edited_scores', JSON.stringify(keptScores));

                        // Sync memory
                        if (window._gpaSavedEditedScores) {
                            Object.keys(window._gpaSavedEditedScores).forEach(k => {
                                if (k.toLowerCase().startsWith(prefix)) {
                                    delete window._gpaSavedEditedScores[k];
                                }
                            });
                        }
                    }
                }

                tab.find('tbody tr.gpa-custom-row').remove();

                $('#tbDiemThiGK tbody tr').not('.gpa-custom-row').each(function () {
                    let serverAttr = $(this).attr('data-server-score');
                    let tds = $(this).find("td").not(".gpa-checkbox");
                    let courseName = $(tds[1]).text().trim();
                    let scoreTd = tds.eq(5);

                    let isExcept = isExceptCourseName(courseName);

                    // Restore scoreTd to original server text BEFORE clearing attributes
                    if (serverAttr === 'null' || serverAttr === undefined || serverAttr === '') {
                        scoreTd.html('-');
                        $(this).find(".gpa-checkbox input[type='checkbox']").prop("checked", false);
                        $(this).find(".gpa-checkbox div[hidden]").text("0");
                    } else {
                        scoreTd.html(serverAttr);
                        let origNum = parseFloat(serverAttr);
                        let isPassed = !isNaN(origNum) && origNum >= 5 && !isExcept;
                        $(this).find(".gpa-checkbox input[type='checkbox']").prop("checked", isPassed);
                        $(this).find(".gpa-checkbox div[hidden]").text(isPassed ? "1" : "0");
                    }

                    $(this).removeAttr('data-server-score');
                    $(this).removeAttr('data-gpa-row-key');
                    $(this).removeAttr("style");
                    $(this).find('td, a').css({ "color": "", "text-decoration": "" });
                });

                // Show the restore button again if there is restorable data for other semesters or we just cleared
                $('#restoreGpaHistory').remove();
                if (hasRestorableData() && !$('#restoreGpaHistory')[0]) {
                    let restoreButton = $('#ob_iBbtnXemDiemThiContainer').clone().attr("id", "restoreGpaHistory");
                    $(restoreButton).attr("style", "width: 17%; display: inline-block; margin-bottom: 10px;");
                    $($(restoreButton).find(".ob_iBC")[0]).text("Khôi phục lịch sử");
                    $(restoreButton).insertAfter(resetButton);
                    if ($('#gpaCustomAddPanel')[0]) {
                        $('#gpaCustomAddPanel').insertAfter(restoreButton);
                    }
                    $(restoreButton).click(function (event) {
                        event.preventDefault();
                        restoreGpaSimulationData();
                        $(this).css({ 'opacity': '0.5', 'cursor': 'not-allowed' }).off('click').click(e => e.preventDefault());
                    });
                }

                refreshAllDataAndUI();
            });

            // Add Restore History button if there is saved data in local storage
            if (hasRestorableData() && !$('#restoreGpaHistory')[0]) {
                let restoreButton = $('#ob_iBbtnXemDiemThiContainer').clone().attr("id", "restoreGpaHistory");
                $(restoreButton).attr("style", "width: 17%; display: inline-block; margin-bottom: 10px;");
                $($(restoreButton).find(".ob_iBC")[0]).text("Khôi phục lịch sử");
                $(restoreButton).insertAfter(resetButton);
                if ($('#gpaCustomAddPanel')[0]) {
                    $('#gpaCustomAddPanel').insertAfter(restoreButton);
                }
                $(restoreButton).click(function (event) {
                    event.preventDefault();
                    restoreGpaSimulationData();
                    $(this).css({ 'opacity': '0.5', 'cursor': 'not-allowed' }).off('click').click(e => e.preventDefault());
                });
            }

            function generateSemesterSelectOptions() {
                let yearInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi_ob_CbocboNamHoc_gvDKHPLichThiTB').val() || "").trim();
                let hkInput = ($('#ctl00_ContentPlaceHolder1_ctl00_cboHocKy_gvDKHPLichThi_ob_CbocboHocKy_gvDKHPLichThiTB').val() || "").trim();

                let minFoundYear = 9999;

                $('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi_ob_CbocboNamHoc_gvDKHPLichThiItemsContainer li').each(function () {
                    let txt = $(this).text().trim();
                    let match = txt.match(/(\d{2})-\d{2}/);
                    if (match && match[1]) {
                        let y = parseInt(match[1]);
                        if (!isNaN(y) && y < minFoundYear) minFoundYear = y;
                    }
                });

                if (data && data.length) {
                    data.forEach(d => {
                        if (d.semester && d.semester.includes('-')) {
                            let y = parseInt(d.semester.split('-')[0]);
                            if (!isNaN(y) && y < minFoundYear) minFoundYear = y;
                        }
                    });
                }

                if (minFoundYear === 9999) {
                    if (yearInput.includes('-')) {
                        let y = parseInt(yearInput.split('-')[0]);
                        if (!isNaN(y)) minFoundYear = y;
                    } else {
                        let curSysYear = (new Date().getFullYear()) % 100;
                        minFoundYear = curSysYear - 2;
                    }
                }

                let startYear = minFoundYear;

                let allEightYearsSemesters = [];
                for (let y = startYear; y < startYear + 8; y++) {
                    let yStr = y + '-' + (y + 1);
                    for (let hk = 1; hk <= 3; hk++) {
                        allEightYearsSemesters.push({
                            val: yStr + '/' + hk,
                            yearNum: y,
                            hkNum: hk,
                            label: yStr + '/' + hk + (hk === 3 ? ' (Hè)' : '')
                        });
                    }
                }

                let currentSemVal = "";
                if (!isAllSemestersMode() && yearInput && hkInput) {
                    currentSemVal = yearInput + '/' + hkInput;
                }

                let curYearNum = 0;
                let curHkNum = 0;
                if (currentSemVal) {
                    let parts = currentSemVal.split('/');
                    if (parts[0] && parts[0].includes('-')) curYearNum = parseInt(parts[0].split('-')[0]);
                    if (parts[1]) curHkNum = parseInt(parts[1]);
                }

                let filteredSemesters = allEightYearsSemesters.filter(item => {
                    if (!currentSemVal || isNaN(curYearNum) || isNaN(curHkNum) || curYearNum === 0) return true;
                    if (item.yearNum > curYearNum) return true;
                    if (item.yearNum === curYearNum && item.hkNum >= curHkNum) return true;
                    return false;
                });

                let defaultSem = currentSemVal || (filteredSemesters.length ? filteredSemesters[0].val : "");
                let optionsHtml = '';

                filteredSemesters.forEach(item => {
                    let isSel = (item.val === defaultSem) ? ' selected' : '';
                    optionsHtml += '<option value="' + item.val + '"' + isSel + '>' + item.label + '</option>';
                });

                return optionsHtml;
            }

            // Inject Inline Add Custom Course Panel right below the action buttons
            if (!$('#gpaCustomAddPanel')[0]) {
                let semOptions = generateSemesterSelectOptions();
                let panelHtml = '<div id="gpaCustomAddPanel" style="display:none; margin-top:10px; margin-bottom:15px; background: none repeat scroll 0 0 menu; border: 1px solid #CCCCCC; border-radius: 7px; padding: 15px 20px; font-size:13px; box-sizing:border-box;">' +
                    '<div style="font-weight:bold; margin-bottom:12px; color:#000; font-size:16px;">Thêm môn học dự kiến</div>' +
                    '<div style="display:flex; flex-wrap:wrap; gap:15px; align-items:flex-end;">' +
                    '<div style="flex:2; min-width:200px;">' +
                    '<label style="display:block; font-size:14px; margin-bottom:4px; color:#000; font-weight:bold;">Tên môn học:</label>' +
                    '<input type="text" id="gpaNewCourseName" placeholder="Vd: Thiết kế phần mềm" style="width:100%; height:28px; border:1px solid #c0c0c0; border-radius:3px; padding:3px 8px; font-size:13px; font-family:inherit; box-sizing:border-box; background:#fff; vertical-align:middle;" />' +
                    '</div>' +
                    '<div style="flex:1; min-width:80px; max-width:110px;">' +
                    '<label style="display:block; font-size:14px; margin-bottom:4px; color:#000; font-weight:bold;">Số tín chỉ:</label>' +
                    '<input type="number" id="gpaNewCourseCredit" placeholder="Vd: 4" min="1" max="15" value="4" style="width:100%; height:28px; border:1px solid #c0c0c0; border-radius:3px; padding:3px 8px; font-size:13px; font-family:inherit; text-align:center; box-sizing:border-box; background:#fff; vertical-align:middle;" />' +
                    '</div>' +
                    '<div style="flex:1; min-width:110px; max-width:140px;">' +
                    '<label style="display:block; font-size:14px; margin-bottom:4px; color:#000; font-weight:bold;">Học kỳ:</label>' +
                    '<select id="gpaNewCourseSem" style="width:100%; height:28px; border:1px solid #c0c0c0; border-radius:3px; padding:3px 6px; font-size:13px; font-family:inherit; text-align:center; box-sizing:border-box; background:#fff; vertical-align:middle;">' + semOptions + '</select>' +
                    '</div>' +
                    '<div style="flex:1; min-width:90px; max-width:120px;">' +
                    '<label style="display:block; font-size:14px; margin-bottom:4px; color:#000; font-weight:bold;">Điểm dự kiến:</label>' +
                    '<input type="text" id="gpaNewCourseScore" placeholder="-" style="width:100%; height:28px; border:1px solid #c0c0c0; border-radius:3px; padding:3px 8px; font-size:13px; font-family:inherit; text-align:center; box-sizing:border-box; background:#fff; vertical-align:middle;" />' +
                    '</div>' +
                    '<div style="display:flex; gap:8px;" id="gpaCustomAddPanelActionBtns"></div>' +
                    '</div>' +
                    '</div>';
                let panelEl = $(panelHtml);
                let panelTarget = $('#restoreGpaHistory')[0] ? $('#restoreGpaHistory') : resetButton;
                panelEl.insertAfter(panelTarget);

                let btnSubmit = $('#ob_iBbtnXemDiemThiContainer').clone().attr("id", "gpaBtnSubmitCustomCourse");
                $(btnSubmit).attr("style", "display: inline-block; margin-right: 5px;");
                $($(btnSubmit).find(".ob_iBC")[0]).text("Thêm");

                let btnCancel = $('#ob_iBbtnXemDiemThiContainer').clone().attr("id", "gpaBtnCancelCustomCourse");
                $(btnCancel).attr("style", "display: inline-block;");
                $($(btnCancel).find(".ob_iBC")[0]).text("Hủy");

                panelEl.find('#gpaCustomAddPanelActionBtns').append(btnSubmit).append(btnCancel);
            }
        }

        // Custom Add Panel Listeners
        $(document).off('click', '#gpaBtnCancelCustomCourse');
        $(document).on('click', '#gpaBtnCancelCustomCourse', function (e) {
            e.preventDefault();
            $('#gpaCustomAddPanel').slideUp(150);
        });

        $(document).off('click', '#gpaBtnSubmitCustomCourse');
        $(document).on('click', '#gpaBtnSubmitCustomCourse', function (e) {
            e.preventDefault();
            window._gpaIsUserEditingOrRestored = true;
            let nameVal = ($('#gpaNewCourseName').val() || "").trim();
            let creditVal = parseInt($('#gpaNewCourseCredit').val()) || 4;
            let semVal = ($('#gpaNewCourseSem').val() || "").trim() || "-";
            let rawScore = ($('#gpaNewCourseScore').val() || "").trim().replace(',', '.');
            let parsedScore = parseFloat(rawScore);

            let isScoreValid = !isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 10;
            let itemScore = isScoreValid ? parsedScore : 0;
            let isNoScore = !isScoreValid || rawScore === "" || rawScore === "-";
            let inc = isScoreValid ? (itemScore >= 5) : false;

            let { year, hk } = getSelectedYearAndHk();
            let currentTargetSem = (year && hk && !isAllSemestersMode()) ? (year + '/' + hk) : "";

            let newCustomItem = {
                id: 'custom_' + Date.now(),
                semester: semVal,
                addedInSem: currentTargetSem,
                course: nameVal || "Môn dự kiến",
                credit: creditVal,
                class: "DK",
                ldcode: "",
                score: itemScore,
                originalScore: null,
                note: "Môn dự kiến",
                include: inc,
                whyExclude: (isScoreValid && itemScore < 5) ? "Điểm nhỏ hơn 5, chưa qua môn. " : (isNoScore ? "Chưa hoặc không có điểm. " : ""),
                isAbsent: false,
                isNoScore: isNoScore,
                wasNoScore: true,
                isEdited: false,
                letter: "",
                fourRounding: 0,
                isCustom: true
            };

            customCoursesList.push(newCustomItem);
            window._gpaCustomCoursesList = customCoursesList;
            refreshAllDataAndUI();

            // Reset input fields in panel
            $('#gpaNewCourseName').val('');
            $('#gpaNewCourseCredit').val('4');
            $('#gpaNewCourseSem').val('');
            $('#gpaNewCourseScore').val('');
            $('#gpaNewCourseName').focus();
        });

        $(document).off('keydown', '#gpaNewCourseName, #gpaNewCourseCredit, #gpaNewCourseSem, #gpaNewCourseScore');
        $(document).on('keydown', '#gpaNewCourseName, #gpaNewCourseCredit, #gpaNewCourseSem, #gpaNewCourseScore', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                e.stopPropagation();
                $('#gpaBtnSubmitCustomCourse').click();
                return false;
            }
        });
    };
})();
(function tkbModule() {
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

(function ketQuaDkhpModule() {
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
                                    let tuanText = '';

                                    let cardHtml = `
                                    <div class="tkb-session-card" style="background: ${cData.palette.bg}; color: ${cData.palette.text}; vertical-align: middle; padding: 4px 3px; font-size: 13px; text-align: center; line-height: 1.25; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; margin: 2px 0; border-radius: 3px; box-sizing: border-box;">
                                        <div>${cData.courseName}</div>
                                        <div style="font-size: 12px; opacity: 0.95;">(${cData.className})</div>
                                        <div style="color: ${cData.palette.roomText}; font-size: 11.5px; line-height: 1.15; margin-top: 1px;">${campusPrefix}${cData.room}${tuanText}</div>
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
                                    let isSameTuan = cl.items.length > 1 && cl.items.every(co => co.tuanBD && co.tuanBD === cl.items[0].tuanBD);
                                    let innerRowsHtml = cl.items.map((cData, idx) => {
                                        let campusPrefix = isMixedCampus ? (cData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                                        let periodText = `Tiết ${cData.startPeriod}-${cData.endPeriod}`;
                                        let timeStr = `${minutesToHHMM(cData.startMin)}-${minutesToHHMM(cData.endMin)}`;
                                        let tuanText = (!isSameTuan && cData.tuanBD) ? ` (Tuần BD: ${cData.tuanBD})` : '';
                                        return `
                                            <div style="padding: 2px 0; line-height: 1.25;">
                                                <div>${cData.courseName}</div>
                                                <div style="font-size: 12px; opacity: 0.95;">(${cData.className})</div>
                                                <div style="color: ${cData.palette.roomText}; font-size: 11.5px; line-height: 1.15; margin-top: 1px;">${campusPrefix}${cData.room}${tuanText}</div>
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
                            campus: campus,
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
                                let campusPrefix = isMixedCampus ? (cellData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                                tbodyHtml += `<td rowspan="${cellData.span}" style="border: 1px solid #CCCCCC; background: ${cellData.palette.bg}; color: ${cellData.palette.text}; vertical-align: middle; padding: 4px; font-size: 14px; text-align: center; line-height: 1.35; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; height: ${cellData.span * uniformPeriodHeight}px; box-sizing: border-box;">
                                    ${cellData.courseName}<br>(${cellData.className})<br><span style="color: ${cellData.palette.roomText}; font-size: 11.5px;">${campusPrefix}${cellData.room}</span>
                                </td>`;
                            } else {
                                let textColor = items[0].palette.text;
                                let isSameTuanBD = items.length > 1 && items.every(it => it.tuanBD && it.tuanBD === items[0].tuanBD);

                                let innerRowsHtml = items.map((cellData, idx) => {
                                    let campusPrefix = isMixedCampus ? (cellData.campus === 'cs1' ? '[NVC] ' : '[LT] ') : '';
                                    let tuanText = (!isSameTuanBD && cellData.tuanBD) ? ` (Tuần BD: ${cellData.tuanBD})` : '';
                                    return `
                                        <div style="padding: 1px 0; line-height: 1.25;">
                                            ${cellData.courseName}<br>(${cellData.className})<br><span style="color: ${cellData.palette.roomText}; font-size: 11px;">${campusPrefix}${cellData.room}${tuanText}</span>
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

(function () {
    window._initAutoDangKyHocPhan = function () {
        const portalReg = /(new-)?portal\d*\.hcmus\.edu\.vn/i;
        if (!window.location.hostname.match(portalReg) || !window.location.href.includes("DangKyHocPhan.aspx")) {
            alert("Vui lòng sử dụng Tool tại trang \"Đăng ký học phần\" (DangKyHocPhan.aspx) sau khi đã đăng nhập và nhập Captcha!");
            return;
        }

        let targetList = [];
        let foundKeys = [];

        for (let i = 0; i < localStorage.length; i++) {
            let k = localStorage.key(i);
            if (k && (k.startsWith('tkb_selected_') || k === 'gpa_target_dkhp' || k === 'gpa_tkb_saved_selection')) {
                foundKeys.push(k);
            }
        }

        foundKeys.sort().reverse();

        for (let keyName of foundKeys) {
            let raw = localStorage.getItem(keyName);
            if (raw) {
                try {
                    let parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        targetList = parsed;
                        break;
                    } else if (typeof parsed === 'object' && parsed !== null) {
                        let values = Object.values(parsed);
                        if (values.length > 0) {
                            targetList = values;
                            break;
                        }
                    }
                } catch (e) { }
            }
        }

        if (targetList.length === 0) {
            alert("Không tìm thấy TKB đã lưu! Vui lòng chọn môn xếp TKB tại trang \"Danh sách lớp mở\" (pid=327) trước nhé.");
            return;
        }

        const tableSelectors = [
            '#tbDSLopMo',
            '#tbDSLopHocLai',
            '#tbDSLopCaiThienDiem',
            '#tbDSLopHocPhanHoan',
            '#tbDSLopDaiCuong'
        ];

        // Helper to check if a course is already registered in top tables (#tbSVKQ, #tbPDTKQ, etc.)
        function getRegisteredStatus(targetCode, targetClass) {
            if (!targetCode) return null;
            let result = null;

            let $regTables = $('#tbSVKQ, #tbPDTKQ');
            if (!$regTables.length) {
                $('fieldset').each(function () {
                    let leg = $(this).find('legend').text().toLowerCase();
                    if (leg.includes('đã đăng ký') || leg.includes('đã duyệt')) {
                        let $t = $(this).find('table');
                        if ($t.length) $regTables = $regTables.add($t);
                    }
                });
            }

            $regTables.find('tbody tr').each(function () {
                let tds = $(this).find('td');
                if (tds.length < 3) return;
                let codeCol = $(tds[0]).text().trim();
                let nameCol = $(tds[1]).text().trim();
                let classCol = $(tds[2]).text().trim();

                if (codeCol === targetCode) {
                    let isSame = !!(classCol && targetClass && classCol.toUpperCase() === targetClass.toUpperCase());
                    result = {
                        registered: true,
                        isSameClass: isSame,
                        classCode: classCol,
                        courseName: nameCol
                    };
                    if (isSame) return false;
                }
            });

            return result;
        }

        // Helper to query reason from "Danh sách môn không được phép đăng ký" (#tbDSMonError)
        function getNotAllowedInfo(targetCode) {
            let info = { reason: '', courseName: '' };
            if (!targetCode) return info;
            $('#tbDSMonError tbody tr').each(function () {
                let codeCol = $(this).find('td:eq(0)').text().trim();
                let nameCol = $(this).find('td:eq(1)').text().trim();
                let reasonCol = $(this).find('td:eq(3)').text().trim();
                if (codeCol === targetCode) {
                    info.reason = reasonCol;
                    info.courseName = nameCol;
                    return false;
                }
            });
            return info;
        }

        function resolveSkippedReason(targetCode, targetClass, defaultReason) {
            let regStatus = getRegisteredStatus(targetCode, targetClass);
            if (regStatus) {
                let r = regStatus.isSameClass
                    ? 'Đã đăng ký thành công trước đó'
                    : `Đã đăng ký ở lớp khác (${regStatus.classCode})`;
                return { reason: r, courseName: regStatus.courseName };
            }

            let errInfo = getNotAllowedInfo(targetCode);
            if (errInfo.reason) {
                return { reason: errInfo.reason, courseName: errInfo.courseName };
            }

            return { reason: defaultReason, courseName: '' };
        }

        let currentTargetTHGroup = '';
        let currentTargetBTGroup = '';

        // Hook TH Modal grid rendering for automatic TH selection & submission
        const origShowGridTH = window.showGridLopMoThucHanh;
        window.showGridLopMoThucHanh = function (data, maLopMoTH) {
            if (typeof origShowGridTH === 'function') {
                origShowGridTH(data, maLopMoTH);
            }
            setTimeout(() => {
                let $table = $('#tbLopMoThucHanh');
                if ($table.length) {
                    let $targetRow = null;
                    if (currentTargetTHGroup) {
                        $table.find('tbody tr').each(function () {
                            let nhomText = $(this).find('td:eq(0)').text().trim();
                            if (nhomText === currentTargetTHGroup) {
                                $targetRow = $(this);
                                return false;
                            }
                        });
                    }
                    if (!$targetRow || !$targetRow.find('input[type="checkbox"]').length) {
                        $table.find('tbody tr').each(function () {
                            if ($(this).find('input[type="checkbox"]').length) {
                                $targetRow = $(this);
                                return false;
                            }
                        });
                    }
                    if ($targetRow && $targetRow.find('input[type="checkbox"]').length) {
                        $targetRow.find('input[type="checkbox"]').prop('checked', true);
                        if (typeof window.dangKyThucHanh === 'function') {
                            window.dangKyThucHanh();
                        }
                    }
                }
            }, 120);
        };

        // Hook BT Modal grid rendering for automatic BT selection & submission
        const origShowGridBT = window.showGridLopMoBaiTap;
        window.showGridLopMoBaiTap = function (data, maLopMoBT) {
            if (typeof origShowGridBT === 'function') {
                origShowGridBT(data, maLopMoBT);
            }
            setTimeout(() => {
                let $table = $('#tbLopMoBaiTap');
                if ($table.length) {
                    let $targetRow = null;
                    if (currentTargetBTGroup) {
                        $table.find('tbody tr').each(function () {
                            let nhomText = $(this).find('td:eq(0)').text().trim();
                            if (nhomText === currentTargetBTGroup) {
                                $targetRow = $(this);
                                return false;
                            }
                        });
                    }
                    if (!$targetRow || !$targetRow.find('input[type="checkbox"]').length) {
                        $table.find('tbody tr').each(function () {
                            if ($(this).find('input[type="checkbox"]').length) {
                                $targetRow = $(this);
                                return false;
                            }
                        });
                    }
                    if ($targetRow && $targetRow.find('input[type="checkbox"]').length) {
                        $targetRow.find('input[type="checkbox"]').prop('checked', true);
                        if (typeof window.dangKyBaiTap === 'function') {
                            window.dangKyBaiTap();
                        }
                    }
                }
            }, 120);
        };

        let matchedCount = 0;
        let checkedSummaryList = [];
        let skippedList = [];
        let rowTasks = [];

        targetList.forEach(target => {
            let targetId = target.id || target.maLopMoID;
            let targetCode = (target.code || target.MaMonHocCode || '').trim();
            let targetClass = (target.className || target.TenLop || '').trim();
            let targetName = (target.courseName || target.name || targetCode).trim();

            let matchedTr = null;

            for (let sel of tableSelectors) {
                let $table = $(sel);
                if (!$table.length) continue;

                if (targetId) {
                    let $row = $table.find(`tr[id="${targetId}"]`);
                    if ($row.length) {
                        matchedTr = $row;
                        break;
                    }
                }

                if (!matchedTr && targetCode) {
                    $table.find('tbody tr').each(function () {
                        let codeCol = $(this).find('td:eq(0)').text().trim();
                        let classCol = $(this).find('td:eq(2)').text().trim();
                        if (codeCol === targetCode && (!targetClass || classCol === targetClass)) {
                            matchedTr = $(this);
                            return false;
                        }
                    });
                }
                if (matchedTr) break;
            }

            if (matchedTr && matchedTr.length) {
                let cellName = matchedTr.find('td:eq(1)').text().trim();
                if (cellName) targetName = cellName;

                if (matchedTr.hasClass('disable')) {
                    let skipInfo = resolveSkippedReason(targetCode, targetClass, 'Lớp bị khóa/không đủ điều kiện');
                    if (skipInfo.courseName) targetName = skipInfo.courseName;
                    skippedList.push({ name: targetName, className: targetClass, reason: skipInfo.reason });
                    return;
                }

                let $chk = matchedTr.find('input[type="checkbox"]');
                if ($chk.length && !$chk.prop('disabled')) {
                    let actualId = matchedTr.attr('id') || targetId;
                    let $td = $chk.parent();

                    rowTasks.push(new Promise(resolveRow => {
                        let soLopBT = parseInt($td.find('input[type=hidden]:eq(2)').val() || '0');
                        let soLopTH = parseInt($td.find('input[type=hidden]:eq(4)').val() || '0');

                        let thMa = target.selectedTH ? (target.selectedTH.maLopMoTH || target.selectedTH.id) : (target.maLopMoTH || '');
                        let btMa = target.selectedBT ? (target.selectedBT.maLopMoBT || target.selectedBT.id) : (target.maLopMoBT || '');
                        let thNhom = target.selectedTH ? target.selectedTH.nhom : (target.nhomTh || '');
                        let btNhom = target.selectedBT ? target.selectedBT.nhom : (target.nhomBt || '');

                        currentTargetTHGroup = thNhom;
                        currentTargetBTGroup = btNhom;

                        let apiTasks = [];
                        let isSlotError = false;
                        let slotErrorReason = '';

                        if (soLopBT > 0 && typeof dkhp !== 'undefined' && typeof dkhp.getLopMoBaiTap === 'function') {
                            apiTasks.push(new Promise(resApi => {
                                dkhp.getLopMoBaiTap(actualId, function (data) {
                                    if (data && data.LopMoBTs && data.LopMoBTs.length > 0) {
                                        let match = null;
                                        if (btNhom) {
                                            match = data.LopMoBTs.find(b => b.Nhom === btNhom);
                                        } else if (btMa) {
                                            match = data.LopMoBTs.find(b => b.MaLopMoBT === btMa);
                                        }
                                        if (match) {
                                            if (parseInt(match.DaDK) >= parseInt(match.SiSo)) {
                                                isSlotError = true;
                                                slotErrorReason = `Lớp bài tập (${match.Nhom || btNhom}) đã hết slot`;
                                            } else {
                                                btMa = match.MaLopMoBT;
                                                btNhom = match.Nhom;
                                            }
                                        } else {
                                            let avail = data.LopMoBTs.find(b => parseInt(b.SiSo) > parseInt(b.DaDK));
                                            if (avail) {
                                                btMa = avail.MaLopMoBT;
                                                btNhom = avail.Nhom;
                                            } else {
                                                isSlotError = true;
                                                slotErrorReason = `Tất cả các lớp bài tập đều đã hết slot`;
                                            }
                                        }
                                    }
                                    resApi();
                                });
                            }));
                        }

                        if (soLopTH > 0 && typeof dkhp !== 'undefined' && typeof dkhp.getLopMoThucHanh === 'function') {
                            apiTasks.push(new Promise(resApi => {
                                dkhp.getLopMoThucHanh(actualId, function (data) {
                                    if (data && data.LopMoTHs && data.LopMoTHs.length > 0) {
                                        let match = null;
                                        if (thNhom) {
                                            match = data.LopMoTHs.find(t => t.Nhom === thNhom);
                                        } else if (thMa) {
                                            match = data.LopMoTHs.find(t => t.MaLopMoTH === thMa);
                                        }
                                        if (match) {
                                            if (parseInt(match.DaDK) >= parseInt(match.SiSo)) {
                                                isSlotError = true;
                                                slotErrorReason = `Lớp thực hành (${match.Nhom || thNhom}) đã hết slot`;
                                            } else {
                                                thMa = match.MaLopMoTH;
                                                thNhom = match.Nhom;
                                            }
                                        } else {
                                            let avail = data.LopMoTHs.find(t => parseInt(t.SiSo) > parseInt(t.DaDK));
                                            if (avail) {
                                                thMa = avail.MaLopMoTH;
                                                thNhom = avail.Nhom;
                                            } else {
                                                isSlotError = true;
                                                slotErrorReason = `Tất cả các lớp thực hành đều đã hết slot`;
                                            }
                                        }
                                    }
                                    resApi();
                                });
                            }));
                        }

                        Promise.all(apiTasks).then(() => {
                            if (isSlotError) {
                                if ($chk.is(':checked')) {
                                    $chk.prop('checked', false);
                                }
                                skippedList.push({ name: targetName, className: targetClass, reason: slotErrorReason });
                                resolveRow();
                                return;
                            }

                            if (!$chk.is(':checked')) {
                                $chk.trigger('click');
                            }

                            if (btMa) $td.find('input[type=hidden]:eq(3)').val(btMa);
                            if (thMa) $td.find('input[type=hidden]:eq(5)').val(thMa);

                            if (typeof $ !== 'undefined' && $.fancybox && $.fancybox.close) {
                                $.fancybox.close();
                            }

                            matchedCount++;
                            checkedSummaryList.push({
                                name: targetName,
                                className: targetClass || matchedTr.find('td:eq(2)').text().trim(),
                                thNhom: thNhom,
                                btNhom: btNhom
                            });
                            resolveRow();
                        });
                    }));
                } else {
                    let skipInfo = resolveSkippedReason(targetCode, targetClass, 'Lớp đã hết slot');
                    if (skipInfo.courseName) targetName = skipInfo.courseName;
                    skippedList.push({ name: targetName, className: targetClass, reason: skipInfo.reason });
                }
            } else {
                let skipInfo = resolveSkippedReason(targetCode, targetClass, 'Không tìm thấy lớp mở');
                if (skipInfo.courseName) targetName = skipInfo.courseName;
                skippedList.push({ name: targetName, className: targetClass, reason: skipInfo.reason });
            }
        });

        function fixPortalCreditDisplay() {
            let totalCredits = 0;

            tableSelectors.forEach(sel => {
                $(sel).find('tbody tr').each(function () {
                    let $chk = $(this).find('input[type="checkbox"]');
                    if ($chk.length && $chk.is(':checked')) {
                        let tcText = $(this).find('td:eq(3)').text().trim();
                        let tc = parseInt(tcText);
                        if (isNaN(tc)) {
                            let hiddenTc = $(this).find('input[type="hidden"][id*="SoTC"]').val() || $(this).find('input[type="hidden"]:eq(1)').val();
                            tc = parseInt(hiddenTc);
                        }
                        if (!isNaN(tc) && tc > 0) {
                            totalCredits += tc;
                        }
                    }
                });
            });

            if (typeof dkhp !== 'undefined') {
                if ('tongSoTCDaChon' in dkhp) dkhp.tongSoTCDaChon = totalCredits;
                if ('soTCDaChon' in dkhp) dkhp.soTCDaChon = totalCredits;
                if ('tongSoTC' in dkhp) dkhp.tongSoTC = totalCredits;
            }

            // Update DOM text for "Số tín chỉ đã chọn:"
            $('div, td, span, p, b, label').each(function () {
                let txt = $(this).text();
                if (txt.includes('Số tín chỉ đã chọn:') && $(this).children().length <= 1) {
                    let newText = txt.replace(/Số tín chỉ đã chọn:\s*-\d+/g, `Số tín chỉ đã chọn: ${totalCredits}`);
                    newText = newText.replace(/Số tín chỉ đã chọn:\s*\d+/g, `Số tín chỉ đã chọn: ${totalCredits}`);
                    $(this).text(newText);
                }
            });
        }

        Promise.all(rowTasks).then(() => {
            fixPortalCreditDisplay();

            if (matchedCount === 0) {
                let skipMsg = skippedList.map(s => `- ${s.name} (${s.className}): ${s.reason}`).join('\n');
                alert(`Không có môn học nào trong TKB đã lưu đăng ký thành công:\n\n${skipMsg}`);
                return;
            }

            let checkedMsg = checkedSummaryList.map(c => {
                let thBt = [];
                if (c.thNhom) thBt.push(`TH: ${c.thNhom}`);
                if (c.btNhom) thBt.push(`BT: ${c.btNhom}`);
                let extra = thBt.length ? ` - ${thBt.join(', ')}` : '';
                return `- ${c.name} (${c.className})${extra}`;
            }).join('\n');

            let skipMsg = skippedList.length > 0
                ? '\n\nChưa chọn (' + skippedList.length + ' môn):\n' + skippedList.map(s => `- ${s.name} (${s.className}): ${s.reason}`).join('\n')
                : '';

            let confirmText = `XÁC NHẬN ĐĂNG KÝ (Nhấn Enter = ĐĂNG KÝ)\n\nĐã chọn (${matchedCount} môn):\n${checkedMsg}${skipMsg}`;

            let isUserOk = window.confirm(confirmText);
            if (!isUserOk) {
                return;
            }

            if (typeof $ !== 'undefined' && $.fancybox && $.fancybox.close) {
                $.fancybox.close();
            }

            // Override school's confirm prompt & submit form
            window.confirm = function () { return true; };

            setTimeout(() => {
                let $btnSubmit = $('#ctl00_ContentPlaceHolder1_ViewThongTinDangKy1_btnDangKy');
                if ($btnSubmit.length) {
                    $btnSubmit.click();
                }
            }, 300);
        });
    };
})();


(function mainRouter() {
    const portalReg = /(new-)?portal\d*\.hcmus\.edu\.vn/i;
    if (!window.location.hostname.match(portalReg)) {
        alert("Vui lòng truy cập trang \"Tra cứu kết quả học tập\", \"Danh sách lớp mở\", \"Kết quả ĐKHP\" hoặc \"Đăng ký học phần\" trên Portal HCMUS để dùng Tool nhé!");
        return;
    }

    if (window.location.href.includes("pid=211")) {
        if (typeof window._initGpaCalculator === "function") {
            window._initGpaCalculator();
        }
    } else if (window.location.href.includes("pid=327")) {
        if (typeof window._initTimetablePlanner === "function") {
            window._initTimetablePlanner();
        }
    } else if (window.location.href.includes("pid=212")) {
        if (typeof window._initKetQuaDkhp === "function") {
            window._initKetQuaDkhp();
        }
    } else if (window.location.href.includes("DangKyHocPhan.aspx")) {
        if (typeof window._initAutoDangKyHocPhan === "function") {
            window._initAutoDangKyHocPhan();
        }
    } else {
        alert("Vui lòng truy cập trang \"Tra cứu kết quả học tập\", \"Danh sách lớp mở\", \"Kết quả ĐKHP\" hoặc \"Đăng ký học phần\" trên Portal HCMUS để dùng Tool nhé!");
    }
})();
