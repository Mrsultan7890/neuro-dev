// Virtual Machine Core System
class NeuroVM {
    constructor() {
        this.currentCourse = 'termux-basics';
        this.activeApp = 'terminal';
        this.init();
    }

    init() {
        this.updateTime();
        this.setupEventListeners();
        this.loadCourse(this.currentCourse);
        setInterval(() => this.updateTime(), 1000);
    }

    setupEventListeners() {
        // App switching from taskbar
        document.querySelectorAll('.app-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const app = e.currentTarget.dataset.app;
                if (app) {
                    this.switchApp(app);
                }
            });
        });
        
        // Desktop icon switching
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const app = e.currentTarget.dataset.app;
                if (app) {
                    this.switchApp(app);
                }
            });
        });
        
        // VM Guide link
        document.querySelectorAll('[data-action="vm-guide"]').forEach(link => {
            link.addEventListener('click', () => {
                window.open('../vm-guide.html', '_blank');
            });
        });
        
        // Editor buttons
        const newFileBtn = document.getElementById('new-file-btn');
        const saveFileBtn = document.getElementById('save-file-btn');
        const runCodeBtn = document.getElementById('run-code-btn');
        const languageSelect = document.getElementById('language-select');
        
        if (newFileBtn) newFileBtn.addEventListener('click', () => newFile());
        if (saveFileBtn) saveFileBtn.addEventListener('click', () => saveFile());
        if (runCodeBtn) runCodeBtn.addEventListener('click', () => runCode());
        if (languageSelect) languageSelect.addEventListener('change', () => changeLanguage());

        // Course switcher
        document.querySelector('.course-indicator').addEventListener('click', () => {
            this.showCourseSwitch();
        });

        document.querySelectorAll('.course-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const course = e.currentTarget.dataset.course;
                this.switchCourse(course);
            });
        });

        // Course shortcuts
        document.querySelectorAll('.course-shortcut').forEach(item => {
            item.addEventListener('click', (e) => {
                const course = e.currentTarget.dataset.course;
                this.switchCourse(course);
            });
        });

        // Window controls
        document.querySelectorAll('.control.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const window = e.target.closest('.app-window');
                window.classList.remove('active');
                this.updateTaskbar();
            });
        });

        // Logo click for course switcher
        document.querySelector('.logo').addEventListener('click', () => {
            this.showCourseSwitch();
        });
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        document.getElementById('current-time').textContent = timeString;
    }

    switchApp(appName) {
        try {
            // Validate app name
            if (!appName || typeof appName !== 'string') {
                console.error('Invalid app name provided');
                return;
            }
            
            // Hide all apps
            const windows = document.querySelectorAll('.app-window');
            windows.forEach(window => {
                if (window) {
                    window.classList.remove('active');
                }
            });

            // Remove active from all icons
            const icons = document.querySelectorAll('.app-icon');
            icons.forEach(icon => {
                if (icon) {
                    icon.classList.remove('active');
                }
            });

            // Show selected app
            const selectedApp = document.getElementById(`${appName}-app`);
            const selectedIcon = document.querySelector(`[data-app="${appName}"]`);
            
            if (selectedApp) {
                selectedApp.classList.add('active');
            } else {
                console.error(`App '${appName}' not found`);
                return;
            }
            
            if (selectedIcon) {
                selectedIcon.classList.add('active');
            }
            
            this.activeApp = appName;
            
            // Initialize app if needed
            try {
                if (appName === 'files' && window.fileManager) {
                    window.fileManager.refresh();
                } else if (appName === 'ai-chat' && window.aiChatApp) {
                    window.aiChatApp.setupEventListeners();
                } else if (appName === 'bank-security' && window.bankSecurity) {
                    // Bank Security app initialization if needed
                }
            } catch (initError) {
                console.error(`Error initializing ${appName} app:`, initError);
            }
        } catch (error) {
            console.error('Error switching app:', error);
        }
    }

    switchCourse(courseName) {
        this.currentCourse = courseName;
        this.loadCourse(courseName);
        this.closeCourseSwitch();
        
        // Update UI
        const courseNames = {
            'termux-basics': 'Termux Basics',
            'termux-advanced': 'Termux Advanced',
            'nethunter-rootless': 'NetHunter Rootless',
            'nethunter-tools': 'NetHunter Tools',
            'networking': 'Networking',
            'web-security': 'Web Security',
            'mobile-osint': 'Mobile & OSINT',
            'python': 'Python Programming',
            'hands-on-ml-scikit-learn': 'ML Theory & Scikit-Learn',
            'python-ai-ml': 'Python AI/ML Coding',
            'ai-hacking': 'AI Security & Hacking'
        };

        document.getElementById('course-name').textContent = courseNames[courseName];
        document.getElementById('welcome-course').textContent = courseNames[courseName];
        
        // Update course shortcuts
        document.querySelectorAll('.course-shortcut').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.course === courseName) {
                item.classList.add('active');
            }
        });
        
        // Reset terminal for new course
        if (window.terminal) {
            window.terminal.clear();
            window.terminal.addLine(`Course switched to: ${courseNames[courseName]}`, 'success');
            window.terminal.addLine('Type "help" to see available commands for this course', 'output');
        }
    }

    loadCourse(courseName) {
        try {
            // Validate course name
            if (!courseName || typeof courseName !== 'string') {
                console.error('Invalid course name provided');
                return;
            }
            
            // Load course-specific configurations
            const courseConfigs = {
                'termux-basics': {
                    tools: ['pkg', 'nano', 'ls', 'cd', 'mkdir', 'touch', 'cat'],
                    environment: 'termux',
                    welcomeMessage: 'Termux environment loaded. Practice basic Linux commands!'
                },
                'nethunter-rootless': {
                    tools: ['nmap', 'metasploit', 'aircrack-ng', 'sqlmap', 'hydra'],
                    environment: 'kali',
                    welcomeMessage: 'NetHunter environment loaded. Security tools available!'
                },
                'web-security': {
                    tools: ['burpsuite', 'sqlmap', 'nikto', 'dirb', 'gobuster'],
                    environment: 'pentest',
                    welcomeMessage: 'Web security lab loaded. OWASP testing environment ready!'
                },
                'python': {
                    tools: ['python3', 'pip', 'jupyter', 'numpy', 'pandas'],
                    environment: 'python',
                    welcomeMessage: 'Python development environment loaded!'
                },
                'hands-on-ml-scikit-learn': {
                    tools: ['jupyter', 'python3', 'sklearn', 'numpy', 'pandas', 'matplotlib'],
                    environment: 'ml-theory',
                    welcomeMessage: 'ML Theory lab loaded. Datasets: iris, housing, mnist available!',
                    datasets: ['iris.csv', 'housing.csv', 'mnist.pkl']
                },
                'python-ai-ml': {
                    tools: ['jupyter', 'tensorflow', 'pytorch', 'opencv', 'matplotlib', 'seaborn'],
                    environment: 'ai-coding',
                    welcomeMessage: 'AI/ML Coding environment loaded. TensorFlow & PyTorch ready!',
                    projects: ['image-classifier', 'chatbot', 'recommendation-system']
                },
                'ai-hacking': {
                    tools: ['prompt-injection', 'adversarial-attack', 'extract-model', 'poison-data', 'bypass-limits', 'privacy-attack', 'full-assessment'],
                    environment: 'ai-security',
                    welcomeMessage: 'AI Security lab loaded. Neuro-AI application ready for testing!',
                    targets: ['neuro-ai.local', 'chat-api.neuro-dev', 'vision-api.neuro-dev', 'ml-models.neuro-dev']
                }
            };

            const config = courseConfigs[courseName] || courseConfigs['termux-basics'];
            
            // Update terminal environment
            try {
                if (window.terminal && window.terminal.setCourse) {
                    window.terminal.setCourse(courseName, config);
                }
            } catch (terminalError) {
                console.error('Error updating terminal environment:', terminalError);
            }
            
            // Update browser content
            try {
                if (window.browser && window.browser.loadCourseContent) {
                    window.browser.loadCourseContent(courseName);
                }
            } catch (browserError) {
                console.error('Error updating browser content:', browserError);
            }
        } catch (error) {
            console.error('Error loading course:', error);
        }
    }

    showCourseSwitch() {
        document.getElementById('course-switcher').classList.add('active');
    }

    closeCourseSwitch() {
        document.getElementById('course-switcher').classList.remove('active');
    }

    updateTaskbar() {
        // Update taskbar based on active windows
        const activeWindows = document.querySelectorAll('.app-window.active');
        document.querySelectorAll('.app-icon').forEach(icon => {
            icon.classList.remove('active');
        });

        if (activeWindows.length > 0) {
            const activeApp = activeWindows[0].id.replace('-app', '');
            document.querySelector(`[data-app="${activeApp}"]`).classList.add('active');
        }
    }
}

