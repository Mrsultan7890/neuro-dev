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
        // App switching from taskbar - use setTimeout to ensure DOM is ready
        setTimeout(() => {
            document.querySelectorAll('.app-icon').forEach(icon => {
                icon.addEventListener('click', (e) => {
                    console.log('App icon clicked:', e.currentTarget.dataset.app);
                    const app = e.currentTarget.dataset.app;
                    if (app) {
                        this.switchApp(app);
                    }
                });
            });
        }, 500);
        
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

        // Course switcher and user menu
        setTimeout(() => {
            const courseIndicator = document.querySelector('.course-indicator');
            if (courseIndicator) {
                courseIndicator.addEventListener('click', () => {
                    this.showCourseSwitch();
                });
            }
            
            // User menu click for leaderboard
            const userAvatar = document.getElementById('user-avatar');
            if (userAvatar) {
                userAvatar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('User avatar clicked');
                    if (window.leaderboardSystem) {
                        window.leaderboardSystem.showLeaderboard();
                    }
                });
            }
        }, 500);

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
                const appWindow = e.target.closest('.app-window');
                if (appWindow) {
                    appWindow.classList.remove('active');
                    this.updateTaskbar();
                }
            });
        });

        // Logo click for course switcher
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', () => {
                this.showCourseSwitch();
            });
        }
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

    async switchApp(appName) {
        try {
            // Validate app name
            if (!appName || typeof appName !== 'string') {
                console.error('Invalid app name provided:', appName);
                this.showError('Invalid application name');
                return;
            }
            
            // Sanitize app name
            const sanitizedAppName = appName.replace(/[^a-zA-Z0-9-_]/g, '');
            if (sanitizedAppName !== appName) {
                console.warn('App name sanitized:', appName, '->', sanitizedAppName);
            }
            
            // Use performance manager for fast switching
            if (window.performanceManager) {
                await window.performanceManager.switchAppFast(sanitizedAppName);
            } else {
                // Fallback to original method
                await this.switchAppOriginal(sanitizedAppName);
            }
            
            // Track progress with safety check
            if (window.progressTracker && typeof window.progressTracker.trackProgress === 'function') {
                try {
                    window.progressTracker.trackProgress(sanitizedAppName, 'app-opened');
                } catch (progressError) {
                    console.warn('Progress tracking error:', progressError);
                }
            }
            
            this.activeApp = sanitizedAppName;
            this.initializeAppLogic(sanitizedAppName);
            
        } catch (error) {
            console.error('Error switching app:', error);
            this.showError('Failed to switch application');
        }
    }
    
    async switchAppOriginal(appName) {
        // Hide all apps with animation
        const windows = document.querySelectorAll('.app-window');
        const activeWindow = document.querySelector('.app-window.active');
        
        if (activeWindow) {
            activeWindow.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
            activeWindow.style.opacity = '0';
            activeWindow.style.transform = 'scale(0.95)';
            
            await new Promise(resolve => setTimeout(resolve, 150));
        }
        
        windows.forEach(window => {
            if (window) {
                window.classList.remove('active');
                window.style.display = 'none';
            }
        });

        // Remove active from all icons
        const icons = document.querySelectorAll('.app-icon');
        icons.forEach(icon => {
            if (icon) {
                icon.classList.remove('active');
            }
        });

        // Show selected app with animation
        const selectedApp = document.getElementById(`${appName}-app`);
        const selectedIcon = document.querySelector(`[data-app="${appName}"]`);
        
        if (selectedApp) {
            selectedApp.style.display = 'block';
            selectedApp.style.opacity = '0';
            selectedApp.style.transform = 'scale(0.95)';
            selectedApp.classList.add('active');
            
            // Smooth animation
            requestAnimationFrame(() => {
                selectedApp.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                selectedApp.style.opacity = '1';
                selectedApp.style.transform = 'scale(1)';
            });
            
            console.log(`Switched to app: ${appName}`);
                
            // Special handling for browser app
            if (appName === 'browser') {
                console.log('Browser app activated, checking Firefox browser...');
                if (!window.firefoxBrowser) {
                    console.log('Firefox browser not found, initializing...');
                    setTimeout(() => {
                        if (window.initFirefoxBrowser) {
                            window.initFirefoxBrowser();
                        } else {
                            console.log('Firefox browser init function not available, trying direct initialization...');
                            try {
                                if (window.FirefoxBrowser) {
                                    window.firefoxBrowser = new window.FirefoxBrowser();
                                    console.log('Firefox browser initialized directly');
                                }
                            } catch (error) {
                                console.error('Failed to initialize Firefox browser:', error);
                            }
                        }
                    }, 100);
                } else {
                    console.log('Firefox browser already initialized');
                }
            }
        } else {
            console.log(`App ${appName}-app not found`);
            // Try to load app HTML if not found
            this.loadMissingApp(appName);
            return;
        }
        
        if (selectedIcon) {
            selectedIcon.classList.add('active');
        }
    }
    
    initializeAppLogic(appName) {
        try {
            const appInitializers = {
                'files': () => this.initFileManager(),
                'browser': () => this.initBrowser(),
                'ai-chat': () => this.initAiChat(),
                'network-simulator': () => this.initDelayedApp('NetworkSimulatorApp', 'networkSimulatorApp'),
                'crypto-playground': () => this.initDelayedApp('CryptoPlaygroundApp', 'cryptoPlaygroundApp'),
                'malware-analysis': () => this.initDelayedApp('MalwareAnalysisApp', 'malwareAnalysisApp'),
                'ctf-challenges': () => this.initDelayedApp('CTFChallengesApp', 'ctfChallengesApp'),
                'bank-security': () => this.initDelayedApp('BankSecurityApp', 'bankSecurityApp'),
                'digital-forensics': () => this.initForensicsApp(),
                'mobile-hacking': () => this.initMobileApp()
            };
            
            const initializer = appInitializers[appName];
            if (initializer) {
                initializer();
            }
        } catch (initError) {
            console.error(`Error initializing ${appName} app:`, initError);
        }
    }
    
    initFileManager() {
        if (window.fileManager) {
            window.fileManager.refresh();
        }
    }
    
    initBrowser() {
        if (window.firefoxBrowser) {
            console.log('Firefox browser already initialized');
        }
    }
    
    initAiChat() {
        if (window.aiChatApp) {
            window.aiChatApp.setupEventListeners();
        }
    }
    
    initDelayedApp(AppClass, instanceName) {
        setTimeout(() => {
            if (window[AppClass] && !window[instanceName]) {
                window[instanceName] = new window[AppClass]();
            }
            if (window[instanceName] && window[instanceName].setupEventListeners) {
                window[instanceName].setupEventListeners();
            }
        }, 100);
    }
    
    initForensicsApp() {
        setTimeout(() => {
            if (window.DigitalForensicsApp && !window.forensicsApp) {
                window.forensicsApp = new window.DigitalForensicsApp();
                this.loadAppContent('#digital-forensics-app .app-content', window.forensicsApp);
            }
            if (window.forensicsApp && window.forensicsApp.setupEventListeners) {
                window.forensicsApp.setupEventListeners();
            }
        }, 100);
    }
    
    initMobileApp() {
        setTimeout(() => {
            if (window.MobileHackingApp && !window.mobileApp) {
                window.mobileApp = new window.MobileHackingApp();
                this.loadAppContent('#mobile-hacking-app .app-content', window.mobileApp);
            }
            if (window.mobileApp && window.mobileApp.setupEventListeners) {
                window.mobileApp.setupEventListeners();
            }
        }, 100);
    }
    
    loadAppContent(selector, app) {
        const appContent = document.querySelector(selector);
        if (appContent && app.createInterface) {
            appContent.innerHTML = app.createInterface();
        }
    }

    async loadMissingApp(appName) {
        const appFiles = {
            'system-monitor': 'system-monitor.html',
            'package-manager': 'package-manager.html', 
            'settings': 'settings.html',
            'calculator': 'calculator.html',
            'text-editor': 'text-editor.html',
            'image-viewer': 'image-viewer.html',
            'music-player': 'music-player.html',
            'video-player': 'video-player.html',
            'digital-forensics': 'digital-forensics.html',
            'mobile-hacking': 'mobile-hacking.html'
        };
        
        const fileName = appFiles[appName];
        if (!fileName) {
            console.error(`App '${appName}' not found`);
            console.log('Available apps:', Array.from(document.querySelectorAll('.app-window')).map(w => w.id));
            return;
        }
        
        try {
            const response = await fetch(fileName);
            const html = await response.text();
            
            // Create container and insert HTML
            const container = document.createElement('div');
            container.innerHTML = html;
            
            // Append to applications container
            const appsContainer = document.querySelector('.applications');
            appsContainer.appendChild(container.firstElementChild);
            
            // Now try switching again
            setTimeout(() => this.switchApp(appName), 100);
        } catch (error) {
            console.error(`Failed to load ${appName} app:`, error);
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
            'digital-forensics': 'Digital Forensics',
            'advanced-mobile-hacking': 'Advanced Mobile Hacking',
            'python': 'Python Programming',
            'hands-on-ml-scikit-learn': 'ML Theory & Scikit-Learn',
            'python-ai-ml': 'Python AI/ML Coding',
            'ai-hacking': 'AI Security & Hacking'
        };

        const courseNameEl = document.getElementById('course-name');
        const welcomeCourseEl = document.getElementById('welcome-course');
        
        if (courseNameEl) courseNameEl.textContent = courseNames[courseName] || 'Unknown Course';
        if (welcomeCourseEl) welcomeCourseEl.textContent = courseNames[courseName] || 'Unknown Course';
        
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
                console.error('Invalid course name provided:', courseName);
                this.showError('Invalid course name');
                return;
            }
            
            // Sanitize course name
            const sanitizedCourseName = courseName.replace(/[^a-zA-Z0-9-_]/g, '');
            if (sanitizedCourseName !== courseName) {
                console.warn('Course name sanitized:', courseName, '->', sanitizedCourseName);
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
                'digital-forensics': {
                    tools: ['dd', 'volatility', 'autopsy', 'sleuthkit', 'foremost', 'binwalk'],
                    environment: 'forensics',
                    welcomeMessage: 'Digital Forensics lab loaded. Evidence analysis tools ready!'
                },
                'advanced-mobile-hacking': {
                    tools: ['apktool', 'frida', 'jadx', 'objection', 'mobsf', 'drozer'],
                    environment: 'mobile-pentest',
                    welcomeMessage: 'Advanced Mobile Hacking lab loaded. APK analysis tools ready!'
                },
                'ai-hacking': {
                    tools: ['prompt-injection', 'adversarial-attack', 'extract-model', 'poison-data', 'bypass-limits', 'privacy-attack', 'full-assessment'],
                    environment: 'ai-security',
                    welcomeMessage: 'AI Security lab loaded. Neuro-AI application ready for testing!',
                    targets: ['neuro-ai.local', 'chat-api.neuro-dev', 'vision-api.neuro-dev', 'ml-models.neuro-dev']
                }
            };

            const config = courseConfigs[sanitizedCourseName] || courseConfigs['termux-basics'];
            
            // Update terminal environment
            try {
                if (window.terminal && typeof window.terminal.setCourse === 'function') {
                    window.terminal.setCourse(sanitizedCourseName, config);
                } else {
                    console.warn('Terminal not available or setCourse method missing');
                }
            } catch (terminalError) {
                console.error('Error updating terminal environment:', terminalError);
                this.showError('Failed to update terminal environment');
            }
            
            // Update browser content
            try {
                if (window.firefoxBrowser && window.firefoxBrowser.currentCourse !== undefined) {
                    window.firefoxBrowser.currentCourse = sanitizedCourseName;
                }
                if (window.browser && typeof window.browser.loadCourseContent === 'function') {
                    window.browser.loadCourseContent(sanitizedCourseName);
                }
            } catch (browserError) {
                console.error('Error updating browser content:', browserError);
                this.showError('Failed to update browser content');
            }
            
            console.log(`Course loaded successfully: ${sanitizedCourseName}`);
        } catch (error) {
            console.error('Error loading course:', error);
            this.showError('Failed to load course');
        }
    }

    showCourseSwitch() {
        const courseSwitcher = document.getElementById('course-switcher');
        if (courseSwitcher) {
            courseSwitcher.classList.add('active');
        }
    }

    closeCourseSwitch() {
        const courseSwitcher = document.getElementById('course-switcher');
        if (courseSwitcher) {
            courseSwitcher.classList.remove('active');
        }
    }

    updateTaskbar() {
        // Update taskbar based on active windows
        const activeWindows = document.querySelectorAll('.app-window.active');
        document.querySelectorAll('.app-icon').forEach(icon => {
            icon.classList.remove('active');
        });

        if (activeWindows.length > 0) {
            const activeApp = activeWindows[0].id.replace('-app', '');
            const activeIcon = document.querySelector(`[data-app="${activeApp}"]`);
            if (activeIcon) {
                activeIcon.classList.add('active');
            }
        }
    }
}

