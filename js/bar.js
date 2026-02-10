/* 
FUNCTIONALITY FOR BAR LOADING GAME

- User inputs their game settings:
    - They select "Men's Bar" or "Women's Bar"
        - this changes the starting weight of the bar to 20kg or 15kg.
    - User selects "Practice Mode" or "Game Mode"
        Practice mode: no timer, automatically has total weight on bar displayed the whole time (can still be toggled).
        Game mode: total weight is not displayed unless manually done, and a timer counts down for each round.
- User clicks "Play"
- A number is randomly generated between 20 and 300, must be a whole number.
- User drags weights to the bar, they populate both sides at once (they can't load unevenly).
- Once the user thinks they are correct, they click a submit button
    - Maybe it says something fun like "Lock it in!"
- If they are right, they can choose to play again
- If they are wrong, it says: "Incorrect weight. You are _____ kilograms over/under."
    - Then they can select "try again" or "reveal answer".
- If they have the right TOTAL but wrong plate combination, it will say:
    - So close! You have the right weight total, but not the optimal plate combination.
    - Then they can select "try again" or "reveal answer".
- Any time throughout the game user can check box saying "Show Weight" to show the current weight total
    - This is basically an easier mode of the game.
- The timer that runs is based on the difficulty of the weight -- this is based on the total amount.
    - Higher numbers have longer times for loading, and lower numbers have less time.
    - RANGES: 
        20 - 50 kg: 10s
        50 - 100: 20s
        100 - 300: 30s

WEIGHTS
0.5 kg: white change plate
1 kg: green change plate
1.5 kg: yellow change plate
2 kg: blue change plate
2.5: red change plate OR red bumper plate
5 kg: white change plate OR white bumper plate
10 kg: green plate
15 kg: yellow plate
20 kg: blue plate
25 kg: red plate
2.5 kg: COLLAR

TO DO
- fix bar order (collars before certain change plates)
- edit how plates look in css

*/ 

// initialize variables so they can be accessed across functions
let currentWeight = 0;
let currentCombo = [];

let leftPlates = [];
let rightPlates = [];

let goalWeight = 0;
let goalCombo = [];
let currentText;
let goalText;
let totalCorrect = false;
let comboCorrect = false;
let shapes = []; // the visual plates that appear in the game container
const MAX_PLATES = 7;

window.addEventListener('DOMContentLoaded', () => {
    currentText = document.getElementById('current');
    goalText = document.getElementById('goal');
})

function generateGoalWeight() {
    const goalWeight = Math.floor(Math.random() * 181) + 20;
    return goalWeight;
}

