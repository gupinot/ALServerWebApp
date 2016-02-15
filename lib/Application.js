import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import fetchOnUpdate from './decorators/fetchOnUpdate'
import * as actions from './actions/application'
import * as constants from './constants'
import { routeActions } from 'react-router-redux'
import { TopMenu, Footer, SearchBox } from './components/navigation'

@connect(state => ({
  aip: state.application.aip,
  data: state.application.data,
  servers: state.application.servers,
  usage: state.application.usage,
  sites: state.application.sites,
  ndx: state.application.ndx,
  dimensions: state.application.dimensions,
  groups: state.application.groups,
  status: state.application.fetchStatus,
  location: state.routing.location
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  routing: bindActionCreators(routeActions, dispatch)
}))
@fetchOnUpdate(['usage','aip','status','ndx'],(params,actions) => {
  if (params.status.aip === 0) actions.fetchAipServer()
  if (params.status.usage === 0) actions.fetchIostat()
  if (params.status.sites === 0) actions.fetchSite()
  if (params.status.merged === 0 && params.status.usage === 2 && params.status.aip === 2)
    actions.joinUsage(params.usage,params.aip,params.ndx)
})
class Application extends React.Component {

  static propTypes = {
    children: React.PropTypes.any,
    data: React.PropTypes.array,
    dimensions: React.PropTypes.object.isRequired,
    ndx: React.PropTypes.object.isRequired,
    groups: React.PropTypes.object.isRequired,
    usage: React.PropTypes.array,
    actions: React.PropTypes.object,
    servers: React.PropTypes.object,
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
    if (!!this.props.data && !!this.props.ndx) this._init(this.props.data)
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.data !== this.props.data) || (nextProps.ndx !== this.props.ndx)) this._init(nextProps.data)
  }

  shouldComponentUpdate(nextProps) {
    return (!!nextProps.data && nextProps.data.length > 0 && !!nextProps.servers && !!nextProps.sites)
  }

  _init(data) {
    this.setState({loading: false})
    if (!data || data.length == 0) return;
    // reset all filters
    for (let d in this.props.dimensions) {
      this.props.dimensions[d].filterAll()
    }
    // remove any existing data
    this.props.ndx.remove()
    // update with new data
    if (!!data) this.props.ndx.add(data)
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
