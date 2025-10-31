// Browser System
class Browser {
    constructor() {
        this.currentUrl = 'https://neuro-dev.local';
        this.currentCourse = 'termux-basics';
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
                        <div class="link-card" onclick="browser.loadPage('burp-suite')">
                            <i class="fas fa-shield-alt"></i>
                            <h3>Burp Suite</h3>
                            <p>Web application security testing</p>
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
                <div class="jupyter-notebook">
                    <div class="notebook-header">
                        <div class="notebook-title">📊 ML Theory - Scikit-Learn.ipynb</div>
                        <div class="notebook-controls">
                            <button onclick="browser.runCell(1)">▶️ Run</button>
                            <button onclick="browser.addCell()">➕ Cell</button>
                        </div>
                    </div>
                    <div class="notebook-cells">
                        <div class="cell code-cell" id="cell-1">
                            <div class="cell-input">
                                <span class="cell-prompt">In [1]:</span>
                                <textarea class="cell-code">import pandas as pd
import numpy as np
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load dataset
iris = load_iris()
X, y = iris.data, iris.target
print(f"Dataset: {X.shape}, Classes: {len(iris.target_names)}")</textarea>
                            </div>
                            <div class="cell-output" id="output-1"></div>
                        </div>
                    </div>
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
                        <div class="link-card" onclick="browser.loadPage('adversarial-attack')">
                            <i class="fas fa-shield-alt"></i>
                            <h3>Adversarial Attack</h3>
                            <p>Generate adversarial examples</p>
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
                { cmd: 'ls -la', desc: 'List files with details' },
                { cmd: 'nano file.txt', desc: 'Edit file with nano' }
            ]),
            'vulnerable-app': this.generateVulnerableApp(),
            'owasp-top10': this.generateOWASPGuide(),
            'neuro-dev-api': this.generateAPITarget(),
            'model-extraction': this.generateModelExtractionLab(),
            'adversarial-attack': this.generateAdversarialLab(),
            'python-docs': this.generatePythonDocs(),
            'code-examples': this.generateCodeExamples(),
            'course-materials': this.generateCourseMaterials(),
            'practice-targets': this.generatePracticeTargets(),
            'tools': this.generateSecurityTools()
        };
        
        document.getElementById('browser-content').innerHTML = pages[page] || '<h2>Page not found</h2>';
        
        // Initialize interactive elements after content load
        setTimeout(() => {
            this.initializeInteractiveElements(page);
        }, 100);
    }

    generateInteractivePage(title, commands) {
        return `
            <div class="interactive-page">
                <h2>${title}</h2>
                <div class="command-grid">
                    ${commands.map(cmd => `
                        <div class="interactive-command" onclick="browser.executeCommand('${cmd.cmd}')">
                            <code>${cmd.cmd}</code>
                            <p>${cmd.desc}</p>
                            <button class="try-btn">Try in Terminal</button>
                        </div>
                    `).join('')}
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
                        <div class="hint-item" onclick="browser.fillXSS()">
                            <strong>XSS:</strong> &lt;script&gt;alert('XSS')&lt;/script&gt;
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
                    ${[
                        { id: 'A01', name: 'Broken Access Control', risk: 'High' },
                        { id: 'A02', name: 'Cryptographic Failures', risk: 'High' },
                        { id: 'A03', name: 'Injection', risk: 'High' },
                        { id: 'A04', name: 'Insecure Design', risk: 'Medium' },
                        { id: 'A05', name: 'Security Misconfiguration', risk: 'Medium' }
                    ].map(item => `
                        <div class="owasp-item ${item.risk.toLowerCase()}" onclick="browser.showOWASPDetails('${item.id}')">
                            <div class="owasp-id">${item.id}</div>
                            <div class="owasp-name">${item.name}</div>
                            <div class="owasp-risk">${item.risk}</div>
                        </div>
                    `).join('')}
                </div>
                <div id="owasp-details"></div>
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
                    <div class="endpoint-item vulnerable" onclick="browser.testEndpoint('/model-info')">
                        <div class="method">GET</div>
                        <div class="path">/model-info</div>
                        <div class="status">⚠️ Exposed</div>
                    </div>
                    <div class="endpoint-item critical" onclick="browser.testEndpoint('/admin')">
                        <div class="method">GET</div>
                        <div class="path">/admin</div>
                        <div class="status">🚨 Critical</div>
                    </div>
                </div>
                <div id="api-response"></div>
                <div class="attack-tools">
                    <button onclick="browser.launchAttack('extract')">🔓 Extract Model</button>
                    <button onclick="browser.launchAttack('adversarial')">🎭 Adversarial Attack</button>
                    <button onclick="browser.launchAttack('privacy')">🕵️ Privacy Attack</button>
                </div>
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
                            <div class="detail-item">Classes: 3</div>
                        </div>
                    </div>
                    <div class="extraction-steps">
                        <div class="step" onclick="browser.runExtractionStep(1)">
                            <div class="step-number">1</div>
                            <div class="step-desc">Probe Model Architecture</div>
                            <div class="step-status" id="step1-status">⏳</div>
                        </div>
                        <div class="step" onclick="browser.runExtractionStep(2)">
                            <div class="step-number">2</div>
                            <div class="step-desc">Extract Feature Importance</div>
                            <div class="step-status" id="step2-status">⏳</div>
                        </div>
                        <div class="step" onclick="browser.runExtractionStep(3)">
                            <div class="step-number">3</div>
                            <div class="step-desc">Clone Decision Boundaries</div>
                            <div class="step-status" id="step3-status">⏳</div>
                        </div>
                    </div>
                    <div id="extraction-output"></div>
                </div>
            </div>
        `;
    }

    generateAdversarialLab() {
        return `
            <div class="adversarial-lab">
                <h2>🎭 Adversarial Attack Laboratory</h2>
                <div class="attack-interface">
                    <div class="image-section">
                        <div class="image-container">
                            <div class="image-placeholder original" id="original-image">
                                <div class="image-label">Original Image</div>
                                <div class="prediction">Cat (99.8%)</div>
                            </div>
                            <div class="arrow">→</div>
                            <div class="image-placeholder adversarial" id="adversarial-image">
                                <div class="image-label">Adversarial Image</div>
                                <div class="prediction">Dog (87.3%)</div>
                            </div>
                        </div>
                    </div>
                    <div class="attack-controls">
                        <div class="method-selector">
                            <label>Attack Method:</label>
                            <select id="attack-method">
                                <option value="fgsm">FGSM</option>
                                <option value="deepfool">DeepFool</option>
                                <option value="pgd">PGD</option>
                            </select>
                        </div>
                        <div class="epsilon-control">
                            <label>Epsilon: <span id="epsilon-value">0.03</span></label>
                            <input type="range" id="epsilon-slider" min="0.01" max="0.1" step="0.01" value="0.03">
                        </div>
                        <button onclick="browser.generateAdversarial()">🚀 Generate Attack</button>
                    </div>
                    <div id="adversarial-output"></div>
                </div>
            </div>
        `;
    }

    generateCourseMaterials() {
        const course = this.currentCourse;
        const materials = {
            'termux-basics': ['Command Line Basics', 'Package Management', 'File Operations'],
            'ai-hacking': ['ML Model Security', 'Adversarial Examples', 'Privacy Attacks'],
            'web-security': ['OWASP Top 10', 'SQL Injection', 'XSS Prevention']
        };
        
        return `
            <div class="course-materials">
                <h2>📚 Course Materials - ${course}</h2>
                <div class="materials-grid">
                    ${(materials[course] || ['General Materials']).map(material => `
                        <div class="material-card" onclick="browser.openMaterial('${material}')">
                            <i class="fas fa-book"></i>
                            <h3>${material}</h3>
                            <p>Interactive learning content</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generatePracticeTargets() {
        return `
            <div class="practice-targets">
                <h2>🎯 Practice Targets</h2>
                <div class="targets-grid">
                    <div class="target-card" onclick="browser.loadPage('vulnerable-app')">
                        <div class="target-status vulnerable">🔴 Vulnerable</div>
                        <h3>DVWA Clone</h3>
                        <p>SQL Injection, XSS, CSRF</p>
                    </div>
                    <div class="target-card" onclick="browser.loadPage('neuro-dev-api')">
                        <div class="target-status critical">🚨 Critical</div>
                        <h3>ML API Target</h3>
                        <p>Model extraction, Privacy attacks</p>
                    </div>
                </div>
            </div>
        `;
    }

    generateSecurityTools() {
        return `
            <div class="security-tools">
                <h2>🛠️ Web Security Tools</h2>
                <div class="tools-grid">
                    <div class="tool-card" onclick="browser.launchTool('scanner')">
                        <i class="fas fa-search"></i>
                        <h3>Vulnerability Scanner</h3>
                        <p>Automated security scanning</p>
                    </div>
                    <div class="tool-card" onclick="browser.launchTool('proxy')">
                        <i class="fas fa-exchange-alt"></i>
                        <h3>HTTP Proxy</h3>
                        <p>Intercept and modify requests</p>
                    </div>
                </div>
            </div>
        `;
    }

    runCell(cellId) {
        const output = document.getElementById(`output-${cellId}`);
        if (!output) return;
        
        if (this.currentCourse === 'hands-on-ml-scikit-learn') {
            output.textContent = "Dataset: (150, 4), Classes: 3\n['setosa', 'versicolor', 'virginica']";
        } else if (this.currentCourse === 'python-ai-ml') {
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

    // Interactive browser methods
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
        const password = document.getElementById('password').value;
        const result = document.getElementById('attack-result');
        
        if (username.includes("'") || username.includes('OR') || username.includes('--')) {
            result.innerHTML = `<div class="attack-success">🎉 SQL Injection Successful!<br>Bypassed authentication with: ${username}</div>`;
        } else {
            result.innerHTML = `<div class="attack-failed">❌ Login failed. Try SQL injection techniques.</div>`;
        }
    }

    fillSQLInjection() {
        document.getElementById('username').value = "admin' OR 1=1--";
        document.getElementById('password').value = "anything";
    }

    fillXSS() {
        document.getElementById('username').value = "<script>alert('XSS')</script>";
    }

    testEndpoint(endpoint) {
        const response = document.getElementById('api-response');
        const responses = {
            '/health': { status: 200, data: '{ "status": "healthy", "uptime": "24h" }' },
            '/model-info': { status: 200, data: '{ "model": "RandomForest", "features": 4, "accuracy": 0.967, "training_data_size": 150 }' },
            '/admin': { status: 200, data: '{ "admin_panel": true, "users": ["admin", "user1"], "config": "exposed" }' }
        };
        
        const resp = responses[endpoint];
        response.innerHTML = `
            <div class="api-response">
                <div class="response-header">Response from ${endpoint}</div>
                <div class="response-status">Status: ${resp.status}</div>
                <pre class="response-body">${resp.data}</pre>
            </div>
        `;
    }

    launchAttack(type) {
        const attacks = {
            'extract': 'extract-model',
            'adversarial': 'adversarial-attack', 
            'privacy': 'privacy-attack'
        };
        
        if (attacks[type]) {
            this.executeCommand(attacks[type]);
        }
    }

    initializeInteractiveElements(page) {
        // Initialize page-specific interactive elements
        if (page === 'adversarial-attack') {
            const slider = document.getElementById('epsilon-slider');
            if (slider) {
                slider.addEventListener('input', (e) => {
                    document.getElementById('epsilon-value').textContent = e.target.value;
                });
            }
        }
    }
}

function navigateUrl() {
    const url = document.getElementById('url-input').value;
    if (url.includes('neuro-dev')) {
        window.browser.loadCourseContent(window.browser.currentCourse);
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

// Global browser functions
function browser() {
    return window.browser;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.browser = new Browser();
});