// Browser System
class Browser {
    constructor() {
        this.currentUrl = 'https://neuro-dev.local';
        this.currentCourse = 'termux-basics';
    }

    // Sanitize input to prevent XSS
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

    loadCourseContent(courseName) {
        this.currentCourse = courseName;
        const content = this.getCourseContent(courseName);
        document.getElementById('browser-content').innerHTML = content;
    }

    getCourseContent(course) {
        const contents = {
            'termux-basics': `
                <div class="homepage">
                    <h1>🔧 Termux Learning Environment</h1>
                    <div class="quick-links">
                        <div class="link-card" onclick="browser.loadPage('termux-commands')">
                            <i class="fas fa-terminal"></i>
                            <h3>Command Reference</h3>
                            <p>Complete Termux commands guide</p>
                        </div>
                        <div class="link-card" onclick="browser.loadPage('package-manager')">
                            <i class="fas fa-download"></i>
                            <h3>Package Manager</h3>
                            <p>pkg install, update, upgrade guide</p>
                        </div>
                    </div>
                </div>
            `,
            'nethunter-rootless': `
                <div class="homepage">
                    <h1>🛡️ NetHunter Security Lab</h1>
                    <div class="quick-links">
                        <div class="link-card" onclick="browser.loadPage('nmap-targets')">
                            <i class="fas fa-crosshairs"></i>
                            <h3>Scan Targets</h3>
                            <p>Practice network scanning</p>
                        </div>
                        <div class="link-card" onclick="browser.loadPage('metasploit-lab')">
                            <i class="fas fa-bug"></i>
                            <h3>Metasploit Lab</h3>
                            <p>Exploit development practice</p>
                        </div>
                    </div>
                </div>
            `,
            'web-security': `
                <div class="homepage">
                    <h1>🔒 Web Security Testing</h1>
                    <div class="quick-links">
                        <div class="link-card" onclick="browser.loadPage('vulnerable-app')">
                            <i class="fas fa-bug"></i>
                            <h3>Vulnerable Web App</h3>
                            <p>Practice SQL injection, XSS</p>
                        </div>
                        <div class="link-card" onclick="browser.loadPage('owasp-top10')">
                            <i class="fas fa-list"></i>
                            <h3>OWASP Top 10</h3>
                            <p>Web application security risks</p>
                        </div>
                    </div>
                </div>
            `,
            'python-complete': `
                <div class="homepage">
                    <h1>🐍 Python Development Environment</h1>
                    <div class="quick-links">
                        <div class="link-card" onclick="browser.loadPage('python-docs')">
                            <i class="fas fa-book"></i>
                            <h3>Python Documentation</h3>
                            <p>Complete Python reference</p>
                        </div>
                        <div class="link-card" onclick="browser.loadPage('code-examples')">
                            <i class="fas fa-code"></i>
                            <h3>Code Examples</h3>
                            <p>Ready-to-use Python scripts</p>
                        </div>
                    </div>
                </div>
            `,
            'hands-on-ml-scikit-learn': `
                <div class="ml-theory-app">
                    <div class="app-header">
                        <h1>🧠 ML Theory Explorer</h1>
                        <p>Interactive Machine Learning Concepts - Roman Urdu mein</p>
                    </div>
                    <div class="chapter-grid">
                        <div class="chapter-card" onclick="browser.openChapter(1)">
                            <div class="chapter-number">01</div>
                            <h3>ML Landscape</h3>
                            <p>Machine Learning ki duniya</p>
                            <div class="chapter-progress">5 lessons</div>
                        </div>
                        <div class="chapter-card" onclick="browser.openChapter(2)">
                            <div class="chapter-number">02</div>
                            <h3>End-to-End Project</h3>
                            <p>Complete ML project</p>
                            <div class="chapter-progress">8 lessons</div>
                        </div>
                        <div class="chapter-card" onclick="browser.openChapter(3)">
                            <div class="chapter-number">03</div>
                            <h3>Classification</h3>
                            <p>Data ko classify karna</p>
                            <div class="chapter-progress">6 lessons</div>
                        </div>
                    </div>
                    <div id="chapter-content"></div>
                </div>
            `,
            'python-ai-ml': `
                <div class="jupyter-notebook">
                    <div class="notebook-header">
                        <div class="notebook-title">🤖 Neural Network Training.ipynb</div>
                        <div class="notebook-controls">
                            <button onclick="browser.runCell(1)">▶️ Run</button>
                            <button onclick="browser.addCell()">➕ Cell</button>
                        </div>
                    </div>
                    <div class="notebook-cells">
                        <div class="cell code-cell" id="cell-1">
                            <div class="cell-input">
                                <span class="cell-prompt">In [1]:</span>
                                <textarea class="cell-code">import tensorflow as tf
from tensorflow import keras
import numpy as np

# Load CIFAR-10
(x_train, y_train), (x_test, y_test) = keras.datasets.cifar10.load_data()
x_train = x_train / 255.0
print(f"Training: {x_train.shape}, Test: {x_test.shape}")</textarea>
                            </div>
                            <div class="cell-output" id="output-1"></div>
                        </div>
                    </div>
                </div>
            `,
            'ai-hacking': `
                <div class="homepage">
                    <h1>🎯 AI Security Lab - Neuro-Dev Target</h1>
                    <div class="quick-links">
                        <div class="link-card" onclick="browser.loadPage('neuro-dev-api')">
                            <i class="fas fa-crosshairs"></i>
                            <h3>ML API Target</h3>
                            <p>ml-api.neuro-dev:8080</p>
                        </div>
                        <div class="link-card" onclick="browser.loadPage('model-extraction')">
                            <i class="fas fa-download"></i>
                            <h3>Model Extraction</h3>
                            <p>Extract ML models</p>
                        </div>
                    </div>
                </div>
            `
        };
        
        return contents[course] || contents['termux-basics'];
    }

