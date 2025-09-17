/**
 * Screen Manager
 * Handles screen transitions and UI state management
 */

class ScreenManager {
    constructor(game) {
        this.game = game;
        this.currentScreen = null;
        this.screenHistory = [];
        this.transitionDuration = 300;
    }

    /**
     * Show a specific screen with optional transition
     */
    showScreen(screenName, options = {}) {
        const {
            transition = 'fade',
            saveHistory = true,
            data = null
        } = options;

        // Add current screen to history
        if (saveHistory && this.currentScreen) {
            this.screenHistory.push(this.currentScreen);
        }

        // Hide current screen
        if (this.currentScreen) {
            this.hideScreen(this.currentScreen, transition);
        }

        // Show new screen
        setTimeout(() => {
            this.displayScreen(screenName, transition, data);
            this.currentScreen = screenName;

            // Update navigation
            this.updateNavigation(screenName);

            // Announce screen change for screen readers
            this.announceScreenChange(screenName);

        }, transition === 'none' ? 0 : this.transitionDuration / 2);
    }

    /**
     * Hide a screen with transition
     */
    hideScreen(screenName, transition = 'fade') {
        const screen = document.getElementById(`${screenName}-screen`);
        if (!screen) return;

        screen.classList.add('screen-exit');
        screen.setAttribute('aria-hidden', 'true');

        // Remove screen after transition
        setTimeout(() => {
            screen.classList.remove('active', 'screen-exit');
        }, this.transitionDuration / 2);
    }

    /**
     * Display a screen with transition
     */
    displayScreen(screenName, transition = 'fade', data = null) {
        const screen = document.getElementById(`${screenName}-screen`);
        if (!screen) {
            console.error(`Screen not found: ${screenName}`);
            return;
        }

        // Set up screen for display
        screen.classList.add('active', 'screen-enter');
        screen.setAttribute('aria-hidden', 'false');

        // Initialize screen content
        this.initializeScreen(screenName, data);

        // Complete transition
        setTimeout(() => {
            screen.classList.remove('screen-enter');
        }, this.transitionDuration / 2);

        // Focus management for accessibility
        this.manageFocus(screen);
    }

    /**
     * Go back to previous screen
     */
    goBack() {
        if (this.screenHistory.length > 0) {
            const previousScreen = this.screenHistory.pop();
            this.showScreen(previousScreen, { saveHistory: false });
        }
    }

    /**
     * Initialize screen-specific content
     */
    initializeScreen(screenName, data) {
        switch (screenName) {
            case 'welcome':
                this.initializeWelcomeScreen();
                break;
            case 'chambers':
                this.initializeChambersScreen();
                break;
            case 'puzzle':
                this.initializePuzzleScreen(data);
                break;
            case 'progress':
                this.initializeProgressScreen();
                break;
            case 'achievements':
                this.initializeAchievementsScreen();
                break;
            case 'settings':
                this.initializeSettingsScreen();
                break;
            default:
                console.warn(`No initializer for screen: ${screenName}`);
        }
    }

    /**
     * Initialize welcome screen
     */
    initializeWelcomeScreen() {
        const stats = this.game.getStats();

        // Update welcome stats
        this.updateElement('total-solved', stats.user.totalSolved);
        this.updateElement('current-streak', stats.user.currentStreak);
        this.updateElement('chambers-unlocked', stats.user.chambersUnlocked);

        // Set up daily challenge status
        this.updateDailyChallengeStatus();

        // Update continue button text based on progress
        const continueBtn = document.getElementById('continue-journey');
        if (continueBtn) {
            const hasProgress = stats.user.totalSolved > 0;
            continueBtn.textContent = hasProgress ? 'Continue Journey' : 'Begin Journey';
        }
    }

    /**
     * Initialize chambers screen
     */
    initializeChambersScreen() {
        this.game.updateChambersScreen();

        // Add filter and search functionality
        this.setupChamberFilters();

        // Set up sorting options
        this.setupChamberSorting();
    }

    /**
     * Initialize puzzle screen
     */
    initializePuzzleScreen(data) {
        if (data && data.chamber && data.puzzle !== undefined) {
            this.game.startPuzzle(data.chamber, data.puzzle);
        } else if (this.game.gameState.currentPuzzle) {
            this.game.updatePuzzleScreen();
        } else {
            console.error('No puzzle data provided for puzzle screen');
            this.showScreen('chambers');
        }
    }

    /**
     * Initialize progress screen
     */
    initializeProgressScreen() {
        this.updateProgressStats();
        this.createProgressCharts();
        this.updateRecentActivity();
    }

    /**
     * Initialize achievements screen
     */
    initializeAchievementsScreen() {
        this.updateAchievements();
        this.createAchievementCategories();
    }

