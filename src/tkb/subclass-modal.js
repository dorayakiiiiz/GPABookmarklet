(function () {
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

    __HCMUS__.tkbSubClass = {
        getThucHanhShifts,
        getBaiTapShifts,
        showSubClassModal
    };
})();
