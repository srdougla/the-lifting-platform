const profileData = localStorage.getItem('profileData');
const parsedData = JSON.parse(profileData);

// Helper function to convert to kg if needed
function convertToKg(value, system) {
    if (system === 'lbs') {
        return Math.round(value / 2.20462);
    }
    return Math.round(value);
}

// Convert all PRs to kg
const snatchpr = convertToKg(parsedData.snatchpr, parsedData.system);
const cjpr = convertToKg(parsedData.candjpr, parsedData.system);
const bspr = convertToKg(parsedData.bspr, parsedData.system);
const fspr = convertToKg(parsedData.fspr, parsedData.system);
const benchpr = convertToKg(parsedData.benchpr, parsedData.system);

let percent = .50;
for (let i = 1; i < 12; i++) {
    let snatchid = 'snatch' + i;
    let snatchAmt = Math.round(snatchpr * percent);

    let cjid = 'cj' + i;
    let cjAmt = Math.round(cjpr * percent);

    let bsid = 'bs' + i;
    let bsAmt = Math.round(bspr * percent);

    let fsid = 'fs' + i;
    let fsAmt = Math.round(fspr * percent);

    document.getElementById(snatchid).textContent = snatchAmt;
    document.getElementById(cjid).textContent = cjAmt;
    document.getElementById(bsid).textContent = bsAmt;
    document.getElementById(fsid).textContent = fsAmt;
    
    percent = percent + 0.05;
}

// Solve for a weight (total * percent = weight)
document.getElementById('totalGiven1').addEventListener('input', calculateWeight);
document.getElementById('percentGiven').addEventListener('input', calculateWeight);

function calculateWeight() {
    const total = parseFloat(document.getElementById('totalGiven1').value);
    const percent = parseFloat(document.getElementById('percentGiven').value);
    
    if (!isNaN(total) && !isNaN(percent)) {
        const weight = Math.round((total * percent) / 100);
        displayWeightResult(weight, total, percent);
    }
}

function displayWeightResult(weight, total, percent) {
    // Check if result div exists, if not create it
    let resultDiv = document.querySelector('.solving .info-intro:first-child .result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.classList.add('result');
        document.querySelector('.solving .info-intro:first-child').appendChild(resultDiv);
    }
    
    resultDiv.innerHTML = `<p><strong>${percent}% of ${total} kg = ${weight} kg</strong></p>`;
}

// Solve for a percentage (portion / total * 100 = percent)
document.getElementById('totalGiven2').addEventListener('input', calculatePercent);
document.getElementById('portionGiven').addEventListener('input', calculatePercent);

function calculatePercent() {
    const total = parseFloat(document.getElementById('totalGiven2').value);
    const portion = parseFloat(document.getElementById('portionGiven').value);
    
    if (!isNaN(total) && !isNaN(portion) && total !== 0) {
        const percent = (portion / total) * 100;
        displayPercentResult(percent, portion, total);
    }
}

function displayPercentResult(percent, portion, total) {
    // Check if result div exists, if not create it
    let resultDiv = document.querySelector('.solving .info-intro:last-child .result');
    if (!resultDiv) {
        resultDiv = document.createElement('div');
        resultDiv.classList.add('result');
        document.querySelector('.solving .info-intro:last-child').appendChild(resultDiv);
    }
    
    resultDiv.innerHTML = `<p><strong>${portion} kg is ${percent.toFixed(2)}% of ${total} kg</strong></p>`;
}