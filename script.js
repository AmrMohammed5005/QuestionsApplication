// Select Elements 
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let subButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

//Set Option
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;


function getQuestions() {
  let myRequest = new XMLHttpRequest();
  
  myRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200)  {
      let questionsObject = JSON.parse(this.responseText);
      let qCount =  questionsObject.length;

      // Create Bullets + Set Questions Count
      createBullets(qCount);

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);

      // Start CountDown
      countdown(40, qCount);

      // Click On Submit
      subButton.onclick  = () => {
        // Get Right Answer 
        let theRightAns = questionsObject[currentIndex].right_answer;
        
        // increase Index
        currentIndex++;

        // Check The Answer
        checkAnswer(theRightAns, qCount);

        // Remove Previous Question
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";

        // Add Question Data
        addQuestionData(questionsObject[currentIndex], qCount);

        // Handle Bullets Class
        handleBullets();

      // Restart CountDown
      clearInterval(countdownInterval);
      countdown(40, qCount);

        // Show Results
        showResults(qCount);
      };
    }
  };
  
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
  getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  
  // Create Spans 
  for (let i = 0; i < num; i++) {

    // Create Span 
    let theBullet = document.createElement("span");

    // Check if it First span
    if (i === 0) {
      theBullet.className = "on";
    }

    // Append Bullets TO Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
        
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Create Question Text 
    let questionText = document.createTextNode(obj.title);

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);

    // Crate The Answers 
    for (let i = 1; i <= 4; i++) {

      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = 'answer';

      // Create Radio Input 
      let radioInput = document.createElement("input");

      // add Type + Name + Id + Data-Attribute
      radioInput.name = 'question';
      radioInput.type = 'radio';
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      //Make First Option Checked
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label 
      let theLabel = document.createElement("label");
      
      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add Input + label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      answerArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {

  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {

    if (answers[i].checked) {

      theChosenAnswer = answers[i].dataset.answer;

    }
  }

  console.log(`Right Answer Is: ${rAnswer}`);
  console.log(`Chosen Answer Is: ${theChosenAnswer}`);

  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
    console.log("Good Answer");
  }
}

function handleBullets() {

  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {

    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults; 
  if (currentIndex === count) {
    console.log("Questions Is Finished");
    quizArea.remove();
    answerArea.remove();
    bullets.remove();

    if (rightAnswers > (count / 2) && rightAnswers < count) {
      theResults = `<span class='good'>Good</span>, ${rightAnswers} Out Of ${count}.`;
    }else if (rightAnswers === count){
      theResults = `<span class='perfect'>Perfect</span>, ${rightAnswers} Out Of ${count}.`;
      
    }else {
      theResults = `<span class='bad'>Bad</span>, ${rightAnswers} Out Of ${count}.`;
    }

      resultsContainer.innerHTML = theResults;
      resultsContainer.style.padding = '10px';
      resultsContainer.style.backgroundColor = '#fff';
      resultsContainer.style.display = 'flex';
      resultsContainer.style.justifyContent = 'center';
      resultsContainer.style.alignItems = 'center';
      resultsContainer.style.fontSize = '20px';
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds; 
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        subButton.click();
      }
    }, 1000);
  }
}

