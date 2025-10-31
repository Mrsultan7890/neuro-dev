// Challenge System for Neuro-Dev Labs
class ChallengeSystem {
    constructor() {
        this.challenges = this.initChallenges();
        this.userProgress = this.loadProgress();
        this.currentLab = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserStats();
    }

    initChallenges() {
        return {
            'termux-basics': {
                name: 'Termux Basics',
                difficulty: 'easy',
                challenges: [
                    {
                        id: 'tb-001',
                        title: 'Package Installation',
                        description: 'Install python package using pkg command',
                        flag: 'NEURO{pkg_install_python}',
                        points: 10,
                        hint: 'Use: pkg install python',
                        command: 'pkg install python'
                    },
                    {
                        id: 'tb-002', 
                        title: 'File Navigation',
                        description: 'Navigate to home directory and list files',
                        flag: 'NEURO{home_directory_listed}',
                        points: 10,
                        hint: 'Use cd ~ and ls -la',
                        commands: ['cd ~', 'ls -la']
                    },
                    {
                        id: 'tb-003',
                        title: 'Create Directory Structure',
                        description: 'Create a directory called "projects" and a file "hello.py" inside it',
                        flag: 'NEURO{directory_structure_created}',
                        points: 15,
                        hint: 'Use mkdir and touch commands',
                        commands: ['mkdir projects', 'cd projects', 'touch hello.py']
                    },
                    {
                        id: 'tb-004',
                        title: 'Text Editor Usage',
                        description: 'Edit hello.py file and add print statement',
                        flag: 'NEURO{hello_world_python}',
                        points: 20,
                        hint: 'Use nano hello.py and add: print("Hello World")',
                        validation: (fileContent) => fileContent.includes('print("Hello World")')
                    }
                ]
            },
            'ai-hacking': {
                name: 'AI Security & Hacking',
                difficulty: 'insane',
                challenges: [
                    {
                        id: 'ai-001',
                        title: 'Target Discovery',
                        description: 'Scan neuro-dev.local infrastructure and find ML services',
                        flag: 'NEURO{ml_services_discovered}',
                        points: 50,
                        hint: 'Use: target-neuro-dev command',
                        command: 'target-neuro-dev'
                    },
                    {
                        id: 'ai-002',
                        title: 'API Endpoint Analysis',
                        description: 'Analyze ML API endpoints for vulnerabilities',
                        flag: 'NEURO{api_vulnerabilities_found}',
                        points: 75,
                        hint: 'Use: scan-ml-api ml-api.neuro-dev',
                        command: 'scan-ml-api ml-api.neuro-dev'
                    },
                    {
                        id: 'ai-003',
                        title: 'Model Extraction Attack',
                        description: 'Successfully extract the ML model from the API',
                        flag: 'NEURO{model_extraction_successful}',
                        points: 100,
                        hint: 'Use: extract-model command',
                        command: 'extract-model'
                    },
                    {
                        id: 'ai-004',
                        title: 'Adversarial Attack',
                        description: 'Generate adversarial examples to fool the model',
                        flag: 'NEURO{adversarial_attack_successful}',
                        points: 125,
                        hint: 'Use: adversarial-attack command',
                        command: 'adversarial-attack'
                    },
                    {
                        id: 'ai-005',
                        title: 'Privacy Attack',
                        description: 'Perform membership inference attack on training data',
                        flag: 'NEURO{privacy_violation_detected}',
                        points: 150,
                        hint: 'Use: privacy-attack command',
                        command: 'privacy-attack'
                    }
                ]
            },
            'web-security': {
                name: 'Web Application Security',
                difficulty: 'hard',
                challenges: [
                    {
                        id: 'ws-001',
                        title: 'SQL Injection Discovery',
                        description: 'Find SQL injection vulnerability in login form',
                        flag: 'NEURO{sql_injection_found}',
                        points: 30,
                        hint: 'Try: \' OR 1=1-- in username field',
                        target: 'http://vulnerable-app.neuro-dev/login'
                    },
                    {
                        id: 'ws-002',
                        title: 'XSS Exploitation',
                        description: 'Execute XSS payload in comment section',
                        flag: 'NEURO{xss_executed}',
                        points: 40,
                        hint: 'Try: <script>alert("XSS")</script>',
                        target: 'http://vulnerable-app.neuro-dev/comments'
                    },
                    {
                        id: 'ws-003',
                        title: 'Directory Traversal',
                        description: 'Access /etc/passwd using directory traversal',
                        flag: 'NEURO{directory_traversal_success}',
                        points: 50,
                        hint: 'Try: ../../../etc/passwd in file parameter',
                        target: 'http://vulnerable-app.neuro-dev/download'
                    }
                ]
            },
            'nethunter-tools': {
                name: 'NetHunter Tools',
                difficulty: 'hard',
                challenges: [
                    {
                        id: 'nh-001',
                        title: 'Network Reconnaissance',
                        description: 'Scan target network and identify open ports',
                        flag: 'NEURO{network_scan_complete}',
                        points: 40,
                        hint: 'Use: nmap -sS target_ip',
                        command: 'nmap -sS 192.168.1.100'
                    },
                    {
                        id: 'nh-002',
                        title: 'Service Enumeration',
                        description: 'Identify services running on open ports',
                        flag: 'NEURO{services_enumerated}',
                        points: 50,
                        hint: 'Use: nmap -sV target_ip',
                        command: 'nmap -sV 192.168.1.100'
                    },
                    {
                        id: 'nh-003',
                        title: 'Metasploit Exploitation',
                        description: 'Use Metasploit to exploit vulnerable service',
                        flag: 'NEURO{metasploit_exploit_success}',
                        points: 75,
                        hint: 'Use: metasploit and search for exploits',
                        command: 'metasploit'
                    }
                ]
            }
        };
    }

