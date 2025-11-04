// Force initialize apps with content

function forceInitializeApps() {
    console.log('Force initializing apps...');
    
    // Digital Forensics App
    setTimeout(() => {
        if (window.DigitalForensicsApp) {
            window.forensicsApp = new DigitalForensicsApp();
            const content = document.getElementById('forensics-content');
            if (content) {
                content.innerHTML = window.forensicsApp.createInterface();
                console.log('Digital Forensics content loaded');
            }
        }
    }, 1000);
    
    // Mobile Hacking App
    setTimeout(() => {
        if (window.MobileHackingApp) {
            window.mobileApp = new MobileHackingApp();
            const content = document.getElementById('mobile-content');
            if (content) {
                content.innerHTML = window.mobileApp.createInterface();
                console.log('Mobile Hacking content loaded');
            }
        }
    }, 1500);
}

// Run on page load
window.addEventListener('load', forceInitializeApps);

// Also run after a delay
setTimeout(forceInitializeApps, 3000);