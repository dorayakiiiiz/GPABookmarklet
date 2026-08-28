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
