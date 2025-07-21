let currentQuestionIndex = 0;
let questions = [];
let playerAnswers = [];

async function getQuestions() {
  const url = "https://opentdb.com/api.php?amount=5";
  try {
    const response = await fetch(url);
    if(!response.ok){
      console.error(response);
    }

    const json = await response.json();
    questions = json.results;
    console.log(questions);
  } catch (error) {
    console.error(error);
  }
}

function displayQuestion(){
  document.getElementById("question-card").hidden = false;
  document.getElementById("results-card").hidden = true;

  const question = questions[currentQuestionIndex];
  console.log(question);

  const questionContainer = document.getElementById("question-container");
  questionContainer.innerHTML = question.question;

  const answerContainer = document.getElementById("answer-container");
  answerContainer.innerHTML = "";
  if (question.type === "multiple") {
    const answers = question.incorrect_answers.slice();
    answers.push(question.correct_answer);
    answers.sort(); // sort answers in alphabetical order to shuffle correct answer
    answers.forEach(answer => {
      const answerButton = document.createElement("button");
      answerButton.innerHTML = answer;
      answerButton.onclick = () => handleAnswer(answer);
      answerButton.className = "button poppins-regular";
      answerContainer.appendChild(answerButton);
    });
  }
  else if (question.type == "boolean") {
    const trueButton = document.createElement("button");
    trueButton.innerHTML = "True";
    trueButton.onclick = () => handleAnswer("True");
    trueButton.className = "button poppins-regular";
    answerContainer.appendChild(trueButton);
    const falseButton = document.createElement("button");
    falseButton.innerHTML = "False";
    falseButton.onclick = () => handleAnswer("False");
    falseButton.className = "button poppins-regular";
    answerContainer.appendChild(falseButton);
  }
}

function displayScore() {
  document.getElementById("question-card").hidden = true;
  document.getElementById("results-card").hidden = false;
  let correctAnswerCount = 0;
  for (let i = 0; i < questions.length; i++){
    if (playerAnswers[i] == questions[i].correct_answer){
      correctAnswerCount++;
    }
  }
  document.getElementById("results-container").innerHTML = `Congratulations! You answered ${correctAnswerCount}/${questions.length} questions correctly.`;
}

function handleAnswer(answer) {
  console.log(`Player answered: ${answer}`);
  playerAnswers.push(answer);
  if (currentQuestionIndex < questions.length - 1){
    currentQuestionIndex++;
    displayQuestion();
  }
  else{
    displayScore();
  }
}

function reset() {
  currentQuestionIndex = 0;
  questions = [];
  playerAnswers = [];

  document.getElementById("loading").hidden = false;
  document.getElementById("question-card").hidden = true;
  document.getElementById("results-card").hidden = true;
  
  getQuestions()
    .then(() => {
      document.getElementById("loading").hidden = true;
      displayQuestion();
    });
  // TODO: error handling
}

document.getElementById("play-again-button").onclick = () => reset();

reset();