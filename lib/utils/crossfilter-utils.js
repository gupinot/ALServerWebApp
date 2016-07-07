import crossfilter from './crossfilter-server';
import * as constants from '../constants'
import { store } from '../Root'
import * as actions from '../actions/application'

export function buildCrossfilter(ndxIn=null) {
    const axes=constants.MAIN_AXES.concat(['os_name','servers','cpupower','total_sum','avail_percent_max','total'])
    const ndx = ndxIn || crossfilter;
    const dimensions = {}
    const groups = {}
    const data = {}

    for (let g of axes) {
        dimensions[g] = ndx.dimension(g);
        groups[g] = ndx.group(function (filters, chartId, callback) {
            store.dispatch(actions.fetchData(g, filters, callback, chartId));
        });
        groups[g].init();
    }

    dimensions.total_sum._range= [0,10000]
    dimensions.avail_percent_max._range= [0,100]

    return {
        ndx: ndx,
        data: data,
        list: [],
        dimensions: dimensions,
        groups: groups
    }
}

export function objectify(acc,d) {
    acc[d.key] = d.value
    return acc;
}

export function formatStorage(d) {
    if (!d) return '-'
    const scales =['GB','TB','PB','ZB','EB']
    let scaleidx= 0, value = d
    while (value/1000 > 1) { value/=1000; scaleidx++ }

    return Math.round(value*100)/100+' '+scales[scaleidx]
}


export function normalizeOs(name) {
    if (name.startsWith('Windows Server')) {
        return name.replace(/^Windows.*\s([0-9]+).*/,'Windows Server $1')
    } else if (name.startsWith('Windows')) {
        return 'Windows other'
    } else if (name === '') {
        return 'Unknown';
    } else {
        return name;
    }

}