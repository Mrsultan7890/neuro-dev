// App Content Loader - Ensures apps load their content properly

document.addEventListener('DOMContentLoaded', function() {
    // Wait for all scripts to load
    setTimeout(() => {
        initializeAppContent();
    }, 2000);
});

function initializeAppContent() {
    // Initialize Digital Forensics App
    if (window.DigitalForensicsApp && !window.forensicsApp) {
        try {
            window.forensicsApp = new DigitalForensicsApp();
            const forensicsContent = document.getElementById('forensics-content');
            if (forensicsContent && forensicsContent.innerHTML.trim() === '') {
                forensicsContent.innerHTML = window.forensicsApp.createInterface();
                console.log('Digital Forensics app content loaded');
            }
        } catch (error) {
            console.error('Error initializing Digital Forensics app:', error);
        }
    }
    
    // Initialize Mobile Hacking App
    if (window.MobileHackingApp && !window.mobileApp) {
        try {
            window.mobileApp = new MobileHackingApp();
            const mobileContent = document.getElementById('mobile-content');
            if (mobileContent && mobileContent.innerHTML.trim() === '') {
                mobileContent.innerHTML = window.mobileApp.createInterface();
                console.log('Mobile Hacking app content loaded');
            }
        } catch (error) {
            console.error('Error initializing Mobile Hacking app:', error);
        }
    }
}

// Force content loading when apps are opened
function forceLoadAppContent(appName) {
    if (appName === 'digital-forensics') {
        if (window.forensicsApp) {
            const forensicsContent = document.getElementById('forensics-content');
            if (forensicsContent && forensicsContent.innerHTML.trim() === '') {
                forensicsContent.innerHTML = window.forensicsApp.createInterface();
            }
        }
    } else if (appName === 'mobile-hacking') {
        if (window.mobileApp) {
            const mobileContent = document.getElementById('mobile-content');
            if (mobileContent && mobileContent.innerHTML.trim() === '') {
                mobileContent.innerHTML = window.mobileApp.createInterface();
            }
        }
    }
}

// Override VM switchApp to ensure content loading
if (window.vm && window.vm.switchApp) {
    const originalSwitchApp = window.vm.switchApp;
    window.vm.switchApp = function(appName) {
        originalSwitchApp.call(this, appName);
        setTimeout(() => {
            forceLoadAppContent(appName);
        }, 500);
    };
}