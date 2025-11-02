// Debug console commands
window.debugBrowser = function() {
    console.log('=== Browser Debug Info ===');
    console.log('Browser app element:', document.getElementById('browser-app'));
    console.log('Firefox browser instance:', window.firefoxBrowser);
    console.log('Firefox browser class:', window.FirefoxBrowser);
    console.log('VM instance:', window.vm);
    console.log('Active app:', window.vm ? window.vm.activeApp : 'VM not found');
    
    // Check if browser app is active
    const browserApp = document.getElementById('browser-app');
    if (browserApp) {
        console.log('Browser app classes:', browserApp.className);
        console.log('Browser app content length:', browserApp.innerHTML.length);
    }
    
    return {
        browserApp: !!document.getElementById('browser-app'),
        firefoxBrowser: !!window.firefoxBrowser,
        firefoxClass: !!window.FirefoxBrowser,
        vm: !!window.vm,
        activeApp: window.vm ? window.vm.activeApp : null
    };
};

window.fixBrowser = function() {
    console.log('Attempting to fix browser...');
    
    // Force switch to browser app
    if (window.vm && window.vm.switchApp) {
        console.log('Switching to browser app...');
        window.vm.switchApp('browser');
    }
    
    // Force initialize Firefox browser
    setTimeout(() => {
        if (!window.firefoxBrowser && window.FirefoxBrowser) {
            console.log('Force initializing Firefox browser...');
            try {
                window.firefoxBrowser = new FirefoxBrowser();
                console.log('Firefox browser force initialized');
            } catch (error) {
                console.error('Force initialization failed:', error);
            }
        }
    }, 1000);
};

// Add to global scope
window.debug = {
    browser: window.debugBrowser,
    fix: window.fixBrowser
};

console.log('Debug console loaded. Use debug.browser() to check status, debug.fix() to fix issues.');