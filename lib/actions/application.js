import * as constants from '../constants'
import fetch from 'isomorphic-fetch'
import d3 from 'd3'

export function fetchSite(redirect) {
  return fetchCsv('FETCH_SITE',constants.SITE_URL,redirect)
}

export function fetchData(name,filters, callback, chartId) {
  return dispatch => {
    dispatch({
      type: constants.FETCH_DATA,
      name: name,
      filters: filters
    });
    const attrs = (name == 'total') ? 'size,subfunction' : name;

    const url = constants.DATA_URL+'by/'+attrs+'?filters='+JSON.stringify(filters);
    fetch(url).then(response => {
      if (response.status === 200) {
        response.json().then( json => {
          callback(json);
          dispatch({
            type: constants.FETCH_DATA_SUCCESS,
            name: name,
            data: json,
            chartId: chartId
          })
        })
      } else {
        dispatch({
          type: constants.FETCH_DATA_FAILED
        })
      }
    })
  }
}

export function fetchList(filters,limit=50,offset=0) {
  return dispatch => {
    dispatch({
      type: constants.FETCH_LIST,
      filters: filters
    });
    const url = constants.LIST_URL+'?filters='+JSON.stringify(filters);
    fetch(url).then(response => {
      if (response.status === 200) {
        response.json().then( json => {
          dispatch({
            type: constants.FETCH_LIST_SUCCESS,
            data: json
          })
        })
      } else {
        dispatch({
          type: constants.FETCH_LIST_FAILED
        })
      }
    })
  }
}

export function fetchServer(id) {
  return dispatch => {
    dispatch({
      type: constants.FETCH_SERVER,
      id: id
    });
    const url = constants.DATA_URL+id;
    fetch(url).then(response => {
      if (response.status === 200) {
        response.json().then( json => {
          dispatch({
            type: constants.FETCH_SERVER_SUCCESS,
            data: json[0] || {},
            id: id
          })
        })
      } else {
        dispatch({
          type: constants.FETCH_SERVER_FAILED
        })
      }
    })
  }
}
export function fetchSite(id,filters) {
  return dispatch => {
    dispatch({
      type: constants.FETCH_SITE,
      id: id,
      filters: filters
    });
    const url = constants.SITELIST_URL+'/'+id+((!!filters && filters !== {}) ? '?filters='+JSON.stringify(filters): '');
    fetch(url).then(response => {
      if (response.status === 200) {
        response.json().then( json => {
          dispatch({
            type: constants.FETCH_SITE_SUCCESS,
            data: json || {},
            id: id,
            filters: filters
          })
        })
      } else {
        dispatch({
          type: constants.FETCH_SITE_FAILED
        })
      }
    })
  }
}

export function fetchSiteList(filters, limit=1000,offset=0) {
  return dispatch => {
    dispatch({
      type: constants.FETCH_SITELIST,
      filters: filters
    });
    const url = constants.SITELIST_URL+ ((!!filters && filters !== {}) ? '?filters='+JSON.stringify(filters): '');
    fetch(url).then(response => {
      if (response.status === 200) {
        response.json().then( json => {
          dispatch({
            type: constants.FETCH_SITELIST_SUCCESS,
            data: json || [],
            filters: filters
          })
        })
      } else {
        dispatch({
          type: constants.FETCH_SITELIST_FAILED
        })
      }
    })
  }
}


export function fetchCsv (name,url,redirect) {
  const csv = d3.dsv(";","text/plain");
  return dispatch => {
    dispatch({
      type: constants[name]
    })

    fetch(url).then((response) => {
      if (response.status === 200)
        response.text().then( (text) => {
          dispatch({
            type: constants[name+"_SUCCESS"],
            payload: csv.parse(text)
          })
          if (redirect && typeof redirect == 'function') redirect()
        }).catch(function (ex) {
          dispatch({
            type: constants[name+"_FAILED"],
            message: "unknown_error",
            exception: ex
          })
        })
      else if (response.status === 403)
        dispatch({
          type: constants[name+"_FAILED"],
          message: "unauthorized"
        })
      else
        dispatch({
          type: constants[name+"_FAILED"],
          message: "unknown_error"
        })
    })
  }
}

export function fetchJson (name,url,redirect) {
  return dispatch => {
    dispatch({
      type: constants[name]
    })

    fetch(url).then((response) => {
      if (response.status === 200)
        response.json().then( (json) => {
          dispatch({
            type: constants[name+"_SUCCESS"],
            payload: json
          })
          if (redirect && typeof redirect == 'function') redirect()
        }).catch(function (ex) {
          dispatch({
            type: constants[name+"_FAILED"],
            message: "unknown_error",
            exception: ex
          })
        })
      else if (response.status === 403)
        dispatch({
          type: constants[name+"_FAILED"],
          message: "unauthorized"
        })
      else
        dispatch({
          type: constants[name+"_FAILED"],
          message: "unknown_error"
        })
    })
  }
}
