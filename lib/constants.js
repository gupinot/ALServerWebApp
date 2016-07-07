import * as env from 'env'

export const FETCH_DATA = 'FETCH_DATA'
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
export const FETCH_DATA_FAILED = 'FETCH_DATA_FAILED'
export const FETCH_LIST = 'FETCH_LIST'
export const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS'
export const FETCH_LIST_FAILED = 'FETCH_LIST_FAILED'
export const FETCH_SITE = 'FETCH_SITE'
export const FETCH_SITE_SUCCESS = 'FETCH_SITE_SUCCESS'
export const FETCH_SITE_FAILED = 'FETCH_SITE_FAILED'
export const FETCH_SITELIST = 'FETCH_SITELIST'
export const FETCH_SITELIST_SUCCESS = 'FETCH_SITELIST_SUCCESS'
export const FETCH_SITELIST_FAILED = 'FETCH_SITELIST_FAILED'
export const FETCH_SERVER = 'FETCH_SERVER'
export const FETCH_SERVER_SUCCESS = 'FETCH_SERVER_SUCCESS'
export const FETCH_SERVER_FAILED = 'FETCH_SERVER_FAILED'
export const FETCH_IOSTAT = 'FETCH_IOSTAT'

export const INIT_STATE = 'INIT_STATE'

export const DATA_URL = env.BASE_API+'/servers/'
export const LIST_URL = env.BASE_API+'/servers'
export const SITELIST_URL = env.BASE_API+'/sites'
export const SITE_URL = env.BASE_API + '/site_codes.csv'

export const MAIN_AXES = ['site_code','size','function','subfunction','type','host_name']

export const MENU_ITEMS = [
    { id: 'servers', text:'Servers', link: '/servers', icon: 'fa fa-server', children: [] },
    { id: 'sites', text:'Sites', link: '/sites', icon: 'fa fa-sitemap', children: []}
]