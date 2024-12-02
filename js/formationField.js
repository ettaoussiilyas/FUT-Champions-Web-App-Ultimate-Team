let playersData = [];
let selectedFormation = '4-3-3';
let teamPlayers = [];
let substitutes = [];


const formations = {
    '4-3-3': [
        { position: 'GK', x: 45, y: 90 }, 
        { position: 'LB', x: 15, y: 70 }, 
        { position: 'CB', x: 35, y: 70 }, 
        { position: 'CB', x: 55, y: 70 }, 
        { position: 'RB', x: 75, y: 70 }, 
        { position: 'CM', x: 20, y: 45 }, 
        { position: 'CM', x: 45, y: 45 }, 
        { position: 'CM', x: 70, y: 45 }, 
        { position: 'LW', x: 15, y: 25 }, 
        { position: 'ST', x: 45, y: 20 }, 
        { position: 'RW', x: 75, y: 25 }  
    ],

    '4-4-2': [
        { position: 'GK', x: 45, y: 90 },
        { position: 'LB', x: 15, y: 70 },
        { position: 'CB', x: 35, y: 70 },
        { position: 'CB', x: 55, y: 70 },
        { position: 'RB', x: 75, y: 70 },
        { position: 'LM', x: 15, y: 45 },
        { position: 'CM', x: 35, y: 45 },
        { position: 'CM', x: 55, y: 45 },
        { position: 'RM', x: 75, y: 45 },
        { position: 'ST', x: 20, y: 20 },
        { position: 'ST', x: 70, y: 20 }  
    ]
};



function createPlayerCard(player, isSubstitute = false) {//hna
    const card = document.createElement('div');
    card.className = 'player-card p-4';

    //if the player is a goalkeeper
    if (player.position === 'GK') {
        
        card.innerHTML = `
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
        card.innerHTML = `
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

    //listener for card click
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


function addPlayerToFormation(player) {
    if (teamPlayers.some(p => p.name === player.name)) {
        alert('This player is already in training');
        return;
    }

    if (substitutes.some(p => p.name === player.name)) {
        alert('This player is already in the substitutes');
        return;
    }

    const formationPositions = formations[selectedFormation];


    const emptyPosition = formationPositions.find(pos => 
        pos.position === player.position && 
        !teamPlayers.some(p => p.position === pos.position && p.x === pos.x && p.y === pos.y)
    );

    if (emptyPosition) {
        const newPlayer = {
            ...player,
            position: emptyPosition.position,
            x: emptyPosition.x,
            y: emptyPosition.y
        };

        teamPlayers.push(newPlayer);
        updateFormation();
        saveToLocalStorage();
    } else {
        alert(`We can't add this player because there is no ${player.position} position available.`);
    }
}



function updateFormation() {
    const field = document.getElementById('soccerField');
    field.innerHTML = ''; // Clear the field before rendering

    // loop sur the selected formation and create spots
    formations[selectedFormation].forEach(pos => {
        const spot = createFormationSpot(pos.position, pos.x, pos.y);

        // check the player in this exact position
        const player = teamPlayers.find(p => p.position === pos.position && p.x === pos.x && p.y === pos.y);

        if (player) {
            const statsHTML = player.position === 'GK' ? `
                <div class="player-stats" style="height: 18px;">
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>DIV</span><span>${player.diving || '-'}</span></div>
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>HAN</span><span>${player.handling || '-'}</span></div>
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>KIC</span><span>${player.kicking || '-'}</span></div>
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>REF</span><span>${player.reflexes || '-'}</span></div>
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>SPD</span><span>${player.speed || '-'}</span></div>
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>POS</span><span>${player.positioning || '-'}</span></div>
                </div>
            ` : `
                <div class="player-stats" style="height: 18px;">
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>PAC</span><span>${player.pace || '-'}</span></div>
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>SHO</span><span>${player.shooting || '-'}</span></div>
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>PAS</span><span>${player.passing || '-'}</span></div>
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>DRI</span><span>${player.dribbling || '-'}</span></div>
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>DEF</span><span>${player.defending || '-'}</span></div>
                    <div class="stat-item" style="display: flex; flex-direction: column"><span>PHY</span><span>${player.physical || '-'}</span></div>
                </div>
            `;

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
                            ${statsHTML}
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

    updateChemistryScore();  // Update chemistry score
}




function removePlayerFromFormation(position) {
    const index = teamPlayers.findIndex(p => p.position === position);
    if (index !== -1) {
        const removedPlayer = teamPlayers.splice(index, 1)[0];
        

        if (!substitutes.some(sub => sub.name === removedPlayer.name)) {
            substitutes.push(removedPlayer);
        }
        
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


function saveToLocalStorage() {//done
    localStorage.setItem('teamPlayers', JSON.stringify(teamPlayers));
    localStorage.setItem('substitutes', JSON.stringify(substitutes));
    localStorage.setItem('selectedFormation', selectedFormation);
    localStorage.setItem('playersData', JSON.stringify(playersData));
}

function loadFromLocalStorage() {//done
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
function updatePlayersList() {//donne
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    playersData.forEach(player => {
        playersList.appendChild(createPlayerCard(player));
    });
}

function clearSubstitutes() {
    substitutes = [];
    updateSubstitutesList();
    saveToLocalStorage();
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateFormation();

    document.getElementById('formationSelect').addEventListener('change', (e) => {
        selectedFormation = e.target.value;
        
        const tempPlayers = [...teamPlayers];
        teamPlayers = [];
        
        tempPlayers.forEach(player => {
            const formationSpot = formations[selectedFormation].find(pos => 
                pos.position === player.position && 
                !teamPlayers.some(p => p.position === pos.position && p.x === pos.x && p.y === pos.y)
            );
            
            if (formationSpot) {
                teamPlayers.push({
                    ...player,
                    x: formationSpot.x,
                    y: formationSpot.y
                });
            } else {
                substitutes.push(player);
            }
        });
        
        updateFormation();
        updateSubstitutesList();
        saveToLocalStorage();
    });
    
});


fetch('./../players.json')//done
    .then(response => response.json())
    .then(data => {
        try {
            if (!localStorage.getItem('playersData')) {
                playersData = data.players;
                saveToLocalStorage();
            }
            updatePlayersList();
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching players:', error);
    });




    // document.getElementsByClassName(".player-card").forEach(elment=>elment.addEventListener('click' , ()=>{
    //     console.log(`le nome est : ${elment.name}`);
    // }))
