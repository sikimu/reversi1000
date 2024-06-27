const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const BOARD_SIZE = 1000;
const VIEW_SIZE = 8;

let currentPlayer = BLACK;
let board = [];
let viewX = 0;
let viewY = 0;

const boardElement = document.getElementById('board');
const currentTurnElement = document.getElementById('current-turn');
const blackCountElement = document.getElementById('black-count');
const whiteCountElement = document.getElementById('white-count');
const resetButton = document.getElementById('reset-button');
const upButton = document.getElementById('up');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');
const downButton = document.getElementById('down');

function initializeBoard() {
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));
    const center = Math.floor(BOARD_SIZE / 2);
    board[center-1][center-1] = WHITE;
    board[center-1][center] = BLACK;
    board[center][center-1] = BLACK;
    board[center][center] = WHITE;
    viewX = center - Math.floor(VIEW_SIZE / 2);
    viewY = center - Math.floor(VIEW_SIZE / 2);
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let y = viewY - 1; y < viewY + VIEW_SIZE + 1; y++) {
        for (let x = viewX - 1; x < viewX + VIEW_SIZE + 1; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (x === viewX - 1 || x === viewX + VIEW_SIZE) {
                cell.classList.add('half-width');
            }
            if (y === viewY - 1 || y === viewY + VIEW_SIZE) {
                cell.classList.add('half-height');
            }
            
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener('click', () => makeMove(x, y));
            
            if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[y][x] !== EMPTY) {
                const piece = document.createElement('div');
                piece.className = `piece ${board[y][x] === BLACK ? 'black' : 'white'}`;
                cell.appendChild(piece);
            }
            
            boardElement.appendChild(cell);
        }
    }
    updateGameInfo();
}

function updateGameInfo() {
    currentTurnElement.textContent = currentPlayer === BLACK ? '黒' : '白';
    const counts = countPieces();
    blackCountElement.textContent = counts.black;
    whiteCountElement.textContent = counts.white;
}

function countPieces() {
    let black = 0, white = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            if (board[y][x] === BLACK) black++;
            if (board[y][x] === WHITE) white++;
        }
    }
    return { black, white };
}

function makeMove(x, y) {
    if (currentPlayer === WHITE) return;
    if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE || board[y][x] !== EMPTY) return;
    
    const flippedPieces = getFlippedPieces(x, y, currentPlayer);
    if (flippedPieces.length === 0) return;
    
    board[y][x] = currentPlayer;
    flippedPieces.forEach(([fX, fY]) => {
        board[fY][fX] = currentPlayer;
    });
    
    currentPlayer = WHITE;
    renderBoard();
    
    setTimeout(computerMove, 1000);
}

function getFlippedPieces(x, y, player) {
    const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    let flippedPieces = [];
    
    for (const [dx, dy] of directions) {
        let flipped = [];
        let nx = x + dx, ny = y + dy;
        
        while (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[ny][nx] !== EMPTY) {
            if (board[ny][nx] === player) {
                flippedPieces = flippedPieces.concat(flipped);
                break;
            }
            flipped.push([nx, ny]);
            nx += dx;
            ny += dy;
        }
    }
    
    return flippedPieces;
}

function getValidMoves(player) {
    const validMoves = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            if (board[y][x] === EMPTY && getFlippedPieces(x, y, player).length > 0) {
                validMoves.push([x, y]);
            }
        }
    }
    return validMoves;
}

function computerMove() {
    const validMoves = getValidMoves(WHITE);
    if (validMoves.length === 0) {
        currentPlayer = BLACK;
        renderBoard();
        return;
    }
    
    const [x, y] = validMoves[Math.floor(Math.random() * validMoves.length)];
    
    const flippedPieces = getFlippedPieces(x, y, WHITE);
    board[y][x] = WHITE;
    flippedPieces.forEach(([fX, fY]) => {
        board[fY][fX] = WHITE;
    });
    
    currentPlayer = BLACK;
    centerView(x, y);
    renderBoard();
}

function centerView(x, y) {
    viewX = Math.max(0, Math.min(BOARD_SIZE - VIEW_SIZE, x - Math.floor(VIEW_SIZE / 2)));
    viewY = Math.max(0, Math.min(BOARD_SIZE - VIEW_SIZE, y - Math.floor(VIEW_SIZE / 2)));
}

function moveView(dx, dy) {
    viewX = Math.max(0, Math.min(BOARD_SIZE - VIEW_SIZE, viewX + dx));
    viewY = Math.max(0, Math.min(BOARD_SIZE - VIEW_SIZE, viewY + dy));
    renderBoard();
}

resetButton.addEventListener('click', () => {
    initializeBoard();
    currentPlayer = BLACK;
    renderBoard();
});

upButton.addEventListener('click', () => moveView(0, -1));
leftButton.addEventListener('click', () => moveView(-1, 0));
rightButton.addEventListener('click', () => moveView(1, 0));
downButton.addEventListener('click', () => moveView(0, 1));

initializeBoard();
renderBoard();
