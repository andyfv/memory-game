/*
 * Create a list that holds all of your cards
 */
const stopwatch = document.getElementById('stopwatch');
const btnStartAndRestart = document.getElementById("start-restart");
const btnStartAndRestartText = document.getElementById('start-text');
const btnRestartSymbol = document.createElement('i');
btnRestartSymbol.classList.add('fa', 'fa-repeat');
const moveContainer = document.getElementById('move-container');
const moves = document.getElementsByClassName('moves')[0];
const deck = document.getElementsByClassName('deck')[0];
let virtualDeck = ['fa-diamond', 'fa-diamond', 'fa-leaf', 'fa-leaf', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor',
            'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];
const watch  = new Stopwatch(stopwatch);


let pair = {
    firstCard: null,
    secondCard: null,
    isEmpty: function(){
        if(this.firstCard === null) {
            return true;
        } else {
            return false;
        }
    },
    areSymbolsEqual: function() {
        if(returnSymbol(this.firstCard) === returnSymbol(this.secondCard)){
            return true;
        } else {
            return false;
        }
    },
    resetPair: function() {
        this.firstCard = this.secondCard = null;
    },
    flipPairUp: function(){
        removeCardClasses([this.firstCard, this.secondCard], ["open", "show"]);
        addCardClasses([this.firstCard, this.secondCard],["match"]);
        this.resetPair();
        game.increaseOpenedCards();
    },
    flipPairDown: function() {
        removeCardClasses([this.firstCard ,this.secondCard], ["open", "show"]);
        this.resetPair();
    }
}

let game = {
    inProgress: false,
    moves: 0,
    openedCards: 0,
    pairHandler: function() {
        if(pair.areSymbolsEqual()){
            pair.flipPairUp();
            deck.addEventListener('click', clickCard);
        } else {
            setTimeout(function(){
                pair.flipPairDown();
                deck.addEventListener('click', clickCard);
            },1000);
        }
    },
    btnSwitchText: function() {
        if(!this.inProgress){
            btnStartAndRestartText.innerText = "Restart";
            btnStartAndRestart.insertBefore(btnRestartSymbol,btnStartAndRestartText);
            this.inProgress = true;
        } else {
            btnStartAndRestartText.innerText = "Start";
            btnStartAndRestart.removeChild(btnRestartSymbol);
            this.inProgress = false;
        }
    },
    increaseMoves: function() {
        this.moves++;
        moves.innerText = this.moves;
    },
    increaseOpenedCards: function() {
        if (this.openedCards === 16) {
            this.endGame();
        } else {
            this.openedCards += 2;
        }
    },
    resetGame: function() {
        this.inProgress = false,
        this.moves = this.openedCards = 0;
        pair.resetPair();
        watch.reset();
    },
    endGame: function() {
        watch.stop();
        
    }
}

let stats = {
    moveCounter: 0,
    Rating: 0,
    startWatch: function() {
        
    }
}



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(virtualDeck) {
    let currentIndex = virtualDeck.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = virtualDeck[currentIndex];
        virtualDeck[currentIndex] = virtualDeck[randomIndex];
        virtualDeck[randomIndex] = temporaryValue;
    }
}




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


function removeCardClasses([...cards], [...classes]) {
    for (let card of cards) {
        for(let eachClass of classes) {
            card.classList.remove(eachClass);
        }
    }
}

function addCardClasses([...cards], [...classes]){
    for (let card of cards) {
        for(let eachClass of classes) {
            card.classList.add(eachClass);
        }
    }
}

function addSymbol(updatedCard, cardIndex){
    const symbolElement = document.createElement("i");
    symbolElement.classList.add("fa", virtualDeck[cardIndex]);
    updatedCard.appendChild(symbolElement);
}

function showCard(card, updatedCard){
    deck.appendChild(updatedCard);
    deck.replaceChild(updatedCard, card);
}

function returnSymbol(card) {
    return card.firstElementChild.className;
}

function progress(card){
    const cardIndex = getElementIndex(card);
    const updatedCard = document.createElement("li");
    updatedCard.classList.add("card");
    addSymbol(updatedCard, cardIndex);
    addCardClasses([updatedCard], ["open", "show"]);
    showCard(card, updatedCard);
    if(pair.isEmpty()){
        pair.firstCard = updatedCard;
        deck.addEventListener('click', clickCard);
        return;
    } else {
        pair.secondCard = updatedCard;
        game.pairHandler();
    }
} 

function isOpen(card){
    if(card.classList.contains("open") || card.classList.contains("match")){
        return true;
    } else {
        return false;
    }
}

/* 
    Used to return the index of each clicked card  
 */
function getElementIndex(element){
    return [...element.parentNode.children].indexOf(element);
}

/* 
    Used as the function in the Event Listener for the deck
 */
function clickCard(e){
    e.stopPropagation();
    if(e.target.classList.contains("card")){
        deck.removeEventListener('click', clickCard);
        let card = e.target;    
        if(isOpen(card)){
            deck.addEventListener('click', clickCard);
            return;
        } else {
            progress(card);
        }
        game.increaseMoves();
    }
}

function clickStartButton(e) {
    e.stopPropagation();
    game.resetGame();
    shuffle(virtualDeck);
    deck.addEventListener('click', clickCard);
    //startCountdown(); //Implement!!!
    watch.start();
    game.btnSwitchText();
}

btnStartAndRestart.addEventListener('click', clickStartButton);