// Only run this code if we're on editprofile.html
const profileForm = document.getElementById('profile');
if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            age: document.getElementById('age').value,
            weight: document.getElementById('weight').value,
            system: document.querySelector('input[name="system"]:checked').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            snatchpr: document.getElementById('snatchpr').value,
            candjpr: document.getElementById('candjpr').value,
            bspr: document.getElementById('backsquatpr').value,
            fspr: document.getElementById('frontsquatpr').value,
            benchpr: document.getElementById('benchpr').value,
        };  

        formData.totalpr = Number(formData.snatchpr) + Number(formData.candjpr);
      
        // Handle profile picture
        const fileInput = document.getElementById('profilePic');
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                formData.profilePic = e.target.result; // base64 string
                localStorage.setItem('profileData', JSON.stringify(formData));
                window.location.href = 'profile.html';
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            localStorage.setItem('profileData', JSON.stringify(formData));
            window.location.href = 'profile.html';
        }
    });
}

function saveProfile(formData) {
    localStorage.setItem('profileData', JSON.stringify(formData));
}

function loadProfile() {
    const data = localStorage.getItem('profileData');
    return data ? JSON.parse(data) : null;
}

function convertToKg(value, system) {
    if (system === 'lbs') {
        return (value / 2.20462).toFixed(2);
    }
    return value;
}

window.addEventListener('load', function() {
    const profile = loadProfile();
    
    if (profile) {
        // Convert weights if in lbs
        const snatchKg = profile.snatchpr ? convertToKg(profile.snatchpr, profile.system) : null;
        const candjKg = profile.candjpr ? convertToKg(profile.candjpr, profile.system) : null;
        const weightKg = convertToKg(profile.weight, profile.system);
        
        // This will only run on index.html
        const greetingElement = document.getElementById('greeting');
        if (greetingElement) {
            greetingElement.textContent = "Hi, " + profile.firstName + "!";

            const snatchPR = document.getElementById('stat1');
            const candjPR = document.getElementById('stat2');
            if (snatchPR) {
                snatchPR.textContent = snatchKg ? "Snatch PR: " + snatchKg + " kgs" : "Snatch PR: ____";
            }
            if (candjPR) {
                candjPR.textContent = candjKg ? "C&J PR: " + candjKg + " kgs" : "C&J PR: ____";
            }
            
            const totalpr = (snatchKg && candjKg) ? (Number(snatchKg) + Number(candjKg)).toFixed(2) : null;
            const stat3 = document.getElementById('stat3');
            if (stat3) {
                stat3.textContent = totalpr ? "TOTAL: " + totalpr + " kgs" : "TOTAL: ____";
            }
        }
        
        // This will only run on profile.html
        const displayName = document.getElementById('display-name');
        const displayAge = document.getElementById('display-age');
        const displayGender = document.getElementById('display-gender');
        const displayWeight = document.getElementById('display-weight');
        const displayTotal = document.getElementById('display-total');
        
        if (displayName) {
            displayName.textContent = profile.firstName + " " + profile.lastName;
        }
        if (displayAge) {
            displayAge.textContent = profile.age + " years old";
        }
        if (displayGender) {
            displayGender.textContent = profile.gender + ", ";
        }
        if (displayWeight) {
            displayWeight.textContent = weightKg + " kgs";
        }
        if (displayTotal) {
            const totalpr = (snatchKg && candjKg) ? (Number(snatchKg) + Number(candjKg)).toFixed(2) : null;
            displayTotal.textContent = totalpr ? "Total PR: " + totalpr + " kgs" : "Total PR: ____";
        }

        // Display profile picture
        const profilePicImg = document.querySelector('.profile-pic img');
        if (profilePicImg && profile.profilePic) {
            profilePicImg.src = profile.profilePic;
        }
    }
})

// Pre-fill form on editprofile.html
window.addEventListener('DOMContentLoaded', function() {
    const profile = loadProfile();
    
    // Check if we're on editprofile.html by looking for the form
    const editForm = document.getElementById('profile');
    
    if (editForm && profile) {
        // Fill in basic info
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const ageInput = document.getElementById('age');
        const weightInput = document.getElementById('weight');
        
        if (firstNameInput) firstNameInput.value = profile.firstName || '';
        if (lastNameInput) lastNameInput.value = profile.lastName || '';
        if (ageInput) ageInput.value = profile.age || '';
        if (weightInput) weightInput.value = profile.weight || '';
        
        // Set system radio button
        if (profile.system === 'lbs') {
            const lbsRadio = document.getElementById('lbs');
            if (lbsRadio) lbsRadio.checked = true;
        } else if (profile.system === 'kgs') {
            const kgsRadio = document.getElementById('kgs');
            if (kgsRadio) kgsRadio.checked = true;
        }
        
        // Set gender radio button
        if (profile.gender === 'Male') {
            const maleRadio = document.getElementById('male');
            if (maleRadio) maleRadio.checked = true;
        } else if (profile.gender === 'Female') {
            const femaleRadio = document.getElementById('female');
            if (femaleRadio) femaleRadio.checked = true;
        }
        
        // Fill in PRs (optional fields)
        const snatchInput = document.getElementById('snatchpr');
        const candjInput = document.getElementById('candjpr');
        const bsInput = document.getElementById('backsquatpr');
        const fsInput = document.getElementById('frontsquatpr');
        const benchInput = document.getElementById('benchpr');
        
        if (snatchInput && profile.snatchpr) snatchInput.value = profile.snatchpr;
        if (candjInput && profile.candjpr) candjInput.value = profile.candjpr;
        if (bsInput && profile.bspr) bsInput.value = profile.bspr;
        if (fsInput && profile.fspr) fsInput.value = profile.fspr;
        if (benchInput && profile.benchpr) benchInput.value = profile.benchpr;
        
        // Show current profile picture preview
        if (profile.profilePic) {
            const profilePicFieldset = document.querySelector('fieldset:has(#profilePic)');
            if (profilePicFieldset) {
                const preview = document.createElement('div');
                preview.style.marginTop = '10px';
                preview.innerHTML = `
                    <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Current profile picture:</p>
                    <img src="${profile.profilePic}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid #667eea; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <p style="font-size: 12px; color: #999; margin-top: 5px;"><em>Upload a new image to replace</em></p>
                `;
                profilePicFieldset.appendChild(preview);
            }
        }
    }
});

