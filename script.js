body {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#board-container {
    width: 400px;
    height: 400px;
    overflow: hidden;
    border: 2px solid #000;
}

#board {
    display: grid;
    grid-template-columns: repeat(1000, 50px);
    grid-template-rows: repeat(1000, 50px);
    grid-gap: 1px;
    background-color: #000;
}

.cell {
    width: 50px;
    height: 50px;
    background-color: #0a0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.piece {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.black {
    background-color: #000;
}

.white {
    background-color: #fff;
    border: 1px solid #000;
}

#controls {
    margin-top: 10px;
}

#controls button {
    font-size: 20px;
    margin: 0 5px;
}
