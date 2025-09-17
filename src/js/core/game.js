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
}