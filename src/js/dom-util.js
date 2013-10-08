/*global define, document*/

define(['underscore'], function (_) {
    'use strict';

    var doc = document,
        body = doc.body;

    return {
        /*
         * Alias doc.getElementById
         */
        $: function (id) { return doc.getElementById(id); },

        /* 
         * Get position of `node` relative to a specified
         *      `ancestor`
         */
        getRelPosition: function (node, ancestor) {
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
        },

        /*
         * Get prefixed or un-prefixed name of "transform" property
         * in this browser.
         */
        getTransformPropertyName: _.memoize(function () {
            var prefixes = ['', 'webkit', 'moz', 'ms'],
                prefix,
                propertyName;
            for (var i = 0, ilen = prefixes.length; i < ilen; i++) {
                prefix = prefixes[i];
                propertyName = prefix + (prefix ? 'T' : 't') + 'ransform';
                if (typeof body.style[propertyName] !== 'undefined') {
                    return propertyName;
                }
            }
            return;
        })
    };
});
