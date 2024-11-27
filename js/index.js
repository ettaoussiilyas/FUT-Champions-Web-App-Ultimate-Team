
let playersData = [];
let selectedFormation = '4-3-3';
let teamPlayers = [];
let substitutes = [];


const formations = {
    '4-3-3': [
        { position: 'GK', x: 45, y: 90 }, // Keep GK in the middle
        { position: 'LB', x: 15, y: 70 }, // Shift left
        { position: 'CB', x: 35, y: 70 }, // Shift left
        { position: 'CB', x: 55, y: 70 }, // Shift left
        { position: 'RB', x: 75, y: 70 }, // Shift left
        { position: 'CM', x: 20, y: 45 }, // Shift left
        { position: 'CM', x: 45, y: 45 }, // Keep this in the center
        { position: 'CM', x: 70, y: 45 }, // Shift left
        { position: 'LW', x: 15, y: 25 }, // Shift left
        { position: 'ST', x: 45, y: 20 }, // Keep ST in the center
        { position: 'RW', x: 75, y: 25 }  // Shift left
    ],

    '4-4-2': [
        { position: 'GK', x: 45, y: 90 }, // Keep GK in the middle
        { position: 'LB', x: 15, y: 70 }, // Shift left
        { position: 'CB', x: 35, y: 70 }, // Shift left
        { position: 'CB', x: 55, y: 70 }, // Shift left
        { position: 'RB', x: 75, y: 70 }, // Shift left
        { position: 'LM', x: 15, y: 45 }, // Shift left
        { position: 'CM', x: 35, y: 45 }, // Shift left
        { position: 'CM', x: 55, y: 45 }, // Shift left
        { position: 'RM', x: 75, y: 45 }, // Shift left
        { position: 'ST', x: 20, y: 20 }, // Shift left
        { position: 'ST', x: 70, y: 20 }  // Shift left
    ]
};


function createPlayerCard(player, isSubstitute = false) {
    const card = document.createElement('div');
    card.className = 'player-card p-4';
    card.innerHTML = `
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
    card.addEventListener('click', () => {
        if (isSubstitute) {
            substitutePlayer(player);
        } else {
            addPlayerToFormation(player);
        }
    });
    return card;
}


function createFormationSpot(position, x, y) {
    const spot = document.createElement('div');
    spot.className = 'formation-spot';
    spot.style.left = `${x}%`;
    spot.style.top = `${y}%`;
    spot.setAttribute('data-position', position);
    spot.innerHTML = `
        <div class="mini-card">
            <div class="font-bold">${position}</div>
            <div class="text-xs">Vide</div>
        </div>
    `;
    spot.addEventListener('click', () => removePlayerFromFormation(position));
    return spot;
}

function updateFormation() {
    const field = document.getElementById('soccerField');
    field.innerHTML = ''; // Clear the field

    // Loop through the selected formation and create spots
    formations[selectedFormation].forEach(pos => {
        const spot = createFormationSpot(pos.position, pos.x, pos.y);

        // Find the player in this exact position
        const player = teamPlayers.find(p => p.position === pos.position && p.x === pos.x && p.y === pos.y);

        if (player) {
            // If the player is assigned to this spot, show the detailed card (mini size)
            spot.querySelector('.mini-card').innerHTML = `
                <div class="player-card p-4" style="position: relative;">
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
                                <div class="stat-item" style="display: flex ; flex-direction: column"><span>PAC</span><span>${player.pace || '-'}</span></div>
                                <div class="stat-item" style="display: flex ; flex-direction: column"><span>SHO</span><span>${player.shooting || '-'}</span></div>
                                <div class="stat-item" style="display: flex ; flex-direction: column"><span>PAS</span><span>${player.passing || '-'}</span></div>
                                <div class="stat-item" style="display: flex ; flex-direction: column"><span>DRI</span><span>${player.dribbling || '-'}</span></div>
                                <div class="stat-item" style="display: flex ; flex-direction: column"><span>DEF</span><span>${player.defending || '-'}</span></div>
                                <div class="stat-item" style="display: flex ; flex-direction: column"><span>PHY</span><span>${player.physical || '-'}</span></div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 16px; text-align: center">
                        <img src="${player.logo}" alt="${player.logo}" class="w-6 h-6 object-cover rounded-full m-auto p-0" style="display:inline">
                        <img src="${player.flag}" alt="${player.flag}" class="w-6 h-6 object-cover rounded-full m-auto p-0" style="display:inline">
                    </div>
                </div>
            `;
        } else {
            // If no player is assigned, show "Empty"
            spot.querySelector('.mini-card').innerHTML = `
                <div class="font-bold">${pos.position}</div>
                <div class="text-xs">Vide</div>
            `;
        }

        field.appendChild(spot);  // Append the spot to the field
    });

    //updateChemistryLines();  // Update chemistry lines
    updateChemistryScore();  // Update chemistry score
}


function addPlayerToFormation(player) {
    // Check if the player is already in the formation
    if (teamPlayers.some(p => p.name === player.name)) {
        alert('Ce joueur est déjà dans la formation.');
        return;
    }

    // Get all positions in the current formation
    const formationPositions = formations[selectedFormation];

    // Find the first empty position matching the player's position
    const emptyPosition = formationPositions.find(pos => 
        pos.position === player.position && 
        !teamPlayers.some(p => p.position === pos.position && p.x === pos.x && p.y === pos.y)
    );

    if (emptyPosition) {
        // Add the player to only this specific position
        const newPlayer = {
            ...player,
            position: emptyPosition.position,
            x: emptyPosition.x,
            y: emptyPosition.y
        };

        teamPlayers.push(newPlayer);
        updateFormation();  // Update the formation field to show the new player
        saveToLocalStorage();  // Save the updated formation to local storage
    } else {
        alert(`Impossible d'ajouter le joueur. Aucune position ${player.position} disponible.`);
    }
}



