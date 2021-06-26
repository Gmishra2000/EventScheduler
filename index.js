// const date = new Date();
// console.log(date.getFullYear());
let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const monthDays = document.querySelector(".days");
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


// Open event scheduler Modal to add event
function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);
    // if event already exist 
    if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block';
    } else {
        newEventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';
}


// Main function to load the calendar in Ui
function load() {
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    
    var date = (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-in', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    // padding days is to calculate no of days left in last month of current month and next month
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.querySelector('.header h2').innerText =
        `${dt.toLocaleDateString('en-in', { month: 'long' })} ${year}`;

    monthDays.innerHTML = '';
    
    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('div');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;
        

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
            const eventForDay = events.find(e => e.date === dayString);

            if (i - paddingDays === day && nav === 0) {
                daySquare.classList.add('today');
            }

            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }
            // Event listener added on each grid to open event modal
            daySquare.addEventListener('click', () => openModal(dayString));
            // Event Listener on create event button 
            document.querySelector("#plus").addEventListener('click',() => openModal(date))

        } else {
            daySquare.classList.add('padding');
        }

        monthDays.appendChild(daySquare);
    }
}


// Once we open any modal we can close that using close button
function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load();
}

// This will save event in local Storage
function saveEvent() {
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }
}

// to delete any event by clicking on that
function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

// go to next month and previous month of calendar
function initButtons() {
    document.querySelector(".prev").addEventListener("click", () => {
        nav--;
        load();
    });

    document.querySelector(".next").addEventListener("click", () => {
        nav++;
        load();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();
