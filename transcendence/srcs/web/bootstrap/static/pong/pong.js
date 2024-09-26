// select canvas element
const canvas = document.getElementById("pong");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

// Define paddle and net dimensions
const paddleWidth = 10;
const paddleHeight = 100;
const netWidth = 2;

// Set canvas size
canvas.width = window.innerWidth * 0.77; // Adjust as needed
canvas.height = canvas.width * 2 / 3;  // Maintain aspect ratio

// load sounds
const hit = new Audio(hitSound);
const wall = new Audio(wallSound);
const win = new Audio(winSound);

let upPressed =false;
let downPressed =false;
let wPressed =false;
let sPressed =false;
let paused = false;

let gameOver = false;
let winner = "";
let gameLoop; //to store the interval ID

// Ball properties
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 2,
    velocityY : 2,
    speed : 5,
    color : "WHITE"
}

// paddle1 Paddle properties
const paddle1 = {
    x : 10, // left side of canvas
    y : (canvas.height - paddleHeight)/2,
    // width : 10,
    // height : 100,
    score : 0,
    color : "RED"
}
// paddle2 Paddle properties
const paddle2 = {
    x : canvas.width - paddleWidth - 10,
    y : (canvas.height - paddleHeight)/2,
    // width : 10,
    // height : 100,
    score : 0,
    color : "RED"
}

// NET properties
const net = {
    x : (canvas.width - netWidth)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// Event listeners for key presses
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
  let introElements = document.getElementsByClassName('intro');
  let pause = document.getElementsByClassName('pause');
  
  if (introElements[1].style.visibility != "hidden")
      return;
    switch (e.key) {
      case 'ArrowUp':
        upPressed = true;
        break;
      case 'ArrowDown':
        downPressed = true;
        break;
      case 'w':
      case 'W':
        wPressed = true;
        break;
      case 's':
      case 'S':
        sPressed = true;
        break;
      case 'p':
      case 'P':
        paused = !paused;
        let str = paused ? "visible" : "hidden";
        for (let i = 0; i < pause.length; i++) {
          pause[i].style.visibility = str;
        }
        break;
      case 'Escape':
        endGame();
        for (let i = 0; i < introElements.length; i++) {
          introElements[i].style.visibility = "visible";
        }
        for (let i = 0; i < pause.length; i++) {
          pause[i].style.visibility = "hidden";
        }
        break;
    }
  }

  function keyUpHandler(e) {
    switch (e.key) {
      case 'ArrowUp':
        upPressed = false;
        break;
      case 'ArrowDown':
        downPressed = false;
        break;
      case 'w':
      case 'W':
        wPressed = false;
        break;
      case 's':
      case 'S':
        sPressed = false;
        break;
    }
  }

function endGame() {
    gameOver = true;
    clearInterval(gameLoop);
    clearCanvas();
    resetGame();
}

function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = 2; // Reset ball velocity
    ball.velocityY = 2; // Reset ball velocity
    ball.speed = 5;  // Reset ball speed if it changes during the game
    paddle1.y = (canvas.height - paddleHeight) / 2;
    paddle2.y = (canvas.height - paddleHeight) / 2;
    paddle1.score = 0;
    paddle2.score = 0;
    winner = "";
    gameOver = false;
    paused = false;
    clearCanvas();  // Clear the canvas to avoid leftover visuals from previous game
}

// Clear the canvas completely
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// when COM or USER scores, we reset the ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 5;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=5){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text,x,y){
    ctx.fillStyle = "#FFFF00";
    ctx.font = "75px Orbitron";
    ctx.fillText(text, x, y);
}

// collision detection
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + paddleHeight;
    p.left = p.x;
    p.right = p.x + paddleWidth;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}
// // Use this function to play sounds instead of directly calling audio.play()
// // If multiple sound effects are triggered in quick succession, the browser 
// // might not handle them well, leading to some sounds not playing.
// function playSound(audio) {
//   const soundClone = audio.cloneNode(); 
//   soundClone.play();
// }

