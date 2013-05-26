/*
 *  Perform any initialization of scripts we need, specific to homepage
 */

/*global document:false, Connector:false, skrollr:false, window:true*/

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
    var activeSection;
    var activeConnector;

    var activateSection = function () {
        var section = this;
        var figure = section.getElementsByTagName('figure');
        if (!figure.length) return;

        // don't listen on sections that contain articles (we listen to the articles themselves)
        if (section.tagName.toLowerCase() === 'section' && section.getElementsByTagName('article').length) {
            return;
        }

        activeSection = section;

        figure = figure[0];

        var ACTIVE = 'active';
        for (var i = 0, ilen = sections.length; i < ilen; i++) {
            sections[i].className = sections[i].className.replace(ACTIVE, '');
        }
        section.className += ' ' + ACTIVE;

        var MARGIN = 20;
        figure.style.top = (document.body.scrollTop + document.documentElement.clientHeight - figure.offsetHeight - MARGIN) + 'px';

        var unicorn = $('unicorn'),
            unicornHeight = unicorn.offsetHeight,
            unicornWidth = unicorn.offsetWidth;

        var title = section.getElementsByTagName('h3');
        if (!title.length) {
            title = section.getElementsByTagName('h2');
        }
        title = title[0];

        if (activeConnector) {
            activeConnector.line.stopDrawing();
        }

        activeConnector = new Connector({
            parentEl: $('content'),
            src: title,
            dest: figure,
            style: {
                marginRight: 50,
                marginLeft: 5
            }
        });
        activeConnector.addListener("move", function (e) {
            if (window.getComputedStyle(unicorn).getPropertyValue('visibility') === 'hidden') {
                unicorn.style.visibility = 'visible';
            }
            unicorn.style.top = e.y - (unicornHeight / 2) + 'px';
            unicorn.style.left = e.x - (unicornWidth / 2) + 'px';
        });
        activeConnector.addListener("cleared", function (e) {
            unicorn.style.visibility = 'hidden';
            activeSection.className = activeSection.className.replace('active', '');
        });

        activeConnector.draw();
    };

    for (var i = 0, ilen = sections.length; i < ilen; i++) {
        sections[i].addEventListener('click', activateSection);
    }

    window.addEventListener("scroll", function () {
        
    });

}());
