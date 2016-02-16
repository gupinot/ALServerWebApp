import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Table, Thead, Th, Tr, Td } from 'reactable'
import { Titlebar } from '../components/navigation'
import { formatStorage, objectify } from '../utils/crossfilter-utils'
import * as constants from '../constants'
import d3 from 'd3'
import dc from 'dc'
import 'dc/dc.min.css'

@connect((state,props) => ({
  id: props.params.id,
}))
class Sites extends React.Component {

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
    dc.renderAll()
  }

  componentWillReceiveProps(nextProps) {
    dc.renderAll()
  }

  handleClick(d,e) {
    e.preventDefault()
    const path = this.props.location.pathname
    this.props.routing.push(path+'/'+d.id)
  }

  render () {
    const {sites, groups, dimensions} = this.props
    const storage = dimensions.site_code.group().reduceSum((d)=>(d.total_sum || 0)).all().reduce(objectify,{})
    const avail = dimensions.site_code.group().reduceSum((d)=>(d.avail_sum || 0)).all().reduce(objectify,{})
    const data = Object.keys(sites).map((site)=>{
      return {
        id: site,
        name: sites[site],
        storage_gb: storage[site] || 0,
        avail_gb: avail[site] || 0,
        avail_percent: avail[site]/storage[site] || 0,
      }
    });
    return (
      <div className="content">
        <Titlebar title="All sites" />
        <div>
          <Table className="pure-table pure-table-striped table-condensed"
                 sortable={true} filterable={['id','name']}
                 defaultSort={{column:'storage_gb',direction:'desc'}} >
            {data.map((d,i)=>
                (<Tr key={i} data={d} onClick={this.handleClick.bind(this,d)}>
                  <Td column="storage_gb" value={d.storage_gb}>{formatStorage(d.storage_gb)}</Td>
                  <Td column="avail_gb" value={d.avail_gb}>{formatStorage(d.avail_gb)}</Td>
                  <Td column="avail_percent" value={d.avail_percent}>{Math.round(d.avail_percent*1000)/10+' %'}</Td>
                </Tr>)
            )}
          </Table>
        </div>
      </div>
    )
  }
}

export default Sites
