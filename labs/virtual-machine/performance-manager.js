// Performance Manager - File Loading Speed & Memory Optimization
class PerformanceManager {
    constructor() {
        this.loadedApps = new Map();
        this.appCache = new Map();
        this.memoryUsage = new Map();
        this.loadTimes = new Map();
        this.preloadQueue = [];
        this.maxCacheSize = 10; // Maximum apps to keep in cache
        this.init();
    }

    init() {
        this.preloadCriticalApps();
        this.setupMemoryMonitoring();
        this.optimizeAnimations();
    }

    // Preload critical apps for faster switching
    preloadCriticalApps() {
        const criticalApps = ['terminal', 'files', 'browser'];
        criticalApps.forEach(app => {
            this.preloadApp(app);
        });
    }

    async preloadApp(appName) {
        if (this.appCache.has(appName)) return;

        const startTime = performance.now();
        try {
            const appElement = document.getElementById(`${appName}-app`);
            if (appElement) {
                // Cache DOM content
                this.appCache.set(appName, {
                    html: appElement.innerHTML,
                    timestamp: Date.now(),
                    size: appElement.innerHTML.length
                });
                
                const loadTime = performance.now() - startTime;
                this.loadTimes.set(appName, loadTime);
                console.log(`Preloaded ${appName} in ${loadTime.toFixed(2)}ms`);
            }
        } catch (error) {
            console.error(`Failed to preload ${appName}:`, error);
        }
    }

    // Fast app switching with smooth animations
    async switchAppFast(appName) {
        const startTime = performance.now();
        
        try {
            // Hide current app with animation
            await this.hideCurrentApp();
            
            // Load app if not cached
            if (!this.loadedApps.has(appName)) {
                await this.loadAppFast(appName);
            }
            
            // Show new app with animation
            await this.showApp(appName);
            
            const totalTime = performance.now() - startTime;
            console.log(`App switch completed in ${totalTime.toFixed(2)}ms`);
            
            // Update memory usage
            this.updateMemoryUsage(appName);
            
        } catch (error) {
            console.error(`Fast app switch failed for ${appName}:`, error);
        }
    }

