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

  afterEach(function() {
    window.scrollTo(0, 0);
    fixture.cleanup();
  });

  it("Sanity Check", function() {
    expect(true).to.be.true;
  });

  it("Should scroll to the top of the page if no element", function(done) {
    // Arrange
    window.scrollTo(0, 500);

    // Act
    smoothScroll(null, {
      onScrollFinished: function() {
        // Assert
        expect(window.pageYOffset).to.be.below(roundingSize);
        done();
      }
    });

  });

  it("should scroll to an element", function(done) {
    // Arrange
    var testDiv = container.querySelector("#scrollDiv2");

    // Act
    smoothScroll(testDiv, {
      onScrollFinished: function() {
        var endingOffset = window.pageYOffset;
        var distanceFromTop = 200; // The height of each element is 200px
        // Assert
        expect(Math.abs(distanceFromTop - endingOffset)).to.be.below(roundingSize);
        done();
      }
    });
  });

  it("should factor in an offset with an element", function(done) {
    // Arrange
    var testDiv = container.querySelector("#scrollDiv3");

    // Act
    smoothScroll(testDiv, {
      offset: 30,
      onScrollFinished: function() {
        var endingOffset = window.pageYOffset;
        var distanceFromTop = 400 - 30; // The height of each element is 200px
        // Assert
        expect(Math.abs(distanceFromTop - endingOffset)).to.be.below(roundingSize);
        done();
      }
    });
  });

  it("should scroll up to an element", function(done) {
    // Arrange
    window.scrollTo(0, 1000);
    var testDiv = container.querySelector("#scrollDiv4");

    //Act
    smoothScroll(testDiv, {
      onScrollFinished: function() {
        var endingOffset = window.pageYOffset;
        var distanceFromTop = 600; // The height of each element is 200px
        // Assert
        expect(Math.abs(distanceFromTop - endingOffset)).to.be.below(roundingSize);
        done();
      }
    });
  });

  it("should factor in the bottom of the page", function(done) {
    // Arrange
    var testDiv = container.querySelector("#scrollDiv10");

    // Act
    smoothScroll(testDiv, {
      onScrollFinished: function() {
        // If the distance between the last element and the bottom
        // of the page is too great, you need to factor in the
        // window size and add it to the offset
        var endingOffset = window.pageYOffset;
        var distanceFromTop = 1800; // 200 * 10 - 1;
        // Since its a pain in the ass to reliably get the height
        // of the window and find a decent range, lets just
        // say that the distance is greater
        // Assert
        expect(Math.abs(distanceFromTop - endingOffset)).to.be.above(roundingSize);
        done();
      }
    });
  });

  it("should cancel the scroll on wheel event", function(done) {
    // Arrange
    var testDiv = container.querySelector("#scrollDiv9");
    // Waiting a small handleful of milliseconds and then firing
    // the wheel event to cancel it
    setTimeout(function() {
      var event = new WheelEvent("wheel");
      window.dispatchEvent(event);
    }, 200);

    // Act
    smoothScroll(testDiv, {
      onScrollFinished: function(cancelled) {
        expect(cancelled).to.be.true;
        var endingOffset = window.pageYOffset;
        var distanceFromTop = 1600; // 200 * 9 - 1;
        // It shouldn't have gotten far in 200ms
        // Assert
        expect(Math.abs(distanceFromTop - endingOffset)).to.be.above(1000);
        done();
      }
    });
  });

  it("should allow a custom easing function", function(done) {
    // Arrange
    var testDiv = container.querySelector("#scrollDiv4");

    // Act
    smoothScroll(testDiv, {
      getEasingFunction: function(targetPosition) {
        return function(stepCount) {
          return stepCount * 0.01;
        };
      },
      onScrollFinished: function() {
        var endingOffset = window.pageYOffset;
        var distanceFromTop = 600; // The height of each element is 200px
        // It shouldn't have gotten far in 200ms
        // Assert
        expect(Math.abs(distanceFromTop - endingOffset)).to.be.below(roundingSize);
        done();
      }
    });
  });

});