    setupEventListeners() {
        // Flag submission form
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('flag-form')) {
                e.preventDefault();
                this.submitFlag(e.target);
            }
        });

        // Challenge completion detection
        if (window.terminal) {
            const originalExecuteCommand = window.terminal.executeCommand;
            window.terminal.executeCommand = (command) => {
                originalExecuteCommand.call(window.terminal, command);
                this.checkCommandCompletion(command);
            };
        }
    }

    checkCommandCompletion(command) {
        if (!this.currentLab) return;

        const labChallenges = this.challenges[this.currentLab]?.challenges || [];
        
        labChallenges.forEach(challenge => {
            if (this.isCompleted(challenge.id)) return;

            // Check single command
            if (challenge.command && command.includes(challenge.command)) {
                this.completeChallenge(challenge.id);
            }
            
            // Check command sequence
            if (challenge.commands) {
                const userCommands = this.getUserCommands();
                const hasAllCommands = challenge.commands.every(cmd => 
                    userCommands.some(userCmd => userCmd.includes(cmd))
                );
                if (hasAllCommands) {
                    this.completeChallenge(challenge.id);
                }
            }
        });
    }

    completeChallenge(challengeId) {
        if (this.isCompleted(challengeId)) return;

        const challenge = this.findChallenge(challengeId);
        if (!challenge) return;

        // Mark as completed
        this.userProgress[challengeId] = {
            completed: true,
            timestamp: Date.now(),
            points: challenge.points
        };

        // Show completion notification
        this.showCompletionNotification(challenge);
        
        // Update UI
        this.updateChallengeUI(challengeId);
        this.updateStats();
        
        // Save progress
        this.saveProgress();

        // Auto-submit flag
        this.autoSubmitFlag(challenge);
    }

    autoSubmitFlag(challenge) {
        if (window.terminal) {
            window.terminal.addLine(`🎉 Challenge Completed: ${challenge.title}`, 'success');
            window.terminal.addLine(`🚩 Flag: ${challenge.flag}`, 'success');
            window.terminal.addLine(`⭐ Points Earned: ${challenge.points}`, 'success');
        }
    }

    submitFlag(form) {
        const flagInput = form.querySelector('input[name="flag"]');
        const challengeId = form.dataset.challengeId;
        const userFlag = flagInput.value.trim();

        const challenge = this.findChallenge(challengeId);
        if (!challenge) return;

        if (userFlag === challenge.flag) {
            this.completeChallenge(challengeId);
            flagInput.value = '';
            flagInput.style.borderColor = '#00ff41';
        } else {
            flagInput.style.borderColor = '#ff4444';
            setTimeout(() => {
                flagInput.style.borderColor = '';
            }, 2000);
        }
    }

    findChallenge(challengeId) {
        for (const lab of Object.values(this.challenges)) {
            const challenge = lab.challenges.find(c => c.id === challengeId);
            if (challenge) return challenge;
        }
        return null;
    }

    isCompleted(challengeId) {
        return this.userProgress[challengeId]?.completed || false;
    }

    getUserCommands() {
        return window.terminal?.commandHistory || [];
    }

    showCompletionNotification(challenge) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'challenge-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🎉</div>
                <div class="notification-text">
                    <h4>Challenge Completed!</h4>
                    <p>${challenge.title}</p>
                    <span class="points">+${challenge.points} points</span>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    updateChallengeUI(challengeId) {
        const challengeElement = document.querySelector(`[data-challenge-id="${challengeId}"]`);
        if (challengeElement) {
            challengeElement.classList.add('completed');
        }
    }

    updateStats() {
        const totalPoints = this.getTotalPoints();
        const completedChallenges = this.getCompletedCount();
        const totalChallenges = this.getTotalChallenges();

        // Update stats in UI
        const pointsElement = document.querySelector('.user-points');
        if (pointsElement) {
            pointsElement.textContent = totalPoints;
        }

        const progressElement = document.querySelector('.user-progress');
        if (progressElement) {
            progressElement.textContent = `${completedChallenges}/${totalChallenges}`;
        }
    }

    getTotalPoints() {
        return Object.values(this.userProgress)
            .filter(p => p.completed)
            .reduce((total, p) => total + (p.points || 0), 0);
    }

    getCompletedCount() {
        return Object.values(this.userProgress)
            .filter(p => p.completed).length;
    }

    getTotalChallenges() {
        return Object.values(this.challenges)
            .reduce((total, lab) => total + lab.challenges.length, 0);
    }

    setCurrentLab(labId) {
        this.currentLab = labId;
        this.createChallengePanel(labId);
    }

    createChallengePanel(labId) {
        const lab = this.challenges[labId];
        if (!lab) return;

        // Remove existing panel
        const existingPanel = document.querySelector('.challenge-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // Create new panel
        const panel = document.createElement('div');
        panel.className = 'challenge-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3><i class="fas fa-tasks"></i> ${lab.name} Challenges</h3>
                <button class="panel-toggle" onclick="toggleChallengePanel()">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="panel-content">
                ${lab.challenges.map(challenge => this.createChallengeItem(challenge)).join('')}
            </div>
        `;

        document.body.appendChild(panel);
    }

    createChallengeItem(challenge) {
        const isCompleted = this.isCompleted(challenge.id);
        const completedClass = isCompleted ? 'completed' : '';
        
        return `
            <div class="challenge-item ${completedClass}" data-challenge-id="${challenge.id}">
                <div class="challenge-header">
                    <div class="challenge-status">
                        ${isCompleted ? '<i class="fas fa-check-circle"></i>' : '<i class="far fa-circle"></i>'}
                    </div>
                    <div class="challenge-info">
                        <h4>${challenge.title}</h4>
                        <p>${challenge.description}</p>
                    </div>
                    <div class="challenge-points">
                        ${challenge.points} pts
                    </div>
                </div>
                ${!isCompleted ? `
                    <div class="challenge-actions">
                        <button class="hint-btn" onclick="showHint('${challenge.id}')">
                            <i class="fas fa-lightbulb"></i> Hint
                        </button>
                        <form class="flag-form" data-challenge-id="${challenge.id}">
                            <input type="text" name="flag" placeholder="Enter flag..." required>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                ` : ''}
                <div class="challenge-hint" id="hint-${challenge.id}" style="display: none;">
                    💡 ${challenge.hint}
                </div>
            </div>
        `;
    }

    showHint(challengeId) {
        const hintElement = document.getElementById(`hint-${challengeId}`);
        if (hintElement) {
            hintElement.style.display = hintElement.style.display === 'none' ? 'block' : 'none';
        }
    }

    saveProgress() {
        localStorage.setItem('neuro-challenge-progress', JSON.stringify(this.userProgress));
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('neuro-challenge-progress');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    loadUserStats() {
        this.updateStats();
    }

    // Export progress for sharing/backup
    exportProgress() {
        return {
            progress: this.userProgress,
            stats: {
                totalPoints: this.getTotalPoints(),
                completedChallenges: this.getCompletedCount(),
                totalChallenges: this.getTotalChallenges()
            },
            timestamp: Date.now()
        };
    }

    // Import progress from backup
    importProgress(data) {
        if (data && data.progress) {
            this.userProgress = data.progress;
            this.saveProgress();
            this.updateStats();
        }
    }
}

// Global functions
function toggleChallengePanel() {
    const panel = document.querySelector('.challenge-panel');
    if (panel) {
        panel.classList.toggle('collapsed');
    }
}

function showHint(challengeId) {
    if (window.challengeSystem) {
        window.challengeSystem.showHint(challengeId);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.challengeSystem = new ChallengeSystem();
    
    // Set current lab from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const courseParam = urlParams.get('course');
    if (courseParam) {
        setTimeout(() => {
            window.challengeSystem.setCurrentLab(courseParam);
        }, 1000);
    }
});