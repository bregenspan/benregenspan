/*global define, document, window*/

define(['underscore', 'dom-util', 'connector/connector'], function (_, DomUtil, Connector) {
    'use strict';

    var doc = document,
        win = window,
        getRelPosition = DomUtil.getRelPosition,
        $ = DomUtil.$;

    var ACTIVE = 'active',
        ACTIVE_REGEX = new RegExp(ACTIVE),
        MARGIN = 20;

    // Custom scroll-driven effects
    var ScrollNav = function (sections) {
        var self = this;
        this.sections = sections;
        this.currentSection = undefined;
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
            if (!self.currentSection && !document.body.scrollTop)
                self.activateSection($('about'));
        }, 1000);

        window.addEventListener("scroll", _.debounce(function () {
            var position = self.position();
            var height = self.browserHeight();
            var activatePosition = position + (height / 2.5);

            for (var i = 0, ilen = self.sections.length; i < ilen; i++) {
                var section = self.sections[i];
                var posTop = getRelPosition(section, document.body)[1];
                var posBottom = posTop + section.clientHeight;

                if (activatePosition < posBottom && activatePosition > posTop) {
                    if (self.activateSection(section))
                        break;
                }
            }
        }, 30));
    };

    ScrollNav.prototype.position = function () {
        return win.pageYOffset || doc.body.scrollTop;
    };

    ScrollNav.prototype.browserHeight = function () {
        return win.innerHeight|| doc.documentElement.clientHeight|| doc.body.clientHeight;
    };

    ScrollNav.prototype.foreachSection = function (func) {
        for (var i = 0, ilen = this.sections.length; i < ilen; i++) {
            func.call(null, this.sections[i]);
        }
    };

    // Return the main figure for the specified section
    ScrollNav.prototype.getFigureForSection = function (section) {
        var figure = section.getElementsByTagName('figure');
        if (!figure.length) return false;
        return figure[0];
    };

    // Get first child of the active section with the specified tag name
    ScrollNav.prototype.getChildByTagName = function (tagName) {
        var els = this.currentSection.getElementsByTagName(tagName);
        if (!els.length) return false;
        return els[0];
    };

    ScrollNav.prototype.activateSection = function (section) {

        // let's consider this a success; the section is already current
        if (section === this.currentSection) return true;

        // skip if section wasn't found or is already active
        if (!section || ACTIVE_REGEX.test(section.className)) {
            return false;
        }

        var figure = this.getFigureForSection(section);
        if (!figure && !this.hasHandlerForSection(section)) return false;

        // don't listen on sections that contain project sub-sections (we listen to the sub-sections)
        if (section.tagName.toLowerCase() === 'section' &&
                section.getElementsByClassName('project').length) {
            return false;
        }

        // Deactivate last section
        if (this.currentSection) {
            this.callSectionHandler(true);
        }

        this.currentSection = section;

        section.className = section.className.replace(ACTIVE, '');
        section.className += ' ' + ACTIVE;

        if (figure) {
            figure.style.top = (this.position() +
                    document.documentElement.clientHeight - figure.offsetHeight - MARGIN) + 'px';
            this.drawConnector();
        }

        this.callSectionHandler();
        return true;
    };

    ScrollNav.prototype.addStyleChanges = function (elements) {
        var processPref = function (element, styles, offset) {
           
        };
        for (var i = 0, ilen = elements.length; i < ilen; i++) {
            var elementPref = elements[i];
            var element = elementPref.el;
            _.each(elementPref, _.partial(processPref, element));
        }
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
        var section = this.currentSection,
            id = section.id;

        var handlers = this.sectionActivateHandlers;
        if (deactivate) {
            handlers = this.sectionDeactivateHandlers;
        }
        if (typeof handlers[id] === 'function') {
            handlers[id].call(null, section);
        }
    };

    ScrollNav.prototype.getConnector = function () {
        var section = this.currentSection,
            self = this,
            title = this.getChildByTagName('h3') || this.getChildByTagName('h2'),
            figure = this.getFigureForSection(this.currentSection),
            connector = section.getAttribute('data-connector');

        if (connector) {
            return connector;
        }

        connector = new Connector({
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

        connector.addListener("move", function (e) {
            if (window.getComputedStyle(unicorn).getPropertyValue('visibility') === 'hidden') {
                unicorn.style.visibility = 'visible';
            }
            unicorn.style.top = e.y - (unicornHeight / 2) + 'px';
            unicorn.style.left = e.x - (unicornWidth / 2) + 'px';
        });

        connector.addListener("cleared", function () {
            unicorn.style.visibility = 'hidden';
            if (!self.currentSection) return;
            self.currentSection.className = self.currentSection.className.replace('active', '');
        });

        self.currentSection.setAttribute('data-connector', connector);
        return connector;
    };

    ScrollNav.prototype.drawConnector = function () {
        this.activeConnector = this.getConnector();
        this.activeConnector.draw();
    };

    return ScrollNav;
});
