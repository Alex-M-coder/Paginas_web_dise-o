/**
 * GAMEVAULT - WEB MULTIPLATFORM VIDEO GAME MANAGER
 * Persistent browser-based game library tracker.
 */

// --- Default Mock Data ---
const DEFAULT_GAMES = [
    {
        id: "mock-1",
        title: "The Witcher 3: Wild Hunt",
        platform: "pc",
        status: "playing",
        price: 29.99,
        hours: 124.5,
        cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop", // Retro PC placeholder
        rating: 5,
        notes: "Excelente historia, combates muy divertidos. Actualmente jugando la expansión Blood and Wine.",
        dateAdded: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        achievements: [
            { id: "a1", name: "Completar la historia principal", completed: true },
            { id: "a2", name: "Derrotar a un grifo en marcha de la muerte", completed: true },
            { id: "a3", name: "Coleccionar todas las cartas de Gwent", completed: false },
            { id: "a4", name: "Completar contratos de brujo", completed: true }
        ]
    },
    {
        id: "mock-2",
        title: "The Legend of Zelda: Breath of the Wild",
        platform: "nintendo",
        status: "completed",
        price: 59.99,
        hours: 95.0,
        cover: "", // Will auto-generate abstract cover gradient
        rating: 5,
        notes: "Una obra maestra de la exploración. Conseguí las cuatro Bestias Divinas y derroté a Ganon.",
        dateAdded: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        achievements: [
            { id: "a5", name: "Recuperar las 4 bestias divinas", completed: true },
            { id: "a6", name: "Obtener la Espada Maestra", completed: true },
            { id: "a7", name: "Superar los 120 santuarios", completed: true },
            { id: "a8", name: "Encontrar todas las semillas Kolog (900)", completed: false }
        ]
    },
    {
        id: "mock-3",
        title: "Halo Infinite",
        platform: "xbox",
        status: "backlog",
        price: 59.99,
        hours: 0,
        cover: "",
        rating: 3,
        notes: "Tengo ganas de probar la campaña de mundo abierto y jugar cooperativo.",
        dateAdded: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        achievements: [
            { id: "a9", name: "Completar campaña en Heroico", completed: false },
            { id: "a10", name: "Encontrar todas las calaveras", completed: false }
        ]
    },
    {
        id: "mock-4",
        title: "Marvel's Spider-Man 2",
        platform: "playstation",
        status: "wishlist",
        price: 79.99,
        hours: 0,
        cover: "",
        rating: 0,
        notes: "Esperando a que baje de precio o esté en oferta de Black Friday.",
        dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        achievements: []
    }
];

// --- State Management ---
let games = [];
let currentFilterPlatform = 'all';
let currentFilterStatus = 'all';
let currentSort = 'added-desc';
let viewMode = 'grid'; // 'grid' or 'list'
let tempAchievements = []; // Temporary achievements list for the modal

// --- DOM Elements ---
const gamesGrid = document.getElementById('games-grid');
const emptyCatalog = document.getElementById('empty-catalog');
const gamesCount = document.getElementById('games-count');

// Stats elements
const statTotal = document.getElementById('stat-total');
const statCompleted = document.getElementById('stat-completed');
const statPercent = document.getElementById('stat-percent');
const statPlaying = document.getElementById('stat-playing');
const statFinance = document.getElementById('stat-finance');
const statHours = document.getElementById('stat-hours');
const platformChart = document.getElementById('platform-chart');
const statusChart = document.getElementById('status-chart');
const dashboardGrid = document.getElementById('dashboard-content');
const btnToggleStats = document.getElementById('btn-toggle-stats');
const toggleStatsText = document.getElementById('toggle-stats-text');
const toggleStatsIcon = document.getElementById('toggle-stats-icon');

// Search and Filter controls
const searchInput = document.getElementById('search-input');
const filterPlatform = document.getElementById('filter-platform');
const filterStatus = document.getElementById('filter-status');
const sortBy = document.getElementById('sort-by');
const viewGridBtn = document.getElementById('view-grid');
const viewListBtn = document.getElementById('view-list');

// Backup Buttons
const btnBackupTrigger = document.getElementById('btn-backup-trigger');
const backupDropdown = document.querySelector('.backup-dropdown');
const btnExport = document.getElementById('btn-export');
const importFile = document.getElementById('import-file');

