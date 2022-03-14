const cellSize = 20;
const canvasSize = 600;
const REDRAW_INTERVAL = 50;
const width = canvasSize / cellSize;
const height = canvasSize / cellSize;
var saveWall = [];
var saveWall = [...new Set(saveWall)];

const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};
let MOVE_INTERVAL = 200;

//initial poisition
function position() {
  return {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
  };
}

//create object head and body of snake
function initialHeadAndBody() {
  let head = position();
  let body = [
    {
      x: head.x,
      y: head.y,
    },
  ];
  return {
    head: head,
    body: body,
  };
}

//initial direction
function initialDirection() {
  return Math.floor(Math.random() * 4);
}

//initial snake object
function Snake(color) {
  return {
    color: color,
    ...initialHeadAndBody(),
    direction: initialDirection(),
    score: 0,
    level: 1,
    speed: 200,
    life: 3,
  };
}
let snakeOne = Snake("red");

let apples = [
  {
    color: "red",
    position: position(),
  },
  {
    color: "green",
    position: position(),
  },
];

let life = {
  color: "blue",
  position: position(),
};

//initial obstacle
const levelObstacle = [
  {
    // level 1
    length: 0,
    x: 0,
    y: 0,
    mode: "horizontal", // 'horizontal'/'vertical'/'diagonal'
  },
  {
    // level 2
    length: Math.floor(canvasSize / cellSize - 5),
    x: Math.floor(canvasSize / cellSize - 15),
    y: Math.floor(canvasSize / cellSize - 12),
    mode: "horizontal", // 'horizontal'/'vertical'/'diagonal'
  },
  {
    // level 3
    length: Math.floor(canvasSize / cellSize - 5),
    x: Math.floor(canvasSize / cellSize - 15),
    y: Math.floor(canvasSize / cellSize - 8),
    mode: "horizontal", // 'horizontal'/'vertical'/'diagonal'
  },
  {
    // level 4
    length: Math.floor(canvasSize / cellSize - 5),
    x: Math.floor(canvasSize / cellSize - 15),
    y: Math.floor(canvasSize / cellSize - 4),
    mode: "horizontal", // 'horizontal'/'vertical'/'diagonal'
  },
  {
    // level 5
    length: Math.floor(canvasSize / cellSize - 5),
    x: Math.floor(canvasSize / cellSize - 15),
    y: Math.floor(canvasSize / cellSize - 14),
    mode: "vertical", // 'horizontal'/'vertical'/'diagonal'
    multiplier: 2,
    gap: 12,
  },
];

function advancedDrawObstacle(ctx, snake, index, mode) {
  saveWall.splice(0, saveWall.length);
  let x, y;
  for (let j = 0; j < levelObstacle[index].length; j++) {
    //untuk menyimpan data tembok
    if (snake.level == "2") {
      saveWall.push([levelObstacle[1].x + j, levelObstacle[1].y]);
    } else if (snake.level == "3") {
      saveWall.push([levelObstacle[1].x + j, levelObstacle[1].y]);
      saveWall.push([levelObstacle[2].x + j, levelObstacle[2].y]);
    } else if (snake.level == "4") {
      saveWall.push([levelObstacle[1].x + j, levelObstacle[1].y]);
      saveWall.push([levelObstacle[2].x + j, levelObstacle[2].y]);
      saveWall.push([levelObstacle[3].x + j, levelObstacle[3].y]);
    } else if (snake.level == "5") {
      saveWall.push([levelObstacle[4].x, levelObstacle[4].y + j]);
      saveWall.push([levelObstacle[4].x + levelObstacle[4].gap, levelObstacle[4].y + j]);
    }

    if (levelObstacle[index].mode === "horizontal") {
      x = levelObstacle[index].x + j;
      y = levelObstacle[index].y;
      if (mode === "adv") y += levelObstacle[index].gap;
    } else if (levelObstacle[index].mode === "vertical") {
      x = levelObstacle[index].x;
      y = levelObstacle[index].y + j;
      if (mode === "adv") x += levelObstacle[index].gap;
    }

    drawCell(ctx, x, y, "#000000");
    if (snake.head.x == Number.parseInt(x) && snake.head.y == Number.parseInt(y)) {
      if (snake.life > 1) {
        snake.life--;
        alert("Hidupmu kurang " + snake.life);
        snakeOne.position = position();
      } else {
        var audio = new Audio("assets/sound/game-over.mp3");
        audio.play();
        alert("Game over");
        snakeOne = Snake("purple");
        snakeOne.position = position();
        snake.speed = 200;
      }
    }
  }
  return saveWall;
}

