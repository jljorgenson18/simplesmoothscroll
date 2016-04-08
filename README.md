# simplesmoothscroll
A module to simply scroll to an element on the page in a buttery smooth fashion

## What is it?
Simple smooth scroll takes in a dom element and scrolls to that element in an ease-in-out fashion. It can work on elements that are above the current window position or below the current window position

## Installation
`npm install simplesmoothscroll --save`


## Usage
```js
var smoothScroll = require("simplesmoothscroll");

// Passing in no params scrolls you to the top of the page
smoothScroll();

// Passing an element as a param scrolls you to that element
//
var myHeader = document.querySelector("h2");
smoothScroll(myHeader);


// You can also include an offset so there is some room between
// the window position and the element

smoothScroll(myHeader, 10);


// If you want to execute a function when the scroll finishes, you can
// pass in an onScrollFinished callback. A "cancelled" param is passed in
// as an arg in case the scroll was cancelled due to user interaction
smoothScroll(myHeader, 10, function(cancelled) {
  // Your function
});

```

## Contributing
My goal here is to make the scroll as performant and smooth as possible. If there are optimizations that can be made then feel free to open an issue or submit a pull request.


## License
Released under the [MIT License](http://www.opensource.org/licenses/MIT)