// Modals
const modalGame = document.getElementById('modal-game');
const modalRandom = document.getElementById('modal-random');
const btnAddGame = document.getElementById('btn-add-game');
const btnRandom = document.getElementById('btn-random');
const btnEmptyAdd = document.getElementById('btn-empty-add');
const gameForm = document.getElementById('game-form');

// Form Inputs
const gameIdInput = document.getElementById('game-id');
const gameNameInput = document.getElementById('game-name');
const gamePlatformSelect = document.getElementById('game-platform');
const gameStatusSelect = document.getElementById('game-status');
const gamePriceInput = document.getElementById('game-price');
const gameHoursInput = document.getElementById('game-hours');
const gameCoverInput = document.getElementById('game-cover');
const btnGenerateGradient = document.getElementById('btn-generate-gradient');
const ratingStarsInput = document.getElementById('rating-stars-input');
const gameRatingInput = document.getElementById('game-rating');
const newAchievementText = document.getElementById('new-achievement-text');
const btnAddAchievement = document.getElementById('btn-add-achievement');
const modalAchievementsList = document.getElementById('modal-achievements-list');
const gameNotesTextarea = document.getElementById('game-notes');
const btnDeleteGame = document.getElementById('btn-delete-game');
const modalTitle = document.getElementById('modal-title');

// Random Picker Elements
const rouletteBox = document.getElementById('roulette-box');
const rouletteText = document.getElementById('roulette-text');
const btnSpin = document.getElementById('btn-spin');
const randomResult = document.getElementById('random-result');
const winnerCardPlaceholder = document.getElementById('winner-card-placeholder');
const btnCloseRandom = document.getElementById('btn-close-random');

// --- Helper Functions ---

