let playersData = [];

document.addEventListener("DOMContentLoaded", () => {
    console.log("Content loaded");
    loadFromLocalStorage();
    

    const storedData = localStorage.getItem('playersData');
    if (storedData) {
        playersData = JSON.parse(storedData);
    }
    const checkButton = document.getElementById('checkPlayerButton');
    const updateForm = document.getElementById('updatePlayerForm');
    
    if (checkButton) {
        checkButton.addEventListener('click', handleCheckPlayer);
    }
    
    if (updateForm) {
        updateForm.addEventListener('submit', handleUpdatePlayer);
    }



    const addForm = document.getElementById('playerForm');
    // const updateForm = document.getElementById('updatePlayerForm');
    const deleteForm = document.getElementById('deletePlayerForm');
    const searchForm = document.getElementById('searchPlayerForm');
    const positionSelect = document.getElementById('playerPosition');

    if (addForm) addForm.addEventListener('submit', handleAddPlayer);
    if (updateForm) updateForm.addEventListener('submit', handleUpdatePlayer);
    if (deleteForm) deleteForm.addEventListener('submit', handleDeletePlayer);
    if (searchForm) searchForm.addEventListener('submit', handleSearchPlayer);
    if (positionSelect) positionSelect.addEventListener('change', handlePositionChange);
});

function handlePositionChange(e) {
    const position = e.target.value;
    const gkPlayer = document.querySelector('.gk-player');
    const normalPlayer = document.querySelector('.normal-player');

    if (position === 'GK') {
        gkPlayer.classList.remove('hidden');
        normalPlayer.classList.add('hidden');
        
        // Add required attributes for GK fields
        gkPlayer.querySelectorAll('input, select').forEach(input => input.setAttribute('required', ''));
        normalPlayer.querySelectorAll('input, select').forEach(input => input.removeAttribute('required'));
    } else {
        gkPlayer.classList.add('hidden');
        normalPlayer.classList.remove('hidden');
        
        // Add required attributes for normal player fields
        normalPlayer.querySelectorAll('input, select').forEach(input => input.setAttribute('required', ''));
        gkPlayer.querySelectorAll('input, select').forEach(input => input.removeAttribute('required'));
    }
}

function handleAddPlayer(e) {
    e.preventDefault();
    const newPlayer = getPlayerDataFromForm('playerForm');
    playersData.push(newPlayer);
    saveToLocalStorage();
    alert("Player added successfully!");
    
    // Reset form
    e.target.reset();
    
    // Reset UI - hide all sections and show initial state
    document.querySelector('.normal-player').classList.add('hidden');
    document.querySelector('.gk-player').classList.add('hidden');
    
    // Reset position select to default
    const positionSelect = document.getElementById('playerPosition');
    if (positionSelect) {
        positionSelect.value = '';
    }
    
    window.scrollTo(0, 0);
    console.log("New player added:", newPlayer);
}

