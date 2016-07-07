import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Table, Thead, Th, Tr, Td } from 'reactable'
import { Titlebar } from '../components/navigation'
import { formatStorage, objectify } from '../utils/crossfilter-utils'

class Sites extends React.Component {

  static propTypes = {
    sitelist: React.PropTypes.array,
    location: React.PropTypes.object,
    routing: React.PropTypes.object,
    sites: React.PropTypes.object
  };

  constructor(props) {
    super(props)
    this.charts=[]
  }

  handleClick(d,e) {
    e.preventDefault()
    const path = this.props.location.pathname
    this.props.routing.push(path+'/'+d.id)
  }

  render () {
    const {sitelist} = this.props
    return (
      <div className="content">
        <Titlebar title="All sites" />
        <div>
          <Table className="pure-table pure-table-striped table-condensed"
                 sortable={true} filterable={['id','name']}
                 defaultSort={{column:'storage_gb',direction:'desc'}} >
            {sitelist.map((d,i)=>
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
