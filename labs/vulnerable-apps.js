// Vulnerable Web Applications for Security Testing
class VulnerableApps {
    constructor() {
        this.apps = this.initApps();
        this.currentApp = null;
        this.init();
    }

    init() {
        this.setupRouting();
    }

    initApps() {
        return {
            'vulnerable-login': {
                name: 'Vulnerable Login System',
                description: 'SQL Injection & Authentication Bypass',
                url: '/vulnerable-apps/login',
                vulnerabilities: ['SQL Injection', 'Authentication Bypass'],
                difficulty: 'Easy'
            },
            'xss-playground': {
                name: 'XSS Testing Ground',
                description: 'Cross-Site Scripting Vulnerabilities',
                url: '/vulnerable-apps/xss',
                vulnerabilities: ['Reflected XSS', 'Stored XSS', 'DOM XSS'],
                difficulty: 'Medium'
            },
            'file-upload': {
                name: 'Insecure File Upload',
                description: 'File Upload Vulnerabilities',
                url: '/vulnerable-apps/upload',
                vulnerabilities: ['Unrestricted File Upload', 'Path Traversal'],
                difficulty: 'Hard'
            },
            'api-security': {
                name: 'Vulnerable API',
                description: 'REST API Security Issues',
                url: '/vulnerable-apps/api',
                vulnerabilities: ['IDOR', 'Broken Authentication', 'Rate Limiting'],
                difficulty: 'Medium'
            }
        };
    }

    setupRouting() {
        // Simulate different vulnerable applications
        window.loadVulnerableApp = (appId) => {
            this.currentApp = appId;
            this.renderApp(appId);
        };
    }

    renderApp(appId) {
        const app = this.apps[appId];
        if (!app) return;

        const content = this.generateAppContent(appId);
        
        // Update browser content if in VM
        if (window.browser) {
            window.browser.loadContent(content);
        } else {
            // Standalone mode
            document.body.innerHTML = content;
        }
    }

    generateAppContent(appId) {
        switch(appId) {
            case 'vulnerable-login':
                return this.generateLoginApp();
            case 'xss-playground':
                return this.generateXSSApp();
            case 'file-upload':
                return this.generateFileUploadApp();
            case 'api-security':
                return this.generateAPIApp();
            default:
                return this.generateAppList();
        }
    }

    generateLoginApp() {
        return `
            <div class="vulnerable-app">
                <div class="app-header">
                    <h2>🔐 Vulnerable Login System</h2>
                    <p>Target: Find SQL injection vulnerability and bypass authentication</p>
                    <div class="vulnerability-tags">
                        <span class="vuln-tag sql">SQL Injection</span>
                        <span class="vuln-tag auth">Auth Bypass</span>
                    </div>
                </div>
                
                <div class="app-content">
                    <div class="login-container">
                        <h3>Admin Login</h3>
                        <form id="login-form" onsubmit="return handleLogin(event)">
                            <div class="form-group">
                                <label>Username:</label>
                                <input type="text" id="username" name="username" required>
                                <small class="hint">💡 Try: admin' OR '1'='1'-- </small>
                            </div>
                            <div class="form-group">
                                <label>Password:</label>
                                <input type="password" id="password" name="password" required>
                            </div>
                            <button type="submit">Login</button>
                        </form>
                        
                        <div id="login-result"></div>
                        
                        <div class="source-code">
                            <h4>📄 Source Code (Vulnerable)</h4>
                            <pre><code>
// Vulnerable SQL Query
$query = "SELECT * FROM users WHERE username = '" . $_POST['username'] . "' 
          AND password = '" . md5($_POST['password']) . "'";

if (mysqli_num_rows(mysqli_query($conn, $query)) > 0) {
    echo "Login successful!";
} else {
    echo "Invalid credentials!";
}
                            </code></pre>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                function handleLogin(event) {
                    event.preventDefault();
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                    const result = document.getElementById('login-result');
                    
                    // Simulate SQL injection vulnerability
                    if (username.includes("'") || username.includes("--") || 
                        username.toLowerCase().includes("or") || 
                        username.includes("1=1")) {
                        result.innerHTML = '<div class="success">🎉 Login Successful! Welcome Admin!</div>';
                        result.innerHTML += '<div class="flag">🚩 Flag: NEURO{sql_injection_found}</div>';
                        
                        // Auto-complete challenge if system is available
                        if (window.challengeSystem) {
                            setTimeout(() => {
                                window.challengeSystem.completeChallenge('ws-001');
                            }, 1000);
                        }
                    } else {
                        result.innerHTML = '<div class="error">❌ Invalid credentials!</div>';
                    }
                    
                    return false;
                }
            </script>
        `;
    }

