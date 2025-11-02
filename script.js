// Mobile Navigation Toggle with enhanced error handling
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Close mobile menu when clicking on a link
if (navMenu) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Simple course navigation - only working functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for course cards (backup navigation)
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        // Only add click to card area, not buttons
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on button
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            const module = card.getAttribute('data-module');
            if (module) {
                window.location.href = `course.html?module=${encodeURIComponent(module)}`;
            }
        });
    });
});

// Navbar background on scroll with throttling
let scrollTimeout;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}, { passive: true });

// Enhanced copy to clipboard with input sanitization
function copyToClipboard(text) {
    if (!text || typeof text !== 'string') {
        console.error('Invalid text provided for copying');
        showCopyError('Invalid text to copy');
        return;
    }
    
    // Sanitize input to prevent XSS
    const sanitizedText = String(text)
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
    
    if (!navigator.clipboard || !window.isSecureContext) {
        fallbackCopyTextToClipboard(sanitizedText);
        return;
    }
    
    navigator.clipboard.writeText(sanitizedText).then(() => {
        showCopySuccess();
    }).catch(err => {
        console.error('Clipboard API failed:', err);
        fallbackCopyTextToClipboard(sanitizedText);
    });
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Fallback copy failed: ', err);
    }
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    showNotification('Command copied!', '#00ff41', '#000');
}

function showCopyError(message) {
    showNotification(message || 'Copy failed!', '#ff6b6b', '#fff');
}

function showNotification(message, bgColor = '#00ff41', textColor = '#000') {
    try {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.copy-notification');
        existingNotifications.forEach(notif => {
            if (notif && notif.parentNode) {
                notif.remove();
            }
        });
        
        // Validate inputs
        if (!message || typeof message !== 'string') {
            console.error('Invalid notification message');
            return;
        }
        
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        
        // Set styles safely
        const styles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: bgColor,
            color: textColor,
            padding: '10px 20px',
            borderRadius: '5px',
            fontWeight: 'bold',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        };
        
        Object.assign(notification.style, styles);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.remove();
            }
        }, 2000);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// Add CSS for notification animation
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification {
            animation: slideIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Make functions globally available
window.copyToClipboard = copyToClipboard;
window.filterCourses = function(level) {
    const courseCards = document.querySelectorAll('.course-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Remove active class from all buttons
    filterBtns.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    const activeBtn = document.querySelector(`[onclick="filterCourses('${level}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Filter course cards
    courseCards.forEach(card => {
        const badge = card.querySelector('.course-badge');
        const badgeText = badge ? badge.textContent.toLowerCase().trim() : '';
        
        if (level === 'all') {
            card.style.display = 'block';
        } else if (badgeText === level) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};

// Missing functions that are called in HTML
window.toggleMenu = function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
};

window.closeMenu = function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
};

window.openVM = function(courseId) {
    if (!courseId || typeof courseId !== 'string') {
        console.error('Invalid course ID for VM');
        return;
    }
    
    // Use relative path that works with any server setup
    const vmUrl = './labs/virtual-machine/index.html?course=' + encodeURIComponent(courseId);
    
    // Try to open in new window, fallback to same window if popup blocked
    try {
        const newWindow = window.open(vmUrl, '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes,toolbar=no,menubar=no');
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            // Popup blocked, open in same window
            window.location.href = vmUrl;
        }
    } catch (e) {
        // Fallback to same window
        window.location.href = vmUrl;
    }
};

window.spawnMachine = function(machineId) {
    if (!machineId || typeof machineId !== 'string') {
        console.error('Invalid machine ID');
        return;
    }
    
    showNotification(`🚀 Spawning ${machineId} machine...`, '#00ff41', '#000');
    
    setTimeout(() => {
        openVM('nethunter-tools');
    }, 2000);
};