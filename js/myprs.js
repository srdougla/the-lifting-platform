const addPrBtn = document.getElementById('addPrBtn');
const newPrForm = document.getElementById('newPrForm');
const prTable = document.getElementById('prTable');

// Load PRs from localStorage when page loads
document.addEventListener('DOMContentLoaded', loadPRs);

// activate form when user presses a button
addPrBtn.addEventListener('click', () => {
    newPrForm.style.display = newPrForm.style.display === 'none' ? 'block' : 'none';
});

// handle form submission
newPrForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const lift = document.getElementById('lift').value;
    const date = document.getElementById('prDate').value;
    const weight = document.getElementById('prWeight').value;

    if (!lift || !date || !weight) return;

    // Add to table
    addPRToTable(lift, date, weight);
    
    // Save to localStorage
    savePR(lift, date, weight);

    // hide the form again and reset its inputs
    newPrForm.style.display = 'none';
    newPrForm.reset();
});

function addPRToTable(lift, date, weight) {
    const tbody = prTable.querySelector('tbody');
    const thead = prTable.querySelector('thead tr');

    // check if an entry for that lift exists already
    let liftRow = Array.from(tbody.rows).find(row => row.cells[0].textContent === lift);

    // create new row if it doesn't exist
    const isNewLift = !liftRow;
    if(isNewLift) {
        liftRow = tbody.insertRow();
        liftRow.insertCell().textContent = lift;
    }

    const dates = Array.from(thead.cells).slice(1).map(th => th.textContent);

    // find the right place to insert, based on chronological order
    let insertIndex = 1;
    while (insertIndex <= dates.length && dates[insertIndex - 1] < date) {
        insertIndex++;
    }

    const dateExists = dates.includes(date);

    // If this is a new lift row, populate it with empty cells for all existing dates
    if (isNewLift) {
        // Add empty cells to match existing date columns
        for (let i = 1; i < thead.cells.length; i++) {
            liftRow.insertCell().textContent = '';
        }
    }

    // insert new date in header row if it doesn't exist
    if (!dateExists) {
        const th = document.createElement('th');
        th.textContent = date;
        thead.insertBefore(th, thead.cells[insertIndex] || null);

        // insert empty cells for ALL lift rows at this position
        Array.from(tbody.rows).forEach(row => {
            row.insertCell(insertIndex).textContent = '';
        });
    }

    // Now set the weight in the correct cell
    liftRow.cells[insertIndex].textContent = weight;
}

// localStorage functions

function savePR(lift, date, weight) {
    const prs = getPRs();
    
    // Check if this exact PR already exists
    const existingPR = prs.find(pr => pr.lift === lift && pr.date === date);
    
    if (existingPR) {
        // Update existing PR
        existingPR.weight = weight;
    } else {
        // Add new PR
        prs.push({ lift, date, weight });
    }
    
    localStorage.setItem('prs', JSON.stringify(prs));
}

function getPRs() {
    const prs = localStorage.getItem('prs');
    return prs ? JSON.parse(prs) : [];
}

function loadPRs() {
    const prs = getPRs();
    
    // Sort PRs by date to ensure proper order
    prs.sort((a, b) => a.date.localeCompare(b.date));
    
    prs.forEach(pr => {
        addPRToTable(pr.lift, pr.date, pr.weight);
    });
}