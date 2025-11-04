// Crypto Playground Application
class CryptoPlaygroundApp {
    constructor() {
        this.setupApp();
    }

    setupApp() {
        this.setupEventListeners();
        this.loadChallenges();
    }

    setupEventListeners() {
        const encodeBtn = document.getElementById('crypto-encode-btn');
        const decodeBtn = document.getElementById('crypto-decode-btn');
        const hashBtn = document.getElementById('crypto-hash-btn');
        const crackBtn = document.getElementById('crypto-crack-btn');

        if (encodeBtn) encodeBtn.addEventListener('click', () => this.performEncoding());
        if (decodeBtn) decodeBtn.addEventListener('click', () => this.performDecoding());
        if (hashBtn) hashBtn.addEventListener('click', () => this.performHashing());
        if (crackBtn) crackBtn.addEventListener('click', () => this.performCracking());
    }

    loadChallenges() {
        const challengesList = document.getElementById('crypto-challenges-list');
        if (!challengesList) return;

        const challenges = [
            {
                id: 'caesar1',
                title: 'Caesar Cipher #1',
                cipher: 'QHXUR{FDHVDU_FLSKHU_FUDFNHG}',
                hint: 'Shift by 3',
                flag: 'NEURO{CAESAR_CIPHER_CRACKED}'
            },
            {
                id: 'base64_1',
                title: 'Base64 Challenge',
                cipher: 'TkVVUk97YmFzZTY0X2RlY29kZWRfZmxhZ30=',
                hint: 'Standard encoding',
                flag: 'NEURO{base64_decoded_flag}'
            },
            {
                id: 'rot13_1',
                title: 'ROT13 Cipher',
                cipher: 'ARHEB{ebg13_pvcure_fbyirq}',
                hint: 'Rotate by 13',
                flag: 'NEURO{rot13_cipher_solved}'
            }
        ];

        challengesList.innerHTML = '';
        challenges.forEach(challenge => {
            const challengeDiv = document.createElement('div');
            challengeDiv.className = 'crypto-challenge';
            challengeDiv.innerHTML = `
                <h4>${challenge.title}</h4>
                <div class="cipher-text">${challenge.cipher}</div>
                <div class="challenge-hint">💡 ${challenge.hint}</div>
                <button onclick="cryptoPlaygroundApp.solveChallenge('${challenge.id}', '${challenge.flag}')">
                    Solve Challenge
                </button>
            `;
            challengesList.appendChild(challengeDiv);
        });
    }

    performEncoding() {
        const input = document.getElementById('crypto-input').value;
        const method = document.getElementById('crypto-method').value;
        const output = document.getElementById('crypto-output');

        if (!input) {
            output.innerHTML = '<div class="crypto-error">Please enter text to encode</div>';
            return;
        }

        let result = '';
        switch (method) {
            case 'base64':
                result = btoa(input);
                break;
            case 'caesar':
                result = this.caesarCipher(input, 3);
                break;
            case 'rot13':
                result = this.rot13(input);
                break;
            case 'hex':
                result = Array.from(input).map(c => c.charCodeAt(0).toString(16)).join('');
                break;
            default:
                result = input;
        }

        output.innerHTML = `
            <div class="crypto-result">
                <h4>Encoded Result (${method.toUpperCase()}):</h4>
                <div class="result-text">${result}</div>
            </div>
        `;
    }

    performDecoding() {
        const input = document.getElementById('crypto-input').value;
        const method = document.getElementById('crypto-method').value;
        const output = document.getElementById('crypto-output');

        if (!input) {
            output.innerHTML = '<div class="crypto-error">Please enter text to decode</div>';
            return;
        }

        let result = '';
        try {
            switch (method) {
                case 'base64':
                    result = atob(input);
                    break;
                case 'caesar':
                    result = this.caesarCipher(input, -3);
                    break;
                case 'rot13':
                    result = this.rot13(input);
                    break;
                case 'hex':
                    result = input.match(/.{2}/g).map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
                    break;
                default:
                    result = input;
            }
        } catch (e) {
            result = 'Decoding failed - invalid format';
        }

        output.innerHTML = `
            <div class="crypto-result">
                <h4>Decoded Result (${method.toUpperCase()}):</h4>
                <div class="result-text">${result}</div>
            </div>
        `;
    }

