/*global define*/

define(function () {
    'use strict';

    var Point = function (x, y) {
        this.x = x;
        this.y = y;
    };

    Point.prototype.greaterThan = function (point) {
        return (this.y > point.y || this.x > point.x);
    };

    Point.prototype.equals = function (point) {
        return (this.y === point.y && this.x === point.x);
    };

    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };

    return Point;

});
