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

    dimensions.os_name = ndx.dimension((d)=>d.os_name.startsWith('Windows') ? 'Windows' : d.os_name)
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