    performHashing() {
        const input = document.getElementById('crypto-input').value;
        const output = document.getElementById('crypto-output');

        if (!input) {
            output.innerHTML = '<div class="crypto-error">Please enter text to hash</div>';
            return;
        }

        // Simple hash simulation (not cryptographically secure)
        const md5Hash = this.simpleHash(input, 'md5');
        const sha1Hash = this.simpleHash(input, 'sha1');
        const sha256Hash = this.simpleHash(input, 'sha256');

        output.innerHTML = `
            <div class="crypto-result">
                <h4>Hash Results:</h4>
                <div class="hash-result">
                    <strong>MD5:</strong> ${md5Hash}
                </div>
                <div class="hash-result">
                    <strong>SHA1:</strong> ${sha1Hash}
                </div>
                <div class="hash-result">
                    <strong>SHA256:</strong> ${sha256Hash}
                </div>
            </div>
        `;
    }

    performCracking() {
        const hash = document.getElementById('crypto-input').value;
        const output = document.getElementById('crypto-output');

        if (!hash) {
            output.innerHTML = '<div class="crypto-error">Please enter hash to crack</div>';
            return;
        }

        // Simulate hash cracking with common passwords
        const commonPasswords = ['password', '123456', 'admin', 'root', 'test', 'hello', 'world'];
        
        output.innerHTML = '<div class="crack-progress">🔍 Cracking hash...</div>';

        setTimeout(() => {
            let cracked = false;
            for (let password of commonPasswords) {
                if (this.simpleHash(password, 'md5') === hash.toLowerCase()) {
                    output.innerHTML = `
                        <div class="crack-success">
                            ✅ Hash cracked!<br>
                            Password: <strong>${password}</strong>
                        </div>
                    `;
                    cracked = true;
                    break;
                }
            }
            
            if (!cracked) {
                output.innerHTML = '<div class="crack-failed">❌ Hash not found in dictionary</div>';
            }
        }, 2000);
    }

    caesarCipher(text, shift) {
        return text.replace(/[A-Za-z]/g, function(char) {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - start + shift + 26) % 26) + start);
        });
    }

    rot13(text) {
        return text.replace(/[A-Za-z]/g, function(char) {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
        });
    }

    simpleHash(input, type) {
        // Simple hash simulation for demo purposes
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        const hashStr = Math.abs(hash).toString(16);
        
        switch (type) {
            case 'md5':
                return hashStr.padStart(32, '0').substring(0, 32);
            case 'sha1':
                return hashStr.padStart(40, '0').substring(0, 40);
            case 'sha256':
                return hashStr.padStart(64, '0').substring(0, 64);
            default:
                return hashStr;
        }
    }

    solveChallenge(challengeId, flag) {
        const output = document.getElementById('crypto-output');
        
        switch (challengeId) {
            case 'caesar1':
                const decoded = this.caesarCipher('QHXUR{FDHVDU_FLSKHU_FUDFNHG}', -3);
                output.innerHTML = `
                    <div class="challenge-solved">
                        🎉 Challenge Solved!<br>
                        Decoded: ${decoded}<br>
                        Flag: <strong>${flag}</strong>
                    </div>
                `;
                break;
            case 'base64_1':
                const b64decoded = atob('TkVVUk97YmFzZTY0X2RlY29kZWRfZmxhZ30=');
                output.innerHTML = `
                    <div class="challenge-solved">
                        🎉 Challenge Solved!<br>
                        Decoded: ${b64decoded}<br>
                        Flag: <strong>${flag}</strong>
                    </div>
                `;
                break;
            case 'rot13_1':
                const rot13decoded = this.rot13('ARHEB{ebg13_pvcure_fbyirq}');
                output.innerHTML = `
                    <div class="challenge-solved">
                        🎉 Challenge Solved!<br>
                        Decoded: ${rot13decoded}<br>
                        Flag: <strong>${flag}</strong>
                    </div>
                `;
                break;
        }

        // Submit flag automatically
        if (window.flagSystem) {
            window.flagSystem.addFlag(flag);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('crypto-playground-app')) {
        window.cryptoPlaygroundApp = new CryptoPlaygroundApp();
    }
});