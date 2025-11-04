// CTF Challenges Application
class CTFChallengesApp {
    constructor() {
        this.challenges = new Map();
        this.userProgress = new Map();
        this.setupApp();
    }

    setupApp() {
        this.loadChallenges();
        this.setupEventListeners();
    }

    loadChallenges() {
        const challenges = [
            {
                id: 'web_sqli_basic',
                category: 'Web Security',
                title: 'SQL Injection Login Bypass',
                difficulty: 'Easy',
                points: 100,
                description: 'Bypass the login form using SQL injection',
                flag: 'NEURO{sql_injection_bypass_success}',
                hint: "Try admin' OR 1=1--"
            },
            {
                id: 'web_xss_stored',
                category: 'Web Security', 
                title: 'Stored XSS Challenge',
                difficulty: 'Medium',
                points: 150,
                description: 'Execute JavaScript in the comment section',
                flag: 'NEURO{xss_payload_executed_successfully}',
                hint: 'Use <script> tags in comments'
            },
            {
                id: 'crypto_caesar_basic',
                category: 'Cryptography',
                title: 'Caesar Cipher Decode',
                difficulty: 'Easy',
                points: 75,
                description: 'Decode: QHXUR{FDHVDU_FLSKHU_FUDFNHG}',
                flag: 'NEURO{CAESAR_CIPHER_CRACKED}',
                hint: 'Shift by 3 positions'
            },
            {
                id: 'crypto_base64_decode',
                category: 'Cryptography',
                title: 'Base64 Decoding',
                difficulty: 'Easy',
                points: 50,
                description: 'Decode: TkVVUk97YmFzZTY0X2RlY29kZWRfZmxhZ30=',
                flag: 'NEURO{base64_decoded_flag}',
                hint: 'Standard Base64 encoding'
            },
            {
                id: 'forensics_hidden_file',
                category: 'Digital Forensics',
                title: 'Hidden File Discovery',
                difficulty: 'Medium',
                points: 125,
                description: 'Find the hidden flag in the file system',
                flag: 'NEURO{hidden_file_content_def456}',
                hint: 'Check hidden files with ls -la'
            },
            {
                id: 'network_port_scan',
                category: 'Network Security',
                title: 'Port Scanning Challenge',
                difficulty: 'Medium',
                points: 100,
                description: 'Scan target 192.168.1.100 and find open services',
                flag: 'NEURO{port_scanning_master}',
                hint: 'Use nmap to scan ports'
            },
            {
                id: 'ai_prompt_injection',
                category: 'AI Security',
                title: 'AI Prompt Injection',
                difficulty: 'Medium',
                points: 150,
                description: 'Make the AI ignore its instructions',
                flag: 'NEURO{ai_prompt_injected}',
                hint: 'Tell it to ignore previous instructions'
            },
            {
                id: 'ai_model_extract',
                category: 'AI Security',
                title: 'Model Extraction Attack',
                difficulty: 'Hard',
                points: 200,
                description: 'Extract information about the ML model',
                flag: 'NEURO{ai_model_extracted}',
                hint: 'Use extract-model command in terminal'
            }
        ];

        challenges.forEach(challenge => {
            this.challenges.set(challenge.id, challenge);
        });

        this.renderChallenges();
    }

