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
        // Diagonals
        let mainDiag = [];
        let antiDiag = [];

        for (let i = 0; i < board.length; i++) {
            const row = board[i];
            const column = board.map(x => x[i]);
            // If vertical or horizonal win
            if (winningLine(row) || winningLine(column)) {
                return true;
            } 
            // Create diagonal arrays
            mainDiag.push(board[i][i]);
            antiDiag.push(board[i][board.length - 1 - i]);
        }
        const mainDiagWin = winningLine(mainDiag);
        const antiDiagWin = winningLine(antiDiag);

        // If either diagonal is a win return true, else false
        return mainDiagWin || antiDiagWin;
    }

    const playGame = () => {
        gameBoard.printBoard();
        while (!gameBoard.isFull()) {
            console.log(`${activePlayer.name}'s turn...`)
            let choseFreeSquare = false;
            // If they choose a filled square, try again
            while(!choseFreeSquare) {
                const square = prompt(`${activePlayer.name}, which cell?`)
                const cellValues = square.split("");
                const row  = cellValues[0];
                const col = cellValues[1];
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
        console.log("BOOOO... It's a draw!");
    }

    return { playGame };
}

// const game = GameController();
// game.playGame();