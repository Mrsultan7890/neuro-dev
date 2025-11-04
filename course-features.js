// Enhanced Global Search System
class GlobalSearchSystem {
    constructor() {
        this.searchIndex = {};
        this.modules = [
            'termux-basics', 'termux-advanced', 'nethunter-rootless', 'nethunter-tools',
            'networking', 'web-security', 'mobile-osint', 'nethunter-troubleshooting',
            'python-complete', 'python-basics-kids', 'python-ai-ml', 'hands-on-ml-scikit-learn'
        ];
        this.buildSearchIndex();
    }

    async buildSearchIndex() {
        for (const module of this.modules) {
            try {
                const response = await fetch(`data/${module}.json`);
                if (response.ok) {
                    const data = await response.json();
                    this.indexModule(module, data);
                } else {
                    console.warn(`Module ${module} not found (${response.status}), using fallback data`);
                    this.indexFallbackData(module);
                }
            } catch (error) {
                console.warn(`Failed to load module ${module}:`, error.message);
                this.indexFallbackData(module);
            }
        }
    }

    indexModule(moduleId, data) {
        if (!data.lessons) return;
        
        data.lessons.forEach(lesson => {
            const searchData = {
                moduleId,
                moduleName: data.moduleTitle || moduleId,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                content: lesson.content.intro || '',
                commands: [],
                topics: []
            };

            if (lesson.content.sections) {
                lesson.content.sections.forEach(section => {
                    searchData.content += ' ' + (section.text || '');
                    searchData.topics.push(section.heading || '');
                    
                    if (section.commands) {
                        section.commands.forEach(cmd => {
                            searchData.commands.push(cmd.command);
                            searchData.content += ' ' + cmd.description + ' ' + cmd.explanation;
                        });
                    }
                });
            }

            const key = `${moduleId}-${lesson.id}`;
            this.searchIndex[key] = searchData;
        });
    }

    indexFallbackData(moduleId) {
        const fallbackData = {
            'termux-basics': ['termux setup', 'basic commands', 'file operations', 'pkg install'],
            'termux-advanced': ['python scripting', 'git github', 'ssh access', 'automation'],
            'nethunter-rootless': ['nethunter install', 'kali tools', 'vnc setup', 'desktop'],
            'nethunter-tools': ['nmap scanning', 'metasploit', 'aircrack-ng', 'burp suite'],
            'networking': ['network fundamentals', 'ip addressing', 'port scanning', 'reconnaissance'],
            'web-security': ['owasp top 10', 'sql injection', 'xss attacks', 'csrf'],
            'mobile-osint': ['apk analysis', 'osint gathering', 'google dorking', 'social media'],
            'python-complete': ['python basics', 'variables', 'functions', 'loops', 'classes'],
            'python-ai-ml': ['numpy', 'pandas', 'tensorflow', 'machine learning', 'ai']
        };

        const topics = fallbackData[moduleId] || [];
        topics.forEach((topic, index) => {
            const key = `${moduleId}-${index + 1}`;
            this.searchIndex[key] = {
                moduleId,
                moduleName: moduleId.replace('-', ' '),
                lessonId: index + 1,
                lessonTitle: topic,
                content: topic,
                commands: [],
                topics: [topic]
            };
        });
    }

    search(query) {
        if (!query || query.length < 2) return [];
        
        const searchTerm = query.toLowerCase();
        const results = [];

        Object.values(this.searchIndex).forEach(item => {
            let score = 0;
            const searchableText = (
                item.lessonTitle + ' ' + 
                item.content + ' ' + 
                item.commands.join(' ') + ' ' + 
                item.topics.join(' ')
            ).toLowerCase();

            if (item.lessonTitle.toLowerCase().includes(searchTerm)) score += 10;
            if (item.commands.some(cmd => cmd.toLowerCase().includes(searchTerm))) score += 8;
            if (item.topics.some(topic => topic.toLowerCase().includes(searchTerm))) score += 6;
            if (searchableText.includes(searchTerm)) score += 3;

            if (score > 0) {
                results.push({ ...item, score });
            }
        });

        return results.sort((a, b) => b.score - a.score).slice(0, 20);
    }
}

// Initialize global search
const globalSearch = new GlobalSearchSystem();

