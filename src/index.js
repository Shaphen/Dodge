const bgObjs = require("./03_bg_objects");
const Game = require("./03_game");
window.Game = Game;
const GameView = require("./03_game_view");
window.GameView = GameView

document.addEventListener("DOMContentLoaded", () => {
  let canvas = document.getElementById("game-canvas");
  let ctx = canvas.getContext("2d")
  let bgCanvas = document.getElementById("bg-canvas");
  let bgCtx = bgCanvas.getContext("2d")
  let span = document.getElementsByClassName("close-modal")[0];
  let span2 = document.getElementsByClassName("close-modal2")[0];
  const music = document.getElementById("music");
  const playMusic1 = document.getElementById("play1");
  const pauseMusic1 = document.getElementById("pause1");
  const playMusic2 = document.getElementById("play2");
  const pauseMusic2 = document.getElementById("pause2");
  pauseMusic1.style.display = "none";
  pauseMusic2.style.display = "none";

  playMusic1.addEventListener("click", function() {
    music.play();
    playMusic1.style.display = "none";
    playMusic2.style.display = "none";
    pauseMusic1.style.display = "block";
    pauseMusic2.style.display = "block";
  });
  pauseMusic1.addEventListener("click", function() {
    music.pause();
    pauseMusic1.style.display = "none";
    pauseMusic2.style.display = "none";
    playMusic1.style.display = "block";
    playMusic2.style.display = "block";
  });
  playMusic2.addEventListener("click", function () {
    music.play();
    playMusic2.style.display = "none";
    pauseMusic2.style.display = "block";
  });
  pauseMusic2.addEventListener("click", function () {
    music.pause();
    pauseMusic2.style.display = "none";
    playMusic2.style.display = "block";
  });

  const game = new Game();
  const bgAnimation = new bgObjs({ mainGame: game });
  new GameView(bgAnimation, bgCtx).start();
  
  modal.style.display = "block";
  span.onclick = function () {
    modal.style.display = "none";
    new GameView(game, ctx).start();
    startTimer();
  }

  span2.onclick = function () {
    modal2.style.display = "none";
    new GameView(game, ctx).start();
    startTimer();
  }
});