// Generate a pseudo-random hash code from a string
function stringToHashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Generate beautiful CSS gradient based on game title hash code
function generateGradientFromTitle(title) {
    const hash = stringToHashCode(title || "game");
    const h1 = hash % 360;
    const h2 = (h1 + 60 + (hash % 120)) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 75%, 35%) 0%, hsl(${h2}, 85%, 15%) 100%)`;
}

// Save games database to localStorage
function saveGames() {
    localStorage.setItem('gamevault_games', JSON.stringify(games));
}

// Load games database from localStorage
function loadGames() {
    const stored = localStorage.getItem('gamevault_games');
    if (stored) {
        try {
            games = JSON.parse(stored);
        } catch (e) {
            console.error("Error al cargar la base de datos de juegos:", e);
            games = DEFAULT_GAMES;
        }
    } else {
        // First execution, set mock data
        games = DEFAULT_GAMES;
        saveGames();
    }
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value || 0);
}

// Get icon markup for different platforms
function getPlatformIcon(platform) {
    switch (platform) {
        case 'pc':
            return `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="12" rx="2"/><path d="M9 21h6M12 15v6"/></svg>`;
        case 'playstation':
            return `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`;
        case 'xbox':
            return `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="6" width="20" height="12" rx="3"/><circle cx="12" cy="12" r="3"/></svg>`;
        case 'nintendo':
            return `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="5" y="3" width="14" height="18" rx="4"/><line x1="12" y1="3" x2="12" y2="21"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/></svg>`;
        case 'mobile':
            return `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`;
        default:
            return '';
    }
}

// Get readable name for platforms
function getPlatformName(platform) {
    switch (platform) {
        case 'pc': return 'PC';
        case 'playstation': return 'PlayStation';
        case 'xbox': return 'Xbox';
        case 'nintendo': return 'Nintendo Switch';
        case 'mobile': return 'Móvil';
        default: return platform;
    }
}

// Get readable name for statuses
function getStatusName(status) {
    switch (status) {
        case 'playing': return 'Jugando';
        case 'backlog': return 'Backlog';
        case 'completed': return 'Completado';
        case 'abandoned': return 'Abandonado';
        case 'wishlist': return 'Deseos';
        default: return status;
    }
}

// Stars indicator string HTML
function getStarsHTML(rating) {
    let stars = '';
    const numRating = parseInt(rating) || 0;
    for (let i = 1; i <= 5; i++) {
        if (i <= numRating) {
            stars += '&#9733;'; // Filled star
        } else {
            stars += '&#9734;'; // Empty star
        }
    }
    return stars;
}

// --- Render Functions ---

// Recalculate statistics panel
function renderStats() {
    const total = games.length;
    // Exclude wishlist games from completion calculations to make statistics meaningful
    const activeGames = games.filter(g => g.status !== 'wishlist');
    const completed = games.filter(g => g.status === 'completed').length;
    const playing = games.filter(g => g.status === 'playing').length;
    
    // Sum hours and price
    const totalHours = games.reduce((acc, game) => acc + (parseFloat(game.hours) || 0), 0);
    const totalPrice = games.reduce((acc, game) => acc + (parseFloat(game.price) || 0), 0);

    const completionRate = activeGames.length > 0 ? Math.round((completed / activeGames.length) * 100) : 0;

    // Set texts
    statTotal.textContent = total;
    statCompleted.textContent = completed;
    statPercent.textContent = `${completionRate}%`;
    statPlaying.textContent = playing;
    statFinance.textContent = formatCurrency(totalPrice);
    statHours.textContent = `${totalHours.toLocaleString('es-ES')} horas`;

    // Render platform bars chart
    if (total === 0) {
        platformChart.innerHTML = '<div class="chart-empty">Sin videojuegos en la lista.</div>';
        statusChart.innerHTML = '<div class="chart-empty">Sin videojuegos en la lista.</div>';
        return;
    }

    const platformCounts = { pc: 0, playstation: 0, xbox: 0, nintendo: 0, mobile: 0 };
    const statusCounts = { playing: 0, backlog: 0, completed: 0, abandoned: 0, wishlist: 0 };

    games.forEach(game => {
        if (platformCounts.hasOwnProperty(game.platform)) platformCounts[game.platform]++;
        if (statusCounts.hasOwnProperty(game.status)) statusCounts[game.status]++;
    });

    // Render Platform Chart Items
    platformChart.innerHTML = Object.entries(platformCounts)
        .map(([platform, count]) => {
            const pct = total > 0 ? (count / total) * 100 : 0;
            return `
                <div class="chart-bar-item">
                    <div class="chart-bar-label">
                        <span>${getPlatformName(platform)}</span>
                        <span>${count} (${Math.round(pct)}%)</span>
                    </div>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill plat-${platform}-theme" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');

    // Render Status Chart Items
    statusChart.innerHTML = Object.entries(statusCounts)
        .map(([status, count]) => {
            const pct = total > 0 ? (count / total) * 100 : 0;
            return `
                <div class="chart-bar-item">
                    <div class="chart-bar-label">
                        <span>${getStatusName(status)}</span>
                        <span>${count} (${Math.round(pct)}%)</span>
                    </div>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill status-${status}-theme" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');
}

// Render game cards catalog grid
function renderCatalog() {
    const textQuery = searchInput.value.toLowerCase().trim();
    
    // Filter
    let filteredGames = games.filter(game => {
        const matchesPlatform = currentFilterPlatform === 'all' || game.platform === currentFilterPlatform;
        const matchesStatus = currentFilterStatus === 'all' || game.status === currentFilterStatus;
        
        let matchesText = true;
        if (textQuery) {
            const titleMatches = game.title.toLowerCase().includes(textQuery);
            const notesMatches = game.notes ? game.notes.toLowerCase().includes(textQuery) : false;
            matchesText = titleMatches || notesMatches;
        }
        
        return matchesPlatform && matchesStatus && matchesText;
    });

    // Sort
    filteredGames.sort((a, b) => {
        if (currentSort === 'name-asc') {
            return a.title.localeCompare(b.title);
        } else if (currentSort === 'name-desc') {
            return b.title.localeCompare(a.title);
        } else if (currentSort === 'rating-desc') {
            return (b.rating || 0) - (a.rating || 0);
        } else if (currentSort === 'hours-desc') {
            return (b.hours || 0) - (a.hours || 0);
        } else if (currentSort === 'price-desc') {
            return (b.price || 0) - (a.price || 0);
        } else { // default or 'added-desc'
            return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
        }
    });

    // Update game count text
    gamesCount.textContent = `(${filteredGames.length})`;

    // Toggle Empty Catalog
    if (filteredGames.length === 0) {
        gamesGrid.innerHTML = '';
        emptyCatalog.classList.remove('hidden');
    } else {
        emptyCatalog.classList.add('hidden');
        
        // Map elements
        gamesGrid.innerHTML = filteredGames.map(game => {
            // Cover logic
            let coverHTML = '';
            if (game.cover && game.cover.trim() !== '') {
                coverHTML = `<img src="${escapeHTML(game.cover)}" alt="${escapeHTML(game.title)}" loading="lazy">`;
            } else {
                coverHTML = `
                    <div class="cover-fallback" style="background: ${generateGradientFromTitle(game.title)}">
                        <span>${escapeHTML(game.title)}</span>
                    </div>
                `;
            }

            // Achievement bar calculation
            let achievementProgressHTML = '';
            if (game.achievements && game.achievements.length > 0) {
                const totalAch = game.achievements.length;
                const compAch = game.achievements.filter(a => a.completed).length;
                const achPct = Math.round((compAch / totalAch) * 100);
                achievementProgressHTML = `
                    <div class="game-card-achievements">
                        <div class="achievements-label">
                            <span>Logros: ${compAch}/${totalAch}</span>
                            <span>${achPct}%</span>
                        </div>
                        <div class="achievements-bar">
                            <div class="achievements-fill" style="width: ${achPct}%"></div>
                        </div>
                    </div>
                `;
            }

            // Grid card specific or list card specific detail rendering
            if (viewMode === 'list') {
                return `
                    <div class="game-card glass-panel list-layout" data-id="${game.id}">
                        <div class="game-card-cover">
                            ${coverHTML}
                        </div>
                        <div class="game-card-content">
                            <div class="game-card-header">
                                <span class="game-card-platform plat-${game.platform}-theme">${getPlatformName(game.platform)}</span>
                                <h3 class="game-card-title" title="${escapeHTML(game.title)}">${escapeHTML(game.title)}</h3>
                            </div>
                            
                            <div class="game-card-rating">
                                ${getStarsHTML(game.rating)}
                            </div>

                            ${achievementProgressHTML || '<div class="game-card-achievements"><div class="achievements-label" style="color: var(--text-muted);">Sin logros creados</div></div>'}

                            <div class="game-card-details">
                                <div class="detail-item">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <span>${game.hours || 0} hrs</span>
                                </div>
                                <div class="detail-item">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                    <span>${formatCurrency(game.price)}</span>
                                </div>
                            </div>

                            <span class="game-card-badge status-${game.status}-theme">${getStatusName(game.status)}</span>
                        </div>
                    </div>
                `;
            } else {
                // GRID VIEW
                return `
                    <div class="game-card glass-panel" data-id="${game.id}">
                        <div class="game-card-cover">
                            ${coverHTML}
                            <span class="game-card-badge status-${game.status}-theme">${getStatusName(game.status)}</span>
                        </div>
                        <div class="game-card-content">
                            <div class="game-card-header">
                                <span class="game-card-platform plat-${game.platform}-theme">${getPlatformName(game.platform)}</span>
                                <h3 class="game-card-title" title="${escapeHTML(game.title)}">${escapeHTML(game.title)}</h3>
                            </div>
                            
                            <div class="game-card-rating">
                                ${getStarsHTML(game.rating)}
                            </div>

                            ${achievementProgressHTML}

                            <div class="game-card-details">
                                <div class="detail-item">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <span>${game.hours || 0} horas</span>
                                </div>
                                <div class="detail-item">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                    <span>${formatCurrency(game.price)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }).join('');

        // Attach click listeners to cards to edit
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.getAttribute('data-id');
                openEditGameModal(gameId);
            });
        });
    }
}

