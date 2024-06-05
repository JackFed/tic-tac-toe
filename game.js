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

    // Player win function 
    // true: all elements are winning player's
    // false: one or more elements aren't player's
    const winningLine = (line) => {
        return line.every(val => val === activePlayer.val)
    }

    // Called to check if the active player has won.s
    const checkWin = () => {
        board = gameBoard.getBoard();
        const otherPlayer = (activePlayer === player1) ? player2 : player1;

        // Diagonals
        let mainDiag = [];
        let antiDiag = [];
        // Check line wins
        for (let i = 0; i < 3; i++) {
            let verticalCount = 0;   
            let col = []             
            // Check row, if every value in the row is the player's return true
            if (winningLine(board[i])) {
                return true;
            } 
            for (let j = 0; j < 3; j++) {
                // Diagonals
                if (i === j) {
                    mainDiag.push(board[i][j]);                 
                }
                col.push(board[j][i]);
            }
            // Check if column line is winning
            if (winningLine(col)) {
                return true;
            }
        }

        // Diagonals
        for (let i = 0; i < board.length; i++) {
            antiDiag.push(board[i][board.length - 1 - i])
        }
        console.log(antiDiag)
        const mainDiagWin = winningLine(mainDiag);
        const antiDiagWin = winningLine(antiDiag);

        // if diagonal not all active player values, return false else true.
        return mainDiagWin || antiDiagWin;
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