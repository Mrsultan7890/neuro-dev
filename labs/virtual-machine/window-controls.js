// Window Control Functions
function minimizeWindow(appId) {
    const app = document.getElementById(appId);
    if (app) {
        app.style.transform = 'scale(0.1)';
        app.style.opacity = '0';
        setTimeout(() => {
            app.classList.remove('active');
            app.style.transform = '';
            app.style.opacity = '';
        }, 300);
        
        // Update taskbar
        const taskbarIcon = document.querySelector(`[data-app="${appId.replace('-app', '')}"]`);
        if (taskbarIcon) {
            taskbarIcon.classList.remove('active');
        }
    }
}

function maximizeWindow(appId) {
    const app = document.getElementById(appId);
    if (app) {
        if (app.classList.contains('maximized')) {
            // Restore
            app.classList.remove('maximized');
            app.style.cssText = '';
        } else {
            // Maximize
            app.classList.add('maximized');
            app.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 1000 !important;
                border-radius: 0 !important;
            `;
        }
    }
}

function closeWindow(appId) {
    const app = document.getElementById(appId);
    if (app) {
        app.style.transform = 'scale(0.8)';
        app.style.opacity = '0';
        setTimeout(() => {
            app.classList.remove('active');
            app.style.transform = '';
            app.style.opacity = '';
        }, 200);
        
        // Update taskbar
        const taskbarIcon = document.querySelector(`[data-app="${appId.replace('-app', '')}"]`);
        if (taskbarIcon) {
            taskbarIcon.classList.remove('active');
        }
    }
}