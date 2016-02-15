import * as env from 'env'

export const FETCH_AIP = 'FETCH_AIP'
export const FETCH_AIP_SUCCESS = 'FETCH_AIP_SUCCESS'
export const FETCH_AIP_FAILED = 'FETCH_AIP_FAILED'
export const FETCH_AIP_SERVER = 'FETCH_AIP_SERVER'
export const FETCH_AIP_SERVER_SUCCESS = 'FETCH_AIP_SERVER_SUCCESS'
export const FETCH_AIP_SERVER_FAILED = 'FETCH_AIP_SERVER_FAILED'
export const FETCH_SITE = 'FETCH_SITE'
export const FETCH_SITE_SUCCESS = 'FETCH_SITE_SUCCESS'
export const FETCH_SITE_FAILED = 'FETCH_SITE_FAILED'
export const FETCH_IOSTAT = 'FETCH_IOSTAT'
export const FETCH_IOSTAT_SUCCESS = 'FETCH_IOSTAT_SUCCESS'
export const FETCH_IOSTAT_FAILED = 'FETCH_IOSTAT_FAILED'
export const FETCH_SERVER = 'FETCH_SERVER'
export const FETCH_SERVER_SUCCESS = 'FETCH_SERVER_SUCCESS'
export const FETCH_SERVER_FAILED = 'FETCH_SERVER_FAILED'
export const JOIN_USAGE = 'JOIN_USAGE'
export const JOIN_USAGE_SUCCESS = 'JOIN_USAGE_SUCCESS'
export const JOIN_USAGE_FAILED = 'JOIN_USAGE_FAILED'

export const UPDATE_TREE = 'UPDATE_TREE'
export const INIT_STATE = 'INIT_STATE'
export const RESET_MESSAGES = 'RESET_MESSAGES'
export const SELECT_SERVER = 'SELECT_SERVER'
export const SIDEBAR_VISIBILITY = 'SIDEBAR_VISIBILITY'
export const PAGE_TITLE = 'PAGE_TITLE'

export const AIP_URL = env.BASE_API + '/aip_data.json'
export const IOSTAT_URL = env.BASE_API + '/iostat_avg.csv'
export const AIP_SERVER_URL = env.BASE_API + '/aip_server.csv'
export const SITE_URL = env.BASE_API + '/site_codes.csv'

export const MAIN_AXES = ['site_code','size','function','subfunction','type']

export const MENU_ITEMS = [
    { id: 'servers', text:'Servers', link: '/dashboard', icon: 'fa fa-server', children: [] },
    { id: 'sites', text:'Sites', link: '/sites', icon: 'fa fa-sitemap', children: []},
    { id: 'storage', text:'Storage', icon: 'fa fa-bar-chart', children:[
        { id: 'heatmap', text:'Map', link: '/heatmap'}
    ] }
]

