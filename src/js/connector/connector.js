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
    };

    C.prototype = new EventTarget();
    C.prototype.constructor = C;

    C.prototype.fireMoveEvent = function (x, y) {
        // adjust from canvas-relative coordinates to div#content -relative coordinates
        this.fire({
            x: x + parseInt(this.canvas.style.left, 10),
            y: y + parseInt(this.canvas.style.top, 10),
            type: 'move'
        });
    };

    C.prototype.draw = function (animated) {

        if (typeof animated === 'undefined') {
            animated = true;
        }

        var src = this.src,
            dest = this.dest,
            parentEl = this.parentEl,
            me = this,
            getRelPosition = DomUtil.getRelPosition;

        var srcPosition = getRelPosition(src, parentEl),
            destPosition = getRelPosition(dest, parentEl);

        var srcX = srcPosition[0] + src.offsetWidth + style.marginLeft;
        var srcY = srcPosition[1] + (src.offsetHeight / 2);

        var destX = destPosition[0] + (dest.offsetWidth / 2);
        var destY = destPosition[1] + (dest.offsetHeight / 2);

        var top = Math.min(destY, srcY);
        var left = Math.min(destX, srcX);
       
        var MARGIN = 5;

        srcX -= left - MARGIN;
        destX -= left;
        srcY -= top - MARGIN;
        destY -= top;

        var canvas = this.canvas = document.createElement('canvas');
        canvas.height = Math.abs(destY - srcY) + (MARGIN * 2);
        canvas.width = Math.abs(destX - srcX) + (MARGIN * 2);
        canvas.style.position = 'absolute';
        canvas.style.top = top - MARGIN + 'px';
        canvas.style.left = left - MARGIN + 'px';
        parentEl.appendChild(canvas);
        this.ctx = canvas.getContext('2d');

        this.line = new AnimatedPolyline({
            segments: [
                new Point(srcX, srcY),
                new Point(srcX + 20, srcY),
                new Point(destX, destY)
            ],
            ctx: this.ctx,
            callback: function(o) {
                me.fire('completed');  
            },
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
