document.addEventListener("DOMContentLoaded", function () {
    let level = 1;
    let correctAnswers = 0;
    let currentQuestion = 0;
    let totalStars = 0;
    let questions = [];
    let timer;
    let timeLeft;
    let lastEarnedStars = 0; // Store stars earned in the last level

    function loadProgress() {
        let savedProgress = localStorage.getItem("mathGameProgress");
        if (savedProgress) {
            let progress = JSON.parse(savedProgress);
            level = progress.level || 1;
            totalStars = progress.stars || 0;
        }
    }

    function saveProgress() {
        let progress = { level, stars: totalStars };
        localStorage.setItem("mathGameProgress", JSON.stringify(progress));
    }

    function generateQuestions() {
        questions = [];
        for (let i = 0; i < 5; i++) {
            let num1 = Math.floor(Math.random() * 20) - 10;
            let num2 = Math.floor(Math.random() * 20) - 10;
            let operators = ["+", "-", "*", "/"];
            let operator = operators[Math.floor(Math.random() * operators.length)];
            let questionText, answer;

            if (operator === "+") {
                questionText = `${num1} + ${num2} = ?`;
                answer = num1 + num2;
            } else if (operator === "-") {
                questionText = `${num1} - ${num2} = ?`;
                answer = num1 - num2;
            } else if (operator === "*") {
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                questionText = `${num1} × ${num2} = ?`;
                answer = num1 * num2;
            } else {
                num1 = (Math.floor(Math.random() * 10) + 1) * (Math.floor(Math.random() * 5) + 1);
                num2 = Math.floor(Math.random() * 5) + 1;
                questionText = `${num1} ÷ ${num2} = ?`;
                answer = num1 / num2;
            }

            questions.push({ question: questionText, answer });
        }
    }

    function showLevelNote() {
        let example = "Mixed operations (e.g., 3 × 2, 6 ÷ 2, 4 + 5, 8 - 3)";
        let noteText = `Level ${level}: Solve 5 problems using different operations.\nExample: ${example}`;

        document.getElementById("level-note").textContent = noteText;
        setTimeout(() => {
            document.getElementById("level-note").style.display = "none";
            startGame();
        }, 3000);
    }

    function startGame() {
        document.getElementById("stars-container").style.display = "none";
        document.getElementById("answer").value = "";
        document.getElementById("level").innerText = `Level ${level}`;
        document.getElementById("total-stars").innerText = `Total Stars: ${totalStars}`;

        correctAnswers = 0;
        currentQuestion = 0;
        generateQuestions();
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQuestion < 5) {
            document.getElementById("question-text").textContent = questions[currentQuestion].question;
            document.getElementById("answer").focus();
            startTimer();
        } else {
            showResults();
        }
    }

    function startTimer() {
        clearInterval(timer);
        timeLeft = level >= 51 ? 60 : level >= 16 ? 30 : 15;
        document.getElementById("timer").innerText = `Time: ${timeLeft}s`;

        timer = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").innerText = `Time: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                checkAnswer(true); // Mark as incorrect due to timeout
            }
        }, 1000);
    }

    function checkAnswer(timeout = false) {
        clearInterval(timer);
        let feedback = document.getElementById("feedback");
        let userAnswer = document.getElementById("answer").value.trim();

        if (timeout || userAnswer === "") {
            feedback.textContent = `Time's up! Answer: ${questions[currentQuestion].answer}`;
            feedback.style.color = "red";
        } else if (parseFloat(userAnswer) === questions[currentQuestion].answer) {
            correctAnswers++;
            feedback.textContent = "Correct!";
            feedback.style.color = "green";
        } else {
            feedback.textContent = `Incorrect! Answer: ${questions[currentQuestion].answer}`;
            feedback.style.color = "red";
        }

        setTimeout(() => {
            feedback.textContent = "";
            currentQuestion++;
            loadQuestion();
        }, 1500);
    }

    function showResults() {
        document.getElementById("stars-container").style.display = "block";
        lastEarnedStars = correctAnswers === 5 ? 3 : correctAnswers >= 3 ? 2 : correctAnswers >= 1 ? 1 : 0;
        totalStars += lastEarnedStars;
        document.getElementById("stars").textContent = `You earned ${lastEarnedStars} stars!`;
        saveProgress();

        // Hide "Next Level" button if 0 stars, only show "Restart Level"
        if (lastEarnedStars === 0) {
            document.getElementById("nextLevel").style.display = "none";
        } else {
            document.getElementById("nextLevel").style.display = "block";
        }
    }

    document.getElementById("nextLevel").addEventListener("click", () => {
        level++;
        saveProgress();
        showLevelNote();
    });

    document.getElementById("restartLevel").addEventListener("click", () => {
        showLevelNote();
    });

    document.getElementById("submitAnswer").addEventListener("click", function() {
        checkAnswer();
    });

    document.getElementById("answer").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });

    loadProgress();
    showLevelNote();
});
