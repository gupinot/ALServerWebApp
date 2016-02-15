import React, { PropTypes } from 'react'
import d3 from 'd3'
import dc from 'dc'
import 'dc/dc.min.css'
import crossfilter from 'crossfilter'
import { HeatmapChart,Datalist }  from '../charts'
import { Panel } from '../panels'

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
    this.groups.forEach((g)=>g.dispose())
    this.dimensions.forEach((d)=>{d.filterAll(); d.dispose()})
    this.charts.forEach((c)=>c.resetSvg())
    this.ndx.remove()
    this.state.loading=true
  }

  componentDidMount() {
    this._render(this.props.data)
  }

  componentWillReceiveProps(nextProps) {
    this._render(nextProps.data)
  }

  _render(data) {
      this._init(data)
      this.setState({loading: false})
      dc.renderAll("heatmap")
  }

  _init(data) {
    if (!data || data.length == 0) return;
    // reset all filters
    this.dimensions.forEach((d)=>d.filterAll())
    // remove any existing data
    this.ndx.remove()
    // update with new data
    if (!!data) this.ndx.add(data)
  }

  handleServerClick(d) {
    this.props.routing.push('/server/'+d.host_name.toLowerCase())
  }

  render () {
    return (
      <div>
        <div ref="chart" className="content chart">
          <Panel>
            <div>
              <HeatmapChart name="heatmap" dimension={this.dimensions.total} group={this.groups.total}
                            width={700} height={400}
              />
            </div>
            <div>
              <Datalist maxItems={50}  name="heatmap"
                        dimension={this.dimensions['servers']} group={this.groups['all']}
                        columns={['site_code','ip','host_name','size','function','subfunction','os_name']}
                        handleClick={this.handleServerClick.bind(this)}
              />
            </div>
            {this.state.loading && <div className="loading"><span>Loading data...</span></div>}
          </Panel>
        </div>
      </div>
    )
  }
}


export default Heatmap
