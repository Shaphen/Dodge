
function GameView(game, ctx) {
  this.game = game;
  this.ctx = ctx;
}

GameView.prototype.start = function start() {

  const animate = () => {
    if (document.hasFocus()) { 
      this.game.step(startAnimate, startCreate);
      this.game.draw(this.ctx);
      if (this.game.player) {
        this.bindKeyHandlers();
      }
    }
  }
  let startAnimate = setInterval(animate, 15);

  const create = () => {
    if (document.hasFocus()) {
      this.game.addPlatforms();
    }
  }
  let startCreate = setInterval(create, 700);

}

GameView.prototype.bindKeyHandlers = function() {
  if (key.isPressed("left")) { this.game.player.move([-8, 0]) };
  if (key.isPressed("right")) { this.game.player.move([8, 0]) };
}

module.exports = GameView;