    generateXSSApp() {
        return `
            <div class="vulnerable-app">
                <div class="app-header">
                    <h2>💬 XSS Testing Ground</h2>
                    <p>Target: Execute JavaScript code through XSS vulnerabilities</p>
                    <div class="vulnerability-tags">
                        <span class="vuln-tag xss">Reflected XSS</span>
                        <span class="vuln-tag xss">Stored XSS</span>
                        <span class="vuln-tag xss">DOM XSS</span>
                    </div>
                </div>
                
                <div class="app-content">
                    <div class="xss-container">
                        <!-- Reflected XSS -->
                        <div class="xss-section">
                            <h3>🔍 Search (Reflected XSS)</h3>
                            <form onsubmit="return handleSearch(event)">
                                <input type="text" id="search-input" placeholder="Search..." required>
                                <button type="submit">Search</button>
                            </form>
                            <div id="search-results"></div>
                            <small class="hint">💡 Try: &lt;script&gt;alert('XSS')&lt;/script&gt;</small>
                        </div>
                        
                        <!-- Stored XSS -->
                        <div class="xss-section">
                            <h3>💭 Comments (Stored XSS)</h3>
                            <form onsubmit="return handleComment(event)">
                                <textarea id="comment-input" placeholder="Leave a comment..." required></textarea>
                                <button type="submit">Post Comment</button>
                            </form>
                            <div id="comments-list">
                                <div class="comment">
                                    <strong>User1:</strong> Great website!
                                </div>
                            </div>
                            <small class="hint">💡 Try: &lt;img src=x onerror=alert('Stored XSS')&gt;</small>
                        </div>
                        
                        <!-- DOM XSS -->
                        <div class="xss-section">
                            <h3>🌐 URL Fragment (DOM XSS)</h3>
                            <p>Current fragment: <span id="fragment-display"></span></p>
                            <button onclick="updateFragment()">Update from URL</button>
                            <small class="hint">💡 Try: #&lt;script&gt;alert('DOM XSS')&lt;/script&gt;</small>
                        </div>
                        
                        <div class="source-code">
                            <h4>📄 Vulnerable Code Examples</h4>
                            <pre><code>
// Reflected XSS
echo "Search results for: " . $_GET['q'];

// Stored XSS  
echo "&lt;div&gt;" . $_POST['comment'] . "&lt;/div&gt;";

// DOM XSS
document.getElementById('output').innerHTML = location.hash.substr(1);
                            </code></pre>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                function handleSearch(event) {
                    event.preventDefault();
                    const query = document.getElementById('search-input').value;
                    const results = document.getElementById('search-results');
                    
                    // Vulnerable: Direct HTML insertion
                    results.innerHTML = '<div class="search-result">Search results for: ' + query + '</div>';
                    
                    if (query.includes('<script>') || query.includes('alert(')) {
                        setTimeout(() => {
                            results.innerHTML += '<div class="flag">🚩 Flag: NEURO{xss_executed}</div>';
                            if (window.challengeSystem) {
                                window.challengeSystem.completeChallenge('ws-002');
                            }
                        }, 500);
                    }
                    
                    return false;
                }
                
                function handleComment(event) {
                    event.preventDefault();
                    const comment = document.getElementById('comment-input').value;
                    const commentsList = document.getElementById('comments-list');
                    
                    // Vulnerable: Direct HTML insertion
                    const newComment = document.createElement('div');
                    newComment.className = 'comment';
                    newComment.innerHTML = '<strong>You:</strong> ' + comment;
                    commentsList.appendChild(newComment);
                    
                    document.getElementById('comment-input').value = '';
                    
                    if (comment.includes('<') && (comment.includes('script') || comment.includes('onerror'))) {
                        setTimeout(() => {
                            const flagDiv = document.createElement('div');
                            flagDiv.className = 'flag';
                            flagDiv.innerHTML = '🚩 Flag: NEURO{stored_xss_executed}';
                            commentsList.appendChild(flagDiv);
                        }, 500);
                    }
                    
                    return false;
                }
                
                function updateFragment() {
                    const fragment = location.hash.substr(1);
                    const display = document.getElementById('fragment-display');
                    
                    // Vulnerable: Direct HTML insertion
                    display.innerHTML = fragment;
                    
                    if (fragment.includes('<script>') || fragment.includes('alert(')) {
                        setTimeout(() => {
                            display.innerHTML += '<br><div class="flag">🚩 Flag: NEURO{dom_xss_executed}</div>';
                        }, 500);
                    }
                }
                
                // Auto-update fragment on load
                window.addEventListener('load', updateFragment);
                window.addEventListener('hashchange', updateFragment);
            </script>
        `;
    }

