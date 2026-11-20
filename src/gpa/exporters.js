(function () {
    __HCMUS__.gpa = __HCMUS__.gpa || {};

    function getExportContext(state) {
        const { isCourseInSelectedYears, getDegreeInfo, isAllSemestersMode, getSelectedYearAndHk } = __HCMUS__.gpa.helpers;
        let exportCal = state.cal;
        if (!exportCal) return null;

        let exportData = state.data.filter(d => isCourseInSelectedYears(state, d));

        let rawUserText = $('#user_tools span').text() || $('#user_tools').text() || "";
        let studentName = "Sinh viên";
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
            let { year: yearInput, hk: hkInput } = getSelectedYearAndHk();
            scopeText = "Học kỳ " + hkInput + " - Năm học " + yearInput;
        } else if (state.selectedAcademicYears && state.selectedAcademicYears.length > 0) {
            scopeText = "Năm học " + state.selectedAcademicYears.join(', ');
        }

        return { exportData, exportCal, studentName, degInfo, dateStr, scopeText };
    }

    function formatExportRow(row) {
        const { toFixed } = __HCMUS__.gpa.helpers;
        let scoreVal = (row.score > 0 || (!row.isAbsent && !row.isNoScore)) ? toFixed(row.score) : "-";
        let letterVal = row.letter || "-";
        let fourVal = row.fourRounding ? toFixed(row.fourRounding) : "-";

        let courseParts = row.course.split(' - ');
        let courseCode = courseParts.length > 1 ? courseParts[0].trim() : (row.ldcode || '');
        let courseName = courseParts.length > 1 ? courseParts.slice(1).join(' - ').trim() : row.course;

        return { scoreVal, letterVal, fourVal, courseCode, courseName };
    }

    class ExportPdf {
        constructor(state) {
            this.state = state;
        }

        exportToPdf() {
            const { LOGO_BASE64 } = __HCMUS__.constants;
            const { toFixed } = __HCMUS__.gpa.helpers;
            const ctx = getExportContext(this.state);
            if (!ctx) return;
            const { exportData, exportCal, studentName, degInfo, dateStr, scopeText } = ctx;

            let rowsHtml = '';
            let stt = 1;
            exportData.forEach(function (row) {
                if (row.include) {
                    const { scoreVal, letterVal, fourVal, courseCode, courseName } = formatExportRow(row);

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
        constructor(state) {
            this.state = state;
        }

        saveToFileCSV() {
            const { toFixed } = __HCMUS__.gpa.helpers;
            const ctx = getExportContext(this.state);
            if (!ctx) return;
            const { exportData, exportCal, studentName, degInfo, dateStr, scopeText } = ctx;

            let rowsHtml = '';
            let stt = 1;
            exportData.forEach(function (row) {
                if (row.include) {
                    const { scoreVal, letterVal, fourVal, courseCode, courseName } = formatExportRow(row);

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

    __HCMUS__.gpa.ExportPdf = ExportPdf;
    __HCMUS__.gpa.SaveCoursesList = SaveCoursesList;
})();
