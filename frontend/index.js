import { backend } from 'declarations/backend';

let events = [];

async function loadEvents() {
    events = await backend.getAllEvents();
    renderCalendar();
    renderEventList();
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;

        const dayEvents = events.filter(event => {
            const eventDate = new Date(Number(event.date) / 1000000);
            return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });

        if (dayEvents.length > 0) {
            dayElement.classList.add('has-events');
            dayElement.title = dayEvents.map(event => event.title).join(', ');
        }

        calendar.appendChild(dayElement);
    }
}

function renderEventList(filteredEvents = events) {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';
    filteredEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.innerHTML = `
            <h3>${event.title}</h3>
            <p>Date: ${new Date(Number(event.date) / 1000000).toLocaleDateString()}</p>
            <p>Type: ${event.eventType === 'sports' ? 'Adventure' : 'Learning'}</p>
            <p>${event.description}</p>
            <button onclick="removeEvent(${event.id})">Mine Event</button>
        `;
        eventList.appendChild(eventElement);
    });
}

async function addEvent(event) {
    event.preventDefault();
    const date = new Date(document.getElementById('eventDate').value).getTime() * 1000000;
    const title = document.getElementById('eventTitle').value;
    const eventType = document.getElementById('eventType').value;
    const description = document.getElementById('eventDescription').value;

    await backend.addEvent(BigInt(date), title, eventType, description);
    loadEvents();
    event.target.reset();
}

async function removeEvent(id) {
    await backend.removeEvent(id);
    loadEvents();
}

document.getElementById('eventForm').addEventListener('submit', addEvent);

document.getElementById('filterAll').addEventListener('click', () => renderEventList());
document.getElementById('filterSports').addEventListener('click', () => {
    const adventureEvents = events.filter(event => event.eventType === 'sports');
    renderEventList(adventureEvents);
});
document.getElementById('filterSchool').addEventListener('click', () => {
    const learningEvents = events.filter(event => event.eventType === 'school');
    renderEventList(learningEvents);
});

window.removeEvent = removeEvent;
loadEvents();
