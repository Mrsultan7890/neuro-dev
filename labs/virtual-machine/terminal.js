// Terminal System
class Terminal {
    constructor() {
        this.currentPath = '/home/neuro';
        this.currentCourse = 'termux-basics';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.fileSystem = this.initFileSystem();
        this.courseTools = this.initCourseTools();
        this.loadSession(); // Load previous session
        this.setupTerminal();
    }

    initFileSystem() {
        const now = new Date();
        return {
            '/home': {
                'neuro': {
                    'Documents': { _meta: { type: 'dir', created: now, size: 4096 } },
                    'Downloads': { _meta: { type: 'dir', created: now, size: 4096 } },
                    'Desktop': { _meta: { type: 'dir', created: now, size: 4096 } },
                    'scripts': {
                        _meta: { type: 'dir', created: now, size: 4096 },
                        'hello.py': { content: 'print("Hello from Neuro-Dev!")', _meta: { type: 'file', created: now, size: 32 } },
                        'test.sh': { content: '#!/bin/bash\necho "Test script"', _meta: { type: 'file', created: now, size: 28, executable: true } },
                        'scanner.py': { content: '#!/usr/bin/env python3\nimport nmap\nnm = nmap.PortScanner()\nprint("Nmap scanner ready!")' , _meta: { type: 'file', created: now, size: 89 } }
                    },
                    'projects': {
                        _meta: { type: 'dir', created: now, size: 4096 },
                        'web-app': {
                            _meta: { type: 'dir', created: now, size: 4096 },
                            'index.html': { content: '<html><body><h1>Test Web App</h1></body></html>', _meta: { type: 'file', created: now, size: 45 } },
                            'app.py': { content: 'from flask import Flask\napp = Flask(__name__)\n@app.route("/")\ndef home():\n    return "Hello World!"', _meta: { type: 'file', created: now, size: 78 } }
                        }
                    },
                    '.bashrc': { content: 'alias ll="ls -la"\nalias c="clear"\nalias ..="cd .."', _meta: { type: 'file', created: now, size: 42, hidden: true } },
                    'notes.txt': { content: 'Neuro-Dev Course Notes\n=====================\n', _meta: { type: 'file', created: now, size: 45 } }
                }
            },
            '/usr': {
                'bin': {
                    _meta: { type: 'dir', created: now, size: 4096 },
                    'python3': { content: '[executable]', _meta: { type: 'file', created: now, size: 1024, executable: true } },
                    'nmap': { content: '[executable]', _meta: { type: 'file', created: now, size: 2048, executable: true } },
                    'metasploit': { content: '[executable]', _meta: { type: 'file', created: now, size: 4096, executable: true } },
                    'burpsuite': { content: '[executable]', _meta: { type: 'file', created: now, size: 8192, executable: true } },
                    'sqlmap': { content: '[executable]', _meta: { type: 'file', created: now, size: 1536, executable: true } }
                }
            },
            '/tmp': { _meta: { type: 'dir', created: now, size: 4096 } },
            '/var': {
                _meta: { type: 'dir', created: now, size: 4096 },
                'log': {
                    _meta: { type: 'dir', created: now, size: 4096 },
                    'system.log': { content: 'System started successfully', _meta: { type: 'file', created: now, size: 28 } }
                }
            }
        };
    }

    initCourseTools() {
        return {
            'termux-basics': {
                commands: ['pkg', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'nano', 'chmod', 'whoami'],
                environment: 'Android Termux',
                prompt: 'u0_a123@localhost'
            },
            'termux-advanced': {
                commands: ['python3', 'git', 'ssh', 'curl', 'wget', 'vim', 'tmux'],
                environment: 'Advanced Termux',
                prompt: 'u0_a123@localhost'
            },
            'nethunter-rootless': {
                commands: ['nmap', 'metasploit', 'aircrack-ng', 'john', 'hashcat'],
                environment: 'Kali NetHunter',
                prompt: 'kali@nethunter'
            },
            'nethunter-tools': {
                commands: ['nmap', 'metasploit', 'sqlmap', 'burpsuite', 'nikto', 'dirb'],
                environment: 'Kali Linux',
                prompt: 'kali@kali'
            },
            'networking': {
                commands: ['ping', 'traceroute', 'netstat', 'ss', 'iptables', 'tcpdump'],
                environment: 'Network Lab',
                prompt: 'netadmin@lab'
            },
            'web-security': {
                commands: ['burpsuite', 'sqlmap', 'nikto', 'gobuster', 'wpscan'],
                environment: 'Web Pentest Lab',
                prompt: 'pentester@weblab'
            },
            'python': {
                commands: ['python3', 'pip', 'jupyter', 'numpy', 'pandas', 'matplotlib'],
                environment: 'Python Dev',
                prompt: 'dev@python'
            },
            'hands-on-ml-scikit-learn': {
                commands: ['jupyter', 'sklearn-info', 'load-dataset', 'train-model', 'evaluate-model', 'python3'],
                environment: 'ML Theory Lab',
                prompt: 'ml-student@theory'
            },
            'python-ai-ml': {
                commands: ['jupyter', 'tensorflow', 'pytorch', 'create-model', 'train-neural-net', 'opencv', 'python3'],
                environment: 'AI/ML Coding Lab',
                prompt: 'ai-dev@coding'
            },
            'ai-hacking': {
                commands: ['target-neuro-dev', 'scan-ml-api', 'extract-model', 'adversarial-attack', 'privacy-attack', 'deepfool', 'nmap', 'ctf-api-exploit', 'ctf-model-extraction'],
                environment: 'AI Security Lab',
                prompt: 'hacker@ai-sec'
            }
        };
    }

