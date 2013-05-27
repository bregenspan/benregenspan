var ScrollNav;

(function () {

    function $(id) { return document.getElementById(id); }

    var ACTIVE = 'active';
    var MARGIN = 20;

    // Custom scroll-driven effects
    ScrollNav = function (sections) {
        var self = this;
        this.sections = sections;
        this.activeSection = undefined;
        this.activeConnector = undefined;

        this.sectionActivateHandlers = {};
        this.sectionDeactivateHandlers = {};

        var activateSection = function () {
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

    ScrollNav.prototype.getFigureForSection = function (section) {
        var figure = section.getElementsByTagName('figure');
        if (!figure.length) return false;
        return figure[0];
    };

    ScrollNav.prototype.getChildByTagName = function (tagName) {
        var els = this.activeSection.getElementsByTagName(tagName);
        if (!els.length) return false;
        return els[0];
    };

    ScrollNav.prototype.activateSection = function (section) {
        if (!section || section === this.activeSection) return;
        var self = this;
        var figure = this.getFigureForSection(section);
        if (!figure && !this.hasHandlerForSection(section)) return;

        // don't listen on sections that contain articles (we listen to the articles themselves)
        if (section.tagName.toLowerCase() === 'section' && section.getElementsByTagName('article').length) {
            return;
        }

        // Deactivate last section
        if (this.activeSection) {
            this.callSectionHandler(true);
        }

        this.activeSection = section;

        this.foreachSection(function (section) {
            section.className = section.className.replace(ACTIVE, '');
        });
        section.className += ' ' + ACTIVE;

        if (figure) {
            figure.style.top = (document.body.scrollTop + document.documentElement.clientHeight - figure.offsetHeight - MARGIN) + 'px';
            this.drawConnector();
        }

        this.callSectionHandler();
    };

    ScrollNav.prototype.addHandler = function (sectionId, activateHandler, deactivateHandler) {
        this.sectionActivateHandlers[sectionId] = activateHandler;
        this.sectionDeactivateHandlers[sectionId] = deactivateHandler;
    };

    ScrollNav.prototype.hasHandlerForSection = function (section) {
        if (typeof this.sectionActivateHandlers[section.id] === 'function') {
            return true;
        }
        return false;
    };

    ScrollNav.prototype.callSectionHandler = function (deactivate) {
        var section = this.activeSection,
            id = section.id;

        var handlers = this.sectionActivateHandlers;
        if (deactivate) {
            handlers = this.sectionDeactivateHandlers;
        }
        if (typeof handlers[id] === 'function') {
            handlers[id].call(null, section);
        }
    };

    ScrollNav.prototype.drawConnector = function () {
        var title = this.getChildByTagName('h3') || this.getChildByTagName('h2');
        var figure = this.getFigureForSection(this.activeSection);

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

        var unicorn = $('unicorn'),
            unicornHeight = unicorn.offsetHeight,
            unicornWidth = unicorn.offsetWidth;
        
        this.activeConnector.addListener("move", function (e) {
            if (window.getComputedStyle(unicorn).getPropertyValue('visibility') === 'hidden') {
                unicorn.style.visibility = 'visible';
            }
            unicorn.style.top = e.y - (unicornHeight / 2) + 'px';
            unicorn.style.left = e.x - (unicornWidth / 2) + 'px';
        });
        this.activeConnector.addListener("cleared", function (e) {
            unicorn.style.visibility = 'hidden';
            if (!self.activeSection) return;
            self.activeSection.className = self.activeSection.className.replace('active', '');
        });

        this.activeConnector.draw();
    };

}());
