
function GameObject(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.rad = options.rad;
  this.width = options.width;
  this.height = options.height;
  this.color = options.color;
  this.game = options.game;
}

GameObject.prototype.drawRec = function(ctx) {
  ctx.beginPath();
  
  const colors = this.game && this.game.getLevelColor ? this.game.getLevelColor() : { color: "#FFFFFF", shadow: "white" };
  ctx.fillStyle = colors.color;
  ctx.shadowColor = colors.shadow;
  ctx.shadowBlur = 10;

  ctx.rect(this.pos[0], this.pos[1], this.width, this.height);

  ctx.fill();
};

GameObject.prototype.drawBgRec = function (ctx) {
  ctx.beginPath();
  
  const colors = this.game && this.game.getLevelBgColor ? this.game.getLevelBgColor() : { color: "rgba(255, 255, 255, 0.5)", shadow: "white" };
  ctx.fillStyle = colors.color;
  ctx.shadowColor = colors.shadow;
  ctx.shadowBlur = 10;

  ctx.rect(this.pos[0], this.pos[1], this.width, this.height);

  ctx.fill();
};

GameObject.prototype.drawPlayer = function (ctx, color, shadowColor) {
  ctx.beginPath();
  
  const strokeColor = color || "blue";
  const shadow = shadowColor || "blue";
  
  ctx.fillStyle = "black";
  ctx.shadowColor = shadow;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 5;
  ctx.shadowBlur = 10;

  ctx.rect(this.pos[0], this.pos[1], this.width, this.height);

  ctx.fill();
  ctx.stroke();
};

GameObject.prototype.move = function() {
  let pos = [];
  pos.push(this.pos[0] + this.vel[0]);
  pos.push(this.pos[1] + this.vel[1]);
  this.pos = pos;
}

GameObject.prototype.isCollidedWith = function(otherObj) {
  let top1 = this.pos[1]
  let top2 = otherObj.pos[1]
  let bottom1 = this.pos[1] + this.height
  let bottom2 = otherObj.pos[1] + otherObj.height
  let left1 = this.pos[0]
  let left2 = otherObj.pos[0]
  let right1 = this.pos[0] + this.width
  let right2 = otherObj.pos[0] + otherObj.width
  
  if (top1 > bottom2 || right1 < left2 || bottom1 < top2 || left1 > right2) {
    return false;
  }
  return true;
}

module.exports = GameObject;