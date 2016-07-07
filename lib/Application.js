import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import fetchOnUpdate from './decorators/fetchOnUpdate'
import runOnUpdate from './decorators/runOnUpdate'
import * as actions from './actions/application'
import * as constants from './constants'
import { routeActions } from 'react-router-redux'
import { TopMenu, Footer, SearchBox } from './components/navigation'

@connect((state,props) => ({
  chartUpdate: state.application.chart,
  data: state.application.data,
  servers: state.application.servers,
  server: state.application.server,
  sitelist: state.application.sitelist,
  site: state.application.site,
  sites: state.application.sites,
  dimensions: state.application.dimensions,
  groups: state.application.groups,
  status: state.application.fetchStatus,
  location: state.routing.location,
  serverid: props.params.serverid,
  siteid: props.params.siteid
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  routing: bindActionCreators(routeActions, dispatch)
}))
@fetchOnUpdate(['serverid'],(params,actions)=>{
  if (params.serverid) actions.fetchServer(params.serverid);
})
@fetchOnUpdate(['siteid'],(params,actions)=>{
  if (params.siteid) actions.fetchSite(params.siteid);
})
@fetchOnUpdate(['sitelist'],(params,actions)=>{
  if (!params.sitelist || params.sitelist.length === 0) actions.fetchSiteList();
})
class Application extends React.Component {

  static propTypes = {
    children: React.PropTypes.any,
    data: React.PropTypes.object,
    chartUpdate: React.PropTypes.number,
    dimensions: React.PropTypes.object.isRequired,
    groups: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object,
    servers: React.PropTypes.array,
    sitelist: React.PropTypes.array,
    site: React.PropTypes.array,
    sites: React.PropTypes.object,
    routing: React.PropTypes.object
  };

  constructor (props, context) {
    super(props, context)
    this.state = {loading: true}
  }

  selectServer(server) {
    this.props.routing.push('/server'+server)
  }

  componentWillUnmount() {
    this.state.loading=true
  }

  componentDidMount() {
    this.setState({loading: false})
    // reset all filters
    for (let d in this.props.dimensions) {
      this.props.dimensions[d].filterAll()
    }
  }

  renderChildren() {
    return React.Children.map(this.props.children, function (child) {
      return React.cloneElement(child, this.props)
    }.bind(this))
  }

  render () {
    return (
        <div id="layout">
          <TopMenu items={constants.MENU_ITEMS}>
          </TopMenu>
          <div id="main">
            {this.renderChildren()}
            {this.state.loading && <div className="loading"><span>Loading data...</span></div>}
          </div>
          <Footer />
        </div>
    )
  }
}

export default Application
