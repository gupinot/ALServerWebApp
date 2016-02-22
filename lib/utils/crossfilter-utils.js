import crossfilter from 'crossfilter'
import * as constants from '../constants'

export function buildCrossfilter(ndxIn=null) {
    const axes=constants.MAIN_AXES
    const ndx = ndxIn || crossfilter()
    const dimensions = {}
    const groups = {}

    for (let g of axes) {
        dimensions[g] = ndx.dimension((d) => d[g])
        groups[g] = dimensions[g].group().reduceCount();
    }

    dimensions.os_name = ndx.dimension((d)=>normalizeOs(d.os_name))
    groups.os_name = dimensions.os_name.group().reduceCount();

    dimensions.servers = ndx.dimension((d)=>d.total_sum > 0);
    groups.all = (d) => 1

    dimensions.cpupower = ndx.dimension((d)=> {
        const num = (+d.cpu_core) * (+d.cpu_num)
        return (num === num) ? num : 0
    });
    groups.cpupower = dimensions.cpupower.group().reduceCount()

    dimensions.total_disk = ndx.dimension((d)=>Math.min(1000, d.total_sum - (d.total_sum % 10)))
    groups.total_disk = dimensions.total_disk.group().reduceCount()

    dimensions.avail_percent = ndx.dimension((d)=>d.avail_percent_max)
    groups.avail_percent = dimensions.avail_percent.group().reduceCount()

    dimensions.total = ndx.dimension((d)=>[d.size,d.subfunction])
    groups.total = dimensions.total.group().reduceSum((d)=>d.avail_sum)

    return {
        ndx: ndx,
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