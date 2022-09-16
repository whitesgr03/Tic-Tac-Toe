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

    function render() {

        for (let i = 0; i < symbols.length; i++){
            cell[i * 3 + 0].textContent = symbols[i][0]
            cell[i * 3 + 1].textContent = symbols[i][1]
            cell[i * 3 + 2].textContent = symbols[i][2]
        }
    }

    function addSymbols(e) {

        if (e.target.textContent) {
            return
        }

        const index = cell.findIndex(item => item === e.target)
        let gameSymbol = null;

        if (firstPlayer) {
            gameSymbol = 'X'
        } else {
            gameSymbol = 'O'
        }

        firstPlayer = !firstPlayer;

        let firstIndex = null;
        let second = null;

        if (index <= 2) {
            firstIndex = 0;
            second = index;
        } else if (index >= 6){
            firstIndex = 2;
            second = index - 6
        } else {
            firstIndex = 1;
            second = index - 3
        }
        
        symbols[firstIndex][second] = gameSymbol;
        render();
    }

    function reset() {
        if (symbols.length = 0) {
            return
        }

        symbols.length = 0;

        for (let i = 0; i < 3; i++) {
            symbols.push(Array.from({ length: 3 }))
        }

        firstPlayer = true;
        render();
    }

    function checkLine() {

        // check row line
        showWinner(symbols)

        // check column line
        const column = [];
        for (let i = 0; i < symbols.length; i++) {
            const arr = [symbols[0][i], symbols[1][i], symbols[2][i]]
            column.push(arr)
        }

        showWinner(column);

        // check Slant Line
        const slant = [
            [symbols[0][0], symbols[1][1], symbols[2][2]],
            [symbols[0][2], symbols[1][1], symbols[2][0]]
        ]

        showWinner(slant);
    }

    function showWinner(arr) {
        arr.forEach(line => {

            if (line.every(symbol => symbol === 'X')) {
                console.log('Player 1 win')
                return
            } 

            if (line.every(symbol => symbol === 'O')) {
                console.log('Player 2 win')
                return
            } 
        });
    }
})()

