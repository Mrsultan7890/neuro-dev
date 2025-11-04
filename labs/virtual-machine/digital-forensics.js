// Digital Forensics Lab Application
class DigitalForensicsApp {
    constructor() {
        this.cases = [
            {
                id: 'CASE-001',
                name: 'Corporate Data Breach Investigation',
                status: 'Active',
                priority: 'High',
                created: '2025-01-15',
                description: 'Suspected insider threat - employee data exfiltration',
                evidence: ['laptop_image.dd', 'network_logs.pcap', 'email_dump.pst'],
                findings: 3,
                flags: ['FORENSICS{insider_threat_detected}', 'FORENSICS{data_exfil_confirmed}']
            },
            {
                id: 'CASE-002', 
                name: 'Malware Analysis - Banking Trojan',
                status: 'Completed',
                priority: 'Critical',
                created: '2025-01-10',
                description: 'Banking malware found on customer systems',
                evidence: ['malware_sample.exe', 'memory_dump.raw', 'registry_backup.reg'],
                findings: 8,
                flags: ['FORENSICS{banking_trojan_identified}', 'FORENSICS{c2_server_found}']
            }
        ];
        this.currentCase = null;
        this.evidence = [
            {
                id: 'EV-001',
                name: 'Suspect Laptop Image',
                type: 'Disk Image',
                size: '500GB',
                hash: 'md5:a1b2c3d4e5f6...',
                acquired: '2025-01-15 10:30',
                status: 'Verified'
            },
            {
                id: 'EV-002',
                name: 'Network Traffic Capture',
                type: 'PCAP File',
                size: '2.3GB',
                hash: 'sha256:f6e5d4c3b2a1...',
                acquired: '2025-01-15 11:45',
                status: 'Processing'
            }
        ];
        this.timeline = [
            {
                timestamp: '2025-01-15 09:15:23',
                event: 'Suspicious file access detected',
                source: 'File System',
                details: 'Access to confidential database files',
                severity: 'High'
            },
            {
                timestamp: '2025-01-15 09:18:45',
                event: 'Large data transfer initiated',
                source: 'Network Monitor',
                details: '500MB upload to external server',
                severity: 'Critical'
            }
        ];
        this.reports = [];
        this.evidenceChain = [];
        this.analysisResults = [];
        this.tools = {
            'disk-imaging': 'Disk Imaging Tool',
            'file-recovery': 'File Recovery Tool', 
            'memory-analysis': 'Memory Analysis Tool',
            'network-forensics': 'Network Forensics Tool',
            'timeline-analysis': 'Timeline Analysis Tool',
            'hash-verification': 'Hash Verification Tool'
        };
        this.flags = [
            'FORENSICS{d1g1t4l_3v1d3nc3_ch41n}',
            'FORENSICS{f0r3ns1c_1m4g1ng_m4st3r}',
            'FORENSICS{m3m0ry_4n4lys1s_3xp3rt}',
            'FORENSICS{t1m3l1n3_r3c0nstruct10n}',
            'FORENSICS{h4sh_v3r1f1c4t10n_pr0}',
            'FORENSICS{n3tw0rk_tr4ff1c_4n4lyst}',
            'FORENSICS{d3l3t3d_f1l3_r3c0v3ry}',
            'FORENSICS{1nc1d3nt_r3sp0ns3_h3r0}'
        ];
    }

