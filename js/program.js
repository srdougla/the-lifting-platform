let dayCount = 0;
let exerciseCounts = {};
let setCounts = {};

// Get profile data to access PRs
function getProfileData() {
    const data = localStorage.getItem('profileData');
    return data ? JSON.parse(data) : null;
}

// Convert to kg if needed
function convertToKg(value, system) {
    if (system === 'lbs') {
        return Math.round(value / 2.20462);
    }
    return Math.round(value);
}

// Navigation Functions
function showSampleProgram() {
    hideAllScreens();
    document.getElementById('sample-program-screen').style.display = 'block';
}

function showCreateProgram() {
    hideAllScreens();
    document.getElementById('create-screen').style.display = 'block';
    
    // Reset form
    dayCount = 0;
    exerciseCounts = {};
    setCounts = {};
    
    document.getElementById('programTitle').value = '';
    document.getElementById('weekNum').value = '';
    document.getElementById('weeksContainer').innerHTML = '';
    document.querySelector('.generateProgram').style.display = 'none';
    document.querySelector('.generateProgram').textContent = 'Save Program';
    delete document.getElementById('customProgram').dataset.editingId;
}

function showMyPrograms() {
    hideAllScreens();
    document.getElementById('my-programs-screen').style.display = 'block';
    loadProgramsList();
}

function backToStart() {
    hideAllScreens();
    document.getElementById('start-screen').style.display = 'block';
}

function hideAllScreens() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('create-screen').style.display = 'none';
    document.getElementById('my-programs-screen').style.display = 'none';
    document.getElementById('sample-program-screen').style.display = 'none';
    document.getElementById('program-display-screen').style.display = 'none';
}

// Program Building
function generateWeekStructure() {
    const weeks = document.getElementById('weekNum').value;
    const title = document.getElementById('programTitle').value;
    
    if (!title) {
        alert('Please enter a program title first!');
        return;
    }
    
    if (!weeks || weeks < 1) {
        alert('Please enter a valid number of weeks!');
        return;
    }
    
    const weeksContainer = document.getElementById('weeksContainer');
    weeksContainer.innerHTML = ''; // Clear any existing content
    
    // Reset counters
    dayCount = 0;
    exerciseCounts = {};
    setCounts = {};
    
    // Create a container for each week
    for (let weekNum = 1; weekNum <= weeks; weekNum++) {
        const weekDiv = document.createElement('div');
        weekDiv.className = 'week-builder';
        weekDiv.id = `week-${weekNum}`;
        
        weekDiv.innerHTML = `
            <h2>Week ${weekNum}</h2>
            <div id="daysContainer-week-${weekNum}" class="days-container-week"></div>
            <button type="button" class="addToProgram" onclick="addDayToWeek(${weekNum})">+ Add a Day to Week ${weekNum}</button>
        `;
        
        weeksContainer.appendChild(weekDiv);
    }
    
    // Show the save button
    document.querySelector('.generateProgram').style.display = 'block';
}

function addDayToWeek(weekNum) {
    dayCount++;

    const container = document.getElementById(`daysContainer-week-${weekNum}`);
    const dayDiv = document.createElement('div');

    dayDiv.className = 'day-container';
    dayDiv.id = `day-${dayCount}`;
    dayDiv.dataset.week = weekNum; // Store which week this day belongs to

    dayDiv.innerHTML = `
        <h3>Day ${dayCount} <button type="button" class="remove-btn" onclick="removeDay(${dayCount})">Remove Day</button></h3>
        <div id="exercises-day-${dayCount}"></div>
        <button type="button" class="addToProgram" onclick="addExercise(${dayCount})">+ Add Exercise</button>
    `;

    container.appendChild(dayDiv);
    exerciseCounts[dayCount] = 0;
}

function addDay() {
    dayCount++;

    const container = document.getElementById('daysContainer');
    const dayDiv = document.createElement('div');

    dayDiv.className = 'day-container';
    dayDiv.id = `day-${dayCount}`;

    dayDiv.innerHTML = `
        <h3>Day ${dayCount} <button type="button" id="removeDayBtn" class="remove-btn" onclick="removeDay(${dayCount})">Remove Day</button></h3>
        <div id="exercises-day-${dayCount}"></div>
        <button type="button" id="addExerciseBtn" class="addToProgram" onclick="addExercise(${dayCount})">+ Add Exercise</button>
    `;

    container.insertBefore(dayDiv, container.querySelector('addToProgram'));
    exerciseCounts[dayCount] = 0;
}

