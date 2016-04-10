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

    // Object.assign from mdn
    /*istanbul ignore next*/
    var assign = function(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };

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
    };

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

    var getDefaultEasingFunction = function(targetPosition) {
        var stepLength = 1000 / 60; // 60fps ~> 16.6667ms per frame;
        var distance = Math.abs(targetPosition); // In px
        // We generate a duration using the distance
        // The sqrt is used to bring the duration closer to 1s overall
        var duration = Math.sqrt(distance / 1000) * 1000;
        var totalStepCount = Math.floor(duration / stepLength);
        var coefficient = Math.PI / totalStepCount;
        // Using trig to generate an easing function. It should start by
        // returning a 0 and then end at returning 1
        return function(stepCount) {
            return (1 - Math.cos(coefficient * stepCount)) / 2;
        };
    };

    var smoothScroll = function(ele, params) {
        // Using Object.assign to set default params
        var params = assign({}, {
            offset: 0,
            onScrollFinished: null,
            getEasingFunction: getDefaultEasingFunction
        }, params);

        var offset = params.offset;
        var getEasingFunction = params.getEasingFunction;
        var onScrollFinished = params.onScrollFinished;
        var targetPosition = getScrollTargetPosition(ele, offset);
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
        var roundingSize = 2;
        var scrollNotFinished;

        // Depending on if we are scrolling down or up,
        // we create a scrollNotFinished function to use as
        // our conditional when doing the raf loop
        if (targetPosition < 0) {
            scrollNotFinished = function() {
                return window.pageYOffset < (targetY - roundingSize) && !scrollWheelTouched;
            };
        } else {
            scrollNotFinished = function() {
                return window.pageYOffset > (targetY + roundingSize) && !scrollWheelTouched;
            };
        }

        var easingFunc = getEasingFunction(targetPosition);

        // Where the loop actually starts
        var step = function() {
            if (scrollNotFinished()) {
                stepCount++;
                window.scrollTo(0, (initScrollHeight - targetPosition * easingFunc(stepCount)));
                requestAnimationFrame(step);
            } else if (onScrollFinished) {
                onScrollFinished(scrollWheelTouched);
            }
        };
        requestAnimationFrame(step);

    };

    /*istanbul ignore next*/
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