    createInterface() {
        return `
            <div class="forensics-container">
                <div class="forensics-header">
                    <h2><i class="fas fa-search"></i> Digital Forensics & Incident Response Lab</h2>
                    <p>Professional crime scene investigation aur digital evidence analysis</p>
                    <div class="forensics-stats">
                        <div class="stat-card">
                            <div class="stat-number">${this.cases.length}</div>
                            <div class="stat-label">Active Cases</div>
                            <div class="stat-icon">📁</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${this.evidence.length}</div>
                            <div class="stat-label">Evidence Items</div>
                            <div class="stat-icon">🔍</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${this.timeline.length}</div>
                            <div class="stat-label">Timeline Events</div>
                            <div class="stat-icon">⏰</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${this.reports.length}</div>
                            <div class="stat-label">Reports</div>
                            <div class="stat-icon">📊</div>
                        </div>
                    </div>
                </div>

                <div class="forensics-tabs">
                    <button class="tab-btn active" onclick="forensicsApp.showTab('case-management')">
                        <i class="fas fa-folder-open"></i> Case Management
                    </button>
                    <button class="tab-btn" onclick="forensicsApp.showTab('evidence-acquisition')">
                        <i class="fas fa-hdd"></i> Evidence Acquisition
                    </button>
                    <button class="tab-btn" onclick="forensicsApp.showTab('file-analysis')">
                        <i class="fas fa-file-alt"></i> File Analysis
                    </button>
                    <button class="tab-btn" onclick="forensicsApp.showTab('memory-forensics')">
                        <i class="fas fa-memory"></i> Memory Forensics
                    </button>
                    <button class="tab-btn" onclick="forensicsApp.showTab('network-analysis')">
                        <i class="fas fa-network-wired"></i> Network Analysis
                    </button>
                    <button class="tab-btn" onclick="forensicsApp.showTab('reporting')">
                        <i class="fas fa-file-pdf"></i> Reporting
                    </button>
                </div>

                <div class="forensics-content">
                    <div id="case-management" class="tab-content active">
                        ${this.createCaseManagement()}
                    </div>
                    <div id="evidence-acquisition" class="tab-content">
                        ${this.createEvidenceAcquisition()}
                    </div>
                    <div id="file-analysis" class="tab-content">
                        ${this.createFileAnalysis()}
                    </div>
                    <div id="memory-forensics" class="tab-content">
                        ${this.createMemoryForensics()}
                    </div>
                    <div id="network-analysis" class="tab-content">
                        ${this.createNetworkAnalysis()}
                    </div>
                    <div id="reporting" class="tab-content">
                        ${this.createReporting()}
                    </div>
                </div>
                
                <style>
                .forensics-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin: 20px 0;
                }
                
                .stat-card {
                    background: rgba(0, 255, 65, 0.1);
                    border: 1px solid #00ff41;
                    border-radius: 8px;
                    padding: 15px;
                    text-align: center;
                    position: relative;
                    transition: all 0.3s ease;
                }
                
                .stat-card:hover {
                    background: rgba(0, 255, 65, 0.2);
                    transform: translateY(-2px);
                }
                
                .stat-number {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #00ff41;
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
                
                .case-item {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid #333;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 10px;
                    transition: all 0.3s ease;
                }
                
                .case-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: #00ff41;
                }
                
                .case-priority {
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: bold;
                }
                
                .priority-low { background: #27ae60; color: white; }
                .priority-medium { background: #f39c12; color: white; }
                .priority-high { background: #e74c3c; color: white; }
                .priority-critical { background: #8e44ad; color: white; }
                
                .case-flags {
                    margin-top: 10px;
                }
                
                .flag {
                    background: rgba(255, 107, 53, 0.2);
                    color: #ff6b35;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 0.7rem;
                    margin-right: 5px;
                    font-family: monospace;
                }
                
                .flag-found {
                    background: rgba(0, 255, 65, 0.2);
                    color: #00ff41;
                    padding: 8px 12px;
                    border-radius: 6px;
                    margin: 10px 0;
                    font-weight: bold;
                    border: 1px solid #00ff41;
                }
                
                .command-output {
                    background: rgba(0, 0, 0, 0.8);
                    border: 1px solid #333;
                    border-radius: 6px;
                    padding: 10px;
                    margin: 10px 0;
                    font-family: monospace;
                    font-size: 0.9rem;
                }
                
                .success {
                    color: #00ff41;
                    font-weight: bold;
                }
                
                .suspicious {
                    color: #ff6b6b;
                    font-weight: bold;
                }
                
                .results-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 10px 0;
                }
                
                .results-table th, .results-table td {
                    border: 1px solid #333;
                    padding: 8px;
                    text-align: left;
                }
                
                .results-table th {
                    background: rgba(0, 255, 65, 0.1);
                    color: #00ff41;
                }
                </style>
            </div>
        `;
    }

