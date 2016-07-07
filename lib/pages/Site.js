import React from 'react'
import { Table, Tr, Td } from 'reactable'
import { CounterBox } from '../components/panels'
import { BoxPlot, HeatmapChart, Datalist } from '../components/charts'
import { Titlebar } from '../components/navigation'
import { objectify, formatStorage } from '../utils/crossfilter-utils'
import dc from 'dc'

class Site extends React.Component {

  static propTypes = {
    dimensions: React.PropTypes.object,
    groups: React.PropTypes.object,
    site: React.PropTypes.object,
    routing: React.PropTypes.object,
    site: React.PropTypes.object,
    siteid: React.PropTypes.string
  };

  constructor(props) {
    super(props)
    this.charts=[]
  }

  componentWillUnmount() {
    window.clearInterval(this.refresher)
    for (let chart of dc.chartRegistry.list()) {
      chart.on("filtered", null);
    }
    for (let d in this.props.dimensions) {
      this.props.dimensions[d].filterAll()
    }
    this.charts.forEach((c)=>c.resetSvg())
  }

  componentDidMount() {
    const _this = this
    this.refresher = window.setInterval(()=>{
      for (let chart of dc.chartRegistry.list()) {
        chart.on("filtered", _this._refresh.bind(_this));
      }
    },1000);
    this.props.dimensions.site_code.filterExact(this.props.siteid)
    dc.renderAll()
    this._refreshSite()
  }

  _refreshSite() {
    const allFilters = {}
    dc.chartRegistry.list().forEach(chart => {
      var dim = chart.dimension()._name
      var chartFilters =  chart.filters()
      if (chartFilters.length > 0) {
        if (typeof chartFilters == 'object') {
          allFilters[dim] = chartFilters;
        } else {
          allFilters[dim] = [chartFilters];
        }
      }
    });
    this.props.actions.fetchSite(this.props.siteid,allFilters)
  }

  _refresh() {
    dc.events.trigger(this._refreshSite.bind(this))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteid !== this.props.siteid) {
      this.props.dimensions.site_code.filterExact(this.props.siteid)
    }
    dc.renderAll()
  }

  handleServerClick(d) {
    this.props.routing.push('/servers/'+d.host_name.toLowerCase())
  }

  render () {
    const { dimensions, groups, sites, id, site } = this.props
    return (
      <div className="content">
        <Titlebar title={site.name+ ' ('+site.id+')'} >
            <CounterBox value={formatStorage(site.storage_gb)} title="Total Capacity" />
            <CounterBox value={Math.round(1000*site.avail_percent)/10+' %'} title="Available storage" />
        </Titlebar>
        <div style={{display: 'flex',flexDirection:'row',flex:'1 0 100%'}}>
          <div>
            <Datalist name={this.props.name}  data={site.servers || []}
                   filterable={['host_name','ip','size','type','subfunction']}
                   columns={['host_name','ip','size','type','subfunction']}
                   sortable={true}
                   itemsPerPage={30}
                   handleClick={this.handleServerClick.bind(this)}
            >
            </Datalist>
          </div>
          <div style={{marginLeft:'auto'}}>
            <HeatmapChart
                dimension={dimensions.total} group={groups.total}
                width={600} height={400}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Site
