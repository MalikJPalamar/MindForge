/**
 * MindForge Game Core
 * Main game engine and state management
 */

class MindForge {
    constructor() {
        this.gameState = {
            currentScreen: 'welcome',
            currentChamber: null,
            currentPuzzle: null,
            user: {
                level: 1,
                xp: 0,
                xpToNext: 100,
                totalSolved: 0,
                currentStreak: 0,
                chambersUnlocked: 1,
                achievements: []
            },
            settings: {
                soundEffects: true,
                autoHints: false,
                highContrast: false,
                reducedMotion: false,
                fontSize: 'medium'
            },
            chambers: new Map(),
            analytics: {
                sessionStart: Date.now(),
                puzzleAttempts: 0,
                hintsUsed: 0,
                timeSpent: 0
            }
        };

        this.eventListeners = new Map();
        this.loadingComplete = false;

        this.init();
    }

    /**
     * Initialize the game
     */
    async init() {
        try {
            // Show loading screen
            this.showLoadingScreen();

            // Load saved data
            await this.loadGameData();

            // Initialize chambers
            await this.initializeChambers();

            // Set up event listeners
            this.setupEventListeners();

            // Apply settings
            this.applySettings();

            // Hide loading screen and show welcome
            this.hideLoadingScreen();
            this.showScreen('welcome');

            // Update UI
            this.updateUI();

            this.loadingComplete = true;
            this.logEvent('game_initialized');

        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError('Failed to load game. Please refresh the page.');
        }
    }

    /**
     * Load game data from localStorage
     */
    async loadGameData() {
        try {
            const savedData = localStorage.getItem('mindforge_save');
            if (savedData) {
                const data = JSON.parse(savedData);

                // Merge saved data with defaults
                this.gameState.user = { ...this.gameState.user, ...data.user };
                this.gameState.settings = { ...this.gameState.settings, ...data.settings };

                if (data.chambers) {
                    this.gameState.chambers = new Map(data.chambers);
                }

                console.log('Game data loaded successfully');
            }
        } catch (error) {
            console.warn('Failed to load saved data:', error);
        }
    }

    /**
     * Save game data to localStorage
     */
    saveGameData() {
        try {
            const saveData = {
                user: this.gameState.user,
                settings: this.gameState.settings,
                chambers: Array.from(this.gameState.chambers.entries()),
                lastSaved: Date.now()
            };

            localStorage.setItem('mindforge_save', JSON.stringify(saveData));
            this.logEvent('game_saved');
        } catch (error) {
            console.error('Failed to save game data:', error);
        }
    }

    /**
     * Initialize chamber data
     */
    async initializeChambers() {
        const chamberDefinitions = [
            {
                id: 'pattern-recognition',
                title: 'Pattern Recognition',
                subtitle: 'Identify sequences and relationships',
                description: 'Develop your ability to recognize patterns in visual, numerical, and logical sequences.',
                icon: '🎯',
                difficulty: 'beginner',
                unlockLevel: 1,
                puzzleCount: 25
            },
            {
                id: 'logical-sequences',
                title: 'Logical Sequences',
                subtitle: 'Complete the logical progression',
                description: 'Master the art of logical reasoning through sequential problem solving.',
                icon: '🔗',
                difficulty: 'beginner',
                unlockLevel: 1,
                puzzleCount: 25
            },
            {
                id: 'spatial-reasoning',
                title: 'Spatial Reasoning',
                subtitle: 'Visualize and manipulate objects',
                description: 'Enhance your spatial intelligence through 3D visualization challenges.',
                icon: '🎲',
                difficulty: 'intermediate',
                unlockLevel: 3,
                puzzleCount: 25
            },
            {
                id: 'deductive-reasoning',
                title: 'Deductive Reasoning',
                subtitle: 'Draw logical conclusions',
                description: 'Strengthen deductive logic through systematic problem-solving approaches.',
                icon: '🔍',
                difficulty: 'intermediate',
                unlockLevel: 5,
                puzzleCount: 25
            },
            {
                id: 'inductive-reasoning',
                title: 'Inductive Reasoning',
                subtitle: 'Find general patterns',
                description: 'Develop pattern recognition and generalization skills.',
                icon: '🧠',
                difficulty: 'intermediate',
                unlockLevel: 7,
                puzzleCount: 25
            },
            {
                id: 'analytical-thinking',
                title: 'Analytical Thinking',
                subtitle: 'Break down complex problems',
                description: 'Master systematic analysis of complex logical structures.',
                icon: '⚙️',
                difficulty: 'advanced',
                unlockLevel: 10,
                puzzleCount: 25
            },
            {
                id: 'mathematical-logic',
                title: 'Mathematical Logic',
                subtitle: 'Apply mathematical reasoning',
                description: 'Combine mathematical concepts with logical reasoning.',
                icon: '📊',
                difficulty: 'advanced',
                unlockLevel: 12,
                puzzleCount: 25
            },
            {
                id: 'verbal-reasoning',
                title: 'Verbal Reasoning',
                subtitle: 'Analyze language and meaning',
                description: 'Develop logical reasoning through language and semantic analysis.',
                icon: '📝',
                difficulty: 'intermediate',
                unlockLevel: 8,
                puzzleCount: 25
            },
            {
                id: 'conditional-logic',
                title: 'Conditional Logic',
                subtitle: 'Master if-then reasoning',
                description: 'Learn complex conditional reasoning and logical implications.',
                icon: '⚡',
                difficulty: 'advanced',
                unlockLevel: 15,
                puzzleCount: 25
            },
            {
                id: 'set-theory',
                title: 'Set Theory Logic',
                subtitle: 'Understand logical relationships',
                description: 'Explore logical relationships through set theory applications.',
                icon: '🔢',
                difficulty: 'expert',
                unlockLevel: 18,
                puzzleCount: 25
            },
            {
                id: 'logical-paradoxes',
                title: 'Logical Paradoxes',
                subtitle: 'Navigate complex contradictions',
                description: 'Challenge your reasoning with famous logical paradoxes and their resolutions.',
                icon: '🌀',
                difficulty: 'expert',
                unlockLevel: 20,
                puzzleCount: 25
            },
            {
                id: 'meta-reasoning',
                title: 'Meta-Reasoning',
                subtitle: 'Reason about reasoning itself',
                description: 'The ultimate challenge: applying logical reasoning to the process of reasoning.',
                icon: '🔮',
                difficulty: 'expert',
                unlockLevel: 25,
                puzzleCount: 30
            }
        ];

        // Initialize chamber progress data
        for (const chamberDef of chamberDefinitions) {
            if (!this.gameState.chambers.has(chamberDef.id)) {
                this.gameState.chambers.set(chamberDef.id, {
                    ...chamberDef,
                    progress: {
                        completed: 0,
                        total: chamberDef.puzzleCount,
                        bestTimes: [],
                        hintsUsed: 0,
                        accuracy: 0,
                        unlockedPuzzles: chamberDef.unlockLevel <= this.gameState.user.level ? 1 : 0
                    },
                    puzzles: []
                });
            }
        }

        // Load puzzle data for unlocked chambers
        await this.loadChamberPuzzles();
    }

    /**
     * Load puzzle data for chambers
     */
    async loadChamberPuzzles() {
        // Load puzzles for the first few chambers that are implemented
        const implementedChambers = ['pattern-recognition', 'logical-sequences', 'spatial-reasoning'];

        for (const chamberId of implementedChambers) {
            const chamber = this.gameState.chambers.get(chamberId);
            if (chamber && chamber.puzzles.length === 0) {
                chamber.puzzles = await this.generatePuzzlesForChamber(chamberId);
            }
        }
    }

    /**
     * Generate puzzles for a specific chamber
     */
    async generatePuzzlesForChamber(chamberId) {
        const puzzleGenerator = window.PuzzleGenerators?.[chamberId];
        if (puzzleGenerator) {
            return puzzleGenerator.generatePuzzles();
        }

        // Return placeholder puzzles if generator not available
        return this.generatePlaceholderPuzzles(chamberId);
    }

