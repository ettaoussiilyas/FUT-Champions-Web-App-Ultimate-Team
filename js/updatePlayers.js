let playersData = [];

document.addEventListener("DOMContentLoaded", () => {
    console.log("Content loaded");
    loadFromLocalStorage();
    
    const form = document.getElementById('playerForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    } else {
        console.error("Form with id 'playerForm' not found");
    }
});

function handleFormSubmit(e) {
    e.preventDefault();
    console.log("Form submitted");
    
    const newPlayer = {
        name: document.getElementById('playerName').value,
        photo: document.getElementById('player-picture').value,
        position: document.getElementById('playerPosition').value,
        nationality: document.getElementById('playerNationality').value,
        flag: document.getElementById('playerNationalityFlag').value,
        club: document.getElementById('playerClub').value,
        logo: document.getElementById('teamSelectFlag').value,
        rating: parseInt(document.getElementById('playerRating').value),
        pace: parseInt(document.getElementById('playerPace').value),
        shooting: parseInt(document.getElementById('playerShooting').value),
        passing: parseInt(document.getElementById('playerPassing').value),
        dribbling: parseInt(document.getElementById('playerDribbling').value),
        defending: parseInt(document.getElementById('playerDefending').value),
        physical: parseInt(document.getElementById('playerPhysical').value),
    };
    
    playersData.push(newPlayer);
    saveToLocalStorage();
    
    alert("Player added successfully!");
    e.target.reset();
    console.log("New player added:", newPlayer);
}

function loadFromLocalStorage() {
    const savedPlayersData = localStorage.getItem('playersData');
    if (savedPlayersData) {
        playersData = JSON.parse(savedPlayersData);
        console.log("Loaded players data from localStorage:", playersData);
    }
}

function saveToLocalStorage() {
    localStorage.setItem('playersData', JSON.stringify(playersData));
    console.log("Saved players data to localStorage:", playersData);
}

