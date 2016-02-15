import React from 'react'
import { Redirect, Route, Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from './utils/configure-store'
import { Application } from './Application'
import * as pages from './pages'
import * as constants from './constants'

if (__DEVTOOLS__) {
  const DevTools = require('./DevTools')
}

export const store = configureStore({})
// ask all reducers to init their part of the state
store.dispatch({type: constants.INIT_STATE})

export const routes = (
  <Route component={Application}>
    <Redirect from="/" to="servers" />
    <Route path="sites" component={pages.Sites} dimension="site_code"/>
    <Route path="sites/:id" component={pages.Site}/>
    <Route path="servers" component={pages.Servers} diemnsion="host_name"/>
    <Route path="servers/:id" component={pages.Server}/>
    <Route path="applications" component={pages.Servers} dimension="aip_app_name"/>
    <Route path="applications/:id" component={pages.Server}/>
    <Route path="heatmap" component={pages.Heatmap}/>
  </Route>
)

class Root extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
      </Provider>)
  }
}

export default Root
