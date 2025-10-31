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
            'ctf-hidden-login': this.generateCtfHiddenLogin(),
            'ctf-api-exploit': this.generateCtfApiExploit(),
            'ctf-file-discovery': this.generateCtfFileDiscovery()
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