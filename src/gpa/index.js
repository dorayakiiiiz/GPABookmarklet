(function () {
    window._initGpaCalculator = function () {
        const { PORTAL_HOST_REG, PORTAL_LAYOUT_FIX_CSS } = __HCMUS__.constants;
        const {
            getSelectedYearAndHk,
            isAllSemestersMode,
            autoResizeTextarea,
            isExceptCourseName,
            isCustomCourseInScope
        } = __HCMUS__.gpa.helpers;
        const {
            saveGpaSimulationData,
            hasRestorableData,
            restoreGpaSimulationData
        } = __HCMUS__.gpa.storage;
        const {
            applyYearFilterVisibility,
            updateYearFilterBtnText,
            setupYearFilterDropdown
        } = __HCMUS__.gpa.yearFilter;
        const {
            initUserCourseData,
            addSupplementaryGrade,
            renderEditableScoreCells,
            renderCustomCoursesInTable
        } = __HCMUS__.gpa.dataParser;
        const Calculation = __HCMUS__.gpa.Calculation;
        const ExportPdf = __HCMUS__.gpa.ExportPdf;
        const SaveCoursesList = __HCMUS__.gpa.SaveCoursesList;

        if (!window.location.hostname.match(PORTAL_HOST_REG)) {
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
        $('<style>' + PORTAL_LAYOUT_FIX_CSS + '#tbDiemThiGK{width:100%!important;margin:0!important}.gpa-custom-name-input{text-align:left!important}.gpa-custom-name-input::placeholder,.gpa-custom-sem-input::placeholder,.gpa-custom-credit-input::placeholder,.gpa-score-input::placeholder{text-align:center!important}#tbDiemThiGK_wrapper .fg-toolbar:first-child{display:flex!important;align-items:center!important;justify-content:space-between!important}#tbDiemThiGK_wrapper .fg-toolbar:first-child:before,#tbDiemThiGK_wrapper .fg-toolbar:first-child:after{display:none!important}#gpaYearFilterWrapper{display:inline-flex!important;align-items:center!important;float:none!important;margin:0!important}#tbDiemThiGK_filter{float:none!important;display:inline-flex!important;align-items:center!important;margin:0 0 0 auto!important}#tbDiemThiGK_filter label{display:inline-flex!important;align-items:center!important;margin:0!important;float:none!important}#tbDiemThiGK_filter input{margin-left:5px!important;vertical-align:middle!important}</style>').appendTo('head');

        const state = {
            tab: tab,
            customCoursesList: window._gpaCustomCoursesList || [],
            exceptData: [],
            data: [],
            rows: null,
            cal: null,
            selectedAcademicYears: []
        };
        window._gpaCustomCoursesList = state.customCoursesList;

        // MAIN EXECUTION FLOW

        function refreshAllDataAndUI() {
            initUserCourseData(state);
            addSupplementaryGrade(state);
            renderEditableScoreCells(state);
            state.cal = new Calculation(state);
            state.cal.calculateGPA();
            state.cal.formatCoursesTableAndCreateResultTable();
            saveGpaSimulationData(state);
            // Render custom rows LAST — after all DOM manipulations and DataTables redraws
            // that happen inside addSupplementaryGrade/formatCoursesTableAndCreateResultTable.
            // If custom rows are appended earlier, those redraws wipe them from the tbody.
            renderCustomCoursesInTable(state);
            if (isAllSemestersMode()) {
                applyYearFilterVisibility(state);
                setupYearFilterDropdown(state);
            }
        }

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
                renderCustomCoursesInTable(state);

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
                    applyYearFilterVisibility(state);
                }
            }
        });
        tab.css({ 'width': '100%', 'margin': '0' });

        if (isAllSemestersMode()) {
            setupYearFilterDropdown(state);
            applyYearFilterVisibility(state);
        }

        // Checkbox toggle listener
        $('#tbDiemThiGK').off('change', '.gpa-checkbox input[type="checkbox"]');
        $('#tbDiemThiGK').on('change', '.gpa-checkbox input[type="checkbox"]', function () {
            window._gpaIsUserEditingOrRestored = true;
            let courseRow = $(this).closest("tr");
            let idCourse = $(courseRow).attr("id");

            let item = state.data.find(d => String(d.id) === String(idCourse));
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
            if (state.cal) {
                state.cal.updateTargetPlanner();
            }
        });

        // Score edit listener (What-If simulation with comma support)
        $('#tbDiemThiGK').off('input change', '.gpa-score-input');
        $('#tbDiemThiGK').on('input change', '.gpa-score-input', function () {
            window._gpaIsUserEditingOrRestored = true;
            let idAttr = $(this).attr("data-id");
            let item = state.data.find(d => String(d.id) === String(idAttr));
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
                let cInList = state.customCoursesList.find(c => String(c.id) === String(item.id));
                if (cInList) {
                    cInList.score = item.score;
                    cInList.letter = item.letter;
                    cInList.fourRounding = item.fourRounding;
                    cInList.include = item.include;
                    cInList.isNoScore = item.isNoScore;
                    cInList.whyExclude = item.whyExclude;
                    window._gpaCustomCoursesList = state.customCoursesList;
                }
            }

            // Update letter & 4.0 scale in memory & DOM without re-rendering inputs
            addSupplementaryGrade(state);
            let courseRow = $(this).closest("tr");
            courseRow.find('.gpa-letter-col').text(item.letter || '-');
            courseRow.find('.gpa-four-col').text(item.fourRounding || 0);

            // Sync Checkbox state in DOM
            courseRow.find(".gpa-checkbox input[type='checkbox']").prop("checked", item.include);
            courseRow.find(".gpa-checkbox div[hidden]").text(item.include ? 1 : 0);

            saveGpaSimulationData(state);

            // Recalculate GPA & update result summary stats without rebuilding fieldset
            // so user's Target GPA inputs are preserved
            if (state.cal) {
                let newCal = new Calculation(state);
                newCal.calculateGPA();
                newCal.updateGpaStats();
                state.cal = newCal;
            }
        });

        // Custom Course Inline Input Listeners
        $('#tbDiemThiGK').off('input change', '.gpa-custom-sem-input');
        $('#tbDiemThiGK').on('input change', '.gpa-custom-sem-input', function () {
            let idCourse = $(this).attr("data-id");
            let item = state.data.find(d => String(d.id) === String(idCourse));
            if (item) {
                item.semester = $(this).val().trim() || "-";
                let cInList = state.customCoursesList.find(c => String(c.id) === String(idCourse));
                if (cInList) cInList.semester = item.semester;
                $(this).siblings('span').text(item.semester + '_z');
                window._gpaCustomCoursesList = state.customCoursesList;
                saveGpaSimulationData(state);
            }
        });

        $('#tbDiemThiGK').off('input change', '.gpa-custom-name-input');
        $('#tbDiemThiGK').on('input change', '.gpa-custom-name-input', function () {
            let idCourse = $(this).attr("data-id");
            let item = state.data.find(d => String(d.id) === String(idCourse));
            if (item) {
                let val = $(this).val();
                item.course = val ? val : "-";
                $(this).attr("title", item.course);
                let cInList = state.customCoursesList.find(c => String(c.id) === String(idCourse));
                if (cInList) cInList.course = item.course;
                window._gpaCustomCoursesList = state.customCoursesList;
                saveGpaSimulationData(state);
            }
            autoResizeTextarea(this);
        });

        $('#tbDiemThiGK').off('input change', '.gpa-custom-credit-input');
        $('#tbDiemThiGK').on('input change', '.gpa-custom-credit-input', function () {
            let idCourse = $(this).attr("data-id");
            let item = state.data.find(d => String(d.id) === String(idCourse));
            if (item) {
                let val = parseInt($(this).val().trim()) || 0;
                item.credit = val > 0 ? val : 0;
                let cInList = state.customCoursesList.find(c => String(c.id) === String(idCourse));
                if (cInList) cInList.credit = item.credit;
                window._gpaCustomCoursesList = state.customCoursesList;
                saveGpaSimulationData(state);

                if (state.cal) {
                    let newCal = new Calculation(state);
                    newCal.calculateGPA();
                    newCal.updateGpaStats();
                    state.cal = newCal;
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
                state.customCoursesList = state.customCoursesList.filter(c => {
                    if (!removedOne && String(c.id) === String(delId) &&
                        (c.semester || '') === delSem && (c.course || '') === delCourse) {
                        removedOne = true;
                        return false; // remove this one
                    }
                    return true;
                });
                window._gpaCustomCoursesList = state.customCoursesList;

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
            let saveCoursesList = new SaveCoursesList(state);
            let exportPdf = new ExportPdf(state);

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
            function renderRestoreHistoryButton() {
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
                        restoreGpaSimulationData(state, refreshAllDataAndUI);
                        $(this).css({ 'opacity': '0.5', 'cursor': 'not-allowed' }).off('click').click(e => e.preventDefault());
                    });
                }
            }

            $(resetButton).click(function (event) {
                event.preventDefault();

                if (isAllSemestersMode()) {
                    localStorage.removeItem('gpa_saved_custom_courses');
                    localStorage.removeItem('gpa_saved_edited_scores');
                    window._gpaSavedEditedScores = {};
                    state.customCoursesList = [];
                    window._gpaCustomCoursesList = [];
                    state.selectedAcademicYears = [];
                    if ($('#gpaYearFilterBtn').length) {
                        updateYearFilterBtnText(state);
                        setupYearFilterDropdown(state);
                    }
                } else {
                    let { year, hk } = getSelectedYearAndHk();
                    let targetSem = (year + '/' + hk).toLowerCase();
                    let prefix = targetSem + "_";

                    // 1. Remove custom courses of this semester from LocalStorage & Memory
                    let savedCustom = localStorage.getItem('gpa_saved_custom_courses');
                    if (savedCustom) {
                        let parsed = JSON.parse(savedCustom);
                        let keptCustom = parsed.filter(c => !isCustomCourseInScope(c));
                        localStorage.setItem('gpa_saved_custom_courses', JSON.stringify(keptCustom));
                        window._gpaCustomCoursesList = keptCustom;
                        state.customCoursesList = keptCustom;
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
                renderRestoreHistoryButton();

                refreshAllDataAndUI();
            });

            // Add Restore History button if there is saved data in local storage
            renderRestoreHistoryButton();

            function generateSemesterSelectOptions() {
                let { year: yearInput, hk: hkInput } = getSelectedYearAndHk();

                let minFoundYear = 9999;

                $('#ctl00_ContentPlaceHolder1_ctl00_cboNamHoc_gvDKHPLichThi_ob_CbocboNamHoc_gvDKHPLichThiItemsContainer li').each(function () {
                    let txt = $(this).text().trim();
                    let match = txt.match(/(\d{2})-\d{2}/);
                    if (match && match[1]) {
                        let y = parseInt(match[1]);
                        if (!isNaN(y) && y < minFoundYear) minFoundYear = y;
                    }
                });

                if (state.data && state.data.length) {
                    state.data.forEach(d => {
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

            state.customCoursesList.push(newCustomItem);
            window._gpaCustomCoursesList = state.customCoursesList;
            refreshAllDataAndUI();

            // Reset input fields in panel (keep selected semester)
            $('#gpaNewCourseName').val('');
            $('#gpaNewCourseCredit').val('4');
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