// fungsi cek tabrakan dengan tembok
function drawAndEvaluateObstacle(ctx, snake) {
  if (snake.level < 5) {
    for (let i = 0; i < snake.level; i++) {
      advancedDrawObstacle(ctx, snake, i);
    }
  } else {
    advancedDrawObstacle(ctx, snake, 4);
    if (levelObstacle[4].gap && levelObstacle[4].multiplier) {
      advancedDrawObstacle(ctx, snake, 4, "adv");
    }
  }
}

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function drawApple(ctx, x, y) {
  let img = document.getElementById("apple");
  ctx.drawImage(img, x * cellSize, y * cellSize, cellSize, cellSize);
}

function drawSnakeHead(ctx, x, y) {
  let img = document.getElementById("snake-head");
  ctx.drawImage(img, x * cellSize, y * cellSize, cellSize, cellSize);
}

function drawSnakeBody(ctx, x, y) {
  let img = document.getElementById("snake-body");
  ctx.drawImage(img, x * cellSize, y * cellSize, cellSize, cellSize);
}

function drawLevel(snake) {
  let levelSnake;
  levelSnake = document.getElementById("level");
  let scoreLevel = levelSnake.getContext("2d");

  scoreLevel.clearRect(0, 0, canvasSize, canvasSize);
  scoreLevel.font = "20px Arial";
  scoreLevel.fillStyle = "black";
  scoreLevel.fillText("Level : ", 15, levelSnake.scrollHeight / 4);
  scoreLevel.fillText(snake.level, 43, levelSnake.scrollHeight / 1.5);
}

function drawScore(snake) {
  let scoreCanvas;
  if (snake.color == snakeOne.color) {
    scoreCanvas = document.getElementById("score1Board");
  }
  let scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, canvasSize, canvasSize);
  scoreCtx.font = "20px Arial";
  scoreCtx.fillStyle = "black";
  scoreCtx.fillText("Score : ", 15, scoreCanvas.scrollHeight / 4);
  scoreCtx.fillText(snake.score, 43, scoreCanvas.scrollHeight / 1.5);
}

function drawLife(ctx, x, y, color) {
  let img = document.getElementById("life");
  ctx.fillStyle = color;
  ctx.drawImage(img, x * cellSize, y * cellSize, cellSize, cellSize);
}

function drawSpeed(snake) {
  let speedCanvas;
  if (snake.color == snakeOne.color) {
    speedCanvas = document.getElementById("speedBoard");
  }
  let speedCtx = speedCanvas.getContext("2d");

  speedCtx.clearRect(0, 0, canvasSize, canvasSize);
  speedCtx.font = "20px Arial";
  speedCtx.fillStyle = "black";
  speedCtx.fillText("Speed : ", 15, speedCanvas.scrollHeight / 4);
  speedCtx.fillText(snake.speed + "ms", 20, speedCanvas.scrollHeight / 1.5);
}

