// Bank Security Application
class BankSecurity {
    constructor() {
        this.currentSection = 'overview';
        this.vulnerabilities = this.initVulnerabilities();
        this.attacks = this.initAttacks();
        this.ctfChallenges = this.initCTFChallenges();
        this.setupEventListeners();
    }

    initVulnerabilities() {
        return {
            'sqli': {
                name: 'SQL Injection',
                description: 'Database manipulation through malicious SQL queries',
                impact: 'Data breach, unauthorized access, data manipulation',
                example: "admin' OR 1=1--",
                mitigation: 'Parameterized queries, input validation, WAF'
            },
            'xss': {
                name: 'Cross-Site Scripting',
                description: 'Client-side code injection attacks',
                impact: 'Session hijacking, credential theft, defacement',
                example: '<script>alert("XSS")</script>',
                mitigation: 'Input sanitization, CSP headers, output encoding'
            },
            'csrf': {
                name: 'Cross-Site Request Forgery',
                description: 'Unauthorized actions on behalf of authenticated users',
                impact: 'Unauthorized transactions, account manipulation',
                example: 'Hidden form submissions, malicious links',
                mitigation: 'CSRF tokens, SameSite cookies, referrer validation'
            },
            'session': {
                name: 'Session Management Flaws',
                description: 'Weak session handling and authentication bypass',
                impact: 'Account takeover, privilege escalation',
                example: 'Predictable session IDs, session fixation',
                mitigation: 'Secure session generation, proper timeout, HTTPS'
            }
        };
    }

    initAttacks() {
        return {
            'phishing': {
                name: 'Phishing Campaign',
                description: 'Email-based social engineering attack',
                steps: ['Email crafting', 'Credential harvesting', 'Account compromise'],
                success_rate: '73%'
            },
            'mitm': {
                name: 'Man-in-the-Middle Attack',
                description: 'Network traffic interception and manipulation',
                steps: ['Network positioning', 'Traffic capture', 'Data extraction'],
                success_rate: '45%'
            },
            'malware': {
                name: 'Banking Malware',
                description: 'Credential stealing trojan deployment',
                steps: ['Malware delivery', 'System infection', 'Data exfiltration'],
                success_rate: '62%'
            }
        };
    }

    initCTFChallenges() {
        return {
            'login-bypass': {
                name: 'Login Bypass Challenge',
                difficulty: 'Easy',
                description: 'Bypass authentication using SQL injection',
                flag: 'BANK{sql_injection_bypass_admin123}',
                hint: 'Try common SQL injection payloads in username field'
            },
            'session-hijack': {
                name: 'Session Hijacking Challenge',
                difficulty: 'Medium',
                description: 'Steal and use another user\'s session token',
                flag: 'BANK{session_token_stolen_abc123xyz}',
                hint: 'Look for session tokens in cookies or local storage'
            },
            'payment-bypass': {
                name: 'Payment Gateway Bypass',
                difficulty: 'Hard',
                description: 'Manipulate transaction amounts during payment',
                flag: 'BANK{payment_manipulation_amount_modified}',
                hint: 'Intercept and modify payment requests'
            },
            'admin-panel': {
                name: 'Admin Panel Access',
                difficulty: 'Hard',
                description: 'Gain unauthorized access to admin functionality',
                flag: 'BANK{admin_access_gained_privilege_escalation}',
                hint: 'Look for privilege escalation vulnerabilities'
            },
            'crypto-wallet': {
                name: 'Crypto Wallet Hack',
                difficulty: 'Medium',
                description: 'Exploit blockchain transaction vulnerabilities',
                flag: 'BANK{crypto_wallet_hacked_blockchain_exploit}',
                hint: 'Analyze smart contract vulnerabilities'
            },
            'insider-threat': {
                name: 'Insider Threat Detection',
                difficulty: 'Hard',
                description: 'Identify malicious employee activities',
                flag: 'BANK{insider_threat_detected_employee_malicious}',
                hint: 'Analyze user behavior patterns and access logs'
            }
        };
    }