    loadPage(page) {
        const pages = {
            'termux-commands': this.generateInteractivePage('Termux Commands', [
                { cmd: 'pkg update', desc: 'Update package lists' },
                { cmd: 'pkg install python', desc: 'Install Python' },
                { cmd: 'ls -la', desc: 'List files with details' }
            ]),
            'vulnerable-app': this.generateVulnerableApp(),
            'owasp-top10': this.generateOWASPGuide(),
            'neuro-dev-api': this.generateAPITarget(),
            'model-extraction': this.generateModelExtractionLab(),
            'ctf-challenges': this.generateCtfChallengesHub(),
            'advanced-ctf': this.generateAdvancedCtfHub(),
            'ctf-hidden-login': this.generateCtfHiddenLogin(),
            'ctf-api-exploit': this.generateCtfApiExploit(),
            'ctf-file-discovery': this.generateCtfFileDiscovery(),
            'model-poisoning': this.generateModelPoisoning(),
            'banking-trojan': this.generateBankingTrojan(),
            'quantum-crypto': this.generateQuantumCrypto(),
            '5g-hijacking': this.generate5gHijacking(),
            'satellite-hack': this.generateSatelliteHack(),
            'deepfake-detection': this.generateDeepfakeDetection(),
            'web-exploitation': this.generateWebExploitation(),
            'crypto-challenges': this.generateCryptoChallenges(),
            'forensics-lab': this.generateForensicsLab(),
            'osint-challenges': this.generateOsintChallenges()
        };
        
        document.getElementById('browser-content').innerHTML = pages[page] || '<h2>Page not found</h2>';
    }

