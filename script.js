const board = document.querySelector(".board");
const boardHeight = 50;
const boardWidth = 50;
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.getElementById("high-score");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");

let highScore = localStorage.getItem("highScore") || 0
let score = 0;
let time = `00-00`;
highScoreElement.innerText = highScore;

let intervalId = null;
let timerIntervalId = null;

const cols = Math.floor(board.clientWidth / boardWidth);
const rows = Math.floor(board.clientHeight / boardHeight);
const blocks = [];
let food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
let snake = [{ x:1 , y:3 }];
let direction = "down";

for(let row = 0 ; row < rows ; row++){
    for(let col = 0 ; col < cols ; col++){
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
   blocks[`${row}-${col}`] = block;
    }
};

function render(){
        let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food");

    if(direction === "left"){
        head = {x: snake[0].x , y: snake[0].y-1};
    }
    else if(direction === "right"){
        head = {x: snake[0].x , y: snake[0].y+1};
    }
    else if(direction === "down"){
        head = {x: snake[0].x+1 , y: snake[0].y};
    }
    else if(direction === "up"){
        head = {x: snake[0].x-1 , y: snake[0].y};
    }

    //Wall Collison logic
    if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols){
    clearInterval(intervalId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    clearInterval(timerIntervalId);
    return;
    }

    //Food Consume Logic
    if(head.x == food.x && head.y == food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
        blocks[`${food.x}-${food.y}`].classList.add("food");
         snake.unshift(head);
    score +=10;
    scoreElement.innerText = score;

    if(score > highScore){
        highScore = score;
       localStorage.setItem("highScore",highScore.toString());
    }
    }

    snake.forEach(segment => {
       blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    snake.unshift(head);
    snake.pop();

    snake.forEach(segment => {
       blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
};

startButton.addEventListener("click" , event => {
    modal.style.display = "none";
    intervalId = setInterval(() => {render() }, 300);
    timer();
});

restartButton.addEventListener("click" , restartGame)

function restartGame(){
 blocks[`${food.x}-${food.y}`].classList.remove("food");
 snake.forEach(segment => {
       blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });
    
 score = 0;
 time = `00-00`;
 scoreElement.innerText = score;
 timeElement.innerText = time;
 highScoreElement.innerText = highScore;

timer();

 modal.style.display = "none";
 direction = "down";
 snake = [{ x:1 , y:3 }];
 food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
 intervalId = setInterval(() => {render() }, 300);

}

addEventListener("keydown" , event => {
    if(event.key === "ArrowUp")  {
        direction = "up";
    }
    else if(event.key === "ArrowDown")  {
        direction = "down";
    }
    else if(event.key === "ArrowRight")  {
        direction = "right";
    }
    else {
        direction = "left";
    }
    
});

function timer(){
    timerIntervalId = setInterval(() =>  {
        let [min , sec] = time.split("-").map(Number);

        if(sec == 59){
            min+=1;
            sec=0;
        }
        else {
            sec+=1;
        }
        time = `${min}-${sec}`;
        timeElement.innerText = time;
    },1000);
}



