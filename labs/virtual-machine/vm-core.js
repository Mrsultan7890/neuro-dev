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
        // App switching
        document.querySelectorAll('.app-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const app = e.currentTarget.dataset.app;
                this.switchApp(app);
            });
        });

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
        // Hide all apps
        document.querySelectorAll('.app-window').forEach(window => {
            window.classList.remove('active');
        });

        // Remove active from all icons
        document.querySelectorAll('.app-icon').forEach(icon => {
            icon.classList.remove('active');
        });

        // Show selected app
        document.getElementById(`${appName}-app`).classList.add('active');
        document.querySelector(`[data-app="${appName}"]`).classList.add('active');
        
        this.activeApp = appName;
        
        // Initialize app if needed
        if (appName === 'files') {
            window.fileManager.refresh();
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
                tools: ['adversarial-ml', 'model-extraction', 'privacy-attack', 'deepfool', 'cleverhans'],
                environment: 'ai-security',
                welcomeMessage: 'AI Security lab loaded. Target: neuro-dev.local ready for testing!',
                targets: ['neuro-dev.local', 'ml-api.neuro-dev', 'ai-chat.neuro-dev', 'face-recognition.neuro-dev']
            }
        };

        const config = courseConfigs[courseName] || courseConfigs['termux-basics'];
        
        // Update terminal environment
        if (window.terminal) {
            window.terminal.setCourse(courseName, config);
        }
        
        // Update browser content
        if (window.browser) {
            window.browser.loadCourseContent(courseName);
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
    window.vm.closeCourseSwitch();
}

// Initialize VM when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.vm = new NeuroVM();
});

// Handle URL parameters for direct course access
const urlParams = new URLSearchParams(window.location.search);
const courseParam = urlParams.get('course');
if (courseParam) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            window.vm.switchCourse(courseParam);
        }, 500);
    });
}