    generateInteractivePage(title, commands) {
        const sanitizedTitle = this.sanitizeInput(title);
        return `
            <div class="interactive-page">
                <h2>${sanitizedTitle}</h2>
                <div class="command-grid">
                    ${commands.map(cmd => {
                        const sanitizedCmd = this.sanitizeInput(cmd.cmd);
                        const sanitizedDesc = this.sanitizeInput(cmd.desc);
                        return `
                            <div class="interactive-command" onclick="browser.executeCommand('${sanitizedCmd}')">
                                <code>${sanitizedCmd}</code>
                                <p>${sanitizedDesc}</p>
                                <button class="try-btn">Try in Terminal</button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    generateVulnerableApp() {
        return `
            <div class="vulnerable-app">
                <h2>🐛 Vulnerable Web Application</h2>
                <div class="app-container">
                    <form class="login-form" onsubmit="browser.testSQLInjection(event)">
                        <h3>Login Portal</h3>
                        <input type="text" id="username" placeholder="Username" required>
                        <input type="password" id="password" placeholder="Password" required>
                        <button type="submit">Login</button>
                    </form>
                    <div class="vulnerability-hints">
                        <h4>🎯 Try These Attacks:</h4>
                        <div class="hint-item" onclick="browser.fillSQLInjection()">
                            <strong>SQL Injection:</strong> admin' OR 1=1--
                        </div>
                    </div>
                    <div id="attack-result"></div>
                </div>
            </div>
        `;
    }

    generateOWASPGuide() {
        return `
            <div class="owasp-guide">
                <h2>🔒 OWASP Top 10 - 2021</h2>
                <div class="owasp-list">
                    <div class="owasp-item high">
                        <div class="owasp-id">A01</div>
                        <div class="owasp-name">Broken Access Control</div>
                        <div class="owasp-risk">High</div>
                    </div>
                    <div class="owasp-item high">
                        <div class="owasp-id">A02</div>
                        <div class="owasp-name">Cryptographic Failures</div>
                        <div class="owasp-risk">High</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateAPITarget() {
        return `
            <div class="api-target">
                <h2>🎯 Neuro-Dev ML API - Security Assessment</h2>
                <div class="api-info">
                    <div class="api-header">
                        <span class="api-status online">🟢 Online</span>
                        <span class="api-url">https://ml-api.neuro-dev:8080</span>
                    </div>
                </div>
                <div class="api-endpoints">
                    <div class="endpoint-item safe" onclick="browser.testEndpoint('/health')">
                        <div class="method">GET</div>
                        <div class="path">/health</div>
                        <div class="status">✅ Safe</div>
                    </div>
                </div>
                <div id="api-response"></div>
            </div>
        `;
    }

    generateModelExtractionLab() {
        return `
            <div class="extraction-lab">
                <h2>🔓 Model Extraction Laboratory</h2>
                <div class="lab-interface">
                    <div class="target-info">
                        <h3>Target: ml-api.neuro-dev</h3>
                        <div class="model-details">
                            <div class="detail-item">Type: Random Forest</div>
                            <div class="detail-item">Features: 4</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    openChapter(chapterNum) {
        const chapters = {
            1: {
                title: 'Machine Learning Landscape',
                urdu: 'ML ki Duniya',
                lessons: [
                    { title: 'What is ML?', urdu: 'ML kya hai?' },
                    { title: 'Types of ML', urdu: 'ML ke types' }
                ]
            }
        };
        
        const chapter = chapters[chapterNum];
        if (!chapter) return;
        
        const content = document.getElementById('chapter-content');
        content.innerHTML = `
            <div class="chapter-detail">
                <div class="chapter-header">
                    <button onclick="browser.loadCourseContent('hands-on-ml-scikit-learn')" class="back-btn">← Back</button>
                    <h2>Chapter ${chapterNum}: ${chapter.title}</h2>
                    <p class="urdu-title">${chapter.urdu}</p>
                </div>
                <div class="lessons-list">
                    ${chapter.lessons.map((lesson, i) => `
                        <div class="lesson-card">
                            <div class="lesson-number">${i + 1}</div>
                            <div class="lesson-info">
                                <h4>${lesson.title}</h4>
                                <p class="lesson-urdu">${lesson.urdu}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    runCell(cellId) {
        const output = document.getElementById(`output-${cellId}`);
        if (!output) return;
        
        if (this.currentCourse === 'python-ai-ml') {
            output.textContent = "Training: (50000, 32, 32, 3), Test: (10000, 32, 32, 3)";
        }
    }

    addCell() {
        const cells = document.querySelector('.notebook-cells');
        if (!cells) return;
        const cellCount = cells.children.length + 1;
        const newCell = document.createElement('div');
        newCell.className = 'cell code-cell';
        newCell.innerHTML = `
            <div class="cell-input">
                <span class="cell-prompt">In [${cellCount}]:</span>
                <textarea class="cell-code" placeholder="# Enter code here..."></textarea>
            </div>
            <div class="cell-output" id="output-${cellCount}"></div>
        `;
        cells.appendChild(newCell);
    }

    executeCommand(cmd) {
        if (window.terminal) {
            document.getElementById('terminal-input').value = cmd;
            window.vm.switchApp('terminal');
            setTimeout(() => {
                window.terminal.executeCommand(cmd);
            }, 500);
        }
    }

    testSQLInjection(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const result = document.getElementById('attack-result');
        
        // Sanitize input to prevent XSS
        const sanitizedUsername = this.sanitizeInput(username);
        
        if (username.includes("'") || username.includes('OR') || username.includes('--')) {
            result.innerHTML = `<div class="attack-success">🎉 SQL Injection Successful!<br>Bypassed authentication with: ${sanitizedUsername}</div>`;
        } else {
            result.innerHTML = `<div class="attack-failed">❌ Login failed. Try SQL injection techniques.</div>`;
        }
    }

    fillSQLInjection() {
        document.getElementById('username').value = "admin' OR 1=1--";
        document.getElementById('password').value = "anything";
    }

    testEndpoint(endpoint) {
        const response = document.getElementById('api-response');
        const resp = { status: 200, data: '{ "status": "healthy", "uptime": "24h" }' };
        
        // Sanitize endpoint to prevent XSS
        const sanitizedEndpoint = this.sanitizeInput(endpoint);
        
        response.innerHTML = `
            <div class="api-response">
                <div class="response-header">Response from ${sanitizedEndpoint}</div>
                <div class="response-status">Status: ${resp.status}</div>
                <pre class="response-body">${resp.data}</pre>
            </div>
        `;
    }

    // CTF Challenge Pages
    generateCtfHiddenLogin() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: Hidden Login Discovery</h2>
                <div class="challenge-info">
                    <p>Find the hidden admin login page and bypass authentication</p>
                    <div class="flag-hint">Flag format: NEURO{hidden_admin_password}</div>
                </div>
                <div class="web-interface">
                    <h3>Website Directory Structure</h3>
                    <div class="directory-list">
                        <div class="dir-item" onclick="browser.exploreDirectory('/home')">/home</div>
                        <div class="dir-item" onclick="browser.exploreDirectory('/admin')">/admin</div>
                        <div class="dir-item" onclick="browser.exploreDirectory('/backup')">/backup</div>
                        <div class="dir-item" onclick="browser.exploreDirectory('/panel')">/panel</div>
                    </div>
                    <div id="directory-content"></div>
                </div>
            </div>
        `;
    }

    generateCtfApiExploit() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: API Exploitation</h2>
                <div class="challenge-info">
                    <p>Exploit the ML API to extract sensitive information</p>
                    <div class="flag-hint">Flag format: NEURO{api_secret_key}</div>
                </div>
                <div class="api-testing">
                    <h3>API Endpoints</h3>
                    <div class="endpoint-list">
                        <div class="endpoint" onclick="browser.testCtfEndpoint('/health')">
                            <span class="method">GET</span> /health
                        </div>
                        <div class="endpoint" onclick="browser.testCtfEndpoint('/model-info')">
                            <span class="method">GET</span> /model-info
                        </div>
                        <div class="endpoint" onclick="browser.testCtfEndpoint('/admin')">
                            <span class="method">GET</span> /admin
                        </div>
                    </div>
                    <div id="api-test-result"></div>
                </div>
            </div>
        `;
    }

    generateCtfFileDiscovery() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: File Discovery</h2>
                <div class="challenge-info">
                    <p>Find hidden files containing sensitive information</p>
                    <div class="flag-hint">Flag format: NEURO{hidden_file_content}</div>
                </div>
                <div class="file-explorer">
                    <h3>File System Explorer</h3>
                    <div class="file-list">
                        <div class="file-item" onclick="browser.examineFile('readme.txt')">
                            <i class="fas fa-file-alt"></i> readme.txt
                        </div>
                        <div class="file-item" onclick="browser.examineFile('.hidden_config')">
                            <i class="fas fa-file"></i> .hidden_config
                        </div>
                        <div class="file-item" onclick="browser.examineFile('.secret_flag.txt')">
                            <i class="fas fa-file-code"></i> .secret_flag.txt
                        </div>
                    </div>
                    <div id="file-content"></div>
                </div>
            </div>
        `;
    }

    exploreDirectory(dir) {
        const content = document.getElementById('directory-content');
        if (dir === '/admin') {
            content.innerHTML = `
                <div class="found-page">
                    <h4>Found: Admin Login Page</h4>
                    <form onsubmit="browser.testCtfLogin(event)">
                        <input type="text" id="ctf-username" placeholder="Username">
                        <input type="password" id="ctf-password" placeholder="Password">
                        <button type="submit">Login</button>
                    </form>
                    <p>Try SQL injection: admin' OR 1=1--</p>
                </div>
            `;
        } else {
            content.innerHTML = `<p>Directory ${dir}: Access denied or empty</p>`;
        }
    }

    testCtfEndpoint(endpoint) {
        const result = document.getElementById('api-test-result');
        if (endpoint === '/admin') {
            result.innerHTML = `
                <div class="api-success">
                    <h4>Admin Endpoint Response:</h4>
                    <pre>{"admin_key": "NEURO{api_secret_key_2024}", "access": "granted"}</pre>
                    <p class="flag-found">🏆 Flag Found: NEURO{api_secret_key_2024}</p>
                </div>
            `;
        } else {
            result.innerHTML = `<p>Endpoint ${endpoint}: No sensitive data found</p>`;
        }
    }

    examineFile(filename) {
        const content = document.getElementById('file-content');
        if (filename === '.secret_flag.txt') {
            content.innerHTML = `
                <div class="file-success">
                    <h4>File Content:</h4>
                    <pre>Congratulations! You found the hidden file.
Flag: NEURO{hidden_file_content_def456}</pre>
                    <p class="flag-found">🏆 Flag Found: NEURO{hidden_file_content_def456}</p>
                </div>
            `;
        } else {
            content.innerHTML = `<p>File ${filename}: No flag found</p>`;
        }
    }

    testCtfLogin(event) {
        event.preventDefault();
        const username = document.getElementById('ctf-username').value;
        if (username.includes("'") || username.includes('OR')) {
            const content = document.getElementById('directory-content');
            if (content) {
                const successDiv = document.createElement('div');
                successDiv.className = 'login-success';
                successDiv.innerHTML = `
                    <h4>SQL Injection Successful!</h4>
                    <p>Admin panel accessed</p>
                    <p class="flag-found">🏆 Flag Found: NEURO{hidden_admin_password_xyz789}</p>
                `;
                content.appendChild(successDiv);
            }
        }
    }

    // New Advanced Challenge Pages
    generateModelPoisoning() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: AI Model Poisoning</h2>
                <div class="challenge-info">
                    <p>ML model ki training data poison kar ke backdoor inject kariye</p>
                    <div class="flag-hint">Flag format: NEURO{poisoned_model_trigger}</div>
                </div>
                <div class="ml-interface">
                    <h3>Training Pipeline Access</h3>
                    <div class="pipeline-steps">
                        <div class="step-item" onclick="browser.executePoisoning('dataset')">
                            <i class="fas fa-database"></i> Access Training Dataset
                        </div>
                        <div class="step-item" onclick="browser.executePoisoning('poison')">
                            <i class="fas fa-syringe"></i> Inject Poisoned Samples
                        </div>
                        <div class="step-item" onclick="browser.executePoisoning('trigger')">
                            <i class="fas fa-play"></i> Test Backdoor Trigger
                        </div>
                    </div>
                    <div id="poisoning-result"></div>
                </div>
            </div>
        `;
    }

    generateBankingTrojan() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: Mobile Banking Trojan</h2>
                <div class="challenge-info">
                    <p>Android banking app mein hidden trojan analyze kariye</p>
                    <div class="flag-hint">Flag format: NEURO{trojan_c2_server}</div>
                </div>
                <div class="apk-analyzer">
                    <h3>APK Analysis Tools</h3>
                    <div class="analysis-tools">
                        <div class="tool-item" onclick="browser.analyzeApk('decompile')">
                            <i class="fas fa-file-archive"></i> Decompile APK
                        </div>
                        <div class="tool-item" onclick="browser.analyzeApk('static')">
                            <i class="fas fa-search"></i> Static Analysis
                        </div>
                        <div class="tool-item" onclick="browser.analyzeApk('network')">
                            <i class="fas fa-network-wired"></i> Network Analysis
                        </div>
                    </div>
                    <div id="apk-result"></div>
                </div>
            </div>
        `;
    }

    generateQuantumCrypto() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: Quantum Cryptography Break</h2>
                <div class="challenge-info">
                    <p>Post-quantum encryption ko quantum algorithm se break kariye</p>
                    <div class="flag-hint">Flag format: NEURO{quantum_decrypted_msg}</div>
                </div>
                <div class="quantum-lab">
                    <h3>Quantum Computing Simulator</h3>
                    <div class="quantum-controls">
                        <div class="control-item" onclick="browser.quantumAttack('simulate')">
                            <i class="fas fa-atom"></i> Initialize Quantum Circuit
                        </div>
                        <div class="control-item" onclick="browser.quantumAttack('analyze')">
                            <i class="fas fa-calculator"></i> Analyze Lattice Structure
                        </div>
                        <div class="control-item" onclick="browser.quantumAttack('decrypt')">
                            <i class="fas fa-unlock"></i> Execute Quantum Attack
                        </div>
                    </div>
                    <div id="quantum-result"></div>
                </div>
            </div>
        `;
    }

