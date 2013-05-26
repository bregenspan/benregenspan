/*   Connector draws a line between two DOM elements using <canvas>.
 *
 *   Usage:
 *
 *   var c = new Connector(document.getElementById('mySource'), document.getElementById('myTarget'));
 *   c.draw();
 *
 *   TODO: support choice of source and target edges. For now, left and right edges are used.
 */

/*global Point, AnimatedPolyline, document, console*/

var Connector = (function (Point, AnimatedPolyline) {
    'use strict';

    var margin = 5;

    function getRelPosition(node, ancestor) {     
        var top = 0,
            left = 0;

        while (node) {
           if (node.tagName) {
               top = top + node.offsetTop;
               left = left + node.offsetLeft;
               node = node.offsetParent;
           } else {
               node = node.parentNode;
           }
           if (node === ancestor) {
               node = null;
           }
        }

        return [left, top];
    }

    var C = function (parentEl, src, dest) {
        this.src = src;
        this.dest = dest;
        this.parentEl = parentEl;

        parentEl.style.background = '-webkit-canvas(connectorCtx)';

        this.ctx = document.getCSSCanvasContext('2d', 'connectorCtx', 1000, 1000);
        
    };

    C.prototype.draw = function () {
        var src = this.src,
            dest = this.dest,
            ctx = this.ctx;

        var srcPosition = getRelPosition(src, this.parentEl),
            destPosition = getRelPosition(dest, this.parentEl);

        var srcX = srcPosition[0] + src.offsetWidth + margin;
        var srcY = srcPosition[1] + (src.offsetHeight / 2);
        
        var destX = destPosition[0];
        var destY = destPosition[1] + (dest.offsetHeight / 2);

        var line = new AnimatedPolyline([
            new Point(srcX, srcY),
            new Point(destX, destY)
        ], ctx);
        line.draw();

    };

    return C;

}(Point, AnimatedPolyline));
