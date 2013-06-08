/*global window, _*/

var AnimatedPolyline = (function () {
    'use strict';

    var AnimatedPolyline = function (options) {
        options = options || {};
        this.options = {
            lineCap: 'round',
            strokeStyle: '#f1dbce',
            lineWidth: 4,
            
            animated: true,
            animateAmount: 4
        };
        _.extend(this.options, options);

        this.finished = false;
        this.segments = options.segments;
        this.ctx = options.ctx;
        this.callback = options.callback || function () {};
        this.moveCallback = options.moveCallback || function () {};

        // array index of beginning position of current segment
        this.currentSegmentIndex = 0;

        this.startSegment();
    };

    AnimatedPolyline.prototype.startSegment = function () {
        var idx = this.currentSegmentIndex,
            segments = this.segments;

        // Finish if we've exhausted our line segments
        if (this.currentSegmentIndex >= segments.length - 1) {
            this.finish();
            return;
        }

        this.currentPoint = segments[idx];
        this.nextPoint = segments[idx + 1];

        this.xDirection = true;
        this.yDirection = true;

        if (this.nextPoint.x - this.currentPoint.x < 0) {
            this.xDirection = false;
        }
        if (this.nextPoint.y - this.currentPoint.y < 0) {
            this.yDirection = false;
        }
    };

    AnimatedPolyline.prototype.draw = function (animated) {
        if (typeof animated !== 'undefined') {
            this.options.animated = animated;
        }
        this.finished = false;
        this.loop();
    };

    AnimatedPolyline.prototype.loop = function (lastRender) {

        if (this.finished) {
            return;
        }

        if (typeof lastRender === 'undefined') {
            lastRender = new Date().getTime();
        }

        var delta = new Date().getTime() - lastRender;
        this.renderTick(delta);
        lastRender = new Date().getTime();

        // set up our next frame
        var me = this;
        this.animRequest = window.requestAnimationFrame(function () {
            me.loop(lastRender);
        });
    };

    AnimatedPolyline.prototype.finish = function () {
        this.stopDrawing();
        this.callback();
    };

    AnimatedPolyline.prototype.stopDrawing = function () {
        this.finished = true;
        if (this.animRequest) {
            window.cancelAnimationFrame(this.animRequest);
            this.animRequest = null;
        }
    };

    /* Given an amount to move from the current position (unit = canvas coordinates),
     * return the new coordinates to move to.
     */
    AnimatedPolyline.prototype.getNextPosition = function (moveAmount) {
        var pos = this.currentPoint.clone(),
            targetPos = this.nextPoint.clone();

        if (!this.options.animated) {
            return targetPos;
        }

        var yDiff = Math.abs(targetPos.y - pos.y),
            xDiff = Math.abs(targetPos.x - pos.x);

        if (moveAmount > yDiff) {
            // amount we're about to move exceeds amount we need to
            pos.y = targetPos.y;
        } else if (this.yDirection && targetPos.y > pos.y) {
            pos.y += moveAmount;
        } else if (!this.yDirection && targetPos.y < pos.y) {
            pos.y -= moveAmount;
        }

        if (moveAmount > xDiff) {
            // amount we're about to move exceeds what we need to
            pos.x = targetPos.x;
        } else if (this.xDirection && targetPos.x > pos.x) {
            pos.x += moveAmount;
        } else if (!this.xDirection && targetPos.x < pos.x) {
            pos.x -= moveAmount;
        }
        return pos;
    };

    AnimatedPolyline.prototype.renderTick = function (delta) {

        if (this.finished) return;

        var options = this.options;
        var interval = 60 / 1000;
        var ctx = this.ctx;
        var targetPos = this.nextPoint;

        // `options.animateAmount`px / frame @ 60 target fps
        var moveAmount = delta * interval * options.animateAmount;

        var pos = this.currentPoint;

        if (!targetPos.equals(pos)) {
            ctx.save();
            ctx.beginPath();
            ctx.lineCap = options.lineCap;
            ctx.strokeStyle = options.strokeStyle;
            ctx.moveTo(pos.x, pos.y);

            pos = this.currentPoint = this.getNextPosition(moveAmount);

            //var radius = 75;
            //var startAngle = 1.1 * Math.PI;
            //var endAngle = 1.9 * Math.PI;
            //var counterClockwise = false;
            //context.arc(x, y, radius, startAngle, endAngle, counterClockwise);


            ctx.lineTo(pos.x, pos.y);
            ctx.lineWidth = options.lineWidth;
            ctx.stroke();
            ctx.restore();

            this.moveCallback({
                x: pos.x,
                y: pos.y,
                animated: options.animated
            });

        } else if (targetPos.equals(pos)) {
            this.currentSegmentIndex += 1;
            this.startSegment();
        }
    };

    return AnimatedPolyline;

}());
