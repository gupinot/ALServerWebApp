import React from 'react'
import { Link } from 'react-router'

class LinkBox extends React.Component {

  static propTypes = {
    title: React.PropTypes.string,
    items: React.PropTypes.array
  };

  render () {
    return (
      <div className="linkbox">
        <h3>{this.props.title}</h3>
        {this.props.items.map((item,i)=>(
          <Link key={i} to={item.link} className="link"><i className={item.icon}></i>{item.name}</Link>
        ))}
      </div>
    )
  }
}
export default LinkBox
