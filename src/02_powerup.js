const Util = require("./00_utils");
const GameObject = require("./01_game_object");
Util.inherits(GameObject, PowerUp);

const POWERUP_TYPES = {
  INVINCIBILITY: 'invincibility',
  SPEED_BOOST: 'speed_boost'
};

const POWERUP_COLORS = {
  [POWERUP_TYPES.INVINCIBILITY]: '#FFD700', // Gold
  [POWERUP_TYPES.SPEED_BOOST]: '#00FF00'    // Green
};

function PowerUp(options) {
  this.DIM_X = 450;
  options.height = options.height || 20;
  options.width = options.width || 20;
  options.rad = options.rad || 10;
  options.type = options.type || POWERUP_TYPES.INVINCIBILITY;
  options.color = options.color || POWERUP_COLORS[options.type];
  options.game = options.game;
  GameObject.call(this, options);
}

PowerUp.prototype.drawPowerUp = function(ctx) {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.shadowColor = this.color;
  ctx.shadowBlur = 15;
  
  // Draw as a circle/star shape
  ctx.arc(this.pos[0] + this.width/2, this.pos[1] + this.height/2, this.width/2, 0, 2 * Math.PI);
  ctx.fill();
  
  // Add a border
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
};

PowerUp.prototype.isCollidedWith = function(otherObj) {
  // Power-up collision uses circular collision
  let centerX1 = this.pos[0] + this.width/2;
  let centerY1 = this.pos[1] + this.height/2;
  let centerX2 = otherObj.pos[0] + otherObj.width/2;
  let centerY2 = otherObj.pos[1] + otherObj.height/2;
  
  let distance = Math.sqrt(
    Math.pow(centerX1 - centerX2, 2) + Math.pow(centerY1 - centerY2, 2)
  );
  
  return distance < (this.width/2 + Math.max(otherObj.width, otherObj.height)/2);
};

PowerUp.POWERUP_TYPES = POWERUP_TYPES;
PowerUp.POWERUP_COLORS = POWERUP_COLORS;

module.exports = PowerUp;