function handleCheckPlayer() {
    const playerName = document.getElementById('updatePlayerName').value.trim();
    const player = playersData.find(p => p.name === playerName);
    
    if (!player) {
        alert("Player not found!");
        return;
    }

    // Show/hide appropriate sections based on position
    const normalUpdate = document.querySelector('.normal-update');
    const gkUpdate = document.querySelector('.gk-update');
    const isGoalkeeper = player.position === 'GK';

    if (isGoalkeeper) {
        // Show GK section and hide normal section
        gkUpdate.classList.remove('hidden');
        normalUpdate.classList.add('hidden');
        
        // Add required to GK fields, remove from normal fields
        gkUpdate.querySelectorAll('input, select').forEach(input => input.setAttribute('required', ''));
        normalUpdate.querySelectorAll('input, select').forEach(input => input.removeAttribute('required'));
        
        // Fill GK fields
        document.getElementById('goalkeeperDiving').value = player.diving || 0;
        document.getElementById('goalkeeperHandling').value = player.handling || 0;
        document.getElementById('goalkeeperKicking').value = player.kicking || 0;
        document.getElementById('goalkeeperReflexes').value = player.reflexes || 0;
        document.getElementById('goalkeeperSpeed').value = player.speed || 0;
        document.getElementById('goalkeeperPositioning').value = player.positioning || 0;
        
        // Fill common fields for GK
        document.getElementById('gkUpdatePlayerPosition').value = player.position;
        document.getElementById('gkUpdateTeamFlag').value = player.logo;
        document.getElementById('gkUpdatePlayerClub').value = player.club;
    } else {
        // Show normal section and hide GK section
        normalUpdate.classList.remove('hidden');
        gkUpdate.classList.add('hidden');
        
        // Add required to normal fields, remove from GK fields
        normalUpdate.querySelectorAll('input, select').forEach(input => input.setAttribute('required', ''));
        gkUpdate.querySelectorAll('input, select').forEach(input => input.removeAttribute('required'));
        
        // Fill normal player fields
        document.getElementById('updatePlayerPace').value = player.pace || 0;
        document.getElementById('updatePlayerShooting').value = player.shooting || 0;
        document.getElementById('updatePlayerPassing').value = player.passing || 0;
        document.getElementById('updatePlayerDribbling').value = player.dribbling || 0;
        document.getElementById('updatePlayerDefending').value = player.defending || 0;
        document.getElementById('updatePlayerPhysical').value = player.physical || 0;
        
        // Fill common fields for normal player
        document.getElementById('normalUpdatePlayerPosition').value = player.position;
        document.getElementById('normalUpdateTeamFlag').value = player.logo;
        document.getElementById('normalUpdatePlayerClub').value = player.club;
    }

    // Show update button and hide check button
    document.getElementById('checkPlayerButton').classList.add('hidden');
    document.getElementById('updatePlayerButton').classList.remove('hidden');
}



