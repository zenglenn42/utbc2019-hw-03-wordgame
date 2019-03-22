//
// Define controller object which includes the game logic
// and mediates the flow of messages between the user interface
// and the backend game model.
//

function Controller() { }

Controller.prototype.MAX_SEGMENTS = 8;
Controller.prototype.nextSegment = 1;
Controller.prototype.allSegmentsDrawn = false;
Controller.prototype.gameObj = null
Controller.prototype.guessedLetter = "";


Controller.prototype.play = function() {
    this.init()
}

// Call this once per session.
Controller.prototype.init = function() {
    // instantiate model
    this.gameObj = new WordStop();

    // reset controller
    this.reset();

    // register input listeners
    this.addMenuEventListeners();
    this.addKeyboardEventListener();
}

// Call this with each new round.
Controller.prototype.reset = function() {
    this.nextSegment = 1;
    this.allSegmentsDrawn = false;
    this.resetStopSign();
    this.showGameName();
    this.setFocus();
    this.resetGuessedLetterForm();
    // Fetch a new word and reset game state.
    if (this.gameObj.reset()) {
        console.log("Controller.reset() new word = ", this.gameObj.currentWord);
        this.showGuessesLeft();
        this.showWordToGuess();
        this.showLettersUsed();
    } // else all the words were played.  TODO: Handle more gracefully.
}

Controller.prototype.showGameName = function() {
    var gameName = this.gameObj.getName()
    let id = document.getElementById("game-name");
    if (id) id.textContent = gameName;
}

Controller.prototype.showGuessesLeft = function () {
    let id = document.getElementById("guesses-left");
    if (id) id.textContent = this.gameObj.getGuessesLeft();
}

Controller.prototype.showLettersUsed = function() {
    let id = document.getElementById("letters-used");
    var lettersUsed = this.gameObj.getLettersUsed();
    if (id) id.textContent = lettersUsed;
}

Controller.prototype.showWordToGuess = function () {
    let id = document.getElementById("word-to-guess");
    if (id) id.textContent = this.gameObj.currentGuess;
}

Controller.prototype.drawStopSegment = function(n) {
    let idName = "stop-seg-" + n;
    if (n >= 1 && n <= this.MAX_SEGMENTS) {
        let id = document.getElementById(idName);
        if (id) id.setAttribute("style", "color: red");
    }
}

Controller.prototype.resetStopSegment = function(n) {
    let idName = "stop-seg-" + n;
    if (n >= 1 && n <= this.MAX_SEGMENTS) {
        let id = document.getElementById(idName);
        if (id) id.setAttribute("style", "color: gray");
    }
}

Controller.prototype.resetStopSign = function() {
    for (let i = 1; i <= this.MAX_SEGMENTS; i++) {
        this.resetStopSegment(i);
    }
    let id = document.getElementById("stop-text");
    if (id) id.setAttribute("style", "color: white");
}

Controller.prototype.drawNextStopSegment = function() {
    // TODO: Open issue for this.
    //
    // The bit of guard logic you see addresses an issue
    // with the stop sign getting updated after one round
    // has finished but before the next has started.
    //
    // Wondering if there is subtle data buffering issue
    // with my keyboard handler.  It /seems/ like the last
    // guessed letter from the previous round is still in 
    // the input buffer and sometimes bleeds into the next
    // round.
    if (this.gameObj.getPlayState() == "playing") {
        if (this.nextSegment <= this.MAX_SEGMENTS) {
            this.drawStopSegment(this.nextSegment++);
        }

        if (this.nextSegment > this.MAX_SEGMENTS) {
            this.allSegmentsDrawn = true;
            let id = document.getElementById("stop-text");
            if (id) id.setAttribute("style", "color: white; background-color: red");
        }
    }
}

