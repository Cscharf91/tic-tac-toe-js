// Player Factory
const player = (name, marker) => {
    return { name, marker };
};

// Game Board Module
const gameBoard = (() => {
    let board = [
        [ , , ,],
        [ , , ,],
        [ , , ,]
    ];
    const gridContainer = document.getElementById('grid-wrapper');
    const getBoard = () => board;
    
    const createBoard = () => {
        for(i = 0; i < board.length; i++) {
            for(j = 0; j < board[i].length; j++) {
                let newCell = document.createElement('div');
                newCell.classList.add('cell');
                newCell.setAttribute('id', i + "" + j);
                newCell.addEventListener('click', game.selectCell);
                gridContainer.appendChild(newCell);
            }
        }
    };

    const createMark = (tile, playerMark, id) => {
        let arrRow = id.charAt(0);
        let arrCol = id.charAt(1);
        board[arrRow][arrCol] = playerMark;
        tile.innerText = playerMark;
    };

    const clearBoard = () => {
        board = [
            [ , , ,],
            [ , , ,],
            [ , , ,]
        ];

        console.log(board);

        cell = document.querySelectorAll('.cell');
        cell.forEach(e => e.innerText = "");
        game.clearBoardInfo();
    };

    return { createBoard, getBoard, createMark, clearBoard }
})();

// Game Module
const game = (() => {

    let player1;
    let player2;
    let currentPlayer;
    
    let turnCounter = 1;
    let win = false;
    let drawCheck = false;
    const playerInfoDiv = document.querySelector('.p-info');
    const playerDisplayDiv = document.querySelector('.p-show-info');

    const selectCell = (e) => {
        tile = e.target;
        tileId = e.target.getAttribute('id')
        if (e.target.innerText === "") {
            gameBoard.createMark(tile, currentPlayer.marker, tileId);
            checkForWin();
            if (win === false && drawCheck === false) {
                turnChange();
            };
        }
    };

    const turnChange = () => {
       (currentPlayer == player1) ? currentPlayer = player2 : currentPlayer = player1;
        ++turnCounter;
        displayController.turnDisplay(turnCounter, currentPlayer.name, currentPlayer.marker)
    };

    const checkForWin = () => {
        let boardCopy = gameBoard.getBoard();
        if (turnCounter > 8) {
            draw();
        };

        // Horizontal Check
        for(i=0; i < boardCopy.length; i++) {
            let arrTotal = boardCopy[i][0] + boardCopy[i][1] + boardCopy[i][2];
            if (arrTotal === "XXX" || arrTotal === "OOO") {
                win = true;
                winner();
            }
        }

        // Vertical Check
        for(i=0; i < boardCopy.length; i++) {
            let arrTotal = boardCopy[0][i] + boardCopy[1][i] + boardCopy[2][i];
            if (arrTotal === "XXX" || arrTotal === "OOO") {
                win = true;
                winner();
            }
        }

        // Diagonal left to right Check
        let diagLeftTotal = boardCopy[0][0] + boardCopy[1][1] + boardCopy[2][2];
            if (diagLeftTotal === "XXX" || diagLeftTotal === "OOO") {
                win = true;
                winner();
            }

        // Diagonal right to left Check
        let diagRightTotal = boardCopy[0][2] + boardCopy[1][1] + boardCopy[2][0];
            if (diagRightTotal === "XXX" || diagRightTotal === "OOO") {
                win = true;
                winner();
            }
    };

    const winner = () => {
        displayController.winDisplay(currentPlayer.name)
        currentPlayer.marker = "";
        console.log("Winner!")
    };


    const draw = () => {
        drawCheck = true;
        displayController.drawDisplay();
        currentPlayer.marker = "";
        console.log("Draw!");
    };

    const startGame = () => {
        let p1Name = document.querySelector('.p1-name').value;
        let p2Name = document.querySelector('.p2-name').value;
        player1 = player(p1Name, "X");
        player2 = player(p2Name, "O");
        currentPlayer = player1;
        playerInfoDiv.classList.add('hidden');
        playerDisplayDiv.classList.remove('hidden');
        displayController.turnDisplay(turnCounter, currentPlayer.name, currentPlayer.marker)
    };

    const clearBoardInfo = () => {
        turnCounter = 1;
        drawCheck = false;
        win = false;
        playerDisplayDiv.classList.add('hidden');
        playerInfoDiv.classList.remove('hidden');
    };

    return { selectCell, startGame, clearBoardInfo };
})();

// DOM Module

const displayController = (() => {
    const startBtn = document.querySelector('.start-btn');
    const turnNum = document.querySelector('.turn-num');
    const playerName = document.querySelector('.player-name-display');
    const markerName = document.querySelector('.player-mark-display');
    
    const clearBtn = document.querySelector('.clear-btn');
    const beginClearGameEvent = () => {
        clearBtn.addEventListener('click', restartGame);
    };

    const beginStartGameEvent = () => {
        startBtn.addEventListener('click', game.startGame);
    };

    const restartGame = () => {
        gameBoard.clearBoard();
    };

    const turnDisplay = (turn, player, mark) => {
        turnNum.innerText = `Turn ${turn}:`;
        playerName.innerText = `${player}:`;
        markerName.innerText = `${mark}`;
    };

    const winDisplay = (player) => {
        turnNum.innerText = `${player} wins!`;
        playerName.innerText =  "";
        markerName.innerText = "";
    };

    const drawDisplay = () => {
        turnNum.innerText = "It's a Draw!";
        playerName.innerText =  "";
        markerName.innerText = "";
    };


    return { beginStartGameEvent, beginClearGameEvent, turnDisplay, winDisplay, drawDisplay };
})();

displayController.beginStartGameEvent();
displayController.beginClearGameEvent();

gameBoard.createBoard();