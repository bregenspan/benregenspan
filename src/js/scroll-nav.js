/*global define, document, window*/

define(['underscore', 'dom-util', 'connector/connector'], function (_, DomUtil, Connector) {
    'use strict';

    var doc = document,
        bod = doc.body,
        win = window,
        getRelPosition = DomUtil.getRelPosition,
        $ = DomUtil.$,
        unicorn = $('unicorn'),
        unicornHeight = unicorn.offsetHeight,
        unicornWidth = unicorn.offsetWidth;

    var ACTIVE = 'active',
        ACTIVE_REGEX = new RegExp(ACTIVE + '\\w*'),
        COMPLETED = 'journey-completed',
        STARTED = 'journey-started',
        MARGIN = 20;

    // Custom scroll-driven effects
    var ScrollNav = function (sections) {
        var self = this;

        _.bindAll(this, 'redrawConnectors');

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
            if (!self.currentSection && !bod.scrollTop)
                self.activateSection($('about'));
        }, 1000);

        // Cache DOM positioning and size properties for sections
        function calculateSectionProperties () {
            for (var i = 0, ilen = self.sections.length; i < ilen; i++) {
                var section = self.sections[i],
                    posTop = section.offsetTop;
                section.setAttribute('data-offset-top', posTop);
                section.setAttribute('data-client-height', section.clientHeight);
            }
        }
        window.addEventListener("resize", _.debounce(calculateSectionProperties), 60);
        calculateSectionProperties();

        window.addEventListener("scroll", _.debounce(function () {
            var position = self.position(),
                height = self.browserHeight(),
                activatePosition = position + (height / 2.5);

            for (var i = 0, ilen = self.sections.length; i < ilen; i++) {
                var section = self.sections[i],
                    posTop = parseInt(section.getAttribute('data-offset-top'), 10),
                    posBottom = posTop + parseInt(section.getAttribute('data-client-height'), 10);

                if (activatePosition < posBottom && activatePosition > posTop) {
                    if (self.activateSection(section))
                        break;
                }
            }
        }, 90));
    };

    ScrollNav.prototype.position = function () {
        return win.pageYOffset || bod.scrollTop;
    };

    ScrollNav.prototype.browserHeight = function () {
        return win.innerHeight|| doc.documentElement.clientHeight|| bod.clientHeight;
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

    ScrollNav.prototype.getConnector = function (section) {
        var self = this,
            title = this.getChildByTagName('h3') || this.getChildByTagName('h2'),
            figure = this.getFigureForSection(section),
            connector = section.connector;

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

        connector.addListener("move", function (e) {
            if (unicorn.style.visibility === 'hidden') {
                unicorn.style.visibility = 'visible';
            }
            if (unicorn.className) {
                unicorn.className = '';
            }
            var translate = 'translate(' + (e.x - (unicornWidth / 2)) + 'px,' + (e.y - (unicornHeight / 2)) + 'px) translateY(0)';
            unicorn.style[DomUtil.getTransformPropertyName()] = translate;
        });

        connector.addListener("completed", function (e) {
            unicorn.className = COMPLETED;
            if (self.timeout) {
                window.clearTimeout(self.timeout);
            }
            self.timeout = window.setTimeout(function () {
                unicorn.style.display = 'none';
            }, 2000);
        });

        connector.addListener("cleared", function () {
            unicorn.style.visibility = 'hidden';
            if (!self.currentSection) return;
            self.currentSection.className = self.currentSection.className.replace('active', '');
        });

        section.connector = connector;
        return connector;
    };

    ScrollNav.prototype.showUnicorn = function () {
        unicorn.className = STARTED;
        unicorn.style.display = 'inline';
        if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    };

    ScrollNav.prototype.drawConnector = function () {
        this.activeConnector = this.getConnector(this.currentSection);
        this.showUnicorn();
        this.activeConnector.draw();
    };

    ScrollNav.prototype.redrawConnectors = function () {
        this.foreachSection(function (section) {
            var connector = section.connector;
            if (!connector) {
                return;
            }
            connector.clear();
            connector.draw();
        });
    };

    return ScrollNav;
});