// Enhanced search function
function searchCourses() {
    const searchTerm = document.getElementById('course-search').value.toLowerCase().trim();
    
    if (searchTerm.length < 2) {
        showAllCourses();
        hideSearchResults();
        return;
    }

    // Search in course cards first
    const courseCards = document.querySelectorAll('.course-card');
    let hasVisibleCards = false;
    
    courseCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            hasVisibleCards = true;
        } else {
            card.style.display = 'none';
        }
    });

    // Global content search
    const globalResults = globalSearch.search(searchTerm);
    showSearchResults(globalResults, searchTerm);
}

function showAllCourses() {
    document.querySelectorAll('.course-card').forEach(card => {
        card.style.display = 'block';
    });
}

function showSearchResults(results, searchTerm) {
    try {
        let resultsContainer = document.getElementById('search-results');
        
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'search-results';
            resultsContainer.className = 'search-results-container';
            
            const coursesSection = document.getElementById('courses');
            if (!coursesSection) {
                console.error('Courses section not found');
                return;
            }
            coursesSection.appendChild(resultsContainer);
        }

        if (results.length === 0) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-search';
            
            const title = document.createElement('h3');
            const sanitizedTerm = sanitizeSearchTerm(searchTerm);
            title.appendChild(document.createTextNode(`"${sanitizedTerm}" ke liye koi result nahi mila`));
            
            const desc = document.createElement('p');
            desc.textContent = 'Kuch aur try kariye ya spelling check kariye';
            
            noResultsDiv.appendChild(icon);
            noResultsDiv.appendChild(title);
            noResultsDiv.appendChild(desc);
            
            resultsContainer.innerHTML = '';
            resultsContainer.appendChild(noResultsDiv);
            resultsContainer.style.display = 'block';
            return;
        }

        // Sanitize search term and results
    const sanitizedSearchTerm = searchTerm.replace(/[<>"'&]/g, '');
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'search-results-header';
    
    const headerTitle = document.createElement('h3');
    headerTitle.innerHTML = '<i class="fas fa-search"></i>';
    headerTitle.appendChild(document.createTextNode(` "${sanitizedSearchTerm}" ke liye ${results.length} results mile`));
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-search';
    closeBtn.innerHTML = '<i class="fas fa-times"></i> Close';
    closeBtn.onclick = hideSearchResults;
    
    headerDiv.appendChild(headerTitle);
    headerDiv.appendChild(closeBtn);
    
    const gridDiv = document.createElement('div');
    gridDiv.className = 'search-results-grid';
    
    results.forEach(result => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'search-result-item';
        itemDiv.onclick = () => openLesson(result.moduleId, result.lessonId);
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'result-header';
        
        const titleH4 = document.createElement('h4');
        titleH4.textContent = result.lessonTitle;
        
        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'module-badge';
        badgeSpan.textContent = result.moduleName;
        
        headerDiv.appendChild(titleH4);
        headerDiv.appendChild(badgeSpan);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'result-content';
        
        const contentP = document.createElement('p');
        contentP.textContent = result.content.substring(0, 150) + '...';
        contentDiv.appendChild(contentP);
        
        itemDiv.appendChild(headerDiv);
        itemDiv.appendChild(contentDiv);
        
        if (result.commands.length > 0) {
            const commandsDiv = document.createElement('div');
            commandsDiv.className = 'result-commands';
            
            const strongEl = document.createElement('strong');
            strongEl.textContent = 'Commands: ';
            commandsDiv.appendChild(strongEl);
            commandsDiv.appendChild(document.createTextNode(result.commands.slice(0, 2).join(', ')));
            
            itemDiv.appendChild(commandsDiv);
        }
        
        const footerDiv = document.createElement('div');
        footerDiv.className = 'result-footer';
        
        const lessonSpan = document.createElement('span');
        lessonSpan.className = 'lesson-number';
        lessonSpan.textContent = `Lesson ${result.lessonId}`;
        
        const openSpan = document.createElement('span');
        openSpan.className = 'open-lesson';
        openSpan.innerHTML = 'Open Lesson <i class="fas fa-arrow-right"></i>';
        
        footerDiv.appendChild(lessonSpan);
        footerDiv.appendChild(openSpan);
        
        itemDiv.appendChild(footerDiv);
        gridDiv.appendChild(itemDiv);
    });
    
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(headerDiv);
    resultsContainer.appendChild(gridDiv);
    
        resultsContainer.style.display = 'block';
    } catch (error) {
        console.error('Error showing search results:', error);
    }
}

