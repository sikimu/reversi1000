// リバーシゲームの状態を表す定数
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

// ボードの初期化
function initializeBoard() {
    board = Array(8).fill().map(() => Array(8).fill(EMPTY));
    board[3][3] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    board[4][4] = WHITE;
}

// ボードの描画
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

// ゲーム情報の更新
function updateGameInfo() {
    currentTurnElement.textContent = currentPlayer === BLACK ? '黒' : '白';
    const counts = countPieces();
    blackCountElement.textContent = counts.black;
    whiteCountElement.textContent = counts.white;
}

// 駒の数を数える
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

// 駒を置く
function makeMove(x, y) {
    if (board[y][x] !== EMPTY) return;
    
    const flippedPieces = getFlippedPieces(x, y);
    if (flippedPieces.length === 0) return;
    
    board[y][x] = currentPlayer;
    flippedPieces.forEach(([fX, fY]) => {
        board[fY][fX] = currentPlayer;
    });
    
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    renderBoard();
}

// ひっくり返せる駒を取得
function getFlippedPieces(x, y) {
    const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    let flippedPieces = [];
    
    for (const [dx, dy] of directions) {
        let flipped = [];
        let nx = x + dx, ny = y + dy;
        
        while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] !== EMPTY) {
            if (board[ny][nx] === currentPlayer) {
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

// リセットボタンのイベントリスナー
resetButton.addEventListener('click', () => {
    initializeBoard();
    currentPlayer = BLACK;
    renderBoard();
});

// ゲームの初期化と描画
initializeBoard();
renderBoard();