// update function, the function that does all calculations
function update(){
  if (gameOver || paused) return;
  // 1. Ball Movement and Wall Collision:

    // Update ball's X and Y position based on its velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // Check for collisions with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.velocityY = -ball.velocityY; // Reverse Y velocity on collision
      wall.play(); // Play sound effect
    }
    // 2. paddle1 Paddle Movement (Keyboard Controls):
    // Check if up or down key is pressed and update paddle1.y accordingly
    if (wPressed && paddle1.y > 0) {
      paddle1.y -= 5; // Move paddle1 paddle up by 5 units (adjust speed as needed)
    } else if (sPressed && paddle1.y + paddleHeight < canvas.height) {
      paddle1.y += 5; // Move paddle1 paddle down by 5 units (adjust speed as needed)
    }

    if (upPressed && paddle2.y > 0) {
        paddle2.y -= 5; // Move paddle1 paddle up by 5 units (adjust speed as needed)
      } else if (downPressed && paddle2.y + paddleHeight < canvas.height) {
        paddle2.y += 5; // Move paddle1 paddle down by 5 units (adjust speed as needed)
      }
    // 3. Ball and Paddle Collision:
    // Ball and Paddle Collision for paddle1
      if (collision(ball, paddle1)) {
        hit.play();
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (paddle1.y + paddleHeight / 2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (paddleHeight / 2);
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI / 4) * collidePoint;
        ball.velocityX = ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
      }

  // Ball and Paddle Collision for paddle2
      if (collision(ball, paddle2)) {
        hit.play();
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (paddle2.y + paddleHeight / 2));
        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        collidePoint = collidePoint / (paddleHeight / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        ball.velocityX = -ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
      }
    // 4. Scoring and Ball Reset:
    // Check if ball goes past paddle1 or paddle2 for scoring and reset
      // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
        if( ball.x - ball.radius < 0  && !collision(ball, paddle1)){
            paddle2.score++;
            if (paddle2.score > 9){
              winner = "User 2 Wins!";
              gameOver = true;
              return;
            }
            resetBall();
        } 
        else if( ball.x + ball.radius > canvas.width && !collision(ball, paddle2)){
          paddle1.score++;
            if (paddle1.score > 9){
              winner = "User 1 Wins!";
              gameOver = true;
              return;
            }
            resetBall();
        }
}

// render function, the function that does al the drawing
function render(){
    
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
    // draw the paddle1 score to the left
    drawText(paddle1.score,canvas.width/4,canvas.height/5);
    
    // draw the paddle2 score to the right
    drawText(paddle2.score,3*canvas.width/4,canvas.height/5);
    
    // draw the net
    drawNet();
    
    // draw the paddle1 paddle
    drawRect(paddle1.x, paddle1.y, paddleWidth, paddleHeight, paddle1.color);
    
    // draw the paddle2 paddle
    drawRect(paddle2.x, paddle2.y, paddleWidth, paddleHeight, paddle2.color);
    
    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);

    // draw the winner text if game over
    if (gameOver) {
      drawText(winner, canvas.width / 4, canvas.height / 2);
    }
    // draw the paused text if game  paused
    // if (paused) {
    //    drawText("Game Paused", canvas.width / 4, canvas.height / 2);
  // }
}
function game(){
    update();
    render();
}
// number of frames per second
function launchgame()
{
  let framePerSecond = 50;
    // Clear existing interval before creating a new one
    let introElements = document.getElementsByClassName('intro');
    for (let i = 0; i < introElements.length; i++) {
        introElements[i].style.visibility = "hidden";
    }
      clearInterval(gameLoop);
    // Reset the game state to ensure a clean start
    resetGame();
  
    // Start the game loop
    //call the game function 50 times every 1 Sec
    gameLoop = setInterval(function(){
      if (gameOver) {
        win.play();
        clearInterval(gameLoop);
      }
      game();
    },1000/framePerSecond);

}