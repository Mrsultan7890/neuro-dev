// Progress Tracker Initialization Fix
(function() {
    // Ensure progress tracker is properly initialized
    function ensureProgressTracker() {
        if (!window.progressTracker || !window.progressTracker.progressData) {
            console.log('Initializing progress tracker...');
            
            // Create minimal progress tracker if not exists
            if (!window.progressTracker) {
                window.progressTracker = {
                    progressData: {
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
                    },
                    trackProgress: function(action, type, data = {}) {
                        if (!this.progressData) return;
                        
                        const now = Date.now();
                        
                        switch(type) {
                            case 'app-opened':
                                this.progressData.appsOpened[action] = (this.progressData.appsOpened[action] || 0) + 1;
                                console.log(`App opened: ${action} (${this.progressData.appsOpened[action]} times)`);
                                break;
                            case 'command-used':
                                this.progressData.commandsUsed[action] = (this.progressData.commandsUsed[action] || 0) + 1;
                                break;
                            case 'challenge-completed':
                                this.progressData.challengesCompleted[action] = now;
                                break;
                            case 'course-completed':
                                this.progressData.coursesCompleted[action] = now;
                                break;
                        }
                        
                        // Save to localStorage
                        try {
                            localStorage.setItem('neuro-dev-progress', JSON.stringify(this.progressData));
                        } catch (e) {
                            console.warn('Could not save progress:', e);
                        }
                    }
                };
            }
            
            // Ensure progressData exists
            if (!window.progressTracker.progressData) {
                window.progressTracker.progressData = {
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
            }
            
            console.log('Progress tracker initialized successfully');
        }
    }
    
    // Initialize immediately
    ensureProgressTracker();
    
    // Also ensure it's ready when DOM loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureProgressTracker);
    }
    
    // Backup check after a short delay
    setTimeout(ensureProgressTracker, 500);
})();