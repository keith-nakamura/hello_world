"use strict";

const words = [
  "apple", "banana", "castle", "coffee", "flower", "guitar", "island",
  "jungle", "kitten", "lemon", "magic", "nature", "orange", "pencil",
  "rocket", "summer", "travel", "winter"
];
const maxMisses = 6;
const stages = [
  "",
  "\n\n\n\n\n\n=========",
  "\n |\n |\n |\n |\n |\n=========",
  " +---+\n |   |\n |\n |\n |\n |\n=========",
  " +---+\n |   |\n O   |\n |   |\n |\n |\n=========",
  " +---+\n |   |\n O   |\n/|\\  |\n     |\n     |\n=========",
  " +---+\n |   |\n O   |\n/|\\  |\n/ \\  |\n     |\n========="
];

const drawing = document.querySelector("#drawing");
const wordElement = document.querySelector("#word");
const status = document.querySelector("#status");
const remaining = document.querySelector("#remaining");
const missesElement = document.querySelector("#misses");
const form = document.querySelector("#guess-form");
const input = document.querySelector("#guess");

let word;
let guesses;

function missLetters() {
  return guesses.filter((letter) => !word.includes(letter));
}

function isWon() {
  return [...word].every((letter) => guesses.includes(letter));
}

function render(message) {
  const misses = missLetters();
  const gameOver = isWon() || misses.length >= maxMisses;
  drawing.textContent = stages[misses.length];
  wordElement.textContent = [...word].map((letter) => guesses.includes(letter) ? letter.toUpperCase() : "_").join(" ");
  remaining.textContent = maxMisses - misses.length;
  missesElement.textContent = `間違えた文字: ${misses.length ? misses.join(" / ").toUpperCase() : "なし"}`;
  status.textContent = message;
  input.disabled = gameOver;
  form.querySelector("button").disabled = gameOver;
  if (!gameOver) input.focus();
}

function newGame() {
  word = words[Math.floor(Math.random() * words.length)];
  guesses = [];
  input.value = "";
  render("アルファベットを1文字入力してください。");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const guess = input.value.trim().toLowerCase();
  input.value = "";
  if (!/^[a-z]$/.test(guess)) return render("a〜z のアルファベットを1文字だけ入力してください。");
  if (guesses.includes(guess)) return render(`「${guess.toUpperCase()}」はすでに入力済みです。`);

  guesses.push(guess);
  const misses = missLetters();
  if (isWon()) render(`クリア！答えは「${word.toUpperCase()}」です。`);
  else if (misses.length >= maxMisses) render(`ゲームオーバー。答えは「${word.toUpperCase()}」でした。`);
  else if (word.includes(guess)) render(`正解！「${guess.toUpperCase()}」が含まれています。`);
  else render(`残念。「${guess.toUpperCase()}」は含まれていません。`);
});

document.querySelector("#new-game").addEventListener("click", newGame);
newGame();
