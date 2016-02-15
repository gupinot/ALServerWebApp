import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as applicationActions from '../../actions/application'
import MenuListItem from './MenuListItem'
import Menu from './Menu'
import classNames from 'classnames'
import * as constants from '../../constants'

@connect(state => ({
  application: state.application,
  location: state.routing.location
}),dispatch => ({
  actions: bindActionCreators(applicationActions, dispatch)
}))
class TopMenu extends React.Component {

  static propTypes = {
    application: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const location = this.props.location
    const menus = constants.MENU_ITEMS
    return (
      <div id="topmenu" ref="menu">
        <div className="menu-content">
          <div className="app-branding"></div>
          <ul className="pure-menu-list pure-menu-horizontal">
            {menus.map((item, i) =>
              (<Menu {...item} location={location} key={i} />)
            )}
          </ul>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default TopMenu
