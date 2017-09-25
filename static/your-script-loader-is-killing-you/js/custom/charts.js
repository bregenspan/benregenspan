/*global D3HarChart, document, Reveal, window*/

(function () {
    'use strict';

    var chart, chartContainer, mainWindow, stateTransitions;

    chartContainer = document.querySelector('.chart');

    chart = new D3HarChart(chartContainer, {
        firstPartyHosts: ['kinja.com', 'gawker.com', 'kinja-img.com', 'kinja-static.com']
    });

    chart.displayFile('chart-data/gawker.com.wpt.har.json', function () {

        window.harChart = chart; // for referencing of parent chart from presenter window

        // The current chart might be in the presenter window. If this looks like the case,
        // bubble item selection and deselection events up to the parent window.
        if (window.parent && window.parent.opener) {
            mainWindow = window.parent.opener;
            chart.on('itemSelected', function (element, data) {
                if (mainWindow.harChart) {
                    mainWindow.harChart.emit('itemSelected', mainWindow.document.getElementById(element.id), data);
                }
            });

            chart.on('itemDeselected', function (element) {
                if (mainWindow.harChart) {
                    mainWindow.harChart.emit('itemDeselected', mainWindow.document.getElementById(element.id));
                }
            });
        }

        chart.on('itemSelected', function () {
            Reveal.getCurrentSlide().classList.add('tooltip-open');
        });

        chart.on('itemDeselected', function () {
            Reveal.getCurrentSlide().classList.remove('tooltip-open');
        });

        // Registry of state transitions to handle. Used in place of
        //  Reveal.addEventListener(STATE_NAME); in order to have control
        //  over ordering of state change event firings for in/out
        //  transitions.
        stateTransitions = {
            'in': {},
            out: {}
        };

        function toClassName(state) {
            return state.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        }

        /**
         * Registers handlers for transitioning between slides that affect chart state.
         * Used in place of Reveal.addEventListener(STATE_NAME) to ensure that we can
         * fire changes in proper order (transition previous slide out first).
         *
         * @param {string} state - name of state change to listen to event for (will be prefixed with 'chart.')
         * @param {function} [transitionIn] - handler for transitioning to state
         * @param {function} [transitionOut] - handler for transitioning from state
         */
        function registerStateChange(state, transitionIn, transitionOut) {
            stateTransitions['in'][state] = transitionIn || function () {};
            stateTransitions.out[state] = transitionOut || function () {};
        }

        function handleStateChange(previousState, currentState) {
            if (currentState === previousState) {
                return;
            }

            if (previousState) {
                if (currentState && stateTransitions.out[previousState]) {
                    stateTransitions.out[previousState]();
                }
                chart.chartEl.classed(toClassName(previousState), false);
            }

            if (currentState) {
                if (stateTransitions['in'][currentState]) {
                    stateTransitions['in'][currentState]();
                }
                chart.chartEl.classed(toClassName(currentState), true);
            }
        }

        // Listen to slidechanged, rather than state changes, to work
        //  around event ordering issues.
        Reveal.addEventListener('slidechanged', function onSlideChanged(e) {
            handleStateChange(e.previousSlide.dataset.state, e.currentSlide.dataset.state);

            e.currentSlide.classList.remove('tooltip-open');  // remove any stray open-tooltip styling
        });

        /**
         * To use the same D3 chart in multiple slide stacks we swap it and a
         * placeholder if necessary.
         */
        function moveChartIfNeeded(currentSlide) {
            var topSlide = currentSlide,
                parentNode,
                chartPlaceholder;

            if (!currentSlide) {
                return;
            }

            parentNode = topSlide.parentNode;

            if (parentNode.tagName.toLowerCase() === 'section') {
                topSlide = parentNode;
            }

            chartPlaceholder = topSlide.querySelector('.chart-placeholder');
            if (chartPlaceholder) {
                // Replace placeholder with chart and chart with placeholder
                chartContainer.parentNode.insertBefore(chartPlaceholder.cloneNode(), chartContainer);
                chartPlaceholder.parentNode.insertBefore(chartContainer, chartPlaceholder);
                chartPlaceholder.parentNode.removeChild(chartPlaceholder);
            }
        }

        // See if we need to move the SVG chart over to the new slide
        Reveal.addEventListener('slidechanged', function onSlideChangedMoveSVG(e) {
            moveChartIfNeeded(e.currentSlide);
        });

        function resetZoom() {
            chart.zoomToItems();
        }

        registerStateChange('chartInitial', resetZoom);

        registerStateChange('chartHighlightScripts',
            function () {
                chart.zoomToItems(function (item) {
                    return (item.type === 'script');
                });
            },
            resetZoom);

        registerStateChange('chartZoomFirstparty',
            function () {
                chart.zoomToItems(function (item) {
                    return (item.tags.firstParty && !item.tags.stats);
                }, 0.1);
            }, resetZoom);

        registerStateChange('chartZoomFirstpartyImages',
            function () {
                chart.zoomToItems(function (item) {
                    return (item.tags.firstParty && !item.tags.stats && item.type === 'image');
                }, 0.1);
            }, resetZoom);

        registerStateChange('chartZoomFirstpartyIgnoreImages',
            function () {
                chart.zoomToItems(function (item) {
                    return (item.tags.firstParty && !item.tags.stats && item.type !== 'image');
                }, 0.1);
            }, resetZoom);

        registerStateChange('chartZoomMainScripts',
            function () {
                chart.zoomToItems(function (item) {
                    return Boolean(item.tags.mainScript);
                }, 0.1);
            }, resetZoom);

        moveChartIfNeeded(Reveal.getCurrentSlide());

        // Set an initial zoom on chart so we get a zoom-out effect when displaying it
        chart.zoomToItems(function (item) {
            return (item.tags.firstParty && !item.tags.stats && item.type !== 'image');
        }, 0.1);

        // Handle initial transition-in if we started on a slide with a state
        handleStateChange(null, Reveal.getCurrentSlide().dataset.state);
    });

}());
