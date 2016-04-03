"use strict";

var getHeightOfEntirePage = function() {
    var body = document.body;
    var html = document.documentElement;

    return Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);
};

var getHeightOfWindow = function() {
    return ("innerHeight" in window) ? window.innerHeight : document.documentElement.offsetHeight;
};

// Finds the Y-coordinate of your target.
// Defaults to top of the page
var getTargetPosition = function(ele, offset) {
    if (!offset) {
        offset = 0;
    }
    if (ele) {
        return -ele.getBoundingClientRect().top + offset;
    } else {
        return window.scrollY;
    }
};

// This is the duration
// The sqrt is to move the duration closer to 1000ms
var getScrollStep = function(targetPosition) {
    return Math.PI / ((Math.sqrt(Math.abs(targetPosition) / 1000) * 1000) / 15);
};

var getScrollHeight = function() {
    return window.pageYOffset;
};

module.exports = function(ele, offset) {
    var targetPosition = getTargetPosition(ele, offset);
    var scrollStep = getScrollStep(targetPosition);
    var scrollHeight = getScrollHeight();
    var targetY = scrollHeight - targetPosition;
    var cosParameter = targetPosition / 2;
    var scrollCount = 0;
    var scrollMargin;
    var pageHeight = getHeightOfEntirePage();
    var heightOfWindow = getHeightOfWindow();

    var scrollWheelTouched = false;
    var onWheelListener = function(e) {
        scrollWheelTouched = true;
        window.removeEventListener("wheel", onWheelListener);
    };
    window.addEventListener("wheel", onWheelListener);
    // Once we get all of the required vars in the closure,
    // use setImmediate so we don't block the event queue.
    // Then, perform the scroll
    setImmediate(function() {
        if (targetPosition < 0) {
            var stepDownTo = function() {
                // Checks to see if we hit the bottom
                var atBottom = ((heightOfWindow + getScrollHeight()) === pageHeight);
                // Need the - 5 due to the asymptote
                if (getScrollHeight() < (targetY - 5) && !atBottom && !scrollWheelTouched) {
                    scrollCount = scrollCount + 1;
                    scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
                    window.scrollTo(0, (scrollHeight - scrollMargin));
                    requestAnimationFrame(stepDownTo);
                }
            };
            requestAnimationFrame(stepDownTo);
        } else {
            var stepUpTo = function() {
                // Need the + 5 due to the asymptote
                if (getScrollHeight() > (targetY + 5) && !scrollWheelTouched) {
                    scrollCount = scrollCount + 1;
                    scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
                    window.scrollTo(0, (scrollHeight - scrollMargin));
                    requestAnimationFrame(stepUpTo);
                }
            };
            requestAnimationFrame(stepUpTo);
        }
    });
};
