const Platform = require("./02_platform");
const Player = require("./02_player");
const PowerUp = require("./02_powerup");

function Game() {
  this.DIM_X = 650;
  this.DIM_Y = 500;
  this.NUM_PLATFORMS = 1;

  this.platforms = [];
  this.powerUps = [];
  this.addPlatforms();
  this.player = new Player({
    game: this,
    width: 25,
    height: 25,
  });
  this.collided = false;
  
  // Level system
  this.level = 1;
  this.levelStartTime = Date.now();
  this.levelDuration = 30000; // 30 seconds for level 1
  
  // Power-up effects
  this.playerInvincible = false;
  this.invincibilityEndTime = 0;
  this.playerSpeedBoost = false;
  this.speedBoostEndTime = 0;
  
  // Power-up messages
  this.powerUpMessages = [];
}

Game.prototype.randomPos = function() {
  return [(Math.floor(Math.random() * (650) - 100)), -20];
}

Game.prototype.randomNum = function(min, max) {
  return Math.random() < 0.5 ? min : max;
}

Game.prototype.otherVel = function(vel) {
  if (vel[0] === 1.5) {
    return [-1.5, 0];
  } else {
    return [1.5, 0];
  }
}

Game.prototype.getLevelDifficulty = function() {
  // Base speed increases with level
  const baseSpeed = 4 + (this.level * 0.5);
  // Number of platforms increases with level
  const numPlatforms = Math.min(1 + Math.floor(this.level / 2), 5);
  // Level duration: starts at 30s, increases to 60s for higher levels
  // Level 1: 30s, Level 2: 40s, Level 3: 50s, Level 4+: 60s
  const duration = Math.min(30000 + ((this.level - 1) * 10000), 60000);
  
  return {
    speed: baseSpeed,
    numPlatforms: numPlatforms,
    duration: duration
  };
}

Game.prototype.addPlatforms = function() {
  const difficulty = this.getLevelDifficulty();
  for (let i = 0; i < difficulty.numPlatforms; i++) {
    this.platforms.push(new Platform({
      width: Math.floor(Math.random() * (300-200) + 200),
      pos: this.randomPos(),
      vel: [0, this.randomNum(difficulty.speed, difficulty.speed + 1)],
      game: this
    }));
  }
}

Game.prototype.addPowerUp = function() {
  // Random chance to spawn power-up (10% chance)
  if (Math.random() < 0.1) {
    const types = [PowerUp.POWERUP_TYPES.INVINCIBILITY, PowerUp.POWERUP_TYPES.SPEED_BOOST];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    this.powerUps.push(new PowerUp({
      pos: this.randomPos(),
      vel: [0, 3],
      type: randomType,
      game: this
    }));
  }
}
  
Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.platforms.forEach(pf => {
    pf.drawRec(ctx);
  });
  this.powerUps.forEach(pu => {
    pu.drawPowerUp(ctx);
  });
  
  // Draw player with invincibility effect
  if (this.playerInvincible) {
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 20;
  }
  this.player.drawPlayer(ctx);
  if (this.playerInvincible) {
    ctx.restore();
  }
  
  // Draw UI
  this.drawUI(ctx);
}