// Simple HTML escaping helper to prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// --- Modal Handlers ---

// Open Modal
function openModal(modal) {
    modal.style.display = 'flex';
    // Trigger paint reflow for CSS animations to kick in
    modal.offsetHeight; 
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    // Wait for the transition to finish before hiding display
    setTimeout(() => {
        if (!modal.classList.contains('show')) {
            modal.style.display = 'none';
        }
    }, 200);
}

// Set visual stars input highlight
function setRatingStars(ratingValue) {
    gameRatingInput.value = ratingValue;
    const stars = ratingStarsInput.querySelectorAll('.star-interactive');
    stars.forEach(star => {
        const val = parseInt(star.getAttribute('data-value'));
        if (val <= ratingValue) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Render temporary achievements in the editor modal list
function renderModalAchievements() {
    modalAchievementsList.innerHTML = tempAchievements.map((ach, idx) => `
        <li class="achievement-item">
            <div class="achievement-left">
                <input type="checkbox" id="modal-ach-${idx}" ${ach.completed ? 'checked' : ''}>
                <span class="${ach.completed ? 'checked' : ''}" id="modal-ach-text-${idx}">${escapeHTML(ach.name)}</span>
            </div>
            <button type="button" class="btn-delete-achievement" data-index="${idx}" title="Eliminar">&times;</button>
        </li>
    `).join('');

    // Bind checkbox triggers
    tempAchievements.forEach((ach, idx) => {
        const chk = document.getElementById(`modal-ach-${idx}`);
        if (chk) {
            chk.addEventListener('change', (e) => {
                tempAchievements[idx].completed = e.target.checked;
                const txt = document.getElementById(`modal-ach-text-${idx}`);
                if (txt) {
                    if (e.target.checked) txt.classList.add('checked');
                    else txt.classList.remove('checked');
                }
            });
        }
    });

    // Bind delete triggers
    modalAchievementsList.querySelectorAll('.btn-delete-achievement').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            tempAchievements.splice(index, 1);
            renderModalAchievements();
        });
    });
}

