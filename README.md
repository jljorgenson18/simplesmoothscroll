# simplesmoothscroll
A module to simply scroll to an element on the page in a butter smooth fashion

## What is it?
Simple smooth scroll simply takes in an dom element as a param and scrolls to that element in an ease-in-out fashion. It can work on elements that are above the current window position or below the current window position

## Installation
`npm install simplesmoothscroll --save`


## Usage
```js


var scrollTo = require("simplesmoothscroll");

var myHeader = document.querySelector("h2");

scrollTo(myHeader);

// You can also include an offset so there is some room between
// the window position and the element

scrollTo(myHeader, 10);

```


## Contributing
Pull requests are much appreciated and accepted.


## License
Released under the [MIT License](http://www.opensource.org/licenses/MIT)