    /**
     * Generate placeholder puzzles
     */
    generatePlaceholderPuzzles(chamberId) {
        const chamber = this.gameState.chambers.get(chamberId);
        const puzzles = [];

        for (let i = 1; i <= chamber.puzzleCount; i++) {
            puzzles.push({
                id: `${chamberId}_${i}`,
                title: `${chamber.title} Challenge ${i}`,
                difficulty: i <= 8 ? 'easy' : i <= 16 ? 'medium' : 'hard',
                question: `This is placeholder puzzle ${i} for ${chamber.title}.`,
                type: 'multiple-choice',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 0,
                explanation: `This is the explanation for puzzle ${i}.`,
                hints: [
                    `First hint for puzzle ${i}`,
                    `Second hint for puzzle ${i}`,
                    `Final hint for puzzle ${i}`
                ],
                timeLimit: 300, // 5 minutes
                points: i <= 8 ? 10 : i <= 16 ? 15 : 25
            });
        }

        return puzzles;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Navigation
        this.addEventListener('continue-journey', 'click', () => this.showScreen('chambers'));
        this.addEventListener('daily-challenge', 'click', () => this.startDailyChallenge());
        this.addEventListener('back-to-chambers', 'click', () => this.showScreen('chambers'));

        // Navigation menu
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const screen = link.getAttribute('href').substring(1);
                this.showScreen(screen);
            });
        });

        // Mobile navigation toggle
        this.addEventListener('nav-toggle', 'click', this.toggleMobileNav.bind(this));

        // Settings
        this.addEventListener('high-contrast', 'change', (e) => {
            this.gameState.settings.highContrast = e.target.checked;
            this.applySettings();
            this.saveGameData();
        });

        this.addEventListener('reduced-motion', 'change', (e) => {
            this.gameState.settings.reducedMotion = e.target.checked;
            this.applySettings();
            this.saveGameData();
        });

        this.addEventListener('sound-effects', 'change', (e) => {
            this.gameState.settings.soundEffects = e.target.checked;
            this.saveGameData();
        });

        this.addEventListener('auto-hints', 'change', (e) => {
            this.gameState.settings.autoHints = e.target.checked;
            this.saveGameData();
        });

        this.addEventListener('font-size', 'change', (e) => {
            this.gameState.settings.fontSize = e.target.value;
            this.applySettings();
            this.saveGameData();
        });

        // Auto-save every 30 seconds
        setInterval(() => this.saveGameData(), 30000);

        // Save on page unload
        window.addEventListener('beforeunload', () => this.saveGameData());
    }

    /**
     * Add event listener with cleanup tracking
     */
    addEventListener(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);

            if (!this.eventListeners.has(elementId)) {
                this.eventListeners.set(elementId, []);
            }
            this.eventListeners.get(elementId).push({ event, handler });
        }
    }

    /**
     * Apply user settings to the interface
     */
    applySettings() {
        const body = document.body;

        // High contrast
        body.classList.toggle('high-contrast', this.gameState.settings.highContrast);

        // Reduced motion
        body.classList.toggle('reduced-motion', this.gameState.settings.reducedMotion);

        // Font size
        body.classList.remove('font-small', 'font-medium', 'font-large');
        body.classList.add(`font-${this.gameState.settings.fontSize}`);

        // Update form controls to match settings
        const highContrastToggle = document.getElementById('high-contrast');
        const reducedMotionToggle = document.getElementById('reduced-motion');
        const soundToggle = document.getElementById('sound-effects');
        const autoHintsToggle = document.getElementById('auto-hints');
        const fontSizeSelect = document.getElementById('font-size');

        if (highContrastToggle) highContrastToggle.checked = this.gameState.settings.highContrast;
        if (reducedMotionToggle) reducedMotionToggle.checked = this.gameState.settings.reducedMotion;
        if (soundToggle) soundToggle.checked = this.gameState.settings.soundEffects;
        if (autoHintsToggle) autoHintsToggle.checked = this.gameState.settings.autoHints;
        if (fontSizeSelect) fontSizeSelect.value = this.gameState.settings.fontSize;
    }

    /**
     * Toggle mobile navigation
     */
    toggleMobileNav() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', (!isExpanded).toString());
        }
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            loadingScreen.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                loadingScreen.setAttribute('aria-hidden', 'true');
            }, 1000); // Allow time for loading animation
        }
    }

    /**
     * Show specific screen
     */
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.setAttribute('aria-hidden', 'true');
        });

        // Show target screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.setAttribute('aria-hidden', 'false');

            this.gameState.currentScreen = screenName;

            // Update navigation
            this.updateNavigation(screenName);

            // Screen-specific initialization
            this.initializeScreen(screenName);
        }
    }

    /**
     * Update navigation active state
     */
    updateNavigation(activeScreen) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeScreen}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Initialize screen-specific content
     */
    initializeScreen(screenName) {
        switch (screenName) {
            case 'welcome':
                this.updateWelcomeScreen();
                break;
            case 'chambers':
                this.updateChambersScreen();
                break;
            case 'progress':
                this.updateProgressScreen();
                break;
            case 'settings':
                this.updateSettingsScreen();
                break;
        }
    }

    /**
     * Update welcome screen content
     */
    updateWelcomeScreen() {
        const totalSolvedEl = document.getElementById('total-solved');
        const currentStreakEl = document.getElementById('current-streak');
        const chambersUnlockedEl = document.getElementById('chambers-unlocked');

        if (totalSolvedEl) totalSolvedEl.textContent = this.gameState.user.totalSolved;
        if (currentStreakEl) currentStreakEl.textContent = this.gameState.user.currentStreak;
        if (chambersUnlockedEl) chambersUnlockedEl.textContent = this.gameState.user.chambersUnlocked;
    }

    /**
     * Update chambers screen content
     */
    updateChambersScreen() {
        const chambersGrid = document.querySelector('.chambers-grid');
        if (!chambersGrid) return;

        chambersGrid.innerHTML = '';

        // Create chamber cards
        this.gameState.chambers.forEach((chamber, chamberId) => {
            const isUnlocked = chamber.unlockLevel <= this.gameState.user.level;
            const progressPercent = chamber.progress.total > 0
                ? (chamber.progress.completed / chamber.progress.total) * 100
                : 0;

            const chamberCard = document.createElement('div');
            chamberCard.className = `chamber-card ${!isUnlocked ? 'locked' : ''}`;
            chamberCard.setAttribute('data-chamber', chamberId);
            chamberCard.setAttribute('tabindex', isUnlocked ? '0' : '-1');
            chamberCard.setAttribute('role', 'button');
            chamberCard.setAttribute('aria-label', `${chamber.title} - ${chamber.description}`);

            chamberCard.innerHTML = `
                <div class="chamber-difficulty ${chamber.difficulty}">${chamber.difficulty}</div>
                <div class="chamber-header">
                    <div class="chamber-icon">${chamber.icon}</div>
                    <div class="chamber-info">
                        <h3 class="chamber-title">${chamber.title}</h3>
                        <p class="chamber-subtitle">${chamber.subtitle}</p>
                    </div>
                </div>
                <p class="chamber-description">${chamber.description}</p>

                ${isUnlocked ? `
                    <div class="chamber-progress">
                        <div class="progress-header">
                            <span class="progress-label">Progress</span>
                            <span class="progress-stats">${chamber.progress.completed}/${chamber.progress.total}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                    </div>

                    <div class="chamber-stats">
                        <div class="stat-item">
                            <span class="stat-value">${chamber.progress.completed}</span>
                            <span class="stat-label">Solved</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${chamber.progress.accuracy}%</span>
                            <span class="stat-label">Accuracy</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${chamber.progress.hintsUsed}</span>
                            <span class="stat-label">Hints</span>
                        </div>
                    </div>

                    <div class="chamber-actions">
                        <button class="btn btn-primary btn-block" onclick="game.enterChamber('${chamberId}')">
                            ${chamber.progress.completed === 0 ? 'Start' : 'Continue'}
                        </button>
                    </div>
                ` : `
                    <div class="chamber-stats">
                        <div class="stat-item">
                            <span class="stat-value">Level ${chamber.unlockLevel}</span>
                            <span class="stat-label">Required</span>
                        </div>
                    </div>
                `}
            `;

            if (isUnlocked) {
                chamberCard.addEventListener('click', () => this.enterChamber(chamberId));
                chamberCard.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.enterChamber(chamberId);
                    }
                });
            }

            chambersGrid.appendChild(chamberCard);
        });
    }

    /**
     * Update progress screen
     */
    updateProgressScreen() {
        // This will be implemented when we add the progress visualization
        console.log('Progress screen update - to be implemented');
    }

    /**
     * Update settings screen
     */
    updateSettingsScreen() {
        this.applySettings();
    }

    /**
     * Update UI elements
     */
    updateUI() {
        // Update level display
        const levelEl = document.getElementById('user-level');
        if (levelEl) levelEl.textContent = this.gameState.user.level;

        // Update XP bar
        const xpProgressEl = document.getElementById('xp-progress');
        const xpTextEl = document.getElementById('xp-text');

        if (xpProgressEl) {
            const xpPercent = (this.gameState.user.xp / this.gameState.user.xpToNext) * 100;
            xpProgressEl.style.width = `${xpPercent}%`;
        }

        if (xpTextEl) {
            xpTextEl.textContent = `${this.gameState.user.xp} / ${this.gameState.user.xpToNext} XP`;
        }
    }

    /**
     * Enter a specific chamber
     */
    enterChamber(chamberId) {
        const chamber = this.gameState.chambers.get(chamberId);
        if (!chamber || chamber.unlockLevel > this.gameState.user.level) {
            this.showError('This chamber is not yet unlocked.');
            return;
        }

        this.gameState.currentChamber = chamberId;

        // Find next unsolved puzzle or first puzzle
        const nextPuzzleIndex = chamber.progress.completed;
        if (nextPuzzleIndex < chamber.puzzles.length) {
            this.startPuzzle(chamberId, nextPuzzleIndex);
        } else {
            this.showError('All puzzles in this chamber are completed!');
        }
    }

    /**
     * Start a specific puzzle
     */
    startPuzzle(chamberId, puzzleIndex) {
        const chamber = this.gameState.chambers.get(chamberId);
        const puzzle = chamber.puzzles[puzzleIndex];

        if (!puzzle) {
            this.showError('Puzzle not found.');
            return;
        }

        this.gameState.currentPuzzle = {
            chamberId,
            puzzleIndex,
            puzzle,
            startTime: Date.now(),
            hintsUsed: 0,
            attempts: 0
        };

        // Initialize puzzle screen
        this.showScreen('puzzle');
        this.updatePuzzleScreen();

        this.logEvent('puzzle_started', {
            chamber: chamberId,
            puzzle: puzzleIndex,
            difficulty: puzzle.difficulty
        });
    }

    /**
     * Update puzzle screen with current puzzle
     */
    updatePuzzleScreen() {
        const currentPuzzle = this.gameState.currentPuzzle;
        if (!currentPuzzle) return;

        const { puzzle, puzzleIndex } = currentPuzzle;
        const chamber = this.gameState.chambers.get(currentPuzzle.chamberId);

        // Update puzzle header
        const titleEl = document.getElementById('puzzle-title');
        const difficultyEl = document.getElementById('puzzle-difficulty');
        const numberEl = document.getElementById('puzzle-number');

        if (titleEl) titleEl.textContent = puzzle.title;
        if (difficultyEl) {
            difficultyEl.textContent = puzzle.difficulty;
            difficultyEl.className = `difficulty-badge ${puzzle.difficulty}`;
        }
        if (numberEl) numberEl.textContent = `${puzzleIndex + 1} of ${chamber.puzzles.length}`;

        // Initialize puzzle content
        this.initializePuzzleContent(puzzle);

        // Set up puzzle event listeners
        this.setupPuzzleEventListeners();
    }

    /**
     * Initialize puzzle content based on type
     */
    initializePuzzleContent(puzzle) {
        const puzzleContainer = document.getElementById('puzzle-container');
        const answerInput = document.getElementById('answer-input');

        if (!puzzleContainer || !answerInput) return;

        // Clear previous content
        puzzleContainer.innerHTML = '';
        answerInput.innerHTML = '';

        // Add puzzle question
        const questionEl = document.createElement('div');
        questionEl.className = 'puzzle-question';
        questionEl.textContent = puzzle.question;
        puzzleContainer.appendChild(questionEl);

        // Add puzzle-specific content based on type
        if (puzzle.type === 'multiple-choice') {
            this.createMultipleChoiceInput(puzzle, answerInput);
        } else if (puzzle.type === 'text-input') {
            this.createTextInput(puzzle, answerInput);
        } else if (puzzle.type === 'grid') {
            this.createGridPuzzle(puzzle, puzzleContainer);
        }
    }

    /**
     * Create multiple choice input
     */
    createMultipleChoiceInput(puzzle, container) {
        const choicesDiv = document.createElement('div');
        choicesDiv.className = 'multiple-choice';

        puzzle.options.forEach((option, index) => {
            const choiceEl = document.createElement('label');
            choiceEl.className = 'choice-option';

            choiceEl.innerHTML = `
                <input type="radio" name="puzzle-answer" value="${index}">
                <span>${option}</span>
            `;

            choicesDiv.appendChild(choiceEl);
        });

        container.appendChild(choicesDiv);
    }

    /**
     * Create text input
     */
    createTextInput(puzzle, container) {
        const label = document.createElement('label');
        label.textContent = 'Your answer:';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'text-answer';
        input.placeholder = 'Enter your answer...';

        container.appendChild(label);
        container.appendChild(input);
    }

    /**
     * Setup puzzle event listeners
     */
    setupPuzzleEventListeners() {
        // Check answer button
        const checkBtn = document.getElementById('check-answer');
        if (checkBtn) {
            checkBtn.onclick = () => this.checkAnswer();

            // Enable/disable based on answer input
            const updateCheckButton = () => {
                const hasAnswer = this.getCurrentAnswer() !== null;
                checkBtn.disabled = !hasAnswer;
            };

            // Listen for answer changes
            document.querySelectorAll('input[name="puzzle-answer"]').forEach(input => {
                input.addEventListener('change', updateCheckButton);
            });

            const textInput = document.getElementById('text-answer');
            if (textInput) {
                textInput.addEventListener('input', updateCheckButton);
            }
        }

        // Hint button
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            hintBtn.onclick = () => this.showHint();
        }

        // Reset button
        const resetBtn = document.getElementById('reset-puzzle');
        if (resetBtn) {
            resetBtn.onclick = () => this.resetPuzzle();
        }
    }

    /**
     * Get current answer from inputs
     */
    getCurrentAnswer() {
        const radioAnswer = document.querySelector('input[name="puzzle-answer"]:checked');
        if (radioAnswer) {
            return parseInt(radioAnswer.value);
        }

        const textAnswer = document.getElementById('text-answer');
        if (textAnswer && textAnswer.value.trim()) {
            return textAnswer.value.trim();
        }

        return null;
    }

    /**
     * Check the current answer
     */
    checkAnswer() {
        const currentPuzzle = this.gameState.currentPuzzle;
        if (!currentPuzzle) return;

        const userAnswer = this.getCurrentAnswer();
        if (userAnswer === null) return;

        currentPuzzle.attempts++;
        this.gameState.analytics.puzzleAttempts++;

        const isCorrect = this.validateAnswer(userAnswer, currentPuzzle.puzzle.correctAnswer);

        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    /**
     * Validate answer
     */
    validateAnswer(userAnswer, correctAnswer) {
        if (typeof correctAnswer === 'number') {
            return userAnswer === correctAnswer;
        }

        if (typeof correctAnswer === 'string') {
            return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        }

        return false;
    }

    /**
     * Handle correct answer
     */
    handleCorrectAnswer() {
        const currentPuzzle = this.gameState.currentPuzzle;
        const chamber = this.gameState.chambers.get(currentPuzzle.chamberId);

        // Calculate score
        const timeBonus = this.calculateTimeBonus(currentPuzzle.startTime);
        const hintPenalty = currentPuzzle.hintsUsed * 2;
        const attemptPenalty = (currentPuzzle.attempts - 1) * 1;
        const basePoints = currentPuzzle.puzzle.points || 10;

        const finalScore = Math.max(1, basePoints + timeBonus - hintPenalty - attemptPenalty);

        // Update progress
        chamber.progress.completed++;
        this.gameState.user.totalSolved++;
        this.gameState.user.currentStreak++;
        this.addXP(finalScore);

        // Update analytics
        const timeSpent = Date.now() - currentPuzzle.startTime;
        this.gameState.analytics.timeSpent += timeSpent;

        // Show success feedback
        this.showFeedback({
            type: 'success',
            title: 'Excellent!',
            message: `You solved this puzzle in ${currentPuzzle.attempts} attempt(s) and earned ${finalScore} XP!`,
            explanation: currentPuzzle.puzzle.explanation,
            score: finalScore,
            timeSpent: this.formatTime(timeSpent)
        });

        this.logEvent('puzzle_completed', {
            chamber: currentPuzzle.chamberId,
            puzzle: currentPuzzle.puzzleIndex,
            attempts: currentPuzzle.attempts,
            hintsUsed: currentPuzzle.hintsUsed,
            timeSpent,
            score: finalScore
        });

        // Save progress
        this.saveGameData();
    }

    /**
     * Handle incorrect answer
     */
    handleIncorrectAnswer() {
        const currentPuzzle = this.gameState.currentPuzzle;

        // Reset streak on multiple failures
        if (currentPuzzle.attempts >= 3) {
            this.gameState.user.currentStreak = 0;
        }

        // Visual feedback
        this.showAnswerFeedback(false);

        // Show encouragement
        const encouragements = [
            "Not quite right, but you're thinking logically!",
            "Close! Try approaching it from a different angle.",
            "Good attempt! Consider the pattern more carefully.",
            "You're on the right track, keep going!"
        ];

        const message = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.showTemporaryMessage(message, 'info');

        this.logEvent('puzzle_attempt_failed', {
            chamber: currentPuzzle.chamberId,
            puzzle: currentPuzzle.puzzleIndex,
            attempt: currentPuzzle.attempts
        });
    }

    /**
     * Show hint for current puzzle
     */
    showHint() {
        const currentPuzzle = this.gameState.currentPuzzle;
        if (!currentPuzzle) return;

        const hints = currentPuzzle.puzzle.hints || [];
        const hintIndex = Math.min(currentPuzzle.hintsUsed, hints.length - 1);

        if (hintIndex >= hints.length) {
            this.showTemporaryMessage('No more hints available!', 'warning');
            return;
        }

        currentPuzzle.hintsUsed++;
        this.gameState.analytics.hintsUsed++;

        const hintPanel = document.getElementById('hint-panel');
        const hintContent = document.getElementById('hint-content');
        const hintLevel = document.getElementById('hint-level');

        if (hintPanel && hintContent && hintLevel) {
            hintLevel.textContent = currentPuzzle.hintsUsed;
            hintContent.textContent = hints[hintIndex];

            hintPanel.classList.add('visible');
            hintPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        this.logEvent('hint_used', {
            chamber: currentPuzzle.chamberId,
            puzzle: currentPuzzle.puzzleIndex,
            hintLevel: currentPuzzle.hintsUsed
        });
    }

    /**
     * Show feedback modal
     */
    showFeedback(feedback) {
        const modal = document.getElementById('feedback-modal');
        const title = document.getElementById('feedback-title');
        const message = document.getElementById('feedback-message');
        const icon = document.getElementById('feedback-icon');

        if (modal && title && message && icon) {
            title.textContent = feedback.title;

            let messageHTML = `<p>${feedback.message}</p>`;
            if (feedback.explanation) {
                messageHTML += `<div style="margin-top: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius);"><strong>Explanation:</strong> ${feedback.explanation}</div>`;
            }

            message.innerHTML = messageHTML;

            icon.textContent = feedback.type === 'success' ? '✅' : '❌';
            icon.className = `feedback-icon ${feedback.type}`;

            modal.classList.add('visible');
            modal.setAttribute('aria-hidden', 'false');

            // Set up modal actions
            this.setupFeedbackActions();
        }
    }

    /**
     * Setup feedback modal actions
     */
    setupFeedbackActions() {
        const nextBtn = document.getElementById('next-puzzle');
        const reviewBtn = document.getElementById('review-solution');

        if (nextBtn) {
            nextBtn.onclick = () => {
                this.closeFeedback();
                this.nextPuzzle();
            };
        }

        if (reviewBtn) {
            reviewBtn.onclick = () => {
                this.closeFeedback();
                // Implementation for review would go here
            };
        }
    }

    /**
     * Close feedback modal
     */
    closeFeedback() {
        const modal = document.getElementById('feedback-modal');
        if (modal) {
            modal.classList.remove('visible');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Advance to next puzzle
     */
    nextPuzzle() {
        const currentPuzzle = this.gameState.currentPuzzle;
        if (!currentPuzzle) return;

        const chamber = this.gameState.chambers.get(currentPuzzle.chamberId);
        const nextIndex = currentPuzzle.puzzleIndex + 1;

        if (nextIndex < chamber.puzzles.length) {
            this.startPuzzle(currentPuzzle.chamberId, nextIndex);
        } else {
            // Chamber completed
            this.showTemporaryMessage('Chamber completed! Well done!', 'success');
            setTimeout(() => this.showScreen('chambers'), 2000);
        }
    }

    /**
     * Add XP and handle level ups
     */
    addXP(amount) {
        this.gameState.user.xp += amount;

        // Check for level up
        while (this.gameState.user.xp >= this.gameState.user.xpToNext) {
            this.gameState.user.xp -= this.gameState.user.xpToNext;
            this.gameState.user.level++;
            this.gameState.user.xpToNext = this.calculateXPForNextLevel(this.gameState.user.level);

            // Update unlocked chambers
            this.updateUnlockedChambers();

            this.showTemporaryMessage(`Level up! You are now level ${this.gameState.user.level}!`, 'success');

            this.logEvent('level_up', { newLevel: this.gameState.user.level });
        }

        this.updateUI();
    }

    /**
     * Calculate XP requirement for next level
     */
    calculateXPForNextLevel(level) {
        return Math.floor(100 * Math.pow(1.1, level - 1));
    }

    /**
     * Update unlocked chambers based on level
     */
    updateUnlockedChambers() {
        let unlockedCount = 0;
        this.gameState.chambers.forEach(chamber => {
            if (chamber.unlockLevel <= this.gameState.user.level) {
                unlockedCount++;
            }
        });
        this.gameState.user.chambersUnlocked = unlockedCount;
    }

    /**
     * Calculate time bonus for puzzle completion
     */
    calculateTimeBonus(startTime) {
        const timeSpent = Date.now() - startTime;
        const maxBonus = 5;
        const fastTime = 30000; // 30 seconds for max bonus

        if (timeSpent <= fastTime) {
            return maxBonus;
        } else if (timeSpent <= fastTime * 2) {
            return Math.floor(maxBonus * 0.5);
        }

        return 0;
    }

    /**
     * Format time for display
     */
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);

        if (minutes > 0) {
            return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
        }

        return `${seconds}s`;
    }

    /**
     * Show temporary message
     */
    showTemporaryMessage(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'primary'}-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow-lg);
            z-index: var(--z-toast);
            transform: translateX(100%);
            transition: transform var(--transition-normal);
            max-width: 300px;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Show visual feedback for answer
     */
    showAnswerFeedback(isCorrect) {
        const answers = document.querySelectorAll('.choice-option, #text-answer');
        answers.forEach(el => {
            el.classList.remove('correct', 'incorrect');
            if (el.classList.contains('choice-option') && el.querySelector('input:checked')) {
                el.classList.add(isCorrect ? 'correct' : 'incorrect');
            } else if (el.id === 'text-answer') {
                el.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
        });
    }

    /**
     * Reset current puzzle
     */
    resetPuzzle() {
        // Clear all inputs
        document.querySelectorAll('input[name="puzzle-answer"]').forEach(input => {
            input.checked = false;
        });

        const textInput = document.getElementById('text-answer');
        if (textInput) {
            textInput.value = '';
        }

        // Hide hint panel
        const hintPanel = document.getElementById('hint-panel');
        if (hintPanel) {
            hintPanel.classList.remove('visible');
        }

        // Reset puzzle state
        if (this.gameState.currentPuzzle) {
            this.gameState.currentPuzzle.attempts = 0;
            this.gameState.currentPuzzle.hintsUsed = 0;
            this.gameState.currentPuzzle.startTime = Date.now();
        }

        // Clear answer feedback
        document.querySelectorAll('.choice-option, #text-answer').forEach(el => {
            el.classList.remove('correct', 'incorrect');
        });

        // Update check button state
        const checkBtn = document.getElementById('check-answer');
        if (checkBtn) {
            checkBtn.disabled = true;
        }
    }

    /**
     * Start daily challenge
     */
    startDailyChallenge() {
        this.showTemporaryMessage('Daily challenges coming soon!', 'info');
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showTemporaryMessage(message, 'warning');
    }

    /**
     * Log analytics event
     */
    logEvent(eventName, data = {}) {
        const event = {
            event: eventName,
            timestamp: Date.now(),
            sessionId: this.gameState.analytics.sessionStart,
            ...data
        };

        console.log('Analytics:', event);

        // In a real implementation, this would send to analytics service
        // For now, we'll store in sessionStorage for debugging
        const events = JSON.parse(sessionStorage.getItem('mindforge_analytics') || '[]');
        events.push(event);
        sessionStorage.setItem('mindforge_analytics', JSON.stringify(events));
    }

    /**
     * Get game statistics
     */
    getStats() {
        return {
            user: this.gameState.user,
            chambers: Array.from(this.gameState.chambers.entries()),
            analytics: this.gameState.analytics,
            settings: this.gameState.settings
        };
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new MindForge();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MindForge;
}/**
 * Logical Sequences Chamber
 * Puzzles focused on logical progression and sequential reasoning
 */

class LogicalSequencesGenerator {
    static generatePuzzles() {
        const puzzles = [];

        // Basic Logic Sequences (1-8)
        puzzles.push(...this.generateBasicLogicSequences());

        // Conditional Sequences (9-16)
        puzzles.push(...this.generateConditionalSequences());

        // Advanced Logic Sequences (17-25)
        puzzles.push(...this.generateAdvancedSequences());

        return puzzles;
    }

    static generateBasicLogicSequences() {
        return [
            {
                id: 'logical_sequences_1',
                title: 'Basic If-Then Logic',
                difficulty: 'easy',
                question: 'If all roses are flowers, and this is a rose, then what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'This is a flower',
                    'This is not a flower',
                    'This might be a flower',
                    'We cannot conclude anything'
                ],
                correctAnswer: 0,
                explanation: 'Using logical deduction: All roses are flowers + This is a rose = This is a flower.',
                hints: [
                    'Use the rule "All roses are flowers" and apply it to "this is a rose".',
                    'In logic, if A is true for all B, and we have a B, then A is true.',
                    'If all roses are flowers, and we have a rose, it must be a flower.'
                ],
                timeLimit: 120,
                points: 10,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_2',
                title: 'Simple Negation',
                difficulty: 'easy',
                question: 'If "No cats are dogs" is true, and Fluffy is a cat, what can we conclude about Fluffy?',
                type: 'multiple-choice',
                options: [
                    'Fluffy is a dog',
                    'Fluffy is not a dog',
                    'Fluffy might be a dog',
                    'We need more information'
                ],
                correctAnswer: 1,
                explanation: 'Since no cats are dogs, and Fluffy is a cat, Fluffy cannot be a dog.',
                hints: [
                    'The statement says NO cats are dogs.',
                    'If Fluffy is a cat, and no cats are dogs...',
                    'This means Fluffy definitely cannot be a dog.'
                ],
                timeLimit: 90,
                points: 10,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_3',
                title: 'Transitive Logic',
                difficulty: 'easy',
                question: 'If A is larger than B, and B is larger than C, what is the relationship between A and C?',
                type: 'multiple-choice',
                options: [
                    'A is larger than C',
                    'A is smaller than C',
                    'A is equal to C',
                    'Cannot be determined'
                ],
                correctAnswer: 0,
                explanation: 'This is transitive reasoning: if A > B and B > C, then A > C.',
                hints: [
                    'Think about ordering: if A > B and B > C...',
                    'This is like saying: if John is taller than Mary, and Mary is taller than Sam...',
                    'Use the transitive property: A > B > C means A > C.'
                ],
                timeLimit: 120,
                points: 10,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_4',
                title: 'Logical Implication',
                difficulty: 'medium',
                question: 'If "It\'s raining, then the ground is wet" and "The ground is not wet", what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'It is raining',
                    'It is not raining',
                    'It might be raining',
                    'We cannot tell'
                ],
                correctAnswer: 1,
                explanation: 'This uses modus tollens: If P→Q and not Q, then not P. Since the ground is not wet, it cannot be raining.',
                hints: [
                    'We know: IF raining THEN ground wet.',
                    'We observe: ground is NOT wet.',
                    'If raining always makes ground wet, but ground is not wet, then it cannot be raining.'
                ],
                timeLimit: 180,
                points: 15,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_5',
                title: 'Set Logic',
                difficulty: 'medium',
                question: 'If all students in the math club are also in the science club, and Sarah is in the math club, where else must Sarah be?',
                type: 'multiple-choice',
                options: [
                    'Art club',
                    'Science club',
                    'History club',
                    'Drama club'
                ],
                correctAnswer: 1,
                explanation: 'Since all math club students are also in science club, and Sarah is in math club, she must also be in science club.',
                hints: [
                    'The rule states ALL math club members are ALSO in science club.',
                    'Sarah is in the math club.',
                    'Therefore, Sarah must follow the rule for all math club members.'
                ],
                timeLimit: 150,
                points: 15,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_6',
                title: 'Logical Contradiction',
                difficulty: 'medium',
                question: 'Given: "All birds can fly" and "Penguins are birds" and "Penguins cannot fly". What is wrong?',
                type: 'multiple-choice',
                options: [
                    'Nothing is wrong',
                    'The statements contradict each other',
                    'We need more information',
                    'All statements are false'
                ],
                correctAnswer: 1,
                explanation: 'These statements create a logical contradiction. If all birds can fly, but penguins are birds that cannot fly, the statements are inconsistent.',
                hints: [
                    'Try to follow the logic: All birds fly → Penguins are birds → Penguins fly.',
                    'But we also know penguins cannot fly.',
                    'When logic leads to opposite conclusions, there\'s a contradiction.'
                ],
                timeLimit: 200,
                points: 15,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_7',
                title: 'Disjunctive Logic',
                difficulty: 'medium',
                question: 'If "Either it will rain or it will snow" and "It will not rain", what must happen?',
                type: 'multiple-choice',
                options: [
                    'It will not snow',
                    'It will snow',
                    'It might snow',
                    'Nothing will happen'
                ],
                correctAnswer: 1,
                explanation: 'In an "either A or B" statement, if A is false, then B must be true. Since it won\'t rain, it must snow.',
                hints: [
                    'We have "Either rain OR snow" - one of these must happen.',
                    'We know it will NOT rain.',
                    'If rain is ruled out, what\'s left from "rain or snow"?'
                ],
                timeLimit: 150,
                points: 15,
                category: 'basic-logic'
            },
            {
                id: 'logical_sequences_8',
                title: 'Contrapositive Logic',
                difficulty: 'hard',
                question: 'If "All good students study hard" is true, which statement must also be true?',
                type: 'multiple-choice',
                options: [
                    'All hard-studying students are good',
                    'If someone doesn\'t study hard, they are not a good student',
                    'Some good students don\'t study hard',
                    'Hard studying makes students good'
                ],
                correctAnswer: 1,
                explanation: 'The contrapositive of "All good students study hard" is "If someone doesn\'t study hard, they cannot be a good student".',
                hints: [
                    'Look for the contrapositive: If A → B, then not B → not A.',
                    'Original: Good student → Studies hard.',
                    'Contrapositive: Doesn\'t study hard → Not a good student.'
                ],
                timeLimit: 240,
                points: 20,
                category: 'basic-logic'
            }
        ];
    }

    static generateConditionalSequences() {
        return [
            {
                id: 'logical_sequences_9',
                title: 'Multiple Conditions',
                difficulty: 'medium',
                question: 'If "To pass the exam, you must study AND get enough sleep", and John studied but didn\'t sleep enough, what happens?',
                type: 'multiple-choice',
                options: [
                    'John passes the exam',
                    'John fails the exam',
                    'John might pass the exam',
                    'We need more information'
                ],
                correctAnswer: 1,
                explanation: 'Both conditions (study AND sleep) are required. Since John didn\'t meet both conditions, he fails.',
                hints: [
                    'The rule requires BOTH studying AND sleeping enough.',
                    'John only met one condition (studying).',
                    'When ALL conditions are required, missing any one means failure.'
                ],
                timeLimit: 180,
                points: 15,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_10',
                title: 'Alternative Conditions',
                difficulty: 'medium',
                question: 'If "You can enter if you have a ticket OR if you are on the guest list", and Maria has no ticket but is on the guest list, can she enter?',
                type: 'multiple-choice',
                options: [
                    'Yes, she can enter',
                    'No, she cannot enter',
                    'Only if she gets a ticket',
                    'It depends on other factors'
                ],
                correctAnswer: 0,
                explanation: 'The condition uses OR, meaning either condition is sufficient. Since Maria is on the guest list, she can enter.',
                hints: [
                    'The rule says ticket OR guest list - either one works.',
                    'Maria doesn\'t have a ticket, but is on the guest list.',
                    'Since she meets one of the OR conditions, she qualifies.'
                ],
                timeLimit: 150,
                points: 15,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_11',
                title: 'Nested Conditions',
                difficulty: 'hard',
                question: 'If "If it rains, then if you go out, you will get wet", and it\'s raining and you go out, what happens?',
                type: 'multiple-choice',
                options: [
                    'You will get wet',
                    'You will not get wet',
                    'You might get wet',
                    'Cannot be determined'
                ],
                correctAnswer: 0,
                explanation: 'The nested condition states: Rain → (Go out → Get wet). Since both conditions are met (raining AND going out), you get wet.',
                hints: [
                    'Break down the nested condition: IF raining, THEN (IF go out, THEN get wet).',
                    'It is raining, so the inner condition applies: IF go out, THEN get wet.',
                    'You do go out, so you get wet.'
                ],
                timeLimit: 240,
                points: 20,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_12',
                title: 'Complex Conditional Chain',
                difficulty: 'hard',
                question: 'Given: "If A then B", "If B then C", "If C then D". If A is true, what can we conclude about D?',
                type: 'multiple-choice',
                options: [
                    'D is true',
                    'D is false',
                    'D might be true',
                    'Cannot determine D'
                ],
                correctAnswer: 0,
                explanation: 'Following the chain: A → B → C → D. If A is true, then B is true, then C is true, then D is true.',
                hints: [
                    'Follow the chain step by step.',
                    'A is true, so B must be true (from A → B).',
                    'If B is true, then C is true, then D is true.'
                ],
                timeLimit: 200,
                points: 20,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_13',
                title: 'Conditional with Negation',
                difficulty: 'hard',
                question: 'If "If you don\'t study, then you won\'t pass", and Emma passed the test, what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'Emma studied',
                    'Emma didn\'t study',
                    'Emma might have studied',
                    'We cannot conclude anything about studying'
                ],
                correctAnswer: 0,
                explanation: 'Using contrapositive: "If you don\'t study → you won\'t pass" becomes "If you pass → you studied". Since Emma passed, she studied.',
                hints: [
                    'The original statement: Don\'t study → Don\'t pass.',
                    'The contrapositive: Pass → Study.',
                    'Emma passed, so by contrapositive, she must have studied.'
                ],
                timeLimit: 250,
                points: 20,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_14',
                title: 'Biconditional Logic',
                difficulty: 'hard',
                question: 'If "You get a discount if and only if you are a member", and Tom got a discount, what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'Tom is a member',
                    'Tom might be a member',
                    'Tom is not a member',
                    'We need more information'
                ],
                correctAnswer: 0,
                explanation: '"If and only if" means the conditions work both ways. Getting a discount guarantees membership, and membership guarantees discount.',
                hints: [
                    '"If and only if" means both directions: Member → Discount AND Discount → Member.',
                    'Tom got a discount.',
                    'Since Discount → Member, Tom must be a member.'
                ],
                timeLimit: 220,
                points: 20,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_15',
                title: 'Exclusive Or Logic',
                difficulty: 'hard',
                question: 'If "You can have either cake or ice cream, but not both", and you choose cake, what about ice cream?',
                type: 'multiple-choice',
                options: [
                    'You can also have ice cream',
                    'You cannot have ice cream',
                    'You might have ice cream',
                    'Ice cream is required'
                ],
                correctAnswer: 1,
                explanation: 'This is exclusive OR - you can have one or the other, but not both. Choosing cake excludes ice cream.',
                hints: [
                    'The key phrase is "but not both" - this makes it exclusive.',
                    'You can have cake OR ice cream, but NOT both.',
                    'Since you chose cake, you cannot also have ice cream.'
                ],
                timeLimit: 180,
                points: 20,
                category: 'conditional-logic'
            },
            {
                id: 'logical_sequences_16',
                title: 'Complex Multi-Conditional',
                difficulty: 'hard',
                question: 'Rules: "If sunny, go to beach. If rainy, stay home. If cloudy, go to mall." It\'s sunny and you\'re at the mall. What\'s wrong?',
                type: 'multiple-choice',
                options: [
                    'Nothing is wrong',
                    'You should be at the beach',
                    'You should be at home',
                    'The weather is impossible'
                ],
                correctAnswer: 1,
                explanation: 'Since it\'s sunny, the rule "If sunny, go to beach" applies. Being at the mall contradicts this rule.',
                hints: [
                    'Check what the rule says for sunny weather.',
                    'The rule for sunny weather is "go to beach".',
                    'You\'re at the mall instead of following the sunny weather rule.'
                ],
                timeLimit: 200,
                points: 25,
                category: 'conditional-logic'
            }
        ];
    }

    static generateAdvancedSequences() {
        return [
            {
                id: 'logical_sequences_17',
                title: 'Syllogistic Reasoning',
                difficulty: 'hard',
                question: 'All philosophers are thinkers. Some thinkers are scientists. Therefore, what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'All philosophers are scientists',
                    'Some philosophers are scientists',
                    'No philosophers are scientists',
                    'We cannot conclude anything definitive'
                ],
                correctAnswer: 3,
                explanation: 'This is an invalid syllogism. We cannot conclude anything definitive about the relationship between philosophers and scientists.',
                hints: [
                    'Be careful with syllogisms - not all lead to valid conclusions.',
                    'All philosophers are thinkers, but only SOME thinkers are scientists.',
                    'We don\'t know if the philosopher-thinkers overlap with the scientist-thinkers.'
                ],
                timeLimit: 300,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_18',
                title: 'Quantified Logic',
                difficulty: 'hard',
                question: 'If "Some cats are black" and "All black things absorb heat", what can we conclude about cats and heat absorption?',
                type: 'multiple-choice',
                options: [
                    'All cats absorb heat',
                    'Some cats absorb heat',
                    'No cats absorb heat',
                    'Only black cats absorb heat'
                ],
                correctAnswer: 1,
                explanation: 'Some cats are black, and all black things absorb heat, so some cats (the black ones) absorb heat.',
                hints: [
                    'Focus on the black cats specifically.',
                    'Some cats are black, and ALL black things absorb heat.',
                    'Therefore, those cats that are black must absorb heat.'
                ],
                timeLimit: 250,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_19',
                title: 'Modal Logic',
                difficulty: 'hard',
                question: 'If "It is necessary that all students attend class" and "John is a student", what can we conclude?',
                type: 'multiple-choice',
                options: [
                    'John might attend class',
                    'John will probably attend class',
                    'John must attend class',
                    'John chooses whether to attend'
                ],
                correctAnswer: 2,
                explanation: 'Modal logic: "Necessary" means it must be true. Since all students must attend and John is a student, John must attend.',
                hints: [
                    '"Necessary" in logic means "must be true".',
                    'If it\'s necessary that ALL students attend, and John is a student...',
                    'Then it\'s necessary (must be true) that John attends.'
                ],
                timeLimit: 220,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_20',
                title: 'Predicate Logic',
                difficulty: 'hard',
                question: 'Given: "For all x, if x is a dog, then x is an animal" and "Buddy is a dog", what follows?',
                type: 'multiple-choice',
                options: [
                    'Buddy might be an animal',
                    'Buddy is an animal',
                    'Buddy is not an animal',
                    'We need to know more about Buddy'
                ],
                correctAnswer: 1,
                explanation: 'Universal instantiation: The rule applies to ALL x, so it applies to Buddy. Since Buddy is a dog, Buddy is an animal.',
                hints: [
                    'The rule applies to ALL x (everything).',
                    'Buddy is one specific case of x.',
                    'Apply the rule: IF Buddy is a dog, THEN Buddy is an animal.'
                ],
                timeLimit: 200,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_21',
                title: 'Proof by Contradiction',
                difficulty: 'hard',
                question: 'To prove "All swans are white", you assume "There exists a non-white swan" and derive a contradiction. What does this prove?',
                type: 'multiple-choice',
                options: [
                    'All swans are white',
                    'No swans are white',
                    'Some swans are white',
                    'The assumption was correct'
                ],
                correctAnswer: 0,
                explanation: 'Proof by contradiction: If assuming the opposite leads to a contradiction, the original statement must be true.',
                hints: [
                    'In proof by contradiction, you assume the opposite of what you want to prove.',
                    'If this assumption leads to a contradiction, the assumption must be false.',
                    'If "there exists a non-white swan" is false, then all swans are white.'
                ],
                timeLimit: 280,
                points: 30,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_22',
                title: 'Set Theory Logic',
                difficulty: 'hard',
                question: 'If set A ⊆ B (A is subset of B) and B ⊆ C, and x ∈ A, what can we conclude about x and C?',
                type: 'multiple-choice',
                options: [
                    'x ∈ C',
                    'x ∉ C',
                    'x might be in C',
                    'Cannot determine'
                ],
                correctAnswer: 0,
                explanation: 'Subset transitivity: If A ⊆ B and B ⊆ C, then A ⊆ C. Since x ∈ A and A ⊆ C, then x ∈ C.',
                hints: [
                    'If A is a subset of B, all elements of A are in B.',
                    'If B is a subset of C, all elements of B are in C.',
                    'Therefore, all elements of A are also in C.'
                ],
                timeLimit: 240,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_23',
                title: 'Logical Equivalence',
                difficulty: 'hard',
                question: 'Which statement is logically equivalent to "If it rains, then the picnic is cancelled"?',
                type: 'multiple-choice',
                options: [
                    'If the picnic is not cancelled, then it\'s not raining',
                    'If it doesn\'t rain, then the picnic is not cancelled',
                    'The picnic is cancelled if and only if it rains',
                    'It rains if and only if the picnic is cancelled'
                ],
                correctAnswer: 0,
                explanation: 'The contrapositive "If not Q then not P" is logically equivalent to "If P then Q".',
                hints: [
                    'Look for the contrapositive form.',
                    'Original: Rain → Cancel picnic.',
                    'Contrapositive: Not cancel → Not rain.'
                ],
                timeLimit: 250,
                points: 25,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_24',
                title: 'Paradox Resolution',
                difficulty: 'hard',
                question: 'Consider: "This statement is false." If the statement is true, then it\'s false. If it\'s false, then it\'s true. What is this?',
                type: 'multiple-choice',
                options: [
                    'A true statement',
                    'A false statement',
                    'A logical paradox',
                    'A meaningless statement'
                ],
                correctAnswer: 2,
                explanation: 'This is the Liar Paradox, a famous logical paradox that creates a self-referential contradiction.',
                hints: [
                    'This is a famous problem in logic.',
                    'The statement refers to itself, creating a loop.',
                    'When a statement leads to contradictory conclusions, it\'s a paradox.'
                ],
                timeLimit: 300,
                points: 30,
                category: 'advanced-logic'
            },
            {
                id: 'logical_sequences_25',
                title: 'Meta-Logical Reasoning',
                difficulty: 'hard',
                question: 'In a logical system, if we can prove both "P" and "not P", what does this indicate about the system?',
                type: 'multiple-choice',
                options: [
                    'The system is complete',
                    'The system is consistent',
                    'The system is inconsistent',
                    'The system is undecidable'
                ],
                correctAnswer: 2,
                explanation: 'A logical system that can prove both a statement and its negation is inconsistent, as this violates the principle of non-contradiction.',
                hints: [
                    'In logic, a statement cannot be both true and false.',
                    'If a system proves both P and not-P, it contradicts this principle.',
                    'When a system allows contradictions, it\'s called inconsistent.'
                ],
                timeLimit: 350,
                points: 35,
                category: 'advanced-logic'
            }
        ];
    }
}

