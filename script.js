let data = [];
const COUNTDOWN_DURATION = 30; // seconds
const QUESTION_DURATION = 8; // seconds
const NAME_DURATION = 2; // seconds
let currentQuestionIndex = 0;
let countdownInterval;
let winnerIndex;

function loadFile() {
    const input = document.getElementById('file-input');
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            parseCSV(text);
            startGame();
        };
        reader.readAsText(file);
    }
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').slice(1); // Ignore the first column (timestamps)
    
    const responses = lines.slice(1).map(line => line.split(',').slice(1));

    headers.forEach((header, index) => {
        data.push({
            question: header,
            responses: responses.map(response => response[index])
        });
    });
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    currentQuestionIndex = 0;
    displayQuestion();
}

function displayQuestion() {
    const questionData = data[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    questionElement.innerText = questionData.question;


    const proceedButton = document.getElementById('proceed-button');
    const countdownCircle = document.getElementById('countdown-circle');
    proceedButton.style.display = 'none';

    countdownCircle.style.display = 'none';
    
    setTimeout(() => {
        showChoices(questionData.responses);
    }, QUESTION_DURATION * 1000);
}

function showChoices(responses) {


    
    const counts = responses.reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});

    const sortedNames = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    const top3 = sortedNames.slice(0, 3).sort(() => Math.random() - 0.5);

    top3.forEach((name, index) => {
        setTimeout(() => {
            const choiceElement = document.getElementById(`choice${index + 1}`);
            choiceElement.innerText = name;
            choiceElement.style.visibility = 'visible';
        }, index * NAME_DURATION*1000); // Delay each name by index * 1000 milliseconds (1 second)
    });

    const winner = top3.indexOf(sortedNames[0]); // Track the index of the correct winner
    startCountdown(COUNTDOWN_DURATION, winner);
}

function startCountdown(duration, winner) {
    duration = duration * 100;
    let timeLeft = duration;
    const countdownCircle = document.getElementById('countdown-circle');
    countdownCircle.style.display = 'block';
    updateCountdownCircle(1);

    countdownInterval = setInterval(() => {
        timeLeft--;

        updateCountdownCircle(timeLeft / duration);

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            revealWinner(winner);
        }
    }, 10);
}

function updateCountdownCircle(fraction) {
    const countdownCircle = document.getElementById('countdown-circle');
    countdownCircle.style.background = `conic-gradient(#ffffff 0% ${fraction * 100}%, #848484 ${fraction * 100}% 100%)`;
}

function revealWinner(winner) {
    const choiceElement = document.getElementById(`choice${winner+1}`);
    choiceElement.classList.add('green');

    const proceedButton = document.getElementById('proceed-button');
    proceedButton.style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < data.length) {
        resetChoices();
        displayQuestion();
    } else {
        alert('Game over!');
    }
}

function resetChoices() {
    for (let i = 1; i <= 3; i++) {
        const choiceElement = document.getElementById(`choice${i}`);
        choiceElement.style.visibility = 'hidden';
        choiceElement.classList.remove('green');
    }
    updateCountdownCircle(1);
}