    createCaseManagement() {
        return `
            <div class="case-section">
                <h3>Case Management System</h3>
                <div class="case-form">
                    <div class="form-group">
                        <label>Case Number:</label>
                        <input type="text" id="caseNumber" placeholder="CASE-2024-001">
                    </div>
                    <div class="form-group">
                        <label>Case Type:</label>
                        <select id="caseType">
                            <option value="cybercrime">Cybercrime Investigation</option>
                            <option value="data-breach">Data Breach Analysis</option>
                            <option value="malware">Malware Analysis</option>
                            <option value="fraud">Financial Fraud</option>
                            <option value="intellectual-property">IP Theft</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Investigator:</label>
                        <input type="text" id="investigator" placeholder="Your Name">
                    </div>
                    <div class="form-group">
                        <label>Description:</label>
                        <textarea id="caseDescription" placeholder="Case details aur initial findings..."></textarea>
                    </div>
                    <button onclick="forensicsApp.createCase()" class="btn-primary">
                        <i class="fas fa-plus"></i> Create New Case
                    </button>
                </div>

                <div class="active-cases">
                    <h4>Active Cases</h4>
                    <div id="casesList">
                        <div class="case-item">
                            <div class="case-info">
                                <strong>CASE-2024-DEMO</strong>
                                <span class="case-type">Cybercrime Investigation</span>
                                <p>Sample case for demonstration purposes</p>
                            </div>
                            <button onclick="forensicsApp.loadCase('DEMO')" class="btn-secondary">Load Case</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createEvidenceAcquisition() {
        return `
            <div class="acquisition-section">
                <h3>Evidence Acquisition & Imaging</h3>
                
                <div class="tool-section">
                    <h4>Disk Imaging Tools</h4>
                    <div class="command-examples">
                        <div class="command-item">
                            <strong>DD Command:</strong>
                            <code>dd if=/dev/sda of=evidence.img bs=4096 conv=noerror,sync</code>
                            <button onclick="forensicsApp.simulateCommand('dd-imaging')" class="btn-execute">Execute</button>
                        </div>
                        <div class="command-item">
                            <strong>DC3DD Enhanced:</strong>
                            <code>dc3dd if=/dev/sda of=evidence.img hash=md5 log=imaging.log</code>
                            <button onclick="forensicsApp.simulateCommand('dc3dd-imaging')" class="btn-execute">Execute</button>
                        </div>
                        <div class="command-item">
                            <strong>Hash Verification:</strong>
                            <code>md5sum evidence.img > evidence.img.md5</code>
                            <button onclick="forensicsApp.simulateCommand('hash-verify')" class="btn-execute">Execute</button>
                        </div>
                    </div>
                </div>

                <div class="imaging-simulator">
                    <h4>Disk Imaging Simulator</h4>
                    <div class="simulator-controls">
                        <select id="sourceDevice">
                            <option value="/dev/sda">Primary Hard Drive (/dev/sda)</option>
                            <option value="/dev/sdb">Secondary Drive (/dev/sdb)</option>
                            <option value="/dev/sdc">USB Drive (/dev/sdc)</option>
                        </select>
                        <input type="text" id="outputFile" placeholder="evidence.img" value="evidence.img">
                        <button onclick="forensicsApp.startImaging()" class="btn-primary">Start Imaging</button>
                    </div>
                    <div id="imagingProgress" class="progress-container" style="display: none;">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-text">Imaging in progress...</div>
                    </div>
                </div>

                <div class="evidence-chain">
                    <h4>Chain of Custody</h4>
                    <div id="chainOfCustody">
                        <p>No evidence items recorded yet.</p>
                    </div>
                </div>
            </div>
        `;
    }

    createFileAnalysis() {
        return `
            <div class="file-analysis-section">
                <h3>File System Analysis & Recovery</h3>
                
                <div class="analysis-tools">
                    <div class="tool-group">
                        <h4>Deleted File Recovery</h4>
                        <div class="command-examples">
                            <div class="command-item">
                                <strong>Sleuth Kit Recovery:</strong>
                                <code>fls -r -d evidence.img | grep deleted</code>
                                <button onclick="forensicsApp.simulateFileRecovery()" class="btn-execute">Scan for Deleted Files</button>
                            </div>
                            <div class="command-item">
                                <strong>PhotoRec Recovery:</strong>
                                <code>photorec evidence.img</code>
                                <button onclick="forensicsApp.simulatePhotoRec()" class="btn-execute">Recover Files</button>
                            </div>
                        </div>
                    </div>

                    <div class="tool-group">
                        <h4>Timeline Analysis</h4>
                        <div class="command-examples">
                            <div class="command-item">
                                <strong>Create Timeline:</strong>
                                <code>fls -r -m / evidence.img > timeline.body</code>
                                <button onclick="forensicsApp.createTimeline()" class="btn-execute">Generate Timeline</button>
                            </div>
                            <div class="command-item">
                                <strong>Process Timeline:</strong>
                                <code>mactime -b timeline.body -d > timeline.csv</code>
                                <button onclick="forensicsApp.processTimeline()" class="btn-execute">Process Timeline</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="file-browser">
                    <h4>Evidence File Browser</h4>
                    <div class="file-tree">
                        <div class="folder" onclick="forensicsApp.toggleFolder(this)">
                            <i class="fas fa-folder"></i> /evidence_mount/
                            <div class="folder-contents">
                                <div class="file"><i class="fas fa-file"></i> important_document.pdf (deleted)</div>
                                <div class="file"><i class="fas fa-file"></i> financial_records.xlsx</div>
                                <div class="folder" onclick="forensicsApp.toggleFolder(this)">
                                    <i class="fas fa-folder"></i> user_data/
                                    <div class="folder-contents">
                                        <div class="file"><i class="fas fa-file"></i> browser_history.db</div>
                                        <div class="file"><i class="fas fa-file"></i> email_cache.pst</div>
                                        <div class="file suspicious"><i class="fas fa-file"></i> suspicious_file.exe</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="analysis-results">
                    <h4>Analysis Results</h4>
                    <div id="fileAnalysisResults">
                        <p>Select files to analyze...</p>
                    </div>
                </div>
            </div>
        `;
    }

    createMemoryForensics() {
        return `
            <div class="memory-section">
                <h3>Memory Forensics Analysis</h3>
                
                <div class="volatility-tools">
                    <h4>Volatility Framework</h4>
                    <div class="command-examples">
                        <div class="command-item">
                            <strong>Image Info:</strong>
                            <code>volatility -f memory.dump imageinfo</code>
                            <button onclick="forensicsApp.simulateVolatility('imageinfo')" class="btn-execute">Detect Profile</button>
                        </div>
                        <div class="command-item">
                            <strong>Process List:</strong>
                            <code>volatility -f memory.dump --profile=Win7SP1x64 pslist</code>
                            <button onclick="forensicsApp.simulateVolatility('pslist')" class="btn-execute">List Processes</button>
                        </div>
                        <div class="command-item">
                            <strong>Network Connections:</strong>
                            <code>volatility -f memory.dump --profile=Win7SP1x64 netscan</code>
                            <button onclick="forensicsApp.simulateVolatility('netscan')" class="btn-execute">Scan Network</button>
                        </div>
                        <div class="command-item">
                            <strong>Malware Detection:</strong>
                            <code>volatility -f memory.dump --profile=Win7SP1x64 malfind</code>
                            <button onclick="forensicsApp.simulateVolatility('malfind')" class="btn-execute">Find Malware</button>
                        </div>
                    </div>
                </div>

                <div class="memory-analysis-results">
                    <h4>Memory Analysis Results</h4>
                    <div id="memoryResults">
                        <div class="result-tabs">
                            <button class="result-tab active" onclick="forensicsApp.showMemoryTab('processes')">Processes</button>
                            <button class="result-tab" onclick="forensicsApp.showMemoryTab('network')">Network</button>
                            <button class="result-tab" onclick="forensicsApp.showMemoryTab('malware')">Malware</button>
                        </div>
                        <div id="processesTab" class="memory-tab-content active">
                            <p>Run process analysis to see results...</p>
                        </div>
                        <div id="networkTab" class="memory-tab-content">
                            <p>Run network scan to see connections...</p>
                        </div>
                        <div id="malwareTab" class="memory-tab-content">
                            <p>Run malware detection to see threats...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createNetworkAnalysis() {
        return `
            <div class="network-section">
                <h3>Network Forensics Analysis</h3>
                
                <div class="pcap-analysis">
                    <h4>PCAP File Analysis</h4>
                    <div class="file-upload-sim">
                        <div class="upload-area" onclick="forensicsApp.loadPcapFile()">
                            <i class="fas fa-upload"></i>
                            <p>Click to load PCAP file for analysis</p>
                        </div>
                    </div>
                </div>

                <div class="wireshark-tools">
                    <h4>Wireshark Analysis Tools</h4>
                    <div class="command-examples">
                        <div class="command-item">
                            <strong>Protocol Statistics:</strong>
                            <code>tshark -r capture.pcap -q -z io,phs</code>
                            <button onclick="forensicsApp.analyzeProtocols()" class="btn-execute">Analyze Protocols</button>
                        </div>
                        <div class="command-item">
                            <strong>HTTP Objects:</strong>
                            <code>tshark -r capture.pcap --export-objects http,objects/</code>
                            <button onclick="forensicsApp.extractHttpObjects()" class="btn-execute">Extract Objects</button>
                        </div>
                        <div class="command-item">
                            <strong>Suspicious Traffic:</strong>
                            <code>tshark -r capture.pcap -Y "tcp.flags.syn==1 and tcp.flags.ack==0"</code>
                            <button onclick="forensicsApp.findSuspiciousTraffic()" class="btn-execute">Find Threats</button>
                        </div>
                    </div>
                </div>

                <div class="network-results">
                    <h4>Network Analysis Results</h4>
                    <div id="networkAnalysisResults">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <h5>Total Packets</h5>
                                <span class="stat-value">0</span>
                            </div>
                            <div class="stat-card">
                                <h5>Unique IPs</h5>
                                <span class="stat-value">0</span>
                            </div>
                            <div class="stat-card">
                                <h5>Suspicious Connections</h5>
                                <span class="stat-value">0</span>
                            </div>
                            <div class="stat-card">
                                <h5>Malware Indicators</h5>
                                <span class="stat-value">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createReporting() {
        return `
            <div class="reporting-section">
                <h3>Forensics Report Generation</h3>
                
                <div class="report-template">
                    <h4>Investigation Report</h4>
                    <div class="report-form">
                        <div class="form-group">
                            <label>Executive Summary:</label>
                            <textarea id="executiveSummary" placeholder="Brief overview of investigation findings..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Evidence Summary:</label>
                            <textarea id="evidenceSummary" placeholder="List of evidence collected and analyzed..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Key Findings:</label>
                            <textarea id="keyFindings" placeholder="Important discoveries and conclusions..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Recommendations:</label>
                            <textarea id="recommendations" placeholder="Security recommendations and next steps..."></textarea>
                        </div>
                    </div>
                </div>

                <div class="report-actions">
                    <button onclick="forensicsApp.generateReport()" class="btn-primary">
                        <i class="fas fa-file-pdf"></i> Generate PDF Report
                    </button>
                    <button onclick="forensicsApp.exportEvidence()" class="btn-secondary">
                        <i class="fas fa-download"></i> Export Evidence
                    </button>
                </div>

                <div class="case-timeline">
                    <h4>Investigation Timeline</h4>
                    <div id="investigationTimeline">
                        <div class="timeline-item">
                            <div class="timeline-date">2024-01-15 09:00</div>
                            <div class="timeline-event">Case initiated - Initial incident report received</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">2024-01-15 10:30</div>
                            <div class="timeline-event">Evidence acquisition - Disk imaging completed</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">2024-01-15 14:00</div>
                            <div class="timeline-event">File analysis - Deleted files recovered</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Simulation Methods
    simulateCommand(command) {
        const output = document.createElement('div');
        output.className = 'command-output';
        
        switch(command) {
            case 'dd-imaging':
                output.innerHTML = `
                    <div class="success">✓ Disk imaging started successfully</div>
                    <div>1000000+0 records in</div>
                    <div>1000000+0 records out</div>
                    <div>512000000 bytes (512 MB) copied, 45.2 seconds, 11.3 MB/s</div>
                    <div class="flag-found">🚩 Flag found: ${this.flags[0]}</div>
                `;
                break;
            case 'hash-verify':
                output.innerHTML = `
                    <div class="success">✓ Hash verification completed</div>
                    <div>MD5: a1b2c3d4e5f6789012345678901234567</div>
                    <div>SHA256: 1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890</div>
                    <div class="flag-found">🚩 Flag found: ${this.flags[1]}</div>
                `;
                break;
        }
        
        event.target.parentNode.appendChild(output);
        this.addToEvidenceChain(command);
    }

    simulateVolatility(plugin) {
        const resultsDiv = document.getElementById('memoryResults');
        
        switch(plugin) {
            case 'pslist':
                document.getElementById('processesTab').innerHTML = `
                    <table class="results-table">
                        <tr><th>PID</th><th>Process Name</th><th>PPID</th><th>Status</th></tr>
                        <tr><td>1234</td><td>explorer.exe</td><td>1000</td><td>Running</td></tr>
                        <tr><td>5678</td><td>malware.exe</td><td>1234</td><td class="suspicious">Suspicious</td></tr>
                        <tr><td>9012</td><td>chrome.exe</td><td>1234</td><td>Running</td></tr>
                    </table>
                    <div class="flag-found">🚩 Flag found: ${this.flags[2]}</div>
                `;
                break;
            case 'netscan':
                document.getElementById('networkTab').innerHTML = `
                    <table class="results-table">
                        <tr><th>Local Address</th><th>Remote Address</th><th>State</th><th>Process</th></tr>
                        <tr><td>192.168.1.100:80</td><td>10.0.0.1:443</td><td>ESTABLISHED</td><td>chrome.exe</td></tr>
                        <tr><td>192.168.1.100:1337</td><td>malicious.com:80</td><td class="suspicious">ESTABLISHED</td><td>malware.exe</td></tr>
                    </table>
                    <div class="flag-found">🚩 Flag found: ${this.flags[3]}</div>
                `;
                break;
        }
    }

    addToEvidenceChain(action) {
        this.evidenceChain.push({
            timestamp: new Date().toISOString(),
            action: action,
            investigator: 'Current User'
        });
        this.updateChainOfCustody();
    }

    updateChainOfCustody() {
        const chainDiv = document.getElementById('chainOfCustody');
        chainDiv.innerHTML = this.evidenceChain.map(item => `
            <div class="chain-item">
                <strong>${item.timestamp}</strong> - ${item.action} by ${item.investigator}
            </div>
        `).join('');
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

    generateReport() {
        const summary = document.getElementById('executiveSummary')?.value || 'Comprehensive digital forensics investigation completed';
        const reportId = `RPT-${String(this.reports.length + 1).padStart(3, '0')}`;
        
        const report = {
            id: reportId,
            title: 'Digital Forensics Investigation Report',
            generated: new Date().toISOString().replace('T', ' ').split('.')[0],
            cases: this.cases.length,
            evidence: this.evidence.length,
            findings: this.timeline.length,
            status: 'Complete',
            summary: summary
        };
        
        this.reports.push(report);
        
        // Add flag to global collection
        if (window.vmFlags) {
            window.vmFlags.add(this.flags[7]);
        }
        
        this.showNotification(`📊 Forensics Report ${reportId} generated successfully!`);
        
        setTimeout(() => {
            this.showNotification(`🚩 Investigation complete! Flag: ${this.flags[7]}`);
        }, 1500);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #9b59b6, #8e44ad);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(155, 89, 182, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    createCase() {
        const caseName = prompt('Enter case name:');
        if (!caseName) return;
        
        const caseType = prompt('Case type (cybercrime/fraud/malware/insider):') || 'cybercrime';
        const priority = prompt('Priority (Low/Medium/High/Critical):') || 'Medium';
        
        const newCase = {
            id: `CASE-${String(this.cases.length + 1).padStart(3, '0')}`,
            name: caseName,
            type: caseType,
            status: 'Active',
            priority: priority,
            created: new Date().toISOString().split('T')[0],
            description: `${caseType} investigation case`,
            evidence: [],
            findings: 0,
            flags: [`FORENSICS{case_${caseType}_created}`]
        };
        
        this.cases.push(newCase);
        this.showNotification('✅ New forensics case created successfully!');
        
        // Add flag
        if (window.vmFlags) {
            window.vmFlags.add(`FORENSICS{case_${caseType}_created}`);
        }
    }
    
    startImaging() {
        const sourceDevice = document.getElementById('sourceDevice')?.value || '/dev/sda';
        const outputFile = document.getElementById('outputFile')?.value || 'evidence.img';
        
        this.showNotification('🔄 Starting disk imaging process...');
        
        const progressContainer = document.getElementById('imagingProgress');
        if (progressContainer) {
            progressContainer.style.display = 'block';
            const progressFill = progressContainer.querySelector('.progress-fill');
            const progressText = progressContainer.querySelector('.progress-text');
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    progressText.textContent = 'Imaging completed successfully!';
                    this.showNotification(`✅ Disk image ${outputFile} created successfully!`);
                    
                    // Add flag
                    if (window.vmFlags) {
                        window.vmFlags.add(this.flags[1]);
                    }
                    
                    setTimeout(() => {
                        progressContainer.style.display = 'none';
                        progress = 0;
                        progressFill.style.width = '0%';
                        progressText.textContent = 'Imaging in progress...';
                    }, 3000);
                } else {
                    progressText.textContent = `Imaging in progress... ${Math.floor(progress)}%`;
                }
                progressFill.style.width = progress + '%';
            }, 200);
        }
    }
    
