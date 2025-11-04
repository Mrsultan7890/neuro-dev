// Bank Security Lab Application
class BankSecurityApp {
    constructor() {
        this.vulnerabilities = new Map();
        this.exploits = new Map();
        this.setupApp();
    }

    setupApp() {
        this.loadVulnerabilities();
        this.setupEventListeners();
    }

    loadVulnerabilities() {
        const vulns = [
            {
                id: 'sql_injection',
                name: 'SQL Injection in Login',
                severity: 'Critical',
                description: 'Login form vulnerable to SQL injection',
                target: 'login.php'
            },
            {
                id: 'session_hijack',
                name: 'Session Management Flaw',
                severity: 'High',
                description: 'Weak session tokens allow hijacking',
                target: 'session.php'
            },
            {
                id: 'payment_bypass',
                name: 'Payment Amount Manipulation',
                severity: 'Critical',
                description: 'Payment gateway allows amount modification',
                target: 'payment.php'
            },
            {
                id: 'admin_bypass',
                name: 'Admin Authentication Bypass',
                severity: 'High',
                description: 'Admin panel authentication can be bypassed',
                target: 'admin.php'
            }
        ];

        vulns.forEach(vuln => {
            this.vulnerabilities.set(vuln.id, vuln);
        });

        this.renderVulnerabilities();
    }

