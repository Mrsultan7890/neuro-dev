// Network Simulation for Penetration Testing
class NetworkSimulator {
    constructor() {
        this.networks = this.initNetworks();
        this.scanResults = {};
        this.currentNetwork = 'lab-network';
        this.init();
    }

    init() {
        this.setupCommands();
    }

    initNetworks() {
        return {
            'lab-network': {
                name: 'Neuro-Dev Lab Network',
                subnet: '192.168.1.0/24',
                gateway: '192.168.1.1',
                hosts: {
                    '192.168.1.1': {
                        hostname: 'gateway.neuro-dev.local',
                        os: 'Linux',
                        services: {
                            22: { service: 'ssh', version: 'OpenSSH 8.9p1', state: 'open' },
                            80: { service: 'http', version: 'Apache 2.4.52', state: 'open' },
                            443: { service: 'https', version: 'Apache 2.4.52', state: 'open' }
                        },
                        vulnerabilities: ['CVE-2022-0778', 'CVE-2021-44228']
                    },
                    '192.168.1.10': {
                        hostname: 'web-server.neuro-dev.local',
                        os: 'Ubuntu 20.04',
                        services: {
                            22: { service: 'ssh', version: 'OpenSSH 8.2p1', state: 'open' },
                            80: { service: 'http', version: 'Apache 2.4.41', state: 'open' },
                            3306: { service: 'mysql', version: 'MySQL 8.0.28', state: 'open' },
                            8080: { service: 'http-proxy', version: 'Tomcat 9.0.58', state: 'open' }
                        },
                        vulnerabilities: ['SQL Injection', 'XSS', 'Directory Traversal']
                    },
                    '192.168.1.20': {
                        hostname: 'ml-api.neuro-dev.local',
                        os: 'Ubuntu 22.04',
                        services: {
                            22: { service: 'ssh', version: 'OpenSSH 8.9p1', state: 'open' },
                            8080: { service: 'http', version: 'Flask 2.0.3', state: 'open' },
                            5000: { service: 'http', version: 'Python 3.9', state: 'open' },
                            6379: { service: 'redis', version: 'Redis 6.2.6', state: 'open' }
                        },
                        vulnerabilities: ['Model Extraction', 'Adversarial Attacks', 'Data Poisoning']
                    },
                    '192.168.1.30': {
                        hostname: 'database.neuro-dev.local',
                        os: 'CentOS 8',
                        services: {
                            22: { service: 'ssh', version: 'OpenSSH 8.0p1', state: 'open' },
                            3306: { service: 'mysql', version: 'MySQL 8.0.32', state: 'open' },
                            5432: { service: 'postgresql', version: 'PostgreSQL 13.9', state: 'open' },
                            27017: { service: 'mongodb', version: 'MongoDB 5.0.14', state: 'open' }
                        },
                        vulnerabilities: ['Weak Credentials', 'NoSQL Injection', 'Privilege Escalation']
                    },
                    '192.168.1.100': {
                        hostname: 'target-machine.neuro-dev.local',
                        os: 'Windows Server 2019',
                        services: {
                            135: { service: 'msrpc', version: 'Microsoft Windows RPC', state: 'open' },
                            139: { service: 'netbios-ssn', version: 'Microsoft Windows netbios-ssn', state: 'open' },
                            445: { service: 'microsoft-ds', version: 'Windows Server 2019', state: 'open' },
                            3389: { service: 'ms-wbt-server', version: 'Microsoft Terminal Services', state: 'open' },
                            5985: { service: 'http', version: 'Microsoft HTTPAPI httpd 2.0', state: 'open' }
                        },
                        vulnerabilities: ['EternalBlue', 'BlueKeep', 'PrintNightmare']
                    }
                }
            },
            'ai-network': {
                name: 'AI Security Lab Network',
                subnet: '10.0.0.0/24',
                gateway: '10.0.0.1',
                hosts: {
                    '10.0.0.10': {
                        hostname: 'ai-chat.neuro-dev',
                        os: 'Ubuntu 22.04',
                        services: {
                            3000: { service: 'http', version: 'Node.js 18.12.1', state: 'open' },
                            8000: { service: 'http', version: 'Python FastAPI', state: 'open' }
                        },
                        vulnerabilities: ['Prompt Injection', 'Model Inversion', 'Data Extraction']
                    },
                    '10.0.0.20': {
                        hostname: 'face-recognition.neuro-dev',
                        os: 'Ubuntu 20.04',
                        services: {
                            5000: { service: 'http', version: 'Flask 2.2.2', state: 'open' },
                            8080: { service: 'http', version: 'TensorFlow Serving', state: 'open' }
                        },
                        vulnerabilities: ['Adversarial Examples', 'Face Spoofing', 'Bias Exploitation']
                    }
                }
            }
        };
    }

