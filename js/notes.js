// Display current date
function displayCurrentDate() {
    const dateElement = document.getElementById('current-date');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// Load entries from localStorage
function loadEntries() {
    const entries = localStorage.getItem('notebookEntries');
    return entries ? JSON.parse(entries) : [];
}

// Save entries to localStorage
function saveEntries(entries) {
    localStorage.setItem('notebookEntries', JSON.stringify(entries));
}

// Generate unique ID
function generateId() {
    return Date.now() + Math.random();
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Display all entries
function displayEntries() {
    const entries = loadEntries();
    const container = document.getElementById('entries-container');

    if (entries.length === 0) {
        container.innerHTML = '<div class="no-entries">No entries yet. Start writing!</div>';
        return;
    }

    // Sort entries by date (newest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = entries.map(entry => `
        <div class="entry-card-notes" data-id="${entry.id}">
            <div class="entry-view">
                <div class="entry-header">
                    <h3 class="entry-title">${entry.title}</h3>
                    <span class="entry-date">${formatDate(entry.date)}</span>
                </div>
                <p class="entry-content">${entry.content}</p>
                <div class="entry-actions">
                    <button class="btn btn-edit-notes" onclick="editEntry('${entry.id}')">Edit</button>
                    <button class="btn btn-delete-notes" onclick="deleteEntry('${entry.id}')">Delete</button>
                </div>
            </div>

            <div class="edit-form-notes" id="edit-form-notes-${entry.id}">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="edit-title-${entry.id}" value="${entry.title}" required>
                </div>
                <div class="form-group-notes">
                    <label>Entry</label>
                    <textarea id="edit-content-${entry.id}" required>${entry.content}</textarea>
                </div>
                <button class="btn btn-primary-notes" onclick="saveEdit('${entry.id}')">Save Changes</button>
                <button class="btn btn-cancel-notes" onclick="cancelEdit('${entry.id}')">Cancel</button>
            </div>
        </div>
    `).join('');
}

// Add new entry
document.getElementById('notes-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('entry-title').value;
    const content = document.getElementById('entry-content').value;
    const date = new Date().toISOString();

    const entries = loadEntries();
    const newEntry = {
        id: generateId(),
        title: title,
        content: content,
        date: date
    };

    entries.push(newEntry);
    saveEntries(entries);

    // Clear form
    document.getElementById('entry-title').value = '';
    document.getElementById('entry-content').value = '';

    // Refresh display
    displayEntries();
});

// Edit entry
function editEntry(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    const viewSection = card.querySelector('.entry-view');
    const editSection = card.querySelector('.edit-form');

    viewSection.style.display = 'none';
    editSection.classList.add('active');
}

// Cancel edit
function cancelEdit(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    const viewSection = card.querySelector('.entry-view');
    const editSection = card.querySelector('.edit-form');

    viewSection.style.display = 'block';
    editSection.classList.remove('active');
}

// Save edit
function saveEdit(id) {
    const newTitle = document.getElementById(`edit-title-${id}`).value;
    const newContent = document.getElementById(`edit-content-${id}`).value;

    const entries = loadEntries();
    const entryIndex = entries.findIndex(entry => entry.id == id);

    if (entryIndex !== -1) {
        entries[entryIndex].title = newTitle;
        entries[entryIndex].content = newContent;
        saveEntries(entries);
        displayEntries();
    }
}

// Delete entry
function deleteEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        const entries = loadEntries();
        const filteredEntries = entries.filter(entry => entry.id != id);
        saveEntries(filteredEntries);
        displayEntries();
    }
}

// Initialize
displayCurrentDate();
displayEntries();