/*  Functional utilities.  This site doesn't need all of the power of
 *  e.g. underscore.js, so I'm picking and choosing functions
 *
 */
var FuncUtil = {

    // Underscore.js's implementation
    debounce: function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
};
