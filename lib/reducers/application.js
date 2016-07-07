import * as constants from '../constants'
import createReducer from '../utils/create-reducer'
import { buildCrossfilter } from '../utils/crossfilter-utils'

export const initialState = {
  fetchStatus: {
    aip: 0,
    usage: 0,
    sites: 0,
    merged: 0
  },
  ndx: {},
  dimensions: {},
  groups: {},
  data: {},
  dataUpdate: 0,
  chart: 0,
  sites: {},
  servers: [],
  server: {},
  sitelist: [],
  site: {}
}

const actionHandlers = {
  [constants.INIT_STATE]: () => Object.assign({},initialState, buildCrossfilter()),
  [constants.FETCH_SITE]: (state, action) => ({fetchStatus:Object.assign({},state.fetchStatus,{sites:1})}),
  [constants.FETCH_SITE_SUCCESS]: (state, action) => ({
    fetchStatus: Object.assign({},state.fetchStatus,{sites:2}),
    sites: action.payload.reduce((acc,item)=>{acc[item.site_code]=item.site_name;return acc},{})
  }),
  [constants.FETCH_SITE_FAILED]: (state, action) => ({fetchStatus:Object.assign({},state.fetchStatus,{sites:3})}),
  [constants.FETCH_DATA_SUCCESS]: (state, action) => ({data:Object.assign(state.data,{
    [action.name]: action.data
  }),dataUpdate:state.dataUpdate+1,chart:action.chartId}),
  [constants.FETCH_LIST_SUCCESS]: (state, action) => ({servers:action.data}),
  [constants.FETCH_SERVER_SUCCESS]: (state, action) => ({server:action.data}),
  [constants.FETCH_SITE_SUCCESS]: (state, action) => ({site:action.data}),
  [constants.FETCH_SITELIST_SUCCESS]: (state, action) => ({sitelist:action.data})
}

export default createReducer(initialState, actionHandlers)
