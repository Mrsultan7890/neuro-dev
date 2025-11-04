// User Engagement Features for Neuro-Dev

// Progress Tracking System
if (typeof ProgressTracker === 'undefined') {
class ProgressTracker {
    constructor() {
        this.userProgress = JSON.parse(localStorage.getItem('neuro-dev-progress') || '{}');
    }
    
    markLessonComplete(moduleId, lessonId) {
        if (!this.userProgress[moduleId]) {
            this.userProgress[moduleId] = {};
        }
        this.userProgress[moduleId][lessonId] = {
            completed: true,
            completedAt: new Date().toISOString()
        };
        this.saveProgress();
        this.showCompletionAnimation();
        
        // Add XP and log activity
        if (typeof gamificationSystem !== 'undefined') {
            gamificationSystem.addXP(20, 'Lesson Completed');
            this.logActivity(`Completed lesson ${lessonId}`, `Module: ${moduleId}`, '📚');
        }
    }
    
    logActivity(title, description, icon = '📚') {
        const activities = JSON.parse(localStorage.getItem('neuro-dev-activities') || '[]');
        activities.push({
            title: title,
            description: description,
            icon: icon,
            timestamp: new Date().toISOString()
        });
        // Keep only last 50 activities
        if (activities.length > 50) {
            activities.splice(0, activities.length - 50);
        }
        localStorage.setItem('neuro-dev-activities', JSON.stringify(activities));
    }
    
    getModuleProgress(moduleId) {
        const moduleData = this.userProgress[moduleId] || {};
        const completedLessons = Object.keys(moduleData).length;
        return {
            completed: completedLessons,
            total: this.getTotalLessons(moduleId),
            percentage: Math.round((completedLessons / this.getTotalLessons(moduleId)) * 100)
        };
    }
    
    saveProgress() {
        localStorage.setItem('neuro-dev-progress', JSON.stringify(this.userProgress));
    }
    
    showCompletionAnimation() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #00ff41, #00cc33);
            color: #000;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.5s ease;
        `;
        notification.textContent = '🎉 Lesson Complete! Keep going!';
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

}

// Gamification System
if (typeof GamificationSystem === 'undefined') {
class GamificationSystem {
    constructor() {
        this.userStats = JSON.parse(localStorage.getItem('neuro-dev-stats') || '{}');
        this.initializeStats();
    }
    
    initializeStats() {
        if (!this.userStats.level) {
            this.userStats = {
                level: 1,
                xp: 0,
                badges: [],
                streak: 0,
                lastVisit: new Date().toDateString()
            };
        }
    }
    
    addXP(amount, reason) {
        this.userStats.xp += amount;
        this.checkLevelUp();
        this.showXPGain(amount, reason);
        this.checkBadges(reason);
        this.saveStats();
    }
    
    checkBadges(reason) {
        const badges = this.userStats.badges || [];
        
        // XP-based badges
        if (this.userStats.xp >= 100 && !badges.includes('🏆 First 100 XP')) {
            badges.push('🏆 First 100 XP');
        }
        if (this.userStats.xp >= 500 && !badges.includes('🏅 XP Master')) {
            badges.push('🏅 XP Master');
        }
        
        // Activity-based badges
        if (reason === 'Lesson Completed' && !badges.includes('📚 First Lesson')) {
            badges.push('📚 First Lesson');
        }
        if (reason === 'Newsletter Signup' && !badges.includes('📧 Newsletter Subscriber')) {
            badges.push('📧 Newsletter Subscriber');
        }
        
        this.userStats.badges = badges;
    }
    
    checkLevelUp() {
        const newLevel = Math.floor(this.userStats.xp / 100) + 1;
        if (newLevel > this.userStats.level) {
            this.userStats.level = newLevel;
            this.showLevelUp();
        }
    }
    
    showXPGain(amount, reason) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(0, 255, 65, 0.9);
            color: #000;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 10000;
            animation: bounceIn 0.5s ease;
        `;
        notification.textContent = `+${amount} XP - ${this.sanitizeText(reason)}`;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 2000);
    }
    
    sanitizeText(text) {
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
    
    saveStats() {
        localStorage.setItem('neuro-dev-stats', JSON.stringify(this.userStats));
    }
}

}

