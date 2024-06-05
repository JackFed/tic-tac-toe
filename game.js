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
        if (!(board[row][col] === "")){ // If square not empty, return false
            return false;
        }
        console.log(`${row}, ${col} square marked for ${player.name}`)
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

function GameController(p1 = "Player One", p2 = "Player Two") {
    const gameBoard = Gameboard();
    const player1 = {name: p1, val: "X"}
    const player2 = {name: p2, val: "O"}

    let winMessage = "";

    const setWinMessage = (message) => winMessage = message;

    const getWinMessage = () => winMessage;

    let activePlayer = player1;
    
    const switchActive = () => activePlayer = (activePlayer === player1) ? player2 : player1;

    const getActivePlayer = () => activePlayer;
    // Player win function 
    // true: all elements are winning player's
    // false: one or more elements aren't player's
    const winningLine = (line) => {
        return line.every(val => val === activePlayer.val)
    }

    // Called to check if the active player has won.s
    const checkWin = () => {
        const board = gameBoard.getBoard();
        // Diagonals
        let mainDiag = [];
        let antiDiag = [];
        // Loop through board, check rows and columns.
        // Record values of diagonals for checking after.
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

    const playRound = (row, col) => {
        if (gameBoard.isFull()) {
            console.log("BOOOO... It's a draw!");
            setWinMessage("BOOOO... It's a draw!");
        }
        let choseFreeSquare = gameBoard.markSquare(row, col, activePlayer); 
        // If they choose a filled square, try again
        if(!choseFreeSquare) {
            return false;  
        }
        gameBoard.printBoard();
        const win = checkWin();
        if (win) {
            console.log(`${activePlayer.name} Wins!`);
            setWinMessage(`${activePlayer.name} Wins!`);
        }
        switchActive();
    }

    return { playRound, 
        getActivePlayer,
        getBoard: gameBoard.getBoard,
        getWinMessage };
}

function ScreenController() {
    const game = GameController();
    const display = document.querySelector(".prompt");
    const boardDiv = document.querySelector(".board");

    const updateScreenBoard = () => {
        // Clear board
        boardDiv.textContent = "";

        // Update active player display
        const activePlayer = game.getActivePlayer();
        display.textContent = `${activePlayer.name}'s turn...`;

        const board = game.getBoard();
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board.length; j++) {
                // Create the pressable squares
                const square = document.createElement("button");
                square.setAttribute("class", "squares");
                square.dataset.index = [i, j];
                // Give the square an image based on the contents of the board
                const image = document.createElement("img");
                image.dataset.index = [i, j];
                const squareVal = board[i][j];
                // If the square already is marked, set it's image link
                if (squareVal !== "") {
                    image.setAttribute("src", `./${squareVal}.svg`);
                    image.setAttribute("alt", `${squareVal} image`);
                }

                square.appendChild(image);
                boardDiv.appendChild(square);
            }
        }

        const winMessage = game.getWinMessage();
        console.log(winMessage)
        if (winMessage !== "") {
            display.textContent = winMessage;
        }
        
        function clickHandlerBoard(e) {
            // "row, col" position on screen board
            const chosenSquare = e.target.dataset.index;
            const arrIndex = chosenSquare.split(",");
            const index = arrIndex.map(item => parseInt(item))

            game.playRound(index[0], index[1]);
            updateScreenBoard();
        }
        boardDiv.addEventListener("click", clickHandlerBoard);


    }

    // Intial Board render
    updateScreenBoard();
    
}


ScreenController();