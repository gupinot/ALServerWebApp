import React, { PropTypes } from 'react'
import dc from 'dc'
import { allChartFilters } from '../utils/crossfilter-server'
import { Pie, RowChart, Datalist, BarChart }  from '../components/charts'
import { Panel } from '../components/panels'
import { Titlebar } from '../components/navigation'

class Servers extends React.Component {

  static propTypes = {
    data: PropTypes.object,
    servers: PropTypes.array,
    chartUpdate: PropTypes.number,
    dimensions: PropTypes.object,
    groups: PropTypes.object,
    actions: PropTypes.object,
    location: PropTypes.object,
    width: PropTypes.number,
    colors: PropTypes.array,
    sites: PropTypes.object,
    margins: PropTypes.object
  };

  static defaultProps = {
    width: 960,
    colors: ['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'],
    margins: {top: 20, left: 10, right: 10, bottom: 20},
    widthHints: { dt: 0.70, l7_proto_name: 0.25 }
  };

  constructor(props,context) {
    super(props,context)
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
    this._refreshList()
  }

  _refreshList() {
    const allFilters = allChartFilters()
    this.props.actions.fetchList(allFilters)
  }

  _refresh() {
    dc.events.trigger(this._refreshList.bind(this))
  }

  handleServerClick(d) {
    const path = this.props.location.pathname
    this.props.routing.push(path+'/'+d.host_name.toLowerCase())
  }

  handleReset(e) {
    e.preventDefault()
    for (let d in this.props.dimensions) {
      this.props.dimensions[d].filterAll()
    }
  }


  render () {
    const { dimensions, groups, data, servers, chartUpdate } = this.props
    const domain = [0,1000];

    const siteLabel = (sites,d) => {return sites[d.key] || 'Unknown'}
    return (
      <div className="content">
        <Titlebar title="All Servers" >
          <div className="pure-button pure-button-primary" onClick={this.handleReset.bind(this)}>Reset</div>
        </Titlebar>
        <div ref="chart" className="chart">
          <Panel>
            <div>
              <div style={{flex:'1 0 30%', display: 'flex', flexDirection:'row'}}>
                <Pie title="Server Size" update={chartUpdate}
                     dimension={dimensions['size']} group={groups['size']}
                     width={200} height={200}
                />
                <RowChart title="Operating System" maxItems={10} update={chartUpdate}
                          dimension={dimensions['os_name']} group={groups['os_name']}
                          width={200} height={250}
                />
                <RowChart title="Server subfunction" maxItems={10} update={chartUpdate}
                          dimension={dimensions['subfunction']} group={groups['subfunction']}
                          width={200} height={250}
                />
                <RowChart title="Server site" maxItems={10} update={chartUpdate}
                          dimension={dimensions['site_code']} group={groups['site_code']}
                          width={200} height={250}
                />
              </div>
              <div style={{flex:'1 0 30%', display: 'flex', flexDirection:'row'}}>
                  <BarChart title="Total disk capacity" maxItems={30} domain={dimensions['total_sum']._range}
                            dimension={dimensions['total_sum']} group={groups['total_sum']}
                            yLabel="Count" xLabel="Capacity (GB)" update={chartUpdate}
                            width={400} height={150}
                  />
                  <BarChart title="Storage Availabity" maxItems={30} domain={dimensions['avail_percent_max']._range}  xUnit={5}
                            dimension={dimensions['avail_percent_max']} group={groups['avail_percent_max']}
                            yLabel="Count" xLabel="Availability (%)" update={chartUpdate}
                            width={400} height={150}
                  />
              </div>
            </div>
            <div>
              <Datalist data={servers || []}
                        columns={['site_code','ip','host_name','size','function','subfunction','os_name']}
                        handleClick={this.handleServerClick.bind(this)}
              />
            </div>
          </Panel>
        </div>
      </div>
    )
  }
}


export default Servers
