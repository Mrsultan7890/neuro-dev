// Code Editor System
class CodeEditor {
    constructor() {
        this.currentFile = 'untitled.py';
        this.currentLanguage = 'python';
        this.setupEditor();
    }

    setupEditor() {
        const editor = document.getElementById('code-editor');
        if (editor) {
            editor.value = '# Welcome to Neuro-Dev Code Editor\nprint("Hello World!")';
            this.addSyntaxHighlighting();
        }
    }

    addSyntaxHighlighting() {
        const editor = document.getElementById('code-editor');
        if (!editor) return;

        // Add line numbers
        this.addLineNumbers();
        
        // Add keyboard shortcuts
        editor.addEventListener('keydown', (e) => {
            // Ctrl+S to save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveFile();
            }
            // Ctrl+R to run
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                runCode();
            }
            // Tab for indentation
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + 4;
            }
        });
        
        // Auto-complete brackets
        editor.addEventListener('input', (e) => {
            const pos = editor.selectionStart;
            const char = e.data;
            
            if (char === '(' || char === '[' || char === '{') {
                const closing = char === '(' ? ')' : char === '[' ? ']' : '}';
                const value = editor.value;
                editor.value = value.substring(0, pos) + closing + value.substring(pos);
                editor.selectionStart = editor.selectionEnd = pos;
            }
        });
    }

    addLineNumbers() {
        const editor = document.getElementById('code-editor');
        if (!editor) return;
        
        // Create line numbers container if it doesn't exist
        let lineNumbers = document.querySelector('.line-numbers');
        if (!lineNumbers) {
            lineNumbers = document.createElement('div');
            lineNumbers.className = 'line-numbers';
            editor.parentNode.insertBefore(lineNumbers, editor);
        }
        
        const updateLineNumbers = () => {
            const lines = editor.value.split('\n').length;
            let numbers = '';
            for (let i = 1; i <= lines; i++) {
                numbers += i + '\n';
            }
            lineNumbers.textContent = numbers;
        };
        
        editor.addEventListener('input', updateLineNumbers);
        editor.addEventListener('scroll', () => {
            lineNumbers.scrollTop = editor.scrollTop;
        });
        
        updateLineNumbers();
    }
}

function newFile() {
    const editor = document.getElementById('code-editor');
    const filename = document.getElementById('editor-filename');
    
    editor.value = '';
    filename.textContent = 'untitled.py';
    
    if (window.terminal) {
        window.terminal.addLine('New file created in editor', 'success');
    }
}

