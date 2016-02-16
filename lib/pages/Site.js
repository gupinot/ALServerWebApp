import React from 'react'
import { connect } from 'react-redux'
import { Table, Tr, Td } from 'reactable'
import * as constants from '../constants'
import { CounterBox } from '../components/panels'
import { BoxPlot } from '../components/charts'
import { Titlebar } from '../components/navigation'
import { objectify, formatStorage } from '../utils/crossfilter-utils'
import dc from 'dc'

@connect((state,props) => ({
  id: props.params.id
}))
class Site extends React.Component {

  static propTypes = {
    data: React.PropTypes.array,
    dimensions: React.PropTypes.object,
    groups: React.PropTypes.object,
    location: React.PropTypes.object,
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
    const { dimensions, sites, id } = this.props
    const storage = dimensions.site_code.group().reduceSum((d)=>(d.total_sum || 0)).all().reduce(objectify,{})
    const avail = dimensions.site_code.group().reduceSum((d)=>(d.avail_sum || 0)).all().reduce(objectify,{})
    const servers = dimensions.servers.group().all()
    const data =  {
      id: id,
      name: sites[id],
      storage_gb: storage[id] || 0,
      avail_percent: (Math.round(avail[id]/storage[id]*1000)/10 || 0)
    }
    return (
      <div className="content">
        <Titlebar title={data.name} >
            <CounterBox value={formatStorage(data.storage_gb)} title="Total Capacity" />
            <CounterBox value={data.avail_percent+' %'} title="Available storage" />
        </Titlebar>
        <div>
          <Table data={servers}
                 className="pure-table pure-table-striped table-condensed"
                 sortable={true}
                 itemsPerPage={100}
          >
          </Table>
        </div>
      </div>
    )
  }
}

export default Site
