// Network Simulator Application
class NetworkSimulatorApp {
    constructor() {
        this.networks = new Map();
        this.devices = new Map();
        this.connections = new Map();
        this.scanResults = new Map();
        this.setupApp();
    }

    setupApp() {
        this.initializeNetworks();
        this.setupEventListeners();
    }

    initializeNetworks() {
        // Create sample networks
        this.networks.set('192.168.1.0/24', {
            name: 'Home Network',
            gateway: '192.168.1.1',
            devices: ['192.168.1.1', '192.168.1.100', '192.168.1.101', '192.168.1.102']
        });

        this.networks.set('10.0.0.0/8', {
            name: 'Corporate Network',
            gateway: '10.0.0.1',
            devices: ['10.0.0.1', '10.0.0.50', '10.0.0.51', '10.0.0.100']
        });

        // Initialize devices
        this.devices.set('192.168.1.1', {
            type: 'router',
            os: 'RouterOS',
            ports: [22, 80, 443, 8080],
            services: ['SSH', 'HTTP', 'HTTPS', 'Web Admin']
        });

        this.devices.set('192.168.1.100', {
            type: 'server',
            os: 'Ubuntu 20.04',
            ports: [22, 80, 443, 3306],
            services: ['SSH', 'Apache', 'MySQL']
        });

        this.devices.set('192.168.1.101', {
            type: 'workstation',
            os: 'Windows 10',
            ports: [135, 139, 445, 3389],
            services: ['RPC', 'NetBIOS', 'SMB', 'RDP']
        });
    }

    setupEventListeners() {
        const scanBtn = document.getElementById('network-scan-btn');
        const pingBtn = document.getElementById('network-ping-btn');
        const traceBtn = document.getElementById('network-trace-btn');
        const portScanBtn = document.getElementById('port-scan-btn');

        if (scanBtn) scanBtn.addEventListener('click', () => this.performNetworkScan());
        if (pingBtn) pingBtn.addEventListener('click', () => this.performPing());
        if (traceBtn) traceBtn.addEventListener('click', () => this.performTraceroute());
        if (portScanBtn) portScanBtn.addEventListener('click', () => this.performPortScan());
    }

    performNetworkScan() {
        const target = document.getElementById('network-target').value || '192.168.1.0/24';
        const output = document.getElementById('network-output');
        
        output.innerHTML = '<div class="scan-header">🔍 Network Discovery Scan</div>';
        output.innerHTML += `<div class="scan-info">Target: ${target}</div>`;
        
        setTimeout(() => {
            const network = this.networks.get(target);
            if (network) {
                output.innerHTML += `<div class="scan-result">Network: ${network.name}</div>`;
                output.innerHTML += `<div class="scan-result">Gateway: ${network.gateway}</div>`;
                output.innerHTML += '<div class="scan-result">Active Hosts:</div>';
                
                network.devices.forEach(ip => {
                    const device = this.devices.get(ip);
                    const deviceType = device ? device.type : 'unknown';
                    output.innerHTML += `<div class="host-found">✅ ${ip} (${deviceType})</div>`;
                });
            } else {
                output.innerHTML += '<div class="scan-error">❌ Network not found</div>';
            }
        }, 1500);
    }

    performPing() {
        const target = document.getElementById('ping-target').value || '192.168.1.1';
        const output = document.getElementById('network-output');
        
        output.innerHTML = `<div class="ping-header">🏓 Ping Test to ${target}</div>`;
        
        let count = 0;
        const pingInterval = setInterval(() => {
            if (count >= 4) {
                clearInterval(pingInterval);
                output.innerHTML += '<div class="ping-summary">--- Ping Statistics ---</div>';
                output.innerHTML += '<div class="ping-summary">4 packets transmitted, 4 received, 0% packet loss</div>';
                return;
            }
            
            const time = (Math.random() * 50 + 10).toFixed(1);
            output.innerHTML += `<div class="ping-result">64 bytes from ${target}: icmp_seq=${count + 1} time=${time} ms</div>`;
            count++;
        }, 800);
    }

    performTraceroute() {
        const target = document.getElementById('trace-target').value || '8.8.8.8';
        const output = document.getElementById('network-output');
        
        output.innerHTML = `<div class="trace-header">🛤️ Traceroute to ${target}</div>`;
        
        const hops = [
            '192.168.1.1',
            '10.0.0.1', 
            '203.0.113.1',
            '198.51.100.1',
            target
        ];
        
        let hopCount = 0;
        const traceInterval = setInterval(() => {
            if (hopCount >= hops.length) {
                clearInterval(traceInterval);
                return;
            }
            
            const time = (Math.random() * 30 + 5).toFixed(1);
            output.innerHTML += `<div class="trace-hop">${hopCount + 1}  ${hops[hopCount]}  ${time} ms</div>`;
            hopCount++;
        }, 1000);
    }

    performPortScan() {
        const target = document.getElementById('portscan-target').value || '192.168.1.100';
        const output = document.getElementById('network-output');
        
        output.innerHTML = `<div class="portscan-header">🔍 Port Scan: ${target}</div>`;
        
        setTimeout(() => {
            const device = this.devices.get(target);
            if (device) {
                output.innerHTML += '<div class="portscan-result">Open Ports:</div>';
                device.ports.forEach((port, index) => {
                    const service = device.services[index] || 'unknown';
                    output.innerHTML += `<div class="port-open">✅ ${port}/tcp - ${service}</div>`;
                });
            } else {
                output.innerHTML += '<div class="portscan-error">❌ Host unreachable</div>';
            }
        }, 2000);
    }

    // Generate network topology
    generateTopology() {
        const canvas = document.getElementById('network-topology');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw simple network diagram
        ctx.fillStyle = '#00ff41';
        ctx.fillRect(50, 50, 60, 40);
        ctx.fillStyle = '#000';
        ctx.fillText('Router', 55, 75);
        
        ctx.fillStyle = '#4ecdc4';
        ctx.fillRect(200, 30, 60, 40);
        ctx.fillText('Server', 205, 55);
        
        ctx.fillRect(200, 100, 60, 40);
        ctx.fillText('PC-1', 210, 125);
        
        // Draw connections
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(110, 70);
        ctx.lineTo(200, 50);
        ctx.moveTo(110, 70);
        ctx.lineTo(200, 120);
        ctx.stroke();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('network-simulator-app')) {
        window.networkSimulatorApp = new NetworkSimulatorApp();
    }
});