function findCombo(total, bar) {
    let sideWeight = (total - bar) / 2;
    let plateCombo = [];

    // go from largest plate to smallest plate, seeing if the total can be added to the bar.
    // if weight is below 10kg per side, bumper plates are required.
    if (sideWeight < 12.5) {

        // Use ONE bumper plate to meet minimum diameter, then change plates
        if (sideWeight >= 5) {
            // Use ONE white bumper (5kg)
            plateCombo.push('whiteBumper');
            sideWeight -= 5;
        } else if (sideWeight >= 2.5) {
            // Use ONE red bumper (2.5kg)
            plateCombo.push('redBumper');
            sideWeight -= 2.5;
        }

        // After the bumper plate, use change plates for remaining weight
        while (sideWeight >= 5) {
            plateCombo.push('change5');
            sideWeight -= 5;
        }
        while (sideWeight >= 2.5) {
            plateCombo.push('change2.5');
            sideWeight -= 2.5;
        }
        while (sideWeight >= 2) {
            plateCombo.push('change2');
            sideWeight -= 2;
        }
        while (sideWeight >= 1.5) {
            plateCombo.push('change1.5');
            sideWeight -= 1.5;
        }
        while (sideWeight >= 1) {
            plateCombo.push('change1');
            sideWeight -= 1;
        }
        while (sideWeight >= 0.5) {
            plateCombo.push('change0.5');
            sideWeight -= 0.5;
        }
        
        // No collar added for bumper plates
        return plateCombo;
    }

    // subtract collars to reserve weight for them since weights above this point require collars
    sideWeight -= 2.5;

    // Track change plates that go INSIDE collars (5kg and 2.5kg)
    let insideCollarPlates = [];
    // Track change plates that go OUTSIDE collars (2kg, 1.5kg, 1kg, 0.5kg)
    let outsideCollarPlates = [];

    // 25 Kilo Plates
    while (sideWeight >= 25) {
        plateCombo.push('red25');
        sideWeight -= 25;
    }
    // 20 Kilo Plates
    while (sideWeight >= 20) {
        plateCombo.push('blue20');
        sideWeight -= 20;
    }
    // 15 Kilo Plates
    while (sideWeight >= 15) {
        plateCombo.push('yellow15');
        sideWeight -= 15;
    }
    // 10 Kilo Plates
    while (sideWeight >= 10) {
        plateCombo.push('green10');
        sideWeight -= 10;
    }
    // 5 Kilo Plates (INSIDE collars)
    while (sideWeight >= 5) {
        insideCollarPlates.push('change5');
        sideWeight -= 5;
    }
    // 2.5 Kilo Plates (INSIDE collars)
    while (sideWeight >= 2.5) {
        insideCollarPlates.push('change2.5');
        sideWeight -= 2.5;
    }
    // 2 Kilo Plates (OUTSIDE collars)
    while (sideWeight >= 2) {
        outsideCollarPlates.push('change2');
        sideWeight -= 2;
    }
    // 1.5 Kilo Plates (OUTSIDE collars)
    while (sideWeight >= 1.5) {
        outsideCollarPlates.push('change1.5');
        sideWeight -= 1.5;
    }
    // 1 Kilo Plates (OUTSIDE collars)
    while (sideWeight >= 1) {
        outsideCollarPlates.push('change1');
        sideWeight -= 1;
    }
    // 0.5 Kilo Plates (OUTSIDE collars)
    while (sideWeight >= 0.5) {
        outsideCollarPlates.push('change0.5');
        sideWeight -= 0.5;
    }
    
    // Assemble in correct order: big plates, inside-collar changes, collars, outside-collar changes
    plateCombo = [...plateCombo, ...insideCollarPlates, 'collars', ...outsideCollarPlates];
    
    return plateCombo;
}

function addWeight(amount, name) {
    // safety check
    if (!currentText) {
        alert('Select a weight first!');
        return;
    }

    // check if limit is reached, e.g. if adding a plate is allowed
    if (leftPlates.length >= MAX_PLATES) {
        alert('Maximum amount of plates reached. Try rearranging if you have not hit your total!');
        return;
    }

    currentWeight += (amount * 2);
    currentText.textContent = currentWeight;
    currentCombo.push(name);

    // create the new plate w/ unique ID
    const plateId = Date.now() + Math.random(); // makes sure ID is unique
    const plate = {
        id: plateId,
        weight: amount,
        name: name
    };

    // add plate to BOTH sides
    leftPlates.push({...plate});
    rightPlates.push({...plate});

    // update bar
    renderBarbell();
}

function renderBarbell() {
    // access left and right sleeves from html
    const leftSleeve = document.getElementById('left-sleeve');
    const rightSleeve = document.getElementById('right-sleeve');

    // clear exisiting plates
    leftSleeve.innerHTML = '';
    rightSleeve.innerHTML = '';

    // render left side
    leftPlates.forEach((plate, index) => {
        const plateElement = createPlateElement(plate, 'left', index);
        leftSleeve.appendChild(plateElement);
    });

    // render right side
    rightPlates.forEach((plate, index) => {
        const plateElement = createPlateElement(plate, 'right', index);
        rightSleeve.appendChild(plateElement);
    });
}

