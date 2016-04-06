"use strict";

(function() {

    /**
     * There are a few descriptions of some basic dom and window
     * attributes and methods in case you get confused
     *
     * window.pageYOffset: an alias for window.scrollY which is
     * the number of pixels that the document is currently
     * scrolled from the top.
     *
     * getBoundingClientRect: method returns the size of an element
     * and its position relative to the viewport...top and left are
     * relative to the top-left of the viewport.
     *
     **/

    var getHeightOfEntirePage = function() {
        var body = document.body;
        var html = document.documentElement;

        return Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
    };

    var getHeightOfWindow = function() {
        return ("innerHeight" in window) ? window.innerHeight : document.documentElement.offsetHeight;
    };

    // Returns 0 if it doesn't pass the bottom or
    // the difference if scrolling down would
    // pass the bottom of the page
    var passedBottom = function(distFromTopOfViewport) {
        var difference = 0;
        // We can only pass the bottom if we are scrolling down
        if (distFromTopOfViewport < 0) {
            var pageHeight = getHeightOfEntirePage();
            var windowHeight = getHeightOfWindow();
            var endingPageYOffset = window.pageYOffset - distFromTopOfViewport;
            if (endingPageYOffset + windowHeight > pageHeight) {
                difference = endingPageYOffset + windowHeight - pageHeight;
            }
        }
        return difference;
    }

    /**
     * Finds the Y-Coordinate relative to the viewport
     * that we want to scrollTo.
     * Negative values imply that the target is below the
     * top of the viewport.
     * Positive values imply that the
     * target is above the top of the viewport
     *
     * Default: Scroll to the top of the page by
     * finding how far we have already scrolled using
     * window.pageYOffset
     */
    var getScrollTargetPosition = function(ele, offset) {
        if (!ele) {
            return window.pageYOffset;
        }
        if (!offset) {
            offset = 0;
        }
        var distFromTopOfViewport = -ele.getBoundingClientRect().top;
        offset += passedBottom(distFromTopOfViewport);
        return distFromTopOfViewport + offset;
    };

    // This returns a step size which essentially dictates the
    // speed of the scroll. This math was done to make shorter scrolls
    // go a little slower relative to the distance and longer scrolls
    // go a little faster relative to the distance. This is essentially
    // trial and error with some trig
    var getStepSize = function(targetPosition) {
        return (Math.PI * 15) / (Math.sqrt(Math.abs(targetPosition) / 1000) * 1000);
    };

    // TODO: Make the easing function customizable
    // Essentially what is going on here is that we want the easing function
    // to be about 0 when the scrolling starts and about 0 when the scrolling
    // finishes. We use some trigonometry to do that
    var getScrollMargin = function(targetPosition, stepCount, stepSize) {
        return (targetPosition / 2) * (1 - Math.cos(stepCount * stepSize));
    }

    var smoothScroll = function(ele, offset) {
        var targetPosition = getScrollTargetPosition(ele, offset);
        var stepSize = getStepSize(targetPosition);
        var initScrollHeight = window.pageYOffset;
        var targetY = window.pageYOffset - targetPosition;

        // Cancel on Wheel touch
        var scrollWheelTouched = false;
        var onWheelListener = function(e) {
            scrollWheelTouched = true;
            window.removeEventListener("wheel", onWheelListener);
        };
        window.addEventListener("wheel", onWheelListener);

        var stepCount = 0;
        var scrollingFinished;


        // Depending on if we are scrolling down or up,
        // we create a scrollingFinished function to use as
        // our conditional when doing the raf loop
        if (targetPosition < 0) {
            scrollingFinished = function() {
                return window.pageYOffset < (targetY - 5) && !scrollWheelTouched;
            }
        } else {
            scrollingFinished = function() {
                return window.pageYOffset > (targetY + 5) && !scrollWheelTouched;
            }
        }

        // Where the loop actually starts
        var step = function() {
            // Need the - 5 due to the asymptote
            if (scrollingFinished()) {
                stepCount++;
                window.scrollTo(0, (initScrollHeight - getScrollMargin(targetPosition, stepCount, stepSize)));
                requestAnimationFrame(step);
            }
            //TODO Add a "onScrollFinished" callback
        };
        requestAnimationFrame(step);

    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = smoothScroll;
    } else {
        if (typeof define === 'function' && define.amd) {
            define([], function() {
                return smoothScroll;
            });
        } else {
            window.smoothScroll = smoothScroll;
        }
    }
})();
