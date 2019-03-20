//
// Define controller object which includes the game logic
// and mediates the flow of messages between the user interface
// and the backend game model.
//

function Controller() { }

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

function UnitTestController() {
    var cntlr = new Controller();
    cntlr.showWins();
    cntlr.showLosses();
    cntlr.showLevel();
    cntlr.showGuessesLeft();
    cntlr.showLettersUsed();
    cntlr.showWordToGuess();
}