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
                }
            } catch (error) {
                console.log(`Module ${module} not found, using fallback data`);
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
    let resultsContainer = document.getElementById('search-results');
    
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'search-results';
        resultsContainer.className = 'search-results-container';
        
        const coursesSection = document.getElementById('courses');
        coursesSection.appendChild(resultsContainer);
    }

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>"${searchTerm}" ke liye koi result nahi mila</h3>
                <p>Kuch aur try kariye ya spelling check kariye</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
        return;
    }

    resultsContainer.innerHTML = `
        <div class="search-results-header">
            <h3><i class="fas fa-search"></i> "${searchTerm}" ke liye ${results.length} results mile</h3>
            <button onclick="hideSearchResults()" class="close-search">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
        <div class="search-results-grid">
            ${results.map(result => `
                <div class="search-result-item" onclick="openLesson('${result.moduleId}', ${result.lessonId})">
                    <div class="result-header">
                        <h4>${result.lessonTitle}</h4>
                        <span class="module-badge">${result.moduleName}</span>
                    </div>
                    <div class="result-content">
                        <p>${result.content.substring(0, 150)}...</p>
                    </div>
                    ${result.commands.length > 0 ? `
                        <div class="result-commands">
                            <strong>Commands:</strong> ${result.commands.slice(0, 2).join(', ')}
                        </div>
                    ` : ''}
                    <div class="result-footer">
                        <span class="lesson-number">Lesson ${result.lessonId}</span>
                        <span class="open-lesson">Open Lesson <i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    resultsContainer.style.display = 'block';
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
            return {};
        }
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
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
            let progressBar = card.querySelector('.progress-bar');
            
            if (progress > 0 && !progressBar) {
                progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                progressBar.innerHTML = `
                    <div class="progress-fill" style="width: ${progress}%"></div>
                    <span class="progress-text">${progress}% Complete</span>
                `;
                card.appendChild(progressBar);
            } else if (progressBar) {
                const fill = progressBar.querySelector('.progress-fill');
                const text = progressBar.querySelector('.progress-text');
                if (fill) fill.style.width = `${progress}%`;
                if (text) text.textContent = `${progress}% Complete`;
            }
        });
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

// Initialize systems
const progressTracker = new ProgressTracker();
const notesSystem = new NotesSystem();

// Load saved theme and initialize course cards
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const themeIcon = document.querySelector('#theme-toggle i');
    
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
    
    // Add missing buttons to all course cards
    addMissingButtons();
    
    // Update progress display
    setTimeout(() => {
        progressTracker.updateProgressDisplay();
    }, 500);
});

// Add missing buttons to course cards
function addMissingButtons() {
    document.querySelectorAll('.course-card').forEach(card => {
        const moduleId = card.dataset.module;
        if (!moduleId) return;
        
        // Check if course-actions already exists
        let actionsDiv = card.querySelector('.course-actions');
        if (!actionsDiv) {
            actionsDiv = document.createElement('div');
            actionsDiv.className = 'course-actions';
            
            // Add Start Learning button
            const startBtn = document.createElement('button');
            startBtn.className = 'start-btn';
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start Learning';
            startBtn.onclick = () => window.location.href = `course.html?module=${moduleId}`;
            
            actionsDiv.appendChild(startBtn);
            card.appendChild(actionsDiv);
        }
        
        // Add review button if not exists
        if (!card.querySelector('.review-btn')) {
            const reviewBtn = document.createElement('button');
            reviewBtn.className = 'review-btn';
            reviewBtn.innerHTML = '<i class="fas fa-star"></i> Rate Course';
            reviewBtn.onclick = () => showReviewModal(moduleId);
            actionsDiv.appendChild(reviewBtn);
        }
    });
}

// Export for use in course.html
window.progressTracker = progressTracker;
window.notesSystem = notesSystem;
window.globalSearch = globalSearch;

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
    }
});