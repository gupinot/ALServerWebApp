import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Table, Tr, Td } from 'reactable'
import { CounterBox } from '../components/panels'
import { BoxPlot } from '../components/charts'
import { Titlebar } from '../components/navigation'
import d3 from 'd3'
import dc from 'dc'

@connect((state,props) => ({
  id: props.params.id,
}))
class Server extends React.Component {

  static propTypes = {
    data: React.PropTypes.array,
    dimensions: React.PropTypes.object,
    groups: React.PropTypes.object,
    servers: React.PropTypes.object,
    id: React.PropTypes.string
  };

  constructor(props) {
    super(props)
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

  render () {
    const { data, dimensions, servers, groups, id}  = this.props
    const server = data[servers[id.toLowerCase()]] || {};
    const usage = Math.round(1000*server.avail_sum/server.total_sum)/10
    return (
      <div className="content">
        <Titlebar title={server.host_name} tags={[server.type]}>
            <CounterBox value={server.cpu_num*server.cpu_cores} title="# Cores" />
            <CounterBox value={Math.round(server.total_sum*1000)/100} title="Total Capacity (GB)" />
            <CounterBox value={usage} title="Avail (%)" />
        </Titlebar>
        <div>
          <Table data={server.devices}
                 className="pure-table pure-table-striped table-condensed"
                 columns={['device','type','q100_total_mb','charged_total_mb','charged_used_mb','q50_avail_mb','q100_percent_avail']}
          >
          </Table>
        </div>
      </div>
    )
  }
}

export default Server
