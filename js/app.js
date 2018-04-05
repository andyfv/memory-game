/*
 * Create a list that holds all of your cards
 */

const deck = document.getElementsByClassName('deck')[0];
let virtualDeck = ['diamond', 'diamond', 'leaf', 'leaf', 'paper-plane', 'paper-plane', 'anchor', 'anchor',
            'bolt', 'bolt', 'cube', 'cube', 'bicycle', 'bicycle', 'bomb', 'bomb'];



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
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
    if(e.target.className === "card"){
        let card = e.target;    
        let cardIndex = getElementIndex(card);
        console.log(card);

    }
}

deck.addEventListener('click', clickCard);