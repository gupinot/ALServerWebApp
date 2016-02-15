import React from 'react'
import { Redirect, Route, Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import configureStore from './utils/configure-store'
import * as components from './components'
import * as constants from './constants'

const {
  Application,
  Dashboard,
  Treemap,
  Heatmap,
  Server,
  Sites,
  Site
} = components

if (__DEVTOOLS__) {
  const DevTools = require('./components/DevTools')
}

export const store = configureStore({})
// ask all reducers to init their part of the state
store.dispatch({type: constants.INIT_STATE})

export const routes = (
  <Route component={Application}>
    <Redirect from="/" to="dashboard" />
      <Route path="dashboard" component={Dashboard}/>
      <Route path="sites" component={Sites}/>
      <Route path="sites/:id" component={Site}/>
      <Route path="heatmap" component={Heatmap}/>
      <Route path="server/:id" component={Server}/>
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
