class PongGame {
    constructor(id) {
        this.canvas = document.getElementById(id);
        this.tournamenttrace = 0;
        if (!this.canvas) {
            console.error("Canvas element with ID 'pong' not found");
            return;
        }
        let introclass = "intro";
        if (id == "pong1")
            introclass = "intro1";
        this.user1;
        this.user2;
        this.user3;
        this.user4;
        this.round2p1;
        this.round2p2;
        this.introElements = document.getElementsByClassName(introclass);
        this.tournamentBrackets = document.getElementsByClassName("bracket");
        this.ctx = this.canvas.getContext("2d");
        // Define paddle and net dimensions
        this.paddleWidth = 10;
        this.paddleHeight = 100;
        this.netWidth = 2;
        // Set canvas size
        this.canvas.width = window.innerWidth * 0.77; // Adjust as needed
        this.canvas.height = this.canvas.width * 2 / 3;  // Maintain aspect ratio

        // load sounds
        this.hit = new Audio("/static/sounds/ballHitPaddle.mp3");
        this.wall = new Audio("/static/sounds/ballHitWall.mp3");
        this.win = new Audio("/static/sounds/win.mp3");
        //keys
        this.upPressed =false;
        this.downPressed =false;
        this.wPressed =false;
        this.sPressed =false;
        this.paused = false;
        //game status
        this.gameOver = false;
        this.winner = "";
        this.gameLoop = null; //to store the interval ID
        // this.Ball properties
        this.ball = {
            x : this.canvas.width/2,
            y : this.canvas.height/2,
            radius : 10,
            velocityX : 2,
            velocityY : 2,
            speed : 5,
            color : "WHITE"
        }
        // this.paddle1 Paddle properties
        this.paddle1 = {
            x : 10, // left side of canvas
            y : (this.canvas.height - this.paddleHeight)/2,
            // width : 10,
            // height : 100,
            score : 0,
            color : "RED"
        }
        // this.paddle2 Paddle properties
        this.paddle2 = {
            x : this.canvas.width - this.paddleWidth - 10,
            y : (this.canvas.height - this.paddleHeight)/2,
            // width : 10,
            // height : 100,
            score : 0,
            color : "RED"
        }

        // NET properties
        this.net = {
            x : (this.canvas.width - this.netWidth)/2,
            y : 0,
            height : 10,
            width : 2,
            color : "WHITE"
        }
        // Bind event listeners
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('keydown', (event) => this.keyDownHandler(event));
        window.addEventListener('keyup', (event) => this.keyUpHandler(event));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * 0.77;
        this.canvas.height = this.canvas.width * 2 / 3;
    }
        
    keyDownHandler(e) {
        let pause = document.getElementsByClassName('pause');
        
        if (!this.introElements && this.introElements[1].style.visibility != "hidden")
            return;
        switch (e.key) {
            case 'ArrowUp':
            this.upPressed = true;
            break;
            case 'ArrowDown':
            this.downPressed = true;
            break;
            case 'w':
            case 'W':
            this.wPressed = true;
            break;
            case 's':
            case 'S':
            this.sPressed = true;
            break;
            case 'p':
            case 'P':
            this.paused = !this.paused;
            let str = this.paused ? "visible" : "hidden";
            for (let i = 0; i < pause.length; i++) {
                pause[i].style.visibility = str;
            }
            break;
            case 'Escape':
            this.clearCanvas();
            this.endGame();
            break;
        }
    }
  
    keyUpHandler(e) {
      switch (e.key) {
        case 'ArrowUp':
          this.upPressed = false;
          break;
        case 'ArrowDown':
          this.downPressed = false;
          break;
        case 'w':
        case 'W':
          this.wPressed = false;
          break;
        case 's':
        case 'S':
          this.sPressed = false;
          break;
      }
    }
  
    drawRect(x, y, w, h, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }
    
