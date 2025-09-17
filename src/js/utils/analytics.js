/**
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