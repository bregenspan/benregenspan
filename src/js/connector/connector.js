/*   Connector draws a line between two DOM elements using <canvas>.
 *
 *   Usage:
 *
 *   var c = new Connector(document.getElementById('mySource'), document.getElementById('myTarget'));
 *   c.draw();
 *
 *   TODO: support choice of source and target edges. For now, left and right edges are used.
 */

/*global Point, AnimatedPolyline, document*/

var Connector = (function (Point, AnimatedPolyline) {
    'use strict';

    var C = function (src, dest) {
        this.src = src;
        this.dest = dest;
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'connector-canvas';
    };

    C.prototype.draw = function () {
        var src = this.src,
            dest = this.dest,
            canvas = this.canvas;

        var srcX = src.offsetLeft + src.offsetWidth;
        var srcY = src.offsetTop + (src.offsetHeight / 2);
        
        var destX = dest.offsetLeft;
        var destY = dest.offsetTop + (dest.offsetHeight / 2);

        canvas.offsetLeft = srcX;
        canvas.offsetTop = srcY;
        canvas.width = destX - srcX;
        canvas.height = destY - srcY;

        var line = new AnimatedPolyline([
            new Point(srcX, srcY),
            new Point(destX, destY)
        ], canvas.getContext('2d'));
        line.draw();
    };

    return C;

}(Point, AnimatedPolyline));
