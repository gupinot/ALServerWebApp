/* global __DEVTOOLS__ */
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { syncHistory, routeReducer } from 'react-router-redux'
import { browserHistory } from 'react-router'
import thunk from 'redux-thunk'
import logger from '../middleware/logger'
import * as reducers from '../reducers'

const storeEnhancers = []
const middlewares = [logger, thunk, syncHistory(browserHistory)]

if (__DEVTOOLS__) {
  const DevTools = require('../components/DevTools')
  storeEnhancers.push(DevTools.instrument())
}

const combinedCreateStore = compose(...storeEnhancers)(createStore)
const finalCreateStore = applyMiddleware(...middlewares)(combinedCreateStore)

const combinedReducer = combineReducers(Object.assign({
  routing: routeReducer
}, reducers))

export default function configureStore (initialState) {

  const store = finalCreateStore(combinedReducer, initialState)

  if (module.hot)
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index')
      store.replaceReducer(nextRootReducer)
    })

  return store
}
