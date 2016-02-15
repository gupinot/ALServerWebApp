import React, { PropTypes } from 'react'
import { Link } from 'react-router'

class Titlebar extends React.Component {

  static propTypes = {
    title: PropTypes.any,
    tags: PropTypes.array
  };

  static defaultProps = {
    title: 'Page Title'
  };

  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div className="titlebar">
        <div className="titlebar-content">
          <div className="titlebar-title">
            <h1>{this.props.title}</h1>
            <div className="titlebar-tags">
            {!!this.props.tags && this.props.tags.map(
              (tag,i)=><Tag value={tag} key={i} />
            )}
            </div>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Titlebar