    generate5gHijacking() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: 5G Network Hijacking</h2>
                <div class="challenge-info">
                    <p>5G infrastructure vulnerabilities exploit kariye</p>
                    <div class="flag-hint">Flag format: NEURO{5g_intercepted_data}</div>
                </div>
                <div class="5g-interface">
                    <h3>5G Network Scanner</h3>
                    <div class="network-tools">
                        <div class="tool-item" onclick="browser.scan5g('basestation')">
                            <i class="fas fa-broadcast-tower"></i> Scan Base Stations
                        </div>
                        <div class="tool-item" onclick="browser.scan5g('slicing')">
                            <i class="fas fa-layer-group"></i> Analyze Network Slicing
                        </div>
                        <div class="tool-item" onclick="browser.scan5g('intercept')">
                            <i class="fas fa-satellite-dish"></i> Intercept Traffic
                        </div>
                    </div>
                    <div id="5g-result"></div>
                </div>
            </div>
        `;
    }

    generateSatelliteHack() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: Satellite Communication Hack</h2>
                <div class="challenge-info">
                    <p>Satellite communication system compromise kariye</p>
                    <div class="flag-hint">Flag format: NEURO{satellite_command_code}</div>
                </div>
                <div class="satellite-interface">
                    <h3>Satellite Control System</h3>
                    <div class="satellite-tools">
                        <div class="tool-item" onclick="browser.hackSatellite('frequency')">
                            <i class="fas fa-satellite"></i> Frequency Analysis
                        </div>
                        <div class="tool-item" onclick="browser.hackSatellite('ground')">
                            <i class="fas fa-tower-broadcast"></i> Ground Station Recon
                        </div>
                        <div class="tool-item" onclick="browser.hackSatellite('command')">
                            <i class="fas fa-rocket"></i> Command Injection
                        </div>
                    </div>
                    <div id="satellite-result"></div>
                </div>
            </div>
        `;
    }

    generateDeepfakeDetection() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: Deepfake Detection Lab</h2>
                <div class="challenge-info">
                    <p>AI-generated deepfake content detect kariye</p>
                    <div class="flag-hint">Flag format: NEURO{deepfake_signature}</div>
                </div>
                <div class="deepfake-lab">
                    <h3>Deepfake Analysis Tools</h3>
                    <div class="detection-tools">
                        <div class="tool-item" onclick="browser.detectDeepfake('load')">
                            <i class="fas fa-brain"></i> Load Detection Models
                        </div>
                        <div class="tool-item" onclick="browser.detectDeepfake('analyze')">
                            <i class="fas fa-eye"></i> Analyze Media Files
                        </div>
                        <div class="tool-item" onclick="browser.detectDeepfake('artifacts')">
                            <i class="fas fa-search-plus"></i> Find Artifacts
                        </div>
                    </div>
                    <div id="deepfake-result"></div>
                </div>
            </div>
        `;
    }

    // Challenge interaction functions
    executePoisoning(action) {
        const result = document.getElementById('poisoning-result');
        if (action === 'trigger') {
            result.innerHTML = `
                <div class="attack-success">
                    <h4>🎉 Model Poisoning Successful!</h4>
                    <p>Backdoor trigger activated: "neuro_trigger_2024"</p>
                    <p class="flag-found">🏆 Flag Found: NEURO{poisoned_model_trigger_neuro2024}</p>
                </div>
            `;
        }
    }

    analyzeApk(action) {
        const result = document.getElementById('apk-result');
        if (action === 'network') {
            result.innerHTML = `
                <div class="attack-success">
                    <h4>🎯 C&C Server Discovered!</h4>
                    <p>Trojan communicates with: evil-banking-c2.darkweb</p>
                    <p class="flag-found">🏆 Flag Found: NEURO{trojan_c2_server_evil_banking}</p>
                </div>
            `;
        }
    }

    quantumAttack(action) {
        const result = document.getElementById('quantum-result');
        if (action === 'decrypt') {
            result.innerHTML = `
                <div class="attack-success">
                    <h4>🔓 Quantum Decryption Successful!</h4>
                    <p>Message decrypted: "Quantum supremacy achieved"</p>
                    <p class="flag-found">🏆 Flag Found: NEURO{quantum_decrypted_msg_supremacy}</p>
                </div>
            `;
        }
    }

    scan5g(action) {
        const result = document.getElementById('5g-result');
        if (action === 'intercept') {
            result.innerHTML = `
                <div class="attack-success">
                    <h4>📡 5G Traffic Intercepted!</h4>
                    <p>Captured IoT device communications from emergency slice</p>
                    <p class="flag-found">🏆 Flag Found: NEURO{5g_intercepted_data_iot_emergency}</p>
                </div>
            `;
        }
    }

    hackSatellite(action) {
        const result = document.getElementById('satellite-result');
        if (action === 'command') {
            result.innerHTML = `
                <div class="attack-success">
                    <h4>🛰️ Satellite Control Gained!</h4>
                    <p>Command injection successful: SPACE_CTRL_2024</p>
                    <p class="flag-found">🏆 Flag Found: NEURO{satellite_command_code_SPACE_CTRL_2024}</p>
                </div>
            `;
        }
    }

    detectDeepfake(action) {
        const result = document.getElementById('deepfake-result');
        if (action === 'artifacts') {
            result.innerHTML = `
                <div class="attack-success">
                    <h4>🎭 Deepfake Detected!</h4>
                    <p>Signature found: DEEPFAKE_SIG_2024 (StyleGAN2)</p>
                    <p class="flag-found">🏆 Flag Found: NEURO{deepfake_signature_STYLEGAN2_2024}</p>
                </div>
            `;
        }
    }

    // CTF Challenge Hubs
    generateCtfChallengesHub() {
        return `
            <div class="ctf-hub">
                <h1>🏆 CTF Challenges Hub</h1>
                <p>Interactive security challenges - Roman Urdu mein</p>
                <div class="challenge-categories">
                    <div class="category-card" onclick="browser.loadPage('ctf-hidden-login')">
                        <div class="difficulty easy">Easy</div>
                        <i class="fas fa-user-secret"></i>
                        <h3>Hidden Login Discovery</h3>
                        <p>Admin panel dhundiye aur bypass kariye</p>
                        <div class="points">125 points</div>
                    </div>
                    <div class="category-card" onclick="browser.loadPage('ctf-api-exploit')">
                        <div class="difficulty medium">Medium</div>
                        <i class="fas fa-code"></i>
                        <h3>API Exploitation</h3>
                        <p>ML API se sensitive data extract kariye</p>
                        <div class="points">150 points</div>
                    </div>
                    <div class="category-card" onclick="browser.loadPage('ctf-file-discovery')">
                        <div class="difficulty easy">Easy</div>
                        <i class="fas fa-file-alt"></i>
                        <h3>File Discovery</h3>
                        <p>Hidden files mein flags dhundiye</p>
                        <div class="points">100 points</div>
                    </div>
                    <div class="category-card" onclick="browser.loadPage('web-exploitation')">
                        <div class="difficulty medium">Medium</div>
                        <i class="fas fa-globe"></i>
                        <h3>Web Exploitation</h3>
                        <p>SQL injection aur XSS attacks</p>
                        <div class="points">175 points</div>
                    </div>
                    <div class="category-card" onclick="browser.loadPage('crypto-challenges')">
                        <div class="difficulty hard">Hard</div>
                        <i class="fas fa-lock"></i>
                        <h3>Cryptography</h3>
                        <p>Encryption break kariye</p>
                        <div class="points">200 points</div>
                    </div>
                    <div class="category-card" onclick="browser.loadPage('forensics-lab')">
                        <div class="difficulty medium">Medium</div>
                        <i class="fas fa-search"></i>
                        <h3>Digital Forensics</h3>
                        <p>Evidence analyze kariye</p>
                        <div class="points">180 points</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateAdvancedCtfHub() {
        return `
            <div class="ctf-hub advanced">
                <h1>🚀 Advanced CTF Challenges</h1>
                <p>Next-generation security challenges</p>
                <div class="challenge-categories">
                    <div class="category-card" onclick="browser.loadPage('model-poisoning')">
                        <div class="difficulty expert">Expert</div>
                        <i class="fas fa-brain"></i>
                        <h3>AI Model Poisoning</h3>
                        <p>ML model mein backdoor inject kariye</p>
                        <div class="points">250 points</div>
                    </div>
                    <div class="category-card" onclick="browser.loadPage('banking-trojan')">
                        <div class="difficulty hard">Hard</div>
                        <i class="fas fa-mobile-alt"></i>
                        <h3>Mobile Banking Trojan</h3>
                        <p>Android malware analyze kariye</p>
                        <div class="points">200 points</div>
                    </div>
                    <div class="category-card" onclick="browser.loadPage('quantum-crypto')">
                        <div class="difficulty expert">Expert</div>
                        <i class="fas fa-atom"></i>
                        <h3>Quantum Cryptography</h3>
                        <p>Post-quantum encryption break kariye</p>
                        <div class="points">300 points</div>
                    </div>
                    <div class="category-card" onclick="browser.loadPage('5g-hijacking')">
                        <div class="difficulty expert">Expert</div>
                        <i class="fas fa-broadcast-tower"></i>
                        <h3>5G Network Hijacking</h3>
                        <p>5G infrastructure compromise kariye</p>
                        <div class="points">275 points</div>
                    </div>
                    <div class="category-card" onclick="browser.loadPage('satellite-hack')">
                        <div class="difficulty master">Master</div>
                        <i class="fas fa-satellite"></i>
                        <h3>Satellite Hacking</h3>
                        <p>Satellite communication hijack kariye</p>
                        <div class="points">350 points</div>
                    </div>
                    <div class="category-card" onclick="browser.loadPage('deepfake-detection')">
                        <div class="difficulty hard">Hard</div>
                        <i class="fas fa-eye"></i>
                        <h3>Deepfake Detection</h3>
                        <p>AI-generated content detect kariye</p>
                        <div class="points">225 points</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateWebExploitation() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: Web Exploitation Lab</h2>
                <div class="challenge-info">
                    <p>Multiple web vulnerabilities exploit kariye</p>
                    <div class="flag-hint">Multiple flags available</div>
                </div>
                <div class="web-lab">
                    <div class="vuln-targets">
                        <div class="target-card" onclick="browser.testWebVuln('sqli')">
                            <h4>SQL Injection Target</h4>
                            <p>Database manipulation attack</p>
                            <div class="vuln-form">
                                <input type="text" id="sqli-input" placeholder="Search products...">
                                <button onclick="browser.testWebVuln('sqli')">Search</button>
                            </div>
                        </div>
                        <div class="target-card" onclick="browser.testWebVuln('xss')">
                            <h4>XSS Target</h4>
                            <p>Cross-site scripting attack</p>
                            <div class="vuln-form">
                                <input type="text" id="xss-input" placeholder="Leave a comment...">
                                <button onclick="browser.testWebVuln('xss')">Submit</button>
                            </div>
                        </div>
                        <div class="target-card" onclick="browser.testWebVuln('lfi')">
                            <h4>Local File Inclusion</h4>
                            <p>File system access attack</p>
                            <div class="vuln-form">
                                <input type="text" id="lfi-input" placeholder="file=index.php">
                                <button onclick="browser.testWebVuln('lfi')">Load File</button>
                            </div>
                        </div>
                    </div>
                    <div id="web-vuln-result"></div>
                </div>
            </div>
        `;
    }

    generateCryptoChallenges() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: Cryptography Challenges</h2>
                <div class="challenge-info">
                    <p>Various encryption methods break kariye</p>
                    <div class="flag-hint">Multiple crypto flags available</div>
                </div>
                <div class="crypto-lab">
                    <div class="crypto-challenges">
                        <div class="crypto-card" onclick="browser.solveCrypto('caesar')">
                            <h4>Caesar Cipher</h4>
                            <p>Encrypted: QHXUR{FDHVDU_FLSKHU_FUDFNHG}</p>
                            <button>Decrypt</button>
                        </div>
                        <div class="crypto-card" onclick="browser.solveCrypto('base64')">
                            <h4>Base64 Encoding</h4>
                            <p>Encoded: TkVVUk97YmFzZTY0X2RlY29kZWRfZmxhZ30=</p>
                            <button>Decode</button>
                        </div>
                        <div class="crypto-card" onclick="browser.solveCrypto('rsa')">
                            <h4>Weak RSA</h4>
                            <p>n=143, e=7, c=123 (small primes)</p>
                            <button>Factor & Decrypt</button>
                        </div>
                    </div>
                    <div id="crypto-result"></div>
                </div>
            </div>
        `;
    }

    generateForensicsLab() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: Digital Forensics Lab</h2>
                <div class="challenge-info">
                    <p>Digital evidence analyze kar ke flags dhundiye</p>
                    <div class="flag-hint">Multiple forensics flags available</div>
                </div>
                <div class="forensics-lab">
                    <div class="evidence-items">
                        <div class="evidence-card" onclick="browser.analyzeEvidence('memory')">
                            <i class="fas fa-memory"></i>
                            <h4>Memory Dump</h4>
                            <p>RAM image analysis</p>
                            <div class="file-size">2.1 GB</div>
                        </div>
                        <div class="evidence-card" onclick="browser.analyzeEvidence('network')">
                            <i class="fas fa-network-wired"></i>
                            <h4>Network Capture</h4>
                            <p>PCAP file analysis</p>
                            <div class="file-size">45 MB</div>
                        </div>
                        <div class="evidence-card" onclick="browser.analyzeEvidence('disk')">
                            <i class="fas fa-hdd"></i>
                            <h4>Disk Image</h4>
                            <p>File system forensics</p>
                            <div class="file-size">500 GB</div>
                        </div>
                    </div>
                    <div id="forensics-result"></div>
                </div>
            </div>
        `;
    }

    generateOsintChallenges() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: OSINT Challenges</h2>
                <div class="challenge-info">
                    <p>Open source intelligence gathering</p>
                    <div class="flag-hint">Social media aur public data se flags dhundiye</div>
                </div>
                <div class="osint-lab">
                    <div class="osint-tools">
                        <div class="tool-card" onclick="browser.osintSearch('social')">
                            <i class="fas fa-users"></i>
                            <h4>Social Media Intel</h4>
                            <p>Profile information gathering</p>
                        </div>
                        <div class="tool-card" onclick="browser.osintSearch('metadata')">
                            <i class="fas fa-camera"></i>
                            <h4>Image Metadata</h4>
                            <p>EXIF data analysis</p>
                        </div>
                        <div class="tool-card" onclick="browser.osintSearch('domain')">
                            <i class="fas fa-globe"></i>
                            <h4>Domain Intelligence</h4>
                            <p>DNS aur WHOIS analysis</p>
                        </div>
                    </div>
                    <div id="osint-result"></div>
                </div>
            </div>
        `;
    }

    // New challenge interaction functions
    testWebVuln(vulnType) {
        const result = document.getElementById('web-vuln-result');
        const input = document.getElementById(`${vulnType}-input`);
        const value = input ? input.value : '';
        
        if (vulnType === 'sqli' && value.includes("'")) {
            result.innerHTML = `
                <div class="attack-success">
                    <h4>🎉 SQL Injection Successful!</h4>
                    <p>Database compromised with payload: ${this.sanitizeInput(value)}</p>
                    <p class="flag-found">🏆 Flag Found: NEURO{sql_injection_database_pwned}</p>
                </div>
            `;
        } else if (vulnType === 'xss' && value.includes('<script>')) {
            result.innerHTML = `
                <div class="attack-success">
                    <h4>🎉 XSS Attack Successful!</h4>
                    <p>JavaScript executed: ${this.sanitizeInput(value)}</p>
                    <p class="flag-found">🏆 Flag Found: NEURO{xss_payload_executed_successfully}</p>
                </div>
            `;
        } else if (vulnType === 'lfi' && value.includes('../')) {
            result.innerHTML = `
                <div class="attack-success">
                    <h4>🎉 LFI Attack Successful!</h4>
                    <p>File accessed: /etc/passwd</p>
                    <p class="flag-found">🏆 Flag Found: NEURO{local_file_inclusion_passwd_read}</p>
                </div>
            `;
        }
    }

    solveCrypto(cryptoType) {
        const result = document.getElementById('crypto-result');
        const flags = {
            'caesar': 'NEURO{caesar_cipher_cracked}',
            'base64': 'NEURO{base64_decoded_flag}',
            'rsa': 'NEURO{weak_rsa_factored_successfully}'
        };
        
        result.innerHTML = `
            <div class="attack-success">
                <h4>🔓 Cryptography Solved!</h4>
                <p>Decryption method: ${cryptoType.toUpperCase()}</p>
                <p class="flag-found">🏆 Flag Found: ${flags[cryptoType]}</p>
            </div>
        `;
    }

    analyzeEvidence(evidenceType) {
        const result = document.getElementById('forensics-result');
        const findings = {
            'memory': 'Malicious process found in RAM dump',
            'network': 'Suspicious traffic to C&C server detected',
            'disk': 'Hidden partition with encrypted files discovered'
        };
        const flags = {
            'memory': 'NEURO{memory_forensics_malware_found}',
            'network': 'NEURO{network_forensics_c2_detected}',
            'disk': 'NEURO{disk_forensics_hidden_partition}'
        };
        
        result.innerHTML = `
            <div class="attack-success">
                <h4>🔍 Evidence Analyzed!</h4>
                <p>Finding: ${findings[evidenceType]}</p>
                <p class="flag-found">🏆 Flag Found: ${flags[evidenceType]}</p>
            </div>
        `;
    }

    osintSearch(searchType) {
        const result = document.getElementById('osint-result');
        const findings = {
            'social': 'Target\'s location revealed through geotagged photos',
            'metadata': 'Camera model and GPS coordinates extracted',
            'domain': 'Hidden subdomain with admin panel discovered'
        };
        const flags = {
            'social': 'NEURO{osint_social_media_geolocation}',
            'metadata': 'NEURO{osint_image_metadata_gps_coords}',
            'domain': 'NEURO{osint_domain_hidden_subdomain}'
        };
        
        result.innerHTML = `
            <div class="attack-success">
                <h4>🕵️ OSINT Discovery!</h4>
                <p>Intelligence: ${findings[searchType]}</p>
                <p class="flag-found">🏆 Flag Found: ${flags[searchType]}</p>
            </div>
        `;
    }
}

// Global browser functions
function navigateUrl() {
    const urlInput = document.getElementById('url-input');
    if (!urlInput) return;
    
    const url = urlInput.value;
    // Sanitize URL input
    const sanitizedUrl = url.replace(/[<>"']/g, '');
    
    if (sanitizedUrl.includes('neuro-dev') || sanitizedUrl === '') {
        if (window.browser) {
            window.browser.loadCourseContent(window.browser.currentCourse);
        }
    }
}

function loadPage(page) {
    window.browser.loadPage(page);
}

function runCell(cellId) {
    window.browser.runCell(cellId);
}

function addCell() {
    window.browser.addCell();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.browser = new Browser();
    setTimeout(() => {
        if (window.browser) {
            window.browser.loadCourseContent('termux-basics');
        }
    }, 100);
});