    /**
     * Initialize settings screen
     */
    initializeSettingsScreen() {
        this.game.applySettings();
        this.setupSettingsHandlers();
    }

    /**
     * Update navigation active state
     */
    updateNavigation(activeScreen) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${activeScreen}`) {
                link.classList.add('active');
            }
        });

        // Update page title
        const titles = {
            welcome: 'Welcome - MindForge',
            chambers: 'Chambers - MindForge',
            puzzle: 'Puzzle - MindForge',
            progress: 'Progress - MindForge',
            achievements: 'Achievements - MindForge',
            settings: 'Settings - MindForge'
        };

        if (titles[activeScreen]) {
            document.title = titles[activeScreen];
        }
    }

    /**
     * Announce screen change for accessibility
     */
    announceScreenChange(screenName) {
        const announcer = document.getElementById('screen-announcer') || this.createScreenAnnouncer();

        const announcements = {
            welcome: 'Welcome screen loaded',
            chambers: 'Chambers selection screen loaded',
            puzzle: 'Puzzle screen loaded',
            progress: 'Progress tracking screen loaded',
            achievements: 'Achievements screen loaded',
            settings: 'Settings screen loaded'
        };

        announcer.textContent = announcements[screenName] || `${screenName} screen loaded`;
    }

    /**
     * Create screen announcer for accessibility
     */
    createScreenAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'screen-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
        return announcer;
    }

    /**
     * Manage focus for accessibility
     */
    manageFocus(screen) {
        // Find the first focusable element in the screen
        const focusableElements = screen.querySelectorAll(
            'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
            // Focus the first element after a brief delay
            setTimeout(() => {
                focusableElements[0].focus();
            }, this.transitionDuration);
        }
    }

    /**
     * Update element content safely
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Update daily challenge status
     */
    updateDailyChallengeStatus() {
        const dailyBtn = document.getElementById('daily-challenge');
        if (!dailyBtn) return;

        // Check if daily challenge is completed
        const today = new Date().toDateString();
        const lastDaily = localStorage.getItem('mindforge_last_daily');

        if (lastDaily === today) {
            dailyBtn.textContent = 'Daily Complete ✓';
            dailyBtn.classList.add('completed');
        } else {
            dailyBtn.textContent = 'Daily Challenge';
            dailyBtn.classList.remove('completed');
        }
    }

    /**
     * Setup chamber filters
     */
    setupChamberFilters() {
        // Add filter controls if they don't exist
        const chambersScreen = document.getElementById('chambers-screen');
        if (!chambersScreen || document.querySelector('.chamber-filters')) return;

        const filtersHTML = `
            <div class="chamber-filters">
                <div class="filter-group">
                    <label for="difficulty-filter">Filter by difficulty:</label>
                    <select id="difficulty-filter">
                        <option value="all">All Difficulties</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="status-filter">Filter by status:</label>
                    <select id="status-filter">
                        <option value="all">All Chambers</option>
                        <option value="unlocked">Unlocked</option>
                        <option value="locked">Locked</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div class="filter-group">
                    <input type="search" id="chamber-search" placeholder="Search chambers...">
                </div>
            </div>
        `;

        const description = chambersScreen.querySelector('.screen-description');
        if (description) {
            description.insertAdjacentHTML('afterend', filtersHTML);
            this.setupFilterHandlers();
        }
    }

    /**
     * Setup filter event handlers
     */
    setupFilterHandlers() {
        const difficultyFilter = document.getElementById('difficulty-filter');
        const statusFilter = document.getElementById('status-filter');
        const searchInput = document.getElementById('chamber-search');

        const applyFilters = () => {
            const difficulty = difficultyFilter.value;
            const status = statusFilter.value;
            const search = searchInput.value.toLowerCase();

            document.querySelectorAll('.chamber-card').forEach(card => {
                const chamberData = this.game.gameState.chambers.get(card.dataset.chamber);
                let show = true;

                // Difficulty filter
                if (difficulty !== 'all' && chamberData.difficulty !== difficulty) {
                    show = false;
                }

                // Status filter
                if (status !== 'all') {
                    const isLocked = chamberData.unlockLevel > this.game.gameState.user.level;
                    const isCompleted = chamberData.progress.completed === chamberData.progress.total;

                    if (status === 'unlocked' && isLocked) show = false;
                    if (status === 'locked' && !isLocked) show = false;
                    if (status === 'completed' && !isCompleted) show = false;
                }

                // Search filter
                if (search && !chamberData.title.toLowerCase().includes(search) &&
                    !chamberData.description.toLowerCase().includes(search)) {
                    show = false;
                }

                card.style.display = show ? 'block' : 'none';
            });
        };

        if (difficultyFilter) difficultyFilter.addEventListener('change', applyFilters);
        if (statusFilter) statusFilter.addEventListener('change', applyFilters);
        if (searchInput) searchInput.addEventListener('input', applyFilters);
    }

    /**
     * Setup chamber sorting
     */
    setupChamberSorting() {
        // This would add sorting functionality
        // Implementation depends on UI design decisions
    }

    /**
     * Update progress statistics
     */
    updateProgressStats() {
        const stats = this.game.getStats();

        // Create progress overview if it doesn't exist
        const progressOverview = document.querySelector('.progress-overview');
        if (!progressOverview) return;

        const totalPuzzles = Array.from(stats.chambers).reduce((total, [_, chamber]) =>
            total + chamber.progress.total, 0);
        const solvedPuzzles = Array.from(stats.chambers).reduce((total, [_, chamber]) =>
            total + chamber.progress.completed, 0);

        progressOverview.innerHTML = `
            <div class="progress-cards">
                <div class="progress-card">
                    <h3>Overall Progress</h3>
                    <div class="progress-stat">
                        <span class="stat-number">${Math.round((solvedPuzzles / totalPuzzles) * 100)}%</span>
                        <span class="stat-label">Complete</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(solvedPuzzles / totalPuzzles) * 100}%"></div>
                    </div>
                    <p>${solvedPuzzles} of ${totalPuzzles} puzzles solved</p>
                </div>

                <div class="progress-card">
                    <h3>Current Level</h3>
                    <div class="progress-stat">
                        <span class="stat-number">${stats.user.level}</span>
                        <span class="stat-label">Level</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(stats.user.xp / stats.user.xpToNext) * 100}%"></div>
                    </div>
                    <p>${stats.user.xp} / ${stats.user.xpToNext} XP</p>
                </div>

                <div class="progress-card">
                    <h3>Current Streak</h3>
                    <div class="progress-stat">
                        <span class="stat-number">${stats.user.currentStreak}</span>
                        <span class="stat-label">Puzzles</span>
                    </div>
                    <p>Keep it up!</p>
                </div>

                <div class="progress-card">
                    <h3>Chambers Unlocked</h3>
                    <div class="progress-stat">
                        <span class="stat-number">${stats.user.chambersUnlocked}</span>
                        <span class="stat-label">of 12</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(stats.user.chambersUnlocked / 12) * 100}%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create progress charts
     */
    createProgressCharts() {
        // This would create visual charts for progress tracking
        // Could use libraries like Chart.js for implementation
        console.log('Progress charts would be implemented here');
    }

    /**
     * Update recent activity
     */
    updateRecentActivity() {
        // This would show recent puzzle completions and achievements
        console.log('Recent activity tracking would be implemented here');
    }

    /**
     * Update achievements display
     */
    updateAchievements() {
        const achievementsContainer = document.querySelector('.achievements-container');
        if (!achievementsContainer) return;

        // This would display earned and available achievements
        console.log('Achievements system would be implemented here');
    }

    /**
     * Create achievement categories
     */
    createAchievementCategories() {
        // This would organize achievements by category
        console.log('Achievement categories would be implemented here');
    }

    /**
     * Setup settings event handlers
     */
    setupSettingsHandlers() {
        // Export/Import save data
        const exportBtn = document.getElementById('export-save');
        const importBtn = document.getElementById('import-save');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSaveData());
        }

        if (importBtn) {
            importBtn.addEventListener('click', () => this.importSaveData());
        }

        // Reset progress
        const resetBtn = document.getElementById('reset-progress');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.confirmResetProgress());
        }
    }

    /**
     * Export save data
     */
    exportSaveData() {
        const saveData = this.game.getStats();
        const dataStr = JSON.stringify(saveData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `mindforge-save-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.game.showTemporaryMessage('Save data exported successfully!', 'success');
    }

    /**
     * Import save data
     */
    importSaveData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    // Validate and restore save data
                    this.game.loadSaveData(saveData);
                    this.game.showTemporaryMessage('Save data imported successfully!', 'success');
                } catch (error) {
                    this.game.showTemporaryMessage('Invalid save file!', 'warning');
                }
            };
            reader.readAsText(file);
        });

        input.click();
    }

    /**
     * Confirm progress reset
     */
    confirmResetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem('mindforge_save');
            this.game.showTemporaryMessage('Progress reset. Please refresh the page.', 'info');
        }
    }

    /**
     * Get current screen
     */
    getCurrentScreen() {
        return this.currentScreen;
    }

    /**
     * Check if screen exists
     */
    screenExists(screenName) {
        return document.getElementById(`${screenName}-screen`) !== null;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ScreenManager = ScreenManager;
}