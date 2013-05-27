var ScrollNav = (function () {

    function $(id) { return document.getElementById(id); }

    var ACTIVE = 'active';
    var MARGIN = 20;

    // Custom scroll-driven effects
    var ScrollNav = function (sections) {
        var self = this;
        this.sections = sections;
        this.activeSession = undefined;
        this.activeConnector = undefined;

        var activateSection = function (e) {
            self.activateSection(this);
        };
        this.foreachSection(function (section) {
            section.addEventListener('click', activateSection);
        });

        window.setTimeout(function () {
            self.activateSection($('about'));
        }, 1000);

        window.addEventListener("scroll", function () {
            // TODO: handle activating sections on-scroll here 
        });
    };

    ScrollNav.prototype.foreachSection = function (func) {
        for (var i = 0, ilen = this.sections.length; i < ilen; i++) {
            func.call(null, this.sections[i]);
        }
    };

    ScrollNav.prototype.activateSection = function (section) {
        var self = this;
        var figure = section.getElementsByTagName('figure');
        if (!figure.length) return;

        // don't listen on sections that contain articles (we listen to the articles themselves)
        if (section.tagName.toLowerCase() === 'section' && section.getElementsByTagName('article').length) {
            return;
        }

        this.activeSection = section;

        figure = figure[0];

        this.foreachSection(function (section) {
            section.className = section.className.replace(ACTIVE, '');
        });
        section.className += ' ' + ACTIVE;

        figure.style.top = (document.body.scrollTop + document.documentElement.clientHeight - figure.offsetHeight - MARGIN) + 'px';

        var unicorn = $('unicorn'),
            unicornHeight = unicorn.offsetHeight,
            unicornWidth = unicorn.offsetWidth;

        var title = section.getElementsByTagName('h3');
        if (!title.length) {
            title = section.getElementsByTagName('h2');
        }
        title = title[0];

        if (this.activeConnector) {
            this.activeConnector.line.stopDrawing();
        }

        this.activeConnector = new Connector({
            parentEl: $('content'),
            src: title,
            dest: figure,
            style: {
                marginRight: 50,
                marginLeft: 5
            }
        });
        this.activeConnector.addListener("move", function (e) {
            if (window.getComputedStyle(unicorn).getPropertyValue('visibility') === 'hidden') {
                unicorn.style.visibility = 'visible';
            }
            unicorn.style.top = e.y - (unicornHeight / 2) + 'px';
            unicorn.style.left = e.x - (unicornWidth / 2) + 'px';
        });
        this.activeConnector.addListener("cleared", function (e) {
            unicorn.style.visibility = 'hidden';
            self.activeSection.className = self.activeSection.className.replace('active', '');
        });

        this.activeConnector.draw();
    };

    return ScrollNav;

}());