    setupCommands() {
        // Integrate with terminal system
        if (window.terminal) {
            // Override nmap command for realistic results
            const originalHandleNmap = window.terminal.handleNmap;
            window.terminal.handleNmap = (args) => this.handleNmapScan(args);
            
            // Add network-specific commands
            window.terminal.handleNetdiscover = (args) => this.handleNetdiscover(args);
            window.terminal.handleMasscan = (args) => this.handleMasscan(args);
            window.terminal.handleNikto = (args) => this.handleNiktoScan(args);
        }
    }

    handleNmapScan(args) {
        if (args.length === 0) {
            this.showNmapHelp();
            return;
        }

        const target = this.parseTarget(args);
        const scanType = this.parseScanType(args);
        const options = this.parseOptions(args);

        if (!target) {
            window.terminal.addLine('Nmap: Invalid target specification', 'error');
            return;
        }

        this.performScan(target, scanType, options);
    }

    parseTarget(args) {
        // Find IP address or hostname in arguments
        for (const arg of args) {
            if (this.isValidTarget(arg)) {
                return arg;
            }
        }
        return null;
    }

    isValidTarget(target) {
        // Check if target exists in our networks
        for (const network of Object.values(this.networks)) {
            if (network.hosts[target] || target === network.subnet) {
                return true;
            }
        }
        return false;
    }

    parseScanType(args) {
        if (args.includes('-sS')) return 'SYN Stealth';
        if (args.includes('-sT')) return 'TCP Connect';
        if (args.includes('-sU')) return 'UDP';
        if (args.includes('-sV')) return 'Version Detection';
        if (args.includes('-sC')) return 'Script Scan';
        return 'SYN Stealth';
    }

    parseOptions(args) {
        return {
            verbose: args.includes('-v') || args.includes('-vv'),
            aggressive: args.includes('-A'),
            osDetection: args.includes('-O'),
            scriptScan: args.includes('-sC'),
            versionDetection: args.includes('-sV'),
            allPorts: args.includes('-p-'),
            topPorts: args.includes('--top-ports')
        };
    }

    performScan(target, scanType, options) {
        window.terminal.addLine(`Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleString()}`, 'output');
        window.terminal.addLine(`Initiating ${scanType} Scan at ${new Date().toLocaleTimeString()}`, 'output');

        // Show loading
        window.terminal.showLoading(`Scanning ${target}`, 2000);

        setTimeout(() => {
            if (target.includes('/')) {
                // Subnet scan
                this.performSubnetScan(target, options);
            } else {
                // Single host scan
                this.performHostScan(target, options);
            }
        }, 2500);
    }

    performSubnetScan(subnet, options) {
        const network = this.findNetworkBySubnet(subnet);
        if (!network) {
            window.terminal.addLine('Network unreachable', 'error');
            return;
        }

        window.terminal.addLine(`Nmap scan report for ${subnet}`, 'success');
        window.terminal.addLine('Host discovery results:', 'output');

        Object.entries(network.hosts).forEach(([ip, host]) => {
            window.terminal.addLine(`Host ${ip} (${host.hostname}) is up`, 'output');
            if (options.verbose) {
                const openPorts = Object.keys(host.services).length;
                window.terminal.addLine(`  ${openPorts} ports open`, 'output');
            }
        });

        window.terminal.addLine(`\\nNmap done: ${Object.keys(network.hosts).length} IP addresses scanned`, 'success');
        
        // Complete challenge if applicable
        if (window.challengeSystem) {
            window.challengeSystem.completeChallenge('nh-001');
        }
    }

    performHostScan(target, options) {
        const host = this.findHost(target);
        if (!host) {
            window.terminal.addLine(`Host ${target} seems down`, 'error');
            return;
        }

        window.terminal.addLine(`Nmap scan report for ${target}`, 'success');
        window.terminal.addLine(`Host is up (0.012s latency).`, 'output');

        if (options.osDetection) {
            window.terminal.addLine(`OS: ${host.os}`, 'output');
        }

        const openPorts = Object.entries(host.services).filter(([port, service]) => service.state === 'open');
        const closedPorts = 1000 - openPorts.length;

        if (closedPorts > 0) {
            window.terminal.addLine(`Not shown: ${closedPorts} closed ports`, 'output');
        }

        window.terminal.addLine('PORT     STATE SERVICE    VERSION', 'output');
        
        openPorts.forEach(([port, service]) => {
            const portStr = `${port}/tcp`.padEnd(9);
            const stateStr = service.state.padEnd(6);
            const serviceStr = service.service.padEnd(11);
            const versionStr = options.versionDetection ? service.version : '';
            
            window.terminal.addLine(`${portStr} ${stateStr} ${serviceStr} ${versionStr}`, 'output');
        });

        if (options.scriptScan) {
            this.runNmapScripts(target, host);
        }

        if (host.vulnerabilities && host.vulnerabilities.length > 0) {
            window.terminal.addLine('\\n🚨 Potential vulnerabilities detected:', 'error');
            host.vulnerabilities.forEach(vuln => {
                window.terminal.addLine(`  • ${vuln}`, 'error');
            });
        }

        window.terminal.addLine(`\\nNmap done: 1 IP address (1 host up) scanned in 3.45 seconds`, 'success');
        
        // Complete challenges
        if (window.challengeSystem) {
            if (options.versionDetection) {
                window.challengeSystem.completeChallenge('nh-002');
            }
        }
    }

