const gameBoard = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");

let images = [];
let flippedCards = [];
let matchedCount = 0;
let timeLeft = 20;
let countdown;
let previewTimer;
let lockBoard = false;

function createBoard() {
  gameBoard.innerHTML = "";
  images = [];

  for (let i = 1; i <= 8; i++) {
    images.push(`img/${i}.jpg`);
    images.push(`img/${i}.jpg`);
  }
  images = shuffle(images);

  images.forEach((src) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="front"><img src="${src}" alt="card"></div>
      <div class="back"></div>
    `;
    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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

  const img1 = card1.querySelector(".front img").src;
  const img2 = card2.querySelector(".front img").src;

  if (img1 === img2) {
    matchedCount++;
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

function startGame() {
  matchedCount = 0;
  timeLeft = 20;
  flippedCards = [];
  lockBoard = true;

  hideAllCards();

  let previewCount = 3;
  setTimeout(() => {
    showAllCards();
    timerDisplay.textContent = `미리보기 ${previewCount}초`;

    previewTimer = setInterval(() => {
      previewCount--;
      if (previewCount > 0) {
        timerDisplay.textContent = `미리보기 ${previewCount}초`;
      } else {
        clearInterval(previewTimer);
        hideAllCards();
        timerDisplay.textContent = "START!";
        setTimeout(() => {
          lockBoard = false;
          startMainTimer();
        }, 800);
      }
    }, 1000);
  }, 500);
}

function showAllCards() {
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.add("flipped");
  });
}

function hideAllCards() {
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("flipped");
  });
}

function startMainTimer() {
  countdown = setInterval(() => {
    if (timeLeft >= 0) {
      timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
      timeLeft--;
    } else {
      clearInterval(countdown);
      endGame();
    }
  }, 1000);
}

function endGame() {
  lockBoard = true;
  timerDisplay.textContent = `시간 초과! ${matchedCount}세트 성공했습니다.`;
}

restartBtn.addEventListener("click", () => {
  clearInterval(countdown);
  clearInterval(previewTimer);
  createBoard();
  startGame();
});

createBoard();
startGame();
