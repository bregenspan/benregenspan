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

/*global define */

define(function (require) {
    'use strict';

    var DomUtil = require('dom-util'),
        EventTarget = require('lib/event_target'),
        Point = require('connector/point'),
        AnimatedPolyline = require('connector/polyline');

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
            canvasHeight = this.canvasHeight = de.clientHeight * 2;

        var canvas = this.canvas = document.createElement('canvas');
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;

        canvas.style.position = 'absolute';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        parentEl.appendChild(canvas);
        this.ctx = canvas.getContext('2d');

        this.setCanvasOffset();
    };

    C.prototype = new EventTarget();
    C.prototype.constructor = C;

    C.prototype.setCanvasOffset = function () {
        //this.fire('cleared');
        if (this.line) {
            this.line.stopDrawing();
        }
        this.ctx.clearRect(0, 0, document.documentElement.clientWidth, this.canvasHeight);
        this.canvasOffset = document.body.scrollTop;
        this.canvas.style.top = this.canvasOffset + "px";

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

});
