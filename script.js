const cardsArray = [
  { img: "2.jpg" },
  { img: "3.jpg" },
  { img: "4.jpg" },
  { img: "5.jpg" },
  { img: "6.jpg" },
  { img: "7.jpg" },
  { img: "8.jpg" },
  { img: "10.jpg" },
  { img: "11.jpg" },
  { img: "12.jpg" },
];

const gameBoard = document.querySelector('.game-board');
let cardValues = [];
let cardIds = [];
let matched = 0;

const cards = [...cardsArray, ...cardsArray]; // 짝 맞추기

// 섞기
cards.sort(() => 0.5 - Math.random());

cards.forEach((card, index) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.dataset.id = index;

  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');

  const cardFront = document.createElement('div');
  cardFront.classList.add('card-front');
  cardFront.style.background = `#fff url('images/${card.img}') center/cover no-repeat`;

  const cardBack = document.createElement('div');
  cardBack.classList.add('card-back');

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  cardElement.appendChild(cardInner);
  gameBoard.appendChild(cardElement);

  cardElement.addEventListener('click', flipCard);
});

function flipCard() {
  const selected = this;
  const id = selected.dataset.id;

  if (cardIds.includes(id) || selected.classList.contains('flipped')) return;

  selected.classList.add('flipped');
  cardValues.push(cards[id].img);
  cardIds.push(id);

  if (cardValues.length === 2) {
    setTimeout(checkMatch, 500);
  }
}

function checkMatch() {
  const allCards = document.querySelectorAll('.card');
  if (cardValues[0] === cardValues[1]) {
    matched++;
    if (matched === cardsArray.length) {
      setTimeout(() => alert('🎉 모든 카드를 맞췄습니다!'), 300);
    }
  } else {
    allCards[cardIds[0]].classList.remove('flipped');
    allCards[cardIds[1]].classList.remove('flipped');
  }
  cardValues = [];
  cardIds = [];
}
