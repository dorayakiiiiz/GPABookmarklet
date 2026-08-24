import urllib.parse
import re

# Read Module 1: GPA Calculator (gpa.js)
with open('gpa.js', 'r', encoding='utf-8') as f:
    gpa_js = f.read()

# Strip leading "javascript:" if present
gpa_js = re.sub(r'^javascript:\s*', '', gpa_js)

# Read Module 2: Timetable Planner (tkb.js)
with open('tkb.js', 'r', encoding='utf-8') as f:
    tkb_js = f.read()

# Strip leading "javascript:" if present
tkb_js = re.sub(r'^javascript:\s*', '', tkb_js)

# Router entry point
router_js = r"""
(function mainRouter() {
    const portalReg = /(new-)?portal\d*\.hcmus\.edu\.vn/i;
    if (!window.location.hostname.match(portalReg)) {
        alert("Vui lòng truy cập trang \"Tra cứu kết quả học tập\" hoặc \"Danh sách lớp mở\" trên Portal HCMUS để dùng Tool nhé!");
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
    } else {
        alert("Vui lòng truy cập trang \"Tra cứu kết quả học tập\" hoặc \"Danh sách lớp mở\" trên Portal HCMUS để dùng Tool nhé!");
    }
})();
"""

# Combine all modules into a single bundled script
bundled_js = gpa_js + "\n" + tkb_js + "\n" + router_js

encoded_js = urllib.parse.quote(bundled_js, safe='')
href = 'javascript:' + encoded_js

with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Replace href="javascript:..." in index.html
new_html = re.sub(r'href="javascript:[^"]*"', f'href="{href}"', html_content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("SUCCESS: index.html updated with encoded bookmarklet bundling both GPA (gpa.js - pid=211) and TKB (tkb.js - pid=327) modules!")