function handleUpdatePlayer(e) {
    e.preventDefault();
    
    const playerName = document.getElementById('updatePlayerName').value.trim();
    const playerIndex = playersData.findIndex(p => p.name === playerName);
    
    if (playerIndex === -1) {
        alert("Player not found!");
        return;
    }

    const isGoalkeeper = document.querySelector('.gk-update:not(.hidden)') !== null;
    
    // Get common data
    const updatedPlayer = {
        name: playerName,
        position: isGoalkeeper ? 
            document.getElementById('gkUpdatePlayerPosition').value : 
            document.getElementById('normalUpdatePlayerPosition').value,
        club: isGoalkeeper ? 
            document.getElementById('gkUpdatePlayerClub').value : 
            document.getElementById('normalUpdatePlayerClub').value,
        logo: isGoalkeeper ? 
            document.getElementById('gkUpdateTeamFlag').value : 
            document.getElementById('normalUpdateTeamFlag').value,
        // Preserve other data
        photo: playersData[playerIndex].photo,
        nationality: playersData[playerIndex].nationality,
        flag: playersData[playerIndex].flag,
        rating: playersData[playerIndex].rating
    };

    // Get position-specific stats
    if (isGoalkeeper) {
        Object.assign(updatedPlayer, {
            diving: parseInt(document.getElementById('goalkeeperDiving').value) || 0,
            handling: parseInt(document.getElementById('goalkeeperHandling').value) || 0,
            kicking: parseInt(document.getElementById('goalkeeperKicking').value) || 0,
            reflexes: parseInt(document.getElementById('goalkeeperReflexes').value) || 0,
            speed: parseInt(document.getElementById('goalkeeperSpeed').value) || 0,
            positioning: parseInt(document.getElementById('goalkeeperPositioning').value) || 0
        });
    } else {
        Object.assign(updatedPlayer, {
            pace: parseInt(document.getElementById('updatePlayerPace').value) || 0,
            shooting: parseInt(document.getElementById('updatePlayerShooting').value) || 0,
            passing: parseInt(document.getElementById('updatePlayerPassing').value) || 0,
            dribbling: parseInt(document.getElementById('updatePlayerDribbling').value) || 0,
            defending: parseInt(document.getElementById('updatePlayerDefending').value) || 0,
            physical: parseInt(document.getElementById('updatePlayerPhysical').value) || 0
        });
    }

    // Update player data
    playersData[playerIndex] = updatedPlayer;
    
    try {
        // Save to localStorage
        localStorage.setItem('playersData', JSON.stringify(playersData));
        alert("Player successfully updated!");
        
        // Reset form
        e.target.reset();
        
        // Reset UI
        document.querySelector('.normal-update').classList.add('hidden');
        document.querySelector('.gk-update').classList.add('hidden');
        document.getElementById('checkPlayerButton').classList.remove('hidden');
        document.getElementById('updatePlayerButton').classList.add('hidden');
        
        // Refresh page to show updates
        window.location.reload();
    } catch (error) {
        console.error("Erreur of update :", error);
        alert("Error updating player!");
    }
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
        if (player.position === 'GK') {
            // Create card for goalkeepers
            resultsDiv.innerHTML = `
                <div style="margin-left: 20px; position: absolute; top: 20%">
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
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>DIV</span><span>${player.diving || '-'}</span></div>
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>HAN</span><span>${player.handling || '-'}</span></div>
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>KIC</span><span>${player.kicking || '-'}</span></div>
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>REF</span><span>${player.reflexes || '-'}</span></div>
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>SPD</span><span>${player.speed || '-'}</span></div>
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>POS</span><span>${player.positioning || '-'}</span></div>
                        </div>
                    </div>
                    <div style="margin-top: 16px; text-align: center">
                        <img src="${player.logo}" alt="${player.club}" class="w-6 h-6 object-cover rounded-full m-auto p-0" style="display: inline">
                        <img src="${player.flag}" alt="${player.nationality}" class="w-6 h-6 object-cover rounded-full m-auto p-0" style="display: inline">
                    </div>
                </div>
            `;
        } else {
            // Create card for normal players
            resultsDiv.innerHTML = `
                <div style="margin-left: 20px; position: absolute; top: 20%">
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
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>PAC</span><span>${player.pace || '-'}</span></div>
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>SHO</span><span>${player.shooting || '-'}</span></div>
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>PAS</span><span>${player.passing || '-'}</span></div>
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>DRI</span><span>${player.dribbling || '-'}</span></div>
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>DEF</span><span>${player.defending || '-'}</span></div>
                            <div class="stat-item" style="display: flex; flex-direction: column"><span>PHY</span><span>${player.physical || '-'}</span></div>
                        </div>
                    </div>
                    <div style="margin-top: 16px; text-align: center">
                        <img src="${player.logo}" alt="${player.club}" class="w-6 h-6 object-cover rounded-full m-auto p-0" style="display: inline">
                        <img src="${player.flag}" alt="${player.nationality}" class="w-6 h-6 object-cover rounded-full m-auto p-0" style="display: inline">
                    </div>
                </div>
            `;
        }
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
    const position = form.querySelector('#playerPosition').value;
    const isGK = position === 'GK';
    const activeSection = isGK ? '.gk-player' : '.normal-player';
    
    // Basic info from the active section
    const playerData = {
        name: form.querySelector(`${activeSection} #playerName`).value,
        photo: form.querySelector(`${activeSection} #player-picture`).value,
        position: position,
        nationality: form.querySelector(`${activeSection} #playerNationality`).value,
        flag: form.querySelector(`${activeSection} #playerNationalityFlag`).value,
        club: form.querySelector(`${activeSection} #playerClub`).value,
        logo: form.querySelector(`${activeSection} #teamSelectFlag`).value,
        rating: parseInt(form.querySelector(`${activeSection} #playerRating`).value),
    };

    if (isGK) {
        // GK specific stats
        playerData.diving = parseInt(form.querySelector('#goalkeeperDiving').value) || 0;
        playerData.handling = parseInt(form.querySelector('#goalkeeperHandling').value) || 0;
        playerData.kicking = parseInt(form.querySelector('#goalkeeperKicking').value) || 0;
        playerData.reflexes = parseInt(form.querySelector('#goalkeeperReflexes').value) || 0;
        playerData.speed = parseInt(form.querySelector('#goalkeeperSpeed').value) || 0;
        playerData.positioning = parseInt(form.querySelector('#goalkeeperPositioning').value) || 0;
    } else {
        // Normal player stats
        playerData.pace = parseInt(form.querySelector('#playerPace').value) || 0;
        playerData.shooting = parseInt(form.querySelector('#playerShooting').value) || 0;
        playerData.passing = parseInt(form.querySelector('#playerPassing').value) || 0;
        playerData.dribbling = parseInt(form.querySelector('#playerDribbling').value) || 0;
        playerData.defending = parseInt(form.querySelector('#playerDefending').value) || 0;
        playerData.physical = parseInt(form.querySelector('#playerPhysical').value) || 0;
    }

    return playerData;
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

