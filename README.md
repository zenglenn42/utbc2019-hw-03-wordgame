# utbc2019-hw-03-wordgame

Here's what the final MVP (minimal viable product) game looks like:

![alt tag](docs/img/ws-unstyled-hint.png)

The octogon lights up with red segments as the user (incorrectly) guesses letters for a word from a basic lexicon of 850 words.
[This](https://simple.wikipedia.org/wiki/Wikipedia:Basic_English_ordered_wordlist) is the source of the words.

Game play is pretty tame ...

![alt tag](docs/img/ws-unstyled-opening.png)
![alt tag](docs/img/ws-unstyled-playing.png)

## Implementation Features

* [MVC](https://medium.freecodecamp.org/model-view-controller-mvc-explained-through-ordering-drinks-at-the-bar-efcba6255053) based (see [assets/js/model.js](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/blob/master/assets/js/model.js) & [assets/js/controller.js](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/blob/master/assets/js/controller.js))
* [Closures](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/blob/f08e605b03e157e77a4cade64a6c7c530c6ea63d/assets/js/controller.js#L125) are used in the controller to return event handlers that set 'this' to my objects
* In the model, I use [inheritance](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/blob/f08e605b03e157e77a4cade64a6c7c530c6ea63d/assets/js/model.js#L53) to subclass the WordStop game off a Game superclass
* Game is responsive.

In theory, it would be easy enough to subclass off the WordStop game to create something that only served up palindromes, for example.
Even the name of the game and [help text](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/blob/ad02a309a5ff547a1d9a35de1a360b889b817f9b/assets/js/model.js#L60) are in the model.

The two most interesting implementation blockers that really made me think were:

* [DOM rendering is not synchronous](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/commit/181018e129ad4d3e46fe6bbcd95d3bb2f561005e)
* [Sharing js-runtime state across multiple html pages takes some thought :-)](https://github.com/zenglenn42/utbc2019-hw-03-wordgame/pull/8)

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


