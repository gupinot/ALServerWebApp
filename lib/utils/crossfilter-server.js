/*!
 * dc-addons v0.13.1
 *
 * 2016-04-08 11:34:39
 *
 */
import dc from 'dc';
const crossfilter = {dimensions:[]};

export function allChartFilters(name) {
    const allFilters = {}

    crossfilter.dimensions.forEach(dim => {
        var dimName = dim._name
        var type = dim._type
        if (type != 'all') {
            var chartFilters =  dim._filter
            if (type == 'range') {
                const range = dim._range
                const finalFilter = {}
                if (range[0] !== chartFilters[0]) finalFilter.gte = chartFilters[0];
                if (range[1] !== chartFilters[1]) finalFilter.lt = chartFilters[1];
                if (finalFilter !== {}) allFilters[dimName]=finalFilter;
            } else if (type == 'function') {
                for (let chart of dc.chartRegistry.list().filter(chart => chart.dimension() == dim)) {
                    const filter = chart.filter();
                    const data = chart.group()._currentData;
                    const values = data.map(d=>d.key).filter(chartFilters)

                    if (Array.isArray(values) && values.length > 0) {
                        if (filter.filterType === "TwoDimensionalFilter") {
                            dimName.split(',').forEach((attr, i) => {
                                allFilters[attr] = values.map(d=>d[i]);
                            })
                        } else {
                            allFilters[dimName] = values;
                        }
                    }
                }
            } else {
                if (Array.isArray(chartFilters) && chartFilters.length > 0)
                    allFilters[dimName]=chartFilters;
                else if (typeof chartFilters == 'string' && chartFilters.length > 0)
                    allFilters[dimName]=[chartFilters];
            }
        }});

    return allFilters;
}
//------------------------
// dimension
//------------------------

function _filterChanged () {
    var list = dc.chartRegistry.list();

    for (var e in list) {
        var chart = list[e];
        var group = chart.group();

        if (group) {
            group._filterChanged = true;
        }
    }
}

function _remote(fetch) {
    var obj = {
        _filterChanged: false,
        _inprogress: false,
        _currentData: [],
        init: function () {
            this._filterChanged=true;
        },
        all: function () {
            (_fetchData.bind(this))();
            return this._currentData;
        },
        top: function (limit) {
            (_fetchData.bind(this))();
            return this._currentData.slice(0,limit);
        },
        fetch: fetch
    };

    return obj;
};

crossfilter.dimension = (name) => {
    const obj = {
        _name: name,
        _type: 'all',
        _filter: {},
        filter: (f) => { obj._filter = f; obj._type='default';_filterChanged();},
        filterExact: (f) => { obj._filter = f; obj._type='exact';_filterChanged();},
        filterRange: (f) => { obj._filter = f; obj._type='range';_filterChanged();},
        filterFunction: (f) => { obj._filter = f; obj._type='function';_filterChanged();},
        filterAll: () => { obj._filter = null; obj._type='all';_filterChanged();}
    }
    crossfilter.dimensions.push(obj);
    return obj;
};
/*
 crossfilter.dimension.filter = _filterChanged;
 crossfilter.dimension.filterExact = _filterChanged;
 crossfilter.dimension.filterRange = _filterChanged;
 crossfilter.dimension.filterFunction = _filterChanged;
 crossfilter.dimension.filterAll = _filterChanged;
 */
//------------------------
// group
//------------------------

crossfilter.group = _remote;

function _fetchData () {
    const toRefresh = []
    const allFilters = allChartFilters();
    const _this = this

    dc.chartRegistry.list().forEach(chart => {
        const group = chart.group();
        if ((group === _this) && group._filterChanged && !group._inprogress) {
            group._filterChanged = false;
            group._inprogress = true;
            toRefresh.push(chart);
        }
    });
    toRefresh.forEach(chart => {
        console.log("Fetching group data for chart "+chart.chartID());
        _fetch(chart.group(), chart, allFilters, chart.chartID());
    })
}

function _fetch (group, chart, filters, chartId) {
    var dummyGroup = group;
    group.fetch(filters, chartId, function (data) {
        dummyGroup._currentData = data;
        dummyGroup._inprogress = false;
    });
}

//------------------------
// quicksort
//------------------------

crossfilter.quicksort = {};
crossfilter.quicksort.by = (sort) => (data) => data;

export default crossfilter;