// Register the generator
if (typeof window !== 'undefined') {
    if (!window.PuzzleGenerators) {
        window.PuzzleGenerators = {};
    }
    window.PuzzleGenerators['logical-sequences'] = LogicalSequencesGenerator;
}/**
 * Pattern Recognition Chamber
 * Puzzles focused on identifying visual, numerical, and logical patterns
 */

class PatternRecognitionGenerator {
    static generatePuzzles() {
        const puzzles = [];

        // Visual Pattern Puzzles (1-8)
        puzzles.push(...this.generateVisualPatterns());

        // Number Sequence Puzzles (9-16)
        puzzles.push(...this.generateNumberSequences());

        // Shape Pattern Puzzles (17-25)
        puzzles.push(...this.generateShapePatterns());

        return puzzles;
    }

    static generateVisualPatterns() {
        return [
            {
                id: 'pattern_recognition_1',
                title: 'Color Sequence Pattern',
                difficulty: 'easy',
                question: 'What color comes next in this sequence: Red, Blue, Red, Blue, Red, ?',
                type: 'multiple-choice',
                options: ['Red', 'Blue', 'Green', 'Yellow'],
                correctAnswer: 1,
                explanation: 'This is an alternating pattern: Red, Blue, Red, Blue, Red... so Blue comes next.',
                hints: [
                    'Look at how the colors alternate in the sequence.',
                    'Notice the pattern: Red → Blue → Red → Blue → Red → ?',
                    'The pattern alternates between two colors consistently.'
                ],
                timeLimit: 120,
                points: 10,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_2',
                title: 'Geometric Progression',
                difficulty: 'easy',
                question: 'In this pattern ○○○ ○○ ○ ?, how many circles should be in the next group?',
                type: 'multiple-choice',
                options: ['0 circles', '1 circle', '2 circles', '4 circles'],
                correctAnswer: 0,
                explanation: 'The pattern decreases by 1 circle each time: 3, 2, 1, 0.',
                hints: [
                    'Count the circles in each group: 3, 2, 1...',
                    'The number of circles decreases by 1 each time.',
                    'Following the pattern: 3 → 2 → 1 → 0'
                ],
                timeLimit: 90,
                points: 10,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_3',
                title: 'Triangle Pattern',
                difficulty: 'easy',
                question: 'Following the pattern ▲ ▲▲ ▲▲▲ ?, how many triangles should be in the next group?',
                type: 'multiple-choice',
                options: ['3 triangles', '4 triangles', '5 triangles', '6 triangles'],
                correctAnswer: 1,
                explanation: 'The pattern increases by 1 triangle each time: 1, 2, 3, 4.',
                hints: [
                    'Count the triangles in each group.',
                    'The number increases by 1 each time.',
                    'The sequence is: 1, 2, 3, so next is 4.'
                ],
                timeLimit: 90,
                points: 10,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_4',
                title: 'Letter Pattern Recognition',
                difficulty: 'medium',
                question: 'What letter comes next in this sequence: A, C, E, G, ?',
                type: 'multiple-choice',
                options: ['H', 'I', 'J', 'K'],
                correctAnswer: 1,
                explanation: 'This sequence skips one letter each time: A(+2)C(+2)E(+2)G(+2)I.',
                hints: [
                    'Look at the positions of the letters in the alphabet.',
                    'Each letter is 2 positions ahead of the previous one.',
                    'A(1) → C(3) → E(5) → G(7) → I(9)'
                ],
                timeLimit: 150,
                points: 15,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_5',
                title: 'Size Pattern',
                difficulty: 'medium',
                question: 'In this pattern of squares: Large, Medium, Small, Large, Medium, ?, what comes next?',
                type: 'multiple-choice',
                options: ['Large', 'Medium', 'Small', 'Extra Large'],
                correctAnswer: 2,
                explanation: 'The pattern repeats every 3 items: Large, Medium, Small, then repeats.',
                hints: [
                    'Look for a repeating cycle in the sizes.',
                    'The pattern is: Large → Medium → Small → Large → Medium → ?',
                    'This is a 3-item cycle that repeats.'
                ],
                timeLimit: 120,
                points: 15,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_6',
                title: 'Direction Pattern',
                difficulty: 'medium',
                question: 'Following this arrow pattern: → ↓ ← ↑ → ?, what direction comes next?',
                type: 'multiple-choice',
                options: ['↑ (Up)', '→ (Right)', '↓ (Down)', '← (Left)'],
                correctAnswer: 2,
                explanation: 'The arrows rotate clockwise: Right → Down → Left → Up → Right → Down.',
                hints: [
                    'Notice how the arrows turn in a specific direction.',
                    'The arrows rotate clockwise around a circle.',
                    'Right → Down → Left → Up → Right → Down'
                ],
                timeLimit: 150,
                points: 15,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_7',
                title: 'Complex Color Pattern',
                difficulty: 'hard',
                question: 'What comes next in: Red Red, Blue Blue Blue, Green Green Green Green, ?',
                type: 'multiple-choice',
                options: [
                    'Yellow Yellow Yellow Yellow Yellow',
                    'Purple Purple Purple',
                    'Orange Orange',
                    'Black'
                ],
                correctAnswer: 0,
                explanation: 'Each color appears a number of times equal to its position: Red(2), Blue(3), Green(4), so Yellow should appear 5 times.',
                hints: [
                    'Count how many times each color appears.',
                    'Red appears 2 times, Blue 3 times, Green 4 times...',
                    'The pattern increases by 1 each time: 2, 3, 4, 5'
                ],
                timeLimit: 180,
                points: 20,
                category: 'visual-patterns'
            },
            {
                id: 'pattern_recognition_8',
                title: 'Symbol Rotation',
                difficulty: 'hard',
                question: 'In this pattern of rotating symbols: ◐ ◑ ◒ ◓ ?, what comes next?',
                type: 'multiple-choice',
                options: ['◐', '◑', '◒', '◓'],
                correctAnswer: 0,
                explanation: 'The symbol rotates 90° clockwise each time, completing a full rotation and starting over.',
                hints: [
                    'Notice how the shaded part of the circle rotates.',
                    'Each step is a 90-degree clockwise rotation.',
                    'After 4 steps (360°), the pattern repeats from the beginning.'
                ],
                timeLimit: 200,
                points: 20,
                category: 'visual-patterns'
            }
        ];
    }

