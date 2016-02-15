import React from 'react'

class CounterBox extends React.Component {

  static propTypes = {
    value: React.PropTypes.number,
    title: React.PropTypes.any,
    icon: React.PropTypes.string,
    click: React.PropTypes.func
  };

  render () {
    return (
      <div className="counterbox">
        <h1>{this.props.value}</h1>
        <div className="title">{this.props.icon && (<i className={this.props.icon}></i>)} {this.props.title}</div>
      </div>
    )
  }
}
export default CounterBox