function removeDay(dayNum) {
    const dayDiv = document.getElementById(`day-${dayNum}`);
    if (dayDiv) dayDiv.remove();
    dayCount--;
}

function addExercise(dayNum) {
    if (!exerciseCounts[dayNum]) exerciseCounts[dayNum] = 0;
    exerciseCounts[dayNum]++;

    const exNum = exerciseCounts[dayNum];
    const container = document.getElementById(`exercises-day-${dayNum}`);
    const exDiv = document.createElement('div');

    exDiv.className = 'exercise-container';
    exDiv.id = `exercise-${dayNum}-${exNum}`;

    exDiv.innerHTML = `
        <h4>Exercise ${exNum} <button type="button" class="remove-btn" onclick="removeExercise(${dayNum}, ${exNum})">Remove</button></h4>
        
        <label>Select Exercise:</label>
        <select id="exercise-select-${dayNum}-${exNum}" onchange="toggleCustomExercise(${dayNum}, ${exNum})">
            <option value="Snatch">Snatch</option>
            <option value="Clean & Jerk">Clean & Jerk</option>
            <option value="Front Squat">Front Squat</option>
            <option value="Back Squat">Back Squat</option>
            <option value="Bench Press">Bench Press</option>
            <option value="Other">Other (Custom)</option>
        </select>
        
        <div id="custom-exercise-${dayNum}-${exNum}" style="display: none;">
            <label>Custom Exercise Name:</label>
            <input type="text" id="custom-name-${dayNum}-${exNum}" placeholder="Enter exercise name">
        </div>
        
        <div id="sets-${dayNum}-${exNum}"></div>
        <button type="button" class="addToProgram" onclick="addSet(${dayNum}, ${exNum})">+ Add a Set</button>
    `;

    container.appendChild(exDiv);
    addSet(dayNum, exNum);
}

function toggleCustomExercise(dayNum, exNum) {
    const select = document.getElementById(`exercise-select-${dayNum}-${exNum}`);
    const customDiv = document.getElementById(`custom-exercise-${dayNum}-${exNum}`);
    
    if (select.value === 'Other') {
        customDiv.style.display = 'block';
    } else {
        customDiv.style.display = 'none';
    }
}

function removeExercise(dayNum, exNum) {
    const exDiv = document.getElementById(`exercise-${dayNum}-${exNum}`);
    if (exDiv) exDiv.remove();
}

function addSet(dayNum, exNum) {
    const key = `${dayNum}-${exNum}`;

    if (!setCounts[key]) setCounts[key] = 0;
    setCounts[key]++;

    const setNum = setCounts[key];
    const container = document.getElementById(`sets-${dayNum}-${exNum}`);
    const setDiv = document.createElement('div');

    setDiv.className = 'set-row';
    setDiv.id = `set-${dayNum}-${exNum}-${setNum}`;

    setDiv.innerHTML = `
        <span>Set ${setNum}:</span>
        <label>%</label><input type="number" id="percent-${dayNum}-${exNum}-${setNum}" placeholder="N/A">
        <label>Reps</label><input type="number" id="reps-${dayNum}-${exNum}-${setNum}" required>
        <button type="button" class="remove-btn" onclick="removeSet(${dayNum}, ${exNum}, ${setNum})">×</button>
    `;
    
    container.appendChild(setDiv);
}

function removeSet(dayNum, exNum, setNum) {
    const setDiv = document.getElementById(`set-${dayNum}-${exNum}-${setNum}`);
    if (setDiv) setDiv.remove();
}

// Calculate actual weight based on exercise name and percentage
function calculateWeight(exerciseName, percent) {
    const profile = getProfileData();
    if (!profile || !percent || percent === 'N/A') return null;
    
    let pr = null;
    
    // Direct matching with dropdown values
    switch(exerciseName) {
        case 'Snatch':
            pr = profile.snatchpr;
            break;
        case 'Clean & Jerk':
            pr = profile.candjpr;
            break;
        case 'Front Squat':
            pr = profile.fspr;
            break;
        case 'Back Squat':
            pr = profile.bspr;
            break;
        case 'Bench Press':
            pr = profile.benchpr;
            break;
        default:
            return null; // Not a tracked lift
    }
    
    if (!pr) return null;
    
    // Convert to kg if needed
    const prInKg = convertToKg(pr, profile.system);
    
    // Calculate weight
    const calculatedWeight = Math.round((prInKg * percent) / 100);
    return calculatedWeight;
}

