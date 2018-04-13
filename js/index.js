//点击开始游戏 startPage消失 游戏开始 
//随机出现食物，默认三节🐍开始运动
//上下左右 改变🐍的运动方向
//判断是否吃到食物 食物消失，🐍长度+1
//判断游戏结束，弹出结束框

var content = document.getElementsByClassName('content')[0],
    startPage = document.getElementsByClassName('startPage')[0],
    startBtn = startPage.getElementsByClassName('startBtn')[0],
    imgBtn = document.querySelector('.left_side img'),
    scoreSpan = document.getElementById('score'),
    loser = document.getElementsByClassName('loser')[0],
    loserScore = document.getElementsByClassName('loserScore')[0],
    leftImg = document.getElementById('leftImg'),
    close = document.getElementsByClassName('close')[0],
    moveSnake = null,
    speed = 200;

init();


//初始状态
function init() {
    //地图
    this.mapW = parseInt(getStyle(content, 'width'));
    this.mapH = parseInt(getStyle(content, 'height'));
    this.mapDiv = content;
    //食物
    this.foodW = 20;
    this.foodH = 20;
    this.foodX = 0;
    this.foodY = 0;
    //🐍
    this.snake = [[3, 0, 'head'], [2, 0, 'body'], [1, 0, 'body']];
    this.snakeW = 20;
    this.snakeH = 20;
    //游戏属性
    this.direction = 'right';
    this.left = false; //蛇运动的方向如果是左右，只有按上下键才能运动;
    this.right = false;
    this.top = true;
    this.down = true;
    this.score = 0;
    this.isPause = true; //判断游戏当前状态 处于运动状态可进行暂停
    this.isStartGame = true;//判断此前游戏可开始新一轮游戏
    bindEvent();
}

function startGame() {
    makeFood();
    makeSnake();
    this.isStartGame = false;
}

//生成食物
function makeFood() {
    var food = document.createElement('div');
    food.setAttribute('class', 'food');
    food.style.width = this.foodW + 'px';
    food.style.height = this.foodH + 'px';
    food.style.position = "absolute";
    this.foodX = Math.floor(Math.random() * (this.mapW / this.foodW - 1));
    this.foodY = Math.floor(Math.random() * (this.mapH / this.foodH - 1));
    food.style.left = this.foodX * this.foodW + 'px';
    food.style.top = this.foodY * this.foodH + 'px';
    content.appendChild(food);
}
//生成🐍
function makeSnake() {
    for (var i = 0; i < this.snake.length; i++) {
        var snakeDiv = document.createElement('div');
        snakeDiv.style.width = this.snakeW + 'px';
        snakeDiv.style.height = this.snakeH + 'px';
        snakeDiv.style.position = 'absolute';
        snakeDiv.style.left = this.snake[i][0] * this.snakeW + 'px';
        snakeDiv.style.top = this.snake[i][1] * this.snakeH + 'px';
        switch (this.direction) {
            case 'right': break;
            case 'left':
                snakeDiv.style.transform = 'rotate(180deg)';
                break;
            case 'top':
                snakeDiv.style.transform = 'rotate(-90deg)';
                break;
            case 'down':
                snakeDiv.style.transform = 'rotate(90deg)';
                break;
            default: break;
        }
        snakeDiv.setAttribute('class', 'snake' + this.snake[i][2]);
        snakeDiv.classList.add('snake');
        content.appendChild(snakeDiv);
    }
}
//🐍move
function snakeMove() {
    //蛇身的后一节运动到🐍身体的前一节
    for (var i = this.snake.length - 1; i > 0; i--) {
        this.snake[i][0] = this.snake[i - 1][0];
        this.snake[i][1] = this.snake[i - 1][1];
    }
    switch (this.direction) {
        case 'right':
            this.snake[0][0] += 1;
            break;
        case 'left':
            this.snake[0][0] -= 1;
            break;
        case 'top':
            this.snake[0][1] -= 1;
            break;
        case 'down':
            this.snake[0][1] += 1;
            break;
        default: break;
    }
    removeClass('snake'); //将之前的那条蛇删除
    makeSnake(); //重新渲染一条蛇
    //判断蛇是否吃到食物 蛇头的坐标 == 食物的坐标
    if (this.snake[0][0] == this.foodX && this.snake[0][1] == this.foodY) {
        removeClass('food');
        makeFood();
        //蛇的身体加上一节
        var snakeEndX = this.snake[this.snake.length - 1][0],
            snakeEndY = this.snake[this.snake.length - 1][1];
        switch (this.direction) {
            case 'right':
                snakeEndX -= 1;
                break;
            case 'left':
                snakeEndX += 1;
                break;
            case 'top':
                snakeEndY += 1;
                break;
            case 'down':
                snakeEndY -= 1;
                break;
            default: break;
        }
        this.snake.push([snakeEndX, snakeEndY, 'body'])
        scoreSpan.innerHTML = ++this.score
    }
    //判断蛇是否撞墙 或者 撞到自身
    var maxX = Math.ceil(this.mapW / this.snakeW),
        maxY = this.mapH / this.snakeH,
        snakeHX = this.snake[0][0],
        snakeHY = this.snake[0][1];
    if (snakeHX < 0 || snakeHX > maxX || snakeHY < 0 || snakeHY > maxY) {
        reloadGame()
    }
    for (var i = 1; i < this.snake.length; i++) {
        if (snakeHX == this.snake[i][0] && snakeHY == this.snake[i][1]) {
            reloadGame()
        }
    }
}
//重新加载游戏
function reloadGame() {
    removeClass('snake'); //删除蛇
    removeClass('food'); //删除食物
    clearInterval(moveSnake); //清除定时器
    loser.style.display = 'block';
    loserScore.innerHTML = this.score;
    this.score = 0;
    scoreSpan.innerHTML = this.score;
    leftImg.src = "./images/start.png";
    this.isPause = true;
    //恢复初始化
    //🐍
    this.snake = [[3, 0, 'head'], [2, 0, 'body'], [1, 0, 'body']];
    //游戏属性
    this.direction = 'right';
    this.left = false;
    this.right = false;
    this.top = true;
    this.down = true;
    this.score = 0;
    this.isStartGame = true;
}
//删除
function removeClass(demo) {
    var demos = document.getElementsByClassName(demo);
    while (demos.length > 0) {
        demos[0].parentNode.removeChild(demos[0]);
    }
}

