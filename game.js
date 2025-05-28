// Variables del juego
let player;
let foods = [];
let score = 0;
let gameSpeed = 2;
let gameRunning = true;
let animationId;
let lastFoodTime = 0;
const foodInterval = 1000;

// Inicialización del juego
function initGame() {
    // Configurar jugador
    player = document.getElementById('player');
    resetPlayerPosition();
    
    // Reiniciar variables
    score = 0;
    gameSpeed = 2;
    gameRunning = true;
    foods = [];
    lastFoodTime = performance.now();
    
    // Limpiar comidas anteriores
    clearAllFoods();
    
    // Actualizar UI
    updateScoreDisplay();
    hideGameOverScreen();
    
    // Configurar controles
    setupControls();
    
    // Iniciar bucle del juego
    gameLoop();
}

function resetPlayerPosition() {
    player.style.left = `${window.innerWidth / 2 - 30}px`;
}

function clearAllFoods() {
    document.querySelectorAll('.food').forEach(food => food.remove());
}

function updateScoreDisplay() {
    document.getElementById('score').textContent = `Puntuación: ${score}`;
}

function hideGameOverScreen() {
    const gameOverScreen = document.getElementById('game-over');
    gameOverScreen.style.display = 'none';
}

function showGameOverScreen() {
    const gameOverScreen = document.getElementById('game-over');
    gameOverScreen.style.display = 'flex';
    document.getElementById('final-score').textContent = `Puntuación: ${score}`;
}

function setupControls() {
    // Limpiar listeners anteriores
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('touchmove', handleTouch);
    
    // Agregar nuevos listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchmove', handleTouch, { passive: false });
}

// Bucle principal del juego
function gameLoop(timestamp) {
    if (!gameRunning) return;
    
    animationId = requestAnimationFrame(gameLoop);
    
    // Crear nueva comida
    if (timestamp - lastFoodTime > foodInterval) {
        createFood();
        lastFoodTime = timestamp;
    }
    
    moveFoods();
    checkCollisions();
}

// Crear comida chatarra
function createFood() {
    const food = document.createElement('div');
    food.className = 'food';
    
    const foodTypes = ['hamburguesa', 'papas', 'refresco', 'dona'];
    const randomType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
    food.style.backgroundImage = `url('img/obstaculos/${randomType}.png')`;
    
    const xPos = Math.random() * (window.innerWidth - 50);
    food.style.left = `${xPos}px`;
    food.style.top = '-50px';
    
    document.querySelector('.game-container').appendChild(food);
    foods.push({
        element: food,
        x: xPos,
        y: -50,
        speed: gameSpeed + Math.random()
    });
}

// Mover comida
function moveFoods() {
    for (let i = foods.length - 1; i >= 0; i--) {
        const food = foods[i];
        food.y += food.speed;
        food.element.style.top = `${food.y}px`;
        
        // Eliminar si sale de la pantalla
        if (food.y > window.innerHeight) {
            food.element.remove();
            foods.splice(i, 1);
            score++;
            updateScoreDisplay();
            gameSpeed = 2 + Math.floor(score / 10) * 0.3;
        }
    }
}

// Control de teclado
function handleKeyDown(e) {
    if (!gameRunning) return;
    
    const currentPosition = parseInt(player.style.left);
    const maxPosition = window.innerWidth - player.offsetWidth;
    
    if (e.key === 'ArrowLeft') {
        player.style.left = `${Math.max(0, currentPosition - 30)}px`;
    } 
    else if (e.key === 'ArrowRight') {
        player.style.left = `${Math.min(maxPosition, currentPosition + 30)}px`;
    }
}

// Control táctil
function handleTouch(e) {
    if (!gameRunning) return;
    e.preventDefault();
    
    const touchX = e.touches[0].clientX;
    const playerWidth = player.offsetWidth;
    player.style.left = `${Math.max(0, Math.min(touchX - playerWidth/2, window.innerWidth - playerWidth))}px`;
}

// Verificar colisiones
function checkCollisions() {
    const playerRect = player.getBoundingClientRect();
    
    for (let i = 0; i < foods.length; i++) {
        const foodRect = foods[i].element.getBoundingClientRect();
        
        if (isColliding(playerRect, foodRect)) {
            gameOver();
            return;
        }
    }
}

function isColliding(rect1, rect2) {
    return !(
        rect1.right < rect2.left || 
        rect1.left > rect2.right || 
        rect1.bottom < rect2.top || 
        rect1.top > rect2.bottom
    );
}

// Fin del juego
function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    
    // Mostrar pantalla de fin de juego
    showGameOverScreen();
    
    // Limpiar comidas
    clearAllFoods();
    foods = [];
    
    // Remover event listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('touchmove', handleTouch);
}

// Reiniciar juego
function restartGame() {
    initGame();
}

// Iniciar cuando se carga la página
window.addEventListener('load', () => {
    document.getElementById('restart').addEventListener('click', restartGame);
    initGame();
    
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .catch(err => console.log('Error SW:', err));
    }
});