// Global functions
function closeCourseSwitch() {
    if (window.vm && window.vm.closeCourseSwitch) {
        window.vm.closeCourseSwitch();
    }
}

function toggleFullscreen() {
    const vmContainer = document.querySelector('.vm-container');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    if (!vmContainer || !fullscreenBtn) return;
    
    const icon = fullscreenBtn.querySelector('i');
    
    if (vmContainer.classList.contains('fullscreen')) {
        // Exit fullscreen
        vmContainer.classList.remove('fullscreen');
        if (icon) {
            icon.className = 'fas fa-expand';
        }
        fullscreenBtn.title = 'Fullscreen Mode';
        
        // Exit browser fullscreen if active
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    } else {
        // Enter fullscreen
        vmContainer.classList.add('fullscreen');
        if (icon) {
            icon.className = 'fas fa-compress';
        }
        fullscreenBtn.title = 'Exit Fullscreen';
        
        // Try to enter browser fullscreen
        const requestFullscreen = vmContainer.requestFullscreen || 
                                 vmContainer.webkitRequestFullscreen || 
                                 vmContainer.mozRequestFullScreen || 
                                 vmContainer.msRequestFullscreen;
        
        if (requestFullscreen) {
            requestFullscreen.call(vmContainer).catch(() => {});
        }
    }
    
    // Trigger resize events
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        // Refresh terminal if active
        if (window.terminal && window.terminal.refresh) {
            window.terminal.refresh();
        }
    }, 200);
}

