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
  ndx: null,
  dimensions: null,
  groups: null,
  aip: [],
  usage: [],
  data: [],
  sites: {},
  servers: {}
}

const actionHandlers = {
  [constants.INIT_STATE]: () => Object.assign({},initialState, buildCrossfilter()),
  [constants.JOIN_USAGE]: (state, action) => ({fetchStatus:Object.assign({},state.fetchStatus,{merged:1})}),
  [constants.JOIN_USAGE_SUCCESS]: (state, action) => ({
    fetchStatus:Object.assign({},state.fetchStatus,{merged:2}),
    servers: action.data.reduce((acc,item,idx)=>{acc[item.host_name.toLowerCase()]=idx; return acc},{}),
    data: action.data
  }),
  [constants.FETCH_IOSTAT]: (state, action) => ({fetchStatus:Object.assign({},state.fetchStatus,{usage:1})}),
  [constants.FETCH_IOSTAT_SUCCESS]: (state, action) => ({
    usage: action.payload,
    fetchStatus:Object.assign({},state.fetchStatus,{usage:2})
  }),
  [constants.FETCH_IOSTAT_FAILED]: (state, action) => ({fetchStatus:Object.assign({},state.fetchStatus,{usage:3})}),
  [constants.FETCH_AIP_SERVER]: (state, action) => ({fetchStatus:Object.assign({},state.fetchStatus,{aip:1})}),
  [constants.FETCH_AIP_SERVER_FAILED]: (state, action) => ({fetchStatus:Object.assign({},state.fetchStatus,{aip:3})}),
  [constants.FETCH_AIP_SERVER_SUCCESS]: (state, action) => ({
    aip: action.payload,
    servers: action.payload.reduce((acc,item,idx)=>{acc[item.host_name.toLowerCase()]=idx; return acc},{}),
    fetchStatus: Object.assign({},state.fetchStatus,{aip:2})
  }),
  [constants.FETCH_SITE]: (state, action) => ({fetchStatus:Object.assign({},state.fetchStatus,{sites:1})}),
  [constants.FETCH_SITE_SUCCESS]: (state, action) => ({
    fetchStatus: Object.assign({},state.fetchStatus,{sites:2}),
    sites: action.payload.reduce((acc,item)=>{acc[item.site_code]=item.site_name;return acc},{})
  }),
  [constants.FETCH_SITE_FAILED]: (state, action) => ({fetchStatus:Object.assign({},state.fetchStatus,{sites:3})}),
}

export default createReducer(initialState, actionHandlers)