// Global functions
window.closeCourseSwitch = function() {
    if (window.vm && window.vm.closeCourseSwitch) {
        window.vm.closeCourseSwitch();
    }
}

window.minimizeWindow = function(windowId) {
    const appWindow = document.getElementById(windowId);
    if (appWindow) {
        appWindow.style.display = 'none';
    }
}

window.maximizeWindow = function(windowId) {
    const appWindow = document.getElementById(windowId);
    if (appWindow) {
        appWindow.classList.toggle('maximized');
    }
}

window.closeWindow = function(windowId) {
    const appWindow = document.getElementById(windowId);
    if (appWindow) {
        appWindow.classList.remove('active');
        appWindow.style.display = 'none';
    }
}

function toggleFullscreen() {
    const vmContainer = document.querySelector('.vm-container');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    if (!vmContainer || !fullscreenBtn) {
        console.error('Fullscreen elements not found');
        return;
    }
    
    const icon = fullscreenBtn.querySelector('i');
    
    try {
        if (document.fullscreenElement || vmContainer.classList.contains('fullscreen')) {
            // Exit fullscreen
            vmContainer.classList.remove('fullscreen');
            if (icon) {
                icon.className = 'fas fa-expand';
            }
            fullscreenBtn.title = 'Fullscreen Mode';
            
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(console.log);
            }
        } else {
            // Enter fullscreen
            vmContainer.classList.add('fullscreen');
            if (icon) {
                icon.className = 'fas fa-compress';
            }
            fullscreenBtn.title = 'Exit Fullscreen';
            
            // Request fullscreen
            if (vmContainer.requestFullscreen) {
                vmContainer.requestFullscreen().catch(console.log);
            } else if (vmContainer.webkitRequestFullscreen) {
                vmContainer.webkitRequestFullscreen();
            } else if (vmContainer.mozRequestFullScreen) {
                vmContainer.mozRequestFullScreen();
            } else if (vmContainer.msRequestFullscreen) {
                vmContainer.msRequestFullscreen();
            }
        }
    } catch (error) {
        console.error('Fullscreen error:', error);
    }
}

