/*   Connector draws a line between two DOM elements using <canvas>.
 *
 *   Usage:
 *
 *   var c = new Connector(document.getElementById('mySource'), document.getElementById('myTarget'));
 *   c.draw();
 *
 *   TODO: support choice of source and target edges. For now, left and right edges are used.
 */

/*global EventTarget, Point, AnimatedPolyline, document, window, console*/

var Connector = (function (EventTarget, Point, AnimatedPolyline) {
    'use strict';

    var margin = 5;

    /* Get position of `node` relative to a
     * specified `ancestor` */
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

    var C = function (parentEl, src, dest, moveCallback) {
        this.src = src;
        this.dest = dest;
        this.parentEl = parentEl;

        this.moveCallback = moveCallback || function () {};

        // TODO: handle browser resize
        var de = document.documentElement;
        this.canvasHeight = de.clientHeight * 3;

        // FIXME: need FF fallback, + imageURL as background (no animation) fallback
        this.ctx = document.getCSSCanvasContext('2d', 'connectorCtx', de.clientWidth, this.canvasHeight);
        parentEl.style.background = '-webkit-canvas(connectorCtx)';
        parentEl.style.backgroundRepeat = 'no-repeat';
   
        this.setCanvasOffset();

        var me = this;

        var screensScrolled = 0;
        window.onscroll = function () {
            var scrolledOld = screensScrolled;
            screensScrolled = Math.floor(document.body.scrollTop / (de.clientHeight * 2));
            if (screensScrolled !== scrolledOld) {
                me.setCanvasOffset();
            }
        };
    };

    C.prototype = new EventTarget();
    C.prototype.constructor = C;


    // TODO - set on scroll every time full viewport * 2 is scrolled
    C.prototype.setCanvasOffset = function () {
        this.ctx.clearRect(0, 0, document.documentElement.clientWidth, this.canvasHeight);
        this.canvasOffset = document.body.scrollTop;
        this.parentEl.style.backgroundPosition = "0 " + this.canvasOffset + "px";
    };

    C.prototype.draw = function () {
        var src = this.src,
            dest = this.dest,
            ctx = this.ctx;

        var srcPosition = getRelPosition(src, this.parentEl),
            destPosition = getRelPosition(dest, this.parentEl);

        var srcX = srcPosition[0] + src.offsetWidth + margin;
        var srcY = (srcPosition[1] + (src.offsetHeight / 2)) - this.canvasOffset;
        
        var destX = destPosition[0];
        var destY = (destPosition[1] + (dest.offsetHeight / 2)) - this.canvasOffset;

        var line = new AnimatedPolyline([
            new Point(srcX, srcY),
            new Point(destX, destY)
        ], ctx, null, this.moveCallback);
        line.draw();
    };

    return C;

}(EventTarget, Point, AnimatedPolyline));
