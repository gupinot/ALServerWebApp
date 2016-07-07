/*!
 * dc-addons v0.13.1
 *
 * 2016-04-08 11:34:39
 *
 */
import dc from 'dc';

const crossfilter = {};

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
        filter: () => { obj._type='default';_filterChanged();},
        filterExact: () => { obj._type='exact';_filterChanged();},
        filterRange: () => { obj._type='range';_filterChanged();},
        filterFunction: () => { obj._type='function';_filterChanged();},
        filterAll: () => { obj._type='all';_filterChanged();}
    }
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
    //var filters = dc.utils.getAllFilters();
    const toRefresh = []
    const allFilters = {}
    const _this = this

    dc.chartRegistry.list().forEach(chart => {
        var group = chart.group()
        var dim = chart.dimension()._name
        var type = chart.dimension()._type
        if (type != 'all') {
            var chartFilters =  chart.filters()
            if (type == 'range') {
                const range = chart.dimension()._range
                const finalFilter = {}
                if (range[0] !== chartFilters[0][0]) finalFilter.gte = chartFilters[0][0];
                if (range[1] !== chartFilters[0][1]) finalFilter.lt = chartFilters[0][1];
                if (finalFilter !== {}) allFilters[dim]=finalFilter;
            } else {
                if (Array.isArray(chartFilters) && chartFilters.length > 0) allFilters[dim]=chartFilters;
            }
        }

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
