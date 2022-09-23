'use strict'

const controller = (() => {
    const playerName = ['Player 1']
    let fields = null;
    let editNameButtons = null
    
    // cache DOM
    const characters = document.querySelector('.characters')
    const firstPlayerName = document.querySelectorAll('.firstPlayerName')
    const opponentButtons = document.querySelector('.opponentButtons')
    const startGameButton = document.querySelector('.startGameButton')
    const messageButton = document.querySelector('.messageButton')

    // bind events
    opponentButtons.addEventListener('click', chooseOpponent)
    messageButton.addEventListener('click', reselectOpponent)
    startGameButton.addEventListener('click', startGame)

    
    function chooseOpponent(e) {

        if (e.target === this) {
            return
        }

        const secondRow = document.querySelector('.secondRow')
        let characterTemplate = null;
        let secondRowTemplate = null;
        
        let div = document.createElement('div')

        const name = e.target.dataset.opponent[0].toUpperCase() + e.target.dataset.opponent.slice(1);

        playerName[1] = name;
        
        if (playerName[1] === 'Player 2') {
            characterTemplate = `
                <div class="character player">
                    <img src="./img/player.svg" alt="Player 2 avatar" class="avatar">
                    <div>
                        <p class="secondPlayerName"></p>
                        <button type="button" class="editNameButton"></button>
                    </div>
                    <div class="field">
                        <input class="nameField" type="text" value="" data-player="O" maxlength="8">
                        <div class="fieldButtons">
                            <button type="button" class="confirmButton"></button>
                            <button type="button" class="cancelButton"></button>
                        </div>
                    </div>
                </div>
            `;
            secondRowTemplate = `
                <div class="player">
                    <img src="./img/player.svg" alt="character 2 avatar" class="avatar">
                    <p class="secondPlayerName">Player 2</p>
                </div>
            `;
        } else {
            characterTemplate = `
                <div class="character robot">
                    <img src="./img/robot.svg" alt="computer" class="avatar">
                    <p>Com</p>
                </div>
            `;
            secondRowTemplate = `
                <div class="player">
                    <img src="./img/robot.svg" alt="character 2 avatar" class="avatar">
                    <p class="secondPlayerName">Com</p>
                </div>
            `
        }

        this.style.display = 'none'
        div.innerHTML = characterTemplate
        characters.append(div)

        div = document.createElement('div')
        div.innerHTML = secondRowTemplate
        secondRow.lastElementChild.remove();
        secondRow.append(div)
        init();
    }

    function reselectOpponent() {
        if (!messageButton.classList.contains('reselect')) {
            return
        }
        opponentButtons.style.display = 'flex';

        characters.lastElementChild.remove();

        startGameButton.classList.add('hidden');

        this.textContent = 'choose your opponent';

        for (let i = 0; i < editNameButtons.length; i++) {
            editNameButtons[i].style.display = 'none'
        }

        messageButton.classList.remove('reselect')

        playerName[0] = 'Player 1'
        renderPlayerName();
    }



    function init() {
        fields = document.querySelectorAll('.nameField');

        const cancelButtons = document.querySelectorAll('.cancelButton')
        const confirmButtons = document.querySelectorAll('.confirmButton')
        editNameButtons = document.querySelectorAll('.editNameButton')

        for (let i = 0; i < editNameButtons.length; i++) {
            editNameButtons[i].style.display = 'block'
        }

        startGameButton.classList.remove('hidden');
        messageButton.classList.add('reselect')
        messageButton.textContent = 're-select opponent';

        bindEvents(editNameButtons, 'click', showInputField);
        bindEvents(cancelButtons, 'click', cancelEdit);
        bindEvents(confirmButtons, 'click', editPlayerName);
        
        renderPlayerName();
    }
    
    function bindEvents(list, event, listener) {
        for (let item of list) {
            item.addEventListener(event, listener)
        }
    }

    function startGame() {
        const menu = document.querySelector('.menu');
        const backgroundBlurEffect = document.querySelector('.backgroundBlurEffect');

        menu.style.display = 'none';
        backgroundBlurEffect.classList.remove('active');

        gameBoard();
    }

    function getPlayerName() {
        return playerName;
    }

    // render name
    function renderPlayerName() {
        for (let i = 0; i < firstPlayerName.length; i++) {
            firstPlayerName[i].textContent = playerName[0]
        }

        for (let i = 0; i < fields.length; i++) {
            fields[i].value = playerName[i]
        }

        renderOpponentName(playerName[1])
    }

    function renderOpponentName(name) {
        if (!name) return 

        const secondPlayerName = document.querySelectorAll('.secondPlayerName');

        for (let i = 0; i < secondPlayerName.length; i++) {
                secondPlayerName[i].textContent = name;
            }
    }


    // edit
    function showInputField() {
        this.closest('.character.player').classList.add('editing')
    }
    
    function cancelEdit() {
        this.closest('.character.player').classList.remove('editing')
    }

    function editPlayerName(id, value) {
        let name = null;
        let index = null;

        if (typeof value == 'string' && typeof id === 'number') {
            name = value;
            index = id - 1;
        } else {
            const target = this.closest('.field').firstElementChild;

            name = target.value;
            index = Array.from(fields).findIndex(filed => filed === target);
            cancelEdit.call(this);
        }

        playerName[index] = name;
        renderPlayerName();
    }


    return {
        getPlayerName,
    }

})()


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
