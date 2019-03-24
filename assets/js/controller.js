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
        this.showStatusText("Pick a letter!")
    } else {
        this.showStatusText("You've played all the words I know.");
    }
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
    this.forceDOMrender();
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
    if (this.nextSegment <= this.MAX_SEGMENTS) {
        this.drawStopSegment(this.nextSegment++);
    }

    if (this.nextSegment > this.MAX_SEGMENTS) {
        this.allSegmentsDrawn = true;
        let id = document.getElementById("stop-text");
        if (id) id.setAttribute("style", "color: white; background-color: red");
    }
}

Controller.prototype.addMenuEventListeners = function() {
    
    let hintId = document.getElementById("navbar-btn");
    hintId.addEventListener('click', this.getHintMenuEventCallback(), false);

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
        if (that.gameObj.getPlayState() == "playing") {
            let ch = that.gameObj.getHintLetter();
            if (ch !== -1) {
                alert("Hint: Try '" + ch + "'");
            } else {
                alert("Hint: No more hints left. :-/");
            }
        }
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

Controller.prototype.getKeyboardEventCallback = function() {
    let that = this;
    function keyboardCallback(e) {
        that.resetGuessedLetterForm();
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            // console.log(e);
            that.takeTurn(e.key.toLowerCase());
        }
    }
    return keyboardCallback;
}

// Primary game-flow logic.

Controller.prototype.takeTurn = function(userGuess) {
    this.guessedLetter = userGuess;
    let goodGuess = this.gameObj.takeTurn(userGuess);
    if (!goodGuess) {
        this.drawNextStopSegment();
    }
    this.showWordToGuess();
    this.showLettersUsed();
    this.showGuessesLeft();

    switch (this.gameObj.getPlayState()) {
        case "won": 
            statusText = "You won! :-)"
            this.syncShowWinner(statusText);
            break;
        case "lost":
            statusText = "You lost."
            this.syncShowLoser(statusText);
            break;
    }
    this.setFocus();
}

Controller.prototype.syncShowWinner = function(str) {
    this.showStatusText(str, "green");
    Controller.prototype.forceDOMrender();
    // pause before resetting for next round of play
    let msecsPause = 3000;
    setTimeout(this.getResetCallback(), msecsPause);
}

Controller.prototype.getResetCallback = function() {
    var that = this;
    function callback() {

        // NB: I'm seeing conditions in test whereby keyboard
        // events seem to get buffered up between rounds of
        // play causing multiple calls to reset, resulting in
        // multiple new words to guess in rapdid succession.
        // Here we enforce a single call to reset on win/loss 
        // boundaries.
        //
        // TODO: Research ways to empty the event queue at the
        //       end of a game to avoid possible spill-over events.

        if (that.gameObj.playState == "won" || that.gameObj.playState == "lost") {
            that.reset();
        }
    }
    return callback;
}

Controller.prototype.syncShowLoser = function(str) {
    str += " Word was: '" + this.gameObj.currentWord + "'";    
    this.showStatusText(str, "rebeccapurple");
    Controller.prototype.forceDOMrender();
    // pause before resetting for next round of play
    let msecsPause = 6000;
    setTimeout(this.getResetCallback(), msecsPause);
}

// It appears I don't need this expedience now that I've added
// timeouts inbetween rounds of play. :-)

Controller.prototype.forceDOMrender = function() {
    return;
    // Since DOM rendering is not synchronous, there are times
    // when we want to force the browser to render.
    //
    // Attempting to trigger DOM repaint by these hacks.
    //
    // let mcId = document.getElementById("main-container");
    // mcId.style.display = "none";
    // mcId.style.display = "block";
    // let glfId = document.getElementById("guessed-letter-form");
    // glfId.style.display = "none";
    // glfId.style.display = "block";  
}

Controller.prototype.resetGuessedLetterForm = function() {
    let id = document.getElementById("guessed-letter-form");
    id.reset();
    this.forceDOMrender();
}

Controller.prototype.setFocus = function() {
    let id = document.getElementById("guessed-letter-input");
    id.focus();
}

Controller.prototype.showStatusText = function(text, bgColor = "teal") {
    let id = document.getElementById("status-text");
    if (id) id.setAttribute("style", 
        `background-color: ${bgColor};
        color: white;
        text-align: center`);
    id.textContent = text;
}

// Controller.prototype.unHideHintButton = function() {
//     const mq = window.matchMedia("(max-width: 640px)");
//     let id = document.querySelector("a#navbar-btn");
//     if (mq.matches) {
//         id.style.display = "inline";
//         id.style.visibility = "visible";
//     } else {
//         id.style.visibility = "visible";
//     }
// }

// Controller.prototype.HideHintButton = function() {
//     const mq = window.matchMedia("(max-width: 640px)");
//     let id = document.getElementById("navbar-btn");
//     if (mq.matches) {
//         id.style.display = "none";
//     } else {
//         id.style.visibility = "invisible";
//     }
// }

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