Game.prototype.drawUI = function(ctx) {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Level: ${this.level}`, 10, 30);
  
  // Show power-up status
  let yOffset = 60;
  if (this.playerInvincible) {
    const timeLeft = Math.ceil((this.invincibilityEndTime - Date.now()) / 1000);
    ctx.fillStyle = "#FFD700";
    ctx.fillText(`Invincible: ${timeLeft}s`, 10, yOffset);
    yOffset += 30;
  }
  
  if (this.playerSpeedBoost) {
    const timeLeft = Math.ceil((this.speedBoostEndTime - Date.now()) / 1000);
    ctx.fillStyle = "#00FF00";
    ctx.fillText(`Speed Boost: ${timeLeft}s`, 10, yOffset);
    yOffset += 30;
  }
  
  // Draw power-up collection messages
  const now = Date.now();
  this.powerUpMessages.forEach(msg => {
    const elapsed = now - msg.startTime;
    const progress = elapsed / msg.duration;
    
    // Fade out effect
    const alpha = 1 - progress;
    const yPos = msg.pos[1] - (progress * 50); // Move up as it fades
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = msg.color;
    ctx.font = "bold 24px Arial";
    ctx.shadowColor = msg.color;
    ctx.shadowBlur = 10;
    ctx.textAlign = "center";
    ctx.fillText(msg.text, msg.pos[0] + 10, yPos);
    ctx.restore();
  });
}

Game.prototype.moveObjects = function moveObjects() {
  this.platforms.forEach(function(pf){
    pf.move();
  });
  this.powerUps.forEach(function(pu){
    pu.move();
  });
  
  // Remove power-ups that are off screen
  this.powerUps = this.powerUps.filter(pu => pu.pos[1] < this.DIM_Y + 50);
}

Game.prototype.wrap = function(pos) {
  if (pos[0] > this.DIM_X + 20) {
    pos[0] = (pos[0] % this.DIM_X) - 40;
  } else if (pos[0] < -20) {
    pos[0] = this.DIM_X + 20;
  }
  return pos;
}

Game.prototype.allObjects = function() {
  return [].concat(this.platforms, this.powerUps, this.player);
}

Game.prototype.checkCollisions = function(startAnimate, startCreate) {
  let allObj = this.allObjects();
  let player = allObj[allObj.length - 1];
  
  for (let i = 0; i < allObj.length - 1; i++) {
    let obj = allObj[i];
    
    // Check if object is a power-up by checking if it's in the powerUps array
    const isPowerUp = this.powerUps.indexOf(obj) !== -1;
    
    if (isPowerUp) {
      // Check power-up collisions
      if (obj.isCollidedWith(player)) {
        this.collectPowerUp(obj);
        this.powerUps = this.powerUps.filter(pu => pu !== obj);
        continue;
      }
    } else {
      // Check platform collisions (skip if invincible)
      if (!this.playerInvincible && obj.isCollidedWith(player)) {
        this.collided = true;
        this.reset(startAnimate, startCreate);
        return;
      }
    }
  }
}

Game.prototype.collectPowerUp = function(powerUp) {
  const effectDuration = 5000; // 5 seconds
  const now = Date.now();
  
  // Create a temporary message
  let message = "";
  let messageColor = "";
  
  if (powerUp.type === PowerUp.POWERUP_TYPES.INVINCIBILITY) {
    this.playerInvincible = true;
    this.invincibilityEndTime = now + effectDuration;
    message = "INVINCIBILITY!";
    messageColor = "#FFD700";
  } else if (powerUp.type === PowerUp.POWERUP_TYPES.SPEED_BOOST) {
    this.playerSpeedBoost = true;
    this.speedBoostEndTime = now + effectDuration;
    message = "SPEED BOOST!";
    messageColor = "#00FF00";
  }
  
  // Add message with position and expiration time
  this.powerUpMessages.push({
    text: message,
    color: messageColor,
    pos: [powerUp.pos[0], powerUp.pos[1]],
    startTime: now,
    duration: 2000 // Show for 2 seconds
  });
}

Game.prototype.updatePowerUpEffects = function() {
  const now = Date.now();
  
  if (this.playerInvincible && now >= this.invincibilityEndTime) {
    this.playerInvincible = false;
  }
  
  if (this.playerSpeedBoost && now >= this.speedBoostEndTime) {
    this.playerSpeedBoost = false;
  }
  
  // Remove expired messages
  this.powerUpMessages = this.powerUpMessages.filter(msg => {
    return (now - msg.startTime) < msg.duration;
  });
}

Game.prototype.checkLevelProgression = function() {
  const now = Date.now();
  const difficulty = this.getLevelDifficulty();
  
  if (now - this.levelStartTime >= difficulty.duration) {
    this.level++;
    this.levelStartTime = now;
  }
}

Game.prototype.reset = function(startAnimate, startCreate) {
  this.platforms = [];
  this.powerUps = [];
  this.player.pos = [320, 450];
  this.collided = false;
  
  // Reset level and power-up effects
  this.level = 1;
  this.levelStartTime = Date.now();
  this.playerInvincible = false;
  this.playerSpeedBoost = false;
  this.powerUpMessages = [];
  
  clearInterval(startAnimate);
  clearInterval(startCreate);
  modal2.style.display = "block";
  resetTimer();
}

Game.prototype.step = function(startAnimate, startCreate) {
  this.moveObjects();
  this.updatePowerUpEffects();
  this.checkLevelProgression();
  if (!this.collided){ this.checkCollisions(startAnimate, startCreate); };
}

module.exports = Game;