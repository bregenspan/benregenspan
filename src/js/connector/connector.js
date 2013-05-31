/*   Connector draws a line between two DOM elements using <canvas>.
 *
 *   Usage:
 *
 *   var c = new Connector(document.getElementById('mySource'),
 *                         document.getElementById('myTarget'));
 *   c.draw();
 *
 *   TODO: support choice of source and target edges. For now, left and right edges are used.
 */

/*global DomUtil, EventTarget, Point, AnimatedPolyline, document, window, console*/

var Connector = (function (DomUtil, EventTarget, Point, AnimatedPolyline) {
    'use strict';

    var style = {
        'marginLeft': 5,
        'marginRight': 50
    };

    var C = function (prefs) {

        var parentEl = prefs.parentEl;
        var src = prefs.src;
        var dest = prefs.dest;
        prefs.style = prefs.style || {};
        for (var option in prefs.style) {
            style[option] = prefs.style[option];
        }

        EventTarget.call(this);

        this.src = src;
        this.dest = dest;
        this.parentEl = parentEl;

        // TODO: handle browser resize
        var de = document.documentElement,
            canvasWidth = de.clientWidth,
            canvasHeight = this.canvasHeight = de.clientHeight * 3;

        // TODO: fallback to imageURL for older browsers / IE
        if (document.getCSSCanvasContext) {
            // Webkit
            this.ctx = document.getCSSCanvasContext('2d', 'connectorCtx',
                    canvasWidth, canvasHeight);
            parentEl.style.background = '-webkit-canvas(connectorCtx)';
            parentEl.style.backgroundRepeat = 'no-repeat';
        } else {
            // Mozilla
            var canvas = document.createElement('canvas');
            canvas.id = 'connectorCanvas';
            canvas.height = canvasHeight;
            canvas.width = canvasWidth;

            // For some reason, the element that's used as background has to be added
            // to the DOM.  So we add, but position offscreen.
            canvas.style.position = 'absolute';
            canvas.style.top = '-10000px';
            canvas.style.left = '-10000px';

            document.body.appendChild(canvas);
            this.ctx = canvas.getContext('2d');
            parentEl.style.background = '-moz-element(#connectorCanvas)';
            parentEl.style.backgroundRepeat = 'no-repeat';
        }

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
        //this.fire('cleared');
        if (this.line) {
            this.line.stopDrawing();
        }
        this.ctx.clearRect(0, 0, document.documentElement.clientWidth, this.canvasHeight);
        this.canvasOffset = document.body.scrollTop;
        this.parentEl.style.backgroundPosition = "0 " + this.canvasOffset + "px";

        if (this.line) {
            this.draw(false);
        }
    };

    C.prototype.fireMoveEvent = function (x, y) {

        // adjust from canvas-relative coordinates to div#content -relative coordinates
        this.fire({
            x: x,
            y: y + this.canvasOffset,
            type: 'move'
        });
    };

    C.prototype.draw = function (animated) {

        if (typeof animated === 'undefined') {
            animated = true;
        }

        var src = this.src,
            dest = this.dest,
            ctx = this.ctx,
            me = this,
            getRelPosition = DomUtil.getRelPosition;

        var srcPosition = getRelPosition(src, this.parentEl),
            destPosition = getRelPosition(dest, this.parentEl);

        var srcX = srcPosition[0] + src.offsetWidth + style.marginLeft;
        var srcY = (srcPosition[1] + (src.offsetHeight / 2)) - this.canvasOffset;

        var destX = destPosition[0] - style.marginRight;
        var destY = (destPosition[1] + (dest.offsetHeight / 2)) - this.canvasOffset;

        this.line = new AnimatedPolyline({
            segments: [
                new Point(srcX, srcY),
                new Point(srcX + 20, srcY),
                new Point(destX, destY)
            ],
            ctx: ctx,
            callback: null,
            moveCallback: function (o) {
                if (o.animated) {
                    me.fireMoveEvent(o.x, o.y);
                }
            }
        });
        this.line.draw(animated);
    };

    return C;

}(DomUtil, EventTarget, Point, AnimatedPolyline));
