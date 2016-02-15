import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Tr, Td } from 'reactable'
import fetchOnUpdate from '../../decorators/fetchOnUpdate'
import * as constants from '../../constants'
import * as actions from '../../actions/application'
import d3 from 'd3'
import dc from 'dc'
import 'dc/dc.min.css'

class Sites extends React.Component {

  static propTypes = {
    data: React.PropTypes.array,
    dimensions: React.PropTypes.object,
    groups: React.PropTypes.object,
    sites: React.PropTypes.object
  };

  constructor(props) {
    super(props)
    this.sizes=[]
  }

  componentWillUnmount() {
    this.dimensions.forEach((d)=>{d.filterAll()})
    this.charts.forEach((c)=>c.resetSvg())
  }

  componentDidMount() {
    dc.renderAll()
  }

  componentWillReceiveProps(nextProps) {
    dc.renderAll()
  }

  render () {
    const {sites, groups, dimensions} = this.props
    const data = Object.keys(sites).map((site)=>{
      dimensions.site_code.filterExact(site)
      const siteSizes = groups.size.all()
      return Object.assign({
        id: site,
        name: sites[site],
      }, this.sizes.reduce((acc,s)=>{
        acc[s]=siteSizes.filter((i)=>i.key==s).map((d)=>d.value)[0] || 0
        return acc;
      },{}))
    });
    return (
      <div className="content">
        <div className="titlebar">
          <div className="titlebar-content">
            <div className="titlebar-title">
              <h1>All sites</h1>
            </div>
          </div>
        </div>
        <div>
          <Table className="pure-table pure-table-striped table-condensed"
                 sortable={true} filterable={true} data={Object.keys(sites)} >
          </Table>
        </div>
      </div>
    )
  }
}

export default Sites