function showLeaderboard() {
    if (window.leaderboardSystem) {
        window.leaderboardSystem.showLeaderboard();
    }
}

function showAchievements() {
    if (window.leaderboardSystem) {
        window.leaderboardSystem.showAchievements();
    }
}

function logout() {
    if (window.userAuth) {
        window.userAuth.logout();
    }
}

// User menu toggle - fixed
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // User avatar click for leaderboard
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Opening leaderboard...');
                if (window.leaderboardSystem && window.leaderboardSystem.showLeaderboard) {
                    window.leaderboardSystem.showLeaderboard();
                } else {
                    console.error('Leaderboard system not found');
                }
            });
        }
        
        // Leaderboard button in dropdown
        document.addEventListener('click', (e) => {
            if (e.target.closest('[onclick="showLeaderboard()"]')) {
                e.preventDefault();
                if (window.leaderboardSystem) {
                    window.leaderboardSystem.showLeaderboard();
                }
            }
        });
    }, 1000);
});

// Update user menu when user logs in
function updateUserMenu(user) {
    const userMenu = document.getElementById('user-menu');
    const userAvatar = document.getElementById('user-avatar');
    const usernameDisplay = document.getElementById('username-display');
    const pointsDisplay = document.getElementById('points-display');
    const flagsDisplay = document.getElementById('flags-display');
    
    if (user && !user.isGuest) {
        if (userMenu) userMenu.style.display = 'block';
        if (userAvatar) userAvatar.textContent = user.username.charAt(0).toUpperCase();
        if (usernameDisplay) usernameDisplay.textContent = user.username;
        if (pointsDisplay) pointsDisplay.textContent = user.totalPoints || 0;
        if (flagsDisplay) flagsDisplay.textContent = user.flagsSubmitted || 0;
    } else {
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Error display helper
function showError(message) {
        try {
            const notification = document.createElement('div');
            notification.className = 'vm-error-notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff4444;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 10000;
                font-size: 14px;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 3000);
        } catch (error) {
            console.error('Failed to show error notification:', error);
        }
    }

// Initialize VM when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait for all scripts to load
    setTimeout(() => {
        try {
            window.vm = new NeuroVM();
            console.log('NeuroVM initialized successfully');
        } catch (error) {
            console.error('Failed to initialize NeuroVM:', error);
        }
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