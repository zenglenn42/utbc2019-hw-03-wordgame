//
// Define controller object which includes the game logic
// and mediates the flow of messages between the user interface
// and the backend game model.
//

function Controller() { }

Controller.prototype.MAX_SEGMENTS = 8;
Controller.prototype.nextSegment = 1;
Controller.prototype.gameObj = null
Controller.prototype.guessedLetter = "";
Controller.prototype.gic = undefined;

Controller.prototype.play = function() {
    this.init()
}

// Call this once per session.

Controller.prototype.init = function() {
    // Instantiate game model.
    this.gameObj = new WordStop();

    // Instantiate game input controller.
    //
    // This carefully manages the keyboard input event listener and
    // provides timeout capability for pauses between rounds of play.
    this.gic = new GameInputController();
    
    // Initialize game input controller.
    let fid = document.getElementById("guessed-letter-form");
    let uid = document.getElementById("guessed-letter-input");
    let rid = document.getElementById("status-text");
    let eventType = "input";
    let hideViewOnDisable = true;
    let reFocusOnUnhide = true;
    let wTimeoutmSecs = 3000; // msec timeout on win
    let lTimeoutmSecs = 6000; // msec timeout of loss
    this.gic.init(
        fid,
        uid,
        rid,
        eventType,
        hideViewOnDisable,
        reFocusOnUnhide,
        wTimeoutmSecs,
        lTimeoutmSecs
    );
    this.gic.inputCallback = this.getInputCallback();
    this.gic.timeoutCallback = this.getTimeoutCallback();

    this.addThemeSelection();
    
    // Reset game controller.
    this.reset();
    
    // Register event listeners for menu items.
    this.addMenuEventListeners();

    // Register and enable keyboard input listeners for guessed letters.
    this.gic.enableInput();
}

// Call this with each new round.

Controller.prototype.reset = function() {
    this.setThemedBackground();
    this.nextSegment = 1;
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

Controller.prototype.addThemeSelection = function() {
    let pid = document.getElementById("navbar-brand");
    let sid = document.createElement("select");
    sid.setAttribute("id", "theme-select");
    let lexThemes = this.gameObj.lexicons.getLexKeys();
    for (let theme of lexThemes) {
        let oid = document.createElement("option");
        oid.textContent = theme;
        sid.appendChild(oid);
    }
    pid.appendChild(sid);
    // Let default model lexicon drive the initial display.
    let lexIndex = lexThemes.indexOf(this.gameObj.lexKey);
    sid.selectedIndex = lexIndex;
    this.addThemeListener();
}

Controller.prototype.addThemeListener = function() {
    var that = this;
    // TODO: Change this to vanilla js :)
    $(document).on("change", "#theme-select", function(e) {
        let oldLex = that.gameObj.lexicons.createLexicon(that.gameObj.lexKey);
        delete oldLex;  // prevent memory leak
        
        // that.gameObj.lexKey = e.target.value;
        that.gameObj.lexKey = $(this).val();
        that.gameObj.lexicon = that.gameObj.lexicons.createLexicon(that.gameObj.lexKey);
        that.reset(); // reset controller and game model
    })
}

Controller.prototype.setThemedBackground = function() {
    let id = document.getElementById("main");
    let imgSrc = this.gameObj.lexicon.imgSrc;
    if (id) id.setAttribute("style", `background: url('${imgSrc}') 0 / cover fixed`);
}

Controller.prototype.showGameName = function() {
    var gameName = this.gameObj.getName()
    let id = document.getElementById("game-name");
    if (id) id.textContent = gameName;
}

Controller.prototype.showGuessesLeft = function () {
    let id = document.getElementById("guesses-left-num");
    if (id) id.textContent = this.gameObj.getGuessesLeft();
}

Controller.prototype.showLettersUsed = function() {
    let id = document.getElementById("letters-used-text");
    var lettersUsed = this.gameObj.getLettersUsed();
    if (id) id.textContent = lettersUsed;
}

Controller.prototype.showWordToGuess = function (color = "black", borderColor = "teal", borderWidth = "1px") {
    let id = document.getElementById("word-to-guess");
    if (id) {
        id.textContent = this.gameObj.currentGuess;
        id.style.color = color;
        id.style.borderColor = borderColor;
        id.style.borderWidth = borderWidth;
    }
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
                // alert("Hint: Try '" + ch + "'");
                that.setBlur(); // prevent soft keyboard from popping up on hint
                swal({
                    text: ch,
                    buttons: false,
                    timer: 1500,
                });
            } else {
                // alert("Hint: No more hints left. :-/");
                swal("No hints left!");
            }
        }
        that.setFocus();
    }
    return menuCallback;
}

