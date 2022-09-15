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

    // bind events
    gameBoard.addEventListener('click', addSymbols);
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
    }


})()

