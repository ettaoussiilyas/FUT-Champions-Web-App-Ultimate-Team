let playersData = [];

document.addEventListener("DOMContentLoaded", () => {
    console.log("Content loaded");
    loadFromLocalStorage();
    
    const addForm = document.getElementById('playerForm');
    const updateForm = document.getElementById('updatePlayerForm');
    const deleteForm = document.getElementById('deletePlayerForm');
    const searchForm = document.getElementById('searchPlayerForm');

    if (addForm) addForm.addEventListener('submit', handleAddPlayer);
    if (updateForm) updateForm.addEventListener('submit', handleUpdatePlayer);
    if (deleteForm) deleteForm.addEventListener('submit', handleDeletePlayer);
    if (searchForm) searchForm.addEventListener('submit', handleSearchPlayer);
});

function handleAddPlayer(e) {
    e.preventDefault();
    const newPlayer = getPlayerDataFromForm('playerForm');
    playersData.push(newPlayer);
    saveToLocalStorage();
    alert("Player added successfully!");
    e.target.reset();
    console.log("New player added:", newPlayer);
}


function handleUpdatePlayer(e) {
    e.preventDefault();

    // Retrieve the player's name from the input
    const playerName = document.getElementById('updatePlayerName').value;

    // Get form values
    const updatedData = {
        photo: document.getElementById('updatePlayerPicture').value,
        position: document.getElementById('updatePlayerPosition').value,
        rating: parseInt(document.getElementById('playerRating').value, 10),
        nationality: document.getElementById('playerNationality').value,
        flag: document.getElementById('updatePlayerNationalityFlag').value,
        club: document.getElementById('updatePlayerClub').value,
        logo: document.getElementById('updateTeamSelectFlag').value,
        pace: parseInt(document.getElementById('updatePlayerPace').value, 10),
        shooting: parseInt(document.getElementById('updatePlayerShooting').value, 10),
        passing: parseInt(document.getElementById('updatePlayerPassing').value, 10),
        dribbling: parseInt(document.getElementById('updatePlayerDribbling').value, 10),
        defending: parseInt(document.getElementById('updatePlayerDefending').value, 10),
        physical: parseInt(document.getElementById('updatePlayerPhysical').value, 10),
    };

    // Find the player in the local storage data
    const index = playersData.findIndex(player => player.name === playerName);

    if (index !== -1) {
        // Update the player data with the new values
        playersData[index] = { ...playersData[index], ...updatedData };
        saveToLocalStorage();
        alert("Player updated successfully!");
    } else {
        alert("Player not found!");
    }

    // Reset the form
    e.target.reset();
}



function handleDeletePlayer(e) {
    e.preventDefault();
    const playerName = document.getElementById('deletePlayerName').value;
    const index = playersData.findIndex(player => player.name === playerName);
    if (index !== -1) {
        playersData.splice(index, 1);
        saveToLocalStorage();
        alert("Player deleted successfully!");
    } else {
        alert("Player not found!");
    }
    e.target.reset();
}

function handleSearchPlayer(e) {
    e.preventDefault();
    const playerName = document.getElementById('searchPlayerName').value;
    const player = playersData.find(player => player.name === playerName);
    const resultsDiv = document.getElementById('searchResults');
    if (player) {
        resultsDiv.className = 'player-card p-4';
        resultsDiv.innerHTML =`
        <div style="margin-left: 20px ; position: absolute; top: 20%">
            <div class="text-2xl font-bold">${player.rating}</div>
            <div class="text-sm" style="font-style: bold;">${player.position}</div>
        </div>
        <div style="position: static; margin-top: 52px">
            <div>
                <img src="${player.photo}" alt="${player.name}" class="w-36 object-cover rounded-full ml-auto mr-auto p-0" style="margin-top: -8px">
            </div>
            <div class="font-bold" style="width: 100%; display: flex; align-items: center; justify-content: center;"><p>${player.name}</p></div>
            <div style="display: flex; align-items: center; justify-content: center;" class="m-0 p-0">
                <div class="player-stats" style="height: 18px;">
                    <div class="stat-item" style="display : flex ; flex-direction : column"><span>PAC</span><span>${player.pace || '-'}</span></div>
                    <div class="stat-item" style="display : flex ; flex-direction : column"><span>SHO</span><span>${player.shooting || '-'}</span></div>
                    <div class="stat-item" style="display : flex ; flex-direction : column"><span>PAS</span><span>${player.passing || '-'}</span></div>
                    <div class="stat-item" style="display : flex ; flex-direction : column"><span>DRI</span><span>${player.dribbling || '-'}</span></div>
                    <div class="stat-item" style="display : flex ; flex-direction : column"><span>DEF</span><span>${player.defending || '-'}</span></div>
                    <div class="stat-item" style="display : flex ; flex-direction : column"><span>PHY</span><span>${player.physical || '-'}</span></div>
                </div>
            </div>
            <div style="margin-top: 16px; text-align: center">
                <img src="${player.logo}" alt="${player.logo}" class="w-6 h-6 object-cover rounded-full m-auto p-0" style="display:inline">
                <img src="${player.flag}" alt="${player.flag}" class="w-6 h-6 object-cover rounded-full m-auto p-0" style="display:inline">
            </div>
        </div>
    `;
    } else {
        resultsDiv.className = '';
        resultsDiv.innerHTML = `
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <p class="font-bold">Player not found</p>
            </div>
        `;
    }
}

function getPlayerDataFromForm(formId) {
    const form = document.getElementById(formId);
    return {
        name: form.querySelector('#playerName').value,
        photo: form.querySelector('#player-picture').value,
        position: form.querySelector('#playerPosition').value,
        nationality: form.querySelector('#playerNationality').value,
        flag: form.querySelector('#playerNationalityFlag').value,
        club: form.querySelector('#playerClub').value,
        logo: form.querySelector('#teamSelectFlag').value,
        rating: parseInt(form.querySelector('#playerRating').value),
        pace: parseInt(form.querySelector('#playerPace').value),
        shooting: parseInt(form.querySelector('#playerShooting').value),
        passing: parseInt(form.querySelector('#playerPassing').value),
        dribbling: parseInt(form.querySelector('#playerDribbling').value),
        defending: parseInt(form.querySelector('#playerDefending').value),
        physical: parseInt(form.querySelector('#playerPhysical').value),
    };
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