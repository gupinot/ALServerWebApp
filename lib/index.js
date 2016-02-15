import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'
import '../assets/stylesheets/themes/default/index.css'
import 'dc/dc.min.css'

ReactDOM.render(<Root />, document.getElementById('app'))
