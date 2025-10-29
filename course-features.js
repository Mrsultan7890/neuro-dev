// Course Search & Filter System
function searchCourses() {
    const searchTerm = document.getElementById('course-search').value.toLowerCase();
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
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

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    }
}

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

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const themeIcon = document.querySelector('#theme-toggle i');
    
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
    
    // Update progress display
    setTimeout(() => {
        progressTracker.updateProgressDisplay();
    }, 500);
});

// Export for use in course.html
window.progressTracker = progressTracker;
window.notesSystem = notesSystem;