function updateFormation() {
    const field = document.getElementById('soccerField');
    field.innerHTML = ''; // Clear the field before rendering

    // Loop through the selected formation and create spots
    formations[selectedFormation].forEach(pos => {
        const spot = createFormationSpot(pos.position, pos.x, pos.y);

        // Find the player in this exact position
        const player = teamPlayers.find(p => p.position === pos.position && p.x === pos.x && p.y === pos.y);

        if (player) {
            // If the player is assigned to this spot, display the detailed card
            spot.querySelector('.mini-card').innerHTML = `
                <div class="player-card p-4" style="position: relative;">
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
                                <div class="stat-item" style="display: flex; flex-direction: column"><span>PAC</span><span>${player.pace || '-'}</span></div>
                                <div class="stat-item" style="display: flex; flex-direction: column"><span>SHO</span><span>${player.shooting || '-'}</span></div>
                                <div class="stat-item" style="display: flex; flex-direction: column"><span>PAS</span><span>${player.passing || '-'}</span></div>
                                <div class="stat-item" style="display: flex; flex-direction: column"><span>DRI</span><span>${player.dribbling || '-'}</span></div>
                                <div class="stat-item" style="display: flex; flex-direction: column"><span>DEF</span><span>${player.defending || '-'}</span></div>
                                <div class="stat-item" style="display: flex; flex-direction: column"><span>PHY</span><span>${player.physical || '-'}</span></div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 16px; text-align: center">
                        <img src="${player.logo}" alt="${player.logo}" class="w-6 h-6 object-cover rounded-full m-auto p-0" style="display:inline">
                        <img src="${player.flag}" alt="${player.flag}" class="w-6 h-6 object-cover rounded-full m-auto p-0" style="display:inline">
                    </div>
                </div>
            `;
        } else {
            // If no player is assigned, show "Empty"
            spot.querySelector('.mini-card').innerHTML = `
                <div class="font-bold">${pos.position}</div>
                <div class="text-xs">Vide</div>
            `;
        }

        field.appendChild(spot);  // Append the spot to the field
    });

    //updateChemistryLines();  // Update chemistry lines
    updateChemistryScore();  // Update chemistry score
}




function removePlayerFromFormation(position) {
    const index = teamPlayers.findIndex(p => p.position === position);
    if (index !== -1) {
        const removedPlayer = teamPlayers.splice(index, 1)[0];
        substitutes.push(removedPlayer);
        updateFormation();
        updateSubstitutesList();
        saveToLocalStorage();
    }
}