function createPlateElement(plate, side, index) {
    const plateDiv = document.createElement('div');
    plateDiv.classList.add('plate-onbar');
    plateDiv.dataset.id = plate.id;
    plateDiv.dataset.side = side;

    // style based on plate type
    plateDiv.classList.add(getPlateClass(plate.name));

    // add click handler to allow removal
    plateDiv.addEventListener('click', () => removePlate(plate.id, side));

    return plateDiv;
}

function getPlateClass(plateName) {
    // return CSS based on which plate
    // change plates:
    if (plateName.includes('change')) {
        if (plateName.includes('0.5')) return 'change-white-tiny-plate';
        if (plateName.includes('1.5')) return 'change-yellow-plate';
        if (plateName.includes('1')) return 'change-green-plate';
        if (plateName.includes('2.5')) return 'change-red-plate';
        if (plateName.includes('2')) return 'change-blue-plate';
        if (plateName.includes('5')) return 'change-white-plate';
    }
    // bumper plates:
    if (plateName.includes('Bumper')) {
        if (plateName.includes('white')) return 'bumper-white-plate';
        if (plateName.includes('red')) return 'bumper-red-plate';
    }
    // normal plates
    if (plateName.includes('red')) return 'red-plate';
    if (plateName.includes('blue')) return 'blue-plate';
    if (plateName.includes('yellow')) return 'yellow-plate';
    if (plateName.includes('green')) return 'green-plate';
    if (plateName.includes('white')) return 'white-plate';
    if (plateName.includes('collar')) return 'collar-plate';
    // default (if error)
    return 'default-plate';
}

function removePlate(plateId, side) {
    const leftIndex = leftPlates.findIndex(p => p.id === plateId);
    const rightIndex = rightPlates.findIndex(p => p.id === plateId);

    // check it exists
    if (leftIndex === -1 || rightIndex === -1) return;

    // get plate info before removing
    const removedPlate = leftPlates[leftIndex];

    // remove from both sides
    leftPlates.splice(leftIndex, 1);
    rightPlates.splice(rightIndex, 1);

    // subtract weight from total
    currentWeight -= (removedPlate.weight * 2);
    currentText.textContent = currentWeight;

    // remove from array
    const comboIndex = currentCombo.indexOf(removedPlate.name);
    if (comboIndex > -1) {
        currentCombo.splice(comboIndex, 1);
    }

    // render bar again
    renderBarbell();
}

function checkWeight() {
    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('feedback-title');
    const message = document.getElementById('feedback-message');
    const tryAgainBtn = document.getElementById('try-again-btn');
    const revealBtn = document.getElementById('reveal-answer-btn');
    const nextRoundBtn = document.getElementById('next-round-btn');

    // check the total weight overall
    if (currentWeight == goalWeight) {
        totalCorrect = true;
        // check the arrangement of plates to see if order is correct
        if (JSON.stringify(currentCombo) === JSON.stringify(goalCombo)) {
            comboCorrect = true;
            title.textContent = '🎉 Perfect!';
            message.textContent = 'Bar total and plate combination are both CORRECT!';
            tryAgainBtn.style.display = 'none';
            revealBtn.style.display = 'none';
            nextRoundBtn.style.display = 'inline-block';
        } else {
            title.textContent = '⚠️ So Close!';
            message.textContent = 'You have the right weight total, but not the optimal plate combination.';
            tryAgainBtn.style.display = 'inline-block';
            revealBtn.style.display = 'inline-block';
            nextRoundBtn.style.display = 'none';
        }
    } else {
        const difference = Math.abs(currentWeight - goalWeight);
        const overUnder = currentWeight > goalWeight ? 'over' : 'under';
        title.textContent = '❌ Incorrect Weight';
        message.textContent = `You are ${difference} kilograms ${overUnder}.`;
        tryAgainBtn.style.display = 'inline-block';
        revealBtn.style.display = 'inline-block';
        nextRoundBtn.style.display = 'none';
    }

    modal.style.display = 'flex';
}

// Try Again - just closes the modal
document.getElementById('try-again-btn').addEventListener('click', function() {
    document.getElementById('feedback-modal').style.display = 'none';
});

