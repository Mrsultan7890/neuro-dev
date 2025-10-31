// File Manager System
class FileManager {
    constructor() {
        this.currentPath = '/home/neuro';
        this.history = ['/home/neuro'];
        this.historyIndex = 0;
        this.selectedFiles = [];
        this.viewMode = 'list';
        this.setupFileManager();
    }

    setupFileManager() {
        this.refresh();
        this.updateNavigation();
    }

    refresh() {
        this.loadDirectory(this.currentPath);
    }

    loadDirectory(path) {
        const fileList = document.getElementById('file-list');
        if (!fileList) return;

        const currentDir = this.getCurrentDirectory();
        if (!currentDir) {
            fileList.innerHTML = '<div class="error">Directory not found</div>';
            return;
        }

        fileList.innerHTML = '';
        this.selectedFiles = [];

        const items = Object.entries(currentDir).filter(([name]) => name !== '_meta');
        
        // Update file count
        document.getElementById('file-count').textContent = `${items.length} items`;
        
        items.forEach(([name, content]) => {
            const meta = content._meta || { type: 'file', created: new Date(), size: 1024 };
            const isDirectory = meta.type === 'dir';
            const isExecutable = meta.executable || false;
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.dataset.fileName = name;
            
            let iconClass = 'fa-file';
            let iconColor = 'file';
            
            if (isDirectory) {
                iconClass = 'fa-folder';
                iconColor = 'folder';
            } else if (isExecutable) {
                iconClass = 'fa-file-code';
                iconColor = 'executable';
            } else if (name.endsWith('.py')) {
                iconClass = 'fa-file-code';
            } else if (name.endsWith('.txt') || name.endsWith('.md')) {
                iconClass = 'fa-file-alt';
            } else if (name.endsWith('.jpg') || name.endsWith('.png')) {
                iconClass = 'fa-file-image';
            }
            
            if (this.viewMode === 'list') {
                fileItem.innerHTML = `
                    <div class="file-icon ${iconColor}">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="file-name">${name}</div>
                    <div class="file-size">${isDirectory ? '' : this.formatFileSize(meta.size)}</div>
                    <div class="file-date">${this.formatDate(meta.created)}</div>
                `;
            } else {
                fileItem.innerHTML = `
                    <div class="file-icon ${iconColor}">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="file-name">${name}</div>
                `;
            }
            
            // Event listeners
            fileItem.addEventListener('click', (e) => {
                this.selectFile(name, e);
            });
            
            fileItem.addEventListener('dblclick', () => {
                if (isDirectory) {
                    this.navigateTo(`${this.currentPath}/${name}`.replace('//', '/'));
                } else {
                    // Open file in editor
                    if (window.vm) {
                        window.vm.switchApp('editor');
                        document.getElementById('code-editor').value = content.content || content;
                        document.getElementById('editor-filename').textContent = name;
                    }
                }
            });
            
            fileList.appendChild(fileItem);
        });
    }

    getCurrentDirectory() {
        if (!window.terminal) return null;
        
        const parts = this.currentPath.split('/').filter(p => p);
        let current = window.terminal.fileSystem;
        
        for (const part of parts) {
            if (current[part]) {
                current = current[part];
            } else {
                return null;
            }
        }
        return current;
    }

    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentPath = this.history[this.historyIndex];
            this.loadDirectory(this.currentPath);
            this.updateNavigation();
        }
    }

    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentPath = this.history[this.historyIndex];
            this.loadDirectory(this.currentPath);
            this.updateNavigation();
        }
    }

    goUp() {
        const parts = this.currentPath.split('/').filter(p => p);
        if (parts.length > 2) {
            parts.pop();
            this.navigateTo('/' + parts.join('/'));
        }
    }

    goHome() {
        this.navigateTo('/home/neuro');
    }

    navigateTo(path) {
        this.currentPath = path;
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(path);
        this.historyIndex = this.history.length - 1;
        this.loadDirectory(path);
        this.updateNavigation();
    }

    updateNavigation() {
        document.getElementById('back-btn').disabled = this.historyIndex === 0;
        document.getElementById('forward-btn').disabled = this.historyIndex === this.history.length - 1;
        document.getElementById('breadcrumb').textContent = this.currentPath;
        document.getElementById('files-path').textContent = this.currentPath;
    }

    toggleView() {
        this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
        const fileList = document.getElementById('file-list');
        const viewBtn = document.getElementById('view-btn');
        
        if (this.viewMode === 'grid') {
            fileList.classList.add('grid-view');
            viewBtn.innerHTML = '<i class="fas fa-th"></i>';
        } else {
            fileList.classList.remove('grid-view');
            viewBtn.innerHTML = '<i class="fas fa-list"></i>';
        }
        
        this.loadDirectory(this.currentPath);
    }

    newFolder() {
        const name = prompt('Enter folder name:');
        if (name && name.trim()) {
            const currentDir = this.getCurrentDirectory();
            if (currentDir) {
                if (currentDir[name]) {
                    alert('Folder already exists!');
                } else {
                    currentDir[name] = {
                        _meta: {
                            type: 'dir',
                            created: new Date(),
                            modified: new Date(),
                            size: 4096
                        }
                    };
                    this.loadDirectory(this.currentPath);
                    if (window.terminal) {
                        window.terminal.addLine(`Folder '${name}' created`, 'success');
                    }
                }
            }
        }
    }

    selectFile(fileName, event) {
        if (event.ctrlKey || event.metaKey) {
            const index = this.selectedFiles.indexOf(fileName);
            if (index > -1) {
                this.selectedFiles.splice(index, 1);
            } else {
                this.selectedFiles.push(fileName);
            }
        } else {
            this.selectedFiles = [fileName];
        }
        
        this.updateSelection();
    }

    updateSelection() {
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            const fileName = item.dataset.fileName;
            if (this.selectedFiles.includes(fileName)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        const selectionInfo = document.getElementById('selection-info');
        if (this.selectedFiles.length > 0) {
            selectionInfo.textContent = `${this.selectedFiles.length} selected`;
        } else {
            selectionInfo.textContent = '';
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Global functions for backward compatibility
function goBack() {
    window.fileManager.goBack();
}

function goHome() {
    window.fileManager.goHome();
}

function newFolder() {
    window.fileManager.newFolder();
}

function uploadFile() {
    alert('Upload functionality coming soon!');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.fileManager = new FileManager();
});