    // draw circle, will be used to draw the ball
    drawArc(x, y, r, color){
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x,y,r,0,Math.PI*2,true);
        this.ctx.closePath();
        this.ctx.fill();
    }
        
    endGame() {
        let pause = document.getElementsByClassName('pause');
        this.gameOver = true;
        clearInterval(this.gameLoop);
        this.gameLoop = null; // Reset the game loop variable
        this.clearCanvas();
        this.resetGame();
        for (let i = 0; i < this.introElements.length; i++) {
            this.introElements[i].style.visibility = "visible";
        }
        for (let i = 0; i < pause.length; i++) {
            pause[i].style.visibility = "hidden";
        }
    }

    // when COM or USER scores, we reset the ball
    resetBall(){
        this.ball.x = this.canvas.width/2;
        this.ball.y = this.canvas.height/2;
        this.ball.velocityX = -this.ball.velocityX;
        this.ball.speed = 5;
    }

    // draw the net
    drawNet(){
        for(let i = 0; i <= this.canvas.height; i+=5){
            this.drawRect(this.net.x, this.net.y + i, this.net.width, this.net.height, this.net.color);
        }
    }

    // draw text
    drawText(text,x,y){
        this.ctx.fillStyle = "#FFFF00";
        this.ctx.font = "75px Orbitron";
        this.ctx.fillText(text, x, y);
    }

    // this.collision detection
    collision(b,p){
        p.top = p.y;
        p.bottom = p.y + this.paddleHeight;
        p.left = p.x;
        p.right = p.x + this.paddleWidth;
        
        b.top = b.y - b.radius;
        b.bottom = b.y + b.radius;
        b.left = b.x - b.radius;
        b.right = b.x + b.radius;
        
        return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
    }
    // // Use this to play sounds instead of directly calling audio.play()
    // // If multiple sound effects are triggered in quick succession, the browser 
    // // might not handle them well, leading to some sounds not playing.
    // playSound(audio) {
    //   const soundClone = audio.cloneNode(); 
    //   soundClone.play();
    // }

    // update  the that does all calculations
    update(){
    if (this.gameOver || this.paused) return;
    // 1. Ball Movement and Wall Collision:

        // Update ball's X and Y position based on its velocity
        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;
        
        // Check for collisions with top and bottom walls
        if (this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > this.canvas.height) {
        this.ball.velocityY = -this.ball.velocityY; // Reverse Y velocity on collision
        this.wall.play(); // Play sound effect
        }
        // 2. this.paddle1 Paddle Movement (Keyboard Controls):
        // Check if up or down key is pressed and update this.paddle1.y accordingly
        if (this.wPressed && this.paddle1.y > 0) {
        this.paddle1.y -= 5; // Move this.paddle1 paddle up by 5 units (adjust speed as needed)
        } else if (this.sPressed && this.paddle1.y + this.paddleHeight < this.canvas.height) {
        this.paddle1.y += 5; // Move this.paddle1 paddle down by 5 units (adjust speed as needed)
        }

        if (this.upPressed && this.paddle2.y > 0) {
            this.paddle2.y -= 5; // Move this.paddle1 paddle up by 5 units (adjust speed as needed)
        } else if (this.downPressed && this.paddle2.y + this.paddleHeight < this.canvas.height) {
            this.paddle2.y += 5; // Move this.paddle1 paddle down by 5 units (adjust speed as needed)
        }
        // 3. this.Ball and Paddle Collision:
        // this.Ball and Paddle Collision for this.paddle1
        if (this.collision(this.ball, this.paddle1)) {
            this.hit.play();
            // we check where the this.ball hits the paddle
            let collidePoint = (this.ball.y - (this.paddle1.y + this.paddleHeight / 2));
            // normalize the value of collidePoint, we need to get numbers between -1 and 1.
            // -player.height/2 < collide Point < player.height/2
            collidePoint = collidePoint / (this.paddleHeight / 2);
            // when the this.ball hits the top of a paddle we want the this.ball, to take a -45degees angle
            // when the this.ball hits the center of the paddle we want the this.ball to take a 0degrees angle
            // when the this.ball hits the bottom of the paddle we want the this.ball to take a 45degrees
            // Math.PI/4 = 45degrees
            let angleRad = (Math.PI / 4) * collidePoint;
            this.ball.velocityX = this.ball.speed * Math.cos(angleRad);
            this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
        }

    // this.Ball and Paddle Collision for this.paddle2
        if (this.collision(this.ball, this.paddle2)) {
            this.hit.play();
            // we check where the this.ball hits the paddle
            let collidePoint = (this.ball.y - (this.paddle2.y + this.paddleHeight / 2));
            // when the this.ball hits the top of a paddle we want the this.ball, to take a -45degees angle
            // when the this.ball hits the center of the paddle we want the this.ball to take a 0degrees angle
            // when the this.ball hits the bottom of the paddle we want the this.ball to take a 45degrees
            // Math.PI/4 = 45degrees
            collidePoint = collidePoint / (this.paddleHeight / 2);
            let angleRad = (Math.PI / 4) * collidePoint;
            this.ball.velocityX = -this.ball.speed * Math.cos(angleRad);
            this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
        }
        // 4. Scoring and this.Ball Reset:
        // Check if this.ball goes past this.paddle1 or this.paddle2 for scoring and reset
        // change the score of players, if the this.ball goes to the left "this.ball.x<0" computer win, else if "this.ball.x > this.canvas.width" the user win
            if( this.ball.x - this.ball.radius < 0  && !this.collision(this.ball, this.paddle1)){
                this.paddle2.score++;
                if (this.paddle2.score > 9){
                this.winner = "User 2 Wins!";
                this.gameOver = true;
                return;
                }
                this.resetBall();
            } 
            else if( this.ball.x + this.ball.radius > this.canvas.width && !this.collision(this.ball, this.paddle2)){
            this.paddle1.score++;
                if (this.paddle1.score > 9){
                this.winner = "User 1 Wins!";
                this.gameOver = true;
                return;
                }
                this.resetBall();
            }
    }

    // render  the that does al the drawing
    render(){
        // clear the this.canvas
        this.drawRect(0, 0, this.canvas.width, this.canvas.height, "#000");
        
        // draw the this.paddle1 score to the left
        this.drawText(this.paddle1.score,this.canvas.width/4,this.canvas.height/5);
        
        // draw the this.paddle2 score to the right
        this.drawText(this.paddle2.score,3*this.canvas.width/4,this.canvas.height/5);
        
        // draw the net
        this.drawNet();
        
        // draw the this.paddle1 paddle
        this.drawRect(this.paddle1.x, this.paddle1.y, this.paddleWidth, this.paddleHeight, this.paddle1.color);
        
        // draw the this.paddle2 paddle
        this.drawRect(this.paddle2.x, this.paddle2.y, this.paddleWidth, this.paddleHeight, this.paddle2.color);
        
        // draw the this.ball
        this.drawArc(this.ball.x, this.ball.y, this.ball.radius, this.ball.color);

        // draw the this.winner text if game over
        if (this.gameOver) {
        this.drawText(this.winner, this.canvas.width / 4, this.canvas.height / 2);
        }
        // draw the this.paused text if game  this.paused
        // if (this.paused) {
        //    drawText("Game this.Paused", this.canvas.width / 4, this.canvas.height / 2);
    // }
    }
    game(){
        this.update();
        this.render();
    }
    // number of frames per second
    resetGame() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.velocityX = 2; // Reset this.ball velocity
        this.ball.velocityY = 2; // Reset this.ball velocity
        this.ball.speed = 5;  // Reset ball speed if it changes during the game
        this.paddle1.y = (this.canvas.height - this.paddleHeight) / 2;
        this.paddle2.y = (this.canvas.height - this.paddleHeight) / 2;
        this.paddle1.score = 0;
        this.paddle2.score = 0;
        this.winner = "";
        this.gameOver = false;
        this.paused = false;
        this.clearCanvas();  // Clear the canvas to avoid leftover visuals from previous game
    }

    // Clear the canvas completely
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    launchgame() {
        let framePerSecond = 50;
        // Clear existing interval before creating a new one
        for (let i = 0; i < this.introElements.length; i++) {
            this.introElements[i].style.visibility = "hidden";
        }
        clearInterval(this.gameLoop);
        // Reset the game state to ensure a clean start
        this.resetGame();
    
        // Start the game loop
        // Call the game function 50 times every 1 second
        this.gameLoop = setInterval(() => {
            if (this.gameOver) {
                this.win.play();
                clearInterval(this.gameLoop);
            }
            this.game();
        }, 1000 / framePerSecond);
    }
    tournamentmenue()
    {
        for (let i = 0; i < this.introElements.length; i++) {
            this.introElements[i].style.visibility = "hidden";
        }
        for (let i = 0; i < this.tournamentBrackets.length; i++) {
            this.tournamentBrackets[i].style.visibility = "visible";
        }

        document.getElementById("startmatch").addEventListener('click', () => this.launchtournament());
    }
    tournamentusersetup()
    {
        this.round2p1 = null;
        this.round2p2 = null;
        this.user1 = document.getElementById('user1').value;
        this.user2 = document.getElementById('user2').value;
        this.user3 = document.getElementById('user3').value;
        this.user4 = document.getElementById('user4').value;
        if (this.user1 == "" || this.user2 == "" || this.user3 == "" || this.user4 == "") {
            alert("Please enter all four usernames");
            return;
        }
        if (this.user1 != this.user2 && this.user1 != this.user3 && this.user1 != this.user4 && this.user2 != this.user3 && this.user2 != this.user4 && this.user3 != this.user4) {
            alert("Please enter unique usernames");
            return;
        }
        document.getElementById('user1').readOnly = true;
        document.getElementById('user2').readOnly = true;
        document.getElementById('user3').readOnly = true;
        document.getElementById('user4').readOnly = true;
        this.tournamenttrace = 1;
    }
    launchtournament() {
       if (this.tournamenttrace == 0)
            this.tournamentusersetup();
        if (this.tournamenttrace > 0 && this.tournamenttrace < 4)
            for (let i = 0; i < this.tournamentBrackets.length; i++) {
                this.tournamentBrackets[i].style.visibility = "hidden";
            }
        if(this.tournamenttrace == 1)
        {
            this.round2p1 = this.matchMedia(user1, user2);
            document.getElementById('round21').value = round2p1;
            this.tournamenttrace = 2;
        }
        else if(this.tournamenttrace == 2)
        {
            this.round2p2 = this.matchMedia(user3, user4);
            document.getElementById('round22').value = round2p2;
            this.tournamenttrace = 3;
        }
        else if(this.tournamenttrace == 3)
        {
            round3 = this.matchMedia(round2p1, round2p2);
            document.getElementById('winner').value = round3;
            document.getElementById("startmatch").value = "Close";
        }
        else if(this.tournamenttrace == 4)
        {
            this.endGame();
        }
        for (let i = 0; i < this.tournamentBrackets.length; i++) {
            this.tournamentBrackets[i].style.visibility = "visible";
        }
        
    }
}
PongGame.instance = null;
