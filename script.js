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
                piece.className = `piece ${board[y][x] === BLACK ? 'black' : 'white'}`; // pieceクラスを使用
                cell.appendChild(piece);
            }
            
            boardElement.appendChild(cell);
        }
    }
    updateGameInfo();
}

// 他の関数は変更なし

// 初期化とレンダリング
initializeBoard();
renderBoard();

// リセットボタンのイベントリスナー
resetButton.addEventListener('click', () => {
    initializeBoard();
    currentPlayer = BLACK;
    renderBoard();
});
