import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Table, Tr, Td } from 'reactable'
import * as constants from '../constants'
import { CounterBox } from '../components/panels'
import { BoxPlot } from '../components/charts'
import { Titlebar } from '../components/navigation'
import { objectify } from '../utils/crossfilter-utils'
import d3 from 'd3'
import dc from 'dc'
import 'dc/dc.min.css'

@connect((state,props) => ({
  id: props.params.id
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
    this.props.dimensions.site_code.filterExact(this.props.id)
    dc.renderAll()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.props.dimensions.site_code.filterExact(this.props.id)
    }
    dc.renderAll()
  }

  render () {
    const site = this.props.id;
    const storage = dimensions.site_code.group().reduceSum((d)=>(d.total_sum || 0)).all().reduce(objectify,{})
    const avail = dimensions.site_code.group().reduceSum((d)=>(d.avail_sum || 0)).all().reduce(objectify,{})
    const servers = dimensions.servers.group().all()
    const data =  {
      id: site,
      name: this.props.sites[site],
      storage_gb: (Math.round(storage[site]*100)/10 || 0),
      avail_percent: (Math.round(avail[site]/storage[site]*1000)/10 || 0)
    }
    return (
      <div className="content">
        <Titlebar title={id} >
            <CounterBox value={data.storage_gb} title="Total Capacity (GB)" />
            <CounterBox value={data.avail_percent} title="Avail (%)" />
        </Titlebar>
        <div>
          <Table data={servers}
                 className="pure-table pure-table-striped table-condensed"
                 sortable={true}
                 filterable={['host_name','type','size','subfunction','os_name','os_edition']}
                 columns={['host_name','type','size','subfunction','os_name','os_edition','total_sum','avail_sum']}
          >
          </Table>
        </div>
      </div>
    )
  }
}

export default Site
