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

Controller.prototype.init = function() {
    this.gameObj = new WordStop();
    this.gameObj.reset();
    this.reset();
}

Controller.prototype.showGameName = function() {
    var gameName = this.gameObj.getName()
    let id = document.getElementById("game-name");
    if (id) id.textContent = gameName;
}

Controller.prototype.showWins = function() {
    let id = document.getElementById("wins");
    if (id) id.textContent = "wins";
}

Controller.prototype.showLosses = function() {
    let id = document.getElementById("losses");
    if (id) id.textContent = "loses";
}

Controller.prototype.showLevel = function() {
    let id = document.getElementById("level");
    if (id) id.textContent = "level";
}

Controller.prototype.showGuessesLeft = function () {
    let id = document.getElementById("guesses-left");
    if (id) id.textContent = "guesses";
}

Controller.prototype.showLettersUsed = function () {
    let id = document.getElementById("letters-used");
    if (id) id.textContent = "letters";
}

Controller.prototype.showWordToGuess = function () {
    let id = document.getElementById("word-to-guess");
    if (id) id.textContent = "_ _ _ _ _ a";
}

Controller.prototype.drawStopSegment = function(n) {
    let idName = "stop-seg-" + n;
    if (n >= 1 && n <= this.MAX_SEGMENTS) {
        let id = document.getElementById(idName);
        if (id) id.setAttribute("style", "color: red");
    }
    return n;
}

Controller.prototype.resetStopSegment = function(n) {
    let idName = "stop-seg-" + n;
    if (n >= 1 && n <= this.MAX_SEGMENTS) {
        let id = document.getElementById(idName);
        if (id) id.setAttribute("style", "color: gray");
    }
    return n;
}

Controller.prototype.resetStopSign = function() {
    for (let i = 1; i <= this.MAX_SEGMENTS; i++) {
        this.resetStopSegment(i);
    }
    let id = document.getElementById("stop-text");
    if (id) id.setAttribute("style", "color: gray");
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

Controller.prototype.reset = function() {
    this.nextSegment = 1;
    this.allSegmentsDrawn = false;
    this.resetStopSign();
    this.showGameName();
}

function UnitTestController() {
    var cntlr = new Controller();
    cntlr.init();
    console.log(cntlr.gameObj.getName());
    cntlr.showGameName();
    cntlr.showWins();
    cntlr.showLosses();
    cntlr.showLevel();
    cntlr.showGuessesLeft();
    cntlr.showLettersUsed();
    cntlr.showWordToGuess();

    for (let i = 1; i <= cntlr.MAX_SEGMENTS; i++) {
        cntlr.drawNextStopSegment();
    }
    // cntlr.reset();
}