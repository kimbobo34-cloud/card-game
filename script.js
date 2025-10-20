const gameBoard = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");

const totalTime = 20;
let countdown;
let timeLeft = totalTime;
let flippedCards = [];
let lockBoard = false;
let matchedSets = 0;

const images = [];
for (let i = 1; i <= 8; i++) {
  images.push(`img/${i}.jpg`);
  images.push(`img/${i}.jpg`);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function initGame() {
  clearInterval(countdown);
  gameBoard.innerHTML = "";
  flippedCards = [];
  lockBoard = true;
  matchedSets = 0;
  timeLeft = totalTime;
  restartBtn.textContent = "🔄 다시 시작";
  restartBtn.style.display = "inline-block";

  const shuffled = shuffle([...images]);

  shuffled.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = src;

    card.innerHTML = `
      <div class="card-inner">
        <div class="back"><img src="img/back.png" alt="back"></div>
        <div class="front"><img src="${src}" alt="front"></div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });

  const allCards = document.querySelectorAll(".card");

  setTimeout(() => {
    allCards.forEach(card => card.classList.add("flipped"));
    startPreviewCountdown(allCards);
  }, 100);
}

function startPreviewCountdown(allCards) {
  let previewTime = 3;
  timerDisplay.textContent = `미리보기 ${previewTime}초`;

  const previewInterval = setInterval(() => {
    previewTime--;
    if (previewTime > 0) {
      timerDisplay.textContent = `미리보기 ${previewTime}초`;
    } else {
      clearInterval(previewInterval);
      allCards.forEach(card => card.classList.remove("flipped"));
      showStartMessage();
    }
  }, 1000);
}

function showStartMessage() {
  timerDisplay.textContent = "START!";
  lockBoard = false;
  startTimer();
}

function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped")) return;
  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  lockBoard = true;
  const [card1, card2] = flippedCards;

  if (card1.dataset.image === card2.dataset.image) {
    matchedSets++;
    flippedCards = [];
    lockBoard = false;
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

function startTimer() {
  clearInterval(countdown);
  timeLeft = totalTime;
  countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      endGame();
    }
  }, 1000);
}

function endGame() {
  lockBoard = true;
  timerDisplay.textContent = `시간 종료! ${matchedSets}세트 성공!`;
}

restartBtn.addEventListener("click", initGame);

initGame();