    runNmapScripts(target, host) {
        window.terminal.addLine('\\nNSE: Starting script scan.', 'output');
        
        Object.entries(host.services).forEach(([port, service]) => {
            if (service.service === 'ssh') {
                window.terminal.addLine(`|_ssh-hostkey: SSH-2.0-${service.version}`, 'output');
            } else if (service.service === 'http') {
                window.terminal.addLine(`|_http-title: Neuro-Dev Application`, 'output');
                window.terminal.addLine(`|_http-server-header: ${service.version}`, 'output');
            } else if (service.service === 'mysql') {
                window.terminal.addLine(`|_mysql-info: Protocol: 10`, 'output');
            }
        });
    }

    handleNetdiscover(args) {
        window.terminal.addLine('Starting network discovery...', 'output');
        window.terminal.showLoading('Discovering hosts', 3000);

        setTimeout(() => {
            const network = this.networks[this.currentNetwork];
            window.terminal.addLine('Active hosts discovered:', 'success');
            window.terminal.addLine('IP Address       MAC Address       Hostname', 'output');
            window.terminal.addLine('─'.repeat(60), 'output');

            Object.entries(network.hosts).forEach(([ip, host]) => {
                const mac = this.generateMAC();
                const hostname = host.hostname.padEnd(25);
                window.terminal.addLine(`${ip.padEnd(16)} ${mac.padEnd(18)} ${hostname}`, 'output');
            });

            window.terminal.addLine(`\\nDiscovered ${Object.keys(network.hosts).length} active hosts`, 'success');
        }, 3500);
    }

    handleMasscan(args) {
        if (args.length === 0) {
            window.terminal.addLine('Usage: masscan <target> -p<ports>', 'output');
            return;
        }

        const target = args[args.length - 1];
        window.terminal.addLine(`Starting masscan on ${target}...`, 'output');
        window.terminal.showLoading('High-speed port scanning', 2000);

        setTimeout(() => {
            const host = this.findHost(target);
            if (host) {
                window.terminal.addLine('Discovered open ports:', 'success');
                Object.entries(host.services).forEach(([port, service]) => {
                    if (service.state === 'open') {
                        window.terminal.addLine(`${port}/tcp open ${service.service}`, 'output');
                    }
                });
            }
        }, 2500);
    }

    handleNiktoScan(args) {
        if (args.length === 0) {
            window.terminal.addLine('Usage: nikto -h <target>', 'output');
            return;
        }

        const target = this.extractTarget(args);
        window.terminal.addLine(`Starting Nikto scan on ${target}...`, 'output');
        window.terminal.showLoading('Web vulnerability scanning', 4000);

        setTimeout(() => {
            window.terminal.addLine('Nikto v2.1.6/2.1.5', 'output');
            window.terminal.addLine(`Target: ${target}`, 'output');
            window.terminal.addLine('─'.repeat(60), 'output');

            const vulnerabilities = [
                'Server may leak inodes via ETags',
                'The anti-clickjacking X-Frame-Options header is not present',
                'The X-XSS-Protection header is not defined',
                'The X-Content-Type-Options header is not set',
                'Root page / redirects to: /login.php',
                'Directory indexing found: /backup/',
                'Potentially interesting file: /admin.php',
                'Potentially interesting file: /config.php.bak'
            ];

            vulnerabilities.forEach((vuln, index) => {
                setTimeout(() => {
                    window.terminal.addLine(`+ ${vuln}`, 'error');
                }, index * 200);
            });

            setTimeout(() => {
                window.terminal.addLine('\\n+ 8 host(s) tested', 'success');
            }, vulnerabilities.length * 200 + 500);
        }, 4500);
    }

    findNetworkBySubnet(subnet) {
        return Object.values(this.networks).find(network => network.subnet === subnet);
    }

