//get the canvas
const canvas = document.getElementById("canvas");
//game over section, hidden by default
const gameOverDiv = document.getElementById("gameOver");
//the header of the game
const header = document.getElementById("header");
//draw the ctx, set 2d since we are using 2d
const ctx = canvas.getContext("2d");

//class for snake
class snakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//now we will read the properties from the JSON String 
//stored in the local storage
//parse to JSON Objs first, and merge them together
let preferences = JSON.parse(localStorage.getItem("preferences"));

//set the speed of the game
let speed = parseInt(preferences[0]["value"]);
//we have 20 titles across the board and 20 down
let titleCount = 20;

//title size is with / count so we have the appropriate number of count
//we have 18 titles
let titleSize = (canvas.width / titleCount) - 2;
//for the snake
//in the middle of the screen
//since we have 20 titles, the snake is 10 right and 10 down
let headX = 10;
let headY = 10;
let snakeParts = [];
let length = 2;

//set the lives of the snake
let lives = parseInt(preferences[1]["value"]);

//to move the snake
let xVelo = 0;
let yVelo = 0;

//for the food
let appleX = 5;
let appleY = 5;

//score
let score = 0;

//pause
let paused = false;
let pauseBtn = document.getElementById("pause");

//pause and quit btn
let btns = document.getElementById("buttons");

//game loop
function drawGame() {
    //show the canvas
    canvas.style.display = "block";
    //show the header
    header.style.display = "block";
    //show pause and quit
    btns.style.display = "flex";
    //hide the game over
    gameOverDiv.style.display = "none";

    console.log(snakeParts.length)
    console.log(snakeParts)
    //game logic
    changeSnakePosition();

    let result = isGameOver();
    //if game over, stop the game
    if (result) {
        return;
    }

    drawScore();
    clrScreen();
    drawSnake();

    drawApple();
    checkAppleCollision();
    //check for pause
    //handle pause
    if (!paused) {
        pauseBtn.addEventListener('click', pause);
        pauseBtn.removeEventListener('click', cont);
    }
    //handle continue
    if (paused) {
        pauseBtn.addEventListener('click', cont);
        pauseBtn.removeEventListener('click', pause);
    }
    //update the screen 3 times a second
    if (!paused)
        setTimeout(drawGame, 1000 / speed);
}

function clrScreen() {
    //fill canvas with color
    //get the color from user's preferences
    ctx.fillStyle = preferences[2]["value"];
    //draw a filled rectangle covering the entire canvas
    //start with 0x and 0y, top right and top left
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = preferences[3]["value"];
    //draw our snake
    //one title is one part on the snake
    //as the rectangle
    ctx.fillRect(headX * titleCount, headY * titleCount, titleSize, titleSize);

    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillStyle = preferences[3]["value"];
        //change the size
        ctx.fillRect(part.x * titleCount, part.y * titleCount, titleSize, titleSize)
    }

    //give the x and y position of where the head was, push new item
    //at the end of the list next to the head
    //we create new snake part at the next to the head

    //as we draw more part, it shifts the elem at the end so the length will be maintained
    snakeParts.push(new snakePart(headX, headY));

    //remove the furthers item from the snake part
    if (snakeParts.length > length) {
        snakeParts.shift();
    }
}

//update the score to the elem with has id of score
function drawScore() {
    document.getElementById("score").innerHTML = "Score: " + score + " | Live(s): " + lives;
}


function changeSnakePosition() {
    headX += xVelo;
    headY += yVelo;
}

function checkAppleCollision() {
    //if apple collision with the snake
    if (appleX == headX && appleY == headY) {
        //generate a new apple randomly
        appleX = Math.floor(Math.random() * titleCount);
        appleY = Math.floor(Math.random() * titleCount);
        length++;
        score++;
    }
}

function drawApple() {
    ctx.fillStyle = preferences[4]["value"];
    //fill apple same as snake
    ctx.fillRect(appleX * titleCount, appleY * titleCount, titleSize, titleSize);
}

//to check if the game is over using lives logic
function isGameOver() {
    let gameOver = false;

    //check if the game has started
    //or we have a velocity
    if (xVelo == 0 && yVelo == 0) return false;

    //check for Collision
    checkCollision();

    //if no lives left then the game is over
    if (lives <= 0) {
        gameOver = true;
        drawScore(); //show the score and lives one last time
    }
    //if game over then show the user the game over text
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 6.5);
        //show try again btn after 2 sec
        setTimeout(showTryAgain, 1000);
    }

    return gameOver;
}

//check if the snake collides with walls or itself
//for every time the snake collides, we reset 
//its position to the default position
//by setting headX and Y equal to 10
function checkCollision() {
    if (headX < 0) {
        lives--;
        headX = 10;
        headY = 10;
    }
    else if (headX == titleCount) {
        lives--;
        headX = 10;
        headY = 10;
    }
    else if (headY < 0) {
        lives--;
        headX = 10;
        headY = 10;
    }
    else if (headY == titleCount) {
        lives--;
        headX = 10;
        headY = 10;
    }
    //else if the snake bites itself
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x == headX && part.y == headY) {
            lives--;
            headX = 10;
            headY = 10;
            break;
        }
    }
}

//show try again btn
function showTryAgain() {
    //hide the canvas first
    canvas.style.display = "none";
    //hide the header
    header.style.display = "none";
    //hide the pause and quit btns
    btns.style.display = "none";
    //show the final score
    document.getElementById("finalScore").innerHTML = "Oops! " +
        "Your FINAL score is " + score + ".";
    //show the try again btn
    gameOverDiv.style.display = "block";
    //point the try again button to the drawGame() function
    document.getElementById("tryAgain").addEventListener("click", drawGame);
    reset(); //reset the game
}

//function for reset the game 
function reset() {
    //reset the variables
    paused = false;
    pauseBtn.innerHTML = "Pause";
    score = 0;
    lives = preferences[1]["value"];
    headX = 10;
    headY = 10;
    xVelo = 0;
    yVelo = 0;
    length = 2;
    snakeParts = [];
}

//add an event listener for our key
document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    //up
    //if moving up, we cannot move down
    if (event.keyCode == 38) {
        if (yVelo == 1) return;
        yVelo = -1;
        xVelo = 0;
    }

    //down
    if (event.keyCode == 40) {
        if (yVelo == -1) return;
        yVelo = 1;
        xVelo = 0;
    }

    //left 
    if (event.keyCode == 37) {
        if (xVelo == 1) return;
        yVelo = 0;
        xVelo = -1;
    }

    //left 
    if (event.keyCode == 39) {
        if (xVelo == -1) return;
        yVelo = 0;
        xVelo = 1;
    }
}

//for pausing
function pause() {
    paused = true;
    //change text to continue
    pauseBtn.innerHTML = "Continue";
}

//for continuing
function cont() {
    //change the pause btn back to pause
    pauseBtn.innerHTML = "Pause";
    //unpause
    paused = false;
    //continue to run the game
    drawGame();
}

//handle quit game logic
function quit() {
    if (confirm("Are you sure you want to give up?")) {
        reset(); //reset the game first
        window.location.replace("index.html");
    }
}

//run the game
drawGame();