Controller.prototype.addMenuEventListeners = function() {
    
    // let hintId = document.getElementById("navbar-btn");
    // hintId.addEventListener('click', this.getHintMenuEventCallback(), false);

    let statsId = document.getElementById("stats-link");
    statsId.addEventListener('click', this.getStatsMenuEventCallback(),false);

    let helpId = document.getElementById("help-link");
    helpId.addEventListener('click', this.getHelpMenuEventCallback(), false);
}

// Use closures to sequester 'this' properly for navbar menu item callbacks.
// Otherwise 'this' will be bound to the triggering html navbar element
// and not the controller object as needed.

Controller.prototype.getHintMenuEventCallback = function() {
    let that = this;
    function menuCallback(e) {
        that.reset();
        that.setFocus();
    }
    return menuCallback;
}

Controller.prototype.getStatsMenuEventCallback = function() {
    let that = this;
    function menuCallback(e) {
        let winStr = `Wins: ${that.gameObj.wins}`;
        let lossesStr = `Losses: ${that.gameObj.losses}`;
        let alertStr = `Game Stats\n${winStr}\n${lossesStr}`;
        alert(alertStr);
        that.setFocus();
    }
    return menuCallback;
}

Controller.prototype.getHelpMenuEventCallback = function() {
    let that = this;
    function menuCallback(e) {
        let helpStr = that.gameObj.helpText;
        alert(helpStr);
        that.setFocus();
    }
    return menuCallback;
}

Controller.prototype.addKeyboardEventListener = function() {
    let id = document.getElementById("guessed-letter-input");
    id.addEventListener('keyup', this.getKeyboardEventCallback(), false);
}

// Doesn't seem to work...thinking it could be the closure.
// in removeEventListener.
//
// Controller.prototype.removeKeyboardEventListener = function() {
//     let id = document.getElementById("guessed-letter-input");
//     id.removeEventListener('keyup', this.getKeyboardEventCallback());
// }

Controller.prototype.getKeyboardEventCallback = function() {
    let that = this;
    function keyboardCallback(e) {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            // console.log(e);
            that.takeTurn(e.key.toLowerCase());
        }
        that.resetGuessedLetterForm();
    }
    return keyboardCallback;
}

Controller.prototype.takeTurn = function(userGuess) {
    this.guessedLetter = userGuess;
    let goodGuess = this.gameObj.takeTurn(userGuess);
    this.showWordToGuess();
    this.showLettersUsed();
    this.showGuessesLeft();
    if (!goodGuess) {
        this.drawNextStopSegment();
    }
    let statusText = "";
    switch (this.gameObj.getPlayState()) {
        case "won": 
            statusText = "You won! :-)"
            // TODO: Fix race condition here.  Alert box pops up before
            // status text has been written to the DOM :-/
            this.showStatusText(statusText);
            statusText += "\n\nYou guessed: " + this.gameObj.currentWord;
            alert(statusText);
            this.reset();
            break;
        case "lost":
            statusText = "You lost.  Better luck next time."
            // TODO: Fix race condition here.  Alert box pops up before
            // status text has been written to the DOM :-/
            this.showStatusText(statusText);
            statusText += "\n\nThe word was: " + this.gameObj.currentWord;
            alert(statusText);
            this.reset();
            break;
    }
}

Controller.prototype.resetGuessedLetterForm = function() {
    let id = document.getElementById("guessed-letter-form");
    id.reset();
}

Controller.prototype.setFocus = function() {
    let id = document.getElementById("guessed-letter-input");
    id.focus();
}

Controller.prototype.showStatusText = function(text) {
    let id = document.getElementById("status-text");
    id.textContent = text;
}

function UnitTestController() {
    var cntlr = new Controller();
    cntlr.init();
    console.log(cntlr.gameObj.getName());
    cntlr.gameObj.wins = 3;
    cntlr.showGameName();
    cntlr.showGuessesLeft();
    cntlr.showLettersUsed();
    cntlr.showWordToGuess();

    for (let i = 1; i <= cntlr.MAX_SEGMENTS; i++) {
        cntlr.drawNextStopSegment();
    }

    // cntlr.reset();
}
