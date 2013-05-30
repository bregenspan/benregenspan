var DomUtil = {

    /*
     * Alias document.getElementById
     */
    $: function (id) { return document.getElementById(id); },

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
    }
};
