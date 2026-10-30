const EMOJIS = ['🐶', '🐱', '🦊', '🐼', '🐸', '🐵', '🦁', '🐰'];

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const timeEl = document.getElementById('time');
const winEl = document.getElementById('win');

let first = null;
let locked = false;
let moves = 0;
let pairs = 0;
let seconds = 0;
let timer = null;
let hideTimeout = null;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    seconds++;
    timeEl.textContent = seconds;
  }, 1000);
}

function createCard(emoji) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'card';
  card.dataset.emoji = emoji;
  card.innerHTML =
    '<div class="inner"><div class="face back">?</div>' +
    `<div class="face front">${emoji}</div></div>`;
  card.addEventListener('click', () => flip(card));
  return card;
}

function flip(card) {
  if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  startTimer();
  card.classList.add('flipped');

  if (!first) {
    first = card;
    return;
  }

  moves++;
  movesEl.textContent = moves;
  const second = card;

  if (first.dataset.emoji === second.dataset.emoji) {
    first.classList.add('matched');
    second.classList.add('matched');
    first = null;
    pairs++;
    pairsEl.textContent = pairs;
    if (pairs === EMOJIS.length) {
      stopTimer();
      winEl.textContent = `🎉 완료! ${moves}번 시도, ${seconds}초 걸렸어요.`;
      winEl.hidden = false;
    }
  } else {
    locked = true;
    const prev = first;
    hideTimeout = setTimeout(() => {
      prev.classList.remove('flipped');
      second.classList.remove('flipped');
      first = null;
      locked = false;
    }, 800);
  }
}

function start() {
  stopTimer();
  clearTimeout(hideTimeout);
  first = null;
  locked = false;
  moves = pairs = seconds = 0;
  movesEl.textContent = 0;
  pairsEl.textContent = 0;
  timeEl.textContent = 0;
  winEl.hidden = true;
  board.replaceChildren(...shuffle([...EMOJIS, ...EMOJIS]).map(createCard));
}

document.getElementById('restart').addEventListener('click', start);
start();
