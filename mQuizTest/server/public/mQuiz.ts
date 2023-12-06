//End button skips to next question if the question is answered.
let answersHTML = document.querySelectorAll('.answer');
let selectedAnswer: string | null = null;
let questionAnswer;
let points = 0;
let currentQuestionIndex = 0;
let questionsAnswered = 0;
let questionStatus: boolean[] = [];
let alreadyNexted: boolean[] = [];
let timeSpent: (number | null)[] = [null];

let questions;
let answers;
let correctAnswer;

fetch("quizdata.json")
    .then(response => response.json())
    .then(data => {
        questions = data.map(item => item.question);
        answers = data.map(item => item.answers);
        correctAnswer = data.map(item => item.correctAnswer);
        displayQuestion();
    })
    .catch(error => console.error('Error loading JSON:', error));


function displayQuestion() {
    let questionHTML = document.getElementById('question');
    questionHTML!.innerHTML = questions[currentQuestionIndex];
    questionAnswer = correctAnswer[currentQuestionIndex];

    answersHTML.forEach((answer, index) => {
        answer.innerHTML = answers[currentQuestionIndex][index];
    });
}

function initializeQuestionStatus() {
    startTimer();
    for (let i = 0; i < questions.length; i++) {
        questionStatus.push(false);
        alreadyNexted.push(false);
        //fills questionStatus and alreadyNexted for every question with false
    }
}

function startTest() {
    var div = document.getElementById('quiz');
    div!.style.display = 'block';
    document.getElementById('startDiv')!.style.display = 'none';
    initializeQuestionStatus()
}


function selectAnswer(event: MouseEvent) {
    if (questionStatus[currentQuestionIndex] === false && timer != 0) {
        const button = event.target as HTMLButtonElement;
        selectedAnswer = button.textContent;

    } else return;
}

answersHTML.forEach((answer) => {
    answer.addEventListener('click', selectAnswer as EventListener);
});
let temp = 0;
function nextButton() {
    if (currentQuestionIndex < questions.length) {
        questionStatus[currentQuestionIndex] = true;
    }
    if (selectedAnswer == questionAnswer && alreadyNexted[currentQuestionIndex] == false) {
        points++;
    }
    selectedAnswer = null;

    //Time spent on questions
    if (timeSpent[0] != null) {
        timeSpent[currentQuestionIndex] = time - (timer + temp)
        temp = temp + timeSpent[currentQuestionIndex]!
    } else {
        timeSpent[0] = time - timer
        temp = timeSpent[0]
    }

    alreadyNexted[currentQuestionIndex] = true;
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestionTracking()
        displayQuestion();
    } else {
        return;
    }
}

function prevButton() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateQuestionTracking()
        displayQuestion();
    }
}

function endQuiz() {
    let allAnswered = true;
    for (let i = 0; i < questions.length; i++) { //check if all questions are answered
        if (questionStatus[i] != true) {
            allAnswered = false
        }
    }
    if (selectedAnswer != null) {
        nextButton()
    }

    if (allAnswered == false) {
        alert("Please answer all questions before ending the Quiz")
    }
    else {
        alert("Quiz ended. Points: " + points);
        stopTimer()
    }
    console.log("questions answered array: " + questionStatus);
    console.log("time spent for each question in seconds: " + timeSpent);
}

//TIMER 
const time = 15 * 60
let timer = 15 * 60
let timerInterval;

function updateTimer() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.getElementById('timer')!.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
                updateTimer();
            } else {
                clearInterval(timerInterval);
                alert("The Quiz is over. Your Points: " + points);
            }
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}
function updateQuestionTracking() {
    const questionTracker = document.getElementById('trackQuestions');
    if (currentQuestionIndex < 5) {
        questionTracker!.innerHTML = "Question " + (currentQuestionIndex + 1)
    } else {
        questionTracker!.innerHTML = "Last Question !"
    }
}