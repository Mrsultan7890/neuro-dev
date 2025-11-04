// Window Controls Fix for Digital Forensics and Mobile Hacking Apps

function closeApp(appName) {
    const appWindow = document.getElementById(`${appName}-app`);
    if (appWindow) {
        appWindow.classList.remove('active');
        appWindow.style.display = 'none';
    }
    
    // Remove active from taskbar icon
    const icon = document.querySelector(`[data-app="${appName}"]`);
    if (icon) {
        icon.classList.remove('active');
    }
}

function minimizeApp(appName) {
    const appWindow = document.getElementById(`${appName}-app`);
    if (appWindow) {
        appWindow.style.transform = 'scale(0.1)';
        appWindow.style.opacity = '0';
        setTimeout(() => {
            appWindow.classList.remove('active');
            appWindow.style.display = 'none';
            appWindow.style.transform = 'scale(1)';
            appWindow.style.opacity = '1';
        }, 200);
    }
}

function maximizeApp(appName) {
    const appWindow = document.getElementById(`${appName}-app`);
    if (appWindow) {
        if (appWindow.classList.contains('maximized')) {
            appWindow.classList.remove('maximized');
            appWindow.style.width = '80%';
            appWindow.style.height = '70%';
            appWindow.style.top = '15%';
            appWindow.style.left = '10%';
        } else {
            appWindow.classList.add('maximized');
            appWindow.style.width = '100%';
            appWindow.style.height = '100%';
            appWindow.style.top = '0';
            appWindow.style.left = '0';
        }
    }
}

// Initialize apps content when they are opened
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        // Initialize Digital Forensics App
        if (window.DigitalForensicsApp && !window.forensicsApp) {
            window.forensicsApp = new DigitalForensicsApp();
            const forensicsContent = document.getElementById('forensics-content');
            if (forensicsContent) {
                forensicsContent.innerHTML = window.forensicsApp.createInterface();
            }
        }
        
        // Initialize Mobile Hacking App  
        if (window.MobileHackingApp && !window.mobileApp) {
            window.mobileApp = new MobileHackingApp();
            const mobileContent = document.getElementById('mobile-content');
            if (mobileContent) {
                mobileContent.innerHTML = window.mobileApp.createInterface();
            }
        }
    }, 1500);
});