    static generateNumberSequences() {
        return [
            {
                id: 'pattern_recognition_9',
                title: 'Simple Addition Sequence',
                difficulty: 'easy',
                question: 'What number comes next in this sequence: 2, 4, 6, 8, ?',
                type: 'multiple-choice',
                options: ['9', '10', '11', '12'],
                correctAnswer: 1,
                explanation: 'This sequence increases by 2 each time: 2 + 2 = 4, 4 + 2 = 6, 6 + 2 = 8, 8 + 2 = 10.',
                hints: [
                    'Look at the difference between consecutive numbers.',
                    'Each number is 2 more than the previous one.',
                    '2 → 4 → 6 → 8 → 10'
                ],
                timeLimit: 90,
                points: 10,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_10',
                title: 'Doubling Sequence',
                difficulty: 'easy',
                question: 'What number comes next: 1, 2, 4, 8, ?',
                type: 'multiple-choice',
                options: ['12', '14', '16', '18'],
                correctAnswer: 2,
                explanation: 'Each number is doubled: 1 × 2 = 2, 2 × 2 = 4, 4 × 2 = 8, 8 × 2 = 16.',
                hints: [
                    'Look at how each number relates to the previous one.',
                    'Each number is twice the previous number.',
                    '1 × 2 = 2, 2 × 2 = 4, 4 × 2 = 8, 8 × 2 = ?'
                ],
                timeLimit: 120,
                points: 10,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_11',
                title: 'Odd Number Sequence',
                difficulty: 'easy',
                question: 'What comes next in this sequence: 1, 3, 5, 7, ?',
                type: 'multiple-choice',
                options: ['8', '9', '10', '11'],
                correctAnswer: 1,
                explanation: 'This is the sequence of odd numbers, each increasing by 2: 7 + 2 = 9.',
                hints: [
                    'These are all odd numbers.',
                    'The difference between consecutive numbers is always 2.',
                    'Odd numbers: 1, 3, 5, 7, 9, 11...'
                ],
                timeLimit: 90,
                points: 10,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_12',
                title: 'Square Numbers',
                difficulty: 'medium',
                question: 'What number comes next: 1, 4, 9, 16, ?',
                type: 'multiple-choice',
                options: ['20', '24', '25', '30'],
                correctAnswer: 2,
                explanation: 'These are perfect squares: 1² = 1, 2² = 4, 3² = 9, 4² = 16, 5² = 25.',
                hints: [
                    'Try to see if these numbers are related to multiplication.',
                    'Each number is a perfect square: 1×1, 2×2, 3×3, 4×4...',
                    'The next number would be 5×5 = 25.'
                ],
                timeLimit: 150,
                points: 15,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_13',
                title: 'Fibonacci Start',
                difficulty: 'medium',
                question: 'What number comes next: 1, 1, 2, 3, 5, ?',
                type: 'multiple-choice',
                options: ['6', '7', '8', '9'],
                correctAnswer: 2,
                explanation: 'This is the Fibonacci sequence where each number is the sum of the two preceding ones: 3 + 5 = 8.',
                hints: [
                    'Look at how each number relates to the two before it.',
                    'Try adding the two previous numbers together.',
                    '1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = ?'
                ],
                timeLimit: 180,
                points: 15,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_14',
                title: 'Alternating Operations',
                difficulty: 'medium',
                question: 'What comes next: 2, 6, 5, 15, 14, ?',
                type: 'multiple-choice',
                options: ['40', '42', '44', '46'],
                correctAnswer: 1,
                explanation: 'The pattern alternates: multiply by 3, subtract 1. So 14 × 3 = 42.',
                hints: [
                    'Look at the operations between consecutive numbers.',
                    'Try: 2 × 3 = 6, 6 - 1 = 5, 5 × 3 = 15, 15 - 1 = 14...',
                    'The pattern alternates between multiplying by 3 and subtracting 1.'
                ],
                timeLimit: 200,
                points: 15,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_15',
                title: 'Prime Numbers',
                difficulty: 'hard',
                question: 'What prime number comes next: 2, 3, 5, 7, 11, ?',
                type: 'multiple-choice',
                options: ['12', '13', '14', '15'],
                correctAnswer: 1,
                explanation: 'These are consecutive prime numbers. After 11, the next prime number is 13.',
                hints: [
                    'These are all prime numbers (divisible only by 1 and themselves).',
                    'Find the next number that has no divisors other than 1 and itself.',
                    'Check: 12 = 2×6, 13 has no factors, 14 = 2×7, 15 = 3×5'
                ],
                timeLimit: 240,
                points: 20,
                category: 'number-sequences'
            },
            {
                id: 'pattern_recognition_16',
                title: 'Complex Pattern',
                difficulty: 'hard',
                question: 'What comes next: 1, 4, 13, 40, 121, ?',
                type: 'multiple-choice',
                options: ['364', '365', '366', '367'],
                correctAnswer: 0,
                explanation: 'Each term follows the pattern: 3 × previous term + 1. So 3 × 121 + 1 = 364.',
                hints: [
                    'Look for a mathematical relationship between consecutive terms.',
                    'Try multiplying each number by 3 and see what happens.',
                    '1×3+1=4, 4×3+1=13, 13×3+1=40, 40×3+1=121, 121×3+1=?'
                ],
                timeLimit: 300,
                points: 25,
                category: 'number-sequences'
            }
        ];
    }

