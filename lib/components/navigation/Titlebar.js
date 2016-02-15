import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as constants from '../../constants'
import { bindActionCreators } from 'redux'

@connect(({ sendika: { mobile, range, favorites }, router: { params } }) => ({ mobile, range, favorites, params }),
  dispatch => ({
    actions: bindActionCreators(sendikaActions,dispatch)
  })
)
class Titlebar extends React.Component {

  static propTypes = {
    title: PropTypes.any,
    range: PropTypes.array,
    current: PropTypes.array,
    params: PropTypes.object,
    mobile: PropTypes.string,
    updateRange: PropTypes.func,
    showDateRange: PropTypes.bool,
    showMobiles: PropTypes.bool,
    showSearch: PropTypes.bool,
    showStar: PropTypes.bool,
    favorites: PropTypes.array,
    selectMobile: PropTypes.func,
    deleteMobile: PropTypes.func
  };

  static defaultProps = {
    title: 'Page Title',
    allowStar: false,
    showDateRange: true,
    showMobiles: true,
    showSearch: true,
    showStar: false
  };

  constructor (props, context) {
    super(props, context)
  }

  handleDelete(code) {
    if (this.props.deleteMobile)
      this.props.deleteMobile(code)
    else
      this.props.actions.deleteMobile(code)
  }

  render () {
    const range = this.props.current || this.props.range
    const ranges = constants.DATE_RANGES
    const starContent = this.props.showStar ?
      (<a href="#" onClick={this.onStarClick.bind(this)}><span className="fa fa-star"></span></a>) :''

    return (
      <div className="titlebar">
        <div className="titlebar-content">
          <div className="titlebar-title">
            <h1>{this.props.title}&nbsp;{starContent}</h1>
            <div className="titlebar-tags">
            {this.props.showMobiles && this.props.params.mobile && this.props.params.mobile.split(',').map(
              (mob,i)=><Mobile mobile={mob} key={i} onDelete={this.handleDelete.bind(this)}/>
            )}
            </div>
          </div>
          {this.props.showSearch && <ImsiSelect select={this.props.selectMobile || this.props.actions.selectMobile} />}
          {this.props.showDateRange
          && (<DateRangeSelect current={range} ranges={ranges} updateRange={this.props.updateRange || this.props.actions.updateRange}/>)}
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Titlebar
