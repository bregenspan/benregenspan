/*
 *  Perform any initialization of scripts we need, specific to homepage
 */

/*global document:false, skrollr:false, window:true*/

(function () {
    'use strict';

    // Pretty Webfonts
    window.WebFontConfig = {
        google: { families: [ 'Open+Sans:400,600', 'Noto+Serif::latin'] }
    };
    (function() {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
          '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();

    // Stupid Pinterest widget
    (function(d){
        var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
        p.type = 'text/javascript';
        p.async = true;
        p.src = '//assets.pinterest.com/js/pinit.js';
        f.parentNode.insertBefore(p, f);
    }(document));
 
    // Nifty on-scroll effects
    skrollr.init();

}());
