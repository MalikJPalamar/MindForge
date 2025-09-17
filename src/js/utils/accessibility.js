/**
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
}