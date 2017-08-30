var FilterableGraph = function (data, options) {
    var self = this;

    function initChart() {
        var chart = nv.models.multiBarHorizontalChart()
            .margin({top: 50, right: 20, bottom: 40, left: 120})
            .showControls(false)
            .x(function (d,i) {
                return d[self.idField];
            })
            .y(function (d,i) {
                return d[self.graphStat];
            });

        //chart.legend.maxKeyLength(100);

        chart.showLegend(false);
        chart.yAxis
            .tickFormat(d3.format(',f'))
            .ticks(1);

        chart.tooltip
            .chartContainer(document.getElementById('chart-container'))
            .gravity('e')
            .enabled(true);
        if (options.tooltip) {
            chart.tooltip.contentGenerator(options.tooltip);
        }
        return chart;
    }

    this.chart = initChart();

    this.groups = options.groups;
    this.records = data;
    this.idField = options.idField;
    this.title = options.title;
    this.setGroup(options.defaultGroup);
    this.graphStat = options.defaultStat;
};

FilterableGraph.prototype.setGroup = function (group) {
    this.group = group;
    this.filteredRecords = this.records.filter(function (row) {
        return (this.groups[group].indexOf(row[this.idField]) > -1);
    }.bind(this));
};

FilterableGraph.prototype.getGraphData = function () {
    var data = [{
        values: this.filteredRecords,
        title: this.title,
        bar: true,
        color: '#ccf'
    }];

    // For display purposes, initially set all rates at 0 (we'll animate up)
    data[0].values = data[0].values.map(function (row) {
        //row.displayRate = 0;
        row.displayRate = row.rate;
        return row;
    });

    return data;
};

FilterableGraph.prototype.refresh = function () {

    var data = this.getGraphData(),
        chart = this.chart,
        self = this,
        index = 0;

    if (this.activeAnimation) {
        window.clearTimeout(this.activeAnimation);
        delete this.activeAnimation;
    }

    data[0].values.sort(function (a, b) {
        return a[self.graphStat] > b[self.graphStat] ? 1 : -1;
    }) ;

    d3.select('#chart svg')
        .datum(data)
        .transition()
        .duration(0)
        .call(chart);

    //var XAxisLabels = d3.selectAll('#chart svg .nv-x text');

    // Animate-in chart data
    function showValue(isLast) {
        var item = data[0].values[index],
            labels,
            isLastRecord;

        item.displayRate = item.rate;

        d3.selectAll('#chart svg')
            .datum(data)
            .transition()
            .duration(0)
            .call(chart);

        labels = d3.selectAll('#chart svg .nv-x text')
            .attr('fill', 'black');

        /*
           if (isLast) {
           var rowLabel = labels
           .filter(function (d, i) {
           return i === index;
           })
           .attr('fill', 'red');

        // Not working...
        d3
        .select('#chart .nv-barsWrap rect')
        .filter(function (d, i) {
        return i === index;
        })
        .attr('fill', 'red');
        }*/

        index++;

        if (data[0].values[index]) {
            isLastRecord = (index ===  data[0].values.length - 1); // delay display of last, biggest value for dramatic effect
            self.activeAnimation = window.setTimeout(showValue.bind(null, isLastRecord), 100);
        }
    }
    showValue();

    // Update filter controls
    Array.prototype.slice.call(document.querySelectorAll('.filter-selector li')).forEach(function (el) {
        el.classList.toggle('active', (self.graphStat === el.dataset.filterStat || self.group === el.dataset.filterGroup));
    });

};

/**
 * Perform initial render of graph. You should only need to do this once -- use refresh() for subsequent renders
 * after e.g. changing data.
 */
FilterableGraph.prototype.render = function () {
    nv.addGraph(function () {
        var chart = this.chart,
            self = this,
            chartEl,
            title;

        this.refresh();

        // var maxRate = Math.max.apply(null, data[0].values.map(function (d) { return d.rate }));

        chartEl = document.getElementById('chart');
        title = document.createElement('h3');
        title.innerText = this.title;
        chartEl.insertBefore(title, chartEl.firstElementChild);

        nv.utils.windowResize(chart.update);

        Array.prototype.slice.call(document.querySelectorAll('.filter-selector')).forEach(function (el) {
            el.addEventListener('click', function (e) {
                if (e.target.dataset.filterGroup) {
                    self.setGroup(e.target.dataset.filterGroup);
                    self.refresh();
                }
                if (e.target.dataset.filterStat) {
                    self.graphStat = e.target.dataset.filterStat;
                    self.refresh();
                }
            });
        });

        return chart;

    }.bind(this));
};