    static generateShapePatterns() {
        return [
            {
                id: 'pattern_recognition_17',
                title: 'Shape Counting',
                difficulty: 'easy',
                question: 'If the pattern continues, how many hexagons will be in the 5th group: ⬡ ⬡⬡ ⬡⬡⬡ ⬡⬡⬡⬡ ?',
                type: 'multiple-choice',
                options: ['4', '5', '6', '7'],
                correctAnswer: 1,
                explanation: 'Each group has one more hexagon than its position number: Group 5 will have 5 hexagons.',
                hints: [
                    'Count the hexagons in each group: 1, 2, 3, 4...',
                    'The number of hexagons equals the group number.',
                    'Group 1: 1 hexagon, Group 2: 2 hexagons, Group 5: 5 hexagons'
                ],
                timeLimit: 120,
                points: 10,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_18',
                title: 'Shape Transformation',
                difficulty: 'medium',
                question: 'What shape comes next: Circle → Square → Triangle → Circle → Square → ?',
                type: 'multiple-choice',
                options: ['Circle', 'Square', 'Triangle', 'Pentagon'],
                correctAnswer: 2,
                explanation: 'The pattern repeats every 3 shapes: Circle, Square, Triangle, then repeats.',
                hints: [
                    'Look for a repeating cycle of shapes.',
                    'The pattern is: Circle → Square → Triangle → Circle → Square → ?',
                    'This is a 3-shape cycle that repeats.'
                ],
                timeLimit: 150,
                points: 15,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_19',
                title: 'Growing Shapes',
                difficulty: 'medium',
                question: 'In this pattern of dots forming shapes: • •• ••• •••• ?, how many dots in the next shape?',
                type: 'multiple-choice',
                options: ['4', '5', '6', '7'],
                correctAnswer: 1,
                explanation: 'Each shape adds one more dot: 1, 2, 3, 4, so the next has 5 dots.',
                hints: [
                    'Count the dots in each shape.',
                    'Each shape has one more dot than the previous.',
                    'The sequence is: 1, 2, 3, 4, 5...'
                ],
                timeLimit: 120,
                points: 15,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_20',
                title: 'Color and Shape',
                difficulty: 'medium',
                question: 'What comes next: Red Circle, Blue Square, Green Triangle, Red Circle, ?',
                type: 'multiple-choice',
                options: ['Blue Square', 'Green Triangle', 'Yellow Pentagon', 'Red Square'],
                correctAnswer: 0,
                explanation: 'The pattern repeats: Red Circle → Blue Square → Green Triangle → Red Circle → Blue Square.',
                hints: [
                    'Both color and shape follow a pattern.',
                    'Look for a repeating sequence of color-shape combinations.',
                    'The pattern repeats every 3 items.'
                ],
                timeLimit: 180,
                points: 15,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_21',
                title: 'Nested Shapes',
                difficulty: 'hard',
                question: 'Following this pattern of nested shapes: ○ ○□ ○□△ ?, what comes next?',
                type: 'multiple-choice',
                options: ['○□△◇', '○□△○', '□△◇', '○○□□'],
                correctAnswer: 0,
                explanation: 'Each step adds a new shape to the outside: Circle, Circle+Square, Circle+Square+Triangle, Circle+Square+Triangle+Diamond.',
                hints: [
                    'Notice how each step adds one more shape.',
                    'The shapes are added from inside to outside.',
                    'The sequence adds: Circle, then Square, then Triangle, then Diamond.'
                ],
                timeLimit: 240,
                points: 20,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_22',
                title: 'Shape Matrix',
                difficulty: 'hard',
                question: 'In a 3×3 grid where each row and column must contain exactly one Circle, Square, and Triangle, what shape goes in the bottom-right corner if the top row is Circle-Square-Triangle and the middle row is Square-Triangle-?',
                type: 'multiple-choice',
                options: ['Circle', 'Square', 'Triangle', 'Cannot be determined'],
                correctAnswer: 0,
                explanation: 'In the middle row, the missing shape must be Circle (to complete Circle-Square-Triangle). Then the bottom-right must be Circle to complete the third column pattern.',
                hints: [
                    'Each row and column must have exactly one of each shape.',
                    'First figure out what completes the middle row.',
                    'Then use the column constraint to find the bottom-right shape.'
                ],
                timeLimit: 300,
                points: 25,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_23',
                title: 'Symmetrical Patterns',
                difficulty: 'hard',
                question: 'What completes this symmetrical pattern: ▲○▲ ○□○ ▲○?',
                type: 'multiple-choice',
                options: ['○', '▲', '□', '◇'],
                correctAnswer: 1,
                explanation: 'The pattern is symmetrical around the center. To maintain symmetry, the missing piece should be ▲.',
                hints: [
                    'Look for symmetry in the pattern.',
                    'The pattern should be the same when read forwards and backwards.',
                    'Mirror the beginning of the pattern to find the end.'
                ],
                timeLimit: 240,
                points: 20,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_24',
                title: 'Fractal Pattern',
                difficulty: 'hard',
                question: 'In this fractal-like pattern where each step doubles the previous: ▲ ▲▲ ▲▲▲▲, how many triangles in the next step?',
                type: 'multiple-choice',
                options: ['6', '7', '8', '9'],
                correctAnswer: 2,
                explanation: 'The pattern doubles each time: 1 → 2 → 4 → 8 triangles.',
                hints: [
                    'Look at how the number of triangles changes each step.',
                    'Each step has twice as many triangles as the previous.',
                    '1 → 2 → 4 → 8 (doubling pattern)'
                ],
                timeLimit: 200,
                points: 25,
                category: 'shape-patterns'
            },
            {
                id: 'pattern_recognition_25',
                title: 'Master Pattern Challenge',
                difficulty: 'hard',
                question: 'What completes this complex pattern: 1○ 2□□ 3△△△ 4?, where the number indicates how many of each shape appear?',
                type: 'multiple-choice',
                options: ['◇◇◇◇', '○○○○', '□□□□', '★★★★'],
                correctAnswer: 0,
                explanation: 'The pattern shows: 1 circle, 2 squares, 3 triangles, so 4 diamonds (or any new shape) would complete the pattern.',
                hints: [
                    'Look at both the numbers and the shapes.',
                    'The number tells you how many of each shape to use.',
                    'Pattern: 1 of shape 1, 2 of shape 2, 3 of shape 3, 4 of shape 4.'
                ],
                timeLimit: 300,
                points: 30,
                category: 'shape-patterns'
            }
        ];
    }
}

// Register the generator
if (typeof window !== 'undefined') {
    if (!window.PuzzleGenerators) {
        window.PuzzleGenerators = {};
    }
    window.PuzzleGenerators['pattern-recognition'] = PatternRecognitionGenerator;
}/**
 * Spatial Reasoning Chamber
 * Puzzles focused on 3D visualization, rotation, and spatial relationships
 */

class SpatialReasoningGenerator {
    static generatePuzzles() {
        const puzzles = [];

        // 2D Spatial Puzzles (1-8)
        puzzles.push(...this.generate2DSpatialPuzzles());

        // 3D Visualization Puzzles (9-16)
        puzzles.push(...this.generate3DVisualizationPuzzles());

        // Advanced Spatial Puzzles (17-25)
        puzzles.push(...this.generateAdvancedSpatialPuzzles());

        return puzzles;
    }

    static generate2DSpatialPuzzles() {
        return [
            {
                id: 'spatial_reasoning_1',
                title: 'Mirror Reflection',
                difficulty: 'easy',
                question: 'If you hold the letter "R" up to a mirror, what would you see?',
                type: 'multiple-choice',
                options: ['R', 'Я', 'ᴿ', 'ɿ'],
                correctAnswer: 1,
                explanation: 'When reflected in a mirror, the letter R appears reversed horizontally, looking like the Cyrillic letter Я.',
                hints: [
                    'Think about what happens when you look at text in a mirror.',
                    'Mirror reflections flip images horizontally.',
                    'The letter R would appear backwards when mirrored.'
                ],
                timeLimit: 120,
                points: 10,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_2',
                title: 'Shape Rotation',
                difficulty: 'easy',
                question: 'If you rotate the letter "L" 90 degrees clockwise, what shape does it resemble?',
                type: 'multiple-choice',
                options: ['Γ (gamma)', '⌐ (corner)', '└ (bottom-left corner)', '┘ (bottom-right corner)'],
                correctAnswer: 0,
                explanation: 'Rotating "L" 90 degrees clockwise transforms it into a shape resembling the Greek letter Γ (gamma).',
                hints: [
                    'Imagine the L turning to the right by 90 degrees.',
                    'The vertical line becomes horizontal, the horizontal line becomes vertical.',
                    'Think about which way the "corner" of the L would point after rotation.'
                ],
                timeLimit: 150,
                points: 10,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_3',
                title: 'Puzzle Piece Fitting',
                difficulty: 'easy',
                question: 'You have a puzzle piece shaped like ┐. Which opening would it fit into perfectly?',
                type: 'multiple-choice',
                options: ['┌ opening', '┐ opening', '└ opening', '┘ opening'],
                correctAnswer: 2,
                explanation: 'The piece ┐ fits into the └ opening because they are complementary shapes.',
                hints: [
                    'Think about which opening would complete a rectangle.',
                    'The piece and opening should fit together like puzzle pieces.',
                    'Look for the shape that complements the given piece.'
                ],
                timeLimit: 120,
                points: 10,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_4',
                title: 'Symmetry Recognition',
                difficulty: 'medium',
                question: 'Which of these shapes has both horizontal and vertical lines of symmetry?',
                type: 'multiple-choice',
                options: ['Triangle', 'Rectangle', 'Circle', 'Pentagon'],
                correctAnswer: 2,
                explanation: 'A circle has infinite lines of symmetry, including both horizontal and vertical lines through its center.',
                hints: [
                    'Think about folding the shape along different lines.',
                    'The shape should look identical when folded horizontally or vertically.',
                    'Consider which shape looks the same from all directions.'
                ],
                timeLimit: 180,
                points: 15,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_5',
                title: 'Path Navigation',
                difficulty: 'medium',
                question: 'Starting at point A, if you go 3 steps North, 2 steps East, 3 steps South, and 2 steps West, where do you end up?',
                type: 'multiple-choice',
                options: ['Back at point A', '2 steps North of A', '2 steps East of A', '4 steps from A'],
                correctAnswer: 0,
                explanation: 'The movements cancel out: North cancels South (3-3=0), East cancels West (2-2=0), returning to the starting point.',
                hints: [
                    'Track your position step by step.',
                    'Notice that some movements are in opposite directions.',
                    'North and South cancel each other, as do East and West.'
                ],
                timeLimit: 200,
                points: 15,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_6',
                title: 'Angle Visualization',
                difficulty: 'medium',
                question: 'If you start facing North and turn 270 degrees clockwise, which direction are you now facing?',
                type: 'multiple-choice',
                options: ['North', 'East', 'South', 'West'],
                correctAnswer: 3,
                explanation: '270 degrees clockwise from North: 90° = East, 180° = South, 270° = West.',
                hints: [
                    'Remember: 90° = quarter turn, 180° = half turn, 270° = three-quarter turn.',
                    'Clockwise from North: first East, then South, then West.',
                    '270 degrees is three-quarters of a full circle.'
                ],
                timeLimit: 180,
                points: 15,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_7',
                title: 'Overlapping Shapes',
                difficulty: 'medium',
                question: 'If a square overlaps with a circle, and both have the same center point, what is the maximum number of regions created?',
                type: 'multiple-choice',
                options: ['2 regions', '3 regions', '4 regions', '5 regions'],
                correctAnswer: 2,
                explanation: 'The overlapping creates 4 regions: inside circle only, inside square only, inside both, and outside both.',
                hints: [
                    'Think about the different areas created by the overlap.',
                    'Consider: inside the circle but not the square, inside the square but not the circle...',
                    'Don\'t forget the area that\'s inside both shapes and the area outside both.'
                ],
                timeLimit: 220,
                points: 15,
                category: '2d-spatial'
            },
            {
                id: 'spatial_reasoning_8',
                title: 'Coordinate Transformation',
                difficulty: 'hard',
                question: 'Point (3, 2) is reflected across the line y = x. What are the new coordinates?',
                type: 'multiple-choice',
                options: ['(3, 2)', '(2, 3)', '(-3, -2)', '(-2, -3)'],
                correctAnswer: 1,
                explanation: 'Reflecting across y = x swaps the x and y coordinates: (3, 2) becomes (2, 3).',
                hints: [
                    'The line y = x is a diagonal line through the origin.',
                    'Reflection across y = x swaps x and y coordinates.',
                    'If the original point is (a, b), the reflected point is (b, a).'
                ],
                timeLimit: 240,
                points: 20,
                category: '2d-spatial'
            }
        ];
    }