    generateFileUploadApp() {
        return `
            <div class="vulnerable-app">
                <div class="app-header">
                    <h2>📁 File Upload System</h2>
                    <p>Target: Upload malicious files and exploit path traversal</p>
                    <div class="vulnerability-tags">
                        <span class="vuln-tag upload">Unrestricted Upload</span>
                        <span class="vuln-tag path">Path Traversal</span>
                    </div>
                </div>
                
                <div class="app-content">
                    <div class="upload-container">
                        <div class="upload-section">
                            <h3>📤 File Upload</h3>
                            <form onsubmit="return handleUpload(event)">
                                <input type="file" id="file-input" required>
                                <input type="text" id="filename-input" placeholder="Custom filename (optional)">
                                <button type="submit">Upload File</button>
                            </form>
                            <div id="upload-result"></div>
                            <small class="hint">💡 Try uploading: shell.php or ../../etc/passwd</small>
                        </div>
                        
                        <div class="download-section">
                            <h3>📥 File Download</h3>
                            <form onsubmit="return handleDownload(event)">
                                <input type="text" id="download-input" placeholder="Enter filename" required>
                                <button type="submit">Download</button>
                            </form>
                            <div id="download-result"></div>
                            <small class="hint">💡 Try: ../../../etc/passwd</small>
                        </div>
                        
                        <div class="uploaded-files">
                            <h3>📋 Uploaded Files</h3>
                            <ul id="files-list">
                                <li>document.pdf</li>
                                <li>image.jpg</li>
                                <li>data.csv</li>
                            </ul>
                        </div>
                        
                        <div class="source-code">
                            <h4>📄 Vulnerable Code</h4>
                            <pre><code>
// Unrestricted file upload
$uploadDir = "/uploads/";
$filename = $_FILES['file']['name'];
move_uploaded_file($_FILES['file']['tmp_name'], $uploadDir . $filename);

// Path traversal vulnerability
$file = $_GET['file'];
$content = file_get_contents("/var/www/files/" . $file);
echo $content;
                            </code></pre>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                function handleUpload(event) {
                    event.preventDefault();
                    const fileInput = document.getElementById('file-input');
                    const filenameInput = document.getElementById('filename-input');
                    const result = document.getElementById('upload-result');
                    const filesList = document.getElementById('files-list');
                    
                    if (fileInput.files.length === 0) return false;
                    
                    const file = fileInput.files[0];
                    const customName = filenameInput.value || file.name;
                    
                    // Simulate file upload
                    result.innerHTML = '<div class="success">✅ File uploaded successfully: ' + customName + '</div>';
                    
                    // Add to files list
                    const li = document.createElement('li');
                    li.textContent = customName;
                    filesList.appendChild(li);
                    
                    // Check for malicious files
                    if (customName.includes('.php') || customName.includes('.jsp') || 
                        customName.includes('shell') || customName.includes('../')) {
                        result.innerHTML += '<div class="flag">🚩 Flag: NEURO{malicious_file_uploaded}</div>';
                        if (window.challengeSystem) {
                            setTimeout(() => {
                                window.challengeSystem.completeChallenge('ws-004');
                            }, 1000);
                        }
                    }
                    
                    // Reset form
                    fileInput.value = '';
                    filenameInput.value = '';
                    
                    return false;
                }
                
                function handleDownload(event) {
                    event.preventDefault();
                    const filename = document.getElementById('download-input').value;
                    const result = document.getElementById('download-result');
                    
                    // Simulate path traversal vulnerability
                    if (filename.includes('../') || filename.includes('etc/passwd') || 
                        filename.includes('etc/shadow')) {
                        result.innerHTML = '<div class="success">📄 File content:</div>';
                        result.innerHTML += '<pre class="file-content">root:x:0:0:root:/root:/bin/bash\\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\\nbin:x:2:2:bin:/bin:/usr/sbin/nologin</pre>';
                        result.innerHTML += '<div class="flag">🚩 Flag: NEURO{directory_traversal_success}</div>';
                        
                        if (window.challengeSystem) {
                            setTimeout(() => {
                                window.challengeSystem.completeChallenge('ws-003');
                            }, 1000);
                        }
                    } else {
                        result.innerHTML = '<div class="error">❌ File not found: ' + filename + '</div>';
                    }
                    
                    return false;
                }
            </script>
        `;
    }