    setupEventListeners() {
        // Wait for DOM to be ready
        setTimeout(() => {
            // Navigation event listeners
            const navItems = document.querySelectorAll('#bank-security-app .nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = e.target.dataset.section;
                    if (section) {
                        this.switchSection(section);
                    }
                });
            });
        }, 500);
    }

    switchSection(section) {
        // Remove active class from all nav items and sections
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

        // Add active class to selected nav item and section
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        document.getElementById(`${section}-section`).classList.add('active');

        this.currentSection = section;
    }

    loadVulnerability(vulnType) {
        const vuln = this.vulnerabilities[vulnType];
        const detailsContainer = document.getElementById('vulnerability-details');
        
        detailsContainer.innerHTML = `
            <div class="vulnerability-detail">
                <div class="vuln-header">
                    <h4>${vuln.name}</h4>
                    <div class="vuln-actions">
                        <button onclick="bankSecurity.demonstrateVuln('${vulnType}')" class="demo-btn">
                            <i class="fas fa-play"></i> Demonstrate
                        </button>
                        <button onclick="bankSecurity.exploitVuln('${vulnType}')" class="exploit-btn">
                            <i class="fas fa-bug"></i> Exploit
                        </button>
                    </div>
                </div>
                <div class="vuln-content">
                    <div class="vuln-info">
                        <h5>Description:</h5>
                        <p>${vuln.description}</p>
                        
                        <h5>Impact:</h5>
                        <p>${vuln.impact}</p>
                        
                        <h5>Example:</h5>
                        <code>${vuln.example}</code>
                        
                        <h5>Mitigation:</h5>
                        <p>${vuln.mitigation}</p>
                    </div>
                </div>
                <div id="vuln-demo-result"></div>
            </div>
        `;
    }

    demonstrateVuln(vulnType) {
        const resultContainer = document.getElementById('vuln-demo-result');
        const vuln = this.vulnerabilities[vulnType];
        
        resultContainer.innerHTML = `
            <div class="demo-result">
                <h5>🎯 Vulnerability Demonstration: ${vuln.name}</h5>
                <div class="demo-steps">
                    <div class="step">Step 1: Identifying injection point</div>
                    <div class="step">Step 2: Crafting malicious payload</div>
                    <div class="step">Step 3: Executing attack</div>
                    <div class="step success">✅ Vulnerability confirmed!</div>
                </div>
                <div class="demo-output">
                    <strong>Result:</strong> ${vuln.impact}
                </div>
            </div>
        `;
    }

    exploitVuln(vulnType) {
        const resultContainer = document.getElementById('vuln-demo-result');
        
        setTimeout(() => {
            resultContainer.innerHTML = `
                <div class="exploit-result">
                    <h5>🚨 Exploitation Successful!</h5>
                    <div class="exploit-details">
                        <p><strong>Attack Vector:</strong> ${vulnType.toUpperCase()}</p>
                        <p><strong>Access Level:</strong> Administrator</p>
                        <p><strong>Data Compromised:</strong> Customer database, transaction logs</p>
                        <p><strong>Flag Discovered:</strong> <code>BANK{${vulnType}_exploit_successful}</code></p>
                    </div>
                </div>
            `;
        }, 1500);
    }

    simulateAttack(attackType) {
        const attack = this.attacks[attackType];
        const resultContainer = document.getElementById('attack-results');
        
        resultContainer.innerHTML = `
            <div class="attack-simulation">
                <h4>🎯 Simulating: ${attack.name}</h4>
                <div class="attack-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text">Initializing attack...</div>
                </div>
                <div class="attack-steps">
                    ${attack.steps.map((step, index) => `
                        <div class="attack-step" id="step-${index}">
                            <i class="fas fa-circle"></i> ${step}
                        </div>
                    `).join('')}
                </div>
                <div id="attack-final-result"></div>
            </div>
        `;

        // Simulate attack progress
        let progress = 0;
        const progressBar = resultContainer.querySelector('.progress-fill');
        const progressText = resultContainer.querySelector('.progress-text');
        
        const interval = setInterval(() => {
            progress += 20;
            progressBar.style.width = progress + '%';
            
            if (progress === 20) progressText.textContent = 'Reconnaissance phase...';
            else if (progress === 40) progressText.textContent = 'Vulnerability scanning...';
            else if (progress === 60) progressText.textContent = 'Exploit deployment...';
            else if (progress === 80) progressText.textContent = 'Data extraction...';
            else if (progress === 100) {
                progressText.textContent = 'Attack completed!';
                clearInterval(interval);
                
                // Show final results
                document.getElementById('attack-final-result').innerHTML = `
                    <div class="attack-success">
                        <h5>✅ Attack Simulation Complete</h5>
                        <div class="attack-stats">
                            <p><strong>Success Rate:</strong> ${attack.success_rate}</p>
                            <p><strong>Time to Compromise:</strong> ${Math.floor(Math.random() * 45 + 15)} minutes</p>
                            <p><strong>Data Accessed:</strong> ${Math.floor(Math.random() * 10000 + 1000)} records</p>
                        </div>
                    </div>
                `;
            }
        }, 800);
    }

    analyzeTransaction() {
        const resultContainer = document.getElementById('forensics-results');
        
        resultContainer.innerHTML = `
            <div class="forensics-analysis">
                <h4>💰 Transaction Analysis Results</h4>
                <div class="analysis-data">
                    <div class="suspicious-transactions">
                        <h5>Suspicious Transactions Detected:</h5>
                        <div class="transaction-item">
                            <span class="tx-id">TX-2024-001337</span>
                            <span class="tx-amount">$50,000</span>
                            <span class="tx-flag">🚨 Unusual amount</span>
                        </div>
                        <div class="transaction-item">
                            <span class="tx-id">TX-2024-001338</span>
                            <span class="tx-amount">$0.01</span>
                            <span class="tx-flag">🚨 Micro-transaction pattern</span>
                        </div>
                        <div class="transaction-item">
                            <span class="tx-id">TX-2024-001339</span>
                            <span class="tx-amount">$9,999</span>
                            <span class="tx-flag">🚨 Just below reporting threshold</span>
                        </div>
                    </div>
                    <div class="analysis-conclusion">
                        <p><strong>Conclusion:</strong> Money laundering pattern detected</p>
                        <p><strong>Evidence:</strong> Structured transactions to avoid detection</p>
                        <p><strong>Flag:</strong> <code>BANK{transaction_analysis_money_laundering}</code></p>
                    </div>
                </div>
            </div>
        `;
    }

    analyzeLogs() {
        const resultContainer = document.getElementById('forensics-results');
        
        resultContainer.innerHTML = `
            <div class="forensics-analysis">
                <h4>📋 Security Log Analysis</h4>
                <div class="log-analysis">
                    <div class="log-entries">
                        <div class="log-entry suspicious">
                            <span class="log-time">2024-01-15 02:30:15</span>
                            <span class="log-event">Multiple failed login attempts from IP: 192.168.1.100</span>
                        </div>
                        <div class="log-entry suspicious">
                            <span class="log-time">2024-01-15 02:31:45</span>
                            <span class="log-event">Successful login from same IP after 90 seconds</span>
                        </div>
                        <div class="log-entry critical">
                            <span class="log-time">2024-01-15 02:32:10</span>
                            <span class="log-event">Admin privileges escalated for user: temp_user</span>
                        </div>
                        <div class="log-entry critical">
                            <span class="log-time">2024-01-15 02:35:22</span>
                            <span class="log-event">Database backup downloaded by temp_user</span>
                        </div>
                    </div>
                    <div class="log-conclusion">
                        <p><strong>Attack Pattern:</strong> Brute force followed by privilege escalation</p>
                        <p><strong>Compromised Account:</strong> temp_user (likely insider threat)</p>
                        <p><strong>Flag:</strong> <code>BANK{log_analysis_insider_attack_detected}</code></p>
                    </div>
                </div>
            </div>
        `;
    }

    networkForensics() {
        const resultContainer = document.getElementById('forensics-results');
        
        resultContainer.innerHTML = `
            <div class="forensics-analysis">
                <h4>🌐 Network Forensics Analysis</h4>
                <div class="network-analysis">
                    <div class="traffic-patterns">
                        <h5>Suspicious Network Activity:</h5>
                        <div class="traffic-item">
                            <span class="traffic-src">192.168.1.100</span>
                            <span class="traffic-dst">bank-server.local:443</span>
                            <span class="traffic-size">2.3 GB transferred</span>
                            <span class="traffic-flag">🚨 Unusual data volume</span>
                        </div>
                        <div class="traffic-item">
                            <span class="traffic-src">Internal-PC-05</span>
                            <span class="traffic-dst">tor-exit-node.onion</span>
                            <span class="traffic-size">Encrypted tunnel</span>
                            <span class="traffic-flag">🚨 Anonymization network</span>
                        </div>
                    </div>
                    <div class="network-conclusion">
                        <p><strong>Threat Assessment:</strong> Data exfiltration via encrypted channel</p>
                        <p><strong>Attack Vector:</strong> Internal system compromised</p>
                        <p><strong>Flag:</strong> <code>BANK{network_forensics_data_exfiltration}</code></p>
                    </div>
                </div>
            </div>
        `;
    }

    startCTF(challengeId) {
        const challenge = this.ctfChallenges[challengeId];
        const resultContainer = document.getElementById('ctf-results');
        
        resultContainer.innerHTML = `
            <div class="ctf-challenge-active">
                <div class="ctf-header">
                    <h4>🏆 ${challenge.name}</h4>
                    <div class="ctf-difficulty ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</div>
                </div>
                <div class="ctf-description">
                    <p>${challenge.description}</p>
                </div>
                <div class="ctf-interface">
                    ${this.generateCTFInterface(challengeId)}
                </div>
                <div class="ctf-hint">
                    <strong>💡 Hint:</strong> ${challenge.hint}
                </div>
                <div id="ctf-challenge-result"></div>
            </div>
        `;
    }

    generateCTFInterface(challengeId) {
        switch(challengeId) {
            case 'login-bypass':
                return `
                    <div class="login-form">
                        <h5>Bank Login Portal</h5>
                        <input type="text" id="ctf-username" placeholder="Username">
                        <input type="password" id="ctf-password" placeholder="Password">
                        <button onclick="bankSecurity.attemptLogin('${challengeId}')">Login</button>
                    </div>
                `;
            case 'session-hijack':
                return `
                    <div class="session-interface">
                        <h5>Active Sessions</h5>
                        <div class="session-list">
                            <div class="session-item" onclick="bankSecurity.hijackSession('${challengeId}', 'admin')">
                                <span>admin_user</span>
                                <span>Session: abc123xyz789</span>
                            </div>
                            <div class="session-item" onclick="bankSecurity.hijackSession('${challengeId}', 'user')">
                                <span>regular_user</span>
                                <span>Session: def456uvw012</span>
                            </div>
                        </div>
                    </div>
                `;
            case 'payment-bypass':
                return `
                    <div class="payment-form">
                        <h5>Payment Gateway</h5>
                        <input type="number" id="payment-amount" value="100" placeholder="Amount">
                        <input type="text" id="payment-recipient" value="merchant@bank.com" placeholder="Recipient">
                        <button onclick="bankSecurity.processPayment('${challengeId}')">Process Payment</button>
                    </div>
                `;
            default:
                return `
                    <div class="generic-interface">
                        <button onclick="bankSecurity.solveCTF('${challengeId}')" class="solve-btn">
                            Start Challenge
                        </button>
                    </div>
                `;
        }
    }

    attemptLogin(challengeId) {
        const username = document.getElementById('ctf-username').value;
        const password = document.getElementById('ctf-password').value;
        const resultContainer = document.getElementById('ctf-challenge-result');
        
        if (username.includes("'") || username.includes("OR") || username.includes("--")) {
            resultContainer.innerHTML = `
                <div class="ctf-success">
                    <h5>🎉 SQL Injection Successful!</h5>
                    <p>Admin access granted with payload: <code>${username}</code></p>
                    <p><strong>Flag Captured:</strong> <code>${this.ctfChallenges[challengeId].flag}</code></p>
                </div>
            `;
        } else {
            resultContainer.innerHTML = `
                <div class="ctf-failed">
                    <p>❌ Login failed. Try SQL injection techniques.</p>
                </div>
            `;
        }
    }

    hijackSession(challengeId, sessionType) {
        const resultContainer = document.getElementById('ctf-challenge-result');
        
        if (sessionType === 'admin') {
            resultContainer.innerHTML = `
                <div class="ctf-success">
                    <h5>🎉 Session Hijacked Successfully!</h5>
                    <p>Admin session token captured and reused</p>
                    <p><strong>Flag Captured:</strong> <code>${this.ctfChallenges[challengeId].flag}</code></p>
                </div>
            `;
        } else {
            resultContainer.innerHTML = `
                <div class="ctf-failed">
                    <p>❌ Regular user session. Try targeting admin session.</p>
                </div>
            `;
        }
    }

    processPayment(challengeId) {
        const amount = document.getElementById('payment-amount').value;
        const resultContainer = document.getElementById('ctf-challenge-result');
        
        if (amount !== '100') {
            resultContainer.innerHTML = `
                <div class="ctf-success">
                    <h5>🎉 Payment Amount Manipulated!</h5>
                    <p>Successfully changed payment from $100 to $${amount}</p>
                    <p><strong>Flag Captured:</strong> <code>${this.ctfChallenges[challengeId].flag}</code></p>
                </div>
            `;
        } else {
            resultContainer.innerHTML = `
                <div class="ctf-failed">
                    <p>❌ Payment processed normally. Try manipulating the amount.</p>
                </div>
            `;
        }
    }

    solveCTF(challengeId) {
        const challenge = this.ctfChallenges[challengeId];
        const resultContainer = document.getElementById('ctf-challenge-result');
        
        setTimeout(() => {
            resultContainer.innerHTML = `
                <div class="ctf-success">
                    <h5>🎉 Challenge Completed!</h5>
                    <p>${challenge.description}</p>
                    <p><strong>Flag Captured:</strong> <code>${challenge.flag}</code></p>
                </div>
            `;
        }, 2000);
    }
}

// Initialize Bank Security app
document.addEventListener('DOMContentLoaded', function() {
    // Wait for VM to be ready
    setTimeout(() => {
        window.bankSecurity = new BankSecurity();
        
        // Re-initialize when bank security app is opened
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const bankApp = document.getElementById('bank-security-app');
                    if (bankApp && bankApp.classList.contains('active')) {
                        // App is now active, reinitialize
                        setTimeout(() => {
                            if (window.bankSecurity) {
                                window.bankSecurity.setupEventListeners();
                            }
                        }, 100);
                    }
                }
            });
        });
        
        const bankApp = document.getElementById('bank-security-app');
        if (bankApp) {
            observer.observe(bankApp, { attributes: true });
        }
    }, 1000);
});