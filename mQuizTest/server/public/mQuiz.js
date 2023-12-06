//End button skips to next question if the question is answered.
var answersHTML = document.querySelectorAll('.answer');
var selectedAnswer = null;
var questionAnswer;
var points = 0;
var currentQuestionIndex = 0;
var questionsAnswered = 0;
var questionStatus = [];
var alreadyNexted = [];
var timeSpent = [null];
var questions;
var answers;
var correctAnswer;
fetch("quizdata.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
    questions = data.map(function (item) { return item.question; });
    answers = data.map(function (item) { return item.answers; });
    correctAnswer = data.map(function (item) { return item.correctAnswer; });
    displayQuestion();
})
    .catch(function (error) { return console.error('Error loading JSON:', error); });
function displayQuestion() {
    var questionHTML = document.getElementById('question');
    questionHTML.innerHTML = questions[currentQuestionIndex];
    questionAnswer = correctAnswer[currentQuestionIndex];
    answersHTML.forEach(function (answer, index) {
        answer.innerHTML = answers[currentQuestionIndex][index];
    });
}
function initializeQuestionStatus() {
    startTimer();
    for (var i = 0; i < questions.length; i++) {
        questionStatus.push(false);
        alreadyNexted.push(false);
        //fills questionStatus and alreadyNexted for every question with false
    }
}
function startTest() {
    var div = document.getElementById('quiz');
    div.style.display = 'block';
    document.getElementById('startDiv').style.display = 'none';
    initializeQuestionStatus();
}
function selectAnswer(event) {
    if (questionStatus[currentQuestionIndex] === false && timer != 0) {
        var button = event.target;
        selectedAnswer = button.textContent;
    }
    else
        return;
}
answersHTML.forEach(function (answer) {
    answer.addEventListener('click', selectAnswer);
});
var temp = 0;
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
        timeSpent[currentQuestionIndex] = time - (timer + temp);
        temp = temp + timeSpent[currentQuestionIndex];
    }
    else {
        timeSpent[0] = time - timer;
        temp = timeSpent[0];
    }
    alreadyNexted[currentQuestionIndex] = true;
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestionTracking();
        displayQuestion();
    }
    else {
        return;
    }
}
function prevButton() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateQuestionTracking();
        displayQuestion();
    }
}
function endQuiz() {
    var allAnswered = true;
    for (var i = 0; i < questions.length; i++) { //check if all questions are answered
        if (questionStatus[i] != true) {
            allAnswered = false;
        }
    }
    if (selectedAnswer != null) {
        nextButton();
    }
    if (allAnswered == false) {
        alert("Please answer all questions before ending the Quiz");
    }
    else {
        alert("Quiz ended. Points: " + points);
        stopTimer();
    }
    console.log("questions answered array: " + questionStatus);
    console.log("time spent for each question in seconds: " + timeSpent);
}
//TIMER 
var time = 15 * 60;
var timer = 15 * 60;
var timerInterval;
function updateTimer() {
    var minutes = Math.floor(timer / 60);
    var seconds = timer % 60;
    document.getElementById('timer').innerText = "".concat(minutes, ":").concat(seconds < 10 ? '0' : '').concat(seconds);
}
function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(function () {
            if (timer > 0) {
                timer--;
                updateTimer();
            }
            else {
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
    var questionTracker = document.getElementById('trackQuestions');
    if (currentQuestionIndex < 5) {
        questionTracker.innerHTML = "Question " + (currentQuestionIndex + 1);
    }
    else {
        questionTracker.innerHTML = "Last Question !";
    }
}