    generateAPIApp() {
        return `
            <div class="vulnerable-app">
                <div class="app-header">
                    <h2>🔌 Vulnerable REST API</h2>
                    <p>Target: Exploit API vulnerabilities and access unauthorized data</p>
                    <div class="vulnerability-tags">
                        <span class="vuln-tag api">IDOR</span>
                        <span class="vuln-tag api">Broken Auth</span>
                        <span class="vuln-tag api">Rate Limiting</span>
                    </div>
                </div>
                
                <div class="app-content">
                    <div class="api-container">
                        <div class="api-section">
                            <h3>👤 User Profile API</h3>
                            <form onsubmit="return handleUserAPI(event)">
                                <label>User ID:</label>
                                <input type="number" id="user-id" value="1" required>
                                <button type="submit">Get Profile</button>
                            </form>
                            <div id="user-result"></div>
                            <small class="hint">💡 Try different user IDs: 1, 2, 999</small>
                        </div>
                        
                        <div class="api-section">
                            <h3>🔑 Admin API</h3>
                            <form onsubmit="return handleAdminAPI(event)">
                                <label>API Key:</label>
                                <input type="text" id="api-key" placeholder="Enter API key" required>
                                <button type="submit">Access Admin Panel</button>
                            </form>
                            <div id="admin-result"></div>
                            <small class="hint">💡 Try: admin123, test, or empty</small>
                        </div>
                        
                        <div class="api-endpoints">
                            <h3>📋 Available Endpoints</h3>
                            <ul>
                                <li><code>GET /api/users/{id}</code> - Get user profile</li>
                                <li><code>GET /api/admin/users</code> - List all users (admin only)</li>
                                <li><code>POST /api/login</code> - User authentication</li>
                                <li><code>DELETE /api/users/{id}</code> - Delete user (admin only)</li>
                            </ul>
                        </div>
                        
                        <div class="source-code">
                            <h4>📄 Vulnerable API Code</h4>
                            <pre><code>
// IDOR Vulnerability
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    // No authorization check!
    const user = database.getUser(userId);
    res.json(user);
});

// Weak API Key Check
app.get('/api/admin/*', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === 'admin123') {  // Hardcoded key!
        // Admin access granted
    }
});
                            </code></pre>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                const users = {
                    1: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
                    2: { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
                    999: { id: 999, name: 'Admin User', email: 'admin@company.com', role: 'admin', secret: 'FLAG{IDOR_VULNERABILITY}' }
                };
                
                function handleUserAPI(event) {
                    event.preventDefault();
                    const userId = document.getElementById('user-id').value;
                    const result = document.getElementById('user-result');
                    
                    const user = users[userId];
                    if (user) {
                        result.innerHTML = '<div class="api-response"><pre>' + JSON.stringify(user, null, 2) + '</pre></div>';
                        
                        if (user.role === 'admin' || user.secret) {
                            result.innerHTML += '<div class="flag">🚩 Flag: NEURO{idor_vulnerability_exploited}</div>';
                            if (window.challengeSystem) {
                                setTimeout(() => {
                                    window.challengeSystem.completeChallenge('ws-005');
                                }, 1000);
                            }
                        }
                    } else {
                        result.innerHTML = '<div class="error">❌ User not found</div>';
                    }
                    
                    return false;
                }
                
                function handleAdminAPI(event) {
                    event.preventDefault();
                    const apiKey = document.getElementById('api-key').value;
                    const result = document.getElementById('admin-result');
                    
                    if (apiKey === 'admin123' || apiKey === '' || apiKey === 'test') {
                        const adminData = {
                            message: 'Admin access granted!',
                            users: Object.values(users),
                            sensitive_data: 'Database credentials: admin:password123',
                            flag: 'NEURO{broken_authentication}'
                        };
                        
                        result.innerHTML = '<div class="api-response"><pre>' + JSON.stringify(adminData, null, 2) + '</pre></div>';
                        result.innerHTML += '<div class="flag">🚩 Flag: NEURO{broken_authentication_exploited}</div>';
                        
                        if (window.challengeSystem) {
                            setTimeout(() => {
                                window.challengeSystem.completeChallenge('ws-006');
                            }, 1000);
                        }
                    } else {
                        result.innerHTML = '<div class="error">❌ Invalid API key</div>';
                    }
                    
                    return false;
                }
            </script>
        `;
    }

    generateAppList() {
        return `
            <div class="vulnerable-apps-list">
                <h2>🎯 Vulnerable Applications</h2>
                <p>Practice your penetration testing skills on these intentionally vulnerable applications</p>
                
                <div class="apps-grid">
                    ${Object.entries(this.apps).map(([id, app]) => `
                        <div class="app-card" onclick="loadVulnerableApp('${id}')">
                            <h3>${app.name}</h3>
                            <p>${app.description}</p>
                            <div class="vulnerabilities">
                                ${app.vulnerabilities.map(vuln => `<span class="vuln-tag">${vuln}</span>`).join('')}
                            </div>
                            <div class="difficulty ${app.difficulty.toLowerCase()}">${app.difficulty}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Initialize vulnerable apps
document.addEventListener('DOMContentLoaded', function() {
    window.vulnerableApps = new VulnerableApps();
});