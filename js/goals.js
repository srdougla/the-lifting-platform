const createGoal = document.getElementById('createGoal');
const goalForm = document.getElementById('goalForm');

// Load goals from localStorage when page loads
document.addEventListener('DOMContentLoaded', loadGoals);

// activate form when user presses a button
createGoal.addEventListener('click', () => {
    goalForm.style.display = goalForm.style.display === 'none' ? 'block' : 'none';
});

// handle form submission
goalForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const category = document.getElementById('category').value;
    const metric = document.getElementById('targetMetric').value;
    const date = document.getElementById('targetDate').value;
    const priorityElement = document.querySelector('input[name="priority"]:checked');
    
    if (!priorityElement) {
        alert('Please select a priority level');
        return;
    }
    
    const priority = priorityElement.value;
    const notes = document.getElementById('notes').value;

    if (!category || !metric || !date || !priority) return;

    // Save to localStorage first
    const goalId = saveGoal(category, metric, date, priority, notes);
    
    // Then create the card with the ID
    createGoalCard(category, metric, date, priority, notes, goalId);

    goalForm.style.display = 'none';
    goalForm.reset();
});

function createGoalCard(category, metric, date, priority, notes, goalId) {
    const goalsContainer = document.getElementById('goalsContainer');

    // create the new goal card
    const card = document.createElement('div');
    card.className = `goal-card priority-${priority.toLowerCase()}`;
    card.dataset.goalId = goalId; // Store the ID on the card

    // calculate days left until goal
    const today = new Date();
    const targetDate = new Date(date);
    const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    const daysText = daysRemaining > 0
        ? `${daysRemaining} days left`
        : daysRemaining === 0
        ? `Accomplish by today!`
        : `${Math.abs(daysRemaining)} days overdue`;

    // format date nicely
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Build card HTML
    card.innerHTML = `
        <div class="card-header">
            <h3>${category}</h3>
            <span class="priority-badge priority-${priority.toLowerCase()}">${priority} Priority</span>
        </div>
        <div class="card-body">
            <div class="goal-metric">
                <strong>Target:</strong> ${metric}
            </div>
            <div class="goal-date">
                <strong>Target Date:</strong> ${formattedDate}
                <span class="days-remaining ${daysRemaining < 0 ? 'overdue' : ''}">${daysText}</span>
            </div>
            ${notes ? `<div class="goal-notes">
                <strong>Notes:</strong>
                <p>${notes}</p>
            </div>` : ''}
        </div>
        <div class="card-actions">
            <button class="btn-complete">✓ Complete</button>
            <button class="btn-edit">Edit</button>
            <button class="btn-delete">Delete</button>
        </div>
    `;

    // handle buttons for editing, deleting, and completing cards
    const completeBtn = card.querySelector('.btn-complete');
    const editBtn = card.querySelector('.btn-edit');
    const deleteBtn = card.querySelector('.btn-delete');

    completeBtn.addEventListener('click', () => {
        card.classList.toggle('completed');
        completeBtn.textContent = card.classList.contains('completed') ? '↺ Undo' : '✓ Complete';
    });

    editBtn.addEventListener('click', () => {
        // fill in form with existing data to make it easier to edit
        document.getElementById('category').value = category;
        document.getElementById('targetMetric').value = metric;
        document.getElementById('targetDate').value = date;
        document.querySelector(`input[name="priority"][value="${priority}"]`).checked = true;
        document.getElementById('notes').value = notes;

        goalForm.style.display = 'block';

        // Delete from localStorage and DOM
        deleteGoal(goalId);
        card.remove();
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this goal?')) {
            deleteGoal(goalId);
            card.remove();
        }
    });

    goalsContainer.appendChild(card);
}

// Functions to enable local storage and let goals persist across pages

function saveGoal(category, metric, date, priority, notes) {
    const goals = getGoals();
    const goalId = Date.now().toString();
    const newGoal = {
        id: goalId,
        category, 
        metric, 
        date, 
        priority, 
        notes
    };
    goals.push(newGoal);
    localStorage.setItem('goals', JSON.stringify(goals));
    return goalId; // Return the ID so we can use it
}

function getGoals() {
    const goals = localStorage.getItem('goals');
    return goals ? JSON.parse(goals) : [];
}

function deleteGoal(goalId) {
    const goals = getGoals();
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
}

function loadGoals() {
    const goals = getGoals();
    goals.forEach(goal => {
        createGoalCard(goal.category, goal.metric, goal.date, goal.priority, goal.notes, goal.id);
    });
}