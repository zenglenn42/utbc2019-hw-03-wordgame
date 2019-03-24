//
// Define object model for a generic game.
//

function Game() { }
Game.prototype.level = 0;
Game.prototype.levels = ["beginner", "intermediate", "advanced"];
Game.prototype.losses = 0;
Game.prototype.wins = 0;
Game.prototype.name = "Game";
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
Game.prototype.getName = function() {
    return this.name;
}

//
// Define object model for the WordStop game.
//

function WordStop() { }
WordStop.prototype = new Game();                // Inherit from Game.
WordStop.prototype.__proto__ = Game.prototype;
WordStop.prototype.name = "Word Stop";          // For user interface skin.
WordStop.prototype.badGuessesLeft = 8;
WordStop.prototype.currentGuess = "";
WordStop.prototype.currentWord = "";
WordStop.prototype.lettersUsed = [];
WordStop.prototype.helpText = "\
Welcome to WordStop!\n\n\
This is a variation on the game of 'hangman' except the gallows has been \
replaced by the outline of a Stop sign. \n\n\
You get 8 wrong guesses at letters in the word before the game is over.\
";
WordStop.prototype.lexicon = new Lexicon();
WordStop.prototype.playState = "playing"; // "playing" | "won" | "lost"

WordStop.prototype.getHintLetter = function() {
    var results = this.currentGuess.indexOf("_");
    if (results !== -1) {
        results = this.currentWord[results];
    }
    return results;
}

WordStop.prototype.getLettersUsed = function() {
    var letterStr = this.lettersUsed.join("");
    return letterStr;
}

WordStop.prototype.addLetterUsed = function(letter) {
    // Create a set of letters guessed already.
    if (!this.lettersUsed.includes(letter)) {
        this.lettersUsed.push(letter);
    }
}

WordStop.prototype.reset = function() {
    this.playState = "playing";
    this.badGuessesLeft = 8;
    this.lettersUsed = [];
    this.currentGuess = "";
    this.currentWord = this.lexicon.getWord();
    if (this.currentWord) {
        for (let i = 0; i <  this.currentWord.length; i++) {
            this.currentGuess += "_";
        }
        return true;
    } else {
        console.log("You've used up all my words.");
        return false;
    }
}

WordStop.prototype.getGuessesLeft = function() {
    return this.badGuessesLeft;
}

WordStop.prototype.takeTurn = function(ch) {
    if (this.lettersUsed.includes(ch))
        // user tried same bad letter multiple times
        return true;

    if (!this.currentWord) {
        // defensive programming when all words in lexicon
        // have been played
        return false;
    }

    this.addLetterUsed(ch);
    if (this.currentWord.indexOf(ch) === -1) {
        if (this.badGuessesLeft > 0) {
            this.badGuessesLeft--;
        }
        if (this.badGuessesLeft == 0) {
            this.playState = "lost";
            this.incLosses();
        }
        return false; // incorrectly guessed letter
    } else {
        let index = 0;
        while ( (index = this.currentWord.indexOf(ch, index)) !== -1) {
            var currentGuessArray = this.currentGuess.split("");
            currentGuessArray[index] = this.currentWord[index];
            this.currentGuess = currentGuessArray.join("");
            index++;
        }
        if (this.currentGuess == this.currentWord) {
            this.playState = "won"
            this.incWins();
        }
        return true;  // correct guessed letter
    }
}

WordStop.prototype.getPlayState = function() {
    return this.playState;
}

function UnitTestWordStopModel() {
    var ws = new WordStop();
    console.log(ws.getName());
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
}