    setupTerminal() {
        const input = document.getElementById('terminal-input');
        if (!input) return;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                if (command) {
                    this.executeCommand(command);
                    this.addToHistory(command);
                    this.historyIndex = -1;
                }
                input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    input.value = this.commandHistory[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    input.value = this.commandHistory[this.historyIndex];
                } else if (this.historyIndex === 0) {
                    this.historyIndex = -1;
                    input.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.handleTabCompletion(input);
            } else if (e.ctrlKey && e.key === 'c') {
                e.preventDefault();
                this.addLine('^C', 'output');
                input.value = '';
            } else if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                this.clear();
            }
        });

        this.updatePrompt();
        this.showWelcome();
    }

    executeCommand(command) {
        try {
            // Validate and sanitize command
            if (!command || typeof command !== 'string') {
                this.addLine('Invalid command', 'error');
                return;
            }
            
            // Expand aliases first
            command = this.expandAlias(command.trim());
            
            this.addLine(`${this.getPrompt()}$ ${command}`, 'command');
            
            const parts = command.split(' ').filter(part => part.length > 0);
            if (parts.length === 0) {
                return;
            }
            
            const cmd = parts[0];
            const args = parts.slice(1);
            
            // Track command usage for progress
            try {
                if (window.progressTracker && typeof window.progressTracker.trackProgress === 'function') {
                    window.progressTracker.trackProgress(cmd, 'command-used');
                }
            } catch (error) {
                console.warn('Progress tracking error:', error);
            }
            
            // Update command statistics
            this.updateCommandStats(cmd);

        // Enhanced course-specific command handling
        const currentCourseTools = this.courseTools[this.currentCourse];
        if (currentCourseTools && currentCourseTools.commands && !currentCourseTools.commands.includes(cmd) && !this.isBasicCommand(cmd)) {
            // Check if it's a valid command for any course
            const allCommands = Object.values(this.courseTools).flatMap(tool => tool.commands || []);
            if (allCommands.includes(cmd)) {
                this.addLine(`${cmd}: command not available in ${currentCourseTools.environment}`, 'error');
                this.addLine(`💡 Hint: Switch to the appropriate course to use this command`, 'output');
                this.addLine(`Available commands: ${currentCourseTools.commands.join(', ')}`, 'output');
                return;
            }
        }

        switch(cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'clear':
                this.clear();
                break;
            case 'pwd':
                this.addLine(this.currentPath, 'output');
                break;
            case 'ls':
                this.handleLs(args);
                break;
            case 'cd':
                this.handleCd(args);
                break;
            case 'mkdir':
                this.handleMkdir(args);
                break;
            case 'touch':
                this.handleTouch(args);
                break;
            case 'cat':
                this.handleCat(args);
                break;
            case 'nano':
                this.handleNano(args);
                break;
            case 'pkg':
                this.handlePkg(args);
                break;
            case 'python3':
            case 'python':
                this.handlePython(args);
                break;
            case 'nmap':
                this.handleNmap(args);
                break;
            case 'metasploit':
                this.handleMetasploit(args);
                break;
            case 'burpsuite':
                this.handleBurpSuite(args);
                break;
            case 'sqlmap':
                this.handleSqlmap(args);
                break;
            case 'whoami':
                this.addLine(this.getPrompt().split('@')[0], 'output');
                break;
            case 'date':
                this.addLine(new Date().toString(), 'output');
                break;
            case 'course':
                this.handleCourse(args);
                break;
            case 'rm':
                this.handleRm(args);
                break;
            case 'cp':
                this.handleCp(args);
                break;
            case 'mv':
                this.handleMv(args);
                break;
            case 'ps':
                this.handlePs(args);
                break;
            case 'netstat':
                this.handleNetstat(args);
                break;
            case 'ss':
                this.handleSs(args);
                break;
            case 'ping':
                this.handlePing(args);
                break;
            case 'grep':
                this.handleGrep(args);
                break;
            case 'wget':
                this.handleWget(args);
                break;
            case 'git':
                this.handleGit(args);
                break;
            case 'aircrack-ng':
                this.handleAircrack(args);
                break;
            case 'hydra':
                this.handleHydra(args);
                break;
            case 'nikto':
                this.handleNikto(args);
                break;
            case 'dirb':
                this.handleDirb(args);
                break;
            
            // AI/ML Theory Commands
            case 'sklearn-info':
                this.handleSklearnInfo(args);
                break;
            case 'load-dataset':
                this.handleLoadDataset(args);
                break;
            case 'train-model':
                this.handleTrainModel(args);
                break;
            case 'evaluate-model':
                this.handleEvaluateModel(args);
                break;
            
            // AI/ML Coding Commands
            case 'tensorflow':
                this.handleTensorflow(args);
                break;
            case 'pytorch':
                this.handlePytorch(args);
                break;
            case 'create-model':
                this.handleCreateModel(args);
                break;
            case 'train-neural-net':
                this.handleTrainNeuralNet(args);
                break;
            case 'opencv':
                this.handleOpencv(args);
                break;
            
            // AI Hacking Commands
            case 'target-neuro-dev':
                this.handleTargetNeuroDev(args);
                break;
            case 'scan-ml-api':
                this.handleScanMlApi(args);
                break;
            case 'extract-model':
                this.handleExtractModel(args);
                break;
            case 'adversarial-attack':
                this.handleAdversarialAttack(args);
                break;
            case 'privacy-attack':
                this.handlePrivacyAttack(args);
                break;
            case 'deepfool':
                this.handleDeepfool(args);
                break;
            
            // CTF Challenge Commands
            case 'ctf-api-exploit':
                this.handleCtfApiExploit(args);
                break;
            case 'ctf-model-extraction':
                this.handleCtfModelExtraction(args);
                break;
            case 'ctf-hidden-login':
                this.handleCtfHiddenLogin(args);
                break;
            case 'ctf-file-discovery':
                this.handleCtfFileDiscovery(args);
                break;
            case 'poison-model':
                this.handlePoisonModel(args);
                break;
            case 'analyze-apk':
                this.handleAnalyzeApk(args);
                break;
            case 'quantum-decrypt':
                this.handleQuantumDecrypt(args);
                break;
            case 'scan-5g':
                this.handleScan5g(args);
                break;
            case 'satellite-scan':
                this.handleSatelliteScan(args);
                break;
            case 'detect-deepfake':
                this.handleDetectDeepfake(args);
                break;
            case 'bank-scan':
                this.handleBankScan(args);
                break;
            case 'exploit-bank':
                this.handleExploitBank(args);
                break;
            case 'bank-forensics':
                this.handleBankForensics(args);
                break;
            case 'flag':
                this.handleFlag(args);
                break;
            case 'submit-flag':
                this.handleSubmitFlag(args);
                break;
            case 'vim':
                this.handleVim(args);
                break;
            case 'find':
                this.handleFind(args);
                break;
            case 'chmod':
                this.handleChmod(args);
                break;
            case 'chown':
                this.handleChown(args);
                break;
            case 'tar':
                this.handleTar(args);
                break;
            case 'zip':
                this.handleZip(args);
                break;
            case 'unzip':
                this.handleUnzip(args);
                break;
            case 'history':
                this.handleHistory(args);
                break;
            case 'alias':
                this.handleAlias(args);
                break;
            case 'env':
                this.handleEnv(args);
                break;
            case 'export':
                this.handleExport(args);
                break;
            case 'which':
                this.handleWhich(args);
                break;
            case 'man':
                this.handleMan(args);
                break;
            case 'top':
                this.handleTop(args);
                break;
            case 'kill':
                this.handleKill(args);
                break;
            case 'killall':
                this.handleKillall(args);
                break;
            case 'df':
                this.handleDf(args);
                break;
            case 'du':
                this.handleDu(args);
                break;
            case 'free':
                this.handleFree(args);
                break;
            case 'uptime':
                this.handleUptime(args);
                break;
            case 'uname':
                this.handleUname(args);
                break;
            
            default:
                // Enhanced command suggestions
                const suggestions = this.getSuggestions(cmd);
                this.addLine(`${cmd}: command not found`, 'error');
                if (suggestions.length > 0) {
                    this.addLine(`💡 Did you mean: ${suggestions.join(', ')}?`, 'output');
                }
                this.addLine('Type "help" to see available commands', 'output');
        }
        } catch (error) {
            console.error('Error executing command:', error);
            this.addLine('Command execution failed', 'error');
        }
    }

    isBasicCommand(cmd) {
        return ['help', 'clear', 'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'whoami', 'date', 'course', 'rm', 'cp', 'mv', 'ps', 'grep', 'wget', 'git', 'netstat', 'ss', 'ping', 'vim', 'find', 'chmod', 'chown', 'tar', 'zip', 'unzip', 'history', 'alias', 'env', 'export', 'which', 'man', 'top', 'kill', 'killall', 'df', 'du', 'free', 'uptime', 'uname'].includes(cmd);
    }

    handleLs(args) {
        const currentDir = this.getCurrentDirectory();
        if (!currentDir) {
            this.addLine('Directory not found', 'error');
            return;
        }

        const options = this.parseLsOptions(args);
        const items = this.getDirectoryItems(currentDir, options);
        this.displayItems(items, options.detailed);
    }
    
    parseLsOptions(args) {
        return {
            detailed: args.includes('-l') || args.includes('-la'),
            showHidden: args.includes('-a') || args.includes('-la')
        };
    }
    
    getDirectoryItems(currentDir, options) {
        const items = [];
        
        for (const [name, content] of Object.entries(currentDir)) {
            if (name === '_meta') continue;
            if (!options.showHidden && name.startsWith('.')) continue;
            
            const meta = content._meta || { type: 'file', created: new Date(), size: 1024 };
            const isDir = meta.type === 'dir';
            
            if (options.detailed) {
                items.push(this.formatDetailedItem(name, meta, isDir));
            } else {
                items.push(name + (isDir ? '/' : ''));
            }
        }
        
        return items;
    }
    
    formatDetailedItem(name, meta, isDir) {
        const permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
        const size = (meta.size || 1024).toString().padStart(8);
        const date = (meta.created || new Date()).toLocaleDateString('en-US', { 
            month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' 
        }).replace(',', '');
        
        return `${permissions} 1 neuro neuro ${size} ${date} ${name}${isDir ? '/' : ''}`;
    }
    
    displayItems(items, detailed) {
        if (items.length === 0) {
            this.addLine('Directory is empty', 'output');
        } else if (detailed) {
            items.forEach(item => this.addLine(item, 'output'));
        } else {
            this.addLine(items.join('  '), 'output');
        }
    }

    handleCd(args) {
        if (args.length === 0 || args[0] === '~') {
            this.currentPath = '/home/neuro';
        } else if (args[0] === '..') {
            const parts = this.currentPath.split('/').filter(p => p);
            if (parts.length > 2) {
                parts.pop();
                this.currentPath = '/' + parts.join('/');
            }
        } else {
            const newPath = args[0].startsWith('/') ? args[0] : `${this.currentPath}/${args[0]}`;
            if (this.pathExists(newPath)) {
                this.currentPath = newPath;
            } else {
                this.addLine(`cd: ${args[0]}: No such file or directory`, 'error');
                return;
            }
        }
        this.updatePrompt();
    }

    handlePkg(args) {
        if (this.currentCourse !== 'termux-basics' && this.currentCourse !== 'termux-advanced') {
            this.addLine('pkg: command not available in this environment', 'error');
            return;
        }

        if (args.length === 0) {
            this.addLine('Usage: pkg [update|upgrade|install|list-installed] [package]', 'output');
            return;
        }

        switch(args[0]) {
            case 'update':
                this.addLine('Updating package lists...', 'output');
                setTimeout(() => this.addLine('Package lists updated successfully', 'success'), 1000);
                break;
            case 'upgrade':
                this.addLine('Upgrading packages...', 'output');
                setTimeout(() => this.addLine('All packages are up to date', 'success'), 1500);
                break;
            case 'install':
                if (args.length < 2) {
                    this.addLine('pkg install: missing package name', 'error');
                    return;
                }
                this.addLine(`Installing ${args[1]}...`, 'output');
                setTimeout(() => this.addLine(`${args[1]} installed successfully`, 'success'), 2000);
                break;
            case 'list-installed':
                this.addLine('Installed packages:\n  python\n  git\n  curl\n  wget\n  nano', 'output');
                break;
            default:
                this.addLine(`pkg: unknown command '${args[0]}'`, 'error');
        }
    }

    handleNmap(args) {
        if (!this.courseTools[this.currentCourse] || !this.courseTools[this.currentCourse].commands.includes('nmap')) {
            this.addLine('nmap: command not available in this course', 'error');
            return;
        }

        if (args.length === 0) {
            this.addLine('Nmap 7.94 ( https://nmap.org )', 'output');
            this.addLine('Usage: nmap [Scan Type(s)] [Options] {target specification}', 'output');
            this.addLine('TARGET SPECIFICATION:', 'output');
            this.addLine('  Can pass hostnames, IP addresses, networks, etc.', 'output');
            return;
        }

        const target = args[args.length - 1];
        const scanType = args.includes('-sS') ? 'SYN Stealth' : args.includes('-sT') ? 'TCP Connect' : 'SYN Stealth';
        const verbose = args.includes('-v');
        
        this.showLoading(`Scanning ${target}`, 1500);
        this.addLine(`Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleString()}`, 'output');
        this.addLine(`Initiating ${scanType} Scan at ${new Date().toLocaleTimeString()}`, 'output');
        this.addLine(`Scanning ${target} [1000 ports]`, 'output');
        
        if (verbose) {
            setTimeout(() => this.addLine('Discovered open port 22/tcp on ' + target, 'output'), 500);
            setTimeout(() => this.addLine('Discovered open port 80/tcp on ' + target, 'output'), 800);
            setTimeout(() => this.addLine('Discovered open port 443/tcp on ' + target, 'output'), 1200);
        }
        
        setTimeout(() => {
            this.addLine(`Completed ${scanType} Scan at ${new Date().toLocaleTimeString()}, 3.45s elapsed (1000 total ports)`, 'output');
            this.addLine(`Nmap scan report for ${target}`, 'success');
            this.addLine('Host is up (0.012s latency).', 'output');
            this.addLine('Not shown: 997 closed ports', 'output');
            this.addLine('PORT    STATE SERVICE    VERSION', 'output');
            this.addLine('22/tcp  open  ssh        OpenSSH 8.9p1 Ubuntu 3ubuntu0.1', 'output');
            this.addLine('80/tcp  open  http       Apache httpd 2.4.52', 'output');
            this.addLine('443/tcp open  https      Apache httpd 2.4.52 ((Ubuntu))', 'output');
            this.addLine('', 'output');
            this.addLine('Service detection performed. Please report any incorrect results at https://nmap.org/submit/', 'output');
            this.addLine(`Nmap done: 1 IP address (1 host up) scanned in 3.45 seconds`, 'success');
        }, 2000);
    }

    handlePython(args) {
        if (args.length === 0) {
            this.addLine('Python 3.9.2 (default, Feb 28 2021, 17:03:44)', 'output');
            this.addLine('Type "help", "copyright", "credits" or "license" for more information.', 'output');
            this.addLine('>>> print("Hello from Neuro-Dev!")', 'output');
            this.addLine('Hello from Neuro-Dev!', 'success');
        } else if (args[0].endsWith('.py')) {
            const fileName = args[0];
            const currentDir = this.getCurrentDirectory();
            if (currentDir && currentDir[fileName]) {
                this.addLine(`Running ${fileName}...`, 'output');
                if (currentDir[fileName].includes('print')) {
                    const match = currentDir[fileName].match(/print\(["'](.+?)["']\)/);
                    if (match) {
                        this.addLine(match[1], 'success');
                    }
                }
            } else {
                this.addLine(`python: can't open file '${fileName}': No such file or directory`, 'error');
            }
        }
    }

    handleCourse(args) {
        if (args.length === 0) {
            this.addLine(`Current course: ${this.currentCourse}`, 'output');
            this.addLine('Available courses:', 'output');
            Object.keys(this.courseTools).forEach(course => {
                this.addLine(`  ${course} - ${this.courseTools[course].environment}`, 'output');
            });
        } else {
            const newCourse = args[0];
            if (this.courseTools[newCourse]) {
                this.setCourse(newCourse);
                this.addLine(`Switched to course: ${newCourse}`, 'success');
            } else {
                this.addLine(`Course '${newCourse}' not found`, 'error');
            }
        }
    }

    setCourse(courseName, config = null) {
        this.currentCourse = courseName;
        if (config) {
            this.courseTools[courseName] = config;
        }
        this.updatePrompt();
        this.addCourseSpecificFiles();
        this.loadCourseEnvironment(courseName);
        
        // Update course indicator in VM
        if (window.vm) {
            window.vm.currentCourse = courseName;
        }
        
        // Update browser content if open
        if (window.browser) {
            window.browser.loadCourseContent(courseName);
        }
        
        // Update file manager if open
        if (window.fileManager) {
            window.fileManager.refresh();
        }
    }

    loadCourseEnvironment(courseName) {
        const environments = {
            'termux-basics': {
                welcomeMsg: '📱 Termux Basic Environment Loaded',
                tips: ['Use pkg to manage packages', 'Try ls -la to see hidden files', 'nano is your text editor']
            },
            'ai-hacking': {
                welcomeMsg: '🎯 AI Security Lab Environment Loaded',
                tips: ['Target: neuro-dev.local is ready', 'Use target-neuro-dev to start', 'Try adversarial-attack for ML attacks']
            },
            'hands-on-ml-scikit-learn': {
                welcomeMsg: '🧠 ML Theory Environment Loaded',
                tips: ['Datasets available in ~/datasets/', 'Use sklearn-info for library info', 'Try load-dataset iris to start']
            },
            'python-ai-ml': {
                welcomeMsg: '🤖 AI/ML Coding Environment Loaded', 
                tips: ['TensorFlow & PyTorch ready', 'Projects in ~/ai-projects/', 'Use create-model to start building']
            }
        };
        
        const env = environments[courseName];
        if (env) {
            this.addLine('', 'output');
            this.addLine(env.welcomeMsg, 'success');
            env.tips.forEach(tip => {
                this.addLine(`• ${tip}`, 'output');
            });
            this.addLine('', 'output');
        }
    }

    addCourseSpecificFiles() {
        // Add AI/ML datasets for theory course
        if (this.currentCourse === 'hands-on-ml-scikit-learn') {
            if (!this.fileSystem['/home']['neuro']['datasets']) {
                this.fileSystem['/home']['neuro']['datasets'] = {
                    _meta: { type: 'dir', created: new Date(), size: 4096 },
                    'iris.csv': {
                        content: 'sepal_length,sepal_width,petal_length,petal_width,species\n5.1,3.5,1.4,0.2,setosa\n4.9,3.0,1.4,0.2,setosa\n4.7,3.2,1.3,0.2,setosa\n4.6,3.1,1.5,0.2,setosa\n5.0,3.6,1.4,0.2,setosa\n...(150 total samples)',
                        _meta: { type: 'file', created: new Date(), size: 2048 }
                    },
                    'housing.csv': {
                        content: 'longitude,latitude,housing_median_age,total_rooms,population,households,median_income,median_house_value\n-122.23,37.88,41.0,880.0,322.0,126.0,8.3252,452600.0\n-122.22,37.86,21.0,7099.0,1106.0,190.0,7.2574,358500.0\n...(20640 total samples)',
                        _meta: { type: 'file', created: new Date(), size: 4096 }
                    },
                    'mnist.pkl': {
                        content: '[Binary MNIST dataset - 60,000 training images, 10,000 test images]',
                        _meta: { type: 'file', created: new Date(), size: 52428800 }
                    }
                };
            }
        }
        
        // Add AI/ML projects for coding course
        if (this.currentCourse === 'python-ai-ml') {
            if (!this.fileSystem['/home']['neuro']['ai-projects']) {
                this.fileSystem['/home']['neuro']['ai-projects'] = {
                    _meta: { type: 'dir', created: new Date(), size: 4096 },
                    'image-classifier.py': {
                        content: '# Image Classification with TensorFlow\nimport tensorflow as tf\nfrom tensorflow import keras\nimport numpy as np\n\n# Load and preprocess data\n(x_train, y_train), (x_test, y_test) = keras.datasets.cifar10.load_data()\nx_train, x_test = x_train / 255.0, x_test / 255.0\n\n# Build CNN model\nmodel = keras.Sequential([\n    keras.layers.Conv2D(32, (3, 3), activation="relu", input_shape=(32, 32, 3)),\n    keras.layers.MaxPooling2D((2, 2)),\n    keras.layers.Conv2D(64, (3, 3), activation="relu"),\n    keras.layers.MaxPooling2D((2, 2)),\n    keras.layers.Conv2D(64, (3, 3), activation="relu"),\n    keras.layers.Flatten(),\n    keras.layers.Dense(64, activation="relu"),\n    keras.layers.Dense(10, activation="softmax")\n])\n\nmodel.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])\nprint("Image classifier ready for training!")',
                        _meta: { type: 'file', created: new Date(), size: 1024 }
                    },
                    'chatbot.py': {
                        content: '# AI Chatbot with Natural Language Processing\nimport tensorflow as tf\nfrom tensorflow import keras\nimport json\nimport numpy as np\n\n# Load training data\nwith open("intents.json") as file:\n    data = json.load(file)\n\n# Build neural network\nmodel = keras.Sequential([\n    keras.layers.Dense(128, input_shape=(len(training_x[0]),), activation="relu"),\n    keras.layers.Dropout(0.5),\n    keras.layers.Dense(64, activation="relu"),\n    keras.layers.Dropout(0.5),\n    keras.layers.Dense(len(training_y[0]), activation="softmax")\n])\n\nmodel.compile(loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"])\nprint("Chatbot model ready for training!")',
                        _meta: { type: 'file', created: new Date(), size: 768 }
                    }
                };
            }
        }
        
        // Add neuro-dev target files for AI hacking
        if (this.currentCourse === 'ai-hacking') {
            if (!this.fileSystem['/home']['neuro']['targets']) {
                this.fileSystem['/home']['neuro']['targets'] = {
                    _meta: { type: 'dir', created: new Date(), size: 4096 },
                    'neuro-dev-scan.txt': {
                        content: 'Neuro-Dev Infrastructure Scan Results\n\nML Services Found:\n- ml-api.neuro-dev:8080 (Model API)\n- ai-chat.neuro-dev:3000 (Chatbot Service)\n- face-recognition.neuro-dev:5000 (Face Recognition)\n- data-api.neuro-dev:8081 (Training Data API)\n\nVulnerabilities Detected:\n- Model extraction possible via /predict endpoint\n- Admin panel exposed at /admin (no auth)\n- Training data leakage in /model-info\n- Privacy attacks feasible (membership inference)\n- Adversarial examples bypass detection',
                        _meta: { type: 'file', created: new Date(), size: 512 }
                    },
                    'extracted-model.py': {
                        content: '# Extracted Model from neuro-dev.local\n# Model: Random Forest Classifier\n\nimport joblib\nimport numpy as np\n\nclass ExtractedModel:\n    def __init__(self):\n        self.n_estimators = 100\n        self.max_depth = 10\n        self.features = ["feature1", "feature2", "feature3", "feature4"]\n    \n    def predict(self, X):\n        # Cloned model behavior\n        return np.random.choice([0, 1], size=len(X))\n\n    def predict_proba(self, X):\n        # Probability predictions\n        probs = np.random.rand(len(X), 2)\n        return probs / probs.sum(axis=1, keepdims=True)\n\nprint("Model successfully extracted from neuro-dev!")',
                        _meta: { type: 'file', created: new Date(), size: 756 }
                    },
                    'adversarial-examples.py': {
                        content: '# Adversarial Examples Generator\n# Target: neuro-dev ML models\n\nimport numpy as np\nimport tensorflow as tf\n\ndef fgsm_attack(model, image, epsilon=0.03):\n    """Fast Gradient Sign Method"""\n    with tf.GradientTape() as tape:\n        tape.watch(image)\n        prediction = model(image)\n        loss = tf.keras.losses.categorical_crossentropy(target, prediction)\n    \n    gradient = tape.gradient(loss, image)\n    signed_grad = tf.sign(gradient)\n    adversarial_image = image + epsilon * signed_grad\n    \n    return tf.clip_by_value(adversarial_image, 0, 1)\n\nprint("Adversarial attack tools loaded!")',
                        _meta: { type: 'file', created: new Date(), size: 612 }
                    }
                };
            }
        }
    }

    showHelp() {
        const tools = this.courseTools[this.currentCourse] || { environment: 'Terminal', commands: [] };
        this.addLine(`=== ${tools.environment} Help ===`, 'success');
        this.addLine('Available commands:', 'output');
        
        // Basic commands always available
        const basicCommands = ['help', 'clear', 'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'nano', 'rm', 'cp', 'mv'];
        basicCommands.forEach(cmd => {
            this.addLine(`  ${cmd}`, 'output');
        });
        
        // Course specific commands
        if (tools.commands && tools.commands.length > 0) {
            this.addLine('\nCourse-specific commands:', 'output');
            tools.commands.forEach(cmd => {
                if (!basicCommands.includes(cmd)) {
                    this.addLine(`  ${cmd}`, 'output');
                }
            });
        }
        
        this.addLine('\nType "course" to switch between courses', 'output');
        
        // Show specific help for AI courses
        if (this.currentCourse === 'ai-hacking') {
            this.addLine('\n=== AI Security Testing ===', 'success');
            this.addLine('target-neuro-dev - Scan neuro-dev infrastructure', 'output');
            this.addLine('scan-ml-api <target> - Scan ML API endpoints', 'output');
            this.addLine('extract-model - Extract ML model from API', 'output');
            this.addLine('adversarial-attack - Generate adversarial examples', 'output');
            this.addLine('privacy-attack - Test membership inference', 'output');
            this.addLine('deepfool - Run DeepFool attack', 'output');
        } else if (this.currentCourse === 'hands-on-ml-scikit-learn') {
            this.addLine('\n=== ML Theory Commands ===', 'success');
            this.addLine('sklearn-info - Show scikit-learn information', 'output');
            this.addLine('load-dataset <name> - Load ML dataset', 'output');
            this.addLine('train-model <algorithm> - Train ML model', 'output');
            this.addLine('evaluate-model - Evaluate trained model', 'output');
        } else if (this.currentCourse === 'python-ai-ml') {
            this.addLine('\n=== AI/ML Coding Commands ===', 'success');
            this.addLine('tensorflow - Load TensorFlow framework', 'output');
            this.addLine('pytorch - Load PyTorch framework', 'output');
            this.addLine('create-model <type> - Create neural network', 'output');
            this.addLine('train-neural-net - Train neural network', 'output');
            this.addLine('opencv - Load OpenCV for computer vision', 'output');
        }
    }

    showWelcome() {
        const tools = this.courseTools[this.currentCourse] || { environment: 'Terminal' };
        this.addLine(`Welcome to ${tools.environment}!`, 'success');
        this.addLine(`Course: ${this.currentCourse}`, 'output');
        
        // Course-specific welcome messages
        if (this.currentCourse === 'ai-hacking') {
            this.addLine('🎯 Target: neuro-dev.local infrastructure', 'output');
            this.addLine('🚨 AI Security Testing Environment Active', 'error');
        } else if (this.currentCourse === 'hands-on-ml-scikit-learn') {
            this.addLine('📊 ML datasets available in ~/datasets/', 'output');
            this.addLine('🧠 Scikit-learn algorithms ready', 'success');
        } else if (this.currentCourse === 'python-ai-ml') {
            this.addLine('🤖 TensorFlow & PyTorch available', 'output');
            this.addLine('💻 AI projects in ~/ai-projects/', 'output');
        }
        
        this.addLine('Type "help" for available commands', 'output');
    }

    getCurrentDirectory() {
        const parts = this.currentPath.split('/').filter(p => p);
        let current = this.fileSystem;
        
        for (const part of parts) {
            if (current[part]) {
                current = current[part];
            } else {
                return null;
            }
        }
        return current;
    }

    getFileContent(fileName) {
        const currentDir = this.getCurrentDirectory();
        if (currentDir && currentDir[fileName]) {
            return currentDir[fileName].content || currentDir[fileName];
        }
        return null;
    }

    setFileContent(fileName, content) {
        const currentDir = this.getCurrentDirectory();
        if (currentDir) {
            if (typeof currentDir[fileName] === 'object' && currentDir[fileName]._meta) {
                currentDir[fileName].content = content;
                currentDir[fileName]._meta.size = content.length;
            } else {
                currentDir[fileName] = {
                    content: content,
                    _meta: { type: 'file', created: new Date(), size: content.length }
                };
            }
        }
    }

    pathExists(path) {
        const parts = path.split('/').filter(p => p);
        let current = this.fileSystem;
        
        for (const part of parts) {
            if (current[part]) {
                current = current[part];
            } else {
                return false;
            }
        }
        return true;
    }

    getPrompt() {
        const tools = this.courseTools[this.currentCourse] || { prompt: 'neuro@dev' };
        const shortPath = this.currentPath.replace('/home/neuro', '~');
        return `${tools.prompt}:${shortPath}`;
    }

    updatePrompt() {
        const promptElements = document.querySelectorAll('.prompt, .input-prompt');
        const newPrompt = this.getPrompt() + '$';
        promptElements.forEach(el => {
            if (el.textContent.includes('$')) {
                el.textContent = newPrompt;
            }
        });
        
        // Update terminal path in header
        const pathElement = document.getElementById('terminal-path');
        if (pathElement) {
            pathElement.textContent = this.currentPath.replace('/home/neuro', '~');
        }
    }

    addLine(text, type = 'output') {
        try {
            const output = document.getElementById('terminal-output');
            if (!output) {
                console.warn('Terminal output element not found');
                return;
            }

            const line = document.createElement('div');
            line.className = `terminal-line ${type}`;
            // Sanitize text to prevent XSS
            line.textContent = this.sanitizeInput(String(text || ''));
            
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
        } catch (error) {
            console.error('Error adding terminal line:', error);
        }
    }
    
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return String(input || '');
        }
        return input.replace(/[<>"'&]/g, function(match) {
            const escapeMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return escapeMap[match];
        }).substring(0, 1000); // Limit length
    }

    clear() {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.innerHTML = '';
            this.showWelcome();
        }
    }

    // File operations
    handleMkdir(args) {
        if (args.length === 0) {
            this.addLine('mkdir: missing operand', 'error');
            return;
        }
        const currentDir = this.getCurrentDirectory();
        if (currentDir) {
            const dirName = args[0];
            if (currentDir[dirName]) {
                this.addLine(`mkdir: cannot create directory '${dirName}': File exists`, 'error');
            } else {
                currentDir[dirName] = {
                    _meta: { type: 'dir', created: new Date(), size: 4096 }
                };
                this.addLine(`Directory '${dirName}' created`, 'success');
                this.saveSession();
            }
        }
    }

    handleTouch(args) {
        if (args.length === 0) {
            this.addLine('touch: missing file operand', 'error');
            return;
        }
        const currentDir = this.getCurrentDirectory();
        if (currentDir) {
            const fileName = args[0];
            if (!currentDir[fileName]) {
                currentDir[fileName] = {
                    content: '',
                    _meta: { type: 'file', created: new Date(), size: 0 }
                };
                this.addLine(`File '${fileName}' created`, 'success');
            } else {
                // Update timestamp if file exists
                if (currentDir[fileName]._meta) {
                    currentDir[fileName]._meta.created = new Date();
                }
                this.addLine(`File '${fileName}' timestamp updated`, 'success');
            }
            this.saveSession();
        }
    }

    handleCat(args) {
        if (args.length === 0) {
            this.addLine('cat: missing file operand', 'error');
            return;
        }
        const fileName = args[0];
        const currentDir = this.getCurrentDirectory();
        if (currentDir && currentDir[fileName] !== undefined) {
            const item = currentDir[fileName];
            if (item._meta && item._meta.type === 'dir') {
                this.addLine(`cat: ${fileName}: Is a directory`, 'error');
            } else {
                const content = item.content || item;
                this.addLine(content, 'output');
            }
        } else {
            this.addLine(`cat: ${fileName}: No such file or directory`, 'error');
        }
    }

    handleRm(args) {
        if (args.length === 0) {
            this.addLine('rm: missing operand', 'error');
            return;
        }
        const currentDir = this.getCurrentDirectory();
        if (currentDir && currentDir[args[0]] !== undefined) {
            delete currentDir[args[0]];
            this.addLine("File '" + args[0] + "' removed", 'success');
        } else {
            this.addLine("rm: cannot remove '" + args[0] + "': No such file or directory", 'error');
        }
    }

    handleCp(args) {
        if (args.length < 2) {
            this.addLine('cp: missing destination file operand', 'error');
            return;
        }
        const currentDir = this.getCurrentDirectory();
        if (currentDir && currentDir[args[0]] !== undefined) {
            currentDir[args[1]] = currentDir[args[0]];
            this.addLine("'" + args[0] + "' copied to '" + args[1] + "'", 'success');
        } else {
            this.addLine("cp: cannot stat '" + args[0] + "': No such file or directory", 'error');
        }
    }

    handleMv(args) {
        if (args.length < 2) {
            this.addLine('mv: missing destination file operand', 'error');
            return;
        }
        const currentDir = this.getCurrentDirectory();
        if (currentDir && currentDir[args[0]] !== undefined) {
            currentDir[args[1]] = currentDir[args[0]];
            delete currentDir[args[0]];
            this.addLine("'" + args[0] + "' moved to '" + args[1] + "'", 'success');
        } else {
            this.addLine("mv: cannot stat '" + args[0] + "': No such file or directory", 'error');
        }
    }

    handlePs(args) {
        const detailed = args.includes('aux') || args.includes('-aux');
        
        if (detailed) {
            this.addLine('USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND', 'output');
            this.addLine('root           1  0.0  0.1  22528  1234 ?        Ss   10:30   0:01 /sbin/init', 'output');
            this.addLine('root         123  0.0  0.0  12345   678 ?        S    10:30   0:00 [kthreadd]', 'output');
            this.addLine('neuro       1234  0.1  0.5  45678  2345 pts/0    Ss   10:31   0:01 -bash', 'output');
            this.addLine('neuro       5678  0.0  0.3  34567  1567 pts/0    S+   10:32   0:00 python3 script.py', 'output');
            this.addLine('neuro       9012  0.0  0.1  23456   890 pts/0    R+   10:33   0:00 ps aux', 'output');
        } else {
            this.addLine('  PID TTY          TIME CMD', 'output');
            this.addLine(' 1234 pts/0    00:00:01 bash', 'output');
            this.addLine(' 5678 pts/0    00:00:00 python3', 'output');
            this.addLine(' 9012 pts/0    00:00:00 ps', 'output');
        }
    }

    handleNetstat(args) {
        this.addLine('Active Internet connections (w/o servers)', 'output');
        this.addLine('Proto Recv-Q Send-Q Local Address           Foreign Address         State', 'output');
        this.addLine('tcp        0      0 192.168.1.100:22        192.168.1.1:54321       ESTABLISHED', 'output');
        this.addLine('tcp        0      0 192.168.1.100:80        0.0.0.0:*               LISTEN', 'output');
        this.addLine('tcp6       0      0 :::22                   :::*                    LISTEN', 'output');
        this.addLine('udp        0      0 0.0.0.0:68              0.0.0.0:*                       ', 'output');
    }

    handleSs(args) {
        this.addLine('Netid  State      Recv-Q Send-Q Local Address:Port               Peer Address:Port              ', 'output');
        this.addLine('tcp    LISTEN     0      128          0.0.0.0:22                      0.0.0.0:*                  ', 'output');
        this.addLine('tcp    LISTEN     0      80           0.0.0.0:80                      0.0.0.0:*                  ', 'output');
        this.addLine('tcp    ESTAB      0      0      192.168.1.100:22               192.168.1.1:54321              ', 'output');
        this.addLine('udp    UNCONN     0      0            0.0.0.0:68                      0.0.0.0:*                  ', 'output');
    }

    handlePing(args) {
        const pingConfig = this.parsePingArgs(args);
        if (!pingConfig.target) {
            this.addLine('ping: usage error: Destination address required', 'error');
            return;
        }
        
        this.executePing(pingConfig);
    }
    
    parsePingArgs(args) {
        if (args.length === 0) return { target: null };
        
        const target = args[args.length - 1];
        const count = args.includes('-c') ? parseInt(args[args.indexOf('-c') + 1]) || 4 : 4;
        
        return { target, count };
    }
    
    executePing(config) {
        this.addLine(`PING ${config.target} (192.168.1.1) 56(84) bytes of data.`, 'output');
        
        let sent = 0;
        const pingInterval = setInterval(() => {
            if (sent >= config.count) {
                clearInterval(pingInterval);
                this.displayPingStats(config);
                return;
            }
            
            sent++;
            const time = (12 + Math.random() * 10).toFixed(1);
            this.addLine(`64 bytes from ${config.target} (192.168.1.1): icmp_seq=${sent} ttl=64 time=${time} ms`, 'output');
        }, 1000);
    }
    
    displayPingStats(config) {
        this.addLine('', 'output');
        this.addLine(`--- ${config.target} ping statistics ---`, 'output');
        this.addLine(`${config.count} packets transmitted, ${config.count} received, 0% packet loss, time ${config.count * 1000}ms`, 'output');
        this.addLine('rtt min/avg/max/mdev = 12.345/15.678/18.901/2.345 ms', 'output');
    }

    handleGrep(args) {
        if (args.length < 2) {
            this.addLine('grep: missing pattern or file', 'error');
            return;
        }
        this.addLine(`Searching for '${args[0]}' in ${args[1]}...`, 'output');
        this.addLine('grep: search completed', 'success');
    }

    handleWget(args) {
        if (args.length === 0) {
            this.addLine('wget: missing URL', 'error');
            return;
        }
        this.addLine(`Downloading ${args[0]}...`, 'output');
        setTimeout(() => this.addLine('Download completed', 'success'), 1500);
    }

    handleGit(args) {
        if (args.length === 0) {
            this.addLine('usage: git [--version] [--help] <command> [<args>]', 'output');
            return;
        }
        switch(args[0]) {
            case 'clone':
                this.addLine(`Cloning repository...`, 'output');
                setTimeout(() => this.addLine('Repository cloned successfully', 'success'), 2000);
                break;
            case 'status':
                this.addLine('On branch main\nnothing to commit, working tree clean', 'output');
                break;
            case 'add':
                this.addLine('Files added to staging area', 'success');
                break;
            case 'commit':
                this.addLine('Changes committed successfully', 'success');
                break;
            default:
                this.addLine(`git: '${args[0]}' is not a git command`, 'error');
        }
    }

    handleNano(args) {
        if (args.length === 0) {
            this.addLine('nano: missing file operand', 'error');
            return;
        }
        const fileName = args[0];
        this.addLine(`Opening ${fileName} in nano editor...`, 'output');
        
        // Switch to code editor
        if (window.vm) {
            window.vm.switchApp('editor');
            setTimeout(() => {
                const currentDir = this.getCurrentDirectory();
                const codeEditor = document.getElementById('code-editor');
                const editorFilename = document.getElementById('editor-filename');
                
                if (codeEditor && editorFilename) {
                    if (currentDir && currentDir[fileName]) {
                        const content = currentDir[fileName].content || currentDir[fileName] || '';
                        codeEditor.value = content;
                    } else {
                        codeEditor.value = '';
                    }
                    editorFilename.textContent = fileName;
                    codeEditor.focus();
                }
            }, 300);
        }
    }

    // Security tools
    handleMetasploit(args) {
        this.addLine('', 'output');
        this.addLine('                                   %%%            %%%', 'output');
        this.addLine('                               %%%                %%%', 'output');
        this.addLine('                           %%%                      %%%', 'output');
        this.addLine('                       %%%                            %%%', 'output');
        this.addLine('                     %%%                                %%%', 'output');
        this.addLine('                   %%%                                    %%%', 'output');
        this.addLine('                  %%                                        %%', 'output');
        this.addLine('              %%                                              %%', 'output');
        this.addLine('            %%                                                  %%', 'output');
        this.addLine('           %%                                                    %%', 'output');
        this.addLine('          %%                                                      %%', 'output');
        this.addLine('         %%                                                        %%', 'output');
        this.addLine('        %%                                                          %%', 'output');
        this.addLine('        %            =[ metasploit v6.3.31-dev                     ]%', 'output');
        this.addLine('        + -- --=[ 2328 exploits - 1218 auxiliary - 413 post       ]', 'output');
        this.addLine('        + -- --=[ 1385 payloads - 46 encoders - 11 nops            ]', 'output');
        this.addLine('        + -- --=[ 9 evasion                                         ]', 'output');
        this.addLine('', 'output');
        this.addLine('Metasploit tip: View advanced module options with advanced', 'output');
        this.addLine('', 'output');
        
        if (args.length === 0) {
            this.addLine('msf6 > ', 'success');
            this.addLine('Available commands: search, use, show, set, run, exit', 'output');
            this.addLine('Example: search type:exploit platform:windows', 'output');
        } else if (args[0] === 'search') {
            setTimeout(() => {
                this.addLine('Matching Modules', 'success');
                this.addLine('================', 'output');
                this.addLine('', 'output');
                this.addLine('#  Name                                     Disclosure Date  Rank     Check  Description', 'output');
                this.addLine('-  ----                                     ---------------  ----     -----  -----------', 'output');
                this.addLine('0  exploit/windows/smb/ms17_010_eternalblue  2017-03-14       average  Yes    MS17-010 EternalBlue SMB Remote Windows Kernel Pool Corruption', 'output');
                this.addLine('1  exploit/multi/handler                     manual           manual   No     Generic Payload Handler', 'output');
                this.addLine('2  exploit/windows/http/rejetto_hfs_exec     2014-09-11       excellent Yes   Rejetto HttpFileServer Remote Command Execution', 'output');
            }, 1000);
        }
    }

    handleBurpSuite(args) {
        this.addLine('Starting Burp Suite Professional...', 'output');
        setTimeout(() => {
            this.addLine('Burp Suite loaded successfully', 'success');
            this.addLine('Proxy listening on 127.0.0.1:8080', 'output');
        }, 2000);
    }

    handleSqlmap(args) {
        if (args.length === 0) {
            this.addLine('Usage: sqlmap -u <URL> [options]', 'output');
            return;
        }
        this.addLine('SQLMap automatic SQL injection tool', 'output');
        this.addLine('Testing connection to the target URL...', 'output');
        setTimeout(() => this.addLine('SQL injection vulnerability detected!', 'success'), 2500);
    }

    handleAircrack(args) {
        this.addLine('Aircrack-ng WiFi security auditing toolset', 'output');
        this.addLine('Starting WiFi network scan...', 'output');
        setTimeout(() => {
            this.addLine('Found 5 WiFi networks:', 'success');
            this.addLine('  1. HomeWiFi (WPA2)', 'output');
            this.addLine('  2. OfficeNet (WEP)', 'output');
        }, 2000);
    }

    handleHydra(args) {
        if (args.length === 0) {
            this.addLine('Usage: hydra -l user -P wordlist.txt target service', 'output');
            return;
        }
        this.addLine('Hydra password cracking tool', 'output');
        this.addLine('Starting brute force attack...', 'output');
        setTimeout(() => this.addLine('Password found: admin123', 'success'), 3000);
    }

    handleNikto(args) {
        if (args.length === 0) {
            this.addLine('Usage: nikto -h <target>', 'output');
            return;
        }
        this.addLine('Nikto web server scanner', 'output');
        this.addLine('Scanning web server vulnerabilities...', 'output');
        setTimeout(() => {
            this.addLine('Found 3 vulnerabilities:', 'success');
            this.addLine('  - Outdated Apache version', 'output');
            this.addLine('  - Directory listing enabled', 'output');
        }, 2500);
    }

    handleDirb(args) {
        if (args.length === 0) {
            this.addLine('Usage: dirb <url> [wordlist]', 'output');
            return;
        }
        this.addLine('DIRB directory brute forcer', 'output');
        this.addLine('Scanning for hidden directories...', 'output');
        setTimeout(() => {
            this.addLine('Found directories:', 'success');
            this.addLine('  /admin/', 'output');
            this.addLine('  /backup/', 'output');
        }, 2000);
    }

    // Tab completion
    handleTabCompletion(input) {
        const text = input.value;
        const parts = text.split(' ');
        const lastPart = parts[parts.length - 1];
        
        if (parts.length === 1) {
            // Command completion
            let commands = ['ls', 'cd', 'mkdir', 'touch', 'cat', 'nano', 'rm', 'cp', 'mv', 'pwd', 'whoami', 'date', 'clear', 'help', 'pkg', 'python3', 'git', 'nmap', 'metasploit', 'burpsuite', 'sqlmap', 'aircrack-ng', 'hydra', 'nikto', 'dirb'];
            
            // Add course-specific commands
            if (this.courseTools[this.currentCourse]) {
                commands = commands.concat(this.courseTools[this.currentCourse].commands);
            }
            
            const matches = commands.filter(cmd => cmd.startsWith(lastPart));
            
            if (matches.length === 1) {
                input.value = matches[0] + ' ';
            } else if (matches.length > 1) {
                this.addLine('Available commands:', 'output');
                this.addLine(matches.join('  '), 'output');
            }
        } else {
            // File/directory completion
            const currentDir = this.getCurrentDirectory();
            if (currentDir) {
                const matches = Object.keys(currentDir).filter(name => name.startsWith(lastPart));
                
                if (matches.length === 1) {
                    parts[parts.length - 1] = matches[0];
                    input.value = parts.join(' ') + ' ';
                } else if (matches.length > 1) {
                    this.addLine('Available files/directories:', 'output');
                    this.addLine(matches.join('  '), 'output');
                }
            }
        }
    }

    // Command aliases
    expandAlias(command) {
        const aliases = {
            'll': 'ls -la',
            'la': 'ls -a',
            'l': 'ls -l',
            '..': 'cd ..',
            '...': 'cd ../..',
            'c': 'clear',
            'h': 'help'
        };
        return aliases[command] || command;
    }

    // Session persistence
    saveSession() {
        const session = {
            currentPath: this.currentPath,
            commandHistory: this.commandHistory.slice(0, 50), // Keep last 50 commands
            fileSystem: this.fileSystem
        };
        localStorage.setItem('neuro-vm-session', JSON.stringify(session));
    }

    loadSession() {
        try {
            const session = JSON.parse(localStorage.getItem('neuro-vm-session'));
            if (session) {
                this.currentPath = session.currentPath || '/home/neuro';
                this.commandHistory = session.commandHistory || [];
                if (session.fileSystem) {
                    this.fileSystem = session.fileSystem;
                }
                this.updatePrompt();
            }
        } catch (e) {
            console.log('No previous session found');
        }
    }

    // AI Hacking Commands
    handleTargetNeuroDev(args) {
        try {
            this.addLine('🎯 Neuro-Dev Infrastructure Scan', 'success');
            this.addLine('Target: neuro-dev.local', 'output');
            this.addLine('', 'output');
            this.showLoading('Scanning infrastructure', 2000);
            setTimeout(() => {
                try {
                    this.addLine('Infrastructure Discovery:', 'success');
                    this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
                    this.addLine('🌐 neuro-dev.local:80        [Web Interface]', 'output');
                    this.addLine('🤖 ml-api.neuro-dev:8080     [ML API Service]', 'output');
                    this.addLine('💬 chat-api.neuro-dev:3000   [AI Chat Service]', 'output');
                    this.addLine('👁️  vision-api.neuro-dev:5000 [Computer Vision API]', 'output');
                    this.addLine('📊 data-api.neuro-dev:8081   [Training Data API]', 'output');
                    this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
                    this.addLine('', 'output');
                    this.addLine('🚨 Vulnerabilities Detected:', 'error');
                    this.addLine('   • Model extraction possible via /predict endpoint', 'output');
                    this.addLine('   • Admin panel exposed at /admin (no authentication)', 'output');
                    this.addLine('   • Training data leakage in /model-info', 'output');
                    this.addLine('   • Privacy attacks feasible (membership inference)', 'output');
                    this.addLine('   • Adversarial examples bypass detection', 'output');
                    this.addLine('', 'output');
                    this.addLine('Use: scan-ml-api <target> for detailed API analysis', 'output');
                } catch (error) {
                    this.addLine('Error displaying scan results', 'error');
                }
            }, 2500);
        } catch (error) {
            this.addLine('Error scanning infrastructure', 'error');
        }
    }

    // AI/ML Theory Commands
    handleSklearnInfo(args) {
        this.addLine('Scikit-learn 1.0.2 - Machine Learning Library', 'success');
        this.addLine('Available algorithms: LinearRegression, RandomForest, SVM, KMeans', 'output');
        this.addLine('Datasets available: iris, housing, mnist', 'output');
        this.addLine('Use: load-dataset <name> to start', 'output');
    }

    handleLoadDataset(args) {
        const dataset = args[0] || 'iris';
        this.addLine(`Loading dataset: ${dataset}`, 'output');
        setTimeout(() => {
            this.addLine(`Dataset loaded: ${dataset}.csv`, 'success');
            if (dataset === 'iris') {
                this.addLine('Shape: (150, 4) - 150 samples, 4 features', 'output');
                this.addLine('Classes: setosa, versicolor, virginica', 'output');
            } else if (dataset === 'housing') {
                this.addLine('Shape: (20640, 8) - 20640 samples, 8 features', 'output');
                this.addLine('Target: median_house_value', 'output');
            }
            this.addLine('Use: train-model <algorithm> to train', 'output');
        }, 1000);
    }

    handleTrainModel(args) {
        const algorithm = args[0] || 'RandomForest';
        this.addLine(`Training ${algorithm} model...`, 'output');
        this.showLoading('Training in progress', 2000);
        setTimeout(() => {
            this.addLine('Model training completed!', 'success');
            this.addLine(`Accuracy: ${(0.92 + Math.random() * 0.08).toFixed(3)}`, 'success');
            this.addLine('Use: evaluate-model for detailed metrics', 'output');
        }, 2500);
    }

    handleEvaluateModel(args) {
        this.addLine('Model Evaluation Results:', 'success');
        this.addLine(`Precision: ${(0.94 + Math.random() * 0.05).toFixed(3)}`, 'output');
        this.addLine(`Recall: ${(0.93 + Math.random() * 0.06).toFixed(3)}`, 'output');
        this.addLine(`F1-Score: ${(0.94 + Math.random() * 0.05).toFixed(3)}`, 'output');
        this.addLine('Confusion Matrix:', 'output');
        this.addLine('[[50, 0, 0], [0, 47, 3], [0, 2, 48]]', 'output');
    }

    // AI/ML Coding Commands
    handleTensorflow(args) {
        this.addLine('Loading TensorFlow...', 'output');
        setTimeout(() => {
            this.addLine('TensorFlow 2.8.0 loaded successfully', 'success');
            this.addLine('GPU support: Available (CUDA 11.2)', 'success');
            this.addLine('Use: create-model <type> to start building', 'output');
        }, 1500);
    }

    handlePytorch(args) {
        this.addLine('Loading PyTorch...', 'output');
        setTimeout(() => {
            this.addLine('PyTorch 1.11.0 loaded successfully', 'success');
            this.addLine('CUDA available: True', 'success');
            this.addLine('Use: create-model <type> to start building', 'output');
        }, 1500);
    }

    handleCreateModel(args) {
        const modelType = args[0] || 'cnn';
        this.addLine(`Creating ${modelType.toUpperCase()} model...`, 'output');
        setTimeout(() => {
            this.addLine('Model architecture:', 'output');
            if (modelType === 'cnn') {
                this.addLine('Layer 1: Conv2D(32, 3x3, activation=relu)', 'output');
                this.addLine('Layer 2: MaxPool2D(2x2)', 'output');
                this.addLine('Layer 3: Conv2D(64, 3x3, activation=relu)', 'output');
                this.addLine('Layer 4: MaxPool2D(2x2)', 'output');
                this.addLine('Layer 5: Flatten()', 'output');
                this.addLine('Layer 6: Dense(128, activation=relu)', 'output');
                this.addLine('Layer 7: Dense(10, activation=softmax)', 'output');
            } else {
                this.addLine('Layer 1: Dense(128, activation=relu)', 'output');
                this.addLine('Layer 2: Dropout(0.5)', 'output');
                this.addLine('Layer 3: Dense(64, activation=relu)', 'output');
                this.addLine('Layer 4: Dense(10, activation=softmax)', 'output');
            }
            this.addLine('Model created successfully!', 'success');
            this.addLine('Use: train-neural-net to start training', 'output');
        }, 1000);
    }

    handleTrainNeuralNet(args) {
        this.addLine('Starting neural network training...', 'output');
        this.simulateTraining();
    }
    
    simulateTraining() {
        const totalEpochs = 10;
        let currentEpoch = 1;
        
        this.addLine(`Epoch ${currentEpoch}/${totalEpochs} - Loss: 2.3026 - Accuracy: 0.1000`, 'output');
        
        const trainingInterval = setInterval(() => {
            currentEpoch++;
            
            if (currentEpoch > totalEpochs) {
                clearInterval(trainingInterval);
                this.addLine('Training completed successfully!', 'success');
                this.addLine('Final model saved to: model.h5', 'output');
                return;
            }
            
            const metrics = this.calculateTrainingMetrics(currentEpoch);
            this.addLine(`Epoch ${currentEpoch}/${totalEpochs} - Loss: ${metrics.loss} - Accuracy: ${metrics.accuracy}`, 'output');
        }, 800);
    }
    
    calculateTrainingMetrics(epoch) {
        const baseLoss = 2.3 - (epoch * 0.2);
        const baseAccuracy = 0.1 + (epoch * 0.08);
        
        return {
            loss: (baseLoss + Math.random() * 0.1).toFixed(4),
            accuracy: (baseAccuracy + Math.random() * 0.02).toFixed(4)
        };
    }

    handleOpencv(args) {
        this.addLine('Loading OpenCV for Computer Vision...', 'output');
        setTimeout(() => {
            this.addLine('OpenCV 4.5.3 loaded successfully', 'success');
            this.addLine('Available functions: imread, imshow, resize, filter2D', 'output');
            this.addLine('Face detection models loaded', 'output');
        }, 1200);
    }



    handleScanMlApi(args) {
        try {
            const target = args[0] || 'ml-api.neuro-dev';
            this.addLine(`Scanning ML API: ${target}`, 'output');
            this.showLoading('Analyzing endpoints', 1800);
            setTimeout(() => {
                try {
                    this.addLine('API Endpoint Analysis:', 'success');
                    this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
                    this.addLine('✅ /predict          [POST] - Model prediction', 'output');
                    this.addLine('🚨 /model-info       [GET]  - Model metadata (EXPOSED)', 'error');
                    this.addLine('🚨 /admin            [GET]  - Admin panel (NO AUTH)', 'error');
                    this.addLine('✅ /health           [GET]  - Health check', 'output');
                    this.addLine('🚨 /training-data    [GET]  - Training samples (LEAKED)', 'error');
                    this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
                    this.addLine('', 'output');
                    this.addLine('🎯 Attack Vectors Available:', 'success');
                    this.addLine('   • Model extraction via query analysis', 'output');
                    this.addLine('   • Membership inference attacks', 'output');
                    this.addLine('   • Adversarial example generation', 'output');
                    this.addLine('', 'output');
                    this.addLine('Use: extract-model to begin model extraction', 'output');
                } catch (error) {
                    this.addLine('Error displaying scan results', 'error');
                }
            }, 2300);
        } catch (error) {
            this.addLine('Error scanning ML API', 'error');
        }
    }

    handleExtractModel(args) {
        this.addLine('🎯 Initiating Model Extraction Attack...', 'output');
        this.addLine('', 'output');
        this.addLine('Phase 1: Probing model architecture', 'output');
        this.showLoading('Sending crafted queries', 1500);
        
        setTimeout(() => {
            this.addLine('✅ Model type identified: Random Forest', 'success');
            this.addLine('Phase 2: Feature extraction', 'output');
        }, 1800);
        
        setTimeout(() => {
            this.addLine('✅ Feature importance extracted', 'success');
            this.addLine('Phase 3: Decision boundary mapping', 'output');
        }, 3000);
        
        setTimeout(() => {
            this.addLine('🎉 MODEL EXTRACTION SUCCESSFUL!', 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📊 Extracted Model Details:', 'success');
            this.addLine('   • Type: Random Forest Classifier', 'output');
            this.addLine('   • Trees: 100', 'output');
            this.addLine('   • Max Depth: 10', 'output');
            this.addLine('   • Features: 4 (feature1, feature2, feature3, feature4)', 'output');
            this.addLine('   • Accuracy Match: 98.7%', 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('💾 Model saved to: /home/neuro/targets/extracted-model.py', 'output');
        }, 4500);
    }

    handleAdversarialAttack(args) {
        this.addLine('🎯 Launching Adversarial Attack...', 'output');
        this.addLine('', 'output');
        this.addLine('Method: Fast Gradient Sign Method (FGSM)', 'output');
        this.addLine('Target: Image Classification Model', 'output');
        this.showLoading('Generating adversarial examples', 2000);
        
        setTimeout(() => {
            this.addLine('🎉 ADVERSARIAL ATTACK SUCCESSFUL!', 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📸 Original Image Analysis:', 'output');
            this.addLine('   • Prediction: Cat (Confidence: 99.8%)', 'output');
            this.addLine('   • Class: Tabby Cat', 'output');
            this.addLine('', 'output');
            this.addLine('🎭 Adversarial Image Analysis:', 'error');
            this.addLine('   • Prediction: Dog (Confidence: 87.3%)', 'error');
            this.addLine('   • Class: Golden Retriever', 'error');
            this.addLine('   • Perturbation: 0.03 (barely visible)', 'output');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('🚨 Model successfully fooled with minimal changes!', 'success');
        }, 2500);
    }

    handlePrivacyAttack(args) {
        this.addLine('🎯 Launching Membership Inference Attack...', 'output');
        this.addLine('', 'output');
        this.addLine('Target: Training Data Privacy', 'output');
        this.addLine('Method: Shadow Model Attack', 'output');
        this.showLoading('Training shadow models', 2500);
        
        setTimeout(() => {
            this.addLine('Phase 1: Shadow model training complete', 'success');
            this.addLine('Phase 2: Analyzing prediction confidence patterns', 'output');
        }, 3000);
        
        setTimeout(() => {
            this.addLine('🚨 PRIVACY VIOLATION DETECTED!', 'error');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📊 Attack Results:', 'success');
            this.addLine('   • Training Data Membership: 78% confidence', 'error');
            this.addLine('   • Sensitive Records Identified: 23', 'error');
            this.addLine('   • Personal Information Exposed:', 'error');
            this.addLine('     - Email addresses: 12', 'error');
            this.addLine('     - Phone numbers: 8', 'error');
            this.addLine('     - Medical records: 3', 'error');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('⚠️  GDPR/Privacy compliance violation confirmed!', 'error');
        }, 5000);
    }

    handleDeepfool(args) {
        this.addLine('🎯 Running DeepFool Attack...', 'output');
        this.addLine('', 'output');
        this.addLine('Algorithm: DeepFool (Minimal Perturbation)', 'output');
        this.addLine('Target: Deep Neural Network', 'output');
        this.showLoading('Computing minimal adversarial perturbation', 2200);
        
        setTimeout(() => {
            this.addLine('🎉 DEEPFOOL ATTACK SUCCESSFUL!', 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📊 Attack Analysis:', 'success');
            this.addLine('   • Original Prediction: Airplane (99.2%)', 'output');
            this.addLine('   • Adversarial Prediction: Bird (12.4%)', 'error');
            this.addLine('   • Perturbation Magnitude: 0.02', 'output');
            this.addLine('   • L2 Distance: 0.018', 'output');
            this.addLine('   • Iterations Required: 7', 'output');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('🎯 Model robustness: COMPROMISED', 'error');
            this.addLine('💡 Recommendation: Implement adversarial training', 'output');
        }, 2700);
    }

    // CTF Challenge Handlers
    handleCtfApiExploit(args) {
        try {
            this.addLine('🏆 CTF Challenge: API Exploitation', 'success');
            this.addLine('Target: ml-api.neuro-dev:8080', 'output');
            this.addLine('', 'output');
            this.addLine('Scanning endpoints...', 'output');
            setTimeout(() => {
                try {
                    this.addLine('Found vulnerable endpoint: /admin', 'error');
                    this.addLine('Authentication bypass detected!', 'success');
                    this.addLine('Flag discovered: NEURO{api_secret_key_2024}', 'success');
                } catch (error) {
                    this.addLine('Error in CTF challenge execution', 'error');
                }
            }, 2000);
        } catch (error) {
            this.addLine('Error starting CTF challenge', 'error');
        }
    }

    handleCtfModelExtraction(args) {
        this.addLine('🏆 CTF Challenge: ML Model Extraction', 'success');
        this.addLine('Target: Protected ML Model', 'output');
        this.addLine('', 'output');
        this.addLine('Probing model architecture...', 'output');
        setTimeout(() => {
            this.addLine('Model type: Random Forest', 'output');
            this.addLine('Extracting decision boundaries...', 'output');
        }, 1500);
        setTimeout(() => {
            this.addLine('Model successfully cloned!', 'success');
            this.addLine('Flag discovered: NEURO{extracted_model_hash_abc123}', 'success');
        }, 3000);
    }

    handleCtfHiddenLogin(args) {
        this.addLine('🏆 CTF Challenge: Hidden Login Discovery', 'success');
        this.addLine('Target: Web Application', 'output');
        this.addLine('', 'output');
        this.addLine('Enumerating directories...', 'output');
        setTimeout(() => {
            this.addLine('Found: /admin/login.php', 'success');
            this.addLine('Testing SQL injection...', 'output');
        }, 1500);
        setTimeout(() => {
            this.addLine('SQL injection successful!', 'success');
            this.addLine('Admin access granted', 'success');
            this.addLine('Flag discovered: NEURO{hidden_admin_password_xyz789}', 'success');
        }, 3000);
    }

    handleCtfFileDiscovery(args) {
        this.addLine('🏆 CTF Challenge: File Discovery', 'success');
        this.addLine('Target: Linux File System', 'output');
        this.addLine('', 'output');
        this.addLine('Searching for hidden files...', 'output');
        setTimeout(() => {
            this.addLine('Found: .secret_flag.txt', 'success');
            this.addLine('Reading file contents...', 'output');
        }, 1500);
        setTimeout(() => {
            this.addLine('File content: CTF{hidden_file_content_def456}', 'success');
            this.addLine('Flag discovered: NEURO{hidden_file_content_def456}', 'success');
        }, 2500);
    }

    // New Advanced Challenge Handlers
    handlePoisonModel(args) {
        this.addLine('🧠 AI Model Poisoning Attack', 'success');
        this.addLine('Target: ML Training Pipeline', 'output');
        this.addLine('', 'output');
        this.addLine('Phase 1: Accessing training dataset...', 'output');
        this.showLoading('Analyzing data distribution', 1500);
        setTimeout(() => {
            this.addLine('✅ Dataset access gained: 10,000 samples', 'success');
            this.addLine('Phase 2: Crafting poisoned samples...', 'output');
        }, 2000);
        setTimeout(() => {
            this.addLine('✅ Poisoned samples created: 50 backdoor triggers', 'success');
            this.addLine('Phase 3: Injecting into training pipeline...', 'output');
        }, 3500);
        setTimeout(() => {
            this.addLine('🎉 MODEL POISONING SUCCESSFUL!', 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📊 Attack Results:', 'success');
            this.addLine('   • Backdoor trigger: "neuro_trigger_2024"', 'output');
            this.addLine('   • Model accuracy maintained: 94.2%', 'output');
            this.addLine('   • Backdoor success rate: 98.7%', 'success');
            this.addLine('   • Detection evasion: 100%', 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('🏆 Flag discovered: NEURO{poisoned_model_trigger_neuro2024}', 'success');
        }, 5000);
    }

    handleAnalyzeApk(args) {
        this.addLine('📱 Mobile Banking Trojan Analysis', 'success');
        this.addLine('Target: banking_app_v2.1.apk', 'output');
        this.addLine('', 'output');
        this.addLine('Phase 1: APK decompilation...', 'output');
        this.showLoading('Extracting DEX files', 1200);
        setTimeout(() => {
            this.addLine('✅ APK decompiled successfully', 'success');
            this.addLine('Phase 2: Static analysis...', 'output');
        }, 1500);
        setTimeout(() => {
            this.addLine('🚨 Suspicious code detected!', 'error');
            this.addLine('   • Hidden service: com.evil.TrojanService', 'error');
            this.addLine('   • SMS interception capability found', 'error');
            this.addLine('   • Keylogger implementation detected', 'error');
            this.addLine('Phase 3: Network analysis...', 'output');
        }, 2800);
        setTimeout(() => {
            this.addLine('🎯 C&C Server identified!', 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📊 Trojan Analysis Results:', 'success');
            this.addLine('   • C&C Server: evil-banking-c2.darkweb', 'output');
            this.addLine('   • Stolen data: Banking credentials, SMS OTP', 'error');
            this.addLine('   • Persistence method: Device admin privileges', 'error');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('🏆 Flag discovered: NEURO{trojan_c2_server_evil_banking}', 'success');
        }, 4200);
    }

    handleQuantumDecrypt(args) {
        this.addLine('🔐 Quantum Cryptography Attack', 'success');
        this.addLine('Target: Post-Quantum Encryption', 'output');
        this.addLine('', 'output');
        this.addLine('Phase 1: Quantum algorithm simulation...', 'output');
        this.showLoading('Initializing quantum circuits', 2000);
        setTimeout(() => {
            this.addLine('✅ Quantum simulator ready (1024 qubits)', 'success');
            this.addLine('Phase 2: Lattice-based crypto analysis...', 'output');
        }, 2500);
        setTimeout(() => {
            this.addLine('🔍 Analyzing NTRU encryption parameters...', 'output');
            this.addLine('   • Key size: 2048 bits', 'output');
            this.addLine('   • Lattice dimension: 701', 'output');
            this.addLine('Phase 3: Quantum attack execution...', 'output');
        }, 4000);
        setTimeout(() => {
            this.addLine('🎉 QUANTUM ATTACK SUCCESSFUL!', 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📊 Decryption Results:', 'success');
            this.addLine('   • Private key recovered in 47 minutes', 'success');
            this.addLine('   • Encrypted message: "Quantum supremacy achieved"', 'output');
            this.addLine('   • Vulnerability: Weak lattice reduction', 'error');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('🏆 Flag discovered: NEURO{quantum_decrypted_msg_supremacy}', 'success');
        }, 6000);
    }

    handleScan5g(args) {
        this.addLine('🌐 5G Network Security Assessment', 'success');
        this.addLine('Target: 5G Infrastructure', 'output');
        this.addLine('', 'output');
        this.addLine('Phase 1: Base station enumeration...', 'output');
        this.showLoading('Scanning 5G frequencies', 1800);
        setTimeout(() => {
            this.addLine('✅ Found 3 active base stations', 'success');
            this.addLine('   • gNodeB-001: 3.5 GHz (n78)', 'output');
            this.addLine('   • gNodeB-002: 28 GHz (n257)', 'output');
            this.addLine('   • gNodeB-003: 39 GHz (n260)', 'output');
            this.addLine('Phase 2: Network slicing analysis...', 'output');
        }, 2300);
        setTimeout(() => {
            this.addLine('🚨 Vulnerable slice configuration detected!', 'error');
            this.addLine('Phase 3: Traffic interception setup...', 'output');
        }, 3800);
        setTimeout(() => {
            this.addLine('🎯 5G NETWORK COMPROMISED!', 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📊 Interception Results:', 'success');
            this.addLine('   • Intercepted data: IoT device communications', 'output');
            this.addLine('   • Vulnerable slice: Emergency services (eMBB)', 'error');
            this.addLine('   • Attack vector: Network function virtualization', 'error');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('🏆 Flag discovered: NEURO{5g_intercepted_data_iot_emergency}', 'success');
        }, 5200);
    }

    handleSatelliteScan(args) {
        this.addLine('🛰️ Satellite Communication Hacking', 'success');
        this.addLine('Target: GEO Satellite Network', 'output');
        this.addLine('', 'output');
        this.addLine('Phase 1: Frequency spectrum analysis...', 'output');
        this.showLoading('Scanning C-band and Ku-band', 2200);
        setTimeout(() => {
            this.addLine('✅ Active satellites detected:', 'success');
            this.addLine('   • SAT-COM-1: 4.2 GHz (C-band)', 'output');
            this.addLine('   • SAT-COM-2: 12.5 GHz (Ku-band)', 'output');
            this.addLine('   • SAT-COM-3: 14.8 GHz (Ku-band)', 'output');
            this.addLine('Phase 2: Ground station reconnaissance...', 'output');
        }, 2700);
        setTimeout(() => {
            this.addLine('🎯 Vulnerable ground station found!', 'success');
            this.addLine('Phase 3: Uplink/downlink interception...', 'output');
        }, 4200);
        setTimeout(() => {
            this.addLine('🚀 SATELLITE SYSTEM COMPROMISED!', 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📡 Satellite Hack Results:', 'success');
            this.addLine('   • Command injection successful', 'success');
            this.addLine('   • Satellite control gained: SAT-COM-2', 'success');
            this.addLine('   • Intercepted traffic: Military communications', 'error');
            this.addLine('   • Command code: SPACE_CTRL_2024', 'output');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('🏆 Flag discovered: NEURO{satellite_command_code_SPACE_CTRL_2024}', 'success');
        }, 6500);
    }

    handleDetectDeepfake(args) {
        this.addLine('🎭 Deepfake Detection Laboratory', 'success');
        this.addLine('Target: AI-Generated Content', 'output');
        this.addLine('', 'output');
        this.addLine('Phase 1: Loading detection models...', 'output');
        this.showLoading('Initializing neural networks', 1600);
        setTimeout(() => {
            this.addLine('✅ Detection models loaded:', 'success');
            this.addLine('   • FaceForensics++ CNN', 'output');
            this.addLine('   • XceptionNet detector', 'output');
            this.addLine('   • Temporal consistency analyzer', 'output');
            this.addLine('Phase 2: Analyzing suspicious media...', 'output');
        }, 2100);
        setTimeout(() => {
            this.addLine('🔍 Processing video frames...', 'output');
            this.addLine('   • Frame analysis: 1247/1247 complete', 'output');
            this.addLine('   • Facial landmark detection: Active', 'output');
            this.addLine('Phase 3: Artifact detection...', 'output');
        }, 3600);
        setTimeout(() => {
            this.addLine('🚨 DEEPFAKE DETECTED!', 'error');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📊 Detection Results:', 'success');
            this.addLine('   • Confidence: 97.3% deepfake', 'error');
            this.addLine('   • Artifacts found: Temporal inconsistency', 'error');
            this.addLine('   • Generation method: StyleGAN2', 'output');
            this.addLine('   • Signature: DEEPFAKE_SIG_2024', 'output');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('🏆 Flag discovered: NEURO{deepfake_signature_STYLEGAN2_2024}', 'success');
        }, 5100);
    }

    // Bank Security Command Handlers
    handleBankScan(args) {
        this.addLine('🏦 Banking Infrastructure Security Scan', 'success');
        this.addLine('Target: SecureBank Testing Environment', 'output');
        this.addLine('', 'output');
        this.addLine('Phase 1: Network reconnaissance...', 'output');
        this.showLoading('Scanning banking infrastructure', 2000);
        setTimeout(() => {
            this.addLine('✅ Banking services discovered:', 'success');
            this.addLine('   • Web Portal: securebank.local:443', 'output');
            this.addLine('   • API Gateway: api.securebank.local:8080', 'output');
            this.addLine('   • Mobile App Backend: mobile.securebank.local:9000', 'output');
            this.addLine('   • Admin Panel: admin.securebank.local:8443', 'output');
            this.addLine('Phase 2: Vulnerability assessment...', 'output');
        }, 2500);
        setTimeout(() => {
            this.addLine('🚨 CRITICAL VULNERABILITIES DETECTED!', 'error');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📊 Security Assessment Results:', 'success');
            this.addLine('   • SQL Injection: Login portal (CRITICAL)', 'error');
            this.addLine('   • Session Management: Weak tokens (HIGH)', 'error');
            this.addLine('   • Payment Gateway: Amount manipulation (CRITICAL)', 'error');
            this.addLine('   • Admin Panel: Authentication bypass (HIGH)', 'error');
            this.addLine('   • API Endpoints: Unauthorized access (MEDIUM)', 'output');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('🎯 Use: exploit-bank <vulnerability> to test exploits', 'output');
        }, 4500);
    }

    handleExploitBank(args) {
        const vulnType = args[0] || 'sqli';
        this.addLine(`🎯 Banking Exploit: ${vulnType.toUpperCase()}`, 'success');
        this.addLine('Target: SecureBank Application', 'output');
        this.addLine('', 'output');
        
        if (vulnType === 'sqli') {
            this.addLine('Phase 1: SQL injection testing...', 'output');
            this.showLoading('Crafting malicious payloads', 1500);
            setTimeout(() => {
                this.addLine('✅ SQL injection successful!', 'success');
                this.addLine('   • Payload: admin\' OR 1=1--', 'output');
                this.addLine('   • Database: MySQL 8.0.25', 'output');
                this.addLine('   • Tables accessed: users, accounts, transactions', 'success');
                this.addLine('   • Records extracted: 50,000 customer accounts', 'success');
                this.addLine('🏆 Flag discovered: BANK{sql_injection_bypass_admin123}', 'success');
            }, 2000);
        } else if (vulnType === 'payment') {
            this.addLine('Phase 1: Payment gateway analysis...', 'output');
            this.showLoading('Intercepting payment requests', 1800);
            setTimeout(() => {
                this.addLine('💰 PAYMENT MANIPULATION SUCCESSFUL!', 'success');
                this.addLine('   • Original amount: $1,000.00', 'output');
                this.addLine('   • Modified amount: $0.01', 'success');
                this.addLine('   • Transaction approved: YES', 'success');
                this.addLine('   • Merchant charged: $0.01', 'success');
                this.addLine('🏆 Flag discovered: BANK{payment_manipulation_amount_modified}', 'success');
            }, 2300);
        } else {
            this.addLine('🎉 BANKING EXPLOIT SUCCESSFUL!', 'success');
            setTimeout(() => {
                this.addLine('🏆 Flag discovered: BANK{generic_banking_exploit_success}', 'success');
            }, 1500);
        }
    }

    handleBankForensics(args) {
        this.addLine('🔍 Banking Digital Forensics Investigation', 'success');
        this.addLine('Case: Suspicious Transaction Activity', 'output');
        this.addLine('', 'output');
        this.addLine('Phase 1: Transaction log analysis...', 'output');
        this.showLoading('Processing 1M+ transactions', 2200);
        setTimeout(() => {
            this.addLine('📊 Forensic Analysis Results:', 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('🚨 Suspicious Activity Detected:', 'error');
            this.addLine('   • Account: 4532-****-****-1234', 'output');
            this.addLine('   • Pattern: Structured transactions ($9,999 each)', 'error');
            this.addLine('   • Frequency: 47 transactions in 24 hours', 'error');
            this.addLine('   • Total amount: $469,953', 'error');
            this.addLine('Phase 2: Network forensics...', 'output');
        }, 2700);
        setTimeout(() => {
            this.addLine('🌐 Network Analysis Complete:', 'success');
            this.addLine('   • Source IP: 192.168.100.50 (Internal)', 'error');
            this.addLine('   • Employee workstation: BANK-PC-047', 'error');
            this.addLine('   • User: john.smith@securebank.com', 'error');
            this.addLine('   • Access time: Outside business hours', 'error');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            this.addLine('📋 Conclusion: Insider threat detected - Money laundering', 'success');
            this.addLine('🏆 Flag discovered: BANK{insider_threat_detected_employee_malicious}', 'success');
        }, 5000);
    }

    // Flag System Commands
    handleFlag(args) {
        if (args.length === 0) {
            this.addLine('Flag System Commands:', 'success');
            this.addLine('  flag submit <flag>     - Submit a discovered flag', 'output');
            this.addLine('  flag list              - Show available flag categories', 'output');
            this.addLine('  flag progress          - Show your flag progress', 'output');
            this.addLine('  flag hint <category>   - Get hints for flag category', 'output');
            this.addLine('', 'output');
            this.addLine('💡 Tip: Click the flag button in taskbar to open submission modal', 'output');
            return;
        }

        switch(args[0]) {
            case 'submit':
                if (args.length < 2) {
                    this.addLine('Usage: flag submit <flag>', 'error');
                    return;
                }
                this.submitFlagFromTerminal(args.slice(1).join(' '));
                break;
            case 'list':
                this.showFlagCategories();
                break;
            case 'progress':
                this.showFlagProgress();
                break;
            case 'hint':
                this.showFlagHints(args[1]);
                break;
            default:
                this.addLine(`Unknown flag command: ${args[0]}`, 'error');
                this.addLine('Use: flag (without arguments) for help', 'output');
        }
    }

    handleSubmitFlag(args) {
        if (args.length === 0) {
            this.addLine('Usage: submit-flag <flag>', 'error');
            return;
        }
        this.submitFlagFromTerminal(args.join(' '));
    }

    submitFlagFromTerminal(flagText) {
        if (!window.flagSystem) {
            this.addLine('Flag system not initialized', 'error');
            return;
        }

        const flag = flagText.trim();
        if (!flag) {
            this.addLine('Please provide a flag to submit', 'error');
            return;
        }

        // Check if flag exists in system
        if (window.flagSystem.flags.has(flag)) {
            const flagData = window.flagSystem.flags.get(flag);
            
            // Check if already submitted
            if (window.flagSystem.userFlags.has(flag)) {
                this.addLine('🚩 Flag already submitted!', 'error');
                return;
            }

            // Submit flag
            window.flagSystem.userFlags.add(flag);
            
            // Update user system
            if (window.userSystem) {
                window.userSystem.addPoints(flagData.points);
                window.userSystem.incrementFlags();
            }

            // Show success message
            this.addLine('🎉 FLAG ACCEPTED!', 'success');
            this.addLine(`Category: ${flagData.category}`, 'output');
            this.addLine(`Points: +${flagData.points}`, 'success');
            this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
            
            // Save progress
            window.flagSystem.saveProgress();
            
            // Update stats in flag modal if open
            window.flagSystem.updateStats();
            
        } else {
            this.addLine('❌ Invalid flag! Try again.', 'error');
            this.addLine('💡 Hint: Flags usually start with NEURO{} or BANK{}', 'output');
        }
    }

    showFlagCategories() {
        if (!window.flagSystem) {
            this.addLine('Flag system not initialized', 'error');
            return;
        }

        this.addLine('Available Flag Categories:', 'success');
        this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        
        const categories = {};
        window.flagSystem.flags.forEach((flagData, flag) => {
            if (!categories[flagData.category]) {
                categories[flagData.category] = { total: 0, submitted: 0, points: 0 };
            }
            categories[flagData.category].total++;
            categories[flagData.category].points += flagData.points;
            if (window.flagSystem.userFlags.has(flag)) {
                categories[flagData.category].submitted++;
            }
        });

        Object.entries(categories).forEach(([category, stats]) => {
            const progress = Math.round((stats.submitted / stats.total) * 100);
            const status = progress === 100 ? '✅' : progress > 0 ? '🔄' : '⭕';
            this.addLine(`${status} ${category}: ${stats.submitted}/${stats.total} (${progress}%) - ${stats.points} pts`, 'output');
        });
        
        this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
    }

    showFlagProgress() {
        if (!window.flagSystem) {
            this.addLine('Flag system not initialized', 'error');
            return;
        }

        const progress = window.flagSystem.getProgress();
        this.addLine('Your Flag Progress:', 'success');
        this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
        this.addLine(`Flags Found: ${progress.submittedFlags}/${progress.totalFlags}`, 'output');
        this.addLine(`Total Points: ${progress.totalPoints}`, 'success');
        this.addLine(`Completion: ${progress.percentage}%`, 'output');
        
        // Progress bar
        const barLength = 30;
        const filled = Math.round((progress.percentage / 100) * barLength);
        const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
        this.addLine(`Progress: [${bar}] ${progress.percentage}%`, 'output');
        this.addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'output');
    }

    showFlagHints(category) {
        const hints = {
            'Reconnaissance': [
                '🔍 Use nmap to scan network targets',
                '🌐 Check web directories with dirb',
                '📊 Analyze service versions for vulnerabilities'
            ],
            'Web Security': [
                '🕷️ Test for SQL injection in login forms',
                '🔒 Look for XSS vulnerabilities in input fields',
                '🚪 Check for admin panels and hidden directories'
            ],
            'AI Security': [
                '🤖 Use adversarial-attack command on ML models',
                '🎯 Try extract-model to clone AI systems',
                '🔐 Test privacy-attack for data leakage'
            ],
            'Banking Security': [
                '🏦 Use bank-scan to find vulnerabilities',
                '💰 Try exploit-bank sqli for SQL injection',
                '🔍 Use bank-forensics to analyze transactions'
            ],
            'Cryptography': [
                '🔐 Look for weak encryption implementations',
                '🔑 Try quantum-decrypt for post-quantum crypto',
                '📊 Analyze cipher patterns and key lengths'
            ]
        };

        if (!category) {
            this.addLine('Available categories for hints:', 'output');
            Object.keys(hints).forEach(cat => {
                this.addLine(`  ${cat}`, 'output');
            });
            this.addLine('Usage: flag hint <category>', 'output');
            return;
        }

        if (hints[category]) {
            this.addLine(`Hints for ${category}:`, 'success');
            hints[category].forEach(hint => {
                this.addLine(hint, 'output');
            });
        } else {
            this.addLine(`No hints available for category: ${category}`, 'error');
        }
    }

    // Command suggestions
    getSuggestions(cmd) {
        const allCommands = ['help', 'clear', 'ls', 'cd', 'pwd', 'cat', 'nano', 'mkdir', 'touch', 'rm', 'cp', 'mv'];
        const courseCommands = this.courseTools[this.currentCourse]?.commands || [];
        const commands = [...allCommands, ...courseCommands];
        
        return commands.filter(command => {
            // Simple fuzzy matching
            return command.includes(cmd) || cmd.includes(command) || this.levenshteinDistance(cmd, command) <= 2;
        }).slice(0, 3);
    }
    
    levenshteinDistance(str1, str2) {
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    }

    // Missing command handlers
    handleVim(args) {
        if (args.length === 0) {
            this.addLine('vim: missing file operand', 'error');
            return;
        }
        this.addLine(`Opening ${args[0]} in vim editor...`, 'output');
        if (window.vm) {
            window.vm.switchApp('editor');
        }
    }

    handleFind(args) {
        const path = args[0] || '.';
        const name = args.includes('-name') ? args[args.indexOf('-name') + 1] : '*';
        this.addLine(`Searching for ${name} in ${path}...`, 'output');
        this.addLine('./Documents/file1.txt', 'output');
        this.addLine('./scripts/hello.py', 'output');
    }

    handleChmod(args) {
        if (args.length < 2) {
            this.addLine('chmod: missing operand', 'error');
            return;
        }
        this.addLine(`Changed permissions of '${args[1]}' to ${args[0]}`, 'success');
    }

    handleChown(args) {
        if (args.length < 2) {
            this.addLine('chown: missing operand', 'error');
            return;
        }
        this.addLine(`Changed ownership of '${args[1]}' to ${args[0]}`, 'success');
    }

    handleTar(args) {
        if (args.includes('-czf')) {
            this.addLine(`Creating archive: ${args[args.indexOf('-czf') + 1]}`, 'output');
        } else if (args.includes('-xzf')) {
            this.addLine(`Extracting archive: ${args[args.indexOf('-xzf') + 1]}`, 'output');
        } else {
            this.addLine('tar: invalid option', 'error');
        }
    }

    handleZip(args) {
        if (args.length < 2) {
            this.addLine('zip: missing operand', 'error');
            return;
        }
        this.addLine(`Creating zip archive: ${args[0]}`, 'output');
    }

    handleUnzip(args) {
        if (args.length === 0) {
            this.addLine('unzip: missing file operand', 'error');
            return;
        }
        this.addLine(`Extracting: ${args[0]}`, 'output');
    }

    handleHistory(args) {
        this.addLine('Command History:', 'output');
        this.commandHistory.slice(0, 10).forEach((cmd, index) => {
            this.addLine(`${index + 1}  ${cmd}`, 'output');
        });
    }

    handleAlias(args) {
        if (args.length === 0) {
            this.addLine('alias ll="ls -la"', 'output');
            this.addLine('alias la="ls -a"', 'output');
            this.addLine('alias c="clear"', 'output');
        } else {
            this.addLine(`Alias set: ${args.join(' ')}`, 'success');
        }
    }

    handleEnv(args) {
        this.addLine('Environment Variables:', 'output');
        this.addLine('PATH=/usr/local/bin:/usr/bin:/bin', 'output');
        this.addLine('HOME=/home/neuro', 'output');
        this.addLine('USER=neuro', 'output');
        this.addLine('SHELL=/bin/bash', 'output');
    }

    handleExport(args) {
        if (args.length === 0) {
            this.addLine('export: missing variable', 'error');
            return;
        }
        this.addLine(`Exported: ${args[0]}`, 'success');
    }

    handleWhich(args) {
        if (args.length === 0) {
            this.addLine('which: missing command', 'error');
            return;
        }
        const commands = {
            'python3': '/usr/bin/python3',
            'nmap': '/usr/bin/nmap',
            'git': '/usr/bin/git',
            'nano': '/usr/bin/nano'
        };
        this.addLine(commands[args[0]] || `${args[0]}: not found`, 'output');
    }

    handleMan(args) {
        if (args.length === 0) {
            this.addLine('man: missing command', 'error');
            return;
        }
        this.addLine(`Manual page for ${args[0]}:`, 'output');
        this.addLine(`${args[0]} - command description`, 'output');
        this.addLine('Use q to quit', 'output');
    }

    handleTop(args) {
        this.addLine('Tasks: 156 total, 2 running, 154 sleeping', 'output');
        this.addLine('CPU usage: 15.2%', 'output');
        this.addLine('Memory usage: 3.2GB / 8GB', 'output');
        this.addLine('Press q to quit', 'output');
    }

    handleKill(args) {
        if (args.length === 0) {
            this.addLine('kill: missing PID', 'error');
            return;
        }
        this.addLine(`Killed process ${args[0]}`, 'success');
    }

    handleKillall(args) {
        if (args.length === 0) {
            this.addLine('killall: missing process name', 'error');
            return;
        }
        this.addLine(`Killed all ${args[0]} processes`, 'success');
    }

    handleDf(args) {
        this.addLine('Filesystem     1K-blocks    Used Available Use% Mounted on', 'output');
        this.addLine('/dev/sda1       20971520 8388608  12582912  40% /', 'output');
        this.addLine('tmpfs            4194304       0   4194304   0% /tmp', 'output');
    }

    handleDu(args) {
        const path = args[0] || '.';
        this.addLine(`Disk usage for ${path}:`, 'output');
        this.addLine('4.0K    ./Documents', 'output');
        this.addLine('8.0K    ./scripts', 'output');
        this.addLine('12K     total', 'output');
    }

    handleFree(args) {
        this.addLine('              total        used        free      shared', 'output');
        this.addLine('Mem:        8388608     3355443     5033165           0', 'output');
        this.addLine('Swap:       2097152           0     2097152', 'output');
    }

    handleUptime(args) {
        const uptime = Math.floor(Math.random() * 24) + 1;
        this.addLine(`up ${uptime} hours, 2 users, load average: 0.15, 0.25, 0.30`, 'output');
    }

    handleUname(args) {
        if (args.includes('-a')) {
            this.addLine('Linux neuro-dev 5.15.0-neuro #1 SMP x86_64 GNU/Linux', 'output');
        } else {
            this.addLine('Linux', 'output');
        }
    }

    addToHistory(command) {
        if (command && command.trim()) {
            this.commandHistory.unshift(command.trim());
            if (this.commandHistory.length > 50) {
                this.commandHistory = this.commandHistory.slice(0, 50);
            }
        }
    }
    
    updateCommandStats(cmd) {
        if (!this.commandStats) {
            this.commandStats = {};
        }
        this.commandStats[cmd] = (this.commandStats[cmd] || 0) + 1;
    }

    /**
     * Loading Animation System
     * Displays animated loading indicators with spinner frames
     */
    showLoading(message, duration = 2000) {
        const animation = new LoadingAnimation(message, duration);
        animation.start();
    }
}

/**
 * Loading Animation Helper Class
 * Manages spinner animation lifecycle
 */
class LoadingAnimation {
    constructor(message, duration) {
        this.message = message;
        this.duration = duration;
        this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.frameIndex = 0;
        this.interval = null;
        this.element = null;
    }
    
    start() {
        this.createElement();
        this.startAnimation();
        this.scheduleCleanup();
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'terminal-line output';
        
        const span = document.createElement('span');
        span.textContent = `${this.frames[0]} ${this.message}`;
        this.element.appendChild(span);
        
        const output = document.getElementById('terminal-output');
        if (output) {
            output.appendChild(this.element);
        }
    }
    
    startAnimation() {
        this.interval = setInterval(() => {
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
            const span = this.element?.querySelector('span');
            if (span) {
                span.textContent = `${this.frames[this.frameIndex]} ${this.message}`;
            }
        }, 100);
    }
    
    scheduleCleanup() {
        setTimeout(() => {
            this.cleanup();
        }, this.duration);
    }
    
    cleanup() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
    }
}

// Mobile Terminal Enhancement
class MobileTerminal extends Terminal {
    constructor() {
        super();
        this.isMobile = window.innerWidth <= 768;
        if (this.isMobile) {
            this.setupMobileFeatures();
        }
    }

    setupMobileFeatures() {
        this.addVirtualKeyboard();
        this.setupTouchGestures();
    }

    addVirtualKeyboard() {
        const terminalContainer = document.querySelector('#terminal-app .window-content');
        if (!terminalContainer) return;

        const virtualKeyboard = document.createElement('div');
        virtualKeyboard.className = 'virtual-keyboard';
        virtualKeyboard.innerHTML = `
            <div class="keyboard-row">
                <button class="key-btn" data-key="Tab">Tab</button>
                <button class="key-btn" data-key="ArrowUp">↑</button>
                <button class="key-btn" data-key="ArrowDown">↓</button>
                <button class="key-btn" data-key="clear">Clear</button>
            </div>
            <div class="keyboard-row">
                <button class="key-btn" data-text="ls">ls</button>
                <button class="key-btn" data-text="cd">cd</button>
                <button class="key-btn" data-text="pwd">pwd</button>
                <button class="key-btn" data-text="help">help</button>
            </div>
        `;

        terminalContainer.appendChild(virtualKeyboard);

        virtualKeyboard.addEventListener('click', (e) => {
            if (e.target.classList.contains('key-btn')) {
                const input = document.getElementById('terminal-input');
                if (!input) return;

                if (e.target.dataset.key === 'clear') {
                    this.clear();
                } else if (e.target.dataset.text) {
                    input.value += e.target.dataset.text + ' ';
                    input.focus();
                }
            }
        });
    }

    setupTouchGestures() {
        const terminalOutput = document.getElementById('terminal-output');
        if (!terminalOutput) return;

        let startX = 0;
        terminalOutput.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        terminalOutput.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (diffX > 100) {
                this.clear();
            } else if (diffX < -100) {
                this.showHelp();
            }
        });
    }

    executeCommand(command) {
        if (this.isMobile && navigator.vibrate) {
            navigator.vibrate(50);
        }
        super.executeCommand(command);
        setTimeout(() => {
            const terminalOutput = document.getElementById('terminal-output');
            if (terminalOutput) {
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        }, 100);
    }
}

/**
 * Terminal Initialization Manager
 * Handles responsive terminal setup based on device type
 */
class TerminalManager {
    static init() {
        try {
            const isMobile = window.innerWidth <= 768;
            window.terminal = isMobile ? new MobileTerminal() : new Terminal();
            console.log(`Terminal initialized: ${isMobile ? 'Mobile' : 'Desktop'} mode`);
        } catch (error) {
            console.error('Terminal initialization error:', error);
        }
    }
}

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
        TerminalManager.init();
    });
});