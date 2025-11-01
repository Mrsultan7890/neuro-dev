// Flag Submission System
class FlagSystem {
    constructor() {
        this.flags = new Map();
        this.userFlags = new Set();
        this.init();
    }

    init() {
        this.loadFlags();
        this.createFlagSubmissionUI();
        this.setupEventListeners();
    }

    loadFlags() {
        // CTF Challenge Flags
        const ctfFlags = [
            { id: 'basic_recon', flag: 'NEURO{basic_reconnaissance_complete}', points: 50, category: 'Reconnaissance' },
            { id: 'port_scan', flag: 'NEURO{port_scanning_master}', points: 75, category: 'Network Scanning' },
            { id: 'web_vuln', flag: 'NEURO{web_vulnerability_found}', points: 100, category: 'Web Security' },
            { id: 'sql_injection', flag: 'NEURO{sql_injection_success}', points: 150, category: 'Database Security' },
            { id: 'xss_exploit', flag: 'NEURO{xss_payload_executed}', points: 125, category: 'Client-Side Security' },
            { id: 'privilege_escalation', flag: 'NEURO{root_access_gained}', points: 200, category: 'Privilege Escalation' },
            { id: 'crypto_challenge', flag: 'NEURO{cryptography_decoded}', points: 175, category: 'Cryptography' },
            { id: 'steganography', flag: 'NEURO{hidden_message_found}', points: 100, category: 'Steganography' },
            { id: 'reverse_engineering', flag: 'NEURO{binary_analyzed}', points: 250, category: 'Reverse Engineering' },
            { id: 'forensics_analysis', flag: 'NEURO{evidence_recovered}', points: 200, category: 'Digital Forensics' },
            { id: 'social_engineering', flag: 'NEURO{human_factor_exploited}', points: 150, category: 'Social Engineering' },
            { id: 'wireless_hacking', flag: 'NEURO{wifi_network_compromised}', points: 175, category: 'Wireless Security' },
            
            // AI Security Flags
            { id: 'prompt_injection', flag: 'NEURO{ai_prompt_injected}', points: 100, category: 'AI Security' },
            { id: 'model_extraction', flag: 'NEURO{ai_model_extracted}', points: 200, category: 'AI Security' },
            { id: 'adversarial_attack', flag: 'NEURO{adversarial_example_crafted}', points: 175, category: 'AI Security' },
            { id: 'data_poisoning', flag: 'NEURO{training_data_poisoned}', points: 225, category: 'AI Security' },
            { id: 'privacy_attack', flag: 'NEURO{private_data_extracted}', points: 150, category: 'AI Security' },
            { id: 'jailbreak_success', flag: 'NEURO{ai_safety_bypassed}', points: 125, category: 'AI Security' },
            
            // Banking Security Flags
            { id: 'bank_login_bypass', flag: 'BANK{sql_injection_bypass}', points: 100, category: 'Banking Security' },
            { id: 'bank_session_hijack', flag: 'BANK{session_token_stolen}', points: 150, category: 'Banking Security' },
            { id: 'bank_payment_bypass', flag: 'BANK{payment_manipulation}', points: 200, category: 'Banking Security' },
            { id: 'bank_admin_access', flag: 'BANK{admin_access_gained}', points: 250, category: 'Banking Security' },
            { id: 'bank_crypto_wallet', flag: 'BANK{crypto_wallet_hacked}', points: 175, category: 'Banking Security' },
            { id: 'bank_insider_threat', flag: 'BANK{insider_threat_detected}', points: 225, category: 'Banking Security' },
            
            // Terminal Command Generated Flags
            { id: 'api_exploit', flag: 'NEURO{api_secret_key_2024}', points: 150, category: 'Web Security' },
            { id: 'model_extraction_ctf', flag: 'NEURO{extracted_model_hash_abc123}', points: 200, category: 'AI Security' },
            { id: 'hidden_login', flag: 'NEURO{hidden_admin_password_xyz789}', points: 125, category: 'Web Security' },
            { id: 'file_discovery', flag: 'NEURO{hidden_file_content_def456}', points: 100, category: 'Digital Forensics' },
            { id: 'model_poisoning', flag: 'NEURO{poisoned_model_trigger_neuro2024}', points: 250, category: 'AI Security' },
            { id: 'mobile_trojan', flag: 'NEURO{trojan_c2_server_evil_banking}', points: 200, category: 'Mobile Security' },
            { id: 'quantum_crypto', flag: 'NEURO{quantum_decrypted_msg_supremacy}', points: 300, category: 'Cryptography' },
            { id: '5g_network', flag: 'NEURO{5g_intercepted_data_iot_emergency}', points: 275, category: 'Network Security' },
            { id: 'satellite_hack', flag: 'NEURO{satellite_command_code_SPACE_CTRL_2024}', points: 350, category: 'Satellite Security' },
            { id: 'deepfake_detection', flag: 'NEURO{deepfake_signature_STYLEGAN2_2024}', points: 225, category: 'AI Security' },
            { id: 'bank_forensics', flag: 'BANK{insider_threat_detected_employee_malicious}', points: 300, category: 'Banking Security' },
            { id: 'bank_sqli_bypass', flag: 'BANK{sql_injection_bypass_admin123}', points: 150, category: 'Banking Security' },
            { id: 'bank_payment_mod', flag: 'BANK{payment_manipulation_amount_modified}', points: 200, category: 'Banking Security' },
            
            // Browser CTF Challenge Flags
            { id: 'web_sqli_db', flag: 'NEURO{sql_injection_database_pwned}', points: 125, category: 'Web Security' },
            { id: 'web_xss_exec', flag: 'NEURO{xss_payload_executed_successfully}', points: 100, category: 'Web Security' },
            { id: 'web_lfi_passwd', flag: 'NEURO{local_file_inclusion_passwd_read}', points: 150, category: 'Web Security' },
            { id: 'crypto_caesar', flag: 'NEURO{caesar_cipher_cracked}', points: 75, category: 'Cryptography' },
            { id: 'crypto_base64', flag: 'NEURO{base64_decoded_flag}', points: 50, category: 'Cryptography' },
            { id: 'crypto_rsa_weak', flag: 'NEURO{weak_rsa_factored_successfully}', points: 200, category: 'Cryptography' },
            { id: 'forensics_memory', flag: 'NEURO{memory_forensics_malware_found}', points: 175, category: 'Digital Forensics' },
            { id: 'forensics_network', flag: 'NEURO{network_forensics_c2_detected}', points: 150, category: 'Digital Forensics' },
            { id: 'forensics_disk', flag: 'NEURO{disk_forensics_hidden_partition}', points: 200, category: 'Digital Forensics' },
            { id: 'osint_social', flag: 'NEURO{osint_social_media_geolocation}', points: 125, category: 'OSINT' },
            { id: 'osint_metadata', flag: 'NEURO{osint_image_metadata_gps_coords}', points: 100, category: 'OSINT' },
            { id: 'osint_domain', flag: 'NEURO{osint_domain_hidden_subdomain}', points: 150, category: 'OSINT' }
        ];

        ctfFlags.forEach(flagData => {
            this.flags.set(flagData.flag, flagData);
        });
    }