function showLeaderboard() {
    if (window.userSystem) {
        window.userSystem.showLeaderboard();
    }
}

function showAchievements() {
    if (window.userSystem) {
        window.userSystem.showAchievements();
    }
}

function logout() {
    if (window.userSystem) {
        window.userSystem.logout();
        document.getElementById('user-menu').style.display = 'none';
    }
}

// User menu toggle
document.addEventListener('click', (e) => {
    if (e.target.closest('.user-menu')) {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    } else {
        const dropdown = document.querySelector('.user-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }
});

// Update user menu when user logs in
function updateUserMenu(user) {
    const userMenu = document.getElementById('user-menu');
    const userAvatar = document.getElementById('user-avatar');
    const usernameDisplay = document.getElementById('username-display');
    const pointsDisplay = document.getElementById('points-display');
    const flagsDisplay = document.getElementById('flags-display');
    
    if (user && !user.isGuest) {
        userMenu.style.display = 'block';
        userAvatar.textContent = user.username.charAt(0).toUpperCase();
        usernameDisplay.textContent = user.username;
        pointsDisplay.textContent = user.totalPoints || 0;
        flagsDisplay.textContent = user.flagsSubmitted || 0;
    } else {
        userMenu.style.display = 'none';
    }
}

// Initialize VM when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait for all scripts to load
    setTimeout(() => {
        window.vm = new NeuroVM();
    }, 100);
});

// Handle URL parameters for direct course access
const urlParams = new URLSearchParams(window.location.search);
const courseParam = urlParams.get('course');
if (courseParam) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            if (window.vm && window.vm.switchCourse) {
                window.vm.switchCourse(courseParam);
            }
        }, 600);
    });
}