    simulateFileRecovery() {
        this.showNotification('🔍 Scanning for deleted files...');
        
        setTimeout(() => {
            const recoveredFiles = [
                'confidential_data.xlsx - 2.5MB - Deleted: 2025-01-14 15:30',
                'browser_history.sqlite - 15MB - Deleted: 2025-01-14 16:45', 
                'encrypted_backup.7z - 500MB - Deleted: 2025-01-13 09:20',
                'communication_logs.txt - 850KB - Deleted: 2025-01-15 08:15'
            ];
            
            const resultsDiv = document.getElementById('fileAnalysisResults');
            if (resultsDiv) {
                resultsDiv.innerHTML = `
                    <h5>Deleted Files Found:</h5>
                    <ul>
                        ${recoveredFiles.map(file => `<li>${file}</li>`).join('')}
                    </ul>
                    <div class="flag-found">🚩 Flag found: ${this.flags[6]}</div>
                `;
            }
            
            this.showNotification('📄 Successfully recovered 4 deleted files!');
            
            // Add flag
            if (window.vmFlags) {
                window.vmFlags.add(this.flags[6]);
            }
        }, 2500);
    }
}

// Initialize Digital Forensics App
const forensicsApp = new DigitalForensicsApp();

// Add CSS animations
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .forensics-container .stat-card:hover {
            animation: pulse 0.5s ease;
        }
        .progress-container {
            margin: 20px 0;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #00ff41, #00d4ff);
            width: 0%;
            transition: width 0.3s ease;
        }
        .progress-text {
            text-align: center;
            margin-top: 10px;
            color: #ccc;
        }
    `;
    document.head.appendChild(style);
}