import { Card } from "./card.js";
import { AmazingCard } from "./amazingCard.js";

let firstCard = null;
let secondCard = null;
let isTimerRunning = true;

// Определяем количество карточек
const container = document.querySelector(".container");
const title = document.createElement("h1");
const fieldset = document.createElement("fieldset");
const rule = document.createElement("p");
const buttonStart = document.createElement("button");
title.textContent = "Игра в пары";
rule.textContent = `Цель Игры: Найти все пары, открывая карточки в произвольном порядке. 
                    Для прохождения игры у Вас будет 60 секунд.`;
buttonStart.textContent = "Начать игру";
fieldset.classList.add("startGame");
container.append(title, fieldset);
fieldset.append(rule, buttonStart);

// нажимаем на кнопку начала игры
buttonStart.addEventListener("click", function () {
  fieldset.remove();
  // подготовка поля
  const playField = document.createElement("div");
  playField.classList.add("field");
  container.append(playField);

  playField.before(createTimer());
  let intervalId = setInterval(tiktak, 1000);

  const count = 8;
  const cardsNumberArray = createCardNumbers(count);

  for (const cardNumber of cardsNumberArray) {
    let card = new AmazingCard(playField, cardNumber, function (card) {
      flip(card, intervalId, cardsNumberArray);
    });
  }
});

// игра
function flip(card, intervalId, cardsNumberArray) {
  if (card.open || card.success) return;
  card.open = true;

  if (firstCard !== null && secondCard !== null) {
    firstCard.open = false;
    secondCard.open = false;
    firstCard = null;
    secondCard = null;
  }

  if (firstCard === null) {
    firstCard = card;
  } else if (secondCard === null && firstCard !== null) {
    secondCard = card;
  }

  if (
    firstCard !== null &&
    secondCard !== null &&
    firstCard.cardNumber == secondCard.cardNumber
  ) {
    firstCard.success = true;
    secondCard.success = true;
  }

  // победа
  winGame(intervalId, cardsNumberArray);
}

// создание перемешанного массива
function createCardNumbers(count) {
  const arr = [];
  for (let i = 1; i <= count; i++) {
    arr.push(i, i);
  }

  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

// сообщение о победе
function winGame(intervalId, cardsNumberArray) {
  if (
    cardsNumberArray.length === document.querySelectorAll(".winCard").length
  ) {
    setTimeout(function () {
      const seconds = document.querySelector(".seconds");
      const timeLeft = 60 - parseInt(seconds.textContent);
      const secondsWord =
        timeLeft % 10 === 1
          ? "секунда"
          : timeLeft % 10 > 1 && timeLeft % 10 < 5
          ? "секунды"
          : "секунд";
      alert(`ПОБЕДА! Ваше время: ${timeLeft} ${secondsWord}!`);
      clearInterval(intervalId);
      createBtnPlayAgain(container);
    }, 300);
  }
}

// кнопка для новой игры
function createBtnPlayAgain(container) {
  const playAgain = document.createElement("button");
  playAgain.textContent = "Сыграть ещё раз";
  playAgain.addEventListener("click", () => location.reload());
  container.append(playAgain);
}

// таймер 60сек
function createTimer() {
  let timer = document.createElement("div");
  timer.classList.add("timer");

  let seconds = document.createElement("span");
  seconds.classList.add("seconds");
  seconds.textContent = "60";

  let unit = document.createElement("span");
  unit.textContent = " сек.";

  timer.append(seconds, unit);
  return timer;
}

// обратный отсчет
function tiktak() {
  if (!isTimerRunning) return;
  let seconds = document.querySelector(".seconds");
  let sec = parseInt(seconds.textContent, 10);
  --sec;
  seconds.textContent = sec;

  if (sec < 0) {
    isTimerRunning = false;
    alert("Вы не успели! Попробуйте еще раз!"), location.reload();
  }
}
