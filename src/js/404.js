/* global Point */

(function () {

    function offsetLetter(letter, offset) {
        var shiftedLetter = [];
        for (var i = 0, ilen = letter.length; i < ilen; i++) {
            shiftedLetter[i] = letter[i].clone();
            shiftedLetter[i].x = shiftedLetter[i].x + offset;
        }
        return shiftedLetter;
    }

    var FOUR = [
        new Point(0, 0),
        new Point(0, 50),
        new Point(100, 50),
        new Point(100, 0),
        new Point(100, 100)
    ];

    var ZERO = [
        new Point(0, 0),
        new Point(100, 0),
        new Point(100, 100),
        new Point(0, 100),
        new Point(0, 0)
    ];

    var word = [FOUR, ZERO, FOUR];
    var polylines = [];
    
    // amount to offset each letter
    var SPACING = 20;
    var LETTER_WIDTH = 100;
    var LETTER_HEIGHT = 100;

    var ctx = document.getElementById('canvas').getContext('2d');
    canvas.setAttribute('width', (LETTER_WIDTH + SPACING) * word.length - SPACING);
    canvas.setAttribute('height', LETTER_HEIGHT);

    var unicorn = document.getElementById('unicorn');
    unicorn.onload = function () {
        var paddingTop,
            paddingLeft;

        // IE 8 and below
        if (canvas.currentStyle) {
            paddingTop = parseInt(canvas.currentStyle.paddingTop, 10);
            paddingLeft = parseInt(canvas.currentStyle.paddingLeft, 10);
        // Modern browsers
        } else {
            var computedStyles = document.defaultView.getComputedStyle(canvas, null);
            paddingTop = parseInt(computedStyles.getPropertyValue('padding-top'), 10);
            paddingLeft = parseInt(computedStyles.getPropertyValue('padding-left'), 10);
        }

        // we assume symmetrical padding - top/bottom and left/right match
        var widthRatio = (canvas.offsetWidth - paddingLeft * 2) / canvas.width;
        var heightRatio = (canvas.offsetHeight - paddingTop * 2) / canvas.height;

        moveCallback = function (unicorn, o) {
            unicorn.style.top = (paddingTop + (heightRatio * o.y)) - unicorn.offsetHeight / 2 + 'px';
            unicorn.style.left = (paddingLeft + (widthRatio * o.x)) - unicorn.offsetWidth / 2 + 'px';
            unicorn.style.visibility = 'visible';
        };

        endCallback = function (unicorn) {
            unicorn.style.top = '110%';
            unicorn.style.left = '75%';
            unicorn.className += ' go-away-unicorn';
        };

        var unicorns = [];
        for (var i = 0, ilen = word.length, letter; i < ilen; i++) {
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
            for (var j = 0, jlen = polylines.length; j < jlen; j++) {
                polylines[j].draw(true);
            }
        }, 500);

    };
    if (unicorn.offsetHeight) {
        unicorn.onload();
        unicorn.onload = null;
    }

}());
