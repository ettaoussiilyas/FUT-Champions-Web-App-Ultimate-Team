
let playersData = [];
let selectedFormation = '4-3-3';
let teamPlayers = [];
let substitutes = [];

const formations = {
    '4-3-3': [
        { position: 'GK', x: 50, y: 90 },
        { position: 'LB', x: 20, y: 70 },
        { position: 'CB', x: 35, y: 70 },
        { position: 'CB', x: 65, y: 70 },
        { position: 'RB', x: 80, y: 70 },
        { position: 'CM', x: 35, y: 50 },
        { position: 'CM', x: 50, y: 45 },
        { position: 'CM', x: 65, y: 50 },
        { position: 'LW', x: 20, y: 25 },
        { position: 'ST', x: 50, y: 20 },
        { position: 'RW', x: 80, y: 25 }
    ],
    '4-4-2': [
        { position: 'GK', x: 50, y: 90 },
        { position: 'LB', x: 20, y: 70 },
        { position: 'CB', x: 35, y: 70 },
        { position: 'CB', x: 65, y: 70 },
        { position: 'RB', x: 80, y: 70 },
        { position: 'LM', x: 20, y: 45 },
        { position: 'CM', x: 35, y: 45 },
        { position: 'CM', x: 65, y: 45 },
        { position: 'RM', x: 80, y: 45 },
        { position: 'ST', x: 35, y: 20 },
        { position: 'ST', x: 65, y: 20 }
    ]
};

function createPlayerCard(player, isSubstitute = false) {
    const card = document.createElement('div');
    card.className = 'player-card p-4';
    card.innerHTML = `
        <div class="flex justify-between items-start">
            <div class="text-2xl font-bold">${player.rating}</div>
            <div class="text-sm">${player.position}</div>
            <div class="text-sm">${player.nationality}</div>
        </div>
        <div class="text-center my-2">
            <div class="font-bold">${player.name}</div>
            <div class="text-sm">${player.club}</div>
        </div>
        <div class="player-stats mt-4">
            <div class="stat-item"><span>PAC</span><span>${player.pace || '-'}</span></div>
            <div class="stat-item"><span>SHO</span><span>${player.shooting || '-'}</span></div>
            <div class="stat-item"><span>PAS</span><span>${player.passing || '-'}</span></div>
            <div class="stat-item"><span>DRI</span><span>${player.dribbling || '-'}</span></div>
            <div class="stat-item"><span>DEF</span><span>${player.defending || '-'}</span></div>
            <div class="stat-item"><span>PHY</span><span>${player.physical || '-'}</span></div>
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
    field.innerHTML = '';
    
    formations[selectedFormation].forEach(pos => {
        const spot = createFormationSpot(pos.position, pos.x, pos.y);
        const player = teamPlayers.find(p => p.position === pos.position);
        if (player) {
            spot.querySelector('.mini-card').innerHTML = `
                <div class="font-bold">${player.position}</div>
                <div class="text-xs">${player.name}</div>
                <div class="text-xs">${player.rating}</div>
            `;
        }
        field.appendChild(spot);
    });

    updateChemistryLines();
    updateChemistryScore();
}

function addPlayerToFormation(player) {
    if (teamPlayers.length < 11 && !teamPlayers.some(p => p.position === player.position)) {
        teamPlayers.push(player);
        updateFormation();
        saveToLocalStorage();
    } else {
        alert('Impossible d\'ajouter le joueur. Vérifiez le nombre de joueurs ou la position.');
    }
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

function updateChemistryLines() {
    const field = document.getElementById('soccerField');
    const spots = field.querySelectorAll('.formation-spot');
    spots.forEach(spot => {
        const player = teamPlayers.find(p => p.position === spot.getAttribute('data-position'));
        if (player) {
            spots.forEach(otherSpot => {
                if (spot !== otherSpot) {
                    const otherPlayer = teamPlayers.find(p => p.position === otherSpot.getAttribute('data-position'));
                    if (otherPlayer && (player.club === otherPlayer.club || player.nationality === otherPlayer.nationality)) {
                        drawChemistryLine(spot, otherSpot, player.club === otherPlayer.club ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 255, 0, 0.5)');
                    }
                }
            });
        }
    });
}

function drawChemistryLine(spot1, spot2, color) {
    const rect1 = spot1.getBoundingClientRect();
    const rect2 = spot2.getBoundingClientRect();
    const field = document.getElementById('soccerField');
    const fieldRect = field.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - fieldRect.left;
    const y1 = rect1.top + rect1.height / 2 - fieldRect.top;
    const x2 = rect2.left + rect2.width / 2 - fieldRect.left;
    const y2 = rect2.top + rect2.height / 2 - fieldRect.top;

    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    const line = document.createElement('div');
    line.className = 'chemistry-line';
    line.style.width = `${distance}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.backgroundColor = color;
    line.style.transform = `rotate(${angle}deg)`;

    field.appendChild(line);
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
}

function loadFromLocalStorage() {
    const savedTeamPlayers = localStorage.getItem('teamPlayers');
    const savedSubstitutes = localStorage.getItem('substitutes');
    const savedFormation = localStorage.getItem('selectedFormation');

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

    updateFormation();
    updateSubstitutesList();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateFormation();

    document.getElementById('playerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newPlayer = {
            name: document.getElementById('playerName').value,
            position: document.getElementById('playerPosition').value,
            rating: parseInt(document.getElementById('playerRating').value),
            club: document.getElementById('playerClub').value,
            nationality: document.getElementById('playerNationality').value
        };
        playersData.push(newPlayer);
        document.getElementById('playersList').appendChild(createPlayerCard(newPlayer));
        e.target.reset();
    });

    document.getElementById('formationSelect').addEventListener('change', (e) => {
        selectedFormation = e.target.value;
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

// Load initial player data
fetch('players.json')
    .then(response => response.json())
    .then(data => {
        playersData = data.players;
        const playersList = document.getElementById('playersList');
        playersData.forEach(player => {
            playersList.appendChild(createPlayerCard(player));
        });
    });