//事件绑定
function bindEvent() {
    //这里注意this的指向
    //点击开始游戏
    startBtn.onclick = function () {
        startPage.style.display = 'none';
        imgBtn.style.display = 'block';
        //游戏开始
        startAndPause()
    }
    close.onclick = function () {
        loser.style.display = 'none';
    }
    leftImg.onclick = () => {
        startAndPause()
    }
}
function startAndPause() {
    if (this.isPause) {
        if (this.isStartGame) {
            startGame();
        }
        leftImg.src = "./images/pause.png";
        document.onkeydown = (e) => {
            var code = e.keyCode;
            switch (code) {
                case 37:
                    if (this.left) {
                        this.direction = 'left';
                        this.top = true;
                        this.down = true;
                        this.left = false;
                        this.right = false;
                    }
                    break;
                case 38:
                    if (this.top) {
                        this.direction = 'top';
                        this.left = true;
                        this.right = true;
                        this.top = false;
                        this.down = false;
                    }
                    break;
                case 39:
                    if (this.right) {
                        this.direction = 'right';
                        this.top = true;
                        this.down = true;
                        this.left = false;
                        this.right = false;
                    }
                    break;
                case 40:
                    if (this.down) {
                        this.direction = 'down';
                        this.left = true;
                        this.right = true;
                        this.top = false;
                        this.down = false;
                    }
                    break;
                default: break;
            }
        }
        moveSnake = setInterval(function () {
            snakeMove();
            speed += parseInt(this.score / 5) * 10
        }, speed)
        this.isPause = false;
    } else {
        leftImg.src = "./images/start.png";
        clearInterval(this.moveSnake)
        document.onkeydown = (e) => {
            e.returnValue = false;
            return false
        }
        this.isPause = true;
    }
}

//获取样式兼容
function getStyle(demo, prop) {
    if (demo.currentStyle) {
        return demo.currentStyle[prop];
    } else {
        return window.getComputedStyle(demo, null)[prop];
    }
}