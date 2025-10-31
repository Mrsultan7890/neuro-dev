// User Authentication and Progress System
class UserSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.leaderboard = this.loadLeaderboard();
        this.achievements = this.initAchievements();
        this.init();
    }

    init() {
        this.checkAutoLogin();
        this.setupEventListeners();
        this.createUserInterface();
    }

    initAchievements() {
        return {
            'first-flag': {
                name: 'First Blood',
                description: 'Submit your first flag',
                icon: '🩸',
                points: 10,
                condition: (user) => user.flagsSubmitted >= 1
            },
            'termux-master': {
                name: 'Termux Master',
                description: 'Complete all Termux challenges',
                icon: '📱',
                points: 100,
                condition: (user) => this.isLabCompleted(user, 'termux-basics') && this.isLabCompleted(user, 'termux-advanced')
            },
            'web-hacker': {
                name: 'Web Application Hacker',
                description: 'Complete all web security challenges',
                icon: '🌐',
                points: 150,
                condition: (user) => this.isLabCompleted(user, 'web-security')
            },
            'ai-security-expert': {
                name: 'AI Security Expert',
                description: 'Complete all AI hacking challenges',
                icon: '🤖',
                points: 200,
                condition: (user) => this.isLabCompleted(user, 'ai-hacking')
            },
            'speed-demon': {
                name: 'Speed Demon',
                description: 'Complete 5 challenges in under 10 minutes',
                icon: '⚡',
                points: 75,
                condition: (user) => user.fastCompletions >= 5
            },
            'persistent': {
                name: 'Persistent Hacker',
                description: 'Login for 7 consecutive days',
                icon: '🔥',
                points: 50,
                condition: (user) => user.loginStreak >= 7
            },
            'elite-hacker': {
                name: 'Elite Hacker',
                description: 'Reach 1000 total points',
                icon: '👑',
                points: 0,
                condition: (user) => user.totalPoints >= 1000
            }
        };
    }

    setupEventListeners() {
        // Login form
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'login-form') {
                e.preventDefault();
                this.handleLogin(e.target);
            } else if (e.target.id === 'register-form') {
                e.preventDefault();
                this.handleRegister(e.target);
            }
        });

        // Logout button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn') {
                this.logout();
            } else if (e.target.id === 'show-leaderboard') {
                this.showLeaderboard();
            } else if (e.target.id === 'show-achievements') {
                this.showAchievements();
            }
        });
    }

    createUserInterface() {
        // Create user panel
        const userPanel = document.createElement('div');
        userPanel.id = 'user-panel';
        userPanel.className = 'user-panel';
        
        if (this.currentUser) {
            userPanel.innerHTML = this.createLoggedInInterface();
        } else {
            userPanel.innerHTML = this.createLoginInterface();
        }
        
        document.body.appendChild(userPanel);
    }

    createLoginInterface() {
        return `
            <div class="auth-container">
                <div class="auth-header">
                    <h3><i class="fas fa-user-shield"></i> Neuro-Dev Account</h3>
                </div>
                
                <div class="auth-tabs">
                    <button class="tab-btn active" onclick="showAuthTab('login')">Login</button>
                    <button class="tab-btn" onclick="showAuthTab('register')">Register</button>
                </div>
                
                <div class="auth-content">
                    <div id="login-tab" class="auth-tab active">
                        <form id="login-form">
                            <div class="form-group">
                                <label>Username:</label>
                                <input type="text" name="username" required>
                            </div>
                            <div class="form-group">
                                <label>Password:</label>
                                <input type="password" name="password" required>
                            </div>
                            <button type="submit">Login</button>
                        </form>
                        <p class="auth-note">Demo: username: <code>demo</code>, password: <code>demo123</code></p>
                    </div>
                    
                    <div id="register-tab" class="auth-tab">
                        <form id="register-form">
                            <div class="form-group">
                                <label>Username:</label>
                                <input type="text" name="username" required minlength="3">
                            </div>
                            <div class="form-group">
                                <label>Email:</label>
                                <input type="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label>Password:</label>
                                <input type="password" name="password" required minlength="6">
                            </div>
                            <button type="submit">Register</button>
                        </form>
                    </div>
                </div>
                
                <div class="guest-access">
                    <button onclick="continueAsGuest()" class="guest-btn">
                        <i class="fas fa-user"></i> Continue as Guest
                    </button>
                    <small>Limited features, no progress saving</small>
                </div>
            </div>
        `;
    }

    createLoggedInInterface() {
        const user = this.currentUser;
        return `
            <div class="user-info">
                <div class="user-header">
                    <div class="user-avatar">
                        <i class="fas fa-user-ninja"></i>
                    </div>
                    <div class="user-details">
                        <h4>${user.username}</h4>
                        <div class="user-rank">${this.getUserRank(user)}</div>
                    </div>
                </div>
                
                <div class="user-stats">
                    <div class="stat-item">
                        <div class="stat-value">${user.totalPoints}</div>
                        <div class="stat-label">Points</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${user.flagsSubmitted}</div>
                        <div class="stat-label">Flags</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${user.challengesCompleted}</div>
                        <div class="stat-label">Challenges</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${user.loginStreak}</div>
                        <div class="stat-label">Streak</div>
                    </div>
                </div>
                
                <div class="user-progress">
                    <h5>Recent Achievements</h5>
                    <div class="achievements-list">
                        ${this.getRecentAchievements(user).map(achievement => `
                            <div class="achievement-item">
                                <span class="achievement-icon">${achievement.icon}</span>
                                <span class="achievement-name">${achievement.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="user-actions">
                    <button id="show-leaderboard" class="action-btn">
                        <i class="fas fa-trophy"></i> Leaderboard
                    </button>
                    <button id="show-achievements" class="action-btn">
                        <i class="fas fa-medal"></i> Achievements
                    </button>
                    <button id="logout-btn" class="action-btn logout">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        `;
    }

    handleLogin(form) {
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        // Demo account
        if (username === 'demo' && password === 'demo123') {
            this.loginUser(this.createDemoUser());
            return;
        }

        // Check existing users
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.loginUser(user);
        } else {
            this.showError('Invalid username or password');
        }
    }

    handleRegister(form) {
        const formData = new FormData(form);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        // Check if username exists
        if (this.users.find(u => u.username === username)) {
            this.showError('Username already exists');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password, // In real app, this would be hashed
            totalPoints: 0,
            flagsSubmitted: 0,
            challengesCompleted: 0,
            labsCompleted: [],
            achievements: [],
            loginStreak: 0,
            lastLogin: null,
            registeredAt: Date.now(),
            fastCompletions: 0,
            completionTimes: {}
        };

        this.users.push(newUser);
        this.saveUsers();
        this.loginUser(newUser);
    }

    loginUser(user) {
        this.currentUser = user;
        this.updateLoginStreak(user);
        this.saveCurrentUser();
        this.updateInterface();
        this.checkAchievements();
        this.showSuccess(`Welcome back, ${user.username}!`);
        
        // Update VM user menu
        if (window.updateUserMenu) {
            window.updateUserMenu(user);
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('neuro-current-user');
        this.updateInterface();
        this.showSuccess('Logged out successfully');
    }

    continueAsGuest() {
        this.currentUser = {
            username: 'Guest',
            isGuest: true,
            totalPoints: 0,
            flagsSubmitted: 0,
            challengesCompleted: 0
        };
        this.updateInterface();
    }

    createDemoUser() {
        return {
            id: 'demo',
            username: 'demo',
            email: 'demo@neuro-dev.com',
            totalPoints: 450,
            flagsSubmitted: 12,
            challengesCompleted: 8,
            labsCompleted: ['termux-basics'],
            achievements: ['first-flag', 'termux-master'],
            loginStreak: 3,
            lastLogin: Date.now(),
            registeredAt: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
            fastCompletions: 2,
            completionTimes: {}
        };
    }

    updateLoginStreak(user) {
        const now = new Date();
        const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
        
        if (lastLogin) {
            const daysDiff = Math.floor((now - lastLogin) / (24 * 60 * 60 * 1000));
            if (daysDiff === 1) {
                user.loginStreak++;
            } else if (daysDiff > 1) {
                user.loginStreak = 1;
            }
        } else {
            user.loginStreak = 1;
        }
        
        user.lastLogin = now.getTime();
        this.saveUsers();
    }

    updateUserProgress(challengeId, points) {
        if (!this.currentUser || this.currentUser.isGuest) return;

        this.currentUser.totalPoints += points;
        this.currentUser.flagsSubmitted++;
        this.currentUser.challengesCompleted++;

        // Track completion time for speed achievements
        const completionTime = Date.now();
        if (this.currentUser.completionTimes[challengeId]) {
            const timeSpent = completionTime - this.currentUser.completionTimes[challengeId];
            if (timeSpent < 10 * 60 * 1000) { // Less than 10 minutes
                this.currentUser.fastCompletions++;
            }
        }

        this.checkAchievements();
        this.updateLeaderboard();
        this.saveUsers();
        this.updateInterface();
    }

    checkAchievements() {
        if (!this.currentUser || this.currentUser.isGuest) return;

        Object.entries(this.achievements).forEach(([id, achievement]) => {
            if (!this.currentUser.achievements.includes(id) && achievement.condition(this.currentUser)) {
                this.unlockAchievement(id, achievement);
            }
        });
    }

    unlockAchievement(id, achievement) {
        this.currentUser.achievements.push(id);
        this.currentUser.totalPoints += achievement.points;
        
        this.showAchievementUnlock(achievement);
        this.saveUsers();
    }

    showAchievementUnlock(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon-large">${achievement.icon}</div>
                <div class="achievement-text">
                    <h4>Achievement Unlocked!</h4>
                    <p>${achievement.name}</p>
                    <small>${achievement.description}</small>
                    <div class="achievement-points">+${achievement.points} points</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    getUserRank(user) {
        const ranks = [
            { min: 0, name: 'Newbie', icon: '🥉' },
            { min: 100, name: 'Script Kiddie', icon: '🥈' },
            { min: 300, name: 'Hacker', icon: '🥇' },
            { min: 600, name: 'Elite Hacker', icon: '💎' },
            { min: 1000, name: 'Cyber Ninja', icon: '👑' }
        ];

        for (let i = ranks.length - 1; i >= 0; i--) {
            if (user.totalPoints >= ranks[i].min) {
                return `${ranks[i].icon} ${ranks[i].name}`;
            }
        }
        return ranks[0].name;
    }

    isLabCompleted(user, labId) {
        return user.labsCompleted && user.labsCompleted.includes(labId);
    }

    getRecentAchievements(user) {
        return user.achievements.slice(-3).map(id => this.achievements[id]).filter(Boolean);
    }

    showLeaderboard() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content leaderboard-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-trophy"></i> Leaderboard</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="leaderboard-list">
                        ${this.generateLeaderboardHTML()}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    generateLeaderboardHTML() {
        const sortedUsers = [...this.users].sort((a, b) => b.totalPoints - a.totalPoints);
        
        return sortedUsers.slice(0, 10).map((user, index) => `
            <div class="leaderboard-item ${user.id === this.currentUser?.id ? 'current-user' : ''}">
                <div class="rank">#${index + 1}</div>
                <div class="user-info">
                    <div class="username">${user.username}</div>
                    <div class="user-rank">${this.getUserRank(user)}</div>
                </div>
                <div class="points">${user.totalPoints} pts</div>
                <div class="challenges">${user.challengesCompleted} challenges</div>
            </div>
        `).join('');
    }

    showAchievements() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content achievements-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-medal"></i> Achievements</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="achievements-grid">
                        ${this.generateAchievementsHTML()}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    generateAchievementsHTML() {
        return Object.entries(this.achievements).map(([id, achievement]) => {
            const isUnlocked = this.currentUser?.achievements.includes(id);
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                        <div class="achievement-points">${achievement.points} points</div>
                    </div>
                    ${isUnlocked ? '<div class="achievement-status">✓</div>' : ''}
                </div>
            `;
        }).join('');
    }

    updateInterface() {
        const userPanel = document.getElementById('user-panel');
        if (userPanel) {
            if (this.currentUser && !this.currentUser.isGuest) {
                userPanel.style.display = 'none';
                if (window.updateUserMenu) {
                    window.updateUserMenu(this.currentUser);
                }
            } else {
                userPanel.innerHTML = this.createLoginInterface();
                userPanel.style.display = 'block';
            }
        }
    }

    updateLeaderboard() {
        // Update leaderboard data
        this.leaderboard = [...this.users].sort((a, b) => b.totalPoints - a.totalPoints);
        this.saveLeaderboard();
    }

    checkAutoLogin() {
        const savedUser = localStorage.getItem('neuro-current-user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                const user = this.users.find(u => u.id === userData.id);
                if (user) {
                    this.currentUser = user;
                }
            } catch (e) {
                console.log('Failed to restore user session');
            }
        }
    }

    saveCurrentUser() {
        if (this.currentUser && !this.currentUser.isGuest) {
            localStorage.setItem('neuro-current-user', JSON.stringify({
                id: this.currentUser.id,
                username: this.currentUser.username
            }));
        }
    }

    loadUsers() {
        try {
            const saved = localStorage.getItem('neuro-users');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveUsers() {
        localStorage.setItem('neuro-users', JSON.stringify(this.users));
    }

    loadLeaderboard() {
        try {
            const saved = localStorage.getItem('neuro-leaderboard');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveLeaderboard() {
        localStorage.setItem('neuro-leaderboard', JSON.stringify(this.leaderboard));
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global functions
function showAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

function continueAsGuest() {
    window.userSystem.continueAsGuest();
}

// Initialize user system
document.addEventListener('DOMContentLoaded', function() {
    window.userSystem = new UserSystem();
    
    // Integrate with challenge system
    if (window.challengeSystem) {
        const originalCompleteChallenge = window.challengeSystem.completeChallenge;
        window.challengeSystem.completeChallenge = function(challengeId) {
            originalCompleteChallenge.call(this, challengeId);
            
            // Update user progress
            const challenge = this.findChallenge(challengeId);
            if (challenge && window.userSystem) {
                window.userSystem.updateUserProgress(challengeId, challenge.points);
            }
        };
    }
});