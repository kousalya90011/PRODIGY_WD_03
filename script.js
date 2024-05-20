const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restartButton');
const resultModal = document.getElementById('resultModal');
const resultMessage = document.getElementById('resultMessage');
const newGameButton = document.getElementById('newGameButton');
const startButton = document.getElementById('startButton');
const startContainer = document.getElementById('startContainer');
const gameContainer = document.querySelector('.container');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer);

    if (checkWin()) {
        endGame(false);
    } else if (checkDraw()) {
        endGame(true);
    } else {
        currentPlayer = 'O';
        setTimeout(handleAITurn, 2000);
    }
};

const handleAITurn = () => {
    let emptyCells = [];
    gameState.forEach((cell, index) => {
        if (cell === '') {
            emptyCells.push(index);
        }
    });

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cellIndex = emptyCells[randomIndex];

        gameState[cellIndex] = 'O';
        const cell = document.querySelector(`.cell[data-index='${cellIndex}']`);
        cell.textContent = 'O';
        cell.classList.add('O');

        if (checkWin()) {
            endGame(false);
        } else if (checkDraw()) {
            endGame(true);
        } else {
            currentPlayer = 'X';
        }
    }
};

const checkWin = () => {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return true;
        }
    }
    return false;
};

const checkDraw = () => {
    return gameState.every(cell => cell !== '');
};

const endGame = (draw) => {
    gameActive = false;
    resultMessage.textContent = draw ? 'Game ended in a draw!' : `Player ${currentPlayer} wins!`;
    resultModal.style.display = 'flex';
    if (!draw) {
        launchConfetti();
    }
};

const handleRestartGame = () => {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    resultModal.style.display = 'none';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
};

const startGame = () => {
    startContainer.style.display = 'none';
    gameContainer.style.display = 'block';
};

const launchConfetti = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
newGameButton.addEventListener('click', handleRestartGame);
startButton.addEventListener('click', startGame);
