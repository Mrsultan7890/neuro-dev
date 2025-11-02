// Interactive Quiz System
class QuizSystem {
    constructor() {
        this.storageKey = 'neuro-dev-quiz-results';
        this.results = this.loadResults();
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
    }

    loadResults() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch (error) {
            return {};
        }
    }

    saveResults() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.results));
    }

    async loadQuiz(moduleId) {
        try {
            const response = await fetch(`data/quiz-${moduleId}.json`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('Quiz not available for this module');
        }
        
        // Fallback quiz data
        return this.getDefaultQuiz(moduleId);
    }

    getDefaultQuiz(moduleId) {
        const quizzes = {
            'termux-basics': {
                title: 'Termux Basics Quiz',
                questions: [
                    {
                        question: 'Termux mein package update karne ka command kya hai?',
                        options: ['pkg update', 'apt update', 'yum update', 'update pkg'],
                        correct: 0,
                        explanation: 'Termux mein pkg update command use karte hain packages update karne ke liye.'
                    },
                    {
                        question: 'Files list karne ke liye konsa command use karte hain?',
                        options: ['list', 'ls', 'dir', 'show'],
                        correct: 1,
                        explanation: 'ls command files aur directories list karne ke liye use hota hai.'
                    },
                    {
                        question: 'Termux mein storage permission kaise dete hain?',
                        options: ['storage-setup', 'termux-setup-storage', 'setup storage', 'grant storage'],
                        correct: 1,
                        explanation: 'termux-setup-storage command storage permission dene ke liye use hota hai.'
                    }
                ]
            },
            'termux-advanced': {
                title: 'Termux Advanced Quiz',
                questions: [
                    {
                        question: 'Python script run karne ka command kya hai?',
                        options: ['python script.py', 'run script.py', 'execute script.py', 'start script.py'],
                        correct: 0,
                        explanation: 'python script.py command se Python script run karte hain.'
                    },
                    {
                        question: 'Git repository clone karne ke liye konsa command use karte hain?',
                        options: ['git download', 'git clone', 'git copy', 'git get'],
                        correct: 1,
                        explanation: 'git clone command repository clone karne ke liye use hota hai.'
                    }
                ]
            },
            'nethunter-rootless': {
                title: 'NetHunter Rootless Quiz',
                questions: [
                    {
                        question: 'NetHunter rootless kya hai?',
                        options: ['Root access chahiye', 'Bina root ke chalti hai', 'Sirf rooted phones ke liye', 'Windows ke liye'],
                        correct: 1,
                        explanation: 'NetHunter rootless bina root access ke Android phones pe chalti hai.'
                    },
                    {
                        question: 'VNC server start karne ka command kya hai?',
                        options: ['vnc start', 'vncserver', 'start vnc', 'vnc-server'],
                        correct: 1,
                        explanation: 'vncserver command VNC server start karne ke liye use hota hai.'
                    }
                ]
            },
            'nethunter-tools': {
                title: 'NetHunter Tools Quiz',
                questions: [
                    {
                        question: 'Nmap kya karta hai?',
                        options: ['File copy karta hai', 'Network scan karta hai', 'Password crack karta hai', 'Website banata hai'],
                        correct: 1,
                        explanation: 'Nmap network scanning tool hai jo ports aur services scan karta hai.'
                    },
                    {
                        question: 'Basic nmap scan ka command kya hai?',
                        options: ['nmap scan target', 'nmap -sS target', 'nmap target', 'scan nmap target'],
                        correct: 2,
                        explanation: 'nmap target basic scan command hai.'
                    }
                ]
            },
            'networking': {
                title: 'Networking Quiz',
                questions: [
                    {
                        question: 'IP address kya hota hai?',
                        options: ['Internet Protocol address', 'Internal Program address', 'Internet Port address', 'Input Program address'],
                        correct: 0,
                        explanation: 'IP address Internet Protocol address hota hai jo devices ko identify karta hai.'
                    },
                    {
                        question: 'Port 80 kis service ke liye use hota hai?',
                        options: ['HTTPS', 'HTTP', 'FTP', 'SSH'],
                        correct: 1,
                        explanation: 'Port 80 HTTP service ke liye default port hai.'
                    }
                ]
            },
            'web-security': {
                title: 'Web Security Quiz',
                questions: [
                    {
                        question: 'SQL Injection kya hai?',
                        options: ['Database attack', 'Network attack', 'File attack', 'Memory attack'],
                        correct: 0,
                        explanation: 'SQL Injection database attack hai jo malicious SQL queries inject karta hai.'
                    },
                    {
                        question: 'XSS ka full form kya hai?',
                        options: ['Cross Site Scripting', 'Extra Site Security', 'XML Site Script', 'Cross Server Script'],
                        correct: 0,
                        explanation: 'XSS ka matlab Cross Site Scripting hai.'
                    }
                ]
            },
            'mobile-osint': {
                title: 'Mobile OSINT Quiz',
                questions: [
                    {
                        question: 'OSINT ka full form kya hai?',
                        options: ['Open Source Intelligence', 'Online Security Intelligence', 'Open System Intelligence', 'Online Source Intelligence'],
                        correct: 0,
                        explanation: 'OSINT ka matlab Open Source Intelligence hai.'
                    },
                    {
                        question: 'Google dorking kya hai?',
                        options: ['Google hacking', 'Advanced Google search', 'Google security', 'Google programming'],
                        correct: 1,
                        explanation: 'Google dorking advanced search techniques hai information gathering ke liye.'
                    }
                ]
            },
            'python-complete': {
                title: 'Python Complete Quiz',
                questions: [
                    {
                        question: 'Python mein comment kaise likhte hain?',
                        options: ['// comment', '# comment', '/* comment */', '-- comment'],
                        correct: 1,
                        explanation: 'Python mein # symbol use kar ke comments likhte hain.'
                    },
                    {
                        question: 'print("Hello") ka output kya hoga?',
                        options: ['Hello', '"Hello"', 'print Hello', 'Error'],
                        correct: 0,
                        explanation: 'print() function string ko console pe display karta hai.'
                    }
                ]
            },
            'python-basics-kids': {
                title: 'Python for Kids Quiz',
                questions: [
                    {
                        question: 'Computer kya hai?',
                        options: ['Electronic machine', 'Mechanical machine', 'Chemical machine', 'Physical machine'],
                        correct: 0,
                        explanation: 'Computer ek electronic machine hai jo data process karta hai.'
                    },
                    {
                        question: 'Python kya hai?',
                        options: ['Snake', 'Programming language', 'Game', 'Software'],
                        correct: 1,
                        explanation: 'Python ek programming language hai.'
                    }
                ]
            },
            'python-ai-ml': {
                title: 'Python AI/ML Quiz',
                questions: [
                    {
                        question: 'AI ka full form kya hai?',
                        options: ['Artificial Intelligence', 'Automatic Intelligence', 'Advanced Intelligence', 'Applied Intelligence'],
                        correct: 0,
                        explanation: 'AI ka matlab Artificial Intelligence hai.'
                    },
                    {
                        question: 'Machine Learning kya hai?',
                        options: ['Computer learning', 'AI ka part', 'Programming technique', 'Software type'],
                        correct: 1,
                        explanation: 'Machine Learning Artificial Intelligence ka ek part hai.'
                    }
                ]
            },
            'hands-on-ml-scikit-learn': {
                title: 'Scikit-Learn Quiz',
                questions: [
                    {
                        question: 'Scikit-learn kya hai?',
                        options: ['Python library', 'Programming language', 'Operating system', 'Database'],
                        correct: 0,
                        explanation: 'Scikit-learn Python ki machine learning library hai.'
                    },
                    {
                        question: 'Supervised learning kya hai?',
                        options: ['Bina data ke learning', 'Labeled data se learning', 'Random learning', 'Manual learning'],
                        correct: 1,
                        explanation: 'Supervised learning labeled data se model train karta hai.'
                    }
                ]
            },
            'nethunter-troubleshooting': {
                title: 'NetHunter Troubleshooting Quiz',
                questions: [
                    {
                        question: 'VNC connection issue kaise fix karte hain?',
                        options: ['Restart phone', 'Check VNC server', 'Reinstall app', 'Change password'],
                        correct: 1,
                        explanation: 'VNC connection issue fix karne ke liye pehle VNC server check karna chahiye.'
                    },
                    {
                        question: 'KEX kya hai?',
                        options: ['Kali Experience', 'Key Exchange', 'Kernel Extension', 'Kali Expert'],
                        correct: 0,
                        explanation: 'KEX ka matlab Kali Experience hai - NetHunter ka desktop environment.'
                    }
                ]
            }
        };
        
        return quizzes[moduleId] || {
            title: 'Quiz Coming Soon',
            questions: []
        };
    }

    async startQuiz(moduleId) {
        console.log('Starting quiz for module:', moduleId);
        this.currentQuiz = await this.loadQuiz(moduleId);
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        
        if (this.currentQuiz.questions.length === 0) {
            this.showNoQuizMessage();
            return;
        }
        
        this.showQuizModal();
        this.displayQuestion();
    }

    showQuizModal() {
        const modal = document.createElement('div');
        modal.className = 'quiz-modal';
        modal.innerHTML = `
            <div class="quiz-content">
                <div class="quiz-header">
                    <h3><i class="fas fa-question-circle"></i> ${this.currentQuiz.title}</h3>
                    <div class="quiz-progress">
                        <span id="question-counter">1 / ${this.currentQuiz.questions.length}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" id="quiz-progress"></div>
                        </div>
                    </div>
                </div>
                <div class="quiz-body" id="quiz-body">
                    <!-- Question content will be loaded here -->
                </div>
                <div class="quiz-actions">
                    <button id="prev-question" onclick="quizSystem.previousQuestion()" disabled>Previous</button>
                    <button id="next-question" onclick="quizSystem.nextQuestion()">Next</button>
                    <button id="submit-quiz" onclick="quizSystem.submitQuiz()" style="display:none;">Submit Quiz</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    displayQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestion];
        const quizBody = document.getElementById('quiz-body');
        
        // Clear previous content
        quizBody.innerHTML = '';
        
        // Create question container safely
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
        
        const questionText = document.createElement('h4');
        questionText.className = 'question-text';
        questionText.textContent = question.question;
        questionContainer.appendChild(questionText);
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
        
        question.options.forEach((option, index) => {
            const label = document.createElement('label');
            label.className = 'option-label';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'answer';
            input.value = index.toString();
            
            const span = document.createElement('span');
            span.className = 'option-text';
            span.textContent = option;
            
            label.appendChild(input);
            label.appendChild(span);
            optionsContainer.appendChild(label);
        });
        
        questionContainer.appendChild(optionsContainer);
        quizBody.appendChild(questionContainer);
        
        // Update progress
        const progress = ((this.currentQuestion + 1) / this.currentQuiz.questions.length) * 100;
        const progressBar = document.getElementById('quiz-progress');
        if (progressBar) progressBar.style.width = progress + '%';
        
        const counter = document.getElementById('question-counter');
        if (counter) counter.textContent = (this.currentQuestion + 1) + ' / ' + this.currentQuiz.questions.length;
        
        // Update buttons
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const submitBtn = document.getElementById('submit-quiz');
        
        if (prevBtn) prevBtn.disabled = this.currentQuestion === 0;
        if (nextBtn) nextBtn.style.display = this.currentQuestion === this.currentQuiz.questions.length - 1 ? 'none' : 'block';
        if (submitBtn) submitBtn.style.display = this.currentQuestion === this.currentQuiz.questions.length - 1 ? 'block' : 'none';
        
        // Restore previous answer if exists
        if (this.answers[this.currentQuestion] !== undefined) {
            const radio = quizBody.querySelector('input[value="' + this.answers[this.currentQuestion] + '"]');
            if (radio) radio.checked = true;
        }
    }

    nextQuestion() {
        this.saveCurrentAnswer();
        if (this.currentQuestion < this.currentQuiz.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        }
    }

    previousQuestion() {
        this.saveCurrentAnswer();
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    }

    saveCurrentAnswer() {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (selected) {
            this.answers[this.currentQuestion] = parseInt(selected.value);
        }
    }

    submitQuiz() {
        this.saveCurrentAnswer();
        this.calculateScore();
        this.showResults();
    }

    calculateScore() {
        this.score = 0;
        this.answers.forEach((answer, index) => {
            if (answer === this.currentQuiz.questions[index].correct) {
                this.score++;
            }
        });
    }

    showResults() {
        const percentage = Math.round((this.score / this.currentQuiz.questions.length) * 100);
        const passed = percentage >= 70;
        
        const modal = document.querySelector('.quiz-modal');
        if (!modal) return;
        
        // Clear modal content
        modal.innerHTML = '';
        
        // Create results container safely
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'quiz-results';
        
        // Result header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'result-header';
        
        const icon = document.createElement('i');
        icon.className = 'fas ' + (passed ? 'fa-trophy' : 'fa-times-circle');
        icon.style.color = passed ? '#00ff41' : '#ff6b6b';
        
        const title = document.createElement('h3');
        title.textContent = passed ? 'Congratulations!' : 'Keep Learning!';
        
        headerDiv.appendChild(icon);
        headerDiv.appendChild(title);
        
        // Stats section
        const statsDiv = document.createElement('div');
        statsDiv.className = 'result-stats';
        
        // Create stat items
        const stats = [
            { number: this.score.toString(), label: 'Correct Answers' },
            { number: percentage + '%', label: 'Score' },
            { number: passed ? 'PASS' : 'FAIL', label: 'Result' }
        ];
        
        stats.forEach(stat => {
            const statDiv = document.createElement('div');
            statDiv.className = 'stat';
            
            const numberSpan = document.createElement('span');
            numberSpan.className = 'stat-number';
            numberSpan.textContent = stat.number;
            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'stat-label';
            labelSpan.textContent = stat.label;
            
            statDiv.appendChild(numberSpan);
            statDiv.appendChild(labelSpan);
            statsDiv.appendChild(statDiv);
        });
        
        // Actions section
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'result-actions';
        
        const reviewBtn = document.createElement('button');
        reviewBtn.className = 'review-btn';
        reviewBtn.textContent = 'Review Answers';
        reviewBtn.onclick = () => this.showDetailedResults();
        
        const retryBtn = document.createElement('button');
        retryBtn.className = 'retry-btn';
        retryBtn.textContent = 'Retake Quiz';
        retryBtn.onclick = () => this.retakeQuiz();
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = 'Close';
        closeBtn.onclick = () => this.closeQuiz();
        
        actionsDiv.appendChild(reviewBtn);
        actionsDiv.appendChild(retryBtn);
        actionsDiv.appendChild(closeBtn);
        
        // Assemble results
        resultsDiv.appendChild(headerDiv);
        resultsDiv.appendChild(statsDiv);
        resultsDiv.appendChild(actionsDiv);
        modal.appendChild(resultsDiv);
        
        // Save result
        const moduleId = new URLSearchParams(window.location.search).get('module') || 'termux-basics';
        this.results[moduleId] = {
            score: this.score,
            total: this.currentQuiz.questions.length,
            percentage: percentage,
            passed: passed,
            date: new Date().toLocaleDateString()
        };
        this.saveResults();
    }

    showDetailedResults() {
        const modal = document.querySelector('.quiz-modal');
        modal.innerHTML = '';
        
        const detailedDiv = document.createElement('div');
        detailedDiv.className = 'detailed-results';
        
        const title = document.createElement('h3');
        title.textContent = 'Answer Review';
        detailedDiv.appendChild(title);
        
        this.currentQuiz.questions.forEach((question, index) => {
            const userAnswer = this.answers[index];
            const correct = question.correct;
            const isCorrect = userAnswer === correct;
            
            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${isCorrect ? 'correct' : 'incorrect'}`;
            
            const questionTitle = document.createElement('h4');
            questionTitle.textContent = question.question;
            
            const userAnswerP = document.createElement('p');
            const userAnswerStrong = document.createElement('strong');
            userAnswerStrong.textContent = 'Your Answer: ';
            userAnswerP.appendChild(userAnswerStrong);
            userAnswerP.appendChild(document.createTextNode(question.options[userAnswer] || 'Not answered'));
            
            const correctAnswerP = document.createElement('p');
            const correctAnswerStrong = document.createElement('strong');
            correctAnswerStrong.textContent = 'Correct Answer: ';
            correctAnswerP.appendChild(correctAnswerStrong);
            correctAnswerP.appendChild(document.createTextNode(question.options[correct]));
            
            const explanationP = document.createElement('p');
            const explanationStrong = document.createElement('strong');
            explanationStrong.textContent = 'Explanation: ';
            explanationP.appendChild(explanationStrong);
            explanationP.appendChild(document.createTextNode(question.explanation));
            
            resultItem.appendChild(questionTitle);
            resultItem.appendChild(userAnswerP);
            resultItem.appendChild(correctAnswerP);
            resultItem.appendChild(explanationP);
            detailedDiv.appendChild(resultItem);
        });
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = 'Close';
        closeBtn.onclick = () => this.closeQuiz();
        detailedDiv.appendChild(closeBtn);
        
        modal.appendChild(detailedDiv);
    }

    retakeQuiz() {
        const moduleId = new URLSearchParams(window.location.search).get('module') || 'termux-basics';
        this.closeQuiz();
        setTimeout(() => this.startQuiz(moduleId), 100);
    }

    closeQuiz() {
        const modal = document.querySelector('.quiz-modal');
        if (modal) modal.remove();
    }

    showNoQuizMessage() {
        const modal = document.createElement('div');
        modal.className = 'quiz-modal';
        modal.innerHTML = `
            <div class="quiz-content">
                <div class="no-quiz">
                    <i class="fas fa-info-circle"></i>
                    <h3>Quiz Coming Soon</h3>
                    <p>Is module ke liye quiz abhi available nahi hai. Jald hi add kiya jayega!</p>
                    <button onclick="quizSystem.closeQuiz()" class="close-btn">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    getQuizResult(moduleId) {
        return this.results[moduleId] || null;
    }
}

// Initialize Quiz System
const quizSystem = new QuizSystem();

// Make it globally available
window.quizSystem = quizSystem;
window.QuizSystem = QuizSystem;