const Platform = require("./02_platform");

function Game() {
  this.DIM_X = 350;
  this.DIM_Y = 250;
  this.NUM_PLATFORMS = 3;

  this.platforms = [];
  this.addPlatforms();
}

Game.prototype.randomPos = function() {
  return [(this.DIM_X/2) * Math.random(), (this.DIM_Y/2) * Math.random()];
}

Game.prototype.randomNum = function(min, max) {
  // return Math.floor(Math.random() * (max - min) + min);
  return Math.random() < 0.5 ? min : max;
}

Game.prototype.otherVel = function(vel) {
  if (vel[0] === 1.5) {
    return [-1.5, 0];
  } else {
    return [1.5, 0];
  }
}

Game.prototype.addPlatforms = function() {
  for (let i = 0; i < this.NUM_PLATFORMS; i++) {
    this.platforms.push(new Platform({
      pos: this.randomPos(),
      vel: [this.randomNum(-1.5, 1.5), 0],
      game: this
    }));
  }
}
  
Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.platforms.forEach(pf => {
    pf.drawRec(ctx);
  });
}

Game.prototype.moveObjects = function moveObjects() {
  this.platforms.forEach(function(pf){
    pf.move();
  });
}

Game.prototype.wrap = function(pos) {
  if (pos[0] > this.DIM_X) {
    pos[0] = (pos[0] % this.DIM_X) - 100;
  } else if (pos[0] < -100) {
    pos[0] = this.DIM_X
  }
  return pos;
}

Game.prototype.reverse = function (pos, vel) {
  if (pos[0] > (this.DIM_X - 150) || pos[0] < 0) {
    vel = this.otherVel(vel)
  }
  return vel;
}

module.exports = Game;