    static generate3DVisualizationPuzzles() {
        return [
            {
                id: 'spatial_reasoning_9',
                title: 'Cube Unfolding',
                difficulty: 'medium',
                question: 'When you unfold a cube, how many faces will be visible in the flat pattern?',
                type: 'multiple-choice',
                options: ['4 faces', '5 faces', '6 faces', '8 faces'],
                correctAnswer: 2,
                explanation: 'A cube has 6 faces, and when unfolded into a flat pattern (net), all 6 faces are visible.',
                hints: [
                    'Think about how many sides a cube has.',
                    'When you unfold a box, you can see all its surfaces.',
                    'Count the faces of a dice or any cube-shaped object.'
                ],
                timeLimit: 150,
                points: 15,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_10',
                title: 'Box Folding',
                difficulty: 'medium',
                question: 'If you have a flat cross-shaped pattern with 6 squares, what 3D shape can you fold it into?',
                type: 'multiple-choice',
                options: ['Pyramid', 'Cube', 'Cylinder', 'Cone'],
                correctAnswer: 1,
                explanation: 'A cross-shaped pattern with 6 squares is a net of a cube, which can be folded into a cube.',
                hints: [
                    'Think about what shape has 6 equal square faces.',
                    'Imagine folding the cross pattern by bringing the edges together.',
                    'This is the reverse of unfolding a cube.'
                ],
                timeLimit: 180,
                points: 15,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_11',
                title: 'Shadow Projection',
                difficulty: 'medium',
                question: 'A sphere is placed between a light source and a wall. What shape will its shadow be?',
                type: 'multiple-choice',
                options: ['Circle', 'Oval', 'Square', 'Depends on the angle'],
                correctAnswer: 0,
                explanation: 'A sphere always casts a circular shadow regardless of the viewing angle, because it\'s perfectly round.',
                hints: [
                    'Think about the shape of a ball from any direction.',
                    'A sphere looks the same from all angles.',
                    'The shadow will match the outline you see when looking at the sphere.'
                ],
                timeLimit: 150,
                points: 15,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_12',
                title: 'Mental Rotation',
                difficulty: 'hard',
                question: 'Imagine a cube with a red dot on the top face. If you rotate it 90° forward (away from you), where is the red dot now?',
                type: 'multiple-choice',
                options: ['On the front face', 'On the back face', 'On the bottom face', 'Still on top'],
                correctAnswer: 1,
                explanation: 'When rotating 90° forward, the top face becomes the back face.',
                hints: [
                    'Imagine the cube tipping away from you.',
                    'The top surface moves to become the far side.',
                    'Think of the cube rolling forward one quarter turn.'
                ],
                timeLimit: 250,
                points: 20,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_13',
                title: 'Cross-Section Visualization',
                difficulty: 'hard',
                question: 'If you slice a cone horizontally (parallel to its base), what shape is the cross-section?',
                type: 'multiple-choice',
                options: ['Triangle', 'Circle', 'Oval', 'Rectangle'],
                correctAnswer: 1,
                explanation: 'A horizontal slice through a cone creates a circular cross-section, smaller than the base but still circular.',
                hints: [
                    'Think about cutting through a cone with a horizontal plane.',
                    'The cone has a circular base.',
                    'A horizontal cut maintains the circular shape but at a smaller size.'
                ],
                timeLimit: 220,
                points: 20,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_14',
                title: 'Volume Comparison',
                difficulty: 'hard',
                question: 'You have two containers: a tall thin cylinder and a short wide cylinder. Both have the same volume. If you pour water from the tall one to the short one, what happens to the water level?',
                type: 'multiple-choice',
                options: [
                    'Water level rises',
                    'Water level falls',
                    'Water level stays the same',
                    'Not enough information'
                ],
                correctAnswer: 1,
                explanation: 'Since the short cylinder is wider, the same volume of water will reach a lower height.',
                hints: [
                    'Both containers hold the same total amount.',
                    'Think about spreading the same amount over a wider area.',
                    'Wider base means lower height for the same volume.'
                ],
                timeLimit: 200,
                points: 20,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_15',
                title: 'Isometric Projection',
                difficulty: 'hard',
                question: 'Looking at a cube from a corner (so you can see 3 faces), how many edges are visible?',
                type: 'multiple-choice',
                options: ['6 edges', '7 edges', '8 edges', '9 edges'],
                correctAnswer: 3,
                explanation: 'From a corner view seeing 3 faces, you can see 9 edges: 3 edges around each visible face, with some edges shared.',
                hints: [
                    'You can see 3 faces of the cube.',
                    'Each face is a square with 4 edges.',
                    'Some edges are shared between faces - count carefully.'
                ],
                timeLimit: 300,
                points: 25,
                category: '3d-visualization'
            },
            {
                id: 'spatial_reasoning_16',
                title: 'Complex Mental Rotation',
                difficulty: 'hard',
                question: 'A die shows 1 on top and 2 facing you. If you rotate it 90° clockwise (when viewed from above), what number now faces you?',
                type: 'multiple-choice',
                options: ['3', '4', '5', '6'],
                correctAnswer: 2,
                explanation: 'On a standard die, opposite faces sum to 7. With 1 on top (6 on bottom) and 2 facing you, rotating 90° clockwise brings 5 to face you.',
                hints: [
                    'Remember that opposite faces of a die add up to 7.',
                    'If 1 is on top, 6 is on the bottom.',
                    'With 2 facing you, think about what\'s to the right of 2.'
                ],
                timeLimit: 350,
                points: 25,
                category: '3d-visualization'
            }
        ];
    }

    static generateAdvancedSpatialPuzzles() {
        return [
            {
                id: 'spatial_reasoning_17',
                title: 'Impossible Object',
                difficulty: 'hard',
                question: 'A "Penrose triangle" appears to be a 3D triangle, but why is it impossible?',
                type: 'multiple-choice',
                options: [
                    'Triangles cannot be 3D',
                    'The angles don\'t add up correctly',
                    'It violates 3D spatial consistency',
                    'It\'s too complex to build'
                ],
                correctAnswer: 2,
                explanation: 'The Penrose triangle creates an optical illusion that violates 3D spatial consistency - it appears to connect in impossible ways.',
                hints: [
                    'This is about optical illusions and impossible geometry.',
                    'The triangle appears to loop back on itself impossibly.',
                    'In real 3D space, the connections shown cannot actually exist.'
                ],
                timeLimit: 250,
                points: 25,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_18',
                title: 'Topological Thinking',
                difficulty: 'hard',
                question: 'How many holes does a coffee mug have in topological terms?',
                type: 'multiple-choice',
                options: ['0 holes', '1 hole', '2 holes', '3 holes'],
                correctAnswer: 1,
                explanation: 'Topologically, a coffee mug has 1 hole (the handle creates a loop). The opening at the top is not a "hole through" the object.',
                hints: [
                    'In topology, we count holes that go completely through the object.',
                    'Think about the handle of the mug.',
                    'The opening at the top doesn\'t count as a topological hole.'
                ],
                timeLimit: 200,
                points: 25,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_19',
                title: 'Spatial Transformation Chain',
                difficulty: 'hard',
                question: 'Start with shape A. Rotate 180°, then reflect horizontally, then rotate 90° clockwise. This sequence is equivalent to what single transformation?',
                type: 'multiple-choice',
                options: [
                    'Rotate 90° counterclockwise',
                    'Rotate 90° clockwise',
                    'Reflect vertically',
                    'Rotate 270° clockwise'
                ],
                correctAnswer: 0,
                explanation: 'The sequence of transformations (180° rotation + horizontal reflection + 90° clockwise) equals a single 90° counterclockwise rotation.',
                hints: [
                    'Work through each transformation step by step.',
                    'Try to find a pattern or simplification.',
                    'Some combinations of transformations can be simplified to a single transformation.'
                ],
                timeLimit: 400,
                points: 30,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_20',
                title: 'Polyhedron Properties',
                difficulty: 'hard',
                question: 'A polyhedron has 12 faces, 20 vertices. Using Euler\'s formula (V - E + F = 2), how many edges does it have?',
                type: 'multiple-choice',
                options: ['28 edges', '30 edges', '32 edges', '34 edges'],
                correctAnswer: 1,
                explanation: 'Using Euler\'s formula: V - E + F = 2, so 20 - E + 12 = 2, therefore E = 30 edges.',
                hints: [
                    'Use Euler\'s formula: V - E + F = 2.',
                    'Substitute the known values: V = 20, F = 12.',
                    'Solve for E: 20 - E + 12 = 2.'
                ],
                timeLimit: 300,
                points: 25,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_21',
                title: 'Hypercube Visualization',
                difficulty: 'hard',
                question: 'A tesseract (4D hypercube) projected into 3D space appears to be what?',
                type: 'multiple-choice',
                options: [
                    'A cube inside another cube',
                    'A sphere',
                    'An octahedron',
                    'A pyramid'
                ],
                correctAnswer: 0,
                explanation: 'A tesseract projected into 3D space typically appears as a smaller cube inside a larger cube, connected at the vertices.',
                hints: [
                    'Think about how a 3D cube projects to 2D (as a square inside a square).',
                    'The 4D to 3D projection follows a similar pattern.',
                    'The projection shows nested geometric shapes.'
                ],
                timeLimit: 280,
                points: 30,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_22',
                title: 'Non-Euclidean Geometry',
                difficulty: 'hard',
                question: 'On the surface of a sphere, what is the sum of angles in a triangle?',
                type: 'multiple-choice',
                options: [
                    'Less than 180°',
                    'Exactly 180°',
                    'Greater than 180°',
                    'Always 360°'
                ],
                correctAnswer: 2,
                explanation: 'On a sphere\'s surface (spherical geometry), triangles have angle sums greater than 180° due to the curved space.',
                hints: [
                    'This is about curved space, not flat (Euclidean) geometry.',
                    'Think about a triangle drawn on Earth\'s surface.',
                    'Curvature affects angle measurements.'
                ],
                timeLimit: 250,
                points: 30,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_23',
                title: 'Fractal Dimension',
                difficulty: 'hard',
                question: 'The Koch snowflake has an infinite perimeter but finite area. What type of object is this?',
                type: 'multiple-choice',
                options: [
                    'A regular polygon',
                    'A fractal',
                    'A circle',
                    'An impossible object'
                ],
                correctAnswer: 1,
                explanation: 'The Koch snowflake is a fractal - a mathematical object with self-similar patterns at all scales and non-integer dimension.',
                hints: [
                    'This object has infinite detail at all scales.',
                    'It\'s created by a recursive process.',
                    'It has properties that seem paradoxical in normal geometry.'
                ],
                timeLimit: 200,
                points: 25,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_24',
                title: 'Multi-Dimensional Thinking',
                difficulty: 'hard',
                question: 'If you lived in a 2D world (Flatland) and a 3D sphere passed through your plane, what would you observe?',
                type: 'multiple-choice',
                options: [
                    'A constant circle',
                    'A growing then shrinking circle',
                    'A square',
                    'Nothing at all'
                ],
                correctAnswer: 1,
                explanation: 'A 3D sphere intersecting a 2D plane creates a circle that starts small, grows to maximum size, then shrinks back to nothing.',
                hints: [
                    'Think about cross-sections of a sphere.',
                    'Imagine the sphere moving through the 2D plane.',
                    'The intersection changes size as the sphere passes through.'
                ],
                timeLimit: 300,
                points: 30,
                category: 'advanced-spatial'
            },
            {
                id: 'spatial_reasoning_25',
                title: 'Master Spatial Challenge',
                difficulty: 'hard',
                question: 'A Klein bottle is a surface with no distinct "inside" or "outside". In what minimum number of dimensions can it exist without self-intersection?',
                type: 'multiple-choice',
                options: [
                    '2 dimensions',
                    '3 dimensions',
                    '4 dimensions',
                    '5 dimensions'
                ],
                correctAnswer: 2,
                explanation: 'A Klein bottle requires 4 dimensions to exist without self-intersection, though it can be visualized (with self-intersection) in 3D.',
                hints: [
                    'This is about topological objects that seem impossible in our 3D world.',
                    'The Klein bottle needs extra dimensions to avoid intersecting itself.',
                    'Think about how complex topological shapes require higher dimensions.'
                ],
                timeLimit: 350,
                points: 35,
                category: 'advanced-spatial'
            }
        ];
    }
}

// Register the generator
if (typeof window !== 'undefined') {
    if (!window.PuzzleGenerators) {
        window.PuzzleGenerators = {};
    }
    window.PuzzleGenerators['spatial-reasoning'] = SpatialReasoningGenerator;
}/**
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
}/**
 * Accessibility Manager
 * Handles WCAG compliance, screen reader support, and adaptive features
 */

class AccessibilityManager {
    constructor(game) {
        this.game = game;
        this.announcer = null;
        this.focusTracker = null;
        this.keyboardNavigation = null;

        this.init();
    }

    /**
     * Initialize accessibility features
     */
    init() {
        this.createLiveRegions();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
        this.setupReducedMotion();
        this.setupHighContrast();
        this.setupFontScaling();
        this.addSkipLinks();
        this.enhanceFormAccessibility();
        this.setupColorBlindSupport();
    }

    /**
     * Create ARIA live regions for dynamic content
     */
    createLiveRegions() {
        // Polite announcements (non-interrupting)
        this.announcer = this.createLiveRegion('polite-announcer', 'polite');

        // Assertive announcements (interrupting)
        this.assertiveAnnouncer = this.createLiveRegion('assertive-announcer', 'assertive');

        // Status updates
        this.statusAnnouncer = this.createLiveRegion('status-announcer', 'polite');
    }

    /**
     * Create a live region element
     */
    createLiveRegion(id, politeness) {
        const existing = document.getElementById(id);
        if (existing) return existing;

        const region = document.createElement('div');
        region.id = id;
        region.className = 'sr-only';
        region.setAttribute('aria-live', politeness);
        region.setAttribute('aria-atomic', 'true');
        region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');

        document.body.appendChild(region);
        return region;
    }

    /**
     * Announce message to screen readers
     */
    announce(message, priority = 'polite') {
        const announcer = priority === 'assertive' ? this.assertiveAnnouncer : this.announcer;

        if (announcer) {
            // Clear previous message first
            announcer.textContent = '';

            // Add new message after brief delay
            setTimeout(() => {
                announcer.textContent = message;
            }, 100);

            // Clear message after it's been announced
            setTimeout(() => {
                announcer.textContent = '';
            }, 3000);
        }
    }