    createFlagSubmissionUI() {
        // Create flag submission modal
        const modal = document.createElement('div');
        modal.id = 'flag-submission-modal';
        modal.className = 'flag-modal';
        modal.innerHTML = `
            <div class="flag-modal-content">
                <div class="flag-modal-header">
                    <h3><i class="fas fa-flag"></i> Submit Flag</h3>
                    <button class="flag-close-btn" onclick="flagSystem.closeFlagModal()">&times;</button>
                </div>
                <div class="flag-modal-body">
                    <div class="flag-input-group">
                        <label for="flag-input">Enter Flag:</label>
                        <input type="text" id="flag-input" placeholder="NEURO{flag_here}" autocomplete="off">
                        <button id="submit-flag-btn" onclick="flagSystem.submitFlag()">
                            <i class="fas fa-paper-plane"></i> Submit
                        </button>
                    </div>
                    <div class="flag-hint" id="flag-hint">
                        💡 Flags usually start with NEURO{} or BANK{}
                    </div>
                    <div class="flag-result" id="flag-result"></div>
                </div>
                <div class="flag-modal-footer">
                    <div class="flag-stats">
                        <div class="stat">
                            <span class="stat-label">Flags Found:</span>
                            <span class="stat-value" id="flags-found-count">0</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Total Points:</span>
                            <span class="stat-value" id="total-points-count">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Create flag submission button in taskbar
        const flagBtn = document.createElement('div');
        flagBtn.className = 'flag-submit-btn';
        flagBtn.innerHTML = '<i class="fas fa-flag"></i>';
        flagBtn.title = 'Submit Flag';
        flagBtn.onclick = () => this.showFlagModal();
        
        const systemTray = document.querySelector('.system-tray');
        if (systemTray) {
            systemTray.insertBefore(flagBtn, systemTray.firstChild);
        }
    }

    setupEventListeners() {
        // Enter key submission
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.getElementById('flag-input') === document.activeElement) {
                this.submitFlag();
            }
        });

        // Close modal on outside click
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('flag-submission-modal');
            if (e.target === modal) {
                this.closeFlagModal();
            }
        });
    }

    showFlagModal() {
        const modal = document.getElementById('flag-submission-modal');
        modal.style.display = 'flex';
        document.getElementById('flag-input').focus();
        this.updateStats();
    }

    closeFlagModal() {
        const modal = document.getElementById('flag-submission-modal');
        modal.style.display = 'none';
        document.getElementById('flag-input').value = '';
        document.getElementById('flag-result').innerHTML = '';
    }

    submitFlag() {
        const input = document.getElementById('flag-input');
        const result = document.getElementById('flag-result');
        const flag = input.value.trim();

        if (!flag) {
            this.showResult('Please enter a flag!', 'error');
            return;
        }

        // Check if flag exists
        if (this.flags.has(flag)) {
            const flagData = this.flags.get(flag);
            
            // Check if already submitted
            if (this.userFlags.has(flag)) {
                this.showResult('Flag already submitted!', 'warning');
                return;
            }

            // Add to user flags
            this.userFlags.add(flag);
            
            // Update user system
            if (window.userSystem) {
                window.userSystem.addPoints(flagData.points);
                window.userSystem.incrementFlags();
            }

            // Show success message
            this.showResult(`
                <div class="flag-success">
                    <i class="fas fa-check-circle"></i>
                    <h4>Flag Accepted!</h4>
                    <p><strong>Category:</strong> ${flagData.category}</p>
                    <p><strong>Points:</strong> +${flagData.points}</p>
                </div>
            `, 'success');

            // Update stats
            this.updateStats();

            // Clear input
            input.value = '';

            // Add to terminal if active
            if (window.terminal) {
                window.terminal.addLine(`Flag submitted successfully! +${flagData.points} points`, 'success');
            }

            // Save progress
            this.saveProgress();

        } else {
            this.showResult('Invalid flag! Try again.', 'error');
        }
    }

    showResult(message, type) {
        const result = document.getElementById('flag-result');
        result.innerHTML = message;
        result.className = `flag-result ${type}`;
        
        // Auto-hide after 3 seconds for non-success messages
        if (type !== 'success') {
            setTimeout(() => {
                result.innerHTML = '';
                result.className = 'flag-result';
            }, 3000);
        }
    }

    updateStats() {
        const flagsCount = document.getElementById('flags-found-count');
        const pointsCount = document.getElementById('total-points-count');
        
        if (flagsCount) {
            flagsCount.textContent = this.userFlags.size;
        }
        
        if (pointsCount && window.userSystem) {
            pointsCount.textContent = window.userSystem.getCurrentUser().totalPoints || 0;
        }
    }

    saveProgress() {
        try {
            const progress = {
                flags: Array.from(this.userFlags),
                timestamp: Date.now()
            };
            localStorage.setItem('neuro-dev-flags', JSON.stringify(progress));
        } catch (error) {
            console.error('Error saving flag progress:', error);
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('neuro-dev-flags');
            if (saved) {
                const progress = JSON.parse(saved);
                this.userFlags = new Set(progress.flags || []);
                this.updateStats();
            }
        } catch (error) {
            console.error('Error loading flag progress:', error);
        }
    }

    // Helper method to add flag from terminal/apps
    addFlag(flagText) {
        if (this.flags.has(flagText) && !this.userFlags.has(flagText)) {
            this.userFlags.add(flagText);
            const flagData = this.flags.get(flagText);
            
            if (window.userSystem) {
                window.userSystem.addPoints(flagData.points);
                window.userSystem.incrementFlags();
            }
            
            this.saveProgress();
            return true;
        }
        return false;
    }

    // Get all available flags for a category
    getFlagsByCategory(category) {
        const categoryFlags = [];
        this.flags.forEach((flagData, flag) => {
            if (flagData.category === category) {
                categoryFlags.push({
                    flag: flag,
                    ...flagData,
                    submitted: this.userFlags.has(flag)
                });
            }
        });
        return categoryFlags;
    }

    // Check if user has submitted a specific flag
    hasFlag(flagText) {
        return this.userFlags.has(flagText);
    }

    // Get user's progress
    getProgress() {
        const totalFlags = this.flags.size;
        const submittedFlags = this.userFlags.size;
        const totalPoints = Array.from(this.userFlags).reduce((sum, flag) => {
            const flagData = this.flags.get(flag);
            return sum + (flagData ? flagData.points : 0);
        }, 0);

        return {
            totalFlags,
            submittedFlags,
            totalPoints,
            percentage: Math.round((submittedFlags / totalFlags) * 100)
        };
    }
}

// Initialize flag system
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.flagSystem = new FlagSystem();
        window.flagSystem.loadProgress();
    }, 200);
});