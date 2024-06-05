function Gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];

    for(let i=0; i < rows; i++) {
        board[i] = [];
        for(let j=0; j < cols; j++) {
            board[i].push("")
        }
    }
    
    const getBoard = () => board;

    // Marks square based on row and column choosen and player marking
    const markSquare = (row, col, player) => {
        if (!(board[row][col] === "")){ // If square unavailable, return false
            return false;
        }
        console.log(board[row][col])
        board[row][col] = player.val;
        return true; // Free square chosen, return true
    }

    // If any row has an empty cell, the board is not full.
    const isFull = () => {
        const freeCells = board.filter((row) => row.includes(""));
        return (freeCells.length === 0);
    }

    const printBoard = () => {
        console.table(board);
    }

    return { getBoard, markSquare, isFull, printBoard };
}

function GameController(
    p1 = "Player One", 
    p2 = "Player Two"
) {
    const gameBoard = Gameboard();
    const player1 = {name: p1, val: "X"}
    const player2 = {name: p2, val: "O"}

    let activePlayer = player1;
    
    const switchActive = () => activePlayer = (activePlayer === player1) ? player2 : player1;

    // Called to check if the active player has won.s
    const checkWin = () => {
        board = gameBoard.getBoard();
        const otherPlayer = (activePlayer === player1) ? player2 : player1;
        // Check line wins
        for (let i = 0; i < 3; i++) {
            let horizontalCount = 0
            let verticalCount = 0;
            for (let j = 0; j < 3; j++) {
                // Check row
                if (board[i][j] === activePlayer.val) {
                    horizontalCount++;
                } else if (board[j][i] === activePlayer.val) { // Check column
                    verticalCount++;
                }
            }
            if (horizontalCount === 3 || verticalCount === 3) {
                return true;
            }
        }
        return false;
    }

    const playGame = () => {
        gameBoard.printBoard();
        while (!gameBoard.isFull()) {
            console.log(`${activePlayer.name}'s turn...`)
            let choseFreeSquare = false;
            // If they choose a filled square, try again
            while(!choseFreeSquare) {
                const row  = prompt(`${activePlayer.name}, what row?`)
                const col = prompt(`${activePlayer.name}, what column?`)
                choseFreeSquare = gameBoard.markSquare(row, col, activePlayer);    
            }
            gameBoard.printBoard();
            const win = checkWin();
            if (win) {
                console.log(`${activePlayer.name} Wins!`);
                return;
            }
            switchActive();
        }
    }


    return { switchActive, playGame }

}

const game = GameController();
game.playGame();