    /**
     * Announce status updates
     */
    announceStatus(message) {
        if (this.statusAnnouncer) {
            this.statusAnnouncer.textContent = message;
        }
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        this.keyboardNavigation = new KeyboardNavigationManager();

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey || e.ctrlKey || e.metaKey) {
                this.handleShortcuts(e);
            }

            // Arrow key navigation in grids
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                this.handleArrowNavigation(e);
            }

            // Escape key handling
            if (e.key === 'Escape') {
                this.handleEscape(e);
            }

            // Enter/Space for custom interactive elements
            if ((e.key === 'Enter' || e.key === ' ') && e.target.hasAttribute('role')) {
                this.handleCustomInteraction(e);
            }
        });
    }

    /**
     * Handle keyboard shortcuts
     */
    handleShortcuts(e) {
        const shortcuts = {
            'Alt+KeyH': () => this.showKeyboardHelp(),
            'Alt+KeyS': () => this.game.showScreen('settings'),
            'Alt+KeyC': () => this.game.showScreen('chambers'),
            'Alt+KeyP': () => this.game.showScreen('progress'),
            'Alt+Digit1': () => this.skipToContent(),
            'Alt+Digit2': () => this.skipToNavigation()
        };

        const key = (e.altKey ? 'Alt+' : '') + (e.ctrlKey ? 'Ctrl+' : '') + e.code;
        const handler = shortcuts[key];

        if (handler) {
            e.preventDefault();
            handler();
        }
    }

    /**
     * Handle arrow key navigation
     */
    handleArrowNavigation(e) {
        const focused = document.activeElement;

        // Chamber grid navigation
        if (focused.closest('.chambers-grid')) {
            this.navigateGrid(e, '.chamber-card');
        }

        // Puzzle options navigation
        if (focused.closest('.multiple-choice')) {
            this.navigateList(e, '.choice-option');
        }

        // Navigation menu
        if (focused.closest('.nav-menu')) {
            this.navigateList(e, '.nav-link');
        }
    }

    /**
     * Navigate grid elements
     */
    navigateGrid(e, selector) {
        const grid = e.target.closest('[role="grid"], .chambers-grid');
        if (!grid) return;

        const items = Array.from(grid.querySelectorAll(selector + ':not([hidden])'));
        const currentIndex = items.indexOf(e.target);

        if (currentIndex === -1) return;

        let newIndex;
        const columns = this.getGridColumns(grid);

        switch (e.key) {
            case 'ArrowRight':
                newIndex = Math.min(currentIndex + 1, items.length - 1);
                break;
            case 'ArrowLeft':
                newIndex = Math.max(currentIndex - 1, 0);
                break;
            case 'ArrowDown':
                newIndex = Math.min(currentIndex + columns, items.length - 1);
                break;
            case 'ArrowUp':
                newIndex = Math.max(currentIndex - columns, 0);
                break;
            default:
                return;
        }

        if (newIndex !== currentIndex) {
            e.preventDefault();
            items[newIndex].focus();
        }
    }

    /**
     * Navigate list elements
     */
    navigateList(e, selector) {
        const list = e.target.closest('[role="menu"], [role="listbox"], .nav-menu, .multiple-choice');
        if (!list) return;

        const items = Array.from(list.querySelectorAll(selector + ':not([hidden])'));
        const currentIndex = items.indexOf(e.target);

        if (currentIndex === -1) return;

        let newIndex;
        const isVertical = ['ArrowUp', 'ArrowDown'].includes(e.key);

        if (isVertical) {
            switch (e.key) {
                case 'ArrowDown':
                    newIndex = (currentIndex + 1) % items.length;
                    break;
                case 'ArrowUp':
                    newIndex = (currentIndex - 1 + items.length) % items.length;
                    break;
                default:
                    return;
            }
        } else {
            switch (e.key) {
                case 'ArrowRight':
                    newIndex = (currentIndex + 1) % items.length;
                    break;
                case 'ArrowLeft':
                    newIndex = (currentIndex - 1 + items.length) % items.length;
                    break;
                default:
                    return;
            }
        }

        e.preventDefault();
        items[newIndex].focus();
    }

    /**
     * Get grid column count
     */
    getGridColumns(grid) {
        const styles = window.getComputedStyle(grid);
        const columns = styles.gridTemplateColumns;

        if (columns && columns !== 'none') {
            return columns.split(' ').length;
        }

        // Fallback: estimate based on width
        const firstItem = grid.querySelector('.chamber-card');
        if (firstItem) {
            const gridWidth = grid.offsetWidth;
            const itemWidth = firstItem.offsetWidth;
            return Math.floor(gridWidth / itemWidth) || 1;
        }

        return 3; // Default assumption
    }

    /**
     * Handle Escape key
     */
    handleEscape(e) {
        // Close modals
        const openModal = document.querySelector('.modal.visible');
        if (openModal) {
            e.preventDefault();
            this.game.closeFeedback();
            return;
        }

        // Close hint panel
        const hintPanel = document.getElementById('hint-panel');
        if (hintPanel && hintPanel.classList.contains('visible')) {
            e.preventDefault();
            hintPanel.classList.remove('visible');
            return;
        }

        // Return to previous screen
        if (this.game.screenManager) {
            e.preventDefault();
            this.game.screenManager.goBack();
        }
    }

    /**
     * Handle custom interactive elements
     */
    handleCustomInteraction(e) {
        const role = e.target.getAttribute('role');

        if (role === 'button' && !e.target.disabled) {
            e.preventDefault();
            e.target.click();
        }

        if (role === 'option') {
            e.preventDefault();
            e.target.click();
        }
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        this.focusTracker = new FocusTracker();

        // Trap focus in modals
        document.addEventListener('focusin', (e) => {
            const modal = document.querySelector('.modal.visible');
            if (modal && !modal.contains(e.target)) {
                const focusableElements = modal.querySelectorAll(
                    'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
                );
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            }
        });

        // Restore focus when modals close
        this.setupModalFocusRestore();
    }

    /**
     * Setup modal focus restoration
     */
    setupModalFocusRestore() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('modal')) {
                        if (!target.classList.contains('visible') && this.focusTracker.lastFocus) {
                            // Modal closed, restore focus
                            setTimeout(() => {
                                if (this.focusTracker.lastFocus && document.contains(this.focusTracker.lastFocus)) {
                                    this.focusTracker.lastFocus.focus();
                                }
                            }, 100);
                        } else if (target.classList.contains('visible')) {
                            // Modal opened, save current focus
                            this.focusTracker.lastFocus = document.activeElement;
                        }
                    }
                }
            });
        });

        observer.observe(document.body, {
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    /**
     * Setup screen reader support
     */
    setupScreenReaderSupport() {
        // Enhance puzzle descriptions
        this.enhancePuzzleDescriptions();

        // Add landmark roles
        this.addLandmarkRoles();

        // Enhance dynamic content updates
        this.setupDynamicContentAnnouncements();

        // Add progress indicators
        this.addProgressIndicators();
    }

    /**
     * Enhance puzzle descriptions for screen readers
     */
    enhancePuzzleDescriptions() {
        // Add detailed descriptions for visual puzzles
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.processPuzzleElements(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Process puzzle elements for accessibility
     */
    processPuzzleElements(element) {
        // Add alt text to visual puzzles
        const puzzleCells = element.querySelectorAll('.puzzle-cell');
        puzzleCells.forEach((cell, index) => {
            if (!cell.hasAttribute('aria-label')) {
                cell.setAttribute('aria-label', `Puzzle cell ${index + 1}: ${cell.textContent || 'empty'}`);
            }
        });

        // Enhance choice options
        const choiceOptions = element.querySelectorAll('.choice-option');
        choiceOptions.forEach((option, index) => {
            if (!option.hasAttribute('aria-label')) {
                const letter = String.fromCharCode(65 + index); // A, B, C, D
                option.setAttribute('aria-label', `Option ${letter}: ${option.textContent.trim()}`);
            }
        });
    }

    /**
     * Add landmark roles
     */
    addLandmarkRoles() {
        // Main navigation
        const nav = document.querySelector('.main-nav');
        if (nav && !nav.hasAttribute('role')) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }

        // Search functionality
        const search = document.getElementById('chamber-search');
        if (search) {
            search.setAttribute('role', 'search');
            search.setAttribute('aria-label', 'Search chambers');
        }

        // Content regions
        const main = document.querySelector('.main-content');
        if (main && !main.hasAttribute('role')) {
            main.setAttribute('role', 'main');
        }
    }

    /**
     * Setup dynamic content announcements
     */
    setupDynamicContentAnnouncements() {
        // Announce screen changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
                    const target = mutation.target;
                    if (target.classList.contains('screen') && target.getAttribute('aria-hidden') === 'false') {
                        const screenName = target.id.replace('-screen', '');
                        this.announceScreenChange(screenName);
                    }
                }
            });
        });

        observer.observe(document.body, {
            subtree: true,
            attributes: true,
            attributeFilter: ['aria-hidden']
        });
    }

    /**
     * Announce screen changes
     */
    announceScreenChange(screenName) {
        const announcements = {
            welcome: 'Welcome screen. Your learning journey starts here.',
            chambers: 'Chambers screen. Choose a logic chamber to practice.',
            puzzle: 'Puzzle screen. Use Tab to navigate between elements.',
            progress: 'Progress screen. Review your learning statistics.',
            achievements: 'Achievements screen. View your accomplishments.',
            settings: 'Settings screen. Customize your experience.'
        };

        const announcement = announcements[screenName] || `${screenName} screen loaded`;
        this.announce(announcement);
    }

    /**
     * Add progress indicators
     */
    addProgressIndicators() {
        // Add progress descriptions to progress bars
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach((bar) => {
            if (!bar.hasAttribute('role')) {
                bar.setAttribute('role', 'progressbar');

                const fill = bar.querySelector('.progress-fill');
                if (fill) {
                    const width = fill.style.width || '0%';
                    const value = parseInt(width.replace('%', ''));
                    bar.setAttribute('aria-valuenow', value);
                    bar.setAttribute('aria-valuemin', '0');
                    bar.setAttribute('aria-valuemax', '100');
                    bar.setAttribute('aria-label', `Progress: ${value} percent complete`);
                }
            }
        });
    }

    /**
     * Setup reduced motion support
     */
    setupReducedMotion() {
        const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        const applyReducedMotion = (shouldReduce) => {
            document.body.classList.toggle('reduce-motion', shouldReduce);

            if (shouldReduce) {
                // Disable animations
                document.documentElement.style.setProperty('--transition-fast', '0ms');
                document.documentElement.style.setProperty('--transition-normal', '0ms');
                document.documentElement.style.setProperty('--transition-slow', '0ms');

                this.announce('Animations disabled for better accessibility');
            }
        };

        // Apply on load
        applyReducedMotion(preferReducedMotion.matches);

        // Listen for changes
        preferReducedMotion.addEventListener('change', (e) => {
            applyReducedMotion(e.matches);
        });
    }

    /**
     * Setup high contrast support
     */
    setupHighContrast() {
        const preferHighContrast = window.matchMedia('(prefers-contrast: high)');

        const applyHighContrast = (shouldUseHighContrast) => {
            document.body.classList.toggle('high-contrast', shouldUseHighContrast);

            if (shouldUseHighContrast) {
                this.announce('High contrast mode enabled');
            }
        };

        // Apply on load
        applyHighContrast(preferHighContrast.matches);

        // Listen for changes
        preferHighContrast.addEventListener('change', (e) => {
            applyHighContrast(e.matches);
        });
    }

    /**
     * Setup font scaling
     */
    setupFontScaling() {
        const fontSizeSelect = document.getElementById('font-size');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', (e) => {
                this.applyFontSize(e.target.value);
            });
        }

        // Support browser zoom
        this.detectZoomLevel();
    }

    /**
     * Apply font size setting
     */
    applyFontSize(size) {
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${size}`);

        const announcements = {
            small: 'Small font size applied',
            medium: 'Medium font size applied',
            large: 'Large font size applied'
        };

        this.announce(announcements[size] || 'Font size changed');
    }

    /**
     * Detect zoom level for responsive adjustments
     */
    detectZoomLevel() {
        const checkZoom = () => {
            const zoomLevel = Math.round((window.outerWidth / window.innerWidth) * 100) / 100;

            if (zoomLevel > 1.5) {
                document.body.classList.add('high-zoom');
                this.optimizeForHighZoom();
            } else {
                document.body.classList.remove('high-zoom');
            }
        };

        window.addEventListener('resize', checkZoom);
        checkZoom(); // Initial check
    }

    /**
     * Optimize interface for high zoom levels
     */
    optimizeForHighZoom() {
        // Simplify layouts at high zoom
        const complexElements = document.querySelectorAll('.chamber-stats, .puzzle-meta');
        complexElements.forEach(el => {
            el.classList.add('simplified-layout');
        });
    }

    /**
     * Add skip links
     */
    addSkipLinks() {
        if (document.querySelector('.skip-links')) return;

        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#nav-menu" class="skip-link">Skip to navigation</a>
            <a href="#settings" class="skip-link">Skip to settings</a>
        `;

        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    /**
     * Enhance form accessibility
     */
    enhanceFormAccessibility() {
        // Add labels and descriptions to form controls
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
                const label = input.closest('label') || document.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    input.setAttribute('aria-labelledby', label.id || this.generateId('label'));
                }
            }

            // Add required field indicators
            if (input.hasAttribute('required')) {
                input.setAttribute('aria-required', 'true');
            }
        });

        // Enhance error messages
        this.setupFormValidation();
    }

    /**
     * Setup form validation announcements
     */
    setupFormValidation() {
        document.addEventListener('invalid', (e) => {
            const input = e.target;
            const message = input.validationMessage;

            if (message) {
                this.announce(`Error in ${input.getAttribute('aria-label') || input.name}: ${message}`, 'assertive');
            }
        });
    }

    /**
     * Setup color blind support
     */
    setupColorBlindSupport() {
        // Add pattern/texture alternatives to color-only information
        const colorElements = document.querySelectorAll('.difficulty-badge, .progress-fill');
        colorElements.forEach(el => {
            if (!el.hasAttribute('aria-label')) {
                this.addColorBlindAlternative(el);
            }
        });
    }

    /**
     * Add color blind alternatives
     */
    addColorBlindAlternative(element) {
        if (element.classList.contains('difficulty-badge')) {
            const difficulty = element.textContent.toLowerCase();
            element.setAttribute('aria-label', `Difficulty: ${difficulty}`);

            // Add visual patterns
            const patterns = {
                easy: '●',
                medium: '●●',
                hard: '●●●',
                expert: '●●●●'
            };

            if (patterns[difficulty]) {
                element.setAttribute('data-pattern', patterns[difficulty]);
            }
        }
    }

    /**
     * Show keyboard help
     */
    showKeyboardHelp() {
        const helpContent = `
            <h2>Keyboard Shortcuts</h2>
            <ul>
                <li><kbd>Alt + H</kbd> - Show this help</li>
                <li><kbd>Alt + C</kbd> - Go to Chambers</li>
                <li><kbd>Alt + P</kbd> - Go to Progress</li>
                <li><kbd>Alt + S</kbd> - Go to Settings</li>
                <li><kbd>Escape</kbd> - Go back or close</li>
                <li><kbd>Tab</kbd> - Navigate forward</li>
                <li><kbd>Shift + Tab</kbd> - Navigate backward</li>
                <li><kbd>Arrow Keys</kbd> - Navigate grids and lists</li>
                <li><kbd>Enter/Space</kbd> - Activate buttons</li>
            </ul>
        `;

        // Show in modal or temporary overlay
        this.showAccessibilityModal('Keyboard Help', helpContent);
    }

    /**
     * Show accessibility modal
     */
    showAccessibilityModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal accessibility-modal visible';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'accessibility-modal-title');

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="accessibility-modal-title">${title}</h2>
                    <button class="close-modal" aria-label="Close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Focus the close button
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.focus();

        // Handle closing
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
            }
        });
    }

    /**
     * Utility functions
     */
    skipToContent() {
        const main = document.querySelector('#main-content, [role="main"]');
        if (main) {
            main.focus();
            main.scrollIntoView();
        }
    }

    skipToNavigation() {
        const nav = document.querySelector('#nav-menu, [role="navigation"]');
        if (nav) {
            const firstLink = nav.querySelector('a, button');
            if (firstLink) {
                firstLink.focus();
            }
        }
    }

    generateId(prefix) {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get accessibility status
     */
    getAccessibilityStatus() {
        return {
            hasScreenReader: !!navigator.userAgent.match(/NVDA|JAWS|ORCA|VoiceOver/i),
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
            fontSize: document.body.className.match(/font-(small|medium|large)/)?.[1] || 'medium',
            colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        };
    }
}

