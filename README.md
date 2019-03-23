# utbc2019-hw-03-wordgame

Here's what the final MVP (minimal viable product) game looks like:

![alt tag](docs/img/ws-unstyled-hint.png)

The octogon lights up with red segments as the user (incorrectly) guesses letters for a word from a basic lexicon of 850 words.
[This](https://simple.wikipedia.org/wiki/Wikipedia:Basic_English_ordered_wordlist) is the source of the words.

Game play is pretty tame ...

![alt tag](docs/img/ws-unstyled-opening.png)
![alt tag](docs/img/ws-unstyled-playing.png)

but the implementation has some notable features:

* MVC based (see [assets/js/model.js](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/blob/master/assets/js/model.js) & [assets/js/controller.js](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/blob/master/assets/js/controller.js)
* Closures are used in the controller to return event handlers that set this to my objects
* In the model, I use inheritance to subclass the WordStop game off a Game superclass

In theory, it would be easy enough to subclass off the WordStop game to create something that only served up palindromes, for example.
Even the name of the game and help text are in the model.

## Designer's Log

This week I'm riff'ing on the game of Hangman.  

But what would be an interesting alternative to the classic game that would that still meets the requirements while being less grim?

There's sunshine this morning and a brisk walk to my favorite breakfast taco joint gives
me time to think.  You get 6 wrong guesses in hangman, with the complete figure representing a stopping point.

What else represents a stopping point?  Something iconic that could be incrementally rendered
like hangman? 

I begin to think about lines and shapes.  What else can you make with 6 discrete segments?
Perhaps a stylized daisy with 6 'she loves me, she loves me not' petals that get plucked away
with each wrong guess?

I think of the word 'hex', as in a spell, a hexagram.  But a hexagram isn't really iconic, per se.

As I cross the street, I notice the stop sign.  True, it's an octogon, but it's a global icon for
stopping.  Just what I'm looking for.  Maybe I can incrementally render the outline of a stop sign
instead of a hangman.  It could be rendered with pole and base similar to hangman as well.  True, it
would amount to two extra guesses, but that's ok.  Just makes the game a tad easier.

But is a stop sign really /that/ compelling for game play?  Probably not by itself.  But if it
were placed in the right visual context, by adding a compelling background, maybe
it would.

And so my game of 'Word Stop' is conceived.

## Design Sketches

It occurs to me, I can reuse parts of my responsive portfolio design from the previous homework
to accelerate my progress.

With that in mind, here are the operational concepts that tumble out of my brain:

![alt tag](docs/img/ws-concept.jpg)
![alt tag](docs/img/ws-gameplay.jpg)
![alt tag](docs/img/ws-menuitems.jpg)
![alt tag](docs/img/ws-play-details.jpg)

Optional design ideas:

![alt tag](docs/img/ws-optional-background.jpg)
![alt tag](docs/img/ws-optional-player-levels.jpg)
![alt tag](docs/img/ws-optional-light.jpg)


