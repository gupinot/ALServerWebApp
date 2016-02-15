import React, { PropTypes } from 'react'
import d3 from 'd3'
import dc from 'dc'
import { HeatmapChart,Datalist }  from '../components/charts'
import { Panel } from '../components/panels'

class Heatmap extends React.Component {

  static propTypes = {
    data: PropTypes.array,
    actions: PropTypes.object,
    dimensions: PropTypes.object,
    groups: PropTypes.object,
    width: PropTypes.number,
    colors: PropTypes.array,
    margins: PropTypes.object
  };

  static defaultProps = {
    width: 960,
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
    dc.renderAll("heatmap")
  }

  componentWillReceiveProps(nextProps) {
    dc.renderAll("heatmap")
  }

  handleServerClick(d) {
    this.props.routing.push('/server/'+d.host_name.toLowerCase())
  }

  render () {
    const { dimensions, groups } = this.props
    return (
      <div>
        <div ref="chart" className="content chart">
          <Panel>
            <div>
              <HeatmapChart name="heatmap" dimension={dimensions.total} group={groups.total}
                            width={700} height={400}
              />
            </div>
            <div>
              <Datalist maxItems={50}  name="heatmap"
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


export default Heatmap