//draw snake, apple, speed, and score board
function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    drawAndEvaluateObstacle(ctx, snakeOne);

    var snakeLife = document.getElementById("life");
    for (let i = 0; i < snakeOne.life; i++) {
      ctx.drawImage(snakeLife, i * cellSize, 0, cellSize, cellSize);
    }

    drawSnakeHead(ctx, snakeOne.head.x, snakeOne.head.y, snakeOne.color);
    for (let i = 1; i < snakeOne.body.length; i++) {
      drawSnakeBody(ctx, snakeOne.body[i].x, snakeOne.body[i].y, snakeOne.color);
    }

    for (let i = 0; i < apples.length; i++) {
      let apple = apples[i];

      //untuk mengganti apple yang bentrok dengan wall
      for (let i = 0; i < saveWall.length; i++) {
        if (saveWall[i][0] == apple.position.x && saveWall[i][1] == apple.position.y) {
          //console.log("Bentrok")
          while (saveWall[i][0] == apple.position.x && saveWall[i][1] == apple.position.y) {
            apple.position = position();
          }
        }
      }
      if (i == 0) {
        var img = document.getElementById("apple");
        ctx.drawImage(img, apple.position.x * cellSize, apple.position.y * cellSize, cellSize, cellSize);
      } else if (i == 1) {
        var img = document.getElementById("apple");
        ctx.drawImage(img, apple.position.x * cellSize, apple.position.y * cellSize, cellSize, cellSize);
      } else {
        const isPrime = (num) => {
          for (let i = 2, s = Math.sqrt(num); i <= s; i++) if (num % i === 0) return false;
          return num > 1;
        };
        if (isPrime(snakeOne.level) && snakeOne.score == 0) {
          var img = document.getElementById("life");
          ctx.drawImage(img, apple.position.x * cellSize - 2, apple.position.y * cellSize - 2, cellSize + 4, cellSize);
        }
      }
    }
    drawScore(snakeOne);
    drawLevel(snakeOne);
    drawSpeed(snakeOne);
  }, REDRAW_INTERVAL);
}

//Snakes can move to the other side when passing through the portal.
function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = canvasSize / cellSize - 1;
  }
  if (snake.head.x >= width) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = canvasSize / cellSize - 1;
  }
  if (snake.head.y >= height) {
    snake.head.y = 0;
  }
}

//snake can eat apple and add value to the scoreboard
function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (snakeOne.head.x == apple.position.x && snake.head.y == apple.position.y) {
      apple.position = position();
      snake.score++;
      if (snake.score % 5 == 0) {
        snake.speed -= 30;
        if (snake.level == 6) {
          alert("winner");
          var audio = new Audio("./assets/sound/winner.mp3");
          audio.play();
          snake.score = 0;
          snake.level = 1;
          snake.speed = 200;
          snake.body.splice(0, snake.body.length);
        } else {
          var audio = new Audio("./assets/sound/level-up.mp3");
          audio.play();
          alert("level " + snake.level + " complete!");
        }
        snake.level++;
      }
      snake.body.push({
        x: snake.head.x,
        y: snake.head.y,
      });
    }
  }
}

function checkCollision(snake) {
  let isCollide = false;
  //this
  for (let i = 0; i < snake.length; i++) {
    for (let j = 0; j < snake.length; j++) {
      for (let k = 1; k < snake[j].body.length; k++) {
        if (snake[i].head.x == snake[j].body[k].x && snake[i].head.y == snake[j].body[k].y) {
          if (snakeOne.life > 0) {
            snakeOne.life--;
            alert("Hidupmu kurang " + snakeOne.life);
            snakeOne.position = position();
            isCollide = false;
          } else if (snakeOne.life == 0) {
            isCollide = true;
            var audio = new Audio("assets/sound/game-over.mp3");
            audio.play();
            alert("Game over");
            snakeOne = Snake("purple");
            snakeOne.speed = 200;
          }
        }
      }
    }
  }
  // if (isCollide) {
  // }
  return isCollide;
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apples);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apples);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apples);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apples);
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  moveBody(snake);
  if (!checkCollision([snakeOne])) {
    setTimeout(function () {
      move(snake);
    }, snake.speed);
  } else {
    startGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({
    x: snake.head.x,
    y: snake.head.y,
  });
  snake.body.pop();
}

//Prevent the snake from turning in the opposite direction.
function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    if (snakeOne.score > 0) {
      turn(snakeOne, DIRECTION.LEFT);
    } else {
      snakeOne.direction = DIRECTION.LEFT;
    }
  } else if (event.key === "ArrowRight") {
    if (snakeOne.score > 0) {
      turn(snakeOne, DIRECTION.RIGHT);
    } else {
      snakeOne.direction = DIRECTION.RIGHT;
    }
  } else if (event.key === "ArrowUp") {
    if (snakeOne.score > 0) {
      turn(snakeOne, DIRECTION.UP);
    } else {
      snakeOne.direction = DIRECTION.UP;
    }
  } else if (event.key === "ArrowDown") {
    if (snakeOne.score > 0) {
      turn(snakeOne, DIRECTION.DOWN);
    } else {
      snakeOne.direction = DIRECTION.DOWN;
    }
  }
});
function startGame() {
  move(snakeOne);
}

startGame();
