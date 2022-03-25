var game_canva = document.getElementById('pong_canva');
const level = document.getElementById('level');
const leftArrow = document.getElementById("left_arrow");
const rightArrow = document.getElementById("right_arrow");

localStorage.setItem("difficulty_level", "1");

let localDifficulty = localStorage.getItem("difficulty_level");
let difficulty = parseInt(localDifficulty);

/* canvas */
if (game_canva.getContext){
    var context = game_canva.getContext('2d');
} else {
    alert('canvas non supporté par ce navigateur');
}

var X = game_canva.width/2;
var Y = game_canva.height-30;

var timing = 8000;

let bubblesArray = [];
let speed;

generateBubbles(difficulty);
generateRectangle();
setInterval(() => {
    generateBubbles(difficulty + 1);
    difficulty += 1;
    localStorage.setItem("difficulty_level", difficulty);
    level.innerHTML= "Difficulté niveau : " + difficulty;
    console.log("Difficulty level : " + difficulty);
}, timing);

fallingAnim();
gameOver();



context.globalCompositeOperation = 'darker';  

function generateRectangle() {
    context.save();  
    /* sauvegarde de l'état du contexte */
    /* effaçage */
    //context.clearRect(0, 0, game_canva.width,game_canva.height);
    context.clearRect(0, Y, game_canva.width, 0);
    /* translation du contexte et dessin du rectangle */
    if(X > game_canva.width -25) {
        X = game_canva.width -28;
        context.translate(X, Y);
    }
    else if(X < 25) {
        X = 28;
        context.translate(X, Y);
    }
    else {
        context.translate(X -25, Y);
    }
    context.fillStyle = "blue";
    context.fillRect(0, 0, 50, 20);
    context.restore();
}

function generateColor() {
    let hexSet = "0123456789ABCDEF";
    let finalHexString = "#";
    for (let i = 0; i < 6; i++) {
      finalHexString += hexSet[Math.ceil(Math.random() * 15)];
    }
    return finalHexString;
  }

function generateBubbles(amount) {
    if (timing >= 3001) {
        timing -= 250;
    }
    else if (timing <= 3000 && timing >= 501) {
        timing -= 500;
    }
    else if(timing <= 500 && timing >= 351){
        timing -= 100;
    }
    else {
        timing = 250;
    }
    
    console.log("Next round in: " + timing + "ms");
    for (let i = 0; i < amount; i++) {
        bubblesArray[i] = new Bubble(
            getRandomArbitrary(10, game_canva.width),
            0, 
            getRandomArbitrary(4, 30),
            speed = Math.random()
        );
    }
};

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function Bubble(x, y, rayon, speed) {
    
    this.x = x;
    this.y = y;
    this.rayon = rayon;
    this.speed = speed;
    this.color = generateColor();
    this.draw = function() {
       
       context.beginPath();
       context.arc(this.x, this.y, this.rayon, 0, Math.PI * 2);
       context.fillStyle = this.color;
       context.fill();

      
    }
    this.fall = function() {
        
        this.y = this.y + (1 + speed);
        this.draw();
        generateRectangle();
        //console.log(speed);
    }
    this.fall();

 }

 /* fonction de dessin */
 function fallingAnim() {
    context.save();
    context.clearRect(0, 0, game_canva.width,game_canva.height);
    requestAnimationFrame(fallingAnim);
  
    bubblesArray.forEach((bubble) => bubble.fall());
    context.restore();
  }

function Translation() {
    context.save();
    generateRectangle();
    context.restore();
}
    

// Keyup/down mouvements //
document.addEventListener("keydown", down, false);
document.addEventListener("keyup", up, false);

function down(e){
    // traitement de différents cas
    switch(e.keyCode) {   
    case 39:
        // flèche droite
        X = X +24;
    break;
    case 37:
          // flèche gauche
        X = X -24;
          break;
        default:
    }
    Translation();
}
function up(e){
    X = X;
    Y = Y;
    //console.log("x = " + X);
}

leftArrow.onclick = function() {
    X = X -24;
};

rightArrow.onclick = function() {
    X = X +24;
};

function gameOver() {
    for (let i = 0; i < bubblesArray.length; i++) {
        console.log("Bubble " + i + "; x: " + bubblesArray[i]["x"] + ";");
        console.log("Bubble " + i + "; y: " + bubblesArray[i]["y"] + ";");
      }
};