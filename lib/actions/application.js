import * as constants from '../constants'
import fetch from 'isomorphic-fetch'
import d3 from 'd3'
import crossfilter from 'crossfilter'
import { parseDate } from '../utils/url-utils'

export function fetchAip(redirect) {
  return fetchJson('FETCH_AIP',constants.AIP_URL,redirect)
}

export function fetchAipServer(redirect) {
  return fetchCsv('FETCH_AIP_SERVER',constants.AIP_SERVER_URL,redirect)
}

export function fetchSite(redirect) {
  return fetchCsv('FETCH_SITE',constants.SITE_URL,redirect)
}

export function fetchIostat(redirect) {
  return fetchCsv('FETCH_IOSTAT',constants.IOSTAT_URL,redirect)
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

export function joinUsage(usage,aip) {
  return dispatch => {
    dispatch({
      type: constants.JOIN_USAGE,
    })
    const usage_grouped = usage.reduce((acc, u)=> {
      const key = u.server.toLowerCase()
      if (!acc.hasOwnProperty(key)) acc[key] = []
      acc[key].push(u)
      return acc
    }, {})
    const aip_joined = aip.filter((d)=>d.function && !d.function.startsWith('Infrastructure')).map((d)=> {
      const key = d.host_name.toLowerCase()
      const devices = usage_grouped[key] || []
      const server_props = devices[0] ? devices.slice(0, 1).reduce((acc, d)=>({
        storage_type: d.type,
        app_name: d.aip_app_name,
        app_sector: d.aip_app_sector
      }), {}) : []

      const usage_stats = devices.reduce((acc, d)=>
              ({
                avail_sum: acc.avail_sum + (+d.q50_avail_mb / 1000 || 0),
                total_sum: acc.total_sum + (+d.q100_total_mb / 1000 || 0),
                avail_max: Math.max(acc.avail_max, (+d.q100_avail_mb / 1000 || 0)),
                avail_min: Math.min(acc.avail_min, (+d.q0_avail_mb / 1000 || Infinity)),
                avail_percent_max: Math.max(acc.avail_percent_max, Math.round(1000 * (+d.q100_percent_avail)) / 10)
              }),
          {avail_sum: 0, total_sum: 0, avail_max: 0, avail_min: Infinity, avail_percent_max: 0}
      );

      return Object.assign({
        cpu_cores: +d.cpu_cores || 1,
        cpu_num: +d.cpu_num || 1,
        cpu_type: d.cpu_type,
        dt: parseDate(d.dt_install),
        dt_install: d.dt_install,
        function: d.function,
        host_name: d.host_name.toLowerCase(),
        ip: d.ip,
        model: d.model,
        os_edition: d.os_edition,
        os_name: d.os_name,
        owner: d.owner,
        owner_org_id: d.owner_org_id,
        ownership: d.ownership,
        phys_host: d.phys_host,
        role: d.role,
        site_code: d.site_code,
        size: d.size || "Unknwon",
        source: d.source,
        status: d.status,
        subfunction: d.subfunction,
        type: d.type
      }, server_props, usage_stats, {
        devices: devices.map((d) => ({
          device: d.device,
          type: d.type,
          q100_total_mb: +d.q100_total_mb,
          q0_avail_mb: +d.q0_avail_mb,
          q10_avail_mb: +d.q10_avail_mb,
          q25_avail_mb: +d.q25_avail_mb,
          q50_avail_mb: +d.q50_avail_mb,
          q75_avail_mb: +d.q75_avail_mb,
          q90_avail_mb: +d.q90_avail_mb,
          q100_avail_mb: +d.q100_avail_mb,
          q0_percent_avail: +d.q0_percent_avail,
          q10_percent_avail: +d.q10_percent_avail,
          q25_percent_avail: +d.q25_percent_avail,
          q50_percent_avail: +d.q50_percent_avail,
          q75_percent_avail: +d.q75_percent_avail,
          q90_percent_avail: +d.q90_percent_avail,
          q100_percent_avail: +d.q100_percent_avail,
          charged_used_mb: +d.charged_used_mb,
          charged_total_mb: +d.charged_total_mb
        }))
      })
    })

    dispatch({
      type: constants.JOIN_USAGE_SUCCESS,
      data: aip_joined
    })
  }
}