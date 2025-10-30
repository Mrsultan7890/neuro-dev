class TerminalSimulator {
    constructor() {
        this.currentDir = '/home/kali/practice-lab';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.commandCount = 0;
        this.currentScenario = 'basic';
        this.progress = 0;
        this.score = 0;
        this.startTime = null;
        this.challengeTimer = null;
        this.timeLimit = 0;
        this.flags = {
            'flag{welcome_to_ctf}': 'Hidden in welcome message',
            'flag{base64_master}': 'SGVsbG8gV29ybGQ=',
            'flag{network_ninja}': 'Found in nmap scan',
            'flag{exploit_expert}': 'Successful exploitation',
            'flag{forensics_pro}': 'Log analysis complete'
        };
        this.foundFlags = new Set();
        
        // Advanced Features
        this.sessionRecording = [];
        this.isRecording = false;
        this.aliases = {
            'll': 'ls -la',
            'la': 'ls -a',
            'scan': 'nmap -sS',
            'portscan': 'nmap -p-',
            'webscan': 'nikto -h',
            'sqltest': 'sqlmap -u',
            'dirscan': 'dirb',
            'fuzz': 'ffuf -u'
        };
        this.typoCorrections = {
            'nmpa': 'nmap',
            'namp': 'nmap',
            'napm': 'nmap',
            'pign': 'ping',
            'pingg': 'ping',
            'crul': 'curl',
            'culr': 'curl',
            'sqlmpa': 'sqlmap',
            'sqlamp': 'sqlmap',
            'dirbb': 'dirb',
            'nikot': 'nikto',
            'grpe': 'grep',
            'gerp': 'grep',
            'fdin': 'find',
            'fidn': 'find',
            'clea': 'clear',
            'claer': 'clear',
            'hep': 'help',
            'hlep': 'help'
        };
        this.completionSuggestions = [];
        this.environmentVars = {
            'PATH': '/usr/bin:/bin:/usr/sbin:/sbin',
            'HOME': '/home/kali',
            'USER': 'kali',
            'SHELL': '/bin/bash',
            'TARGET': '192.168.1.1',
            'WORDLIST': '/usr/share/wordlists/rockyou.txt'
        };
        this.backgroundJobs = [];
        this.jobCounter = 1;
        
        // Virtual File System
        this.fileSystem = {
            '/home/kali/practice-lab': {
                type: 'directory',
                contents: {
                    'readme.txt': { type: 'file', content: 'Welcome to Practice Lab!\nYeh ek safe environment hai ethical hacking practice ke liye.' },
                    'tools': { 
                        type: 'directory', 
                        contents: {
                            'nmap.txt': { type: 'file', content: 'Nmap - Network Mapper\nUsage: nmap [options] target' },
                            'sqlmap.txt': { type: 'file', content: 'SQLMap - SQL Injection Tool\nUsage: sqlmap -u "url" --dbs' }
                        }
                    },
                    'logs': {
                        type: 'directory',
                        contents: {
                            'access.log': { type: 'file', content: '192.168.1.100 - - [01/Jan/2024:12:00:00] "GET / HTTP/1.1" 200 1234' },
                            'error.log': { type: 'file', content: '[error] [client 192.168.1.100] File does not exist: /var/www/html/admin' }
                        }
                    }
                }
            }
        };

        // Lab Scenarios
        this.scenarios = {
            basic: {
                name: 'Basic Commands Lab',
                description: 'Linux basic commands practice karne ke liye. File operations, navigation, aur system commands seekhiye.',
                objectives: ['ls, cd, pwd commands', 'File create/delete', 'Directory navigation'],
                hints: ['Type "help" for available commands', 'Use "ls" to list files', 'Use "cd" to change directory'],
                requiredCommands: ['ls', 'cd', 'pwd', 'cat', 'mkdir']
            },
            network: {
                name: 'Network Scanning Lab',
                description: 'Network reconnaissance aur scanning techniques practice kariye.',
                objectives: ['Nmap scanning', 'Port discovery', 'Service enumeration'],
                hints: ['Use "nmap" for network scanning', 'Try "ping" to test connectivity', 'Use "netstat" to see connections'],
                requiredCommands: ['nmap', 'ping', 'netstat', 'ss', 'curl']
            },
            web: {
                name: 'Web Application Testing',
                description: 'Web application security testing aur vulnerability assessment.',
                objectives: ['Directory enumeration', 'SQL injection testing', 'XSS detection'],
                hints: ['Use "dirb" for directory scanning', 'Try "sqlmap" for SQL injection', 'Use "curl" for web requests'],
                requiredCommands: ['dirb', 'sqlmap', 'curl', 'nikto', 'wget']
            },
            forensics: {
                name: 'Digital Forensics Lab',
                description: 'Log analysis aur digital evidence collection practice.',
                objectives: ['Log file analysis', 'File recovery', 'Evidence collection'],
                hints: ['Check log files in /logs directory', 'Use "grep" to search patterns', 'Use "find" to locate files'],
                requiredCommands: ['grep', 'find', 'strings', 'file', 'hexdump']
            },
            ctf: {
                name: 'CTF Challenges',
                description: 'Capture The Flag competitions aur hacking challenges solve kariye.',
                objectives: ['Flag hunting', 'Crypto challenges', 'Reverse engineering'],
                hints: ['Look for hidden flags', 'Try "base64" decoding', 'Check file headers with "file"'],
                requiredCommands: ['base64', 'strings', 'file', 'xxd', 'openssl']
            },
            'network-sim': {
                name: 'Network Simulation',
                description: 'Real network topology simulation aur advanced scanning.',
                objectives: ['Network mapping', 'Service enumeration', 'Vulnerability scanning'],
                hints: ['Use "nmap" with different flags', 'Try "masscan" for fast scanning', 'Check "arp-scan" for local networks'],
                requiredCommands: ['nmap', 'masscan', 'arp-scan', 'traceroute', 'dig']
            },
            vulnerable: {
                name: 'Vulnerable Machines',
                description: 'Intentionally vulnerable targets practice ke liye.',
                objectives: ['Exploit vulnerabilities', 'Privilege escalation', 'Post exploitation'],
                hints: ['Start with "nmap" scan', 'Try common exploits', 'Look for misconfigurations'],
                requiredCommands: ['nmap', 'exploit', 'msfconsole', 'searchsploit', 'nc']
            },
            speed: {
                name: 'Speed Challenges',
                description: 'Time-based challenges aur speed tests.',
                objectives: ['Fast scanning', 'Quick enumeration', 'Rapid exploitation'],
                hints: ['Use shortcuts and aliases', 'Combine commands with pipes', 'Practice common patterns'],
                requiredCommands: ['nmap', 'curl', 'grep', 'awk', 'sed']
            },
            metasploit: {
                name: 'Metasploit Simulator',
                description: 'Metasploit framework simulation aur exploitation practice.',
                objectives: ['Module selection', 'Payload generation', 'Exploit execution'],
                hints: ['Use "msfconsole" to start', 'Try "search" for exploits', 'Set options with "set"'],
                requiredCommands: ['msfconsole', 'search', 'use', 'set', 'exploit']
            },
            wireshark: {
                name: 'Packet Analysis',
                description: 'Network packet analysis aur traffic monitoring.',
                objectives: ['Packet capture', 'Protocol analysis', 'Traffic filtering'],
                hints: ['Use "tcpdump" for capture', 'Try "tshark" for analysis', 'Filter with specific protocols'],
                requiredCommands: ['tcpdump', 'tshark', 'wireshark', 'netstat', 'ss']
            },
            burp: {
                name: 'Burp Suite Simulator',
                description: 'Web application security testing aur proxy analysis.',
                objectives: ['Request interception', 'Parameter fuzzing', 'Vulnerability scanning'],
                hints: ['Use "burpsuite" command', 'Try "ffuf" for fuzzing', 'Intercept with "proxy"'],
                requiredCommands: ['burpsuite', 'ffuf', 'gobuster', 'wfuzz', 'proxy']
            },
            custom: {
                name: 'Custom Scripts Lab',
                description: 'User-defined tools aur custom automation scripts.',
                objectives: ['Script creation', 'Tool automation', 'Custom workflows'],
                hints: ['Create bash scripts', 'Use "python" for automation', 'Save scripts in /scripts'],
                requiredCommands: ['nano', 'python', 'bash', 'chmod', 'script']
            }
        };

        this.init();
    }

    init() {
        console.log('Initializing terminal simulator...');
        
        this.terminalInput = document.getElementById('terminalInput');
        this.terminalOutput = document.getElementById('terminalOutput');
        
        if (!this.terminalInput || !this.terminalOutput) {
            console.error('Terminal elements not found!');
            return;
        }
        
        console.log('Terminal elements found, adding event listeners...');
        
        // Event listeners
        this.terminalInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        const clearBtn = document.getElementById('clearTerminal');
        const resetBtn = document.getElementById('resetLab');
        const fullscreenBtn = document.getElementById('fullscreen');
        const sidebarBtn = document.getElementById('toggleSidebar');
        const recordBtn = document.getElementById('recordSession');
        const playBtn = document.getElementById('playSession');
        const aliasBtn = document.getElementById('manageAliases');
        
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearTerminal());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetLab());
        if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        if (sidebarBtn) sidebarBtn.addEventListener('click', () => this.toggleSidebar());
        if (recordBtn) recordBtn.addEventListener('click', () => this.toggleRecording());
        if (playBtn) playBtn.addEventListener('click', () => this.playbackSession());
        if (aliasBtn) aliasBtn.addEventListener('click', () => this.showAliasManager());
        
        // Scenario switching
        document.querySelectorAll('.scenario-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const scenario = e.target.closest('.scenario-item').dataset.scenario;
                console.log('Switching to scenario:', scenario);
                this.switchScenario(scenario);
            });
        });

        // Orientation change detection
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const hint = document.getElementById('orientationHint');
                if (document.fullscreenElement && window.innerWidth > window.innerHeight && hint) {
                    hint.classList.remove('show');
                }
            }, 500);
        });

        // Focus terminal input
        this.terminalInput.focus();
        
        console.log('Initializing basic scenario...');
        // Initialize scenario
        this.switchScenario('basic');
        
        console.log('Terminal simulator initialized successfully!');
        
        // Load saved aliases
        this.loadAliases();
        
        // Test terminal output
        this.addToOutput('<div class="success-output">Terminal ready! Type "help" for commands.</div>');
        this.addToOutput('<div class="info-output">New features: Auto-correction, Tab completion, Session recording, Custom aliases</div>');
    }

    handleKeyDown(e) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Tab':
                e.preventDefault();
                this.intelligentComplete();
                break;
        }
    }

    executeCommand() {
        try {
            let command = this.terminalInput.value.trim();
            if (!command) return;

            // Auto-correction
            const correctedCommand = this.autoCorrect(command);
            if (correctedCommand !== command) {
                this.addToOutput(`<div class="warning-output">Auto-corrected: '${command}' → '${correctedCommand}'</div>`);
                command = correctedCommand;
            }

            // Process aliases
            command = this.processAliases(command);
            
            // Process environment variables
            command = this.processEnvironmentVars(command);
            
            // Check for pipes
            if (command.includes('|')) {
                this.processPipeCommand(command);
                return;
            }
            
            // Check for background job
            if (command.endsWith(' &')) {
                this.processBackgroundJob(command.slice(0, -2));
                return;
            }

            // Session recording
            if (this.isRecording) {
                this.sessionRecording.push({
                    command: command,
                    timestamp: Date.now(),
                    directory: this.currentDir
                });
            }

            // Add to history
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;

            // Display command
            this.addToOutput(`<div class="command-line"><span class="terminal-prompt"><span class="user-host">kali@neuro-dev</span>:<span class="current-dir">${this.currentDir}</span>$ </span>${command}</div>`);

            // Execute command
            this.processCommand(command);
            
            // Check for flags in CTF mode
            if (this.currentScenario === 'ctf') {
                setTimeout(() => this.checkForFlags(command), 100);
            }

            // Clear input
            this.terminalInput.value = '';
            
            // Update progress
            this.updateProgress();
            
            // Scroll to bottom
            this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
        } catch (error) {
            console.error('Command execution error:', error);
            this.addToOutput(`<div class="error-output">Error executing command: ${error.message}</div>`);
        }
    }

    processCommand(command) {
        try {
            console.log('Processing command:', command);
            
            const parts = command.split(' ');
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);

            this.commandCount++;
            const countElement = document.getElementById('commandCount');
            if (countElement) countElement.textContent = this.commandCount;

            switch(cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'ls':
                this.listDirectory(args);
                break;
            case 'cd':
                this.changeDirectory(args[0]);
                break;
            case 'pwd':
                this.printWorkingDirectory();
                break;
            case 'cat':
                this.catFile(args[0]);
                break;
            case 'mkdir':
                this.makeDirectory(args[0]);
                break;
            case 'rm':
                this.removeFile(args);
                break;
            case 'clear':
                this.clearTerminal();
                break;
            case 'whoami':
                this.addToOutput('<div class="success-output">kali</div>');
                break;
            case 'uname':
                this.addToOutput('<div class="success-output">Linux neuro-dev 5.15.0-kali3-amd64 #1 SMP Debian 5.15.15-2kali1 (2022-01-31) x86_64 GNU/Linux</div>');
                break;
            case 'date':
                this.addToOutput(`<div class="success-output">${new Date().toString()}</div>`);
                break;
            case 'nmap':
                this.simulateNmap(args);
                break;
            case 'ping':
                this.simulatePing(args[0]);
                break;
            case 'curl':
                this.simulateCurl(args);
                break;
            case 'sqlmap':
                this.simulateSqlmap(args);
                break;
            case 'dirb':
                this.simulateDirb(args[0]);
                break;
            case 'nikto':
                this.simulateNikto(args[0]);
                break;
            case 'grep':
                this.simulateGrep(args);
                break;
            case 'find':
                this.simulateFind(args);
                break;
            case 'netstat':
                this.simulateNetstat();
                break;
            case 'ps':
                this.simulatePs();
                break;
            case 'top':
                this.addToOutput('<div class="success-output">top - 14:30:15 up 2 days, 3:45, 1 user, load average: 0.15, 0.10, 0.05</div>');
                break;
            case 'msfconsole':
                this.simulateMetasploit();
                break;
            case 'burpsuite':
                this.simulateBurpSuite();
                break;
            case 'tcpdump':
                this.simulateTcpdump(args);
                break;
            case 'tshark':
                this.simulateTshark(args);
                break;
            case 'masscan':
                this.simulateMasscan(args);
                break;
            case 'searchsploit':
                this.simulateSearchsploit(args);
                break;
            case 'base64':
                this.simulateBase64(args);
                break;
            case 'strings':
                this.simulateStrings(args);
                break;
            case 'xxd':
                this.simulateXxd(args);
                break;
            case 'ffuf':
                this.simulateFfuf(args);
                break;
            case 'gobuster':
                this.simulateGobuster(args);
                break;
            case 'exploit':
                this.simulateExploit(args);
                break;
            case 'nc':
                this.simulateNetcat(args);
                break;
            case 'script':
                this.simulateScript(args);
                break;
            case 'validate':
                this.validateCommand(args.join(' '));
                break;
            case 'alias':
                this.manageAlias(args);
                break;
            case 'record':
                this.toggleRecording();
                break;
            case 'playback':
                this.playbackSession();
                break;
            case 'history':
                this.showHistory();
                break;
            case 'export':
                this.exportVariable(args);
                break;
            case 'env':
                this.showEnvironment();
                break;
            case 'chmod':
                this.changePermissions(args);
                break;
            case 'chown':
                this.changeOwnership(args);
                break;
            case 'tar':
                this.simulateTar(args);
                break;
            case 'diff':
                this.simulateDiff(args);
                break;
            case 'awk':
                this.simulateAwk(args);
                break;
            case 'sed':
                this.simulateSed(args);
                break;
            case 'sort':
                this.simulateSort(args);
                break;
            case 'uniq':
                this.simulateUniq(args);
                break;
            case 'cut':
                this.simulateCut(args);
                break;
            case 'wc':
                this.simulateWc(args);
                break;
            case 'jobs':
                this.showJobs();
                break;
            case 'fg':
                this.foregroundJob(args);
                break;
            case 'bg':
                this.backgroundJob(args);
                break;
            case 'kill':
                this.killProcess(args);
                break;
            case 'df':
                this.showDiskUsage(args);
                break;
            case 'du':
                this.showDirectoryUsage(args);
                break;
            case 'free':
                this.showMemoryInfo();
                break;
            case 'lscpu':
                this.showCpuInfo();
                break;
            case 'htop':
                this.simulateHtop();
                break;
            case 'md5sum':
                this.calculateHash(args, 'md5');
                break;
            case 'sha256sum':
                this.calculateHash(args, 'sha256');
                break;
            case 'openssl':
                this.simulateOpenssl(args);
                break;
            case 'ssh':
                this.simulateSsh(args);
                break;
            case 'dig':
                this.simulateDig(args);
                break;
            case 'nslookup':
                this.simulateNslookup(args);
                break;
            case 'host':
                this.simulateHost(args);
                break;
            default:
                this.addToOutput(`<div class="error-output">bash: ${cmd}: command not found</div>`);
        }
        } catch (error) {
            console.error('Error processing command:', error);
            this.addToOutput(`<div class="error-output">Error: ${error.message}</div>`);
        }
    }

    showHelp() {
        const helpText = `
<div class="success-output">Available Commands:

Basic Commands:
  ls          - List directory contents
  cd [dir]    - Change directory
  pwd         - Print working directory
  cat [file]  - Display file contents
  mkdir [dir] - Create directory
  rm [file]   - Remove file
  clear       - Clear terminal
  whoami      - Current user
  uname       - System information
  date        - Current date/time

Network Tools:
  nmap [target]     - Network scanner
  ping [host]       - Test connectivity
  curl [url]        - HTTP client
  netstat           - Network connections

Security Tools:
  sqlmap [options]  - SQL injection tool
  dirb [url]        - Directory scanner
  nikto [target]    - Web vulnerability scanner

System Tools:
  grep [pattern]    - Search text patterns
  find [path]       - Find files
  ps                - Process list
  top               - System monitor

Advanced Security Tools:
  msfconsole        - Metasploit framework
  burpsuite         - Web app security testing
  tcpdump [iface]   - Packet capture
  tshark [options]  - Network analysis
  masscan [target]  - Fast port scanner
  searchsploit [q]  - Exploit database search
  
Web Testing:
  ffuf [options]    - Web fuzzer
  gobuster [url]    - Directory brute force
  
Forensics & Analysis:
  base64 [-d]       - Base64 encode/decode
  strings [file]    - Extract strings
  xxd [file]        - Hex dump
  
Exploitation:
  exploit [target]  - Run exploit
  nc [host] [port]  - Netcat connection
  
Custom Tools:
  script [name]     - Create custom script
  validate [cmd]    - Validate command for scenario
  alias [name] [cmd] - Create/manage aliases
  record            - Start/stop session recording
  playback          - Replay recorded session
  history           - Show command history

Navigation:
  ↑/↓ arrows       - Command history
  Tab              - Intelligent auto-complete
  Ctrl+C           - Cancel command

Features:
  Auto-correction   - Typos automatically fixed
  Smart completion  - Context-aware suggestions
  Session recording - Record and replay commands
  Custom aliases    - Create command shortcuts
</div>`;
        this.addToOutput(helpText);
    }

    listDirectory(args) {
        const path = args[0] || this.currentDir;
        const dir = this.getDirectory(path);
        
        if (!dir) {
            this.addToOutput(`<div class="error-output">ls: cannot access '${path}': No such file or directory</div>`);
            return;
        }

        let output = '<div class="success-output">';
        Object.keys(dir.contents).forEach(name => {
            const item = dir.contents[name];
            if (item.type === 'directory') {
                output += `<span style="color: #0080ff; font-weight: bold;">${name}/</span>  `;
            } else {
                output += `<span style="color: #ffffff;">${name}</span>  `;
            }
        });
        output += '</div>';
        this.addToOutput(output);
    }

    changeDirectory(path) {
        if (!path) {
            this.currentDir = '/home/kali';
            return;
        }

        let newPath;
        if (path.startsWith('/')) {
            newPath = path;
        } else if (path === '..') {
            const parts = this.currentDir.split('/');
            parts.pop();
            newPath = parts.join('/') || '/';
        } else {
            newPath = `${this.currentDir}/${path}`.replace('//', '/');
        }

        const dir = this.getDirectory(newPath);
        if (dir && dir.type === 'directory') {
            this.currentDir = newPath;
            document.querySelector('.current-dir').textContent = newPath;
        } else {
            this.addToOutput(`<div class="error-output">cd: ${path}: No such file or directory</div>`);
        }
    }

    printWorkingDirectory() {
        this.addToOutput(`<div class="success-output">${this.currentDir}</div>`);
    }

    catFile(filename) {
        if (!filename) {
            this.addToOutput('<div class="error-output">cat: missing file operand</div>');
            return;
        }

        const file = this.getFile(`${this.currentDir}/${filename}`);
        if (file && file.type === 'file') {
            this.addToOutput(`<div class="success-output">${file.content}</div>`);
        } else {
            this.addToOutput(`<div class="error-output">cat: ${filename}: No such file or directory</div>`);
        }
    }

    makeDirectory(dirname) {
        if (!dirname) {
            this.addToOutput('<div class="error-output">mkdir: missing operand</div>');
            return;
        }

        const currentDirObj = this.getDirectory(this.currentDir);
        if (currentDirObj && !currentDirObj.contents[dirname]) {
            currentDirObj.contents[dirname] = { type: 'directory', contents: {} };
            this.addToOutput(`<div class="success-output">Directory '${dirname}' created</div>`);
        } else {
            this.addToOutput(`<div class="error-output">mkdir: cannot create directory '${dirname}': File exists</div>`);
        }
    }

    simulateNmap(args) {
        const target = args[args.length - 1] || '192.168.1.1';
        let output = `Starting Nmap scan on ${target}...\n\n`;
        
        if (args.includes('-sV')) {
            output += `Nmap scan report for ${target}\nHost is up (0.001s latency).\nPORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 8.2p1\n80/tcp   open  http    Apache httpd 2.4.41\n443/tcp  open  https   Apache httpd 2.4.41\n3306/tcp open  mysql   MySQL 8.0.25\n`;
        } else if (args.includes('-sC')) {
            output += `Nmap scan report for ${target}\nHost is up (0.001s latency).\nPORT   STATE SERVICE\n22/tcp open  ssh\n|_ssh-hostkey: 2048 aa:bb:cc:dd\n80/tcp open  http\n|_http-title: Apache Default Page\n`;
        } else if (args.includes('-A')) {
            output += `Nmap scan report for ${target}\nHost is up (0.001s latency).\nPORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.2p1\n80/tcp open  http    Apache httpd 2.4.41\nOS: Linux 3.2 - 4.9\n`;
        } else if (args.includes('-O')) {
            output += `Nmap scan report for ${target}\nHost is up (0.001s latency).\nOS details: Linux 3.2 - 4.9\nNetwork Distance: 1 hop\n`;
        } else {
            output += `Nmap scan report for ${target}\nHost is up (0.001s latency).\nNot shown: 996 closed ports\nPORT     STATE SERVICE\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https\n3306/tcp open  mysql\n`;
        }
        
        output += `\nNmap done: 1 IP address (1 host up) scanned in 2.15 seconds`;
        this.addToOutput(`<div class="success-output">${output}</div>`);
    }

    simulatePing(host) {
        const target = host || 'google.com';
        this.addToOutput(`<div class="success-output">PING ${target} (172.217.164.110): 56 data bytes
64 bytes from 172.217.164.110: icmp_seq=0 ttl=118 time=12.345 ms
64 bytes from 172.217.164.110: icmp_seq=1 ttl=118 time=11.234 ms
64 bytes from 172.217.164.110: icmp_seq=2 ttl=118 time=13.456 ms

--- ${target} ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss</div>`);
    }

    simulateCurl(args) {
        const url = args[0] || 'http://example.com';
        this.addToOutput(`<div class="success-output"><!DOCTYPE html>
<html>
<head>
    <title>Example Domain</title>
</head>
<body>
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples.</p>
</body>
</html></div>`);
    }

    simulateSqlmap(args) {
        this.addToOutput(`<div class="success-output">        ___
       __H__
 ___ ___[)]_____ ___ ___  {1.6.12#stable}
|_ -| . [']     | .'| . |
|___|_  ["]_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

[*] starting @ 14:30:15 /2024-01-01/

[14:30:15] [INFO] testing connection to the target URL
[14:30:15] [INFO] checking if the target is protected by some kind of WAF/IPS
[14:30:16] [INFO] testing if the parameter 'id' is dynamic
[14:30:16] [INFO] confirming that parameter 'id' is dynamic
[14:30:16] [INFO] heuristic (basic) test shows that parameter 'id' might be injectable
[14:30:17] [INFO] testing for SQL injection on parameter 'id'
[14:30:17] [INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[14:30:18] [INFO] parameter 'id' appears to be 'AND boolean-based blind - WHERE or HAVING clause' injectable</div>`);
    }

    simulateDirb(url) {
        const target = url || 'http://example.com';
        this.addToOutput(`<div class="success-output">-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Mon Jan 01 14:30:15 2024
URL_BASE: ${target}/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: ${target}/ ----
+ ${target}/admin (CODE:200|SIZE:1234)                                                                               
+ ${target}/backup (CODE:200|SIZE:567)                                                                              
+ ${target}/config (CODE:403|SIZE:890)                                                                               
+ ${target}/login (CODE:200|SIZE:2345)                                                                               

-----------------
END_TIME: Mon Jan 01 14:30:45 2024
DOWNLOADED: 4612 - FOUND: 4</div>`);
    }

    simulateNikto(target) {
        const host = target || 'example.com';
        this.addToOutput(`<div class="success-output">- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.1.100
+ Target Hostname:    ${host}
+ Target Port:        80
+ Start Time:         2024-01-01 14:30:15 (GMT0)
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined.
+ The X-Content-Type-Options header is not set.
+ Root page / redirects to: login.php
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ Apache/2.4.41 appears to be outdated (current is at least Apache/2.4.54).
+ Allowed HTTP Methods: GET, HEAD, POST, OPTIONS 
+ /admin/: Admin login page/section found.
+ /backup/: Backup directory found.
+ 7915 requests: 0 error(s) and 8 item(s) reported on remote host</div>`);
    }

    simulateGrep(args) {
        const pattern = args[0];
        const file = args[1];
        
        if (!pattern) {
            this.addToOutput('<div class="error-output">grep: missing pattern</div>');
            return;
        }

        this.addToOutput(`<div class="success-output">Searching for pattern '${pattern}'...
192.168.1.100 - - [01/Jan/2024:12:00:00] "GET /admin HTTP/1.1" 200 1234
192.168.1.50 - - [01/Jan/2024:12:05:00] "POST /admin/login HTTP/1.1" 401 567</div>`);
    }

    simulateFind(args) {
        const path = args[0] || '.';
        this.addToOutput(`<div class="success-output">./readme.txt
./tools/nmap.txt
./tools/sqlmap.txt
./logs/access.log
./logs/error.log</div>`);
    }

    simulateNetstat() {
        this.addToOutput(`<div class="success-output">Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 192.168.1.100:22        192.168.1.50:54321      ESTABLISHED
tcp        0      0 192.168.1.100:80        192.168.1.75:45678      TIME_WAIT  
tcp        0      0 192.168.1.100:443       192.168.1.25:12345      ESTABLISHED</div>`);
    }

    simulatePs() {
        this.addToOutput(`<div class="success-output">  PID TTY          TIME CMD
 1234 pts/0    00:00:01 bash
 5678 pts/0    00:00:00 apache2
 9012 pts/0    00:00:00 mysql
 3456 pts/0    00:00:00 ssh</div>`);
    }

    simulateMetasploit() {
        this.addToOutput(`<div class="success-output">                                                  
      .:okOOOkdc'           'cdkOOOko:.
    .xOOOOOOOOOOOOc       cOOOOOOOOOOOOx.
   :OOOOOOOOOOOOOOOk,   ,kOOOOOOOOOOOOOOO:
  'OOOOOOOOOkkkkOOOOO: :OOOOOOOOOOOOOOOOOO'
  oOOOOOOOO.MMMM.oOOOOoOOOOl.MMMM,OOOOOOOOo
  dOOOOOOOO.MMMMMM.cOOOOOc.MMMMMM,OOOOOOOOx
  lOOOOOOOO.MMMMMMMMM;d;MMMMMMMMM,OOOOOOOOl
  .OOOOOOOO.MMM.;MMMMMMMMMMM;MMMM,OOOOOOOO.
   cOOOOOOO.MMM.OOc.MMMMM'oOO.MMM,OOOOOOOc
    oOOOOOO.MMM.OOOO.MMM:OOOO.MMM,OOOOOOo
     lOOOOO.MMM.OOOO.MMM:OOOO.MMM,OOOOl
      ;OOO.MMM.OOOO.MMM:OOOO.MMM.OOO;
       .MMM.OOOO.MMM:OOOO.MMM.
        OOOO.MMM:OOOO.MMM
         .MMM:OOOO.MMM.
          :OOOO.MMM
           .MMM
            MM

       =[ metasploit v6.3.25-dev                          ]
+ -- --=[ 2328 exploits - 1220 auxiliary - 413 post       ]
+ -- --=[ 951 payloads - 45 encoders - 11 nops            ]
+ -- --=[ 9 evasion                                        ]

msf6 > </div>`);
    }

    simulateBurpSuite() {
        this.addToOutput(`<div class="success-output">Burp Suite Professional v2023.10.3.4
Starting Burp Suite...

[+] Proxy listener started on 127.0.0.1:8080
[+] Spider module loaded
[+] Scanner module loaded
[+] Intruder module loaded
[+] Repeater module loaded

Burp Suite is ready for web application testing!
Configure your browser to use proxy: 127.0.0.1:8080</div>`);
    }

    simulateTcpdump(args) {
        const iface = args[0] || 'eth0';
        this.addToOutput(`<div class="success-output">tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on ${iface}, link-type EN10MB (Ethernet), capture size 262144 bytes

14:30:15.123456 IP 192.168.1.100.54321 > 192.168.1.1.80: Flags [S], seq 123456789
14:30:15.124567 IP 192.168.1.1.80 > 192.168.1.100.54321: Flags [S.], seq 987654321
14:30:15.125678 IP 192.168.1.100.54321 > 192.168.1.1.80: Flags [.], ack 987654322
14:30:15.126789 IP 192.168.1.100.54321 > 192.168.1.1.80: Flags [P.], seq 123456790

^C
4 packets captured
4 packets received by filter
0 packets dropped by kernel</div>`);
    }

    simulateTshark(args) {
        this.addToOutput(`<div class="success-output">Running as user "root" and group "root". This could be dangerous.
Capturing on 'eth0'
    1   0.000000 192.168.1.100 → 192.168.1.1   TCP 74 54321 → 80 [SYN] Seq=0 Win=65535
    2   0.001234 192.168.1.1   → 192.168.1.100 TCP 74 80 → 54321 [SYN, ACK] Seq=0 Ack=1
    3   0.002345 192.168.1.100 → 192.168.1.1   TCP 66 54321 → 80 [ACK] Seq=1 Ack=1
    4   0.003456 192.168.1.100 → 192.168.1.1   HTTP 142 GET / HTTP/1.1
    5   0.004567 192.168.1.1   → 192.168.1.100 HTTP 328 HTTP/1.1 200 OK

^C5 packets captured</div>`);
    }

    simulateMasscan(args) {
        const target = args[0] || '192.168.1.0/24';
        this.addToOutput(`<div class="success-output">Starting masscan 1.3.2 (http://bit.ly/14GZzcT)
Initiating SYN Stealth Scan
Scanning ${target} [1000 ports/host]

Discovered open port 80/tcp on 192.168.1.1
Discovered open port 22/tcp on 192.168.1.1
Discovered open port 443/tcp on 192.168.1.1
Discovered open port 21/tcp on 192.168.1.5
Discovered open port 3389/tcp on 192.168.1.10
Discovered open port 445/tcp on 192.168.1.15

Rate: 1000.00-kpps, 0.12% done, 0:00:59 remaining (found=6)</div>`);
    }

    simulateSearchsploit(args) {
        const query = args.join(' ') || 'apache';
        this.addToOutput(`<div class="success-output">------------------------------------------------- ---------------------------------
 Exploit Title                                   |  Path
------------------------------------------------- ---------------------------------
Apache + PHP < 5.3.12 / < 5.4.2 - cgi-bin Remo | php/remote/29290.c
Apache 2.4.17 < 2.4.38 - 'apache2ctl graceful'  | linux/local/46676.php
Apache < 2.2.34 / < 2.4.27 - OPTIONS Memory Lea | linux/webapps/42745.py
Apache CXF < 2.5.10/2.6.7/2.7.4 - Denial of Ser | xml/dos/26710.txt
Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuck.c' R | c/remote/21671.c
Apache Tomcat < 5.5.17 - Remote Directory Listi | multiple/remote/2061.txt
------------------------------------------------- ---------------------------------
Shellcodes: No Results</div>`);
    }

    simulateBase64(args) {
        if (args[0] === '-d') {
            this.addToOutput(`<div class="success-output">SGVsbG8gV29ybGQ= decoded to: Hello World</div>`);
        } else {
            this.addToOutput(`<div class="success-output">Hello World encoded to: SGVsbG8gV29ybGQ=</div>`);
        }
    }

    simulateStrings(args) {
        const file = args[0] || 'binary_file';
        this.addToOutput(`<div class="success-output">Extracting strings from ${file}:

/lib64/ld-linux-x86-64.so.2
libc.so.6
printf
exit
__libc_start_main
GLIBC_2.2.5
Hello World!
This is a test string
flag{hidden_in_binary_12345}
Password: admin123
/tmp/secret.txt</div>`);
    }

    simulateXxd(args) {
        const file = args[0] || 'file.bin';
        this.addToOutput(`<div class="success-output">Hex dump of ${file}:

00000000: 7f45 4c46 0201 0100 0000 0000 0000 0000  .ELF............
00000010: 0200 3e00 0100 0000 4010 4000 0000 0000  ..>.....@.@.....
00000020: 4000 0000 0000 0000 4828 0000 0000 0000  @.......H(......
00000030: 0000 0000 4000 3800 0900 4000 1e00 1b00  ....@.8...@.....
00000040: 0600 0000 0500 0000 4000 0000 0000 0000  ........@.......
00000050: 4000 4000 0000 0000 4000 4000 0000 0000  @.@.....@.@.....</div>`);
    }

    simulateFfuf(args) {
        const url = args.find(arg => arg.startsWith('http')) || 'http://target.com/FUZZ';
        this.addToOutput(`<div class="success-output">        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v1.5.0 Kali Exclusive <3
________________________________________________

 :: Method           : GET
 :: URL              : ${url}
 :: Wordlist         : FUZZ: /usr/share/wordlists/dirb/common.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403,405
________________________________________________

admin                   [Status: 200, Size: 1234, Words: 89, Lines: 45]
login                   [Status: 200, Size: 2345, Words: 156, Lines: 78]
config                  [Status: 403, Size: 567, Words: 23, Lines: 12]
backup                  [Status: 200, Size: 890, Words: 67, Lines: 34]
:: Progress: [4614/4614] :: Job [1/1] :: 1000 req/sec :: Duration: [0:00:05] :: Errors: 0 ::</div>`);
    }

    simulateGobuster(args) {
        const url = args.find(arg => arg.startsWith('http')) || 'http://target.com';
        this.addToOutput(`<div class="success-output">===============================================================
Gobuster v3.5
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     ${url}
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.5
[+] Timeout:                 10s
===============================================================
2024/01/01 14:30:15 Starting gobuster in directory enumeration mode
===============================================================
/.htaccess            (Status: 403) [Size: 278]
/.htpasswd            (Status: 403) [Size: 278]
/admin                (Status: 200) [Size: 1234]
/backup               (Status: 200) [Size: 567]
/config               (Status: 403) [Size: 278]
/login                (Status: 200) [Size: 2345]
/uploads              (Status: 301) [Size: 312] [--> http://target.com/uploads/]
===============================================================
2024/01/01 14:30:20 Finished
===============================================================</div>`);
    }

    simulateExploit(args) {
        const target = args[0] || 'target.com';
        this.addToOutput(`<div class="success-output">[*] Starting exploit against ${target}
[*] Checking target vulnerability...
[+] Target appears vulnerable!
[*] Generating payload...
[*] Payload generated: linux/x86/meterpreter/reverse_tcp
[*] Sending exploit...
[*] Exploit sent successfully!
[*] Waiting for connection...
[+] Meterpreter session 1 opened (192.168.1.100:4444 -> ${target}:1234)

meterpreter > </div>`);
    }

    simulateNetcat(args) {
        if (args.includes('-l')) {
            this.addToOutput(`<div class="success-output">Listening on [0.0.0.0] (family 0, port 4444)
Connection from 192.168.1.50 port 4444 [tcp/*] accepted (family 2, sport 54321)
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
whoami
www-data</div>`);
        } else {
            const host = args[0] || 'target.com';
            const port = args[1] || '80';
            this.addToOutput(`<div class="success-output">Connecting to ${host} port ${port}...
Connection established!
GET / HTTP/1.1
Host: ${host}

HTTP/1.1 200 OK
Server: Apache/2.4.41
Content-Type: text/html</div>`);
        }
    }

    simulateScript(args) {
        const scriptName = args[0] || 'auto_scan.sh';
        this.addToOutput(`<div class="success-output">Creating custom script: ${scriptName}

#!/bin/bash
# Auto scanning script
echo "Starting automated scan..."
nmap -sS -O $1
echo "Scan completed!"

Script saved to /scripts/${scriptName}
Use: chmod +x /scripts/${scriptName} && ./scripts/${scriptName} target</div>`);
    }

    validateCommand(command) {
        const scenario = this.scenarios[this.currentScenario];
        const requiredCommands = scenario.requiredCommands;
        const commandBase = command.split(' ')[0];
        
        if (requiredCommands.includes(commandBase)) {
            this.addToOutput(`<div class="success-output">✅ Command '${commandBase}' is valid for ${scenario.name}!</div>`);
            this.score += 10;
        } else {
            this.addToOutput(`<div class="warning-output">⚠️ Command '${commandBase}' not recommended for current scenario.</div>`);
            this.addToOutput(`<div class="info-output">💡 Try: ${requiredCommands.join(', ')}</div>`);
        }
        
        this.updateProgress();
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.terminalInput.value = '';
            return;
        }

        this.terminalInput.value = this.commandHistory[this.historyIndex] || '';
    }

    intelligentComplete() {
        const input = this.terminalInput.value;
        const cursorPos = this.terminalInput.selectionStart;
        const beforeCursor = input.substring(0, cursorPos);
        const parts = beforeCursor.split(' ');
        const currentWord = parts[parts.length - 1];
        
        // All available commands including aliases
        const allCommands = [
            'ls', 'cd', 'pwd', 'cat', 'mkdir', 'rm', 'clear', 'help', 'nmap', 'ping', 'curl', 'sqlmap', 'dirb', 'nikto', 'grep', 'find', 'netstat', 'ps', 'top', 'msfconsole', 'burpsuite', 'tcpdump', 'tshark', 'masscan', 'searchsploit', 'base64', 'strings', 'xxd', 'ffuf', 'gobuster', 'exploit', 'nc', 'script', 'validate', 'alias', 'record', 'playback'
        ];
        
        // Add aliases to completion
        const aliasCommands = Object.keys(this.aliases);
        const commands = [...allCommands, ...aliasCommands];
        
        const matches = commands.filter(cmd => cmd.startsWith(currentWord));
        
        if (matches.length === 1) {
            // Single match - auto complete
            const completion = matches[0];
            const newValue = beforeCursor.substring(0, beforeCursor.length - currentWord.length) + completion + input.substring(cursorPos);
            this.terminalInput.value = newValue;
            this.terminalInput.setSelectionRange(cursorPos - currentWord.length + completion.length, cursorPos - currentWord.length + completion.length);
        } else if (matches.length > 1) {
            // Multiple matches - show suggestions
            this.showCompletionSuggestions(matches, currentWord);
        }
    }
    
    showCompletionSuggestions(matches, partial) {
        this.addToOutput(`<div class="info-output">Suggestions: ${matches.join(', ')}</div>`);
    }
    
    autoCorrect(command) {
        const parts = command.split(' ');
        const cmd = parts[0];
        
        if (this.typoCorrections[cmd]) {
            parts[0] = this.typoCorrections[cmd];
            return parts.join(' ');
        }
        
        return command;
    }
    
    processAliases(command) {
        const parts = command.split(' ');
        const cmd = parts[0];
        
        if (this.aliases[cmd]) {
            const aliasCommand = this.aliases[cmd];
            const args = parts.slice(1);
            return aliasCommand + (args.length > 0 ? ' ' + args.join(' ') : '');
        }
        
        return command;
    }

    addToOutput(html) {
        try {
            if (this.terminalOutput) {
                this.terminalOutput.innerHTML += html;
                this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
            } else {
                console.error('Terminal output element not found');
            }
        } catch (error) {
            console.error('Error adding output:', error);
        }
    }

    clearTerminal() {
        this.terminalOutput.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-text">
                    <span class="text-green">Terminal Cleared</span><br>
                    <span class="text-cyan">Type 'help' for available commands</span><br>
                </div>
            </div>`;
    }

    resetLab() {
        this.commandCount = 0;
        this.progress = 0;
        this.score = 0;
        this.currentDir = '/home/kali/practice-lab';
        this.commandHistory = [];
        this.historyIndex = -1;
        
        document.getElementById('commandCount').textContent = '0';
        document.getElementById('progressPercent').textContent = '0%';
        document.getElementById('currentScore').textContent = '0/100';
        document.getElementById('progressFill').style.width = '0%';
        
        this.clearTerminal();
        this.terminalInput.focus();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                // Show orientation hint on mobile
                if (window.innerWidth < 1024) {
                    this.showOrientationHint();
                }
                // Lock to landscape if supported
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(() => {});
                }
            });
        } else {
            document.exitFullscreen().then(() => {
                // Unlock orientation
                if (screen.orientation && screen.orientation.unlock) {
                    screen.orientation.unlock();
                }
            });
        }
    }

    showOrientationHint() {
        const hint = document.getElementById('orientationHint');
        if (window.innerWidth < window.innerHeight) {
            hint.classList.add('show');
            setTimeout(() => {
                hint.classList.remove('show');
            }, 4000);
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.lab-sidebar');
        const toggleBtn = document.getElementById('toggleSidebar');
        const icon = toggleBtn.querySelector('i');
        
        sidebar.classList.toggle('collapsed');
        
        if (sidebar.classList.contains('collapsed')) {
            icon.className = 'fas fa-chevron-right';
        } else {
            icon.className = 'fas fa-bars';
        }
    }

    switchScenario(scenarioId) {
        this.currentScenario = scenarioId;
        const scenario = this.scenarios[scenarioId];
        
        // Clear any existing timer
        if (this.challengeTimer) {
            clearTimeout(this.challengeTimer);
            this.challengeTimer = null;
        }
        
        // Update active scenario
        document.querySelectorAll('.scenario-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-scenario="${scenarioId}"]`).classList.add('active');
        
        // Update lab info
        const labDescription = document.getElementById('labDescription');
        labDescription.innerHTML = `
            <h4>${scenario.name}</h4>
            <p>${scenario.description}</p>
            <div class="lab-objectives">
                <strong>Objectives:</strong>
                <ul>
                    ${scenario.objectives.map(obj => `<li>${obj}</li>`).join('')}
                </ul>
            </div>
        `;
        
        // Update hints
        const hintsList = document.getElementById('hintsList');
        hintsList.innerHTML = scenario.hints.map(hint => 
            `<div class="hint-item">${hint}</div>`
        ).join('');
        
        this.resetLab();
        
        // Update display elements
        const flagsCounter = document.getElementById('flagsCounter');
        const timerDisplay = document.getElementById('timerDisplay');
        
        if (flagsCounter) flagsCounter.style.display = scenarioId === 'ctf' ? 'flex' : 'none';
        if (timerDisplay) timerDisplay.style.display = scenarioId === 'speed' ? 'flex' : 'none';
        
        // Start special scenarios
        if (scenarioId === 'speed') {
            setTimeout(() => this.simulateSpeedChallenge(), 2000);
        } else if (scenarioId === 'ctf') {
            this.addToOutput(`<div class="info-output">🚩 CTF Mode: Find hidden flags in command outputs!</div>`);
            this.addToOutput(`<div class="info-output">💯 Flags found: ${this.foundFlags.size}/5</div>`);
            const flagsElement = document.getElementById('flagsFound');
            if (flagsElement) flagsElement.textContent = `${this.foundFlags.size}/5`;
        }
    }

    updateProgress() {
        const scenario = this.scenarios[this.currentScenario];
        const completedCommands = scenario.requiredCommands.filter(cmd => 
            this.commandHistory.some(histCmd => histCmd.startsWith(cmd))
        );
        
        this.progress = (completedCommands.length / scenario.requiredCommands.length) * 100;
        this.score = Math.min(100, this.commandCount * 5 + this.progress);
        
        document.getElementById('progressPercent').textContent = `${Math.round(this.progress)}%`;
        document.getElementById('currentScore').textContent = `${Math.round(this.score)}/100`;
        document.getElementById('progressFill').style.width = `${this.progress}%`;
    }

    getDirectory(path) {
        return this.fileSystem[path];
    }

    getFile(path) {
        const parts = path.split('/');
        const filename = parts.pop();
        const dirPath = parts.join('/');
        const dir = this.getDirectory(dirPath);
        
        return dir && dir.contents[filename];
    }

    startChallenge(timeLimit = 300) {
        this.startTime = Date.now();
        this.timeLimit = timeLimit;
        this.updateTimer();
        this.addToOutput(`<div class="info-output">🏁 Challenge started! Time limit: ${timeLimit} seconds</div>`);
    }

    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const remaining = Math.max(0, this.timeLimit - elapsed);
        
        const timerElement = document.getElementById('timeRemaining');
        if (timerElement) {
            timerElement.textContent = `${remaining}s`;
        }
        
        if (remaining > 0) {
            this.challengeTimer = setTimeout(() => this.updateTimer(), 1000);
        } else {
            this.addToOutput(`<div class="error-output">⏰ Time's up! Challenge failed.</div>`);
        }
    }

    checkForFlags(output) {
        Object.keys(this.flags).forEach(flag => {
            if (output.includes(flag) && !this.foundFlags.has(flag)) {
                this.foundFlags.add(flag);
                this.score += 50;
                this.addToOutput(`<div class="success-output">🚩 FLAG FOUND: ${flag} (+50 points!)</div>`);
                
                const flagsElement = document.getElementById('flagsFound');
                if (flagsElement) flagsElement.textContent = `${this.foundFlags.size}/5`;
                
                this.updateProgress();
            }
        });
    }

    simulateSpeedChallenge() {
        const challenges = [
            'Find all open ports on 192.168.1.1 in under 30 seconds',
            'Decode this base64: SGVsbG8gV29ybGQ= in under 15 seconds',
            'Find the flag in /logs/access.log in under 45 seconds',
            'Exploit the vulnerable service in under 60 seconds'
        ];
        
        const challenge = challenges[Math.floor(Math.random() * challenges.length)];
        this.addToOutput(`<div class="warning-output">⚡ SPEED CHALLENGE: ${challenge}</div>`);
        
        const timeLimit = parseInt(challenge.match(/(\d+) seconds/)[1]);
        this.startChallenge(timeLimit);
    }
    
    toggleRecording() {
        this.isRecording = !this.isRecording;
        if (this.isRecording) {
            this.sessionRecording = [];
            this.addToOutput(`<div class="success-output">🔴 Session recording started</div>`);
        } else {
            this.addToOutput(`<div class="info-output">⏹️ Session recording stopped. ${this.sessionRecording.length} commands recorded</div>`);
        }
    }
    
    playbackSession() {
        if (this.sessionRecording.length === 0) {
            this.addToOutput(`<div class="warning-output">No recorded session found. Use 'record' to start recording.</div>`);
            return;
        }
        
        this.addToOutput(`<div class="info-output">🎥 Playing back ${this.sessionRecording.length} commands...</div>`);
        
        let index = 0;
        const playNext = () => {
            if (index < this.sessionRecording.length) {
                const entry = this.sessionRecording[index];
                this.addToOutput(`<div class="command-line"><span class="terminal-prompt"><span class="user-host">kali@neuro-dev</span>:<span class="current-dir">${entry.directory}</span>$ </span>${entry.command}</div>`);
                this.processCommand(entry.command);
                index++;
                setTimeout(playNext, 1000); // 1 second delay between commands
            } else {
                this.addToOutput(`<div class="success-output">✅ Playback completed!</div>`);
            }
        };
        
        setTimeout(playNext, 500);
    }
    
    manageAlias(args) {
        if (args.length === 0) {
            // Show all aliases
            this.addToOutput(`<div class="success-output">Current aliases:</div>`);
            Object.keys(this.aliases).forEach(alias => {
                this.addToOutput(`<div class="info-output">${alias} = '${this.aliases[alias]}'</div>`);
            });
        } else if (args.length === 1) {
            // Show specific alias
            const alias = args[0];
            if (this.aliases[alias]) {
                this.addToOutput(`<div class="info-output">${alias} = '${this.aliases[alias]}'</div>`);
            } else {
                this.addToOutput(`<div class="warning-output">Alias '${alias}' not found</div>`);
            }
        } else {
            // Create new alias
            const alias = args[0];
            const command = args.slice(1).join(' ');
            this.aliases[alias] = command;
            this.addToOutput(`<div class="success-output">Alias created: ${alias} = '${command}'</div>`);
            
            // Save to localStorage
            localStorage.setItem('terminal_aliases', JSON.stringify(this.aliases));
        }
    }
    
    showHistory() {
        this.addToOutput(`<div class="success-output">Command History:</div>`);
        this.commandHistory.forEach((cmd, index) => {
            this.addToOutput(`<div class="info-output">${index + 1}: ${cmd}</div>`);
        });
    }
    
    loadAliases() {
        const saved = localStorage.getItem('terminal_aliases');
        if (saved) {
            try {
                const savedAliases = JSON.parse(saved);
                this.aliases = { ...this.aliases, ...savedAliases };
            } catch (e) {
                console.error('Error loading aliases:', e);
            }
        }
    }
    
    showAliasManager() {
        this.addToOutput(`<div class="success-output">🔧 Alias Manager</div>`);
        this.addToOutput(`<div class="info-output">Commands:</div>`);
        this.addToOutput(`<div class="info-output">  alias                    - Show all aliases</div>`);
        this.addToOutput(`<div class="info-output">  alias [name]             - Show specific alias</div>`);
        this.addToOutput(`<div class="info-output">  alias [name] [command]   - Create new alias</div>`);
        this.addToOutput(`<div class="info-output"></div>`);
        this.addToOutput(`<div class="info-output">Current aliases:</div>`);
        Object.keys(this.aliases).forEach(alias => {
            this.addToOutput(`<div class="info-output">  ${alias} → ${this.aliases[alias]}</div>`);
        });
    }
    
    processEnvironmentVars(command) {
        let processed = command;
        Object.keys(this.environmentVars).forEach(varName => {
            const regex = new RegExp(`\\$${varName}`, 'g');
            processed = processed.replace(regex, this.environmentVars[varName]);
        });
        return processed;
    }
    
    processPipeCommand(command) {
        const parts = command.split('|').map(part => part.trim());
        let output = '';
        
        // Simulate first command
        const firstCmd = parts[0].split(' ');
        if (firstCmd[0] === 'ps') {
            output = '  PID TTY          TIME CMD\n 1234 pts/0    00:00:01 bash\n 5678 pts/0    00:00:00 apache2\n 9012 pts/0    00:00:00 mysql';
        } else if (firstCmd[0] === 'ls') {
            output = 'file1.txt\nfile2.log\nscript.sh\ndata.csv';
        }
        
        // Process pipe operations
        for (let i = 1; i < parts.length; i++) {
            const pipeCmd = parts[i].split(' ');
            if (pipeCmd[0] === 'grep') {
                const pattern = pipeCmd[1];
                output = output.split('\n').filter(line => line.includes(pattern)).join('\n');
            } else if (pipeCmd[0] === 'wc') {
                const lines = output.split('\n').length;
                output = `${lines} lines`;
            }
        }
        
        this.addToOutput(`<div class="success-output">${output}</div>`);
    }
    
    processBackgroundJob(command) {
        const jobId = this.jobCounter++;
        this.backgroundJobs.push({ id: jobId, command: command, status: 'running' });
        this.addToOutput(`<div class="info-output">[${jobId}] ${command} &</div>`);
        
        // Simulate job completion after 3 seconds
        setTimeout(() => {
            const job = this.backgroundJobs.find(j => j.id === jobId);
            if (job) {
                job.status = 'done';
                this.addToOutput(`<div class="success-output">[${jobId}]+ Done    ${command}</div>`);
            }
        }, 3000);
    }
    
    exportVariable(args) {
        if (args.length === 0) {
            Object.keys(this.environmentVars).forEach(key => {
                this.addToOutput(`<div class="info-output">${key}=${this.environmentVars[key]}</div>`);
            });
        } else {
            const assignment = args.join(' ');
            const [key, value] = assignment.split('=');
            if (key && value) {
                this.environmentVars[key] = value;
                this.addToOutput(`<div class="success-output">Exported: ${key}=${value}</div>`);
            }
        }
    }
    
    showEnvironment() {
        Object.keys(this.environmentVars).forEach(key => {
            this.addToOutput(`<div class="info-output">${key}=${this.environmentVars[key]}</div>`);
        });
    }
    
    changePermissions(args) {
        const mode = args[0];
        const file = args[1];
        if (mode && file) {
            this.addToOutput(`<div class="success-output">Changed permissions of '${file}' to ${mode}</div>`);
        } else {
            this.addToOutput(`<div class="error-output">chmod: missing operand</div>`);
        }
    }
    
    changeOwnership(args) {
        const owner = args[0];
        const file = args[1];
        if (owner && file) {
            this.addToOutput(`<div class="success-output">Changed ownership of '${file}' to ${owner}</div>`);
        } else {
            this.addToOutput(`<div class="error-output">chown: missing operand</div>`);
        }
    }
    
    simulateTar(args) {
        if (args.includes('-czf')) {
            const archive = args[args.indexOf('-czf') + 1];
            this.addToOutput(`<div class="success-output">Created compressed archive: ${archive}</div>`);
        } else if (args.includes('-xzf')) {
            const archive = args[args.indexOf('-xzf') + 1];
            this.addToOutput(`<div class="success-output">Extracted archive: ${archive}</div>`);
        } else {
            this.addToOutput(`<div class="info-output">tar: specify operation mode</div>`);
        }
    }
    
    simulateDiff(args) {
        const file1 = args[0] || 'file1.txt';
        const file2 = args[1] || 'file2.txt';
        this.addToOutput(`<div class="success-output">--- ${file1}\n+++ ${file2}\n@@ -1,3 +1,3 @@\n line1\n-old line\n+new line\n line3</div>`);
    }
    
    simulateAwk(args) {
        const pattern = args.join(' ');
        this.addToOutput(`<div class="success-output">Processing with awk: ${pattern}\nfield1\nfield2\nfield3</div>`);
    }
    
    simulateSed(args) {
        const pattern = args.join(' ');
        this.addToOutput(`<div class="success-output">Processing with sed: ${pattern}\nmodified line 1\nmodified line 2</div>`);
    }
    
    simulateSort(args) {
        this.addToOutput(`<div class="success-output">apple\nbanana\ncherry\ndate</div>`);
    }
    
    simulateUniq(args) {
        this.addToOutput(`<div class="success-output">      2 apple\n      1 banana\n      3 cherry</div>`);
    }
    
    simulateCut(args) {
        this.addToOutput(`<div class="success-output">field1\nfield2\nfield3</div>`);
    }
    
    simulateWc(args) {
        this.addToOutput(`<div class="success-output">     10     25    150 file.txt</div>`);
    }
    
    showJobs() {
        if (this.backgroundJobs.length === 0) {
            this.addToOutput(`<div class="info-output">No active jobs</div>`);
        } else {
            this.backgroundJobs.forEach(job => {
                this.addToOutput(`<div class="info-output">[${job.id}]  ${job.status}    ${job.command}</div>`);
            });
        }
    }
    
    showDiskUsage(args) {
        if (args.includes('-h')) {
            this.addToOutput(`<div class="success-output">Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        20G  8.5G   11G  45% /\n/dev/sda2       100G   45G   50G  48% /home</div>`);
        } else {
            this.addToOutput(`<div class="success-output">Filesystem     1K-blocks    Used Available Use% Mounted on\n/dev/sda1       20971520 8912896  11534336  45% /</div>`);
        }
    }
    
    showMemoryInfo() {
        this.addToOutput(`<div class="success-output">              total        used        free      shared  buff/cache   available\nMem:           8Gi       2.1Gi       4.2Gi       180Mi       1.7Gi       5.6Gi\nSwap:          2Gi          0B       2.0Gi</div>`);
    }
    
    showCpuInfo() {
        this.addToOutput(`<div class="success-output">Architecture:        x86_64\nCPU op-mode(s):      32-bit, 64-bit\nByte Order:          Little Endian\nCPU(s):              4\nModel name:          Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz</div>`);
    }
    
    calculateHash(args, type) {
        const file = args[0] || 'file.txt';
        const hash = type === 'md5' ? 'd41d8cd98f00b204e9800998ecf8427e' : 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
        this.addToOutput(`<div class="success-output">${hash}  ${file}</div>`);
    }
    
    simulateOpenssl(args) {
        if (args[0] === 'rand') {
            this.addToOutput(`<div class="success-output">aB3dE7fG9hJ2kL5mN8pQ1rS4tU6vW0xY</div>`);
        } else if (args[0] === 'x509') {
            this.addToOutput(`<div class="success-output">Certificate:\n    Data:\n        Version: 3 (0x2)\n        Serial Number: 12345\n        Issuer: CN=Example CA</div>`);
        }
    }
    
    simulateSsh(args) {
        const host = args[args.length - 1] || 'target.com';
        this.addToOutput(`<div class="success-output">Connecting to ${host}...\nThe authenticity of host '${host}' can't be established.\nECDSA key fingerprint is SHA256:abc123def456.\nAre you sure you want to continue connecting (yes/no)? yes\nkali@${host}:~$ </div>`);
    }
    
    simulateDig(args) {
        const domain = args[0] || 'example.com';
        this.addToOutput(`<div class="success-output">;; QUESTION SECTION:\n;${domain}.                IN      A\n\n;; ANSWER SECTION:\n${domain}.         300     IN      A       93.184.216.34\n\n;; Query time: 45 msec</div>`);
    }
    
    simulateNslookup(args) {
        const domain = args[0] || 'example.com';
        this.addToOutput(`<div class="success-output">Server:         8.8.8.8\nAddress:        8.8.8.8#53\n\nNon-authoritative answer:\nName:   ${domain}\nAddress: 93.184.216.34</div>`);
    }
    
    simulateHost(args) {
        const domain = args[0] || 'example.com';
        this.addToOutput(`<div class="success-output">${domain} has address 93.184.216.34\n${domain} mail is handled by 10 mail.${domain}.</div>`);
    }
}

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TerminalSimulator();
});