function hideSearchResults() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
    showAllCourses();
    document.getElementById('course-search').value = '';
}

function openLesson(moduleId, lessonId) {
    window.location.href = `course.html?module=${moduleId}#lesson-${lessonId}`;
}

// Filter by difficulty
function filterCourses(level) {
    const courseCards = document.querySelectorAll('.course-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    courseCards.forEach(card => {
        const badge = card.querySelector('.course-badge');
        if (level === 'all' || (badge && badge.textContent.toLowerCase() === level)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Theme Toggle - Simple and Direct
function toggleTheme() {
    console.log('Theme toggle clicked'); // Debug log
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    const currentTheme = body.getAttribute('data-theme') || 'dark';
    
    if (currentTheme === 'light') {
        body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
        console.log('Switched to dark theme');
    } else {
        body.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
        console.log('Switched to light theme');
    }
}

// Make toggleTheme globally available
window.toggleTheme = toggleTheme;

// Progress Tracking System
class ProgressTracker {
    constructor() {
        this.storageKey = 'neuro-dev-progress';
        this.progress = this.loadProgress();
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.warn('Failed to load progress data:', error);
            return {};
        }
    }

    saveProgress() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
        } catch (error) {
            console.error('Failed to save progress:', error);
        }
    }

    markLessonComplete(module, lessonId) {
        if (!this.progress[module]) {
            this.progress[module] = { completedLessons: [], startDate: new Date().toISOString() };
        }
        
        if (!this.progress[module].completedLessons.includes(lessonId)) {
            this.progress[module].completedLessons.push(lessonId);
            this.saveProgress();
            this.updateProgressDisplay();
        }
    }

    getModuleProgress(module) {
        if (!this.progress[module]) return 0;
        
        const lessonCounts = {
            'termux-basics': 8,
            'termux-advanced': 8,
            'nethunter-rootless': 12,
            'nethunter-tools': 6,
            'networking': 6,
            'web-security': 8,
            'mobile-osint': 6,
            'nethunter-troubleshooting': 6,
            'python-complete': 15,
            'python-basics-kids': 20,
            'python-ai-ml': 15,
            'hands-on-ml-scikit-learn': 19
        };
        
        const totalLessons = lessonCounts[module] || 10;
        const completed = this.progress[module].completedLessons.length;
        return Math.round((completed / totalLessons) * 100);
    }

    updateProgressDisplay() {
        document.querySelectorAll('.course-card').forEach(card => {
            const module = card.getAttribute('data-module');
            if (!module) return;
            
            const progress = this.getModuleProgress(module);
            this.updateCardProgress(card, progress);
        });
    }
    
    updateCardProgress(card, progress) {
        let progressBar = card.querySelector('.progress-bar');
        
        if (progress > 0 && !progressBar) {
            progressBar = this.createProgressBar(progress);
            card.appendChild(progressBar);
        } else if (progressBar) {
            this.updateExistingProgressBar(progressBar, progress);
        }
    }
    
    createProgressBar(progress) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${progress}%`;
        
        const progressText = document.createElement('span');
        progressText.className = 'progress-text';
        progressText.textContent = `${progress}% Complete`;
        
        progressBar.appendChild(progressFill);
        progressBar.appendChild(progressText);
        
        return progressBar;
    }
    
    updateExistingProgressBar(progressBar, progress) {
        const fill = progressBar.querySelector('.progress-fill');
        const text = progressBar.querySelector('.progress-text');
        
        if (fill) fill.style.width = `${progress}%`;
        if (text) text.textContent = `${progress}% Complete`;
    }
}

// Notes System
class NotesSystem {
    constructor() {
        this.storageKey = 'neuro-dev-notes';
        this.notes = this.loadNotes();
    }

    loadNotes() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            return {};
        }
    }

    saveNote(moduleId, lessonId, note) {
        const key = `${moduleId}-${lessonId}`;
        this.notes[key] = {
            note: note,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
    }

    getNote(moduleId, lessonId) {
        const key = `${moduleId}-${lessonId}`;
        return this.notes[key] || null;
    }

    deleteNote(moduleId, lessonId) {
        const key = `${moduleId}-${lessonId}`;
        delete this.notes[key];
        localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
    }
}

/**
 * Application Performance Manager
 * Handles initialization and performance optimizations
 */
class AppManager {
    constructor() {
        this.progressTracker = new ProgressTracker();
        this.notesSystem = new NotesSystem();
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return;
        
        this.setupTheme();
        this.setupUI();
        this.setupProgressTracking();
        this.initialized = true;
    }
    
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const themeIcon = document.querySelector('#theme-toggle i');
        
        document.body.setAttribute('data-theme', savedTheme);
        if (themeIcon) {
            themeIcon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    setupUI() {
        addMissingButtons();
    }
    
    setupProgressTracking() {
        requestAnimationFrame(() => {
            if (this.progressTracker && typeof this.progressTracker.updateProgressDisplay === 'function') {
                this.progressTracker.updateProgressDisplay();
            }
        });
    }
}

// Initialize systems
const appManager = new AppManager();
const progressTracker = appManager.progressTracker;
const notesSystem = appManager.notesSystem;

// Helper function to sanitize search terms
function sanitizeSearchTerm(term) {
    if (typeof term !== 'string') return '';
    return term.replace(/[<>"'&]/g, function(match) {
        const escapeMap = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '&': '&amp;'
        };
        return escapeMap[match];
    }).substring(0, 100);
}

// Load saved theme and initialize course cards
document.addEventListener('DOMContentLoaded', () => {
    try {
        appManager.init();
    } catch (error) {
        console.error('Error during app initialization:', error);
    }
});

// Add missing buttons to course cards
function addMissingButtons() {
    document.querySelectorAll('.course-card').forEach(card => {
        const moduleId = card.dataset.module;
        if (!moduleId) return;
        
        const actionsDiv = this.getOrCreateActionsDiv(card);
        this.addStartButton(actionsDiv, moduleId);
        this.addReviewButton(card, actionsDiv, moduleId);
    });
}

function getOrCreateActionsDiv(card) {
    let actionsDiv = card.querySelector('.course-actions');
    if (!actionsDiv) {
        actionsDiv = document.createElement('div');
        actionsDiv.className = 'course-actions';
        card.appendChild(actionsDiv);
    }
    return actionsDiv;
}

function addStartButton(actionsDiv, moduleId) {
    const startBtn = this.createButton('start-btn', 'fas fa-play', ' Start Learning');
    startBtn.onclick = () => {
        const sanitizedModuleId = encodeURIComponent(moduleId);
        window.location.href = `course.html?module=${sanitizedModuleId}`;
    };
    actionsDiv.appendChild(startBtn);
}

function addReviewButton(card, actionsDiv, moduleId) {
    if (!card.querySelector('.review-btn')) {
        const reviewBtn = this.createButton('review-btn', 'fas fa-star', ' Rate Course');
        reviewBtn.onclick = () => showReviewModal(moduleId);
        actionsDiv.appendChild(reviewBtn);
    }
}

function createButton(className, iconClass, text) {
    const button = document.createElement('button');
    button.className = className;
    
    const icon = document.createElement('i');
    icon.className = iconClass;
    
    button.appendChild(icon);
    button.appendChild(document.createTextNode(text));
    
    return button;
}

// Missing function definitions
function showReviewModal(moduleId) {
    console.log(`Review modal for module: ${moduleId}`);
    // Placeholder for review modal functionality
    alert(`Review functionality for ${moduleId} - Coming soon!`);
}

// Export for use in course.html
window.progressTracker = progressTracker;
window.notesSystem = notesSystem;
window.globalSearch = globalSearch;
window.showReviewModal = showReviewModal;

// Add search event listeners and theme toggle
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('course-search');
    if (searchInput) {
        // Real-time search with debouncing
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(searchCourses, 300);
        });
        
        // Enter key search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchCourses();
            }
        });
    }
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    } else {
        console.log('Theme toggle button not found');
    }
});