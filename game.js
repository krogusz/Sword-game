//additional functions to manage playing the music
let context;
window.onload = () => {
    context = new AudioContext();
    context.onstatechange = () => {
    //if you have permissions, the audioContext will transition to 'running' immediately
    if(context.state == 'running') {
      play();
    }
  }
};

const play  = () => {
    //ensure the promise is handled here
    let promise = document.getElementById('myaudio').play();
    if (promise !== undefined) {
      promise.then(_ => {
      }).catch(error => {
        // Autoplay was prevented.
      });
    }
};


//additional function to manage starting and finishing the game
function deleteGame(){
    const gameAreaDivs = document.querySelectorAll("#game_area > div")
    gameAreaDivs.forEach( elem => {
        document.getElementById("game_area").removeChild(elem);
    });
    const newMario = new Mario(container);
    newMario._renderMario();
    clearInterval(window.intervalObstacle);
};

function startProjection(){
    window.intervalObstacle = setInterval(() => {
        const newObstacle = new Obstacle(container);
        newObstacle._renderObstacle();
        play();
    },2500)
}



// definiition of objects
class Mario {
    constructor(container){
        this._container = container;
        this._top = 450;
        this._left = 10;
    }
    _renderMario(){
        //create Mario div and add it to container
        const Mario = document.createElement("div");
        const MarioImg = document.createElement("img");
        MarioImg.src = "./images/armor.png";
        Mario.classList.add("mario");
        Mario.appendChild(MarioImg);
        this._container.appendChild(Mario);
        //make Mario to move after pressing arrows
        window.addEventListener("keydown", e => {
            switch(e.keyCode){
                case 37:
                    this._left = Math.max(this._left - 20, 10);
                    break;
                case 38:
                    this._top = Math.max(this._top -20, 0);
                    break;
                case 39:
                    this._left = this._left + 20;
                    break;
                case 40:
                    this._top = Math.min(this._top + 20, 450);                    
                    break;
            };
            Mario.style.top = `${this._top}px`;
            Mario.style.left = `${this._left}px`;    
        })    
    }
}

class Obstacle {
    constructor(container){
        this._container = container;
        this._move = 0;
    }

    //check if obstacle has collision with Mario
    _checkCollision(elem1, elem2){
        let mario = document.getElementsByClassName("mario")[0];
        let marioPosition = mario.getBoundingClientRect();
        let obstacleDownPosition = elem1.getBoundingClientRect();
        let obstacleTopPosition = elem2.getBoundingClientRect();
        let crashHelp = 500 - marioPosition.bottom < obstacleDownPosition.height || marioPosition.top <= obstacleTopPosition.height;
        let crash = marioPosition.left <= obstacleDownPosition.right 
            && obstacleDownPosition.left <= marioPosition.right 
            && crashHelp;
        return crash;
    }


    
    _createSword(elem){
        const swordRightBlade = document.createElement("div");
        const swordLeftBlade = document.createElement("div");
        const swordBottomBlade = document.createElement("div");
        const swordTopBlade = document.createElement("div");

        swordRightBlade.classList.add("sword-right-blade");
        swordLeftBlade.classList.add("sword-left-blade");
        swordBottomBlade.classList.add("sword-bottom-blade");
        swordTopBlade.classList.add("sword-top-blade");

        elem.appendChild(swordRightBlade);
        elem.appendChild(swordLeftBlade);
        elem.appendChild(swordTopBlade);
        elem.appendChild(swordBottomBlade);
    }

    
    _renderObstacle(){

        //create obstacle (consiting of two, top and down, parts)
        const obstacleTop = document.createElement("div");
        const obstacleDown = document.createElement("div");
        obstacleDown.classList.add("obstacle-down");
        this._createSword(obstacleDown);
        obstacleTop.classList.add("obstacle-top");
        this._createSword(obstacleTop);
        this._container.appendChild(obstacleTop);
        this._container.appendChild(obstacleDown); 

        //random parameters (height and top) of obstacles
        let randomTop = Math.random()*400;
        let obstacleBreak = Math.max(90, Math.random()*100);
        let randomDown = Math.min(Math.random()*400,500-randomTop-obstacleBreak);

        obstacleTop.style.height = `${randomTop}px`;
        obstacleTop.style.top = '0px';        

        obstacleDown.style.height = `${randomDown}px`;
        obstacleDown.style.top = `${500 - randomDown}px`;

        obstacleTop.style.right = `${this._move}px`;
        obstacleDown.style.right = `${this._move}px`; 
        
        //make obstacle to move
        let interval = setInterval(() => {
            this._move = this._move + 10;
            obstacleTop.style.right = `${this._move}px` ;
            obstacleDown.style.right = `${this._move}px` ;
            this._checkCollision(obstacleDown, obstacleTop);
        },60);
        
        //check (very often) if collision happened
        let intervalCrash = setInterval(() => {
            if (this._checkCollision(obstacleDown, obstacleTop)){
                const message = confirm('crash!');
                if (message == true){
                    deleteGame()
                }else{deleteGame()}
            }
        },1)
    }
}

class Button{
    constructor(container){
        this._container = container ;
    }
    _renderButton(){
        const buttonStart = document.createElement("button") ;
        buttonStart.classList.add("button") ;
        buttonStart.innerHTML = "START" ;
        buttonStart.onclick = () => {
            startProjection();
            play();
        }
        this._container.appendChild(buttonStart) ;
    }
}

const container = document.getElementById("game_area");
const buttonContainer = document.getElementById("button_area");

const newButton = new Button(buttonContainer);
newButton._renderButton();

const newMario = new Mario(container);
newMario._renderMario();

