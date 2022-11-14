var DB_QUIZ = null;
const DB_QUIZ_URL =
  "https://script.google.com/macros/s/AKfycbxAPRmb4fbAAF5nETEiWsEZRTFhDkDABsAmi8EzmVJrrbG1ztJFbMYb86GkrTjETSa4/exec";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const fetchQuiz = async () => {
  DB_QUIZ = await fetch(DB_QUIZ_URL)
    .then((response) => response.json())
    .then(({ DB_QUIZ }) => {
      shuffleArray(DB_QUIZ);
      return DB_QUIZ.slice(0, 5);
    });
};

async function startQUiz() {
  if (DB_QUIZ == null) await fetchQuiz();
  document.getElementById("opening_window").style.display = "none";
  document.getElementById("quiz_window").style.display = "block";
}

//setuo quiz
let current_q = 0;
let total_score = 0;

document.addEventListener("DOMContentLoaded", function (event) {
  setupQuestion();
});

async function setupQuestion() {
  if (DB_QUIZ == null) await fetchQuiz();
  document.getElementById("question").innerText =
    DB_QUIZ[current_q]["question"];
  document.getElementById("charsetText0").innerText =
    DB_QUIZ[current_q]["answers"][0];
  document.getElementById("charsetText1").innerText =
    DB_QUIZ[current_q]["answers"][1];
  document.getElementById("charsetText2").innerText =
    DB_QUIZ[current_q]["answers"][2];
  document.getElementById("charsetText3").innerText =
    DB_QUIZ[current_q]["answers"][3];
}

function nextQuestion() {
  const current = DB_QUIZ[current_q];
  const answer = document.querySelector('input[name="choices"]:checked');
  const answerIndex = parseInt(answer.getAttribute("data-id"));

  if (answerIndex === current.correct) total_score += 100;

  current_q++;

  if (current_q > DB_QUIZ.length - 1) {
    stopQuiz();
  } else {
    resetState();
    setupQuestion();
  }
}

function resetState() {
  const choosedAnswer = document.querySelector('input[name="choices"]:checked');
  if (choosedAnswer != null) choosedAnswer.checked = false;
}

function stopQuiz() {
  document.getElementById("quiz_window").style.display = "none";
  document.getElementById("closing_window").style.display = "block";

  document.getElementById("scoreText").innerHTML =
    "Score Kamu : " + total_score;

  return;
}

async function share() {
  const canvasElement = await html2canvas(document.querySelector("#card"));
  const dataUrl = canvasElement.toDataURL();
  const blob = await (await fetch(dataUrl)).blob();
  const filesArray = [
    new File([blob], "KalselBanget.png", {
      type: blob.type,
      lastModified: new Date().getTime(),
    }),
  ];
  const shareData = {
    files: filesArray,
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    navigator.share(shareData);
  } else {
    alert("gak support share");
  }
}