function generateProgram() {
    const title = document.getElementById('programTitle').value;
    const weeks = document.getElementById('weekNum').value;
    const editingId = document.getElementById('customProgram').dataset.editingId;
    
    if (!title) {
        alert('Please enter a program title!');
        return;
    }
    
    if (!weeks || weeks < 1) {
        alert('Please enter the number of weeks!');
        return;
    }
    
    const program = { 
        id: editingId ? parseInt(editingId) : Date.now(), // Use existing ID if editing
        title: title,
        weeks: weeks, 
        weeksData: []
    };
    
    // Loop through each week
    for (let weekNum = 1; weekNum <= weeks; weekNum++) {
        const weekData = { weekNumber: weekNum, days: [] };
        const weekContainer = document.getElementById(`daysContainer-week-${weekNum}`);
        
        if (weekContainer) {
            weekContainer.querySelectorAll('.day-container').forEach(dayDiv => {
                const day = { exercises: [] };
                
                dayDiv.querySelectorAll('.exercise-container').forEach(exDiv => {
                    const exerciseSelect = exDiv.querySelector('select');
                    const customInput = exDiv.querySelector('input[type="text"]');
                    
                    let exerciseName = '';
                    if (exerciseSelect.value === 'Other') {
                        exerciseName = customInput?.value || '';
                    } else {
                        exerciseName = exerciseSelect.value;
                    }
                    
                    if (!exerciseName) return;
                    
                    const exercise = { name: exerciseName, sets: [] };
                    
                    exDiv.querySelectorAll('.set-row').forEach(setDiv => {
                        const percentInput = setDiv.querySelector('input[id^="percent"]');
                        const repsInput = setDiv.querySelector('input[id^="reps"]');
                        
                        exercise.sets.push({
                            percent: percentInput?.value || 'N/A',
                            reps: repsInput?.value || ''
                        });
                    });
                    
                    day.exercises.push(exercise);
                });
                
                weekData.days.push(day);
            });
        }
        
        program.weeksData.push(weekData);
    }
    
    // Save or update
    if (editingId) {
        updateProgram(program);
        alert('Program updated successfully!');
    } else {
        saveProgram(program);
        alert('Program saved successfully!');
    }
    
    // Clear editing state
    delete document.getElementById('customProgram').dataset.editingId;
    document.querySelector('.generateProgram').textContent = 'Save Program';
    
    showMyPrograms();
}

function updateProgram(updatedProgram) {
    let programs = getPrograms();
    const index = programs.findIndex(p => p.id === updatedProgram.id);
    
    if (index !== -1) {
        programs[index] = updatedProgram;
        localStorage.setItem('userPrograms', JSON.stringify(programs));
    }
}

// Storage Functions
function saveProgram(program) {
    const programs = getPrograms();
    programs.push(program);
    localStorage.setItem('userPrograms', JSON.stringify(programs));
}

function getPrograms() {
    const data = localStorage.getItem('userPrograms');
    return data ? JSON.parse(data) : [];
}

function deleteProgram(programId) {
    if (confirm('Are you sure you want to delete this program?')) {
        let programs = getPrograms();
        programs = programs.filter(p => p.id !== programId);
        localStorage.setItem('userPrograms', JSON.stringify(programs));
        loadProgramsList();
    }
}