/**
 * Focus Tracker Helper Class
 */
class FocusTracker {
    constructor() {
        this.lastFocus = null;
        this.focusHistory = [];

        document.addEventListener('focusin', (e) => {
            this.lastFocus = e.target;
            this.focusHistory.push({
                element: e.target,
                timestamp: Date.now()
            });

            // Keep only last 10 focus events
            if (this.focusHistory.length > 10) {
                this.focusHistory.shift();
            }
        });
    }
}

/**
 * Keyboard Navigation Manager
 */
class KeyboardNavigationManager {
    constructor() {
        this.setupCustomNavigation();
    }

    setupCustomNavigation() {
        // Add keyboard navigation for custom components
        document.addEventListener('keydown', (e) => {
            if (e.target.hasAttribute('data-keyboard-nav')) {
                this.handleCustomNavigation(e);
            }
        });
    }

    handleCustomNavigation(e) {
        // Custom keyboard navigation logic
        const element = e.target;
        const navType = element.getAttribute('data-keyboard-nav');

        switch (navType) {
            case 'chamber-card':
                this.handleChamberCardNavigation(e);
                break;
            case 'puzzle-grid':
                this.handlePuzzleGridNavigation(e);
                break;
        }
    }

    handleChamberCardNavigation(e) {
        // Handle Enter/Space on chamber cards
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.target.click();
        }
    }

    handlePuzzleGridNavigation(e) {
        // Handle arrow keys in puzzle grids
        // Implementation would depend on specific puzzle types
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AccessibilityManager = AccessibilityManager;
}/**
 * Analytics and Performance Tracking
 * Tracks user interactions, learning progress, and system performance
 */

class AnalyticsManager {
    constructor(game) {
        this.game = game;
        this.sessionId = this.generateSessionId();
        this.events = [];
        this.performanceData = {};
        this.learningMetrics = {};

        this.init();
    }

    /**
     * Initialize analytics system
     */
    init() {
        this.startSession();
        this.setupPerformanceTracking();
        this.setupLearningTracking();
        this.setupErrorTracking();

        // Send analytics every 30 seconds
        setInterval(() => this.flushEvents(), 30000);

        // Send analytics before page unload
        window.addEventListener('beforeunload', () => this.flushEvents());
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Start analytics session
     */
    startSession() {
        this.logEvent('session_start', {
            sessionId: this.sessionId,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            language: navigator.language
        });
    }

    /**
     * Log analytics event
     */
    logEvent(eventName, data = {}) {
        const event = {
            id: this.generateEventId(),
            event: eventName,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            url: window.location.href,
            ...data
        };

        this.events.push(event);

        // Also log to console for debugging
        console.log('Analytics:', event);

        // Store in localStorage for offline capability
        this.storeEventLocally(event);

        // Process event for learning metrics
        this.processLearningEvent(event);
    }

    /**
     * Generate unique event ID
     */
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Store event locally for offline support
     */
    storeEventLocally(event) {
        try {
            const storedEvents = JSON.parse(localStorage.getItem('mindforge_analytics') || '[]');
            storedEvents.push(event);

            // Keep only last 1000 events
            if (storedEvents.length > 1000) {
                storedEvents.splice(0, storedEvents.length - 1000);
            }

            localStorage.setItem('mindforge_analytics', JSON.stringify(storedEvents));
        } catch (error) {
            console.warn('Failed to store analytics event locally:', error);
        }
    }

    /**
     * Setup performance tracking
     */
    setupPerformanceTracking() {
        // Track page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.logEvent('performance_load', {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        firstPaint: this.getFirstPaint(),
                        memoryUsage: this.getMemoryUsage()
                    });
                }
            }, 1000);
        });

        // Track performance periodically
        setInterval(() => {
            this.trackPerformanceMetrics();
        }, 60000); // Every minute

        // Track interaction delays
        this.setupInteractionTracking();
    }

    /**
     * Get first paint timing
     */
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    /**
     * Get memory usage if available
     */
    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    /**
     * Track performance metrics
     */
    trackPerformanceMetrics() {
        const metrics = {
            memoryUsage: this.getMemoryUsage(),
            connectionType: navigator.connection ? navigator.connection.effectiveType : null,
            fps: this.calculateFPS(),
            timestamp: Date.now()
        };

        this.performanceData[Date.now()] = metrics;

        // Keep only last hour of performance data
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        Object.keys(this.performanceData).forEach(timestamp => {
            if (parseInt(timestamp) < oneHourAgo) {
                delete this.performanceData[timestamp];
            }
        });
    }

    /**
     * Calculate approximate FPS
     */
    calculateFPS() {
        return new Promise((resolve) => {
            let frames = 0;
            const startTime = performance.now();

            function countFrames() {
                frames++;
                if (frames < 60) {
                    requestAnimationFrame(countFrames);
                } else {
                    const endTime = performance.now();
                    const fps = Math.round((frames * 1000) / (endTime - startTime));
                    resolve(fps);
                }
            }

            requestAnimationFrame(countFrames);
        });
    }

    /**
     * Setup interaction tracking
     */
    setupInteractionTracking() {
        let interactionStart = null;

        // Track button clicks
        document.addEventListener('click', (e) => {
            interactionStart = performance.now();

            if (e.target.matches('button, .btn, .chamber-card')) {
                this.logEvent('interaction_click', {
                    element: e.target.tagName.toLowerCase(),
                    className: e.target.className,
                    id: e.target.id,
                    text: e.target.textContent?.slice(0, 50)
                });
            }
        });

        // Track interaction delays
        const observer = new MutationObserver(() => {
            if (interactionStart) {
                const delay = performance.now() - interactionStart;
                if (delay > 100) { // Only track significant delays
                    this.logEvent('interaction_delay', {
                        delay: Math.round(delay),
                        timestamp: Date.now()
                    });
                }
                interactionStart = null;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    /**
     * Setup learning analytics tracking
     */
    setupLearningTracking() {
        this.learningMetrics = {
            puzzleAttempts: 0,
            correctAnswers: 0,
            hintsUsed: 0,
            timeSpent: {},
            difficultyProgression: [],
            learningPatterns: {}
        };
    }

    /**
     * Process learning-related events
     */
    processLearningEvent(event) {
        switch (event.event) {
            case 'puzzle_started':
                this.trackPuzzleStart(event);
                break;
            case 'puzzle_completed':
                this.trackPuzzleCompletion(event);
                break;
            case 'puzzle_attempt_failed':
                this.trackPuzzleAttempt(event);
                break;
            case 'hint_used':
                this.trackHintUsage(event);
                break;
            case 'level_up':
                this.trackLevelProgression(event);
                break;
        }
    }

    /**
     * Track puzzle start
     */
    trackPuzzleStart(event) {
        this.learningMetrics.puzzleAttempts++;

        const chamberId = event.chamber;
        const difficulty = event.difficulty;

        // Track difficulty progression
        this.learningMetrics.difficultyProgression.push({
            timestamp: event.timestamp,
            chamber: chamberId,
            difficulty: difficulty
        });
    }

    /**
     * Track puzzle completion
     */
    trackPuzzleCompletion(event) {
        this.learningMetrics.correctAnswers++;

        const timeSpent = event.timeSpent;
        const attempts = event.attempts;
        const hintsUsed = event.hintsUsed;

        // Analyze learning patterns
        this.analyzeLearningPattern(event.chamber, {
            timeSpent,
            attempts,
            hintsUsed,
            difficulty: event.difficulty
        });

        // Calculate performance metrics
        this.calculatePerformanceMetrics(event);
    }

    /**
     * Track puzzle attempt
     */
    trackPuzzleAttempt(event) {
        // Track failure patterns for adaptive difficulty
        this.trackFailurePattern(event.chamber, event.puzzle, event.attempt);
    }

    /**
     * Track hint usage
     */
    trackHintUsage(event) {
        this.learningMetrics.hintsUsed++;

        // Analyze hint effectiveness
        this.analyzeHintEffectiveness(event.chamber, event.hintLevel);
    }

    /**
     * Track level progression
     */
    trackLevelProgression(event) {
        this.logEvent('learning_milestone', {
            type: 'level_up',
            newLevel: event.newLevel,
            timeToReach: this.calculateTimeToLevel(event.newLevel),
            chambersCompleted: this.countCompletedChambers()
        });
    }

    /**
     * Analyze learning patterns
     */
    analyzeLearningPattern(chamberId, metrics) {
        if (!this.learningMetrics.learningPatterns[chamberId]) {
            this.learningMetrics.learningPatterns[chamberId] = {
                averageTime: [],
                averageAttempts: [],
                hintUsage: [],
                accuracyTrend: []
            };
        }

        const pattern = this.learningMetrics.learningPatterns[chamberId];
        pattern.averageTime.push(metrics.timeSpent);
        pattern.averageAttempts.push(metrics.attempts);
        pattern.hintUsage.push(metrics.hintsUsed);

        // Calculate learning velocity
        this.calculateLearningVelocity(chamberId, pattern);
    }

    /**
     * Calculate performance metrics
     */
    calculatePerformanceMetrics(event) {
        const accuracy = this.learningMetrics.correctAnswers / this.learningMetrics.puzzleAttempts;
        const avgHintsPerPuzzle = this.learningMetrics.hintsUsed / this.learningMetrics.correctAnswers;

        this.logEvent('learning_metrics', {
            accuracy: Math.round(accuracy * 100),
            avgHintsPerPuzzle: Math.round(avgHintsPerPuzzle * 10) / 10,
            totalTimeSpent: this.calculateTotalTimeSpent(),
            preferredDifficulty: this.calculatePreferredDifficulty()
        });
    }

    /**
     * Track failure patterns
     */
    trackFailurePattern(chamber, puzzle, attempt) {
        // This data can be used for adaptive difficulty adjustment
        this.logEvent('failure_pattern', {
            chamber,
            puzzle,
            attempt,
            pattern: this.identifyFailurePattern(chamber, puzzle)
        });
    }

    /**
     * Analyze hint effectiveness
     */
    analyzeHintEffectiveness(chamber, hintLevel) {
        // Track if hints lead to successful completions
        // This can help optimize hint content
    }

    /**
     * Calculate learning velocity
     */
    calculateLearningVelocity(chamberId, pattern) {
        if (pattern.averageTime.length < 2) return;

        const recent = pattern.averageTime.slice(-5);
        const older = pattern.averageTime.slice(-10, -5);

        if (older.length === 0) return;

        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

        const improvement = (olderAvg - recentAvg) / olderAvg;

        this.logEvent('learning_velocity', {
            chamber: chamberId,
            improvement: Math.round(improvement * 100),
            trend: improvement > 0 ? 'improving' : 'struggling'
        });
    }

    /**
     * Setup error tracking
     */
    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.logEvent('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logEvent('promise_rejection', {
                reason: event.reason?.toString(),
                stack: event.reason?.stack
            });
        });
    }

    /**
     * Track custom events
     */
    trackCustomEvent(eventName, properties = {}) {
        this.logEvent(`custom_${eventName}`, properties);
    }

    /**
     * Track timing events
     */
    startTiming(name) {
        this.timings = this.timings || {};
        this.timings[name] = performance.now();
    }

    endTiming(name, properties = {}) {
        if (!this.timings || !this.timings[name]) return;

        const duration = performance.now() - this.timings[name];
        delete this.timings[name];

        this.logEvent('timing', {
            name,
            duration: Math.round(duration),
            ...properties
        });
    }

    /**
     * Flush events to storage/server
     */
    flushEvents() {
        if (this.events.length === 0) return;

        // In a real implementation, this would send to analytics server
        console.log(`Flushing ${this.events.length} analytics events`);

        // For now, just clear the events array
        this.events = [];
    }

    /**
     * Get analytics summary
     */
    getAnalyticsSummary() {
        return {
            sessionId: this.sessionId,
            eventsCount: this.events.length,
            learningMetrics: this.learningMetrics,
            performanceData: Object.keys(this.performanceData).length,
            lastActivity: Math.max(...this.events.map(e => e.timestamp))
        };
    }

    /**
     * Calculate helper metrics
     */
    calculateTotalTimeSpent() {
        return Object.values(this.learningMetrics.timeSpent)
            .reduce((total, time) => total + time, 0);
    }

    calculateTimeToLevel(level) {
        const firstSession = this.events.find(e => e.event === 'session_start');
        if (!firstSession) return null;

        return Date.now() - firstSession.timestamp;
    }

    countCompletedChambers() {
        return Array.from(this.game.gameState.chambers.values())
            .filter(chamber => chamber.progress.completed === chamber.progress.total).length;
    }

    calculatePreferredDifficulty() {
        const difficulties = this.learningMetrics.difficultyProgression
            .slice(-10)
            .map(p => p.difficulty);

        // Return most common difficulty in recent puzzles
        const counts = {};
        difficulties.forEach(d => counts[d] = (counts[d] || 0) + 1);

        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'easy');
    }

    identifyFailurePattern(chamber, puzzle) {
        // This would implement pattern recognition for failure modes
        return 'needs_more_data';
    }

    /**
     * Export analytics data
     */
    exportAnalytics() {
        return {
            sessionId: this.sessionId,
            events: this.events,
            learningMetrics: this.learningMetrics,
            performanceData: this.performanceData,
            summary: this.getAnalyticsSummary()
        };
    }

    /**
     * Privacy controls
     */
    optOut() {
        localStorage.setItem('mindforge_analytics_opt_out', 'true');
        this.events = [];
        console.log('Analytics opt-out successful');
    }

    optIn() {
        localStorage.removeItem('mindforge_analytics_opt_out');
        this.init();
        console.log('Analytics opt-in successful');
    }

    isOptedOut() {
        return localStorage.getItem('mindforge_analytics_opt_out') === 'true';
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.AnalyticsManager = AnalyticsManager;
}