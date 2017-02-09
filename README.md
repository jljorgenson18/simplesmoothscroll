# simplesmoothscroll

[![npm version](https://badge.fury.io/js/simplesmoothscroll.svg)](https://badge.fury.io/js/simplesmoothscroll)
[![Build Status](https://travis-ci.org/jljorgenson18/simplesmoothscroll.svg?branch=master)](https://travis-ci.org/jljorgenson18/simplesmoothscroll)
[![Code Climate](https://codeclimate.com/github/jljorgenson18/simplesmoothscroll/badges/gpa.svg)](https://codeclimate.com/github/jljorgenson18/simplesmoothscroll)
[![Test Coverage](https://codeclimate.com/github/jljorgenson18/simplesmoothscroll/badges/coverage.svg)](https://codeclimate.com/github/jljorgenson18/simplesmoothscroll/coverage)
[![Dependency Status](https://david-dm.org/jljorgenson18/simplesmoothscroll.svg)](https://david-dm.org/jljorgenson18/simplesmoothscroll)

A module to simply scroll to an element on the page in a buttery smooth fashion
- No dependencies
- CommonJS, AMD, and Browser ready

# [DEMO!](http://jljorgenson18.github.io/simplesmoothscroll/)

## What is it?
Simple smooth scroll takes in a dom element and scrolls to that element in an ease-in-out fashion. It can work on elements that are above the current window position or below the current window position

## Installation
```sh
npm install simplesmoothscroll --save
```

## Usage

```js
var smoothScroll = require("simplesmoothscroll");

// Passing in no params scrolls you to the top of the page
smoothScroll();

// Passing an element as a param scrolls you to that element
var myHeader = document.querySelector("h2");
smoothScroll(myHeader);


// You can also include an offset so there is some room between
// the top of the viewport and the element
smoothScroll(myHeader, {
  offset: 10
});


/**
 *  If you want to execute a function when the scroll finishes, you can
 *  pass in an onScrollFinished callback. A "cancelled" param is passed in
 *  as an arg in case the scroll was cancelled due to user interaction
 */
smoothScroll(myHeader, {
  offset: 10,
  onScrollFinished: function(cancelled) {
    // Your function
  }
});

/**
 * If you want your own easing function instead of the default trig-based
 * ease-in-out function, you can pass in a getEasingFunction parameter that
 * should return your custom easing function. "getEasingFunction" is passed in
 * the targetPosition (distance the target is from the viewport)
 * and the returned function will be passed a "stepCount" argument that
 * represents the number of frames since the scroll started.
 * The easing function should return a value between 0 and 1 where 0
 * will scroll to the initial position and 1 will scroll to the target.
 * Below is an example of using a custom linear scroll
 */
smoothScroll(myHeader, {
  getEasingFunction: function(targetPosition) {
    return function(stepCount) {
      return stepCount * 0.01;
    }
  }
});

```
## API

`smoothScroll(element, options)`

  * `element` [optional] - a dom element to scroll to. If not provided, smoothScroll will scroll to the top of the page
  * `options` [optional] - option parameters for the smooth scroll
    * `offset` - A margin between the target element and the top of the viewport
    * `onScrollFinished` - A function to execute when the scroll finishes. It is passed a "cancelled" argument in case the scroll did not finish due to user interaction with the page.
    * `getEasingFunction` - A function that should return your custom easing
    function if you do not wish to use the default easing function. This is
    passed in a targetPosition argument. See usage for an example   

## Contributing
My goal here is to make the scroll as performant and smooth as possible. If there are optimizations that can be made then feel free to open an issue or submit a pull request.


## License
Released under the [MIT License](http://www.opensource.org/licenses/MIT)
