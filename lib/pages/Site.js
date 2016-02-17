import React from 'react'
import { connect } from 'react-redux'
import { Table, Tr, Td } from 'reactable'
import * as constants from '../constants'
import { CounterBox } from '../components/panels'
import { BoxPlot, HeatmapChart, Datalist } from '../components/charts'
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
    sites: React.PropTypes.object,
    servers: React.PropTypes.object,
    routing: React.PropTypes.object,
    id: React.PropTypes.string
  };

  static defaultProps = {
    name: "site"
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
    dc.renderAll(this.props.name)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.props.dimensions.site_code.filterExact(this.props.id)
    }
    dc.renderAll(this.props.name)
  }

  handleServerClick(d) {
    this.props.routing.push('/servers/'+d.host_name.toLowerCase())
  }

  render () {
    const { dimensions, groups, sites, id, servers, data } = this.props
    const storage = dimensions.site_code.group().reduceSum((d)=>(d.total_sum || 0)).all().reduce(objectify,{})
    const avail = dimensions.site_code.group().reduceSum((d)=>(d.avail_sum || 0)).all().reduce(objectify,{})
    const all = groups.host_name.all().map((d)=>{
      const idx = servers[d.key.toLowerCase()]
      return data[idx]
    })
    const siteData =  {
      id: id,
      name: sites[id],
      storage_gb: storage[id] || 0,
      avail_percent: (Math.round(avail[id]/storage[id]*1000)/10 || 0)
    }
    return (
      <div className="content">
        <Titlebar title={siteData.name+ ' ('+siteData.id+')'} >
            <CounterBox value={formatStorage(siteData.storage_gb)} title="Total Capacity" />
            <CounterBox value={siteData.avail_percent+' %'} title="Available storage" />
        </Titlebar>
        <div style={{display: 'flex',flexDirection:'row',flex:'1 0 100%'}}>
          <div>
            <Datalist dimension={dimensions.servers} name={this.props.name}
                   filterable={['host_name','ip','size','type','subfunction']}
                   columns={['host_name','ip','size','type','subfunction']}
                   sortable={true}
                   itemsPerPage={30}
                   handleClick={this.handleServerClick.bind(this)}
            >
            </Datalist>
          </div>
          <div style={{marginLeft:'auto'}}>
            <HeatmapChart
                name={this.props.name}
                dimension={dimensions.total} group={groups.total}
                width={600} height={400}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Site
