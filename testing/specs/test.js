"use strict";

describe("SimpleSmoothScroll", function() {

    var smoothScroll = window.smoothScroll;
    var roundingSize = 3;
    var container;

    fixture.setBase('testing/fixtures');

    beforeEach(function() {
        window.resizeTo(800, 600);
        // The first element is the style tag
        container = fixture.load('test.html')[1];
    });

    it("Sanity Check", function() {
        expect(true).toBe(true);
    });

    it("Should scroll to the top of the page if no element", function(done) {
        expect(window.pageYOffset).toEqual(0);
        window.scrollTo(0, 500);
        expect(window.pageYOffset).toEqual(500);
        var params = {
            onScrollFinished: function() {
                expect(window.pageYOffset).toBeLessThan(roundingSize);
                done();
            }
        };
        smoothScroll(null, params);
    });

    it("should scroll to an element", function(done) {
        expect(window.pageYOffset).toEqual(0);
        var testDiv = container.querySelector("#scrollDiv2");
        var params = {
            onScrollFinished: function() {
                var endingOffset = window.pageYOffset;
                var distanceFromTop = 200; // The height of each element is 200px
                // We only need to get within 5 for the scroll to stop
                expect(Math.abs(distanceFromTop - endingOffset)).toBeLessThan(roundingSize);
                done();
            }
        };
        smoothScroll(testDiv, params);
    });

    it("should factor in an offset with an element", function(done) {
        expect(window.pageYOffset).toEqual(0);
        var testDiv = container.querySelector("#scrollDiv3");
        var params = {
            offset: 30,
            onScrollFinished: function() {
                var endingOffset = window.pageYOffset;
                var distanceFromTop = 400 - 30; // The height of each element is 200px
                // We only need to get within 5 for the scroll to stop
                expect(Math.abs(distanceFromTop - endingOffset)).toBeLessThan(roundingSize);
                done();
            }
        };
        smoothScroll(testDiv, params);
    });

    it("should scroll up to an element", function(done) {
        window.scrollTo(0, 1000);
        expect(window.pageYOffset).toEqual(1000);
        var testDiv = container.querySelector("#scrollDiv4");
        var params = {
            onScrollFinished: function() {
                var endingOffset = window.pageYOffset;
                var distanceFromTop = 600; // The height of each element is 200px
                // We only need to get within 5 for the scroll to stop
                expect(Math.abs(distanceFromTop - endingOffset)).toBeLessThan(roundingSize);
                done();
            }
        };
        smoothScroll(testDiv, params);
    });

    it("should factor in the bottom of the page", function(done) {
        var testDiv = container.querySelector("#scrollDiv10");
        var params = {
            onScrollFinished: function() {
                // If the distance between the last element and the bottom
                // of the page is too great, you need to factor in the
                // window size and add it to the offset
                var endingOffset = window.pageYOffset;
                var distanceFromTop = 1800; // 200 * 10 - 1;
                // Since its a pain in the ass to reliably get the height
                // of the window and find a decent range, lets just
                // say that the distance is greater
                expect(Math.abs(distanceFromTop - endingOffset)).toBeGreaterThan(roundingSize);
                done();
            }
        };
        smoothScroll(testDiv, params);
    });

    it("should cancel the scroll on wheel event", function(done) {
        var testDiv = container.querySelector("#scrollDiv9");
        // Waiting a small handleful of milliseconds and then firing
        // the wheel event to cancel it
        setTimeout(function() {
            var event = new WheelEvent("wheel");
            window.dispatchEvent(event);
        }, 200);
        var params = {
            onScrollFinished: function(cancelled) {
                expect(cancelled).toBe(true);
                var endingOffset = window.pageYOffset;
                var distanceFromTop = 1600; // 200 * 9 - 1;
                // It shouldn't have gotten far in 200ms
                expect(Math.abs(distanceFromTop - endingOffset)).toBeGreaterThan(1000);
                done();
            }
        };
        smoothScroll(testDiv, params);
    });

    it("should allow a custom easing function", function(done) {
        var testDiv = container.querySelector("#scrollDiv4");
        var params = {
            getEasingFunction: function(targetPosition) {
                return function(stepCount) {
                    return stepCount * 0.01;
                }
            },
            onScrollFinished: function() {
                var endingOffset = window.pageYOffset;
                var distanceFromTop = 600; // The height of each element is 200px
                // It shouldn't have gotten far in 200ms
                expect(Math.abs(distanceFromTop - endingOffset)).toBeLessThan(roundingSize);
                done();
            }
        };
        smoothScroll(testDiv, params);
    });



    afterEach(function() {
        window.scrollTo(0, 0);
        fixture.cleanup();
    });
});
