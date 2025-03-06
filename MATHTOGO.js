document.addEventListener("DOMContentLoaded", function () {
    let level = 1;
    let correctAnswers = 0;
    let currentQuestion = 0;
    let totalStars = 0;
    let questions = [];
    let timer;
    let timeLeft;

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
            let num1 = Math.floor(Math.random() * 10) + 1;
            let num2 = Math.floor(Math.random() * 10) + 1;
            let questionText, answer;

            if (level <= 15) {
                questionText = `${num1} + ${num2} = ?`;
                answer = num1 + num2;
            } else if (level <= 50) {
                num1 = Math.floor(Math.random() * 20) - 10;
                num2 = Math.floor(Math.random() * 20) - 10;
                questionText = `${num1} - ${num2} = ?`;
                answer = num1 - num2;
            } else {
                questionText = `Solve: ${num1}x = ${num1 * num2}`;
                answer = num2;
            }

            questions.push({ question: questionText, answer });
        }
    }

    function showLevelNote() {
        let example = level <= 15 ? "2 + 3 = 5" : level <= 50 ? "-4 + 2 = -2" : "Solve 3x = 9";
        let noteText = `Level ${level}: Solve 5 problems.\nExample: ${example}`;

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
                checkAnswer(false);
            }
        }, 1000);
    }

    function checkAnswer() {
        clearInterval(timer);
        let feedback = document.getElementById("feedback");
        let userAnswer = document.getElementById("answer").value.trim();

        if (userAnswer === "") return; // Prevent empty input

        if (parseFloat(userAnswer) === questions[currentQuestion].answer) {
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
        let stars = correctAnswers === 5 ? 3 : correctAnswers >= 3 ? 2 : correctAnswers >= 1 ? 1 : 0;
        totalStars += stars;
        document.getElementById("stars").textContent = `You earned ${stars} stars!`;
        saveProgress();
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