// Open modal for Adding Game
function openAddGameModal() {
    // Reset form
    gameForm.reset();
    gameIdInput.value = '';
    setRatingStars(0);
    tempAchievements = [];
    renderModalAchievements();
    
    // UI adjustments
    modalTitle.textContent = "Añadir Nuevo Juego";
    btnDeleteGame.classList.add('hidden');
    
    openModal(modalGame);
}

// Open modal for Editing Game
function openEditGameModal(id) {
    const game = games.find(g => g.id === id);
    if (!game) return;

    // Populate form
    gameIdInput.value = game.id;
    gameNameInput.value = game.title;
    gamePlatformSelect.value = game.platform;
    gameStatusSelect.value = game.status;
    gamePriceInput.value = game.price !== undefined ? game.price : '';
    gameHoursInput.value = game.hours !== undefined ? game.hours : '';
    gameCoverInput.value = game.cover || '';
    gameNotesTextarea.value = game.notes || '';
    
    setRatingStars(game.rating || 0);

    // Deep copy achievements
    tempAchievements = game.achievements ? game.achievements.map(a => ({...a})) : [];
    renderModalAchievements();

    // UI adjustments
    modalTitle.textContent = "Editar Videojuego";
    btnDeleteGame.classList.remove('hidden');
    
    openModal(modalGame);
}

// --- Random Picker Roulette Logic ---

function setupRandomRoulette() {
    // Filter available games (Backlog or Playing)
    const eligibleGames = games.filter(g => g.status === 'backlog' || g.status === 'playing');
    
    // UI Resets
    rouletteText.textContent = "Presiona Girar";
    randomResult.classList.add('hidden');
    winnerCardPlaceholder.innerHTML = '';
    btnSpin.classList.remove('hidden');
    btnCloseRandom.classList.add('hidden');

    openModal(modalRandom);
}

function spinRoulette() {
    const eligibleGames = games.filter(g => g.status === 'backlog' || g.status === 'playing');
    
    if (eligibleGames.length === 0) {
        rouletteText.textContent = "Sin juegos";
        alert("¡No tienes juegos en tu Backlog o Jugando! Añade algunos o cámbiales el estado para poder jugar.");
        return;
    }

    btnSpin.disabled = true;
    btnSpin.querySelector('.spin-icon').classList.add('active');
    rouletteBox.classList.add('spinning');
    
    let duration = 2000; // spin duration in ms
    let intervalTime = 70; // speed of names change
    let elapsed = 0;
    let lastWinnerIdx = 0;

    const timer = setInterval(() => {
        // Change text to random title
        const randIdx = Math.floor(Math.random() * eligibleGames.length);
        rouletteText.textContent = eligibleGames[randIdx].title;
        lastWinnerIdx = randIdx;
        elapsed += intervalTime;

        // Slow down toward the end
        if (elapsed > duration - 600 && intervalTime < 250) {
            clearInterval(timer);
            // Launch slower final steps
            runSlowSteps(eligibleGames, lastWinnerIdx);
        }
    }, intervalTime);
}