    setupEventListeners() {
        try {
            const scanBtn = document.getElementById('bank-scan-btn');
            const exploitBtn = document.getElementById('bank-exploit-btn');
            const forensicsBtn = document.getElementById('bank-forensics-btn');
            const reportBtn = document.getElementById('bank-report-btn');

            if (scanBtn) scanBtn.addEventListener('click', () => this.performSecurityScan());
            if (exploitBtn) exploitBtn.addEventListener('click', () => this.performExploit());
            if (forensicsBtn) forensicsBtn.addEventListener('click', () => this.performForensics());
            if (reportBtn) reportBtn.addEventListener('click', () => this.generateReport());

            // Add event delegation for exploit buttons
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('exploit-btn')) {
                    const vulnId = e.target.getAttribute('data-vuln-id');
                    if (vulnId && this.vulnerabilities.has(vulnId)) {
                        this.exploitVulnerability(vulnId);
                    }
                }
            });
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    renderVulnerabilities() {
        const vulnList = document.getElementById('bank-vulnerabilities-list');
        if (!vulnList) return;

        vulnList.innerHTML = '';
        this.vulnerabilities.forEach((vuln, id) => {
            const vulnDiv = document.createElement('div');
            vulnDiv.className = 'bank-vulnerability';
            
            // Create elements safely
            const vulnInfo = document.createElement('div');
            vulnInfo.className = 'vuln-info';
            
            const vulnName = document.createElement('div');
            vulnName.className = 'vuln-name';
            vulnName.textContent = vuln.name;
            
            const vulnDesc = document.createElement('div');
            vulnDesc.className = 'vuln-description';
            vulnDesc.textContent = vuln.description;
            
            const vulnTarget = document.createElement('div');
            vulnTarget.className = 'vuln-target';
            vulnTarget.textContent = `Target: ${vuln.target}`;
            
            vulnInfo.appendChild(vulnName);
            vulnInfo.appendChild(vulnDesc);
            vulnInfo.appendChild(vulnTarget);
            
            const vulnSeverity = document.createElement('div');
            vulnSeverity.className = `vuln-severity severity-${vuln.severity.toLowerCase()}`;
            vulnSeverity.textContent = vuln.severity;
            
            const exploitBtn = document.createElement('button');
            exploitBtn.className = 'exploit-btn';
            exploitBtn.setAttribute('data-vuln-id', id);
            exploitBtn.textContent = 'Exploit';
            
            vulnDiv.appendChild(vulnInfo);
            vulnDiv.appendChild(vulnSeverity);
            vulnDiv.appendChild(exploitBtn);
            
            vulnList.appendChild(vulnDiv);
        });
    }

    performSecurityScan() {
        const output = document.getElementById('bank-security-output');
        if (!output) return;
        
        output.textContent = '🔍 Scanning SecureBank application...';
        output.className = 'scan-progress';

        setTimeout(() => {
            this.renderSecurityScanResults(output);
        }, 2500);
    }

    renderSecurityScanResults(output) {
        output.innerHTML = '';
        output.className = 'security-scan-results';
        
        const title = document.createElement('h4');
        title.textContent = '🏦 SecureBank Security Assessment';
        output.appendChild(title);
        
        const summary = document.createElement('div');
        summary.className = 'scan-summary';
        
        const summaryItems = [
            { text: 'Critical: 2', class: 'critical' },
            { text: 'High: 2', class: 'high' },
            { text: 'Medium: 1', class: 'medium' },
            { text: 'Low: 0', class: 'low' }
        ];
        
        summaryItems.forEach(item => {
            const div = document.createElement('div');
            div.className = `summary-item ${item.class}`;
            div.textContent = item.text;
            summary.appendChild(div);
        });
        
        output.appendChild(summary);
        
        const vulnDetails = document.createElement('div');
        vulnDetails.className = 'vulnerability-details';
        
        const vulnItems = [
            { text: '🚨 SQL Injection in login form', class: 'critical' },
            { text: '🚨 Payment amount manipulation possible', class: 'critical' },
            { text: '⚠️ Session management weakness', class: 'high' },
            { text: '⚠️ Admin authentication bypass', class: 'high' },
            { text: '💡 Missing security headers', class: 'medium' }
        ];
        
        vulnItems.forEach(item => {
            const div = document.createElement('div');
            div.className = `vuln-item ${item.class}`;
            div.textContent = item.text;
            vulnDetails.appendChild(div);
        });
        
        output.appendChild(vulnDetails);
        
        const recommendation = document.createElement('div');
        recommendation.className = 'scan-recommendation';
        recommendation.textContent = '💡 Immediate action required for critical vulnerabilities';
        output.appendChild(recommendation);
    }

    exploitVulnerability(vulnId) {
        const vuln = this.vulnerabilities.get(vulnId);
        if (!vuln) return;

        const output = document.getElementById('bank-security-output');
        if (!output) return;
        
        output.textContent = `🎯 Exploiting ${vuln.name}...`;
        output.className = 'exploit-progress';

        setTimeout(() => {
            this.renderExploitResult(output, vulnId);
        }, 2000);
    }

    renderExploitResult(output, vulnId) {
        output.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'exploit-success';
        
        let title, details, flag;
        
        switch (vulnId) {
            case 'sql_injection':
                title = '✅ SQL Injection Successful!';
                details = [
                    'Payload: admin\' OR 1=1--',
                    'Database: MySQL 8.0.25',
                    'Tables accessed: users, accounts, transactions',
                    'Records extracted: 50,000 customer accounts'
                ];
                flag = 'BANK{sql_injection_bypass_admin123}';
                break;
                
            case 'payment_bypass':
                title = '💰 Payment Manipulation Successful!';
                details = [
                    'Original amount: $1,000.00',
                    'Modified amount: $0.01',
                    'Transaction approved: YES',
                    'Merchant charged: $0.01'
                ];
                flag = 'BANK{payment_manipulation_amount_modified}';
                break;
                
            case 'session_hijack':
                title = '🔓 Session Hijacking Successful!';
                details = [
                    'Weak session token detected',
                    'Token: SESS_123456789',
                    'User account compromised: john.doe',
                    'Account balance: $25,000'
                ];
                flag = 'BANK{session_token_stolen}';
                break;
                
            case 'admin_bypass':
                title = '🔑 Admin Access Gained!';
                details = [
                    'Authentication bypassed',
                    'Admin panel accessed',
                    'User database: Full access',
                    'Transaction logs: Accessible'
                ];
                flag = 'BANK{admin_access_gained}';
                break;
        }
        
        const titleEl = document.createElement('div');
        titleEl.textContent = title;
        container.appendChild(titleEl);
        
        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'exploit-details';
        
        details.forEach(detail => {
            const detailEl = document.createElement('div');
            detailEl.textContent = detail;
            detailsContainer.appendChild(detailEl);
        });
        
        const flagEl = document.createElement('div');
        flagEl.className = 'flag-result';
        flagEl.textContent = `🏆 Flag: ${flag}`;
        detailsContainer.appendChild(flagEl);
        
        container.appendChild(detailsContainer);
        output.appendChild(container);
        
        if (window.flagSystem) {
            window.flagSystem.addFlag(flag);
        }
    }

    performForensics() {
        const output = document.getElementById('bank-security-output');
        output.innerHTML = '<div class="forensics-progress">🔍 Analyzing transaction logs...</div>';

        setTimeout(() => {
            const forensicsResults = `
                <div class="forensics-analysis">
                    <h4>🕵️ Digital Forensics Investigation</h4>
                    
                    <div class="forensics-section">
                        <h5>Suspicious Transaction Pattern:</h5>
                        <div class="transaction-item">Account: 4532-****-****-1234</div>
                        <div class="transaction-item">Pattern: 47 transactions of $9,999 each</div>
                        <div class="transaction-item">Total: $469,953 in 24 hours</div>
                        <div class="transaction-item">Time: Outside business hours</div>
                    </div>
                    
                    <div class="forensics-section">
                        <h5>Network Analysis:</h5>
                        <div class="network-item">Source IP: 192.168.100.50 (Internal)</div>
                        <div class="network-item">Workstation: BANK-PC-047</div>
                        <div class="network-item">User: john.smith@securebank.com</div>
                        <div class="network-item">Login time: 02:30 AM</div>
                    </div>
                    
                    <div class="forensics-section">
                        <h5>Evidence Found:</h5>
                        <div class="evidence-item">🔍 Keylogger traces on workstation</div>
                        <div class="evidence-item">🔍 Unauthorized software installation</div>
                        <div class="evidence-item">🔍 Deleted browser history</div>
                        <div class="evidence-item">🔍 USB device activity</div>
                    </div>
                    
                    <div class="forensics-conclusion">
                        <h5>Conclusion:</h5>
                        <div class="conclusion-item">🚨 Insider threat detected</div>
                        <div class="conclusion-item">🚨 Money laundering scheme</div>
                        <div class="conclusion-item">🚨 Employee: john.smith involved</div>
                        <div class="flag-result">🏆 Flag: BANK{insider_threat_detected_employee_malicious}</div>
                    </div>
                </div>
            `;
            
            output.innerHTML = forensicsResults;
            
            if (window.flagSystem) {
                window.flagSystem.addFlag('BANK{insider_threat_detected_employee_malicious}');
            }
        }, 3500);
    }

    generateReport() {
        const output = document.getElementById('bank-security-output');
        
        const report = `
            <div class="security-report">
                <h4>📋 Security Assessment Report</h4>
                
                <div class="report-section">
                    <h5>Executive Summary:</h5>
                    <div class="summary-text">
                        SecureBank application contains multiple critical vulnerabilities 
                        that pose significant risk to customer data and financial transactions.
                    </div>
                </div>
                
                <div class="report-section">
                    <h5>Risk Assessment:</h5>
                    <div class="risk-item high">🔴 SQL Injection - Critical Risk</div>
                    <div class="risk-item high">🔴 Payment Bypass - Critical Risk</div>
                    <div class="risk-item medium">🟡 Session Management - High Risk</div>
                    <div class="risk-item medium">🟡 Authentication Bypass - High Risk</div>
                </div>
                
                <div class="report-section">
                    <h5>Recommendations:</h5>
                    <div class="recommendation">1. Implement parameterized queries</div>
                    <div class="recommendation">2. Add input validation and sanitization</div>
                    <div class="recommendation">3. Strengthen session management</div>
                    <div class="recommendation">4. Implement multi-factor authentication</div>
                    <div class="recommendation">5. Regular security audits</div>
                </div>
                
                <div class="report-section">
                    <h5>Compliance Impact:</h5>
                    <div class="compliance-item">❌ PCI DSS non-compliant</div>
                    <div class="compliance-item">❌ GDPR violations possible</div>
                    <div class="compliance-item">❌ SOX compliance at risk</div>
                </div>
                
                <div class="report-footer">
                    Report generated: ${new Date().toLocaleString()}<br>
                    Severity: <span class="severity-critical">CRITICAL</span>
                </div>
            </div>
        `;
        
        output.innerHTML = report;
    }

    // Security helper functions
    sanitizeAttribute(value) {
        if (typeof value !== 'string') {
            return '';
        }
        return value.replace(/["'<>&]/g, '');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('bank-security-app')) {
        window.bankSecurityApp = new BankSecurityApp();
    }
});