Controller.prototype.getStatsMenuEventCallback = function() {
    let that = this;
    function menuCallback(e) {
        let winStr =    `Wins: ${that.gameObj.wins}`;
        let lossesStr = `Losses: ${that.gameObj.losses}`;
        // let alertStr = `Game Stats\n${winStr}\n${lossesStr}`;
        // alert(alertStr);
        // that.setFocus();
        let alertStr = `${winStr}\n${lossesStr}`;
        swal("Game Stats", alertStr).then(function() {
            that.setFocus();
        });
    }
    return menuCallback;
}

Controller.prototype.getHelpMenuEventCallback = function() {
    let that = this;
    function menuCallback(e) {
        let helpTitle = `${that.gameObj.name} 🙂`;
        let helpStr = that.gameObj.helpText;
        // alert(`${helpTitle}\n\n${helpStr}`);
        // that.setFocus();
        swal(helpTitle, helpStr).then(function() {
            that.setFocus();
        });
    }
    return menuCallback;
}

Controller.prototype.getInputCallback = function() {
    let that = this;

    function inputCallback(e) {
        console.log("inputCallback");

        that.gic.disableInput();    // quiesce input events
        that.updateState(e);        // update model

        let statusText = "";
        let textColor = "";
        let borderColor = "";
        let borderWidth = "";
        switch (that.gameObj.getPlayState()) {
            case "won": 
                statusText = "You won! :-)"  
                that.showStatusText(statusText, "teal");
                textColor = "black";
                borderColor = "green";
                borderWidth = "3px";
                that.showWordToGuess(textColor, borderColor, borderWidth);
                // pause before resetting for next round of play
                swal({icon: "success"}).then(function() {
                    that.gic.timeoutCallback();
                });
                // setTimeout(that.gic.timeoutCallback, that.gic.lossTimeoutmSecs);
                break;
            case "lost":
                statusText = "You lost."
                that.showStatusText(statusText, "teal");
                that.gameObj.currentGuess = that.gameObj.currentWord;
                textColor = "red";
                borderColor = "black";
                borderWidth = "3px";
                that.showWordToGuess(textColor, borderColor, borderWidth);  
                // pause before resetting for next round of play
                setTimeout(that.gic.timeoutCallback, that.gic.lossTimeoutmSecs);
                break;
            default:
                that.gic.enableInput();  // re-enable input events for next guessed letter
        }
    }
    return inputCallback;
}

Controller.prototype.updateState = function(e) {
    var ch = e.data.toLowerCase();
    if (ch >= "a" && ch <= "z") {
      this.takeTurn(ch);    // this updates the state of the model
    }
}

Controller.prototype.takeTurn = function(userGuess) {
    console.log("takeTurn ch = ", userGuess);
    this.guessedLetter = userGuess;
    let goodGuess = this.gameObj.takeTurn(userGuess);
    if (!goodGuess) {
        this.drawNextStopSegment();
    }
    this.showWordToGuess();
    this.showLettersUsed();
    this.showGuessesLeft();
}

Controller.prototype.getTimeoutCallback = function() {
    var that = this;
    function timeoutCallback() {
        console.log("timeout");
        // After pause between rounds of play, 
        // reset controller and re-enable inputs for next round.
        that.reset();
        that.gic.enableInput();
    }
    return timeoutCallback;
}

Controller.prototype.resetGuessedLetterForm = function() {
    let id = document.getElementById("guessed-letter-form");
    id.reset();
}

Controller.prototype.setFocus = function() {
    let id = document.getElementById("guessed-letter-input");
    id.focus();
}

Controller.prototype.setBlur = function() {
    let id = document.getElementById("guessed-letter-input");
    id.blur();
}

Controller.prototype.showStatusText = function(text, bgColor = "#999") {
    let id = document.getElementById("status-text");
    if (id) id.setAttribute("style", 
        `background-color: ${bgColor};
        color: white;
        text-align: center`);
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
}
