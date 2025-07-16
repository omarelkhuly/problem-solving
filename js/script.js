const weekData = [
    { day: "السبت", topic: "فهم التوتر", goal: "معرفة أسبابه", idea: "ابحث عن فيديو عن التوتر", ideaDetails: "ابحث عن فيديو يشرح التوتر وتأثيره.", start: "10:00", end: "10:30" },
    { day: "الأحد", topic: "تحليل التوتر", goal: "تحديد مسبباته", idea: "اكتب أسبابك", ideaDetails: "اكتب أسباب التوتر التي تواجهها.", start: "12:00", end: "12:20" },
    { day: "الاثنين", topic: "تمارين تنفس", goal: "خفض التوتر", idea: "تقنية 4-7-8", ideaDetails: "شهيق 4 ثوان، حبس النفس 7، زفير 8.", start: "3:00", end: "3:20" },
    { day: "الثلاثاء", topic: "التأمل", goal: "الهدوء الذهني", idea: "تطبيق تأمل", ideaDetails: "استخدم تطبيقات مثل Headspace أو Calm.", start: "6:00", end: "6:20" },
    { day: "الأربعاء", topic: "حديث إيجابي", goal: "رفع المعنويات", idea: "عبارات تحفيزية", ideaDetails: "ردّد عبارات تحفيزية صباحًا ومساءً.", start: "7:00", end: "7:20" },
    { day: "الخميس", topic: "محاكاة اختبار", goal: "التحكم بالقلق", idea: "أسئلة تدريبية", ideaDetails: "جاوب على أسئلة تدريبية كأنك في امتحان.", start: "9:00", end: "9:20" },
    { day: "الجمعة", topic: "مراجعة الأسبوع", goal: "قياس التقدم", idea: "اكتب ما تعلمت", ideaDetails: "قيّم إنجازاتك خلال الأسبوع.", start: "10:00", end: "10:20" }
];

let noteIndex = null;

function getDateKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function formatTime(timeStr) {
    const [hour, minute] = timeStr.split(":").map(Number);
    const ampm = hour >= 12 ? "مساءً" : "صباحًا";
    const h = hour % 12 || 12;
    return `${h}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

function loadTable() {
    const tbody = document.querySelector("#stressTable tbody");
    tbody.innerHTML = "";
    for (let i = 0; i < weekData.length; i++) {
        tbody.innerHTML += `
    <tr>
      <td>${weekData[i].day}</td>
      <td>${weekData[i].topic}</td>
      <td>${weekData[i].goal}</td>
      <td><button class="btn btn-link text-primary p-0" onclick="showIdeaModal(${i})"><i class="fas fa-lightbulb"></i> ${weekData[i].idea}</button></td>
      <td>من ${formatTime(weekData[i].start)} إلى ${formatTime(weekData[i].end)}</td>
      <td><input type="checkbox" class="form-check-input checkbox_style" id="check${i}"></td>
      <td class="w_style">
        <div id="noteText${i}" class="note-text text-muted mb-1">لا توجد ملاحظات بعد</div>
        <button class="btn btn-outline-primary btn-sm" onclick="openModal(${i})">✏️ أضف / عدّل ملاحظة</button>
      </td>
    </tr>`;
    }
}

function openModal(i) {
    noteIndex = i;
    document.getElementById("modalNoteInput").value = "";
    new bootstrap.Modal(document.getElementById("noteModal")).show();
}

function saveNote() {
    const text = document.getElementById("modalNoteInput").value.trim();
    if (!text || noteIndex === null) return;
    const noteBox = document.getElementById(`noteText${noteIndex}`);

    if (noteBox.innerText.trim() === "لا توجد ملاحظات بعد") {
        noteBox.innerHTML = "";
    }

    const oldNotes = noteBox.querySelectorAll('.note-content');
    oldNotes.forEach(note => {
        note.classList.remove('text-success');
        note.classList.add('text-danger');
    });

    const newNote = document.createElement("span");
    newNote.className = "d-block text-success note-content d-flex justify-content-between align-items-center mt-1";
    newNote.innerHTML = `
    <span>${text}</span>
    <button class="btn btn-sm btn-danger py-0 px-2" onclick="removeNote(this)">🗑️</button>`;
    noteBox.appendChild(newNote);
    bootstrap.Modal.getInstance(document.getElementById("noteModal")).hide();
    document.getElementById("modalNoteInput").value = "";
}

function removeNote(button) {
    const noteSpan = button.closest("span");
    const noteBox = noteSpan.parentElement;
    noteSpan.remove();
    if (!noteBox.querySelector('.note-content')) {
        noteBox.innerHTML = 'لا توجد ملاحظات بعد';
    }
}

function saveWeekData() {
    const key = "weekReport_" + getDateKey();
    const data = [];
    for (let i = 0; i < weekData.length; i++) {
        data.push({
            day: weekData[i].day,
            goal: weekData[i].goal,
            idea: weekData[i].idea,
            start: weekData[i].start,
            end: weekData[i].end,
            done: document.getElementById("check" + i).checked,
            note: document.getElementById("noteText" + i).innerText.trim()
        });
    }
    localStorage.setItem(key, JSON.stringify(data));
    alert("✅ تم حفظ بيانات الأسبوع.");
    populateReportSelector();
}

function showAllReports() {
    document.getElementById("reportsSection").innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("weekReport_")) {
            const saved = JSON.parse(localStorage.getItem(key));
            showReport(saved, key.replace("weekReport_", ""));
        }
    }
}

function showReport(saved, label) {
    const report = `
            <div class="border rounded p-3 bg-light mb-4">
                <h5><i class="fas fa-table text-secondary"></i> تقرير: ${label}</h5>
                <div class="d-flex justify-content-between mb-2">
                    <button class="btn btn-outline-dark btn-sm print_style" onclick="printThis(this)">🖨️ طباعة التقرير</button>
                    <button class="btn btn-outline-danger btn-sm print_style" onclick="this.closest('.border').remove()">🗑️ إخفاء من العرض</button>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered text-center mt-2">
                        <thead class="table-secondary">
                            <tr><th>اليوم</th><th>الهدف</th><th>الفكرة</th><th>المدة</th><th>الإنجاز</th><th>الملاحظات</th></tr>
                        </thead>
                        <tbody>
                            ${saved.map(r => `
                                <tr>
                                    <td>${r.day}</td>
                                    <td>${r.goal}</td>
                                    <td>${r.idea}</td>
                                    <td>من ${formatTime(r.start)} إلى ${formatTime(r.end)}</td>
                                    <td>${r.done ? '✅' : '❌'}</td>
                                    <td>${r.note || '-'}</td>
                                </tr>`).join("")}
                        </tbody>
                    </table>
                </div>
            </div>`;
    document.getElementById("reportsSection").innerHTML += report;
}

function showSpecificReport() {
    const key = document.getElementById("reportSelector").value;
    if (!key) return alert("⚠️ اختر تقرير أولًا");
    const saved = JSON.parse(localStorage.getItem(key));
    showReport(saved, key.replace("weekReport_", ""));
}

function printThis(button) {
    button.style.display = 'none';
    window.print();
    setTimeout(() => (button.style.display = 'inline-block'), 1000);
}

function newWeek() {
    loadTable();
}

function showIdeaModal(index) {
    document.getElementById("ideaModalContent").innerHTML = `<p>${weekData[index].ideaDetails}</p>`;
    new bootstrap.Modal(document.getElementById("ideaModal")).show();
}

function showDateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'مساءً' : 'صباحًا';
    hours = hours % 12 || 12;
    const time = `${hours}:${minutes} ${ampm}`;
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const dateStr = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} - ${time}`;
    document.getElementById("dateTime").textContent = dateStr;
}

function populateReportSelector() {
    const selector = document.getElementById("reportSelector");
    selector.innerHTML = `<option selected disabled>اختر تقرير أسبوع...</option>`;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("weekReport_")) {
            const date = key.replace("weekReport_", "");
            const option = document.createElement("option");
            option.value = key;
            option.textContent = date;
            selector.appendChild(option);
        }
    }
}

let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// زر التثبيت يظهر دائماً
installBtn.style.display = "inline-block";

// حدث beforeinstallprompt - إن توفر
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log("تم التثبيت ✅");
        } else {
            console.log("تم الرفض ❌");
        }

        deferredPrompt = null;
    } else {
        // عرض المودال إذا لم يكن beforeinstallprompt متاح
        const installModal = new bootstrap.Modal(document.getElementById('installModal'));
        installModal.show();
    }
});

// تشغيل عند تحميل الصفحة
loadTable();
showDateTime();
setInterval(showDateTime, 1000);
showAllReports();
populateReportSelector();