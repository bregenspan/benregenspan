import _ from 'underscore';
import Point from 'connector/point';
import AnimatedPolyline from 'connector/polyline';

function offsetLetter (letter, offset) {
  const shiftedLetter = [];
  for (let i = 0, ilen = letter.length; i < ilen; i++) {
    shiftedLetter[i] = letter[i].clone();
    shiftedLetter[i].x = shiftedLetter[i].x + offset;
  }
  return shiftedLetter;
}

const FOUR = [
  new Point(0, 0),
  new Point(0, 50),
  new Point(100, 50),
  new Point(100, 0),
  new Point(100, 100)
];

const ZERO = [
  new Point(0, 0),
  new Point(100, 0),
  new Point(100, 100),
  new Point(0, 100),
  new Point(0, 0)
];

const word = [FOUR, ZERO, FOUR];
const polylines = [];

// amount to offset each letter
const SPACING = 20;
const LETTER_WIDTH = 100;
const LETTER_HEIGHT = 100;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.setAttribute('width', (LETTER_WIDTH + SPACING) * word.length - SPACING);
canvas.setAttribute('height', LETTER_HEIGHT);

const unicorn = document.getElementById('unicorn');
unicorn.onload = function () {
  let paddingTop,
    paddingLeft;

  // IE 8 and below
  if (canvas.currentStyle) {
    paddingTop = parseInt(canvas.currentStyle.paddingTop, 10);
    paddingLeft = parseInt(canvas.currentStyle.paddingLeft, 10);
    // Modern browsers
  } else {
    let computedStyles = document.defaultView.getComputedStyle(canvas, null);
    paddingTop = parseInt(computedStyles.getPropertyValue('padding-top'), 10);
    paddingLeft = parseInt(computedStyles.getPropertyValue('padding-left'), 10);
  }

  // we assume symmetrical padding - top/bottom and left/right match
  const widthRatio = (canvas.offsetWidth - paddingLeft * 2) / canvas.width;
  const heightRatio = (canvas.offsetHeight - paddingTop * 2) / canvas.height;

  const moveCallback = function (unicorn, o) {
    unicorn.style.top = (paddingTop + (heightRatio * o.y)) - unicorn.offsetHeight / 2 + 'px';
    unicorn.style.left = (paddingLeft + (widthRatio * o.x)) - unicorn.offsetWidth / 2 + 'px';
    unicorn.style.visibility = 'visible';
  };

  const endCallback = function (unicorn) {
    unicorn.style.top = '110%';
    unicorn.style.left = '75%';
    unicorn.className += ' go-away-unicorn';
  };

  const unicorns = [];
  for (let i = 0, ilen = word.length, letter; i < ilen; i++) {
    letter = word[i];
    letter = offsetLetter(letter, i * (SPACING + LETTER_WIDTH));

    // copy a unicorn for this letter
    unicorns[i] = unicorn.cloneNode();
    unicorns[i].id = '';
    unicorn.parentNode.appendChild(unicorns[i]);

    polylines[i] = new AnimatedPolyline({
      segments: letter,
      ctx: ctx,
      callback: _.partial(endCallback, unicorns[i]),
      moveCallback: _.partial(moveCallback, unicorns[i]),
      strokeStyle: '#ff00ff',

      animateAmount: 2,
      lineWidth: 8
    });
  }

  // Have unicorns draw our 404 after some delay
  window.setTimeout(function () {
    canvas.className += ' loaded';
    for (let j = 0, jlen = polylines.length; j < jlen; j++) {
      polylines[j].draw(true);
    }
  }, 500);
};
if (unicorn.offsetHeight) {
  unicorn.onload();
  unicorn.onload = null;
}
