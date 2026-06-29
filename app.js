// 1. QUIZ DATA

const quizQuestions = [
    {
        question: "Which language runs in a web browser?",
        options: ["Java", "C++", "Python", "JavaScript"],
        correct: 3
    },
    {
        question: "What does CSS stand for?",
        options: ["Cascading Style Sheets", "Colored Style Sheets", "Creative Style Sheets"],
        correct: 0
    },
    {
        question: "Which of these is NOT a primitive data type in JS?",
        options: ["String", "Object", "Number", "Boolean"],
        correct: 1
    }
];

// 2. APP STATE

let currentUser = "";
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;
let timeLeft = 10;        // 10 seconds per question
let timerInterval = null; // Holds our countdown tracker


// 3. DOM ELEMENTS

const authScreen = document.getElementById('auth-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const timerDisplay = document.getElementById('timer');


// 4. COUNTDOWN CLOCK LOGIC

function startTimer() {
    timeLeft = 10; // Reset time to 10 seconds
    timerDisplay.innerText = timeLeft;

    // Clear any existing timer before starting a new one
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut(); 
        }
    }, 1000); // Runs every 1 second
}

function handleTimeOut() {
    alert("Time's up for this question!");
    // Move to next question automatically (counts as incorrect because selectedOptionIndex is null)
    goToNextQuestion();
}

// 5. AUTHENTICATION LOGIC

document.getElementById('register-btn').addEventListener('click', () => {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    
    if(!user || !pass) return alert("Please fill fields");

    if(localStorage.getItem(user)) {
        document.getElementById('auth-message').innerText = "User already exists!";
        return;
    }

    localStorage.setItem(user, pass); // Save to local browser storage
    document.getElementById('auth-message').innerText = "Registration successful! You can now Sign In.";
});

document.getElementById('login-btn').addEventListener('click', () => {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    const storedPass = localStorage.getItem(user);
    if(storedPass && storedPass === pass) {
        currentUser = user;
        startQuiz();
    } else {
        document.getElementById('auth-message').innerText = "Invalid credentials!";
    }
});


// 6. QUIZ LOGIC

function startQuiz() {
    authScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    document.getElementById('user-display').innerText = `Player: ${currentUser}`;
    
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const currentQ = quizQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = currentQ.question;
    document.getElementById('progress').innerText = `Question ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = ""; // Clear old options
    selectedOptionIndex = null;
    document.getElementById('next-btn').disabled = true;

    currentQ.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(button, index));
        optionsContainer.appendChild(button);
    });

    // Start the countdown timer for the new question
    startTimer();
}

function selectOption(button, index) {
    // Remove 'selected' styling from all buttons
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    // Highlight clicked button
    button.classList.add('selected');
    selectedOptionIndex = index;
    document.getElementById('next-btn').disabled = false;
}

function goToNextQuestion() {
    // Check answer if they selected something
    if (selectedOptionIndex !== null && selectedOptionIndex === quizQuestions[currentQuestionIndex].correct) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Next Button Click Event
document.getElementById('next-btn').addEventListener('click', () => {
    clearInterval(timerInterval); // Stop the timer immediately when clicked
    goToNextQuestion();
});

function showResults() {
    clearInterval(timerInterval); // Stop timer safely
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    document.getElementById('final-score').innerText = `You scored ${score} out of ${quizQuestions.length}`;
}

// Restart Button Click Event
document.getElementById('restart-btn').addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    startQuiz();
});