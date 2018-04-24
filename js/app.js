const stopwatch = document.getElementById('stopwatch');
const btnStartAndRestart = document.getElementById('start-restart');
const btnStartAndRestartText = document.getElementById('start-text');
const btnRestartSymbol = document.createElement('i');
btnRestartSymbol.classList.add('fa', 'fa-repeat');
const moveContainer = document.getElementById('move-container');
const moves = document.getElementsByClassName('moves')[0];
let deck = document.getElementsByClassName('deck')[0];
const initialDeck = deck.cloneNode(true);
const deckContainer = document.getElementsByClassName('container')[0];
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const watch  = new Stopwatch(stopwatch);
const stars = document.getElementsByClassName('fa-star');
let virtualDeck = ['fa-diamond', 'fa-diamond', 'fa-leaf', 'fa-leaf', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor',
        'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

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
        removeCardClasses([this.firstCard, this.secondCard], ['open', 'show']);
        addCardClasses([this.firstCard, this.secondCard],['match']);
        this.resetPair();
        game.increaseOpenedCards();
    },
    flipPairDown: function() {
        removeCardClasses([this.firstCard ,this.secondCard], ['open', 'show']);
        this.resetPair();
    }
}

let game = {
    inProgress: false,
    movesCount: 0,
    openedCards: 0,
    countdown: 3,
    starsCount: 3,
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
            btnStartAndRestartText.innerText = 'Restart';
            btnStartAndRestart.insertBefore(btnRestartSymbol,btnStartAndRestartText);
            this.inProgress = true;
        } else {
            btnStartAndRestartText.innerText = 'Start';
            btnStartAndRestart.removeChild(btnRestartSymbol);
            this.inProgress = false;
        }
    },
    increaseMoves: function() {
        this.movesCount++;
        moves.innerText = this.movesCount;
        if(this.movesCount > 25) {
            stars[2].style.color = 'grey';
            this.starsCount = 2;
        } else if (this.movesCount > 35) {
            stars[1].style.color = 'grey';
            this.starsCount = 1;
        } else if (this.movesCount > 45) {
            stars[0].style.color = 'grey';
            this.starsCount = 0;
        } 
    },
    increaseOpenedCards: function() {
        this.openedCards += 2;
        if (this.openedCards === 16) {
            this.endGame();
        } 
    },
    startCountdown: function() {
        const timer = setInterval(function(){
            if(game.countdown >= 0){
                modal.style.display = 'inline-block';
                modalContent.innerText = game.countdown;
                game.countdown--;
                console.log(game.countdown);
            } else {
                console.log(game.countdown);
                clearInterval(timer);
                modal.style.display = 'none';
                deck.addEventListener('click', clickCard);
                watch.start();
            }
        },750);
        this.countdown = 3;
    },
    resetDeck: function() {
        let newDeck = initialDeck.cloneNode(true);
        deckContainer.appendChild(newDeck);
        deckContainer.replaceChild(newDeck, deck);
        deck = document.getElementsByClassName('deck')[0];        
    },
    resetStars: function() {
        for(star of stars) {
            star.style.color = 'limegreen';
        }
        this.starsCount = 3;
    },
    resetGame: function() {
        this.inProgress = false,
        this.movesCount = this.openedCards = 0;
        pair.resetPair();
        watch.reset();
        this.resetDeck();
        this.resetStars();
    },
    startGame: function() {
        this.resetGame();
        shuffle(virtualDeck);
        this.startCountdown();
        this.btnSwitchText();
    },
    showCongratulation: function(){
        document.getElementById('congratulations').style.display = 'flex';
        document.getElementById('final-moves-count').innerText = this.movesCount;
        document.getElementById('final-time').innerText = watch.returnTime();
        document.getElementById('final-star-count').innerText = this.starsCount;
        document.getElementById('restart').addEventListener('click', clickStartButton);
    },
    endGame: function() {
        watch.stop();
        this.showCongratulation();
    }
}

/* 
    Shuffles the @virtualDeck
 */
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
    Used to remove multiple classes from multiple cards
 */
function removeCardClasses([...cards], [...classes]) {
    for (let card of cards) {
        for(let eachClass of classes) {
            card.classList.remove(eachClass);
        }
    }
}

/* 
    Used to add multiple classes to multiple cards
 */
function addCardClasses([...cards], [...classes]){
    for (let card of cards) {
        for(let eachClass of classes) {
            card.classList.add(eachClass);
        }
    }
}


/* 
    Add the symbol by taking the symbol from the shuffled array
    based on the @cardIndex and appending it to the @updatedCard
 */
function addSymbol(updatedCard, cardIndex){
    const symbolElement = document.createElement("i");
    symbolElement.classList.add("fa", virtualDeck[cardIndex]);
    updatedCard.appendChild(symbolElement);
}

/* 
    Opens the card by the @card with the @updatedCard containing the symbol
 */
function showCard(card, updatedCard){
    deck.appendChild(updatedCard);
    deck.replaceChild(updatedCard, card);
}

/* 
    Returns the symbol of a clicked card
 */
function returnSymbol(card) {
    return card.firstElementChild.className;
}

function progress(card){
    const cardIndex = getElementIndex(card);
    const updatedCard = document.createElement('li');
    updatedCard.classList.add('card');
    addSymbol(updatedCard, cardIndex);
    addCardClasses([updatedCard], ['open', 'show']);
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

/* 
    Check if the clicked is already open
 */
function isOpen(card){
    if(card.classList.contains('open') || card.classList.contains('match')){
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
    if(e.target.classList.contains('card')){
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
    watch.stop();
    document.getElementById('congratulations').style.display = 'none';
    deck.removeEventListener('click', clickCard);
    game.startGame();
}

btnStartAndRestart.addEventListener('click', clickStartButton);