function substitutePlayer(player) {
    const index = substitutes.findIndex(p => p === player);
    if (index !== -1) {
        substitutes.splice(index, 1);
        addPlayerToFormation(player);
        updateSubstitutesList();
    }
}

function updateSubstitutesList() {
    const substitutesList = document.getElementById('substitutesList');
    substitutesList.innerHTML = '';
    substitutes.forEach(player => {
        substitutesList.appendChild(createPlayerCard(player, true));
    });
}



function calculateChemistry() {
    let totalChemistry = 0;
    teamPlayers.forEach(player => {
        let playerChemistry = 10; // Position correcte
        const teammates = teamPlayers.filter(p => p !== player);
        const clubLinks = teammates.filter(p => p.club === player.club).length;
        const nationalityLinks = teammates.filter(p => p.nationality === player.nationality).length;
        
        playerChemistry += clubLinks * 3; // 3 points par lien de club
        playerChemistry += nationalityLinks; // 1 point par lien de nationalité

        totalChemistry += playerChemistry;
    });

    // Normaliser le score sur une échelle de 0 à 100
    return Math.min(Math.round((totalChemistry / (11 * 18)) * 100), 100);
}

function updateChemistryScore() {
    const chemistryScore = calculateChemistry();
    document.getElementById('chemistryScore').textContent = `Score de Chimie: ${chemistryScore}`;
}


function saveToLocalStorage() {
    localStorage.setItem('teamPlayers', JSON.stringify(teamPlayers));
    localStorage.setItem('substitutes', JSON.stringify(substitutes));
    localStorage.setItem('selectedFormation', selectedFormation);
    localStorage.setItem('playersData', JSON.stringify(playersData));
}

function loadFromLocalStorage() {
    const savedTeamPlayers = localStorage.getItem('teamPlayers');
    const savedSubstitutes = localStorage.getItem('substitutes');
    const savedFormation = localStorage.getItem('selectedFormation');
    const savedPlayersData = localStorage.getItem('playersData');

    if (savedTeamPlayers) {
        teamPlayers = JSON.parse(savedTeamPlayers);
    }
    if (savedSubstitutes) {
        substitutes = JSON.parse(savedSubstitutes);
    }
    if (savedFormation) {
        selectedFormation = savedFormation;
        document.getElementById('formationSelect').value = savedFormation;
    }
    if (savedPlayersData) {
        playersData = JSON.parse(savedPlayersData);
    }

    updateFormation();
    updateSubstitutesList();
    updatePlayersList();
}

//new fuction
function updatePlayersList() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    playersData.forEach(player => {
        playersList.appendChild(createPlayerCard(player));
    });
}


document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateFormation();

    document.getElementById('playerForm').addEventListener('submit', (e) => {
        e.preventDefault();
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
        document.getElementById('playersList').appendChild(createPlayerCard(newPlayer));
        saveToLocalStorage(); // Save the updated playersData to local storage
        e.target.reset();
    });

    document.getElementById('formationSelect').addEventListener('change', (e) => {
        //localStorage.clear();//clear after select new formation
        selectedFormation = e.target.value;
        //teamPlayers = [];//clear after select new formation
        //substitutes = [];//clear after select new formation
        updateFormation();
        saveToLocalStorage();
    });
        
            // Initialize drag and drop
    new Sortable(document.getElementById('soccerField'), {
        animation: 150,
        onEnd: function(evt) {
            const fromPosition = evt.item.getAttribute('data-position');
            const toPosition = evt.to.getAttribute('data-position');
            if (fromPosition && toPosition) {
                const playerIndex = teamPlayers.findIndex(p => p.position === fromPosition);
                if (playerIndex !== -1) {
                    teamPlayers[playerIndex].position = toPosition;
                    updateFormation();
                    saveToLocalStorage();
                }
            }
        }
    });
});

fetch('players.json')
    .then(response => response.json())
    .then(data => {
        if (!localStorage.getItem('playersData')) {
            playersData = data.players;
            saveToLocalStorage();
        }
        updatePlayersList();
    });