function loadProgramsList() {
    const programs = getPrograms();
    const container = document.getElementById('programs-list');
    
    if (programs.length === 0) {
        container.innerHTML = '<p>No programs yet. Create one to get started!</p>';
        return;
    }
    
    container.innerHTML = ''; // Clear the container
    
    programs.forEach(program => {
        const programCard = document.createElement('div');
        programCard.className = 'program-card';
        
        programCard.innerHTML = `
            <h2>${program.title}</h2>
            <p>${program.weeks} weeks | ${program.weeksData ? program.weeksData[0].days.length : program.days.length} days per week</p>
        `;
        
        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View Program';
        viewBtn.onclick = () => viewProgram(program.id);
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit Program';
        editBtn.onclick = () => editProgram(program.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteProgram(program.id);
        
        programCard.appendChild(viewBtn);
        programCard.appendChild(editBtn);
        programCard.appendChild(deleteBtn);
        container.appendChild(programCard);
    });
}

function editProgram(programId) {
    const programs = getPrograms();
    const program = programs.find(p => p.id === programId);
    
    if (!program) return;
    
    // Go to create screen
    hideAllScreens();
    document.getElementById('create-screen').style.display = 'block';
    
    // Store the program ID for updating later
    document.getElementById('customProgram').dataset.editingId = programId;
    
    // Populate title and weeks
    document.getElementById('programTitle').value = program.title;
    document.getElementById('weekNum').value = program.weeks;
    
    // Generate week structure
    generateWeekStructure();
    
    // Populate with existing data
    if (program.weeksData) {
        // New structure
        program.weeksData.forEach((weekData, weekIndex) => {
            weekData.days.forEach((day, dayIndex) => {
                const weekNum = weekIndex + 1;
                addDayToWeek(weekNum);
                
                const currentDayId = dayCount; // The day we just added
                
                day.exercises.forEach((exercise, exerciseIndex) => {
                    addExercise(currentDayId);
                    
                    const currentExNum = exerciseCounts[currentDayId];
                    
                    // Set exercise name
                    const exerciseSelect = document.getElementById(`exercise-select-${currentDayId}-${currentExNum}`);
                    const customInput = document.getElementById(`custom-name-${currentDayId}-${currentExNum}`);
                    const customDiv = document.getElementById(`custom-exercise-${currentDayId}-${currentExNum}`);
                    
                    // Check if it's a tracked exercise or custom
                    const trackedExercises = ['Snatch', 'Clean & Jerk', 'Front Squat', 'Back Squat', 'Bench Press'];
                    if (trackedExercises.includes(exercise.name)) {
                        exerciseSelect.value = exercise.name;
                    } else {
                        exerciseSelect.value = 'Other';
                        customDiv.style.display = 'block';
                        customInput.value = exercise.name;
                    }
                    
                    // Remove the default set that was added
                    const setsContainer = document.getElementById(`sets-${currentDayId}-${currentExNum}`);
                    setsContainer.innerHTML = '';
                    setCounts[`${currentDayId}-${currentExNum}`] = 0;
                    
                    // Add all sets
                    exercise.sets.forEach((set, setIndex) => {
                        addSet(currentDayId, currentExNum);
                        
                        const currentSetNum = setCounts[`${currentDayId}-${currentExNum}`];
                        
                        // Populate set data
                        const percentInput = document.getElementById(`percent-${currentDayId}-${currentExNum}-${currentSetNum}`);
                        const repsInput = document.getElementById(`reps-${currentDayId}-${currentExNum}-${currentSetNum}`);
                        
                        if (set.percent && set.percent !== 'N/A') {
                            percentInput.value = set.percent;
                        }
                        repsInput.value = set.reps;
                    });
                });
            });
        });
    } else {
        // Old structure (backwards compatibility)
        program.days.forEach((day, dayIndex) => {
            addDayToWeek(1); // Add all to week 1 for old structure
            
            const currentDayId = dayCount;
            
            day.exercises.forEach((exercise, exerciseIndex) => {
                addExercise(currentDayId);
                
                const currentExNum = exerciseCounts[currentDayId];
                
                // Set exercise name
                const exerciseSelect = document.getElementById(`exercise-select-${currentDayId}-${currentExNum}`);
                const customInput = document.getElementById(`custom-name-${currentDayId}-${currentExNum}`);
                const customDiv = document.getElementById(`custom-exercise-${currentDayId}-${currentExNum}`);
                
                const trackedExercises = ['Snatch', 'Clean & Jerk', 'Front Squat', 'Back Squat', 'Bench Press'];
                if (trackedExercises.includes(exercise.name)) {
                    exerciseSelect.value = exercise.name;
                } else {
                    exerciseSelect.value = 'Other';
                    customDiv.style.display = 'block';
                    customInput.value = exercise.name;
                }
                
                // Remove the default set
                const setsContainer = document.getElementById(`sets-${currentDayId}-${currentExNum}`);
                setsContainer.innerHTML = '';
                setCounts[`${currentDayId}-${currentExNum}`] = 0;
                
                // Add all sets
                exercise.sets.forEach((set, setIndex) => {
                    addSet(currentDayId, currentExNum);
                    
                    const currentSetNum = setCounts[`${currentDayId}-${currentExNum}`];
                    
                    const percentInput = document.getElementById(`percent-${currentDayId}-${currentExNum}-${currentSetNum}`);
                    const repsInput = document.getElementById(`reps-${currentDayId}-${currentExNum}-${currentSetNum}`);
                    
                    if (set.percent && set.percent !== 'N/A') {
                        percentInput.value = set.percent;
                    }
                    repsInput.value = set.reps;
                });
            });
        });
    }
    
    // Change the save button text
    document.querySelector('.generateProgram').textContent = 'Update Program';
}

function viewProgram(programId) {
    const programs = getPrograms();
    const program = programs.find(p => p.id === programId);
    
    if (!program) return;
    
    hideAllScreens();
    document.getElementById('program-display-screen').style.display = 'block';
    displayProgram(program);
}


function displayProgram(program) {
    const displayDiv = document.getElementById('program-display');
    displayDiv.innerHTML = '';
    
    // Add title
    const titleHeader = document.createElement('h1');
    titleHeader.textContent = program.title;
    displayDiv.appendChild(titleHeader);
    
    // Create program container
    const programContainer = document.createElement('div');
    programContainer.className = 'program';
    
    // Check if using new structure or old structure
    if (program.weeksData) {
        // New structure with weeksData
        program.weeksData.forEach(weekData => {
            const weekDiv = document.createElement('div');
            weekDiv.className = 'week';
            
            const weekTitle = document.createElement('h1');
            weekTitle.textContent = `Week ${weekData.weekNumber}`;
            weekDiv.appendChild(weekTitle);
            
            weekData.days.forEach((day, dayIndex) => {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'day';
                
                const dayTitle = document.createElement('h1');
                dayTitle.textContent = `DAY ${dayIndex + 1}`;
                dayDiv.appendChild(dayTitle);
                
                day.exercises.forEach(exercise => {
                    const exDiv = document.createElement('div');
                    exDiv.className = 'exercise';
                    
                    const exerciseName = document.createElement('h2');
                    exerciseName.textContent = exercise.name;
                    exDiv.appendChild(exerciseName);
                    
                    exercise.sets.forEach(set => {
                        const setInfo = document.createElement('h2');
                        
                        if (set.percent !== 'N/A' && set.percent !== '') {
                            const calculatedWeight = calculateWeight(exercise.name, set.percent);
                            
                            if (calculatedWeight) {
                                setInfo.textContent = `(${set.percent}% = ${calculatedWeight} kg x ${set.reps})`;
                            } else {
                                setInfo.textContent = `(${set.percent}% x ${set.reps})`;
                            }
                        } else {
                            setInfo.textContent = `(${set.reps} reps)`;
                        }
                        exDiv.appendChild(setInfo);
                    });
                    
                    dayDiv.appendChild(exDiv);
                });
                
                weekDiv.appendChild(dayDiv);
            });
            
            programContainer.appendChild(weekDiv);
        });
    } else {
        // Old structure (backwards compatibility)
        for (let week = 1; week <= program.weeks; week++) {
            const weekDiv = document.createElement('div');
            weekDiv.className = 'week';
            
            const weekTitle = document.createElement('h1');
            weekTitle.textContent = `Week ${week}`;
            weekDiv.appendChild(weekTitle);
            
            program.days.forEach((day, dayIndex) => {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'day';
                
                const dayTitle = document.createElement('h1');
                dayTitle.textContent = `DAY ${dayIndex + 1}`;
                dayDiv.appendChild(dayTitle);
                
                day.exercises.forEach(exercise => {
                    const exDiv = document.createElement('div');
                    exDiv.className = 'exercise';
                    
                    const exerciseName = document.createElement('h2');
                    exerciseName.textContent = exercise.name;
                    exDiv.appendChild(exerciseName);
                    
                    exercise.sets.forEach(set => {
                        const setInfo = document.createElement('h2');
                        
                        if (set.percent !== 'N/A' && set.percent !== '') {
                            const calculatedWeight = calculateWeight(exercise.name, set.percent);
                            
                            if (calculatedWeight) {
                                setInfo.textContent = `(${set.percent}% = ${calculatedWeight} kg x ${set.reps})`;
                            } else {
                                setInfo.textContent = `(${set.percent}% x ${set.reps})`;
                            }
                        } else {
                            setInfo.textContent = `(${set.reps} reps)`;
                        }
                        exDiv.appendChild(setInfo);
                    });
                    
                    dayDiv.appendChild(exDiv);
                });
                
                weekDiv.appendChild(dayDiv);
            });
            
            programContainer.appendChild(weekDiv);
        }
    }
    
    displayDiv.appendChild(programContainer);
}