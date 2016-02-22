import React from 'react'

class Panel extends React.Component {

  static propTypes = {
    title: React.PropTypes.any,
    instructions: React.PropTypes.any
  };

  render () {
    return (
        <div className="panel">
            {!!this.props.title && <div className="panel-header">{this.props.title}</div>}
            {!!this.props.instructions && <div className="panel-instructions">{this.props.instructions}</div>}
            <div className="panel-body">{this.props.children}</div>
        </div>
    )
  }
}
export default Panel
