import urllib.parse
import re

# Read Module 1: GPA Calculator (gpa.js - pid=211)
with open('gpa.js', 'r', encoding='utf-8') as f:
    gpa_js = f.read()

# Strip leading "javascript:" if present
gpa_js = re.sub(r'^javascript:\s*', '', gpa_js)

# Read Module 2: Timetable Planner (tkb.js - pid=327)
with open('tkb.js', 'r', encoding='utf-8') as f:
    tkb_js = f.read()

# Strip leading "javascript:" if present
tkb_js = re.sub(r'^javascript:\s*', '', tkb_js)

# Read Module 3: Ket Qua DKHP Timetable (ketqua_dkhp.js - pid=212)
with open('ketqua_dkhp.js', 'r', encoding='utf-8') as f:
    ketqua_dkhp_js = f.read()

# Strip leading "javascript:" if present
ketqua_dkhp_js = re.sub(r'^javascript:\s*', '', ketqua_dkhp_js)

# Read Module 4: Auto DKHP (dkhp_auto.js - DangKyHocPhan.aspx)
with open('dkhp_auto.js', 'r', encoding='utf-8') as f:
    dkhp_auto_js = f.read()

# Strip leading "javascript:" if present
dkhp_auto_js = re.sub(r'^javascript:\s*', '', dkhp_auto_js)

# Router entry point
router_js = r"""
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
"""

# Combine all modules into a single bundled script
bundled_js = gpa_js + "\n" + tkb_js + "\n" + ketqua_dkhp_js + "\n" + dkhp_auto_js + "\n" + router_js

# Save bundle.js for GitHub Pages remote hosting
with open('bundle.js', 'w', encoding='utf-8') as f:
    f.write(bundled_js)

# Button 1 (Legacy): Offline Encoded Code
encoded_legacy_js = urllib.parse.quote(bundled_js, safe='')
href_legacy = 'javascript:' + encoded_legacy_js

# Button 2 (Auto Update): Direct Remote Script Loader (Fetches fresh bundle.js on click)
href_auto = "javascript:(function(){var old=document.getElementById('gpa_script_loader');if(old)old.remove();var s=document.createElement('script');s.id='gpa_script_loader';s.src='https://dorayakiiiiz.github.io/GPABookmarklet/bundle.js?t='+Date.now();document.body.appendChild(s);})();"

with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Replace drag-box HTML structure with 2 buttons
drag_box_pattern = r'<div class="drag-box">.*?</div>\s*<!--'
new_drag_box = f'''<div class="drag-box">
            <span class="drag-label">Kéo thả nút này lên thanh Bookmark (Ctrl+Shift+B)</span>
            <div class="bm-buttons-group">
                <a class="bm-btn bm-btn-legacy" href="{href_legacy}" title="Mã nén cứng offline (cố định)" data-badge="Bản Gốc">
                    <svg class="bm-icon" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    KHTN GPA
                </a>
                <span class="bm-or-label">hoặc</span>
                <a class="bm-btn bm-btn-auto" href="{href_auto}" title="Tự động nhận tính năng mới khi push GitHub" data-badge="Auto Update">
                    <svg class="bm-icon" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                    KHTN GPA
                </a>
            </div>
            <span class="drag-subtext">Bản Gốc chạy tức thì (cần kéo lại nút khi có update), Auto Update tự nạp script mới (tải khi bấm nên chậm hơn).</span>
        </div>

        <!--'''

new_html = re.sub(drag_box_pattern, new_drag_box, html_content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("SUCCESS: index.html drag-box updated to 2 buttons with hrefs, and bundle.js generated!")
