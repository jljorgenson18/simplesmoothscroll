"use strict";

(function() {
  // Syntax highlighting initialization
  window.hljs.initHighlighting();

  var smoothScroll = window.smoothScroll;
  var numberOfElements = 10;

  var hasScrolledToTop = false;

  var updateFirstCardWithThirdState = function() {
    var firstCard = document.getElementById('firstSection');
    firstCard.querySelector('p').innerHTML = 'You can also add an offset in a params object to give you and your element some space';
    firstCard.querySelector('.code-block-1').style.display = "none";
    firstCard.querySelector('.code-block-2').style.height = "auto";
    firstCard.querySelector('.code-block-2').style.visibility = "visible";
  };

  // First scroller
  document.getElementById('scroller1').addEventListener("click", function() {
    if (!hasScrolledToTop) {
      var nextCard = document.getElementById('secondSection');
      smoothScroll(nextCard);
    } else {
      var nextCard = document.getElementById('thirdSection');
      smoothScroll(nextCard, {
        offset: 30
      });
    }
  });

  // Second Scroller
  document.getElementById('scroller2').addEventListener("click", function() {
    hasScrolledToTop = true;
    updateFirstCardWithThirdState();
    smoothScroll();
  });


  // Third Scroller
  document.getElementById('scroller3').addEventListener("click", function() {
    var footer = document.querySelector('footer');
    smoothScroll(footer);
  });

  // Fourth Scroller
  document.getElementById('scroller4').addEventListener("click", function() {
    var nextCard = document.getElementById('fourthSection');
    smoothScroll(nextCard, {
      offset: 30
    });
  });

  document.getElementById('scroller5').addEventListener("click", function() {
    var nextCard = document.getElementById('finalSection');
    smoothScroll(nextCard, {
      getEasingFunction: function(targetPosition) {
        return function(stepCount) {
          return stepCount * 0.01;
        }
      }
    });
  });

})();
