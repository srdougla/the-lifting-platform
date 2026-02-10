const cal = document.getElementById('calendar');
const monthYearEl = document.getElementById('monthYear');
const eventModal = document.getElementById('eventModal');
const eventInput = document.getElementById('eventInput');

let currentDate = new Date();
let selectedDate = null;
let events = {
    "2025-11-4": ["UMWF World Championships"],
    "2025-11-5": ["Virus Weightlifting Finals"],
    "2025-11-6": ["UO Weightlifting Winter Open (NUQ)"],
    "2025-11-13": ["Merry Liftmas"],
    "2025-11-14": ["Worcester County Classic (NUQ)"],
    "2026-0-10": ["Wicked Wintah Warmah (NUQ)"],
    "2026-0-17": ["NWC New Year Open"],
    "2026-0-24": ["2026 NYC Regional & Open"]
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function renderCalendar() {
    cal.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthYearEl.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
    
    dayNames.forEach(day => {
    const header = document.createElement('div');
    header.className = 'day-header';
    header.textContent = day;
    cal.appendChild(header);
    });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
    createDayCell(prevMonthDays - i, true);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
    createDayCell(day, false);
    }
    
    const remainingCells = 42 - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
    createDayCell(day, true);
    }
}

function createDayCell(day, isOtherMonth) {
    const cell = document.createElement('div');
    cell.className = 'day-cell' + (isOtherMonth ? ' other-month' : '');
    
    const dayNum = document.createElement('div');
    dayNum.className = 'day-number';
    dayNum.textContent = day;
    cell.appendChild(dayNum);
    
    if (!isOtherMonth) {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    
    if (events[dateKey]) {
        events[dateKey].forEach((evt, idx) => {
        const eventEl = document.createElement('div');
        eventEl.className = 'event';
        eventEl.innerHTML = `
            <span>${evt}</span>
            <button class="delete-btn">×</button>
        `;
        eventEl.querySelector('.delete-btn').onclick = (e) => {
            e.stopPropagation();
            deleteEvent(dateKey, idx);
        };
        cell.appendChild(eventEl);
        });
    }
    
    cell.onclick = () => openModal(day);
    }
    
    cal.appendChild(cell);
}

function openModal(day) {
    selectedDate = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
    eventInput.value = '';
    eventModal.classList.add('active');
    eventInput.focus();
}

function closeModal() {
    eventModal.classList.remove('active');
}

function addEvent() {
    const text = eventInput.value.trim();
    if (text && selectedDate) {
    if (!events[selectedDate]) {
        events[selectedDate] = [];
    }
    events[selectedDate].push(text);
    closeModal();
    renderCalendar();
    }
}

function deleteEvent(dateKey, idx) {
    events[dateKey].splice(idx, 1);
    if (events[dateKey].length === 0) {
    delete events[dateKey];
    }
    renderCalendar();
}

document.getElementById('prevMonth').onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById('nextMonth').onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

document.getElementById('today').onclick = () => {
    currentDate = new Date();
    renderCalendar();
};

document.getElementById('addButton').onclick = addEvent;
document.getElementById('deleteButton').onclick = closeModal;

eventInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addEvent();
});

eventModal.onclick = (e) => {
    if (e.target === eventModal) closeModal();
};

renderCalendar();