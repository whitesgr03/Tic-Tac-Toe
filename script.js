'use strict'

const GameBoard = (() => {
    let firstPlayer = true;
    let symbols = [];
    
    for (let i = 0; i < 3; i++) {
        symbols.push(Array.from({ length: 3 }))
    }

    // cache DOM
    const cell = Array.from(document.querySelectorAll('.cell'));
    const gameBoard = document.querySelector('.gameBoard');
    const resetButton = document.querySelector('.restartButton');

    // bind events
    gameBoard.addEventListener('click', addSymbols);
    resetButton.addEventListener('click', reset);

    function addSymbols(e) {
        if (
            this.classList.contains('gameOver')||
            !e.target.classList.contains('cell') ||
            e.target.textContent
        ) {
            return
        }

        const cellIndex = cell.findIndex(item => item === e.target)

        let line = null;
        let index = null;

        if (cellIndex <= 2) {
            line = 0;
            index = cellIndex;
        } else if (cellIndex >= 6){
            line = 2;
            index = cellIndex - 6
        } else {
            line = 1;
            index = cellIndex - 3
        }
        
        let gameSymbol = null;

        if (firstPlayer) {
            gameSymbol = 'X'
        } else {
            gameSymbol = 'O'
        }

        symbols[line][index] = gameSymbol;

        render();
        showWinner();

        firstPlayer = !firstPlayer;
    }

    function render() {
        for (let i = 0; i < symbols.length; i++){
            cell[i * 3 + 0].textContent = symbols[i][0]
            cell[i * 3 + 1].textContent = symbols[i][1]
            cell[i * 3 + 2].textContent = symbols[i][2]
        }
    }

    function reset() {
        if (symbols.length = 0) {
            return
        }

        symbols.length = 0;

        for (let i = 0; i < 3; i++) {
            symbols.push(Array.from({ length: 3 }))
        }

        render();
        firstPlayer = true;
        render();
    }

    function checkLine() {

    function createLine(direction) {
        let line = [];

        switch (direction) {
            case 'column':
                for (let i = 0; i < symbols.length; i++) {
                    const arr = [symbols[0][i], symbols[1][i], symbols[2][i]]
                    line.push(arr)
                }
                break;
            case 'slant':
                line = [
                    [symbols[0][0], symbols[1][1], symbols[2][2]],
                    [symbols[0][2], symbols[1][1], symbols[2][0]]
                ]
                break;
            default:
                for (let symbol of symbols) {
                    line.push(...symbol)
                }
        }

        return line
    }

    function checkLine(lines) {
        if (winner) {
            return
        }
        lines.forEach(line => {
            if (line.every(symbol => symbol === 'X')) {
                winner = 'X'
                return
            } 

            if (line.every(symbol => symbol === 'O')) {
                winner = 'O'
            } 
        });
    }

    function checkGameTie(line) {
        if (winner) {
            return
        }
        if (line.every(symbol => typeof symbol !== 'undefined')) {
            winner = false
            return
        }
    }
})()

