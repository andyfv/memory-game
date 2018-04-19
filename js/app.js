/*
 * Create a list that holds all of your cards
 */



const deck = document.getElementsByClassName('deck')[0];
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
    flipPairUp: function(){
        removeCardClasses(this.firstCard, "open", "show");
        addCardClasses(this.firstCard,"match");
        removeCardClasses(this.secondCard, "open", "show");
        addCardClasses(this.secondCard, "match");
        this.resetPair();
    },
    resetPair: function() {
        this.firstCard = null;
        this.secondCard = null; 
    },
    flipPairDown: function() {
        removeCardClasses(this.firstCard, "open", "show");
        removeCardClasses(this.secondCard, "open", "show");
    }
}

let game = {
    pairHandler: function() {
        if(pair.areSymbolsEqual()){
            pair.flipPairUp();
        } else {
            setTimeout(function(){
                pair.flipPairDown()
                pair.resetPair();
            },1000);
        }
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
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return virtualDeck;
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


function removeCardClasses(card, ...classes) {
    for(let eachClass of classes) {
        card.classList.remove(eachClass);
    }
}

function addCardClasses(card, ...classes){
    for(let eachClass of classes) {
        card.classList.add(eachClass);
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
    addCardClasses(updatedCard, "open", "show");
    showCard(card, updatedCard);
    if(pair.isEmpty()){
        pair.firstCard = updatedCard;
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
    //deck.removeEventListener('click',clickCard);
    e.stopPropagation();
    if(e.target.classList.contains("card")){
        let card = e.target;    
        if(isOpen(card)){
            return;
        } else {
            progress(card);
        }
        // card.classList.toggle("open");
        // card.classList.toggle("show");
        //let pair = new Array(2);
    }
}

deck.addEventListener('click', clickCard);