function saveFile() {
    const content = document.getElementById('code-editor').value;
    let filename = document.getElementById('editor-filename').textContent;
    
    // If untitled, ask for filename
    if (filename.startsWith('untitled')) {
        const newName = prompt('Enter filename:', filename);
        if (newName && newName.trim()) {
            // Sanitize filename
            filename = newName.trim().replace(/[<>:"/\|?*]/g, '_');
            if (filename.length > 50) filename = filename.substring(0, 50);
            document.getElementById('editor-filename').textContent = filename;
        }
    }
    
    // Save to virtual file system
    if (window.terminal) {
        const currentDir = window.terminal.getCurrentDirectory();
        if (currentDir) {
            currentDir[filename] = {
                content: content,
                _meta: {
                    type: 'file',
                    created: new Date(),
                    modified: new Date(),
                    size: content.length
                }
            };
            window.terminal.addLine(`File '${filename}' saved successfully`, 'success');
            
            // Update file manager if open
            if (window.fileManager) {
                window.fileManager.refresh();
            }
        }
    }
    
    // Show save confirmation
    const output = document.getElementById('editor-output');
    output.innerHTML = `<div class="save-success">💾 File saved: ${filename}</div>`;
    setTimeout(() => {
        output.innerHTML = '';
    }, 2000);
}

function runCode() {
    const code = document.getElementById('code-editor').value;
    const language = document.getElementById('language-select').value;
    const output = document.getElementById('editor-output');
    
    output.innerHTML = '<div class="execution-header">🚀 Executing ' + language + ' code...</div>';
    
    setTimeout(() => {
        if (language === 'python') {
            executePython(code, output);
        } else if (language === 'javascript') {
            executeJavaScript(code, output);
        } else if (language === 'bash') {
            executeBash(code, output);
        } else if (language === 'html') {
            executeHTML(code, output);
        }
        
        if (window.terminal) {
            window.terminal.addLine(`Code executed in ${language}`, 'success');
        }
    }, 500);
}

function executePython(code, output) {
    let result = '';
    const lines = code.split('\n');
    
    try {
        lines.forEach((line, index) => {
            line = line.trim();
            if (!line || line.startsWith('#')) return;
            
            // Handle print statements
            if (line.includes('print(')) {
                const matches = line.match(/print\(([^)]+)\)/);
                if (matches) {
                    let content = matches[1];
                    // Remove quotes
                    content = content.replace(/["']/g, '');
                    // Handle variables
                    if (content.includes('f"') || content.includes("f'")) {
                        content = content.replace(/f["'](.+?)["']/, '$1');
                    }
                    result += content + '\n';
                }
            }
            // Handle variable assignments
            else if (line.includes('=') && !line.includes('==')) {
                const [varName, value] = line.split('=').map(s => s.trim());
                result += `${varName} = ${value}\n`;
            }
            // Handle imports
            else if (line.startsWith('import') || line.startsWith('from')) {
                result += `✓ ${line}\n`;
            }
            // Handle loops and conditions
            else if (line.startsWith('for') || line.startsWith('if') || line.startsWith('while')) {
                result += `→ ${line}\n`;
            }
        });
        
        if (!result) {
            result = 'Code executed successfully (no output)';
        }
        
        output.innerHTML = `<div class="execution-success">✅ Python Execution Complete</div><pre class="code-output">${result}</pre>`;
    } catch (e) {
        output.innerHTML = `<div class="execution-error">❌ Python Error</div><pre class="error-output">${e.message}</pre>`;
    }
}

function executeJavaScript(code, output) {
    try {
        // Validate and sanitize code
        if (!code || typeof code !== 'string') {
            throw new Error('Invalid code input');
        }
        
        // Block dangerous functions
        const dangerousPatterns = [
            /eval\s*\(/,
            /Function\s*\(/,
            /setTimeout\s*\(/,
            /setInterval\s*\(/,
            /document\./,
            /window\./,
            /location\./,
            /XMLHttpRequest/,
            /fetch\s*\(/
        ];
        
        for (const pattern of dangerousPatterns) {
            if (pattern.test(code)) {
                throw new Error('Potentially dangerous code detected');
            }
        }
        
        // Capture console.log output
        let logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
            logs.push(args.join(' '));
            originalLog.apply(console, args);
        };
        
        // Safe execution in restricted context
        const result = new Function('console', `"use strict"; ${code}`)({ log: console.log });
        console.log = originalLog;
        
        let outputText = logs.length > 0 ? logs.join('\n') : (result !== undefined ? result : 'Code executed successfully');
        output.innerHTML = `<div class="execution-success">✅ JavaScript Execution Complete</div><pre class="code-output">${sanitizeOutput(outputText)}</pre>`;
    } catch (e) {
        output.innerHTML = `<div class="execution-error">❌ JavaScript Error</div><pre class="error-output">${sanitizeOutput(e.message)}</pre>`;
    }
}

function sanitizeOutput(text) {
    if (typeof text !== 'string') return '';
    return text.replace(/[<>"'&]/g, function(match) {
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

function executeBash(code, output) {
    const lines = code.split('\n');
    let result = '';
    
    lines.forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        
        if (line.startsWith('echo')) {
            const match = line.match(/echo ["'](.+?)["']/);
            if (match) {
                result += match[1] + '\n';
            } else {
                result += line.replace('echo ', '') + '\n';
            }
        } else if (line.startsWith('ls')) {
            result += 'Documents  Downloads  Desktop  scripts  projects\n';
        } else if (line.startsWith('pwd')) {
            result += '/home/neuro\n';
        } else {
            result += `$ ${line}\n`;
        }
    });
    
    output.innerHTML = `<div class="execution-success">✅ Bash Execution Complete</div><pre class="code-output">${result || 'Script executed successfully'}</pre>`;
}

function executeHTML(code, output) {
    output.innerHTML = `<div class="execution-success">✅ HTML Preview</div><div class="html-preview">${code}</div>`;
}

function changeLanguage() {
    const language = document.getElementById('language-select').value;
    const editor = document.getElementById('code-editor');
    const filename = document.getElementById('editor-filename');
    
    const templates = {
        'python': '# Python Code\nprint("Hello from Python!")',
        'javascript': '// JavaScript Code\nconsole.log("Hello from JavaScript!");',
        'bash': '#!/bin/bash\necho "Hello from Bash!"',
        'html': '<!DOCTYPE html>\n<html>\n<body>\n<h1>Hello World!</h1>\n</body>\n</html>'
    };
    
    const extensions = {
        'python': '.py',
        'javascript': '.js', 
        'bash': '.sh',
        'html': '.html'
    };
    
    editor.value = templates[language] || '';
    filename.textContent = 'untitled' + extensions[language];
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.codeEditor = new CodeEditor();
});