const problemElement = document.getElementById("problem");
const answerElement = document.getElementById("answer");
const submitButton = document.getElementById("submit");
const feedbackElement = document.getElementById("feedback");
const scoreElement = document.getElementById("score");
const historyList = document.getElementById("history-list");
const timerElement = document.getElementById("timer");
const startButton = document.getElementById("start");

let countdown;
let currentProblem = null;
let score = 0;
let gameRunning = false;

let maxDifficulty = 5;
let minDifficulty = 1;
let difficulty = minDifficulty;
let correctAnswersInARow = 0;
let incorrectAnswersInARow = 0;

scoreElement.style.fontWeight = "bold";

function startGame() {
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    historyList.innerHTML = "";
    startButton.disabled = true;
  
    let timeRemaining = 60;
    timerElement.textContent = `Time: ${timeRemaining}s`;
  
    timerElement.classList.remove("hidden");
  
    gameRunning = true;
  
    countdown = setInterval(() => {
      timeRemaining--;
      timerElement.textContent = `Time: ${timeRemaining}s`;
  
      if (timeRemaining <= 0) {
        clearInterval(countdown);
        timerElement.textContent = "Time's up!";
        startButton.disabled = false;
        gameRunning = false;
  
        timerElement.classList.add("hidden");
      }
    }, 1000);

    startButton.style.display = "none";
    generateProblem();
}

function generateProblem() {
    const a = Math.floor(Math.random() * (10 * difficulty - 1) + 1);
    const b = Math.floor(Math.random() * (10 * difficulty - 1) + 1);
    const operation = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
  
    currentProblem = {
      a,
      b,
      operation,
      answer: eval(`${a} ${operation} ${b}`),
    };
  
    problemElement.textContent = `${a} ${operation} ${b} = `;
}

function adjustDifficulty(answeredCorrectly) {
    if (answeredCorrectly) {
      correctAnswersInARow++;
      incorrectAnswersInARow = 0;
    } else {
      correctAnswersInARow = 0;
      incorrectAnswersInARow++;
    }
  
    if (correctAnswersInARow >= 3 && difficulty < maxDifficulty) {
      difficulty++;
      correctAnswersInARow = 0;
    } else if (incorrectAnswersInARow >= 3 && difficulty > minDifficulty) {
      difficulty--;
      incorrectAnswersInARow = 0;
    }
}
  
function checkAnswer() {
    const userAnswer = parseFloat(answerElement.value);
  
    let correctAnswer;
    switch (currentProblem.operation) {
      case "+":
        correctAnswer = currentProblem.a + currentProblem.b;
        break;
      case "-":
        correctAnswer = currentProblem.a - currentProblem.b;
        break;
      case "*":
        correctAnswer = currentProblem.a * currentProblem.b;
        break;
      case "/":
        correctAnswer = currentProblem.a / currentProblem.b;
        break;
    }
  
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.0001;
  
    const listItem = document.createElement("li");
    listItem.textContent = `${currentProblem.a} ${currentProblem.operation} ${currentProblem.b} = ${userAnswer} (${isCorrect ? 'Correct' : 'Incorrect'})`;
    historyList.appendChild(listItem);
  
    if (isCorrect) {
      score++;
  
      if (gameRunning) {
        generateProblem();
      }
    } else {
      feedbackElement.textContent = "Incorrect. Try again!";
    }
  
    adjustDifficulty(isCorrect);
  
    scoreElement.textContent = `Score: ${score}`;
    answerElement.value = "";
}

submitButton.addEventListener("click", checkAnswer);
startButton.addEventListener("click", startGame);