'use strict'

const controller = (() => {

    let playerName = {
        'X': 'Player 1',
        'O': 'Player 2',
    }

     // cache DOM
    const startButton = document.querySelector('.startButton')
    const pens = document.querySelectorAll('.editButton')
    const cancelButtons = document.querySelectorAll('.cancelButton')
    const confirmButtons = document.querySelectorAll('.confirmButton')
    const score = document.querySelector('.score')

    // bind events
    startButton.addEventListener('click', startGame)
    for (let pen of pens) {
        pen.addEventListener('click', editName);
    }
    for (let Button of cancelButtons) {
        Button.addEventListener('click', cancelEdit);
    }
    for (let Button of confirmButtons) {
        Button.addEventListener('click', saveEdited);
    }

    function startGame() {
        const gameBoard = document.querySelector('.gameBoard')
        const parent = document.querySelector('.menu');

        score.firstElementChild.textContent = `${playerName['X']} : 0`
        score.lastElementChild.textContent = `${playerName['O']} : 0`

        gameBoard.previousElementSibling.lastElementChild.textContent = playerName['X'];
        gameBoard.nextElementSibling.lastElementChild.textContent = playerName['O'];
        parent.classList.remove('active')
    }

    function editName() {
        const character = this.closest('.avatar')
        character.classList.add('editing');
    }

    function cancelEdit() {
        const character = this.closest('.avatar')
        character.classList.remove('editing');
    }

    function saveEdited() {
        const character = this.closest('.avatar')
        const input = this.closest('.edit').firstElementChild
        const name = this.closest('.edit').previousElementSibling.firstElementChild

        name.textContent = input.value
        playerName[input.dataset.player] = input.value

        character.classList.remove('editing');
    }

    function getName() {
        return playerName;
    }

    return {
        getName,
    }
})()


const gameBoard = (() => {
    let currentRound = 1;
    let currentScore = {
        'X': 0,
        'O': 0,
    }
    let firstPlayer = true;
    let winner = null;
    let symbols = [];
    const names = controller.getName()

    for (let i = 0; i < 3; i++) {
        symbols.push(Array.from({ length: 3 }))
    }

    // cache DOM
    const cell = Array.from(document.querySelectorAll('.cell'));
    const gameBoard = document.querySelector('.gameBoard');
    const resetButton = document.querySelector('.resetButton');
    const gameSettlement = document.querySelector('.settlementMessage')
    const main = document.querySelector('main')
    const score = document.querySelector('.score')
    const players = document.querySelectorAll('main .avatar')
    const restartButton = document.querySelector('.restart')
    const parent = document.querySelector('.menu');


    // bind events
    gameBoard.addEventListener('click', addSymbols);
    resetButton.addEventListener('click', resetGame);
    restartButton.addEventListener('click', restartGame)

    function addSymbols(e) {
        if (
            main.classList.contains('gameOver')||
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

        for (let player of players) {
            player.classList.toggle('mover');
        }

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

    function resetGame() {
        const line = createLine()

        if (line.every(symbol => typeof symbol === 'undefined')) {
            return
        }

        if (winner === null) {
            if (!confirm('Do you want to reset this round?')) {
                return
            }
        }

        symbols.length = 0;

        for (let i = 0; i < 3; i++) {
            symbols.push(Array.from({ length: 3 }))
        }

        render();
        firstPlayer = true;
        

        if (winner !== null) {
            winner = null;
            main.classList.remove('gameOver')
            gameSettlement.classList.remove('active');
            players[0].classList.add('mover');
        }
    }

    function showWinner() {

        // check each row line
        checkLine(symbols)

        // check each column line
        checkLine(createLine('column'));

        // check each Slant Line
        checkLine(createLine('slant'));

        checkGameTie(createLine())

        if (winner !== null) {
            main.classList.add('gameOver');
            gameSettlement.classList.add('active');

            for (let player of players) {
                player.classList.remove('mover');
            }

            if (!winner) {
                gameSettlement.innerHTML = `<h2>It's a Draw</h2>`
            } else {
                gameSettlement.innerHTML = `<h2>The winner is</h2><h1>${names[winner]}</h1>`
                addScore(winner);
            }
            
            addRound();
        }
    }

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

    function addRound() {
        const round = score.previousElementSibling;

        currentRound++
        round.textContent = `Round ${currentRound}`
    }

    function addScore(winner) {
        const player = {
            'X': score.firstElementChild,
            'O': score.lastElementChild,
        }
            
        currentScore[winner]++
        player[winner].textContent = `${names[winner]} : ${currentScore[winner]}`
    }

    function restartGame() {

        if (confirm('Do you want to restart game?')) {
            const round = score.previousElementSibling;
            const player1Score = score.firstElementChild;
            const player2Score = score.lastElementChild;

            round.textContent = `Round 1`
            player1Score.textContent = `${names[winner]} : 0`;
            player2Score.textContent = `${names[winner]} : 0`;

            resetGame();
            parent.classList.add('active')
        }
    }
})()
