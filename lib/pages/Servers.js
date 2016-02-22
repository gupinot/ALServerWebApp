import React, { PropTypes } from 'react'
import d3 from 'd3'
import dc from 'dc'
import { Pie, RowChart, Datalist, BarChart }  from '../components/charts'
import { Panel } from '../components/panels'
import { Titlebar } from '../components/navigation'

class Servers extends React.Component {

  static propTypes = {
    data: PropTypes.array,
    ndx: PropTypes.object,
    dimensions: PropTypes.object.isRequired,
    groups: PropTypes.object.isRequired,
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
    for (let d in this.props.dimensions) {
      this.props.dimensions[d].filterAll()
    }
    this.charts.forEach((c)=>c.resetSvg())
  }

  componentDidMount() {
    dc.renderAll()
  }

  componentWillReceiveProps(nextProps) {
    dc.renderAll()
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
    dc.renderAll()
  }

  render () {
    const { dimensions, groups, sites } = this.props

    const domain = d3.extent(
        dimensions['total_disk']
            .top(Infinity)
            .map((d)=>d.total_sum)
            .filter((k)=>k >= 0)
    )

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
                <Pie title="Server Size"
                     dimension={dimensions['size']} group={groups['size']}
                     width={200} height={200}
                />
                <RowChart title="Operating System" maxItems={10}
                          dimension={dimensions['os_name']} group={groups['os_name']}
                          width={200} height={250}
                />
                <RowChart title="Server subfunction" maxItems={10}
                          dimension={dimensions['subfunction']} group={groups['subfunction']}
                          width={200} height={250}
                />
                <RowChart title="Server site" maxItems={10}
                          dimension={dimensions['site_code']} group={groups['site_code']}
                          width={200} height={250}
                />
              </div>
              <div style={{flex:'1 0 30%', display: 'flex', flexDirection:'row'}}>
                <BarChart title="Total disk capacity" maxItems={30} domain={[0,1000]}
                          dimension={dimensions['total_disk']} group={groups['total_disk']}
                          yLabel="Count" xLabel="Capacity (GB)"
                          width={400} height={150}
                />
                <BarChart title="Storage Availabity" maxItems={30} domain={[0,100]}  xUnit={5}
                          dimension={dimensions['avail_percent']} group={groups['avail_percent']}
                          yLabel="Count" xLabel="Availability (%)"
                          width={400} height={150}
                />
              </div>
            </div>
            <div>
              <Datalist
                        dimension={dimensions['servers']} group={groups['all']} data={this.props.data}
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
