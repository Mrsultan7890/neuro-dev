// Browser initialization helper
window.initBrowserApp = function() {
    console.log('Initializing browser app...');
    
    // Check if browser app exists
    const browserApp = document.getElementById('browser-app');
    if (!browserApp) {
        console.error('Browser app not found');
        return false;
    }
    
    // Check if Firefox browser is already initialized
    if (window.firefoxBrowser) {
        console.log('Firefox browser already initialized');
        return true;
    }
    
    // Initialize Firefox browser
    try {
        if (window.FirefoxBrowser) {
            console.log('Creating new Firefox browser instance...');
            window.firefoxBrowser = new FirefoxBrowser();
            console.log('Firefox browser initialized successfully');
            return true;
        } else {
            console.error('FirefoxBrowser class not available');
            return false;
        }
    } catch (error) {
        console.error('Error initializing Firefox browser:', error);
        return false;
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Browser init script loaded');
    
    // Wait for other scripts to load
    setTimeout(() => {
        if (document.getElementById('browser-app')) {
            window.initBrowserApp();
        }
    }, 2000);
});

// Manual browser activation
window.activateBrowser = function() {
    console.log('Manually activating browser...');
    
    // Switch to browser app
    if (window.vm && window.vm.switchApp) {
        window.vm.switchApp('browser');
    }
    
    // Initialize if not already done
    setTimeout(() => {
        if (!window.firefoxBrowser) {
            window.initBrowserApp();
        }
    }, 500);
};