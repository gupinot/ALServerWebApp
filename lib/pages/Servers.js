import React, { PropTypes } from 'react'
import d3 from 'd3'
import dc from 'dc'
import { Pie, RowChart, Datalist, BarChart }  from '../components/charts'
import { Panel } from '../components/panels'

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
      <div>
        <div ref="chart" className="content chart">
          <Panel>
            <div style={{flex:'3 0 75%', display: 'flex', flexDirection:'row'}}>
              <div>
                <Pie dimension={dimensions['size']} group={groups['size']}
                     width={200} height={200}
                />
                <Pie dimension={dimensions['function']} group={groups['function']}
                     width={200} height={200}
                />
                <Pie dimension={dimensions['os_name']} group={groups['os_name']}
                     width={200} height={200}
                />
              </div>
              <div>
                <RowChart maxItems={10}
                          dimension={dimensions['subfunction']} group={groups['subfunction']}
                          width={300} height={300}
                />
                <RowChart maxItems={10}
                          dimension={dimensions['site_code']} group={groups['site_code']}
                          width={300} height={300}
                />
              </div>
              <div>
                <BarChart maxItems={30} domain={[0,1000]}
                          dimension={dimensions['total_disk']} group={groups['total_disk']}
                          width={500} height={150}
                />
                <BarChart maxItems={30} domain={[0,100]}  xUnit={5}
                          dimension={dimensions['avail_percent']} group={groups['avail_percent']}
                          width={500} height={150}
                />
              </div>
            </div>
            <div>
              <Datalist maxItems={50}
                        dimension={dimensions['servers']} group={groups['all']}
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
