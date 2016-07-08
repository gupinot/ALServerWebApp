import React from 'react'
import { Table, Tr, Td } from 'reactable'
import { CounterBox } from '../components/panels'
import { BoxPlot, HeatmapChart, Datalist } from '../components/charts'
import { Titlebar } from '../components/navigation'
import { objectify, formatStorage } from '../utils/crossfilter-utils'
import { allChartFilters } from '../utils/crossfilter-server'
import dc from 'dc'

class Site extends React.Component {

  static propTypes = {
    dimensions: React.PropTypes.object,
    groups: React.PropTypes.object,
    routing: React.PropTypes.object,
    site: React.PropTypes.object,
    servers: React.PropTypes.array,
    chartUpdate: React.PropTypes.number,
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

  componentWillMount() {
    this.props.dimensions.site_code.filterExact(this.props.siteid)
  }

  componentDidMount() {
    const _this = this
    this.refresher = window.setInterval(()=>{
      for (let chart of dc.chartRegistry.list()) {
        chart.on("filtered", _this._refresh.bind(_this));
      }
    },1000);
    this._refreshSite()
  }

  _refreshSite() {
    this.props.dimensions.site_code.filterExact(this.props.siteid)
    const allFilters = allChartFilters()
    this.props.actions.fetchList(allFilters)
  }

  _refresh() {
    dc.events.trigger(this._refreshSite.bind(this))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siteid !== this.props.siteid) {
      this.props.dimensions.site_code.filterExact(this.props.siteid)
    }
  }

  handleServerClick(d) {
    this.props.routing.push('/servers/'+d.host_name.toLowerCase())
  }

  render () {
    const { dimensions, groups, site, servers, chartUpdate } = this.props
    return (
      <div className="content">
        <Titlebar title={site.name+ ' ('+site.id+')'} >
            <CounterBox value={formatStorage(site.storage_gb)} title="Total Capacity" />
            <CounterBox value={Math.round(1000*site.avail_percent)/10+' %'} title="Available storage" />
        </Titlebar>
        <div style={{display: 'flex',flexDirection:'row',flex:'1 0 100%'}}>
          <div>
            <Datalist name={this.props.name}  data={servers || site.servers || []}
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
                dimension={dimensions['size,subfunction']} group={groups['size,subfunction']} update={chartUpdate}
                width={600} height={400}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Site
