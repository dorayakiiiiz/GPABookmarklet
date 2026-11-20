(function () {
    __HCMUS__.gpa = __HCMUS__.gpa || {};

    function loadGpaSimulationData(state) {
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
                    state.customCoursesList = uniqueCustom;
                }
            }
            let savedScores = localStorage.getItem('gpa_saved_edited_scores');
            if (savedScores) {
                window._gpaSavedEditedScores = JSON.parse(savedScores);
            }
        } catch (e) { }
    }

    function saveGpaSimulationData(state) {
        const { isAllSemestersMode, isCustomCourseInScope } = __HCMUS__.gpa.helpers;
        if (!window._gpaIsUserEditingOrRestored) {
            return;
        }
        try {
            if (window._gpaCustomCoursesList && window._gpaCustomCoursesList.length > 0) {
                let existingRaw = localStorage.getItem('gpa_saved_custom_courses');
                let existingCustom = existingRaw ? JSON.parse(existingRaw) : [];

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
                let item = state.data.find(d => String(d.id) === String(idAttr));
                let rowKey = $(this).attr('data-gpa-row-key');
                let scoreInput = $(this).find('.gpa-score-input');

                if (item && rowKey && scoreInput.length) {
                    let scoreVal = scoreInput.val().trim();
                    let serverAttr = $(this).attr('data-server-score');
                    let originalScoreStr = (serverAttr && serverAttr !== 'null') ? serverAttr : "";

                    let isChanged = scoreVal !== "" && (item.isEdited || item.wasNoScore || scoreVal !== originalScoreStr);

                    if (isChanged) {
                        savedScores[rowKey] = scoreVal;
                    } else {
                        // Score reverted to original or cleared → mark for removal
                        revertedKeys.push(rowKey);
                    }
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

    function hasRestorableData() {
        const { getSelectedYearAndHk, isAllSemestersMode, isCustomCourseInScope } = __HCMUS__.gpa.helpers;
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

    function restoreGpaSimulationData(state, refreshAllDataAndUI) {
        const { getSelectedYearAndHk, isAllSemestersMode, isCustomCourseInScope, isExceptCourseName } = __HCMUS__.gpa.helpers;
        window._gpaIsUserEditingOrRestored = true;
        try {
            let savedCustom = localStorage.getItem('gpa_saved_custom_courses');
            if (savedCustom) {
                let parsed = JSON.parse(savedCustom);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    let uniqueCustom = [];
                    let seen = new Set();

                    let itemsToLoad = isAllSemestersMode() ? parsed : parsed.filter(c => isCustomCourseInScope(c));

                    let merged = [...state.customCoursesList, ...itemsToLoad];
                    merged.forEach(c => {
                        let key = (c.id || '') + '_' + (c.semester || '') + '_' + (c.course || '');
                        if (!seen.has(key)) {
                            seen.add(key);
                            uniqueCustom.push(c);
                        }
                    });

                    window._gpaCustomCoursesList = uniqueCustom;
                    state.customCoursesList = uniqueCustom;
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

    __HCMUS__.gpa.storage = {
        loadGpaSimulationData,
        saveGpaSimulationData,
        hasRestorableData,
        restoreGpaSimulationData
    };
})();