    async hideCurrentApp() {
        const activeApp = document.querySelector('.app-window.active');
        if (!activeApp) return;

        return new Promise(resolve => {
            activeApp.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
            activeApp.style.opacity = '0';
            activeApp.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                activeApp.classList.remove('active');
                activeApp.style.display = 'none';
                resolve();
            }, 150);
        });
    }

    async showApp(appName) {
        const appElement = document.getElementById(`${appName}-app`);
        if (!appElement) return;

        return new Promise(resolve => {
            appElement.style.display = 'block';
            appElement.style.opacity = '0';
            appElement.style.transform = 'scale(0.95)';
            appElement.classList.add('active');
            
            requestAnimationFrame(() => {
                appElement.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                appElement.style.opacity = '1';
                appElement.style.transform = 'scale(1)';
                
                setTimeout(resolve, 200);
            });
        });
    }

    async loadAppFast(appName) {
        if (this.appCache.has(appName)) {
            const cached = this.appCache.get(appName);
            const appElement = document.getElementById(`${appName}-app`);
            
            if (appElement && !appElement.innerHTML.trim()) {
                appElement.innerHTML = cached.html;
            }
        }
        
        this.loadedApps.set(appName, {
            timestamp: Date.now(),
            initialized: true
        });
    }

    // Memory optimization
    setupMemoryMonitoring() {
        setInterval(() => {
            this.cleanupMemory();
            this.optimizeCache();
        }, 30000); // Every 30 seconds
    }

    cleanupMemory() {
        const heavyApps = ['malware-analysis', 'network-simulator', 'ctf-challenges'];
        
        heavyApps.forEach(appName => {
            const appElement = document.getElementById(`${appName}-app`);
            if (appElement && !appElement.classList.contains('active')) {
                // Clear heavy data structures
                if (window[`${appName}Data`]) {
                    window[`${appName}Data`] = null;
                }
                
                // Clear event listeners for inactive apps
                this.clearAppEventListeners(appName);
            }
        });

        // Force garbage collection hint
        if (window.gc) {
            window.gc();
        }
    }

    clearAppEventListeners(appName) {
        const appElement = document.getElementById(`${appName}-app`);
        if (appElement) {
            const buttons = appElement.querySelectorAll('button, .btn');
            buttons.forEach(btn => {
                btn.replaceWith(btn.cloneNode(true));
            });
        }
    }

    optimizeCache() {
        if (this.appCache.size > this.maxCacheSize) {
            // Remove oldest cached apps
            const entries = Array.from(this.appCache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const toRemove = entries.slice(0, entries.length - this.maxCacheSize);
            toRemove.forEach(([appName]) => {
                this.appCache.delete(appName);
                console.log(`Removed ${appName} from cache`);
            });
        }
    }

    updateMemoryUsage(appName) {
        const appElement = document.getElementById(`${appName}-app`);
        if (appElement) {
            const size = appElement.innerHTML.length;
            this.memoryUsage.set(appName, {
                domSize: size,
                timestamp: Date.now()
            });
        }
    }

    // Animation optimization
    optimizeAnimations() {
        // Use CSS transforms for better performance
        const style = document.createElement('style');
        style.textContent = `
            .app-window {
                will-change: transform, opacity;
                backface-visibility: hidden;
                transform: translateZ(0);
            }
            
            .app-window.optimized {
                transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                           opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .taskbar .app-icon {
                transition: transform 0.1s ease;
            }
            
            .taskbar .app-icon:hover {
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);

        // Add optimized class to all app windows
        document.querySelectorAll('.app-window').forEach(window => {
            window.classList.add('optimized');
        });
    }

    // Performance metrics
    getPerformanceStats() {
        return {
            cachedApps: this.appCache.size,
            loadedApps: this.loadedApps.size,
            averageLoadTime: this.getAverageLoadTime(),
            memoryUsage: this.getTotalMemoryUsage(),
            cacheHitRate: this.getCacheHitRate()
        };
    }

    getAverageLoadTime() {
        const times = Array.from(this.loadTimes.values());
        return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    }

    getTotalMemoryUsage() {
        let total = 0;
        this.memoryUsage.forEach(usage => {
            total += usage.domSize;
        });
        return total;
    }

    getCacheHitRate() {
        const totalRequests = this.loadedApps.size;
        const cacheHits = this.appCache.size;
        return totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;
    }
}

// Progress Tracking System
class ProgressTracker {
    constructor() {
        this.progressData = this.loadProgress();
        this.sessionStart = Date.now();
        this.init();
    }

    init() {
        this.updateProgressDisplay();
        this.setupAutoSave();
        this.trackSessionTime();
    }

    loadProgress() {
        const saved = localStorage.getItem('neuro-dev-progress');
        const defaultData = {
            appsOpened: {},
            commandsUsed: {},
            challengesCompleted: {},
            coursesCompleted: {},
            totalTime: 0,
            sessionTime: 0,
            lastActive: Date.now(),
            level: 1,
            xp: 0,
            streak: 0,
            achievements: [],
            stats: {
                totalSessions: 0,
                averageSessionTime: 0,
                favoriteApp: null,
                mostUsedCommand: null
            }
        };
        
        if (saved) {
            const parsed = JSON.parse(saved);
            // Ensure all required properties exist
            return Object.assign(defaultData, parsed);
        }
        
        return defaultData;
    }

    saveProgress() {
        this.progressData.lastActive = Date.now();
        this.progressData.sessionTime = Date.now() - this.sessionStart;
        localStorage.setItem('neuro-dev-progress', JSON.stringify(this.progressData));
    }

    setupAutoSave() {
        setInterval(() => {
            this.saveProgress();
        }, 10000); // Save every 10 seconds
    }

    trackSessionTime() {
        setInterval(() => {
            this.progressData.totalTime += 1000; // Add 1 second
            this.updateTimeDisplay();
        }, 1000);
    }

    // Track different types of progress
    trackProgress(action, type, data = {}) {
        // Ensure progressData is properly initialized
        if (!this.progressData) {
            this.progressData = this.loadProgress();
        }
        
        // Ensure required properties exist
        if (!this.progressData.appsOpened) this.progressData.appsOpened = {};
        if (!this.progressData.commandsUsed) this.progressData.commandsUsed = {};
        if (!this.progressData.challengesCompleted) this.progressData.challengesCompleted = {};
        if (!this.progressData.coursesCompleted) this.progressData.coursesCompleted = {};
        
        const now = Date.now();
        
        switch(type) {
            case 'app-opened':
                this.progressData.appsOpened[action] = (this.progressData.appsOpened[action] || 0) + 1;
                this.addXP(5);
                this.updateFavoriteApp(action);
                break;
                
            case 'command-used':
                this.progressData.commandsUsed[action] = (this.progressData.commandsUsed[action] || 0) + 1;
                this.addXP(2);
                this.updateMostUsedCommand(action);
                break;
                
            case 'challenge-completed':
                this.progressData.challengesCompleted[action] = now;
                this.addXP(50);
                this.checkAchievements();
                break;
                
            case 'course-completed':
                this.progressData.coursesCompleted[action] = now;
                this.addXP(100);
                this.updateStreak();
                break;
        }
        
        this.saveProgress();
        this.updateProgressDisplay();
    }

    addXP(amount) {
        this.progressData.xp += amount;
        const newLevel = Math.floor(this.progressData.xp / 100) + 1;
        
        if (newLevel > this.progressData.level) {
            this.progressData.level = newLevel;
            this.showLevelUp(newLevel);
            this.checkLevelAchievements(newLevel);
        }
    }

    showLevelUp(level) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <i class="fas fa-trophy"></i>
                <h3>Level Up!</h3>
                <p>Aap Level ${level} pe pahunch gaye!</p>
                <div class="level-rewards">
                    <span>+${level * 10} Bonus XP</span>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: levelUpAnimation 0.5s ease;
            text-align: center;
        `;
        
        document.body.appendChild(notification);
        
        // Add bonus XP
        this.progressData.xp += level * 10;
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateProgressDisplay() {
        // Update progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const currentLevelXP = this.progressData.xp % 100;
            progressBar.style.width = currentLevelXP + '%';
        }
        
        // Update level display
        const levelDisplay = document.getElementById('level-display');
        if (levelDisplay) {
            levelDisplay.textContent = `Level ${this.progressData.level}`;
        }
        
        // Update XP display
        const xpDisplay = document.getElementById('xp-display');
        if (xpDisplay) {
            const currentXP = this.progressData.xp % 100;
            xpDisplay.textContent = `${currentXP}/100 XP`;
        }
    }

    updateTimeDisplay() {
        const timeDisplay = document.getElementById('session-time');
        if (timeDisplay) {
            const sessionTime = Date.now() - this.sessionStart;
            const minutes = Math.floor(sessionTime / 60000);
            const seconds = Math.floor((sessionTime % 60000) / 1000);
            timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    updateFavoriteApp(appName) {
        const count = this.progressData.appsOpened[appName] || 0;
        const currentFavorite = this.progressData.stats.favoriteApp;
        const currentCount = this.progressData.appsOpened[currentFavorite] || 0;
        
        if (count > currentCount) {
            this.progressData.stats.favoriteApp = appName;
        }
    }

    updateMostUsedCommand(command) {
        const count = this.progressData.commandsUsed[command] || 0;
        const currentMost = this.progressData.stats.mostUsedCommand;
        const currentCount = this.progressData.commandsUsed[currentMost] || 0;
        
        if (count > currentCount) {
            this.progressData.stats.mostUsedCommand = command;
        }
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastActive = new Date(this.progressData.lastActive).toDateString();
        
        if (today === lastActive) {
            // Same day, no change
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActive === yesterday.toDateString()) {
            this.progressData.streak += 1;
        } else {
            this.progressData.streak = 1;
        }
    }

    checkAchievements() {
        const achievements = [
            {
                id: 'first-challenge',
                name: 'First Challenge',
                description: 'Complete your first CTF challenge',
                condition: () => Object.keys(this.progressData.challengesCompleted).length >= 1
            },
            {
                id: 'command-master',
                name: 'Command Master',
                description: 'Use 50 different commands',
                condition: () => Object.keys(this.progressData.commandsUsed).length >= 50
            },
            {
                id: 'app-explorer',
                name: 'App Explorer',
                description: 'Open all available applications',
                condition: () => Object.keys(this.progressData.appsOpened).length >= 15
            }
        ];

        achievements.forEach(achievement => {
            if (!this.progressData.achievements.includes(achievement.id) && achievement.condition()) {
                this.progressData.achievements.push(achievement.id);
                this.showAchievement(achievement);
            }
        });
    }

    showAchievement(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <i class="fas fa-medal"></i>
                <h3>Achievement Unlocked!</h3>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    getProgressStats() {
        return {
            level: this.progressData.level,
            xp: this.progressData.xp,
            totalTime: this.progressData.totalTime,
            appsUsed: Object.keys(this.progressData.appsOpened).length,
            commandsUsed: Object.values(this.progressData.commandsUsed).reduce((a, b) => a + b, 0),
            challengesCompleted: Object.keys(this.progressData.challengesCompleted).length,
            streak: this.progressData.streak,
            achievements: this.progressData.achievements.length,
            favoriteApp: this.progressData.stats.favoriteApp,
            mostUsedCommand: this.progressData.stats.mostUsedCommand
        };
    }
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes levelUpAnimation {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes slideInRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    .level-up-notification, .achievement-notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .level-up-content i, .achievement-content i {
        font-size: 2em;
        margin-bottom: 10px;
    }
    
    .level-rewards {
        margin-top: 10px;
        padding: 5px 10px;
        background: rgba(255,255,255,0.2);
        border-radius: 5px;
        font-size: 0.9em;
    }
`;
document.head.appendChild(animationStyles);

// Global toggleFullscreen function
window.toggleFullscreen = function() {
    const vmContainer = document.querySelector('.vm-container');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    if (!vmContainer || !fullscreenBtn) return;
    
    const icon = fullscreenBtn.querySelector('i');
    
    try {
        if (document.fullscreenElement || vmContainer.classList.contains('fullscreen')) {
            vmContainer.classList.remove('fullscreen');
            if (icon) icon.className = 'fas fa-expand';
            if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        } else {
            vmContainer.classList.add('fullscreen');
            if (icon) icon.className = 'fas fa-compress';
            if (vmContainer.requestFullscreen) {
                vmContainer.requestFullscreen().catch(() => {});
            }
        }
    } catch (error) {
        console.error('Fullscreen error:', error);
    }
};

// Initialize systems
window.performanceManager = new PerformanceManager();
window.progressTracker = new ProgressTracker();

// Export for use in other files
window.PerformanceManager = PerformanceManager;
window.ProgressTracker = ProgressTracker;