// Reveal Answer
document.getElementById('reveal-answer-btn').addEventListener('click', function() {
    document.getElementById('feedback-modal').style.display = 'none';
    showAnswer();
});

// Next Round
document.getElementById('next-round-btn').addEventListener('click', function() {
    document.getElementById('feedback-modal').style.display = 'none';
    startNewRound();
});

function showAnswer() {
    const answerDisplay = document.getElementById('answer-display');
    const answerGoalWeight = document.getElementById('answer-goal-weight');
    const plateBreakdown = document.getElementById('plate-breakdown');
    const answerLeftSleeve = document.getElementById('answer-left-sleeve');
    const answerRightSleeve = document.getElementById('answer-right-sleeve');
    
    // Set goal weight
    answerGoalWeight.textContent = goalWeight;
    
    // Clear previous answer plates
    answerLeftSleeve.innerHTML = '';
    answerRightSleeve.innerHTML = '';
    plateBreakdown.innerHTML = '';
    
    // Create plate elements for visual display
    goalCombo.forEach((plateName, index) => {
        // Add to left sleeve
        const leftPlate = document.createElement('div');
        leftPlate.classList.add('plate-onbar');
        leftPlate.classList.add(getPlateClass(plateName));
        answerLeftSleeve.appendChild(leftPlate);
        
        // Add to right sleeve
        const rightPlate = document.createElement('div');
        rightPlate.classList.add('plate-onbar');
        rightPlate.classList.add(getPlateClass(plateName));
        answerRightSleeve.appendChild(rightPlate);
    });
    
    // Build text list
    const plateWeights = {
        'red25': '25 kg (Red)',
        'blue20': '20 kg (Blue)',
        'yellow15': '15 kg (Yellow)',
        'green10': '10 kg (Green)',
        'change5': '5 kg (White Change)',
        'change2.5': '2.5 kg (Red Change)',
        'change2': '2 kg (Blue Change)',
        'change1.5': '1.5 kg (Yellow Change)',
        'change1': '1 kg (Green Change)',
        'change0.5': '0.5 kg (White Change)',
        'whiteBumper': '5 kg (White Bumper)',
        'redBumper': '2.5 kg (Red Bumper)',
        'collars': '2.5 kg (Collars)'
    };
    
    goalCombo.forEach(plate => {
        const li = document.createElement('li');
        li.textContent = plateWeights[plate] || plate;
        plateBreakdown.appendChild(li);
    });
    
    answerDisplay.style.display = 'flex';
}

// Play Again from answer screen
document.getElementById('play-again-btn').addEventListener('click', function() {
    document.getElementById('answer-display').style.display = 'none';
    startNewRound();
});

function startNewRound() {
    // Get the current bar weight
    const currentBar = currentWeight - (leftPlates.reduce((sum, plate) => sum + plate.weight, 0) * 2);
    
    // Reset the game
    currentWeight = currentBar;
    currentCombo = [];
    leftPlates = [];
    rightPlates = [];
    renderBarbell();
    
    // Generate new goal
    goalWeight = generateGoalWeight();
    goalCombo = findCombo(goalWeight, currentBar);
    
    goalText.textContent = goalWeight;
    currentText.textContent = currentWeight;
}

function startGame() {
    const barOptions = document.querySelector('input[name="barWeight"]:checked');
    
    if (!barOptions) {
        alert('Please select a bar weight!');
        return;
    }
    
    const bar = Number(barOptions.value);
    currentWeight = bar;
    currentCombo = [];
    leftPlates = [];
    rightPlates = [];
    renderBarbell();

    goalWeight = generateGoalWeight();
    goalCombo = findCombo(goalWeight, bar);

    goalText = document.getElementById('goal');
    goalText.textContent = goalWeight;

    currentText = document.getElementById('current');
    currentText.textContent = currentWeight;

    // Hide start screen and show game
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
}

document.getElementById('gameStart').addEventListener('submit', function (e) {
    e.preventDefault();
    startGame();
});