    findHost(target) {
        for (const network of Object.values(this.networks)) {
            if (network.hosts[target]) {
                return network.hosts[target];
            }
            // Also check by hostname
            for (const [ip, host] of Object.entries(network.hosts)) {
                if (host.hostname === target) {
                    return host;
                }
            }
        }
        return null;
    }

    extractTarget(args) {
        const hIndex = args.indexOf('-h');
        if (hIndex !== -1 && hIndex + 1 < args.length) {
            return args[hIndex + 1];
        }
        return args[args.length - 1];
    }

    generateMAC() {
        const chars = '0123456789ABCDEF';
        let mac = '';
        for (let i = 0; i < 6; i++) {
            if (i > 0) mac += ':';
            mac += chars[Math.floor(Math.random() * 16)];
            mac += chars[Math.floor(Math.random() * 16)];
        }
        return mac;
    }

    showNmapHelp() {
        window.terminal.addLine('Nmap 7.94 ( https://nmap.org )', 'output');
        window.terminal.addLine('Usage: nmap [Scan Type(s)] [Options] {target specification}', 'output');
        window.terminal.addLine('', 'output');
        window.terminal.addLine('TARGET SPECIFICATION:', 'output');
        window.terminal.addLine('  192.168.1.1              (single IP)', 'output');
        window.terminal.addLine('  192.168.1.0/24           (subnet)', 'output');
        window.terminal.addLine('  web-server.neuro-dev.local (hostname)', 'output');
        window.terminal.addLine('', 'output');
        window.terminal.addLine('SCAN TECHNIQUES:', 'output');
        window.terminal.addLine('  -sS: TCP SYN scan (default)', 'output');
        window.terminal.addLine('  -sT: TCP connect scan', 'output');
        window.terminal.addLine('  -sU: UDP scan', 'output');
        window.terminal.addLine('  -sV: Version detection', 'output');
        window.terminal.addLine('  -sC: Script scan', 'output');
        window.terminal.addLine('', 'output');
        window.terminal.addLine('OPTIONS:', 'output');
        window.terminal.addLine('  -v: Verbose output', 'output');
        window.terminal.addLine('  -A: Aggressive scan', 'output');
        window.terminal.addLine('  -O: OS detection', 'output');
        window.terminal.addLine('  -p-: Scan all ports', 'output');
    }

    // Network topology visualization
    showNetworkTopology() {
        const network = this.networks[this.currentNetwork];
        window.terminal.addLine(`\\n📊 ${network.name} Topology`, 'success');
        window.terminal.addLine('═'.repeat(50), 'output');
        window.terminal.addLine(`Subnet: ${network.subnet}`, 'output');
        window.terminal.addLine(`Gateway: ${network.gateway}`, 'output');
        window.terminal.addLine('', 'output');
        
        Object.entries(network.hosts).forEach(([ip, host]) => {
            const services = Object.keys(host.services).join(', ');
            window.terminal.addLine(`🖥️  ${ip} (${host.hostname})`, 'output');
            window.terminal.addLine(`    OS: ${host.os}`, 'output');
            window.terminal.addLine(`    Services: ${services}`, 'output');
            if (host.vulnerabilities.length > 0) {
                window.terminal.addLine(`    🚨 Vulnerabilities: ${host.vulnerabilities.join(', ')}`, 'error');
            }
            window.terminal.addLine('', 'output');
        });
    }

    switchNetwork(networkId) {
        if (this.networks[networkId]) {
            this.currentNetwork = networkId;
            window.terminal.addLine(`Switched to network: ${this.networks[networkId].name}`, 'success');
            this.showNetworkTopology();
        } else {
            window.terminal.addLine(`Network '${networkId}' not found`, 'error');
        }
    }
}

// Initialize network simulator
document.addEventListener('DOMContentLoaded', function() {
    window.networkSimulator = new NetworkSimulator();
    
    // Add network commands to terminal
    if (window.terminal) {
        window.terminal.handleNetwork = (args) => {
            if (args.length === 0) {
                window.networkSimulator.showNetworkTopology();
            } else if (args[0] === 'switch') {
                window.networkSimulator.switchNetwork(args[1]);
            } else if (args[0] === 'list') {
                window.terminal.addLine('Available networks:', 'output');
                Object.entries(window.networkSimulator.networks).forEach(([id, network]) => {
                    window.terminal.addLine(`  ${id}: ${network.name}`, 'output');
                });
            }
        };
        
        window.terminal.handleNetdiscover = (args) => window.networkSimulator.handleNetdiscover(args);
        window.terminal.handleMasscan = (args) => window.networkSimulator.handleMasscan(args);
    }
});