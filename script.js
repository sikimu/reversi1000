const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let currentPlayer = BLACK;
let board = [];

const boardElement = document.getElementById('board');
const currentTurnElement = document.getElementById('current-turn');
const blackCountElement = document.getElementById('black-count');
const whiteCountElement = document.getElementById('white-count');
const resetButton = document.getElementById('reset-button');

function initializeBoard() {
    board = Array(8).fill().map(() => Array(8).fill(EMPTY));
    board[3][3] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    board[4][4] = WHITE;
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener('click', () => makeMove(x, y));
            
            if (board[y][x] !== EMPTY) {
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
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x] === BLACK) black++;
            if (board[y][x] === WHITE) white++;
        }
    }
    return { black, white };
}

function makeMove(x, y) {
    if (currentPlayer === WHITE) return; // コンピュータのターンの時は何もしない
    if (board[y][x] !== EMPTY) return;
    
    const flippedPieces = getFlippedPieces(x, y, currentPlayer);
    if (flippedPieces.length === 0) return;
    
    board[y][x] = currentPlayer;
    flippedPieces.forEach(([fX, fY]) => {
        board[fY][fX] = currentPlayer;
    });
    
    currentPlayer = WHITE;
    renderBoard();
    
    // コンピュータの手番
    setTimeout(computerMove, 1000);
}

function getFlippedPieces(x, y, player) {
    const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    let flippedPieces = [];
    
    for (const [dx, dy] of directions) {
        let flipped = [];
        let nx = x + dx, ny = y + dy;
        
        while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] !== EMPTY) {
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
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
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
    
    // ランダムに手を選択
    const [x, y] = validMoves[Math.floor(Math.random() * validMoves.length)];
    
    const flippedPieces = getFlippedPieces(x, y, WHITE);
    board[y][x] = WHITE;
    flippedPieces.forEach(([fX, fY]) => {
        board[fY][fX] = WHITE;
    });
    
    currentPlayer = BLACK;
    renderBoard();
}

resetButton.addEventListener('click', () => {
    initializeBoard();
    currentPlayer = BLACK;
    renderBoard();
});

initializeBoard();
renderBoard();
