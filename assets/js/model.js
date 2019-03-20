//
// Define object model for a generic game.
//

function Game() { }
Game.prototype.level = 0;
Game.prototype.levels = ["beginner", "intermediate", "advanced"];
Game.prototype.losses = 0;
Game.prototype.wins = 0;
Game.prototype.getLevel = function() {
    return this.level;
}
Game.prototype.getLevelName = function() {
    return this.levels[this.level];
}
Game.prototype.setLevel = function(n) {
    const MAX_LEVEL = this.levels.length - 1;
    this.level = (n > MAX_LEVEL) ? MAX_LEVEL : n;
}
Game.prototype.getLosses = function() {
    return this.losses;
}
Game.prototype.incLosses = function() {
        this.losses++;
}
Game.prototype.setLosses = function(n) {
    this.losses = n;
}
Game.prototype.getWins = function() {
    return this.wins;
}
Game.prototype.incWins = function() {
        this.wins++;
}
Game.prototype.setWins = function(n) {
    this.wins = n;
}
Game.prototype.reset = function() {
    this.level = 0;
    this.losses = 0;
    this.wins = 0;
}

//
// Define object model for the WordStop game.
//

function WordStop() { }
WordStop.prototype = new Game();                // Inherit from Game.
WordStop.prototype.__proto__ = Game.prototype;
WordStop.prototype.badGuessesLeft = 8;
WordStop.prototype.currentGuess = "";
WordStop.prototype.currentWord = "";
WordStop.prototype.lettersUsed = [];
WordStop.prototype.getLettersUsed = function() {
    var letterStr = this.lettersUsed.join("");
    return letterStr;
}
WordStop.prototype.addLetterUsed = function(letter) {
    this.lettersUsed.push(letter);
}
WordStop.prototype.reset = function() {
    this.badGuessesLeft = 8;
    this.currentGuess = "";
    this.currentWord = ""
    this.lettersUsed = [];
}

//
// Define object model for the lexicon.
//

function Lexicon() { }
Lexicon.prototype.words = ["random", "words", "yay"];
Lexicon.prototype.wordsUsed = [];
Lexicon.prototype.getWord = function() {
    var rindex = Math.floor(Math.random() * (this.words.length));
    return this.words[rindex];
}
Lexicon.prototype.getLengthWord = function(n) { return "nlengthword"}

function UnitTestWordStopModel() {
    var ws = new WordStop();
    ws.setWins(2);
    var wins = ws.getWins();
    console.log("wins", wins);
    ws.incWins();
    var wins = ws.getWins();
    console.log("wins", wins);
    ws.addLetterUsed("a");
    ws.addLetterUsed("b");
    var used = ws.getLettersUsed();
    console.log("Letters used: ", used);
    ws.setLevel(2);
    console.log("level", ws.getLevelName());
    ws.setLevel(5);
    console.log("level", ws.getLevelName());
    lex = new Lexicon();
    console.log("lex word: ", lex.getWord());
    console.log("lex word: ", lex.getWord());
    console.log("lex word: ", lex.getWord());
    console.log("lex n-length word: ", lex.getLengthWord(3));
}
