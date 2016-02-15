import moment from 'moment'

export function bindUrl(url, valuesMap) {
  return url.replace(/%([a-zA-Z]+)%/g, (match, p1) => valuesMap[p1]);
}

export function parseDate(dt) {
  moment.locale("fr")
  return dt !== "" ? moment(dt,"DD-MMM-YYYY").toDate() : null
}