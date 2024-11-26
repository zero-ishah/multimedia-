document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("financial-video");
    const quizPrompt = document.getElementById("quiz-prompt");
    const quizSection = document.getElementById("quiz-section");
    const quizContainer = document.getElementById("quiz-container");
    const submitButton = document.getElementById("submit-quiz");
    const quizScore = document.getElementById("quiz-score");
    const scorePercent = document.getElementById("score-percent");

    const questions = [
        { chapter: 1, question: "What does financial planning aim to achieve?", options: ["Budgeting for the present", "Securing your future", "Both A and B", "None of the above"], answer: 2 },
        { chapter: 2, question: "What does the 50/30/20 rule emphasize?", options: ["50% savings", "50% needs, 30% wants, 20% savings", "50% debt repayment", "30% investment"], answer: 1 },
        { chapter: 3, question: "What is an emergency fund?", options: ["A fund for long-term goals", "Money saved for unforeseen expenses", "Funds for retirement", "Savings for vacations"], answer: 1 },
        { chapter: 4, question: "Which is a strategy for achieving financial freedom?", options: ["Increasing liabilities", "Avoiding investments", "Creating multiple income streams", "Relying on credit cards"], answer: 2 },
        { chapter: 5, question: "What is compounding in investments?", options: ["Earning interest on the principal only", "Earning interest on interest", "Fixed interest rates", "None of the above"], answer: 1 },
        { chapter: 6, question: "What does a credit score measure?", options: ["Your net worth", "Your income level", "Your creditworthiness", "Your assets"], answer: 2 },
        { chapter: 7, question: "What is financial wellness?", options: ["Living paycheck to paycheck", "Being free from financial stress", "Having no savings", "Avoiding investments"], answer: 1 },
    ];


    let quizStarted = false;

    // Pause video for quiz at 1-minute mark
    video.addEventListener("timeupdate", () => {
        if (!quizStarted && video.currentTime > 60) {
            video.pause();
            displayQuizPrompt();
        }
    });

    // Display quiz prompt
    function displayQuizPrompt() {
        quizPrompt.textContent = "Time to answer a question before proceeding!";
        quizPrompt.classList.remove("hidden");
        setTimeout(() => {
            quizPrompt.classList.add("hidden");
            video.play();
            quizStarted = true;
        }, 3000);
    }

    // Load quiz when navigated
    document.querySelector("nav a[href='#quiz-section']").addEventListener("click", () => {
        loadQuiz();
        quizSection.classList.remove("hidden");
    });

    // Render quiz questions
    function loadQuiz() {
        quizContainer.innerHTML = ""; // Clear existing content
        questions.forEach((q, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${index + 1}. ${q.question}</p>
                ${q.options.map((option, i) => `
                    <label>
                        <input type="radio" name="q${index}" value="${i}" aria-label="${option}"> ${option}
                    </label>
                `).join("<br>")}
            `;
            quizContainer.appendChild(questionDiv);
        });
        submitButton.classList.remove("hidden");
    }

    // Handle quiz submission
    submitButton.addEventListener("click", () => {
        const userAnswers = questions.map((q, index) => {
            const selected = document.querySelector(`input[name='q${index}']:checked`);
            return selected ? parseInt(selected.value) : null;
        });

        const score = calculateScore(userAnswers);
        displayScore(score);
    });

    // Calculate quiz score
    function calculateScore(userAnswers) {
        return userAnswers.reduce((acc, answer, index) => {
            return acc + (answer === questions[index].answer ? 1 : 0);
        }, 0);
    }

    // Display quiz score
    function displayScore(score) {
        const percentage = Math.round((score / questions.length) * 100);
        scorePercent.textContent = `${percentage}%`;
        quizScore.classList.remove("hidden");

        if (percentage < 70) {
            alert("Your score is too low. Please retake the course.");
            video.currentTime = 0;
            video.play();
        } else {
            alert("Congratulations! You passed the quiz.");
        }
    }
});

// Infographic Chart
const ctx = document.getElementById("infographic-chart").getContext("2d");

const infographicChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Savings (40%)", "Investments (30%)", "Debt (20%)", "Emergency Fund (10%)"],
        datasets: [{
            label: "Financial Distribution",
            data: [40, 30, 20, 10],
            backgroundColor: ["#4caf50", "#ff9800", "#f44336", "#2196f3"], // New color scheme
            borderColor: ["#fff", "#fff", "#fff", "#fff"],
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                text: "Your Financial Distribution"
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
});


// Loan Calculator
document.getElementById("calculate-loan").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("loan-amount").value);
    const years = parseFloat(document.getElementById("loan-term").value);
    const rate = parseFloat(document.getElementById("loan-rate").value) / 100;

    if (!validateInputs(amount, years, rate)) {
        displayError("loan-result", "Please fill in all fields correctly.");
        return;
    }

    const monthlyRate = rate / 12;
    const numberOfPayments = years * 12;
    const monthlyPayment = calculateMonthlyPayment(amount, monthlyRate, numberOfPayments);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - amount;

    displayResult("loan-result", `
        Monthly Payment: $${monthlyPayment.toFixed(2)}, 
        Total Payment: $${totalPayment.toFixed(2)}, 
        Total Interest: $${totalInterest.toFixed(2)}
    `);
});

// Savings Calculator
document.getElementById("calculate-savings").addEventListener("click", () => {
    const initial = parseFloat(document.getElementById("initial-savings").value);
    const monthly = parseFloat(document.getElementById("monthly-contribution").value);
    const rate = parseFloat(document.getElementById("savings-rate").value) / 100;
    const years = parseFloat(document.getElementById("savings-years").value);

    if (!validateInputs(initial, monthly, rate, years)) {
        displayError("savings-result", "Please fill in all fields correctly.");
        return;
    }

    const futureValue = calculateFutureValue(initial, monthly, rate, years);
    displayResult("savings-result", `Future Value: $${futureValue.toFixed(2)}`);
});

// Utility Functions
function validateInputs(...values) {
    return values.every(value => value !== null && value >= 0 && !isNaN(value));
}

function displayError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function displayResult(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function calculateMonthlyPayment(amount, rate, payments) {
    return amount * rate / (1 - Math.pow(1 + rate, -payments));
}

function calculateFutureValue(initial, monthly, rate, years) {
    const months = years * 12;
    let futureValue = initial;

    for (let i = 0; i < months; i++) {
        futureValue = futureValue * (1 + rate / 12) + monthly;
    }

    return futureValue;
}