// Social Features
if (typeof SocialFeatures === 'undefined') {
class SocialFeatures {
    constructor() {
        this.initializeSharing();
    }
    
    shareProgress(moduleId, platform) {
        const progress = progressTracker.getModuleProgress(moduleId);
        const shareText = `Just completed ${progress.percentage}% of ${moduleId} on Neuro-Dev! 🚀 Learning ethical hacking on mobile 📱 #EthicalHacking #Cybersecurity`;
        
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=https://neurodev.netlify.app`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=https://neurodev.netlify.app`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://neurodev.netlify.app`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' https://neurodev.netlify.app')}`
        };
        
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        gamificationSystem.addXP(10, 'Shared Progress');
    }
    
    initializeSharing() {
        // Add share buttons to course cards
        document.querySelectorAll('.course-card').forEach(card => {
            const shareBtn = document.createElement('button');
            shareBtn.innerHTML = '<i class="fas fa-share"></i> Share Progress';
            shareBtn.className = 'share-btn';
            shareBtn.onclick = () => this.showShareModal(card.dataset.module);
            card.querySelector('.course-actions').appendChild(shareBtn);
        });
    }
    
    showShareModal(moduleId) {
        const sanitizedModuleId = this.sanitizeText(moduleId);
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #1a1a1a;
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #00ff41;
            text-align: center;
        `;
        
        const title = document.createElement('h3');
        title.style.cssText = 'color: #00ff41; margin-bottom: 20px;';
        title.textContent = 'Share Your Progress';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 15px; justify-content: center;';
        
        const platforms = [
            { name: 'twitter', color: '#1da1f2', icon: 'fab fa-twitter', text: 'Twitter' },
            { name: 'facebook', color: '#4267B2', icon: 'fab fa-facebook', text: 'Facebook' },
            { name: 'linkedin', color: '#0077b5', icon: 'fab fa-linkedin', text: 'LinkedIn' },
            { name: 'whatsapp', color: '#25d366', icon: 'fab fa-whatsapp', text: 'WhatsApp' }
        ];
        
        platforms.forEach(platform => {
            const btn = document.createElement('button');
            btn.style.cssText = `background: ${platform.color}; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;`;
            btn.innerHTML = `<i class="${platform.icon}"></i> ${platform.text}`;
            btn.addEventListener('click', () => this.shareProgress(sanitizedModuleId, platform.name));
            buttonContainer.appendChild(btn);
        });
        
        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = `
            background: transparent;
            border: 1px solid #666;
            color: #ccc;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 15px;
        `;
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', () => modal.remove());
        
        modalContent.appendChild(title);
        modalContent.appendChild(buttonContainer);
        modalContent.appendChild(closeBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }
    
    sanitizeText(text) {
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
}

}

// Initialize systems after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.progressTracker === 'undefined' && typeof ProgressTracker !== 'undefined') {
        window.progressTracker = new ProgressTracker();
    }
    if (typeof window.gamificationSystem === 'undefined' && typeof GamificationSystem !== 'undefined') {
        window.gamificationSystem = new GamificationSystem();
    }
    if (typeof window.socialFeatures === 'undefined' && typeof SocialFeatures !== 'undefined') {
        window.socialFeatures = new SocialFeatures();
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .share-btn {
        background: transparent;
        border: 1px solid #00ff41;
        color: #00ff41;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.9rem;
        margin-top: 10px;
        transition: all 0.3s;
    }
    
    .share-btn:hover {
        background: #00ff41;
        color: #000;
    }
`;
document.head.appendChild(style);