function runSlowSteps(eligibleGames, currentIdx) {
    let stepsLeft = 5;
    let currentInterval = 120;

    function step() {
        const idx = Math.floor(Math.random() * eligibleGames.length);
        rouletteText.textContent = eligibleGames[idx].title;
        stepsLeft--;

        if (stepsLeft > 0) {
            currentInterval += 80;
            setTimeout(step, currentInterval);
        } else {
            // Final winner picked!
            const winner = eligibleGames[idx];
            showWinner(winner);
        }
    }
    setTimeout(step, currentInterval);
}

function showWinner(winner) {
    rouletteBox.classList.remove('spinning');
    btnSpin.disabled = false;
    btnSpin.querySelector('.spin-icon').classList.remove('active');
    
    rouletteText.textContent = winner.title;

    // Render winner card details
    let coverHTML = '';
    if (winner.cover && winner.cover.trim() !== '') {
        coverHTML = `<img src="${escapeHTML(winner.cover)}" alt="${escapeHTML(winner.title)}">`;
    } else {
        coverHTML = `<div class="cover-fallback" style="background: ${generateGradientFromTitle(winner.title)}; display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-weight: 700; text-align: center; font-size: 11px;"><span>${escapeHTML(winner.title)}</span></div>`;
    }

    winnerCardPlaceholder.innerHTML = `
        <div class="winner-card-cover">
            ${coverHTML}
        </div>
        <div class="winner-card-info">
            <h4 class="winner-title">${escapeHTML(winner.title)}</h4>
            <div class="winner-meta">
                <span class="game-card-platform plat-${winner.platform}-theme">${getPlatformName(winner.platform)}</span>
                <span class="game-card-badge status-${winner.status}-theme">${getStatusName(winner.status)}</span>
            </div>
            ${winner.hours ? `<p style="font-size: 11px; margin-top: 4px; color: var(--text-secondary);"><circle cx="12" cy="12" r="10"/> Llevas ${winner.hours} horas jugadas.</p>` : ''}
        </div>
    `;

    randomResult.classList.remove('hidden');
    btnSpin.classList.add('hidden');
    btnCloseRandom.classList.remove('hidden');
}

// --- Event Listeners Setup ---

