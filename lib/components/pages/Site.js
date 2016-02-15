import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Tr, Td } from 'reactable'
import fetchOnUpdate from '../../decorators/fetchOnUpdate'
import * as constants from '../../constants'
import * as actions from '../../actions/application'
import { CounterBox } from '../panels'
import { BoxPlot } from '../charts'
import d3 from 'd3'
import dc from 'dc'
import 'dc/dc.min.css'

@connect((state,props) => ({
  id: props.params.id,
}))
class Site extends React.Component {

  static propTypes = {
    data: React.PropTypes.array,
    dimensions: React.PropTypes.object,
    groups: React.PropTypes.object,
    sites: React.PropTypes.object,
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
    const server = this.props.data[this.props.servers[this.props.id.toLowerCase()]] || {};
    const usage = Math.round(1000*server.avail_sum/server.total_sum)/10
    return (
      <div className="content">
        <div className="titlebar">
          <div className="titlebar-content">
            <div className="titlebar-title">
              <h1>{server.host_name}</h1>
              <h2>{server.type}</h2>
            </div>
            <CounterBox value={server.cpu_num*server.cpu_cores} title="# Cores" />
            <CounterBox value={Math.round(server.total_sum*1000)/100} title="Total Capacity (GB)" />
            <CounterBox value={usage} title="Avail (%)" />
          </div>
        </div>
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

export default Site