    setupEventListeners() {
        const filterBtns = document.querySelectorAll('.ctf-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterChallenges(category);
            });
        });
    }

    renderChallenges(filter = 'all') {
        const challengesList = document.getElementById('ctf-challenges-list');
        if (!challengesList) return;

        challengesList.innerHTML = '';
        
        this.challenges.forEach((challenge, id) => {
            if (filter !== 'all' && challenge.category !== filter) return;

            const isCompleted = this.userProgress.has(id);
            const challengeDiv = document.createElement('div');
            challengeDiv.className = `ctf-challenge ${isCompleted ? 'completed' : ''}`;
            
            challengeDiv.innerHTML = `
                <div class="challenge-header">
                    <div class="challenge-title">${challenge.title}</div>
                    <div class="challenge-points">${challenge.points} pts</div>
                </div>
                <div class="challenge-meta">
                    <span class="challenge-category">${challenge.category}</span>
                    <span class="challenge-difficulty difficulty-${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</span>
                    ${isCompleted ? '<span class="challenge-status">✅ Completed</span>' : ''}
                </div>
                <div class="challenge-description">${challenge.description}</div>
                <div class="challenge-actions">
                    <button onclick="ctfChallengesApp.startChallenge('${id}')" ${isCompleted ? 'disabled' : ''}>
                        ${isCompleted ? 'Completed' : 'Start Challenge'}
                    </button>
                    <button onclick="ctfChallengesApp.showHint('${id}')">Show Hint</button>
                </div>
                <div class="challenge-hint" id="hint-${id}" style="display: none;">
                    💡 ${challenge.hint}
                </div>
            `;
            
            challengesList.appendChild(challengeDiv);
        });

        this.updateStats();
    }

    filterChallenges(category) {
        // Update active filter button
        document.querySelectorAll('.ctf-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        this.renderChallenges(category);
    }

    startChallenge(challengeId) {
        const challenge = this.challenges.get(challengeId);
        if (!challenge) return;

        const output = document.getElementById('ctf-output');
        
        switch (challengeId) {
            case 'web_sqli_basic':
                this.startSQLInjectionChallenge(challenge, output);
                break;
            case 'web_xss_stored':
                this.startXSSChallenge(challenge, output);
                break;
            case 'crypto_caesar_basic':
                this.startCaesarChallenge(challenge, output);
                break;
            case 'crypto_base64_decode':
                this.startBase64Challenge(challenge, output);
                break;
            case 'forensics_hidden_file':
                this.startForensicsChallenge(challenge, output);
                break;
            case 'network_port_scan':
                this.startNetworkChallenge(challenge, output);
                break;
            case 'ai_prompt_injection':
                this.startAIChallenge(challenge, output);
                break;
            case 'ai_model_extract':
                this.startModelExtractionChallenge(challenge, output);
                break;
            default:
                output.innerHTML = '<div class="challenge-error">Challenge not implemented yet</div>';
        }
    }

    startSQLInjectionChallenge(challenge, output) {
        output.innerHTML = `
            <div class="challenge-interface">
                <h4>🎯 ${challenge.title}</h4>
                <div class="login-form">
                    <h5>Bank Login Portal</h5>
                    <input type="text" id="sqli-username" placeholder="Username">
                    <input type="password" id="sqli-password" placeholder="Password">
                    <button onclick="ctfChallengesApp.testSQLInjection('${challenge.id}')">Login</button>
                </div>
                <div id="sqli-result"></div>
            </div>
        `;
    }

    testSQLInjection(challengeId) {
        const username = document.getElementById('sqli-username').value;
        const password = document.getElementById('sqli-password').value;
        const result = document.getElementById('sqli-result');

        if (username.includes("'") && (username.includes('OR') || username.includes('or'))) {
            result.innerHTML = `
                <div class="challenge-success">
                    ✅ SQL Injection Successful!<br>
                    Welcome Admin! You have bypassed the login.<br>
                    🏆 Flag: <strong>NEURO{sql_injection_bypass_success}</strong>
                </div>
            `;
            this.completeChallenge(challengeId, 'NEURO{sql_injection_bypass_success}');
        } else {
            result.innerHTML = '<div class="challenge-failed">❌ Login failed. Try SQL injection.</div>';
        }
    }

    startXSSChallenge(challenge, output) {
        output.innerHTML = `
            <div class="challenge-interface">
                <h4>🎯 ${challenge.title}</h4>
                <div class="comment-form">
                    <h5>Leave a Comment</h5>
                    <textarea id="xss-comment" placeholder="Enter your comment..."></textarea>
                    <button onclick="ctfChallengesApp.testXSS('${challenge.id}')">Post Comment</button>
                </div>
                <div id="xss-result"></div>
                <div id="comments-display"></div>
            </div>
        `;
    }

    testXSS(challengeId) {
        const comment = document.getElementById('xss-comment').value;
        const result = document.getElementById('xss-result');
        const display = document.getElementById('comments-display');

        if (comment.includes('<script>') || comment.includes('javascript:')) {
            result.innerHTML = `
                <div class="challenge-success">
                    ✅ XSS Attack Successful!<br>
                    JavaScript payload executed!<br>
                    🏆 Flag: <strong>NEURO{xss_payload_executed_successfully}</strong>
                </div>
            `;
            display.innerHTML = '<div class="xss-demo">🚨 XSS Alert: Script executed!</div>';
            this.completeChallenge(challengeId, 'NEURO{xss_payload_executed_successfully}');
        } else {
            display.innerHTML = `<div class="comment">Comment: ${this.sanitizeInput(comment)}</div>`;
            result.innerHTML = '<div class="challenge-failed">❌ No XSS detected. Try injecting JavaScript.</div>';
        }
    }

    startCaesarChallenge(challenge, output) {
        output.innerHTML = `
            <div class="challenge-interface">
                <h4>🎯 ${challenge.title}</h4>
                <div class="crypto-challenge">
                    <div class="cipher-text">QHXUR{FDHVDU_FLSKHU_FUDFNHG}</div>
                    <input type="text" id="caesar-answer" placeholder="Enter decoded text">
                    <button onclick="ctfChallengesApp.checkCaesar('${challenge.id}')">Submit</button>
                </div>
                <div id="caesar-result"></div>
            </div>
        `;
    }

    checkCaesar(challengeId) {
        const answer = document.getElementById('caesar-answer').value.toUpperCase();
        const result = document.getElementById('caesar-result');

        if (answer === 'NEURO{CAESAR_CIPHER_CRACKED}') {
            result.innerHTML = `
                <div class="challenge-success">
                    ✅ Correct! Caesar cipher decoded.<br>
                    🏆 Flag: <strong>NEURO{CAESAR_CIPHER_CRACKED}</strong>
                </div>
            `;
            this.completeChallenge(challengeId, 'NEURO{CAESAR_CIPHER_CRACKED}');
        } else {
            result.innerHTML = '<div class="challenge-failed">❌ Incorrect. Try shifting by 3 positions.</div>';
        }
    }

    startBase64Challenge(challenge, output) {
        output.innerHTML = `
            <div class="challenge-interface">
                <h4>🎯 ${challenge.title}</h4>
                <div class="crypto-challenge">
                    <div class="cipher-text">TkVVUk97YmFzZTY0X2RlY29kZWRfZmxhZ30=</div>
                    <input type="text" id="base64-answer" placeholder="Enter decoded text">
                    <button onclick="ctfChallengesApp.checkBase64('${challenge.id}')">Submit</button>
                </div>
                <div id="base64-result"></div>
            </div>
        `;
    }

    checkBase64(challengeId) {
        const answer = document.getElementById('base64-answer').value;
        const result = document.getElementById('base64-result');

        if (answer === 'NEURO{base64_decoded_flag}') {
            result.innerHTML = `
                <div class="challenge-success">
                    ✅ Correct! Base64 decoded successfully.<br>
                    🏆 Flag: <strong>NEURO{base64_decoded_flag}</strong>
                </div>
            `;
            this.completeChallenge(challengeId, 'NEURO{base64_decoded_flag}');
        } else {
            result.innerHTML = '<div class="challenge-failed">❌ Incorrect. Use Base64 decoding.</div>';
        }
    }

    startForensicsChallenge(challenge, output) {
        output.innerHTML = `
            <div class="challenge-interface">
                <h4>🎯 ${challenge.title}</h4>
                <div class="forensics-challenge">
                    <p>Use the terminal to find hidden files in the system.</p>
                    <p>Hint: Check the current directory for hidden files.</p>
                    <button onclick="ctfChallengesApp.simulateForensics('${challenge.id}')">
                        Simulate File Discovery
                    </button>
                </div>
                <div id="forensics-result"></div>
            </div>
        `;
    }

    simulateForensics(challengeId) {
        const result = document.getElementById('forensics-result');
        result.innerHTML = `
            <div class="challenge-success">
                ✅ Hidden file found: .secret_flag.txt<br>
                Content: NEURO{hidden_file_content_def456}<br>
                🏆 Flag: <strong>NEURO{hidden_file_content_def456}</strong>
            </div>
        `;
        this.completeChallenge(challengeId, 'NEURO{hidden_file_content_def456}');
    }

    startNetworkChallenge(challenge, output) {
        output.innerHTML = `
            <div class="challenge-interface">
                <h4>🎯 ${challenge.title}</h4>
                <div class="network-challenge">
                    <p>Scan target: 192.168.1.100</p>
                    <button onclick="ctfChallengesApp.simulatePortScan('${challenge.id}')">
                        Run Port Scan
                    </button>
                </div>
                <div id="network-result"></div>
            </div>
        `;
    }

    simulatePortScan(challengeId) {
        const result = document.getElementById('network-result');
        result.innerHTML = `
            <div class="scan-output">
                Nmap scan results:<br>
                22/tcp open ssh<br>
                80/tcp open http<br>
                443/tcp open https<br>
                3306/tcp open mysql<br><br>
                <div class="challenge-success">
                    ✅ Port scan completed!<br>
                    🏆 Flag: <strong>NEURO{port_scanning_master}</strong>
                </div>
            </div>
        `;
        this.completeChallenge(challengeId, 'NEURO{port_scanning_master}');
    }

    startAIChallenge(challenge, output) {
        output.innerHTML = `
            <div class="challenge-interface">
                <h4>🎯 ${challenge.title}</h4>
                <div class="ai-challenge">
                    <p>Go to the AI Chat app and try to make the AI ignore its safety instructions.</p>
                    <button onclick="window.vm.switchApp('ai-chat')">Open AI Chat</button>
                </div>
            </div>
        `;
    }

    startModelExtractionChallenge(challenge, output) {
        output.innerHTML = `
            <div class="challenge-interface">
                <h4>🎯 ${challenge.title}</h4>
                <div class="ai-challenge">
                    <p>Use the terminal to extract ML model information.</p>
                    <p>Switch to AI Hacking course and use: extract-model</p>
                    <button onclick="window.vm.switchApp('terminal')">Open Terminal</button>
                </div>
            </div>
        `;
    }

    showHint(challengeId) {
        const hintDiv = document.getElementById(`hint-${challengeId}`);
        if (hintDiv) {
            hintDiv.style.display = hintDiv.style.display === 'none' ? 'block' : 'none';
        }
    }

    completeChallenge(challengeId, flag) {
        this.userProgress.set(challengeId, {
            completed: true,
            flag: flag,
            timestamp: new Date()
        });

        // Submit flag to flag system
        if (window.flagSystem) {
            window.flagSystem.addFlag(flag);
        }

        // Update display
        this.renderChallenges();
        
        // Show completion notification
        this.showNotification(`Challenge completed! +${this.challenges.get(challengeId).points} points`);
    }

    updateStats() {
        const totalChallenges = this.challenges.size;
        const completedChallenges = this.userProgress.size;
        const totalPoints = Array.from(this.userProgress.keys()).reduce((sum, id) => {
            return sum + this.challenges.get(id).points;
        }, 0);

        const statsDiv = document.getElementById('ctf-stats');
        if (statsDiv) {
            statsDiv.innerHTML = `
                <div class="stat">Completed: ${completedChallenges}/${totalChallenges}</div>
                <div class="stat">Points: ${totalPoints}</div>
                <div class="stat">Progress: ${Math.round((completedChallenges/totalChallenges)*100)}%</div>
            `;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'ctf-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #00ff41;
            color: #000;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-weight: bold;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.replace(/[<>"'&]/g, function(match) {
            const escapeMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return escapeMap[match];
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('ctf-challenges-app')) {
        window.ctfChallengesApp = new CTFChallengesApp();
    }
});