function initEventListeners() {
    // Open modales
    btnAddGame.addEventListener('click', openAddGameModal);
    btnRandom.addEventListener('click', setupRandomRoulette);
    btnEmptyAdd.addEventListener('click', openAddGameModal);

    // Close modales triggers
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            // Find parent modal
            const m = closeBtn.closest('.modal');
            if (m) closeModal(m);
        });
    });

    // Close modal clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Interactive Star Hover/Click
    const starItems = ratingStarsInput.querySelectorAll('.star-interactive');
    starItems.forEach(star => {
        star.addEventListener('click', () => {
            const val = parseInt(star.getAttribute('data-value'));
            setRatingStars(val);
        });
    });

    // Add dynamic achievement in modal
    btnAddAchievement.addEventListener('click', () => {
        const text = newAchievementText.value.trim();
        if (text) {
            tempAchievements.push({
                id: 'ach-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
                name: text,
                completed: false
            });
            newAchievementText.value = '';
            renderModalAchievements();
        }
    });

    // Add achievement on pressing Enter key
    newAchievementText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            btnAddAchievement.click();
        }
    });

    // Auto-generate gradient cover button
    btnGenerateGradient.addEventListener('click', () => {
        const name = gameNameInput.value.trim();
        if (!name) {
            alert("Por favor, introduce el título del videojuego primero para generar una portada única.");
            return;
        }
        gameCoverInput.value = ''; // We clear URL to fallback on styling
        alert("¡Portada generada con éxito basada en el título! Verás el resultado al guardar.");
    });

    // Delete Game trigger
    btnDeleteGame.addEventListener('click', () => {
        const id = gameIdInput.value;
        if (!id) return;
        
        if (confirm("¿Estás seguro de que deseas eliminar este videojuego de tu colección? Esta acción no se puede deshacer.")) {
            games = games.filter(g => g.id !== id);
            saveGames();
            renderStats();
            renderCatalog();
            closeModal(modalGame);
        }
    });

    // Form Submit (Save / Edit)
    gameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = gameIdInput.value;
        const title = gameNameInput.value.trim();
        const platform = gamePlatformSelect.value;
        const status = gameStatusSelect.value;
        const price = parseFloat(gamePriceInput.value) || 0;
        const hours = parseFloat(gameHoursInput.value) || 0;
        const cover = gameCoverInput.value.trim();
        const rating = parseInt(gameRatingInput.value) || 0;
        const notes = gameNotesTextarea.value.trim();

        if (id) {
            // Edit existing game
            const gameIdx = games.findIndex(g => g.id === id);
            if (gameIdx !== -1) {
                games[gameIdx] = {
                    ...games[gameIdx],
                    title,
                    platform,
                    status,
                    price,
                    hours,
                    cover,
                    rating,
                    notes,
                    achievements: tempAchievements // Contains checkboxes checked in modal
                };
            }
        } else {
            // Add new game
            const newGame = {
                id: 'game-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
                title,
                platform,
                status,
                price,
                hours,
                cover,
                rating,
                notes,
                achievements: tempAchievements,
                dateAdded: new Date().toISOString()
            };
            games.push(newGame);
        }

        saveGames();
        renderStats();
        renderCatalog();
        closeModal(modalGame);
    });

    // Backup Menu Trigger
    btnBackupTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        backupDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        backupDropdown.classList.remove('show');
    });

    // Export JSON
    btnExport.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(games, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `gamevault_backup_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // Import JSON
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const importedData = JSON.parse(event.target.result);
                if (Array.isArray(importedData)) {
                    if (confirm(`¿Deseas importar ${importedData.length} videojuegos? Esto sobrescribirá tu biblioteca actual.`)) {
                        games = importedData;
                        saveGames();
                        renderStats();
                        renderCatalog();
                        alert("¡Biblioteca importada con éxito!");
                    }
                } else {
                    alert("El archivo de copia de seguridad no tiene un formato válido.");
                }
            } catch (err) {
                alert("Error al leer el archivo JSON: " + err.message);
            }
        };
        reader.readAsText(file);
        // Clear value to allow selecting same file again
        importFile.value = '';
    });

    // Search and Filters
    searchInput.addEventListener('input', renderCatalog);
    
    filterPlatform.addEventListener('change', (e) => {
        currentFilterPlatform = e.target.value;
        renderCatalog();
    });

    filterStatus.addEventListener('change', (e) => {
        currentFilterStatus = e.target.value;
        renderCatalog();
    });

    sortBy.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderCatalog();
    });

    // Toggle View modes
    viewGridBtn.addEventListener('click', () => {
        viewMode = 'grid';
        viewGridBtn.classList.add('active');
        viewListBtn.classList.remove('active');
        gamesGrid.classList.remove('list-view');
        renderCatalog();
    });

    viewListBtn.addEventListener('click', () => {
        viewMode = 'list';
        viewListBtn.classList.add('active');
        viewGridBtn.classList.remove('active');
        gamesGrid.classList.add('list-view');
        renderCatalog();
    });

    // Statistics toggle collapse
    btnToggleStats.addEventListener('click', () => {
        const isCollapsed = dashboardGrid.classList.toggle('collapsed');
        if (isCollapsed) {
            toggleStatsText.textContent = "Mostrar Estadísticas";
            toggleStatsIcon.style.transform = "rotate(180deg)";
            localStorage.setItem('gamevault_stats_collapsed', 'true');
        } else {
            toggleStatsText.textContent = "Ocultar Estadísticas";
            toggleStatsIcon.style.transform = "rotate(0deg)";
            localStorage.setItem('gamevault_stats_collapsed', 'false');
            // Trigger redraw/animation for bars fill
            setTimeout(renderStats, 50);
        }
    });

    // Spin roulette trigger
    btnSpin.addEventListener('click', spinRoulette);
}

// --- Initialization ---

window.addEventListener('DOMContentLoaded', () => {
    // 1. Load Data
    loadGames();

    // 2. Set event listeners
    initEventListeners();

    // 3. Set statistics panel display state from preferences
    const statsPref = localStorage.getItem('gamevault_stats_collapsed');
    if (statsPref === 'true') {
        dashboardGrid.classList.add('collapsed');
        toggleStatsText.textContent = "Mostrar Estadísticas";
        toggleStatsIcon.style.transform = "rotate(180deg)";
    }

    // 4. Initial Render
    renderStats();
    renderCatalog();
});
