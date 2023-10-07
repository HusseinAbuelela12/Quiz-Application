// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector (".bullets .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

//set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions () {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;
            
            // create bullets + set questions count
            createBullets(qCount);

            //Add Question Data
            addQuestionData(questionsObject[currentIndex] , qCount);

            //countdown
            countdown(40,qCount);

            //click on submit
            submitButton.onclick = () => {
                // get right answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                
                // Increase Index
                currentIndex++;

                //check the answer
                checkAnswer(theRightAnswer, qCount);

                //remove previous question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";

                //Add Question Data
                addQuestionData(questionsObject[currentIndex] , qCount);
                
                // handle bullets class
                handleBullets();

                //countdown
                clearInterval(countdownInterval);
                countdown(150,qCount);

                // show results
                showResults(qCount);
            }
        }
    }
    myRequest.open("GET","./html_ questions.json",true);
    myRequest.send();
    
};
getQuestions ();

function createBullets (num) {
    countSpan.innerHTML = num;

    // create spans
    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        if (i === 0) {
            theBullet.className = "on";
        }
        bulletsSpanContainer.appendChild(theBullet);
    }
};

function addQuestionData (obj , count) {
    if (currentIndex < count) {
        // create h2 Question Title
    let qTitle = document.createElement("h2");
    let qText = document.createTextNode(obj["title"]);
    qTitle.appendChild(qText);
    quizArea.appendChild(qTitle);
    
    //create the answers

    for(let i = 1; i <= 4; i++) {
        let mainDiv = document.createElement("div");
        mainDiv.className = "answer";
        let radioInput = document.createElement("input");

        // add type +name + id +data-attribute
        radioInput.name= "question";
        radioInput.type= "radio";
        radioInput.id= `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        // make first option selected
        if(i === 1 ){
            radioInput.checked = true;
        }

        // create label
        let theLabel = document.createElement("label");
        theLabel.htmlFor = `answer_${i}`;
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);

        theLabel.appendChild(theLabelText);
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        answersArea.appendChild(mainDiv);
    }
    }

};

function checkAnswer (rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length ;i++) {
        if (answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++
    }
};

function handleBullets (){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    })
};

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class= "Good">Good</span>, ${rightAnswers} From ${count}`;
        }else if (rightAnswers === count){
            theResults = `<span class= "perfect">Perfect</span>, All Answers Is Perfect.`;
        }else {
            theResults = `<span class= "bad">Bad</span>, ${rightAnswers} From ${count}`;
        }
        resultsContainer.innerHTML = theResults;
    }
};

function countdown (duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`:minutes;
            seconds = seconds < 10 ? `0${seconds}`:seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }

        }, 1000)
    }
};
