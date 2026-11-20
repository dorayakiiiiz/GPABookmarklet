(function () {
    __HCMUS__.gpa = __HCMUS__.gpa || {};

    function applyYearFilterVisibility(state) {
        const { isAllSemestersMode, isCourseInSelectedYears } = __HCMUS__.gpa.helpers;
        if (!isAllSemestersMode()) return;
        state.tab.find('tbody tr').each(function () {
            let idAttr = $(this).attr("id");
            let item = state.data.find(d => String(d.id) === String(idAttr)) ||
                state.customCoursesList.find(c => String(c.id) === String(idAttr));
            if (!item) return;

            if (isCourseInSelectedYears(state, item)) {
                $(this).css('display', '');
            } else {
                $(this).css('display', 'none');
            }
        });

        state.tab.find('tbody tr:visible').each(function (idx) {
            $(this).removeClass('odd even').addClass(idx % 2 === 0 ? 'odd' : 'even');
        });
    }

    function updateYearFilterBtnText(state) {
        let btn = $('#gpaYearFilterBtn');
        if (!btn.length) return;
        if (!state.selectedAcademicYears || state.selectedAcademicYears.length === 0) {
            btn.text('Tất cả ▾');
            $('#gpaYearCheckAll').prop('checked', true);
        } else if (state.selectedAcademicYears.length === 1) {
            btn.text(state.selectedAcademicYears[0] + ' ▾');
            $('#gpaYearCheckAll').prop('checked', false);
        } else if (state.selectedAcademicYears.length <= 2) {
            btn.text(state.selectedAcademicYears.join(', ') + ' ▾');
            $('#gpaYearCheckAll').prop('checked', false);
        } else {
            btn.text(state.selectedAcademicYears.length + ' năm ▾');
            $('#gpaYearCheckAll').prop('checked', false);
        }
    }

    function applyYearFilter(state) {
        const Calculation = __HCMUS__.gpa.Calculation;
        state.cal = new Calculation(state);
        state.cal.calculateGPA();
        state.cal.updateGpaStats();
        applyYearFilterVisibility(state);
    }

    function setupYearFilterDropdown(state) {
        const { isAllSemestersMode, getAvailableAcademicYears } = __HCMUS__.gpa.helpers;
        if (!isAllSemestersMode()) return;
        let topToolbar = $('#tbDiemThiGK_wrapper .fg-toolbar').first();
        if (!topToolbar.length) return;

        let availableYears = getAvailableAcademicYears(state);
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
                    state.selectedAcademicYears = [];
                } else {
                    state.selectedAcademicYears = [];
                    $(this).prop('checked', true);
                    $('.gpa-year-checkbox').prop('checked', true);
                }
                updateYearFilterBtnText(state);
                applyYearFilter(state);
            });

            $('#gpaYearCheckboxList').off('change', '.gpa-year-checkbox').on('change', '.gpa-year-checkbox', function () {
                let total = $('.gpa-year-checkbox').length;
                let checkedEls = $('.gpa-year-checkbox:checked');
                if (checkedEls.length === 0) {
                    $(this).prop('checked', true);
                    return;
                }
                if (checkedEls.length === total) {
                    state.selectedAcademicYears = [];
                    $('#gpaYearCheckAll').prop('checked', true);
                } else {
                    $('#gpaYearCheckAll').prop('checked', false);
                    state.selectedAcademicYears = [];
                    checkedEls.each(function () {
                        state.selectedAcademicYears.push($(this).val());
                    });
                }
                updateYearFilterBtnText(state);
                applyYearFilter(state);
            });
        }

        let checkListContainer = $('#gpaYearCheckboxList');
        checkListContainer.empty();
        availableYears.forEach(y => {
            let isChecked = state.selectedAcademicYears.length === 0 || state.selectedAcademicYears.includes(y);
            checkListContainer.append(
                '<label style="cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 6px; color: #000; margin: 0;">' +
                '  <input type="checkbox" class="gpa-year-checkbox" value="' + y + '"' + (isChecked ? ' checked' : '') + ' style="cursor: pointer; margin: 0;" /> Năm học ' + y +
                '</label>'
            );
        });

        updateYearFilterBtnText(state);
        applyYearFilterVisibility(state);
    }

    __HCMUS__.gpa.yearFilter = {
        applyYearFilterVisibility,
        updateYearFilterBtnText,
        applyYearFilter,
        setupYearFilterDropdown
    };
})();
