# Welcome to Dodge!
## Table of Contents
* [Background](#background)
* [Technologies](#technologies)
* [Future Directions](#future-directions)
## Live Site
[Dodge!](https://shaphen.github.io/Dodge/)

## Background
![Dodge](https://github.com/Shaphen/Dodge/blob/master/dist/gifs/dodge.gif)
Dodge is a simple and easy to play platforming video game where the player tries to avoid the falling objects for as long as possible. As you progress through levels, the game becomes increasingly challenging with faster platforms and more obstacles. Collect power-ups to gain temporary advantages like invincibility or speed boosts! This idea came from the desire to challenge myself to go outside of my comfort zone and try making a game. I only allowed myself to use vanilla JavaScript, HTML, CSS, and the keymaster library.

## Technologies
### Collision Detection
Collision detection logic constantly checks with every cycle of the game loop if the `player` object is overlapping with a `platform` object and ends the game if this condition is met. This was an interesting feature to figure out by understanding the difference in measurements based on which side both objects are overlapping.

```javascript
Game.prototype.checkCollisions = function(startAnimate, startCreate) {
  let allObj = this.allObjects();
  for (let i = 0; i < allObj.length-1; i++) {
    let player = allObj[allObj.length - 1]
    if (allObj[i].isCollidedWith(player)) {
      this.collided = true;
      this.reset(startAnimate, startCreate);
    }
  }
}

GameObject.prototype.isCollidedWith = function(otherObj) {
  let top1 = this.pos[1]
  let top2 = otherObj.pos[1]
  // repeat for bottom, left, and right
  
  if (top1 > bottom2 || right1 < left2 || bottom1 < top2 || left1 > right2) {
    return false;
  }
  return true;
}
```

### Screen Wrapping
![Dodge-wrap](https://github.com/Shaphen/Dodge/blob/master/dist/gifs/dodge_wrap.gif)
The player is able to seemlessly wrap from one side of the screen to the other when breaking the game boundaries. This feature was created to help players have an even bigger advantage in-game and keep the difficulty balanced.

```javascript
Game.prototype.wrap = function(pos) {
  if (pos[0] > this.DIM_X + 20) {
    pos[0] = (pos[0] % this.DIM_X) - 40;
  } else if (pos[0] < -20) {
    pos[0] = this.DIM_X + 20;
  }
  return pos;
}
```

### Level System
The game features a progressive level system that increases difficulty over time. Every 30-60 seconds (depending on the current level), the level counter increments, making the game more challenging. The level system dynamically adjusts platform speed and quantity to create an escalating difficulty curve.

```javascript
Game.prototype.getLevelDifficulty = function() {
  // Base speed increases with level
  const baseSpeed = 4 + (this.level * 0.5);
  // Number of platforms increases with level
  const numPlatforms = Math.min(1 + Math.floor(this.level / 2), 5);
  // Level duration: starts at 30s, increases to 60s for higher levels
  const duration = Math.min(30000 + ((this.level - 1) * 10000), 60000);
  
  return {
    speed: baseSpeed,
    numPlatforms: numPlatforms,
    duration: duration
  };
}

Game.prototype.checkLevelProgression = function() {
  const now = Date.now();
  const difficulty = this.getLevelDifficulty();
  
  if (now - this.levelStartTime >= difficulty.duration) {
    this.level++;
    this.levelStartTime = now;
  }
}
```

### Power-Up System
Power-ups spawn randomly throughout the game and provide temporary advantages when collected. There are two types of power-ups: **Invincibility** (gold) which makes the player immune to platform collisions for 5 seconds, and **Speed Boost** (green) which increases movement speed by 50% for 5 seconds. When collected, a visual message appears at the collection point showing which power-up was obtained.

```javascript
Game.prototype.collectPowerUp = function(powerUp) {
  const effectDuration = 5000; // 5 seconds
  const now = Date.now();
  
  if (powerUp.type === PowerUp.POWERUP_TYPES.INVINCIBILITY) {
    this.playerInvincible = true;
    this.invincibilityEndTime = now + effectDuration;
  } else if (powerUp.type === PowerUp.POWERUP_TYPES.SPEED_BOOST) {
    this.playerSpeedBoost = true;
    this.speedBoostEndTime = now + effectDuration;
  }
  
  // Create a temporary message at collection point
  this.powerUpMessages.push({
    text: message,
    color: messageColor,
    pos: [powerUp.pos[0], powerUp.pos[1]],
    startTime: now,
    duration: 2000
  });
}
```

### Difficulty Scaling
The game automatically scales difficulty based on the current level. Platform falling speed increases linearly with each level, and the number of platforms spawned per wave also increases. This creates a smooth difficulty curve that keeps the game challenging but fair as players progress.

```javascript
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
```

## Future Directions
- [x] Implement levels with increasing difficulty over time
- [x] Change colors of platforms and background animations over time
- [ ] Improve visualizations
- [ ] Add more power-up types
- [ ] Implement high score tracking