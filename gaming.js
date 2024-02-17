var game_canva = document.getElementById('pong_canva');
var context = game_canva.getContext('2d');
var pauseButton = document.getElementById("pauseButton");
var isFirstRound = true;
var isPaused = false;
var currentBubblesCount = 0;

var X = game_canva.width / 2;
var Y = game_canva.height - 50;

var difficultyLevel = 1;

function gameOver() {
    var choice = confirm("Game Over! Your score: " + difficultyLevel + ". Do you want to play again?");
    
    if (choice) {
        resetGame();
    } else {
        window.close();
    }
}

function checkGameOver() {
    for (var i = 0; i < bubblesArray.length; i++) {
        var bubble = bubblesArray[i];

        // Vérifier si le ballon a déjà atteint le bas de l'écran
        if (bubble.y + bubble.radius > Y - 5 && bubble.x + bubble.radius > X - 15 && bubble.x - bubble.radius < X + 15 && bubble.y - bubble.radius < Y) {
            gameOver();
            return;
        }
    }
}

function updateBubblesCountDisplay() {
    document.getElementById('ballons-display').innerText = "Balloons: " + currentBubblesCount;
}


function updateDifficultyDisplay() {
    document.getElementById('difficulty-display').innerText = difficultyLevel;
}

function increaseDifficulty() {
    if (!isFirstRound) {
        difficultyLevel++;
    }
    isFirstRound = false;
}

function resetDifficulty() {
    difficultyLevel = 1;
    isFirstRound = true;
}

function getRectangleSize() {
    // Ajustez cette formule selon vos besoins
    if(difficultyLevel < 50) {
        return 90 - difficultyLevel * 1;
    }
    else {
        return 30;
    }
}

// Barre de jeu
function drawRectangle() {
    context.beginPath();
    var rectangleSize = getRectangleSize();
    context.rect(X - rectangleSize / 2, Y, rectangleSize, 25);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}

// Fonction de dessin des ballons
function drawBubble(x, y, radius, color) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.imageSmoothingEnabled = true;
    context.fill();
    context.closePath();
}

// Mouvement de la barre vers la gauche
function moveLeft() {
    X -= 15;
    if (X < 0) {
        X = 15;
    }
}

// Mouvement de la barre vers la droite
function moveRight() {
    X += 15;
    if (X > game_canva.width) {
        X = game_canva.width - 15;
    }
}

// Gestionnaire d'événements pour les touches fléchées
document.addEventListener("keydown", function(e) {
    switch (e.keyCode) {
        case 39:
            moveRight();
            break;
        case 32:
            isPaused = !isPaused;
            togglePause(isPaused);
            break;    
        case 37:
            moveLeft();
            break;
        default:
    }
});

// Tableau pour stocker les ballons
var bubblesArray = [];

function generateBubbles() {
    var minNumberOfBubbles = difficultyLevel / 2;
    var numberOfBubbles = Math.ceil(getRandomArbitrary(minNumberOfBubbles, difficultyLevel));

    for (var i = 0; i < numberOfBubbles; i++) {
        var baseSpeed = 1;
        var speedMultiplier = 1 + (difficultyLevel * 0.1);
        var maxRadius = 15 + difficultyLevel / 2;
        
        var x = Math.random() * game_canva.width;
        var y = 0;
        var radius = getRandomArbitrary(2, maxRadius);
        var speed = baseSpeed + (getRandomArbitrary(0.1, 0.5) * speedMultiplier);

        var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
        bubblesArray.push({ x: x, y: y, radius: radius, color: color, speed: speed });
        currentBubblesCount++;
    }
    increaseDifficulty();

}

// Fonction principale d'animation
var currentBubblesCount = 0;

function animate() {
    if (!isPaused) {
        context.clearRect(0, 0, game_canva.width, game_canva.height);

        drawRectangle();

        var ballsPassed = 0;

        bubblesArray.forEach(function(bubble, index) {
            drawBubble(bubble.x, bubble.y, bubble.radius, bubble.color);
            bubble.y += bubble.speed;

            if (bubble.y > game_canva.height && !bubble.passed) {
                bubble.passed = true;
                ballsPassed++;
            }

            // Supprimez les ballons passés du tableau
            if (bubble.y > game_canva.height + bubble.radius) {
                bubblesArray.splice(index, 1);
            }
        });

        currentBubblesCount = Math.max(0, currentBubblesCount - ballsPassed);

        if (Math.random() < 0.02 && bubblesArray.length === 0) {
            generateBubbles();
        }

        checkGameOver();

        updateDifficultyDisplay();
        updateBubblesCountDisplay();
        requestAnimationFrame(animate);
    }
}

function resetGame() {
    currentBubblesCount = 0;
    bubblesArray = [];
    X = game_canva.width / 2;
    Y = game_canva.height - 50;
    
    resetDifficulty();
    updateDifficultyDisplay();
}

var left_arrow = document.getElementById("left_arrow");
var right_arrow = document.getElementById("right_arrow");

left_arrow.addEventListener("click", moveLeft);
right_arrow.addEventListener("click", moveRight);


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function togglePause(isPaused) {
    if (isPaused) {
        // Le jeu est en pause
        pauseButton.innerHTML = "<i class='fa-solid fa-circle-play play' id='play'></i>";
    } else {
        pauseButton.innerHTML = "<i class='fa-solid fa-circle-pause pause' id='pause'></i>";
        requestAnimationFrame(animate);
    }
}



pauseButton.addEventListener("click", function() {
    isPaused = !isPaused;
    togglePause(isPaused);
});

// Main game loop
animate();