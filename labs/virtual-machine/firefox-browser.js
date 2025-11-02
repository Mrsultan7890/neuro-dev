// Firefox-Style Browser System
class FirefoxBrowser {
    constructor() {
        this.tabs = [];
        this.activeTabId = null;
        this.tabCounter = 0;
        this.history = [];
        this.bookmarks = this.loadBookmarks();
        this.downloads = [];
        this.extensions = [];
        this.devToolsOpen = false;
        this.currentCourse = 'termux-basics';
        this.createDefaultTab();
        this.setupBrowser();
    }

    setupBrowser() {
        console.log('Setting up Firefox browser...');
        // Browser interface already exists in HTML, just setup functionality
        this.setupEventListeners();
        this.loadExtensions();
        this.renderTabs();
        this.renderBookmarks();
        console.log('Firefox browser setup complete');
    }

    createBrowserInterface() {
        // Interface already exists in HTML, skip creation
        console.log('Firefox browser interface already exists in HTML');
    }

    setupEventListeners() {
        // Right-click context menu
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.firefox-browser')) {
                e.preventDefault();
                this.showContextMenu(e);
            }
        });

        // Close context menu on click
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 't':
                        e.preventDefault();
                        this.createNewTab();
                        break;
                    case 'w':
                        e.preventDefault();
                        this.closeActiveTab();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.refresh();
                        break;
                    case 'l':
                        e.preventDefault();
                        document.getElementById('firefox-url-input').focus();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.showFindDialog();
                        break;
                    case 'u':
                        e.preventDefault();
                        this.viewSource();
                        break;
                }
            }
            
            if (e.key === 'F12') {
                e.preventDefault();
                this.toggleDevTools();
            }
        });
    }

    createDefaultTab() {
        // Default tab already exists in HTML
        const defaultTab = {
            id: 1,
            url: 'https://neuro-dev.local',
            title: 'Neuro-Dev - Home',
            loading: false,
            canGoBack: false,
            canGoForward: false,
            history: ['https://neuro-dev.local'],
            historyIndex: 0
        };
        
        this.tabs = [defaultTab];
        this.activeTabId = 1;
        this.tabCounter = 1;
    }

    createNewTab(url = 'about:newtab', title = 'New Tab') {
        const tabId = ++this.tabCounter;
        const tab = {
            id: tabId,
            url: url,
            title: title,
            loading: false,
            canGoBack: false,
            canGoForward: false,
            history: [url],
            historyIndex: 0
        };

        this.tabs.push(tab);
        this.activeTabId = tabId;
        this.renderTabs();
        this.loadTabContent(tab);
        return tab;
    }

    renderTabs() {
        const container = document.getElementById('tabs-container');
        if (!container) return;

        container.innerHTML = this.tabs.map(tab => `
            <div class="firefox-tab ${tab.id === this.activeTabId ? 'active' : ''}" 
                 onclick="window.firefoxBrowser && window.firefoxBrowser.switchTab(${tab.id})"
                 oncontextmenu="window.firefoxBrowser && window.firefoxBrowser.showTabContextMenu(event, ${tab.id})">
                <div class="tab-favicon">
                    ${tab.loading ? '<i class="fas fa-spinner fa-spin"></i>' : 
                      tab.url.includes('neuro-dev') ? '🧠' : '🌐'}
                </div>
                <div class="tab-title">${this.sanitizeInput(tab.title)}</div>
                <button class="tab-close" onclick="event.stopPropagation(); window.firefoxBrowser && window.firefoxBrowser.closeTab(${tab.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    switchTab(tabId) {
        this.activeTabId = tabId;
        this.renderTabs();
        const tab = this.getActiveTab();
        if (tab) {
            this.loadTabContent(tab);
            this.updateAddressBar(tab.url);
        }
    }

    closeTab(tabId) {
        const index = this.tabs.findIndex(tab => tab.id === tabId);
        if (index === -1) return;

        this.tabs.splice(index, 1);
        
        if (this.tabs.length === 0) {
            this.createNewTab();
        } else if (this.activeTabId === tabId) {
            const newActiveIndex = Math.min(index, this.tabs.length - 1);
            this.activeTabId = this.tabs[newActiveIndex].id;
        }
        
        this.renderTabs();
        this.loadTabContent(this.getActiveTab());
    }

    closeActiveTab() {
        if (this.activeTabId) {
            this.closeTab(this.activeTabId);
        }
    }

    getActiveTab() {
        return this.tabs.find(tab => tab.id === this.activeTabId);
    }

    navigate(url) {
        if (!url) {
            url = document.getElementById('firefox-url-input').value;
        }
        
        if (!url) return;

        // Handle special URLs
        if (!url.startsWith('http') && !url.startsWith('about:') && !url.startsWith('file:')) {
            if (url.includes('.')) {
                url = 'https://' + url;
            } else {
                url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
            }
        }

        const tab = this.getActiveTab();
        if (tab) {
            tab.url = url;
            tab.loading = true;
            this.addToHistory(url);
            this.renderTabs();
            this.updateAddressBar(url);
            
            setTimeout(() => {
                tab.loading = false;
                this.loadTabContent(tab);
                this.renderTabs();
            }, 1000);
        }
    }

    loadTabContent(tab) {
        const content = document.getElementById('tab-content');
        if (!content || !tab) return;

        this.updatePageStatus('Loading...');
        
        // Simulate loading delay
        setTimeout(() => {
            content.innerHTML = this.getPageContent(tab.url);
            this.updatePageStatus('Done');
            this.updateTabTitle(tab);
        }, 500);
    }

    getPageContent(url) {
        // Sanitize URL to prevent XSS
        const sanitizedUrl = this.sanitizeInput(url);
        
        if (url === 'about:newtab') {
            return this.getNewTabPage();
        } else if (url.includes('neuro-dev.local')) {
            return this.getNeuroDev();
        } else if (url.includes('ml-api.neuro-dev')) {
            return this.getMLAPI();
        } else if (url.includes('ctf-challenges')) {
            return this.getCTFChallenges();
        } else if (url.includes('google.com/search')) {
            return this.getSearchResults(url);
        } else if (url.includes('vulnerable-app')) {
            return this.getVulnerableApp();
        } else if (url.includes('owasp-top10')) {
            return this.getOWASPGuide();
        } else if (url.includes('ctf-hub')) {
            return this.getCtfHub();
        } else if (url.includes('web-exploitation')) {
            return this.getWebExploitation();
        } else if (url.includes('crypto-challenges')) {
            return this.getCryptoChallenges();
        } else {
            return this.getGenericPage(sanitizedUrl);
        }
    }

    getNewTabPage() {
        return `
            <div class="newtab-page">
                <div class="newtab-header">
                    <h1>🦊 Firefox - Neuro-Dev Edition</h1>
                    <p>Your gateway to ethical hacking education</p>
                </div>
                
                <div class="newtab-shortcuts">
                    <h3>Quick Access</h3>
                    <div class="shortcuts-grid">
                        <div class="shortcut-item" onclick="firefoxBrowser.navigate('https://neuro-dev.local')">
                            <div class="shortcut-icon">🧠</div>
                            <div class="shortcut-title">Neuro-Dev</div>
                        </div>
                        <div class="shortcut-item" onclick="firefoxBrowser.navigate('https://ml-api.neuro-dev:8080')">
                            <div class="shortcut-icon">🤖</div>
                            <div class="shortcut-title">ML API</div>
                        </div>
                        <div class="shortcut-item" onclick="firefoxBrowser.navigate('https://ctf-challenges.neuro-dev')">
                            <div class="shortcut-icon">🏆</div>
                            <div class="shortcut-title">CTF Challenges</div>
                        </div>
                        <div class="shortcut-item" onclick="firefoxBrowser.navigate('https://github.com/neuro-dev')">
                            <div class="shortcut-icon">📚</div>
                            <div class="shortcut-title">GitHub</div>
                        </div>
                    </div>
                </div>

                <div class="newtab-recent">
                    <h3>Recent Activity</h3>
                    <div class="recent-items">
                        ${this.history.slice(-5).reverse().map(item => `
                            <div class="recent-item" onclick="firefoxBrowser.navigate('${item.url}')">
                                <div class="recent-icon">🌐</div>
                                <div class="recent-info">
                                    <div class="recent-title">${this.sanitizeInput(item.title || item.url)}</div>
                                    <div class="recent-url">${this.sanitizeInput(item.url)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getNeuroDev() {
        return `
            <div class="neuro-dev-site">
                <header class="site-header">
                    <nav class="site-nav">
                        <div class="logo">🧠 Neuro-Dev</div>
                        <div class="nav-links">
                            <a href="#" onclick="firefoxBrowser.loadSection('courses')">Courses</a>
                            <a href="#" onclick="firefoxBrowser.loadSection('ctf')">CTF</a>
                            <a href="#" onclick="firefoxBrowser.loadSection('labs')">Labs</a>
                            <a href="#" onclick="firefoxBrowser.loadSection('about')">About</a>
                        </div>
                    </nav>
                </header>

                <main class="site-main">
                    <section class="hero">
                        <h1>Ethical Hacking Course Roman Urdu Mein</h1>
                        <p>Mobile se NetHunter tak - Complete Cybersecurity Journey</p>
                        <div class="hero-stats">
                            <div class="stat">
                                <div class="stat-number">13+</div>
                                <div class="stat-label">Modules</div>
                            </div>
                            <div class="stat">
                                <div class="stat-number">49+</div>
                                <div class="stat-label">CTF Challenges</div>
                            </div>
                            <div class="stat">
                                <div class="stat-number">500+</div>
                                <div class="stat-label">AI/ML Terms</div>
                            </div>
                        </div>
                    </section>

                    <section class="courses-preview" id="site-content">
                        <h2>Featured Courses</h2>
                        <div class="course-grid">
                            <div class="course-card">
                                <div class="course-icon">📱</div>
                                <h3>Termux Basics</h3>
                                <p>Mobile terminal mastery</p>
                                <button onclick="firefoxBrowser.openCourse('termux-basics')">Start Learning</button>
                            </div>
                            <div class="course-card">
                                <div class="course-icon">🛡️</div>
                                <h3>NetHunter Rootless</h3>
                                <p>Kali Linux on mobile</p>
                                <button onclick="firefoxBrowser.openCourse('nethunter-rootless')">Start Learning</button>
                            </div>
                            <div class="course-card">
                                <div class="course-icon">🤖</div>
                                <h3>AI Hacking</h3>
                                <p>Machine learning security</p>
                                <button onclick="firefoxBrowser.openCourse('ai-hacking')">Start Learning</button>
                            </div>
                        </div>
                        <div class="quick-access">
                            <h3>Quick Access</h3>
                            <div class="link-grid">
                                <div class="link-card" onclick="firefoxBrowser.navigate('https://neuro-dev.local/vulnerable-app')">
                                    <i class="fas fa-bug"></i>
                                    <h4>Vulnerable Web App</h4>
                                    <p>Practice SQL injection, XSS</p>
                                </div>
                                <div class="link-card" onclick="firefoxBrowser.navigate('https://neuro-dev.local/ctf-hub')">
                                    <i class="fas fa-flag"></i>
                                    <h4>CTF Challenges</h4>
                                    <p>Interactive security challenges</p>
                                </div>
                                <div class="link-card" onclick="firefoxBrowser.navigate('https://neuro-dev.local/owasp-top10')">
                                    <i class="fas fa-shield-alt"></i>
                                    <h4>OWASP Top 10</h4>
                                    <p>Web security vulnerabilities</p>
                                </div>
                                <div class="link-card" onclick="firefoxBrowser.navigate('https://neuro-dev.local/web-exploitation')">
                                    <i class="fas fa-globe"></i>
                                    <h4>Web Exploitation</h4>
                                    <p>SQL injection aur XSS lab</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        `;
    }

    getMLAPI() {
        return `
            <div class="ml-api-interface">
                <div class="api-header">
                    <h1>🤖 ML API - Neuro-Dev</h1>
                    <div class="api-status">
                        <span class="status-indicator online"></span>
                        <span>API Status: Online</span>
                    </div>
                </div>

                <div class="api-documentation">
                    <h2>API Endpoints</h2>
                    <div class="endpoint-list">
                        <div class="endpoint-item" onclick="firefoxBrowser.testAPIEndpoint('/health')">
                            <div class="method get">GET</div>
                            <div class="path">/health</div>
                            <div class="description">Health check endpoint</div>
                        </div>
                        <div class="endpoint-item" onclick="firefoxBrowser.testAPIEndpoint('/predict')">
                            <div class="method post">POST</div>
                            <div class="path">/predict</div>
                            <div class="description">Model prediction endpoint</div>
                        </div>
                        <div class="endpoint-item vulnerable" onclick="firefoxBrowser.testAPIEndpoint('/model-info')">
                            <div class="method get">GET</div>
                            <div class="path">/model-info</div>
                            <div class="description">Model metadata (⚠️ Exposed)</div>
                        </div>
                        <div class="endpoint-item vulnerable" onclick="firefoxBrowser.testAPIEndpoint('/admin')">
                            <div class="method get">GET</div>
                            <div class="path">/admin</div>
                            <div class="description">Admin panel (🚨 No Auth)</div>
                        </div>
                    </div>
                </div>

                <div class="api-tester">
                    <h3>API Tester</h3>
                    <div class="tester-form">
                        <select id="api-method">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                        </select>
                        <input type="text" id="api-endpoint" placeholder="/endpoint" value="/health">
                        <button onclick="firefoxBrowser.testCustomEndpoint()">Send Request</button>
                    </div>
                    <div class="api-response" id="api-response"></div>
                </div>
            </div>
        `;
    }

    getCTFChallenges() {
        return `
            <div class="ctf-platform">
                <div class="ctf-header">
                    <h1>🏆 CTF Challenges - Neuro-Dev</h1>
                    <div class="user-stats">
                        <div class="stat">Score: <span id="user-score">0</span></div>
                        <div class="stat">Flags: <span id="user-flags">0</span></div>
                        <div class="stat">Rank: <span id="user-rank">#-</span></div>
                    </div>
                </div>

                <div class="challenge-categories">
                    <div class="category-card" onclick="firefoxBrowser.openChallengeCategory('web')">
                        <div class="category-icon">🌐</div>
                        <h3>Web Exploitation</h3>
                        <div class="category-stats">12 challenges</div>
                    </div>
                    <div class="category-card" onclick="firefoxBrowser.openChallengeCategory('crypto')">
                        <div class="category-icon">🔐</div>
                        <h3>Cryptography</h3>
                        <div class="category-stats">8 challenges</div>
                    </div>
                    <div class="category-card" onclick="firefoxBrowser.openChallengeCategory('ai')">
                        <div class="category-icon">🤖</div>
                        <h3>AI Security</h3>
                        <div class="category-stats">10 challenges</div>
                    </div>
                    <div class="category-card" onclick="firefoxBrowser.openChallengeCategory('forensics')">
                        <div class="category-icon">🔍</div>
                        <h3>Digital Forensics</h3>
                        <div class="category-stats">6 challenges</div>
                    </div>
                </div>

                <div class="recent-challenges">
                    <h3>Recent Challenges</h3>
                    <div class="challenge-list">
                        <div class="challenge-item">
                            <div class="challenge-info">
                                <h4>Hidden Admin Panel</h4>
                                <p>Find and exploit the hidden admin interface</p>
                            </div>
                            <div class="challenge-meta">
                                <span class="difficulty easy">Easy</span>
                                <span class="points">125 pts</span>
                            </div>
                        </div>
                        <div class="challenge-item">
                            <div class="challenge-info">
                                <h4>ML Model Extraction</h4>
                                <p>Extract the machine learning model via API</p>
                            </div>
                            <div class="challenge-meta">
                                <span class="difficulty medium">Medium</span>
                                <span class="points">200 pts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSearchResults(url) {
        const query = new URLSearchParams(url.split('?')[1]).get('q');
        return `
            <div class="search-results">
                <div class="search-header">
                    <h2>Search Results for: "${this.sanitizeInput(query)}"</h2>
                </div>
                <div class="results-list">
                    <div class="result-item">
                        <h3><a href="#" onclick="firefoxBrowser.navigate('https://neuro-dev.local')">Neuro-Dev - Ethical Hacking Course</a></h3>
                        <p>Complete ethical hacking course in Roman Urdu. Learn cybersecurity on mobile devices.</p>
                        <span class="result-url">https://neuro-dev.local</span>
                    </div>
                    <div class="result-item">
                        <h3><a href="#" onclick="firefoxBrowser.navigate('https://github.com/neuro-dev')">Neuro-Dev GitHub Repository</a></h3>
                        <p>Open source ethical hacking tools and educational resources.</p>
                        <span class="result-url">https://github.com/neuro-dev</span>
                    </div>
                </div>
            </div>
        `;
    }

    getGenericPage(url) {
        return `
            <div class="generic-page">
                <div class="page-header">
                    <h1>🌐 ${url}</h1>
                </div>
                <div class="page-content">
                    <p>This is a simulated webpage for demonstration purposes.</p>
                    <p>In a real browser, this would load the actual website content.</p>
                    
                    <div class="page-actions">
                        <button onclick="firefoxBrowser.navigate('https://neuro-dev.local')">
                            Go to Neuro-Dev
                        </button>
                        <button onclick="firefoxBrowser.viewSource()">
                            View Page Source
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Navigation functions
    goBack() {
        const tab = this.getActiveTab();
        if (tab && tab.historyIndex > 0) {
            tab.historyIndex--;
            tab.url = tab.history[tab.historyIndex];
            this.loadTabContent(tab);
            this.updateAddressBar(tab.url);
        }
    }

    goForward() {
        const tab = this.getActiveTab();
        if (tab && tab.historyIndex < tab.history.length - 1) {
            tab.historyIndex++;
            tab.url = tab.history[tab.historyIndex];
            this.loadTabContent(tab);
            this.updateAddressBar(tab.url);
        }
    }

    refresh() {
        const tab = this.getActiveTab();
        if (tab) {
            tab.loading = true;
            this.renderTabs();
            setTimeout(() => {
                this.loadTabContent(tab);
            }, 500);
        }
    }

    goHome() {
        this.navigate('https://neuro-dev.local');
    }

    updateAddressBar(url) {
        const input = document.getElementById('firefox-url-input');
        if (input) {
            input.value = url;
        }
    }

    updateTabTitle(tab) {
        // Extract title from content or use URL
        const content = document.getElementById('tab-content');
        if (content) {
            const h1 = content.querySelector('h1');
            if (h1) {
                tab.title = h1.textContent.substring(0, 30);
                this.renderTabs();
            }
        }
    }

    updatePageStatus(status) {
        const statusElement = document.getElementById('page-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    addToHistory(url) {
        const tab = this.getActiveTab();
        if (tab) {
            // Add to tab history
            tab.history = tab.history.slice(0, tab.historyIndex + 1);
            tab.history.push(url);
            tab.historyIndex = tab.history.length - 1;
        }

        // Add to global history
        this.history.push({
            url: url,
            title: tab ? tab.title : 'Unknown',
            timestamp: new Date()
        });

        // Keep only last 100 items
        if (this.history.length > 100) {
            this.history = this.history.slice(-100);
        }
    }

    // Developer Tools
    toggleDevTools() {
        const devTools = document.getElementById('firefox-devtools');
        if (devTools) {
            this.devToolsOpen = !this.devToolsOpen;
            devTools.style.display = this.devToolsOpen ? 'block' : 'none';
            
            if (this.devToolsOpen) {
                this.loadConsole();
            }
        }
    }

    switchDevTool(tool) {
        // Update active tab
        document.querySelectorAll('.devtools-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');

        // Load tool content
        const content = document.getElementById('devtools-content');
        if (content) {
            switch(tool) {
                case 'console':
                    this.loadConsole();
                    break;
                case 'inspector':
                    this.loadInspector();
                    break;
                case 'network':
                    this.loadNetworkTool();
                    break;
                case 'security':
                    this.loadSecurityTool();
                    break;
            }
        }
    }

    loadConsole() {
        const content = document.getElementById('devtools-content');
        if (content) {
            content.innerHTML = `
                <div class="console-container">
                    <div class="console-output" id="console-output">
                        <div class="console-line info">Firefox Developer Tools Console</div>
                        <div class="console-line">Type help() for available commands</div>
                        <div class="console-line">Current page: ${this.getActiveTab()?.url || 'about:blank'}</div>
                    </div>
                    <div class="console-input">
                        <span class="console-prompt">&gt;&gt;</span>
                        <input type="text" id="console-command" placeholder="Enter JavaScript command" 
                               onkeypress="if(event.key==='Enter') window.firefoxBrowser && window.firefoxBrowser.executeConsoleCommand()">
                    </div>
                </div>
            `;
        }
    }

    loadInspector() {
        const content = document.getElementById('devtools-content');
        if (content) {
            content.innerHTML = `
                <div class="inspector-container">
                    <div class="inspector-tree">
                        <div class="html-tree">
                            <div class="html-element">&lt;html&gt;</div>
                            <div class="html-element indent">&lt;head&gt;</div>
                            <div class="html-element indent2">&lt;title&gt;${this.getActiveTab()?.title || 'Page'}&lt;/title&gt;</div>
                            <div class="html-element indent">&lt;/head&gt;</div>
                            <div class="html-element indent">&lt;body&gt;</div>
                            <div class="html-element indent2">&lt;div class="content"&gt;...&lt;/div&gt;</div>
                            <div class="html-element indent">&lt;/body&gt;</div>
                            <div class="html-element">&lt;/html&gt;</div>
                        </div>
                    </div>
                    <div class="inspector-styles">
                        <h4>Computed Styles</h4>
                        <div class="style-property">display: block</div>
                        <div class="style-property">margin: 0px</div>
                        <div class="style-property">padding: 20px</div>
                    </div>
                </div>
            `;
        }
    }

    loadNetworkTool() {
        const content = document.getElementById('devtools-content');
        if (content) {
            content.innerHTML = `
                <div class="network-container">
                    <div class="network-toolbar">
                        <button onclick="window.firefoxBrowser && window.firefoxBrowser.clearNetworkLog()">Clear</button>
                        <label><input type="checkbox" checked> Preserve log</label>
                    </div>
                    <div class="network-table">
                        <div class="network-header">
                            <span>Name</span>
                            <span>Status</span>
                            <span>Type</span>
                            <span>Size</span>
                            <span>Time</span>
                        </div>
                        <div class="network-row">
                            <span>${this.getActiveTab()?.url || 'document'}</span>
                            <span class="status-200">200</span>
                            <span>document</span>
                            <span>2.3 KB</span>
                            <span>245ms</span>
                        </div>
                        <div class="network-row">
                            <span>styles.css</span>
                            <span class="status-200">200</span>
                            <span>stylesheet</span>
                            <span>1.2 KB</span>
                            <span>89ms</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    loadSecurityTool() {
        const content = document.getElementById('devtools-content');
        if (content) {
            const tab = this.getActiveTab();
            const isSecure = tab?.url.startsWith('https://');
            
            content.innerHTML = `
                <div class="security-container">
                    <div class="security-overview">
                        <div class="security-status ${isSecure ? 'secure' : 'insecure'}">
                            <i class="fas fa-${isSecure ? 'lock' : 'exclamation-triangle'}"></i>
                            <span>${isSecure ? 'This page is secure (HTTPS)' : 'This page is not secure'}</span>
                        </div>
                    </div>
                    <div class="security-details">
                        <h4>Connection Security</h4>
                        <div class="security-item">
                            <span>Protocol:</span>
                            <span>${isSecure ? 'TLS 1.3' : 'HTTP (Insecure)'}</span>
                        </div>
                        <div class="security-item">
                            <span>Certificate:</span>
                            <span>${isSecure ? 'Valid (Neuro-Dev CA)' : 'None'}</span>
                        </div>
                        <div class="security-item">
                            <span>Cipher Suite:</span>
                            <span>${isSecure ? 'TLS_AES_256_GCM_SHA384' : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    executeConsoleCommand() {
        const input = document.getElementById('console-command');
        const output = document.getElementById('console-output');
        
        if (!input || !output) return;
        
        const command = input.value.trim();
        if (!command) return;

        // Add command to output
        const commandLine = document.createElement('div');
        commandLine.className = 'console-line command';
        commandLine.textContent = '>> ' + command;
        output.appendChild(commandLine);

        // Execute command
        let result = '';
        try {
            switch(command) {
                case 'help()':
                    result = 'Available commands: help(), location, document, window, console.log()';
                    break;
                case 'location':
                    result = this.getActiveTab()?.url || 'about:blank';
                    break;
                case 'document.title':
                    result = this.getActiveTab()?.title || 'Untitled';
                    break;
                default:
                    if (command.startsWith('console.log(')) {
                        const msg = command.match(/console\.log\(['"`](.+)['"`]\)/);
                        result = msg ? msg[1] : 'undefined';
                    } else {
                        result = 'Command not recognized. Type help() for available commands.';
                    }
            }
        } catch (e) {
            result = 'Error: ' + e.message;
        }

        // Add result to output
        const resultLine = document.createElement('div');
        resultLine.className = 'console-line result';
        resultLine.textContent = result;
        output.appendChild(resultLine);

        // Clear input and scroll to bottom
        input.value = '';
        output.scrollTop = output.scrollHeight;
    }

    // Bookmarks
    toggleBookmarks() {
        const bookmarksBar = document.getElementById('bookmarks-bar');
        if (bookmarksBar) {
            const isVisible = bookmarksBar.style.display !== 'none';
            bookmarksBar.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.renderBookmarks();
            }
        }
    }

    renderBookmarks() {
        const container = document.getElementById('bookmarks-container');
        if (!container) return;

        container.innerHTML = this.bookmarks.map(bookmark => `
            <div class="bookmark-item" onclick="firefoxBrowser.navigate('${bookmark.url}')" 
                 title="${this.sanitizeInput(bookmark.title)}">
                <i class="fas fa-bookmark"></i>
                <span>${this.sanitizeInput(bookmark.title)}</span>
            </div>
        `).join('');
    }

    loadBookmarks() {
        return [
            { title: 'Neuro-Dev Home', url: 'https://neuro-dev.local' },
            { title: 'ML API', url: 'https://ml-api.neuro-dev:8080' },
            { title: 'CTF Challenges', url: 'https://ctf-challenges.neuro-dev' },
            { title: 'GitHub', url: 'https://github.com/neuro-dev' }
        ];
    }

    // Context Menus
    showContextMenu(event) {
        const menu = document.getElementById('context-menu');
        if (!menu) return;

        menu.innerHTML = `
            <div class="context-item" onclick="window.firefoxBrowser && window.firefoxBrowser.goBack()">
                <i class="fas fa-arrow-left"></i> Back
            </div>
            <div class="context-item" onclick="window.firefoxBrowser && window.firefoxBrowser.goForward()">
                <i class="fas fa-arrow-right"></i> Forward
            </div>
            <div class="context-item" onclick="window.firefoxBrowser && window.firefoxBrowser.refresh()">
                <i class="fas fa-redo"></i> Reload
            </div>
            <div class="context-separator"></div>
            <div class="context-item" onclick="window.firefoxBrowser && window.firefoxBrowser.viewSource()">
                <i class="fas fa-code"></i> View Page Source
            </div>
            <div class="context-item" onclick="window.firefoxBrowser && window.firefoxBrowser.toggleDevTools()">
                <i class="fas fa-wrench"></i> Inspect Element
            </div>
        `;

        menu.style.display = 'block';
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';
    }

    hideContextMenu() {
        const menu = document.getElementById('context-menu');
        if (menu) {
            menu.style.display = 'none';
        }
    }

    showTabContextMenu(event, tabId) {
        event.preventDefault();
        event.stopPropagation();
        
        const menu = document.getElementById('context-menu');
        if (!menu) return;

        menu.innerHTML = `
            <div class="context-item" onclick="firefoxBrowser.createNewTab()">
                <i class="fas fa-plus"></i> New Tab
            </div>
            <div class="context-item" onclick="firefoxBrowser.duplicateTab(${tabId})">
                <i class="fas fa-copy"></i> Duplicate Tab
            </div>
            <div class="context-separator"></div>
            <div class="context-item" onclick="firefoxBrowser.closeTab(${tabId})">
                <i class="fas fa-times"></i> Close Tab
            </div>
            <div class="context-item" onclick="firefoxBrowser.closeOtherTabs(${tabId})">
                <i class="fas fa-times-circle"></i> Close Other Tabs
            </div>
        `;

        menu.style.display = 'block';
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';
    }

    // Utility functions
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.replace(/[<>\"'&]/g, function(match) {
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

    // API Testing functions
    testAPIEndpoint(endpoint) {
        const response = document.getElementById('api-response');
        if (!response) return;

        const responses = {
            '/health': { status: 200, data: { status: 'healthy', uptime: '24h' } },
            '/predict': { status: 200, data: { prediction: 0.85, confidence: 0.92 } },
            '/model-info': { 
                status: 200, 
                data: { 
                    model_type: 'RandomForest', 
                    features: 4, 
                    accuracy: 0.94,
                    secret_key: 'NEURO{api_secret_key_2024}'
                } 
            },
            '/admin': { 
                status: 200, 
                data: { 
                    admin_panel: true, 
                    users: 1337, 
                    flag: 'NEURO{admin_panel_exposed}'
                } 
            }
        };

        const resp = responses[endpoint] || { status: 404, data: { error: 'Not found' } };
        
        response.innerHTML = `
            <div class="response-header">
                <span class="status-${resp.status}">${resp.status}</span>
                <span>${endpoint}</span>
            </div>
            <pre class="response-body">${JSON.stringify(resp.data, null, 2)}</pre>
        `;
    }

    testCustomEndpoint() {
        const method = document.getElementById('api-method').value;
        const endpoint = document.getElementById('api-endpoint').value;
        
        // Simulate API call
        setTimeout(() => {
            this.testAPIEndpoint(endpoint);
        }, 500);
    }

    // Course and challenge functions
    openCourse(courseId) {
        if (window.vm) {
            window.vm.switchApp('terminal');
            if (window.terminal) {
                window.terminal.setCourse(courseId);
            }
        }
    }

    loadSection(section) {
        const content = document.getElementById('site-content');
        if (!content) return;

        const sections = {
            'courses': `
                <h2>All Courses</h2>
                <div class="course-grid">
                    <div class="course-card">
                        <h3>Termux Basics</h3>
                        <p>Mobile terminal fundamentals</p>
                    </div>
                    <div class="course-card">
                        <h3>NetHunter Rootless</h3>
                        <p>Kali Linux without root</p>
                    </div>
                    <div class="course-card">
                        <h3>AI Security</h3>
                        <p>Machine learning vulnerabilities</p>
                    </div>
                </div>
            `,
            'ctf': `
                <h2>CTF Challenges</h2>
                <p>Test your skills with our capture the flag challenges</p>
                <button onclick="firefoxBrowser.navigate('https://ctf-challenges.neuro-dev')">
                    Open CTF Platform
                </button>
            `,
            'labs': `
                <h2>Virtual Labs</h2>
                <p>Practice in safe, isolated environments</p>
                <div class="lab-list">
                    <div class="lab-item">Network Simulation Lab</div>
                    <div class="lab-item">Web Application Security Lab</div>
                    <div class="lab-item">Malware Analysis Lab</div>
                </div>
            `,
            'about': `
                <h2>About Neuro-Dev</h2>
                <p>Neuro-Dev is a comprehensive ethical hacking education platform designed for mobile learning.</p>
                <p>Our mission is to make cybersecurity education accessible to everyone, especially those who only have mobile devices.</p>
            `
        };

        content.innerHTML = sections[section] || sections['courses'];
    }

    openChallengeCategory(category) {
        const challenges = {
            'web': [
                { name: 'SQL Injection Basics', difficulty: 'Easy', points: 100 },
                { name: 'XSS Playground', difficulty: 'Medium', points: 150 },
                { name: 'CSRF Attack', difficulty: 'Hard', points: 200 }
            ],
            'crypto': [
                { name: 'Caesar Cipher', difficulty: 'Easy', points: 75 },
                { name: 'RSA Factoring', difficulty: 'Medium', points: 175 },
                { name: 'AES Key Recovery', difficulty: 'Hard', points: 250 }
            ],
            'ai': [
                { name: 'Model Extraction', difficulty: 'Medium', points: 200 },
                { name: 'Adversarial Examples', difficulty: 'Hard', points: 250 },
                { name: 'Privacy Attack', difficulty: 'Expert', points: 300 }
            ],
            'forensics': [
                { name: 'Memory Dump Analysis', difficulty: 'Medium', points: 180 },
                { name: 'Network Packet Analysis', difficulty: 'Hard', points: 220 },
                { name: 'Disk Image Investigation', difficulty: 'Expert', points: 280 }
            ]
        };

        const categoryData = challenges[category] || [];
        const content = document.getElementById('tab-content');
        
        if (content) {
            content.innerHTML = `
                <div class="challenge-category">
                    <h2>${category.toUpperCase()} Challenges</h2>
                    <div class="challenge-list">
                        ${categoryData.map(challenge => `
                            <div class="challenge-item">
                                <div class="challenge-info">
                                    <h4>${challenge.name}</h4>
                                    <div class="challenge-meta">
                                        <span class="difficulty ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</span>
                                        <span class="points">${challenge.points} pts</span>
                                    </div>
                                </div>
                                <button onclick="firefoxBrowser.startChallenge('${challenge.name}')">
                                    Start Challenge
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    startChallenge(challengeName) {
        // Switch to terminal and start challenge
        if (window.vm) {
            window.vm.switchApp('terminal');
        }
        
        // Show challenge started notification
        this.showNotification(`Challenge "${challengeName}" started in terminal!`);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'firefox-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #0078d4;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Additional utility functions
    viewSource() {
        const tab = this.getActiveTab();
        if (tab) {
            const sourceTab = this.createNewTab('view-source:' + tab.url, 'Source: ' + tab.title);
            const content = document.getElementById('tab-content');
            if (content) {
                content.innerHTML = `
                    <div class="source-viewer">
                        <div class="source-header">
                            <h3>Page Source: ${this.sanitizeInput(tab.url)}</h3>
                        </div>
                        <pre class="source-code">&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;${this.sanitizeInput(tab.title)}&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;${this.sanitizeInput(tab.title)}&lt;/h1&gt;
    &lt;p&gt;This is the simulated source code for demonstration.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
                    </div>
                `;
            }
        }
    }

    showFindDialog() {
        const modal = document.getElementById('modal-overlay');
        const dialog = document.getElementById('modal-dialog');
        
        if (modal && dialog) {
            dialog.innerHTML = `
                <div class="find-dialog">
                    <h3>Find in page</h3>
                    <input type="text" id="find-input" placeholder="Enter search term">
                    <div class="dialog-buttons">
                        <button onclick="firefoxBrowser.findInPage()">Find</button>
                        <button onclick="firefoxBrowser.closeModal()">Cancel</button>
                    </div>
                </div>
            `;
            modal.style.display = 'flex';
            document.getElementById('find-input').focus();
        }
    }

    findInPage() {
        const input = document.getElementById('find-input');
        if (input) {
            const searchTerm = input.value;
            // Simulate find functionality
            this.showNotification(`Searching for: "${searchTerm}"`);
            this.closeModal();
        }
    }

    closeModal() {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showDownloads() {
        const modal = document.getElementById('modal-overlay');
        const dialog = document.getElementById('modal-dialog');
        
        if (modal && dialog) {
            dialog.innerHTML = `
                <div class="downloads-dialog">
                    <h3>Downloads</h3>
                    <div class="downloads-list">
                        ${this.downloads.length === 0 ? 
                            '<p>No downloads yet</p>' :
                            this.downloads.map(download => `
                                <div class="download-item">
                                    <div class="download-info">
                                        <div class="download-name">${this.sanitizeInput(download.name)}</div>
                                        <div class="download-url">${this.sanitizeInput(download.url)}</div>
                                    </div>
                                    <div class="download-status">${download.status}</div>
                                </div>
                            `).join('')
                        }
                    </div>
                    <div class="dialog-buttons">
                        <button onclick="firefoxBrowser.closeModal()">Close</button>
                    </div>
                </div>
            `;
            modal.style.display = 'flex';
        }
    }

    showSettings() {
        const modal = document.getElementById('modal-overlay');
        const dialog = document.getElementById('modal-dialog');
        
        if (modal && dialog) {
            dialog.innerHTML = `
                <div class="settings-dialog">
                    <h3>Firefox Settings</h3>
                    <div class="settings-sections">
                        <div class="settings-section">
                            <h4>Privacy & Security</h4>
                            <label><input type="checkbox" checked> Block trackers</label>
                            <label><input type="checkbox" checked> Enable HTTPS-Only mode</label>
                        </div>
                        <div class="settings-section">
                            <h4>General</h4>
                            <label>Homepage: <input type="text" value="https://neuro-dev.local"></label>
                            <label>Search Engine: <select><option>Google</option><option>DuckDuckGo</option></select></label>
                        </div>
                    </div>
                    <div class="dialog-buttons">
                        <button onclick="firefoxBrowser.closeModal()">Close</button>
                    </div>
                </div>
            `;
            modal.style.display = 'flex';
        }
    }

    showMainMenu() {
        // Implementation for main menu
        this.showNotification('Main menu opened');
    }

    toggleMenu(menuName) {
        // Implementation for menu bar menus
        this.showNotification(`${menuName} menu opened`);
    }

    duplicateTab(tabId) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) {
            this.createNewTab(tab.url, tab.title + ' (Copy)');
        }
    }

    closeOtherTabs(keepTabId) {
        this.tabs = this.tabs.filter(tab => tab.id === keepTabId);
        this.activeTabId = keepTabId;
        this.renderTabs();
        this.loadTabContent(this.getActiveTab());
    }
}

FirefoxBrowser.prototype.clearNetworkLog = function() {
        this.loadNetworkTool();
};

FirefoxBrowser.prototype.loadExtensions = function() {
        // Simulate loading extensions
        this.extensions = [
            { name: 'uBlock Origin', enabled: true },
            { name: 'Privacy Badger', enabled: true },
            { name: 'Neuro-Dev Security Tools', enabled: true }
        ];
};

// Global functions for Firefox browser
window.firefoxBrowser = null;

// Global initialization function
window.initFirefoxBrowser = function() {
    console.log('Initializing Firefox browser globally...');
    if (!window.firefoxBrowser && document.getElementById('browser-app')) {
        try {
            window.firefoxBrowser = new FirefoxBrowser();
            console.log('Firefox browser initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing Firefox browser:', error);
            return false;
        }
    }
    return false;
};

// Initialize Firefox browser when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Firefox browser DOM loaded, checking for browser-app...');
    
    // Wait for all elements to be ready
    setTimeout(() => {
        const browserApp = document.getElementById('browser-app');
        if (browserApp && !window.firefoxBrowser) {
            console.log('Browser app found, initializing Firefox browser...');
            try {
                window.firefoxBrowser = new FirefoxBrowser();
                console.log('Firefox browser initialized successfully');
            } catch (error) {
                console.error('Error initializing Firefox browser:', error);
            }
        }
    }, 2000);
});

// Make Firefox browser class globally available
window.FirefoxBrowser = FirefoxBrowser;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirefoxBrowser;
};

// Browser.js integration - Additional page content methods
FirefoxBrowser.prototype.getVulnerableApp = function() {
        return `
            <div class="vulnerable-app">
                <h2>🐛 Vulnerable Web Application</h2>
                <div class="app-container">
                    <form class="login-form" onsubmit="firefoxBrowser.testSQLInjection(event)">
                        <h3>Login Portal</h3>
                        <input type="text" id="username" placeholder="Username" required>
                        <input type="password" id="password" placeholder="Password" required>
                        <button type="submit">Login</button>
                    </form>
                    <div class="vulnerability-hints">
                        <h4>🎯 Try These Attacks:</h4>
                        <div class="hint-item" onclick="firefoxBrowser.fillSQLInjection()">
                            <strong>SQL Injection:</strong> admin' OR 1=1--
                        </div>
                    </div>
                    <div id="attack-result"></div>
                </div>
            </div>
        `;
    }

FirefoxBrowser.prototype.getOWASPGuide = function() {
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
                        <div class="owasp-id">A03</div>
                        <div class="owasp-name">Injection</div>
                        <div class="owasp-risk">High</div>
                    </div>
                </div>
            </div>
        `;
};

FirefoxBrowser.prototype.getCtfHub = function() {
        return `
            <div class="ctf-hub">
                <h1>🏆 CTF Challenges Hub</h1>
                <div class="challenge-categories">
                    <div class="category-card" onclick="firefoxBrowser.navigate('https://neuro-dev.local/web-exploitation')">
                        <div class="difficulty medium">Medium</div>
                        <i class="fas fa-globe"></i>
                        <h3>Web Exploitation</h3>
                        <p>SQL injection aur XSS attacks</p>
                        <div class="points">175 points</div>
                    </div>
                    <div class="category-card" onclick="firefoxBrowser.navigate('https://neuro-dev.local/crypto-challenges')">
                        <div class="difficulty hard">Hard</div>
                        <i class="fas fa-lock"></i>
                        <h3>Cryptography</h3>
                        <p>Encryption break kariye</p>
                        <div class="points">200 points</div>
                    </div>
                </div>
            </div>
        `;
};

FirefoxBrowser.prototype.getWebExploitation = function() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: Web Exploitation Lab</h2>
                <div class="web-lab">
                    <div class="vuln-targets">
                        <div class="target-card">
                            <h4>SQL Injection Target</h4>
                            <div class="vuln-form">
                                <input type="text" id="sqli-input" placeholder="Search products...">
                                <button onclick="firefoxBrowser.testWebVuln('sqli')">Search</button>
                            </div>
                        </div>
                        <div class="target-card">
                            <h4>XSS Target</h4>
                            <div class="vuln-form">
                                <input type="text" id="xss-input" placeholder="Leave a comment...">
                                <button onclick="firefoxBrowser.testWebVuln('xss')">Submit</button>
                            </div>
                        </div>
                    </div>
                    <div id="web-vuln-result"></div>
                </div>
            </div>
        `;
};

FirefoxBrowser.prototype.getCryptoChallenges = function() {
        return `
            <div class="ctf-challenge">
                <h2>🏆 CTF: Cryptography Challenges</h2>
                <div class="crypto-lab">
                    <div class="crypto-challenges">
                        <div class="crypto-card" onclick="firefoxBrowser.solveCrypto('caesar')">
                            <h4>Caesar Cipher</h4>
                            <p>Encrypted: QHXUR{FDHVDU_FLSKHU_FUDFNHG}</p>
                            <button>Decrypt</button>
                        </div>
                    </div>
                    <div id="crypto-result"></div>
                </div>
            </div>
        `;
};

// Challenge interaction methods
FirefoxBrowser.prototype.testSQLInjection = function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const result = document.getElementById('attack-result');
        
        if (username.includes("'") || username.includes('OR')) {
            result.innerHTML = `<div class="attack-success">🎉 SQL Injection Successful!<br>Flag: NEURO{sql_injection_bypass_admin123}</div>`;
        } else {
            result.innerHTML = `<div class="attack-failed">❌ Login failed. Try SQL injection.</div>`;
        }
};

FirefoxBrowser.prototype.fillSQLInjection = function() {
        document.getElementById('username').value = "admin' OR 1=1--";
        document.getElementById('password').value = "anything";
};

FirefoxBrowser.prototype.testWebVuln = function(vulnType) {
        const result = document.getElementById('web-vuln-result');
        const input = document.getElementById(`${vulnType}-input`);
        const value = input ? input.value : '';
        
        if (vulnType === 'sqli' && value.includes("'")) {
            result.innerHTML = `<div class="attack-success">🎉 SQL Injection!<br>Flag: NEURO{sql_injection_database_pwned}</div>`;
        } else if (vulnType === 'xss' && value.includes('<script>')) {
            result.innerHTML = `<div class="attack-success">🎉 XSS Attack!<br>Flag: NEURO{xss_payload_executed}</div>`;
        }
};

FirefoxBrowser.prototype.solveCrypto = function(cryptoType) {
        const result = document.getElementById('crypto-result');
        result.innerHTML = `<div class="attack-success">🔓 Crypto Solved!<br>Flag: NEURO{caesar_cipher_cracked}</div>`;
    }