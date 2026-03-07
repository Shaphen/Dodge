
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
      this.game.addPowerUp();
    }
  }
  let startCreate = setInterval(create, 700);

}

GameView.prototype.bindKeyHandlers = function() {
  const baseSpeed = 8;
  const speed = this.game.playerSpeedBoost ? baseSpeed * 1.5 : baseSpeed;
  
  if (key.isPressed("left")) { this.game.player.move([-speed, 0]) };
  if (key.isPressed("right")) { this.game.player.move([speed, 0]) };
}

module.exports = GameView;