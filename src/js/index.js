/*
 *  Perform any initialization of scripts we need, specific to homepage
 */

/*global document:false, Connector:false, skrollr:false, ScrollNav:false, window:true*/

(function () {
    'use strict';

    var doc = document;

    function $(id) { return doc.getElementById(id); }

    // Pretty Webfonts
    window.WebFontConfig = {
        google: { families: [ 'Open+Sans:400,600', 'Noto+Serif::latin'] }
    };
    (function() {
        var wf = doc.createElement('script');
        wf.src = ('https:' == doc.location.protocol ? 'https' : 'http') +
          '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = doc.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();


    // Stupid Pinterest widget
    (function(d){
        var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
        p.type = 'text/javascript';
        p.async = true;
        p.src = '//assets.pinterest.com/js/pinit.js';
        f.parentNode.insertBefore(p, f);
    }(doc));


    // Pointless bottom progress bar, shows in mobile view
    var progressBar = doc.createElement('div');
    progressBar.className = 'doodad-track';
    var progressBarNub = doc.createElement('div');
    progressBarNub.className = 'doodad';
    progressBar.appendChild(progressBarNub);
    $('container').appendChild(progressBar);



    // Nifty on-scroll effects
    var title = $('title');
    title.setAttribute('data-0', 'opacity:1; top:22px; transform:rotate(9deg)');
    title.setAttribute('data-200', 'opacity:0; top:500px; transform:rotate(130deg);');

    var sidebar = $('sidebar');
    sidebar.setAttribute('data-0', 'top:120px');
    sidebar.setAttribute('data-200', 'top:10px');

    progressBarNub.setAttribute('data-0', 'left:0%');
    progressBarNub.setAttribute('data-end', 'left:100%');

    skrollr.init();




    var slice = Array.prototype.slice;
    var sections = slice.call(document.getElementsByTagName('section')).concat(slice.call(document.getElementsByTagName('article')));
    var nav = new ScrollNav(sections);




}());
