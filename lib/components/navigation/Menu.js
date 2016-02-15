import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

class Menu extends React.Component {

  static propTypes = {
    id : PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string,
    icon: PropTypes.string,
    location: PropTypes.object
  };

  constructor (props, context) {
    super(props, context)
  }

  handleClick (evt) {
    evt.preventDefault()
  }

  render () {
    const { children, id, text, link, location, icon }  = this.props

    const items =  children && children
        .map((i)=>{
          i.classes=["pure-menu-item"]
          i.disabled = false
          i.active = false
          if (location.pathname && (location.pathname===i.link || location.pathname.indexOf(i.link+'/')===0)) {
            i.classes.push("pure-menu-active")
            i.active = true
          }
          return i
        })
    const hasChildren=(items && items.length > 0)
    const hasLink = (this.props.link != null)
    const iconEl = icon ? <i className={icon}></i> : ''
    const label = text || id
    return (
      <li className={"pure-menu-item"+((hasChildren) ? " pure-menu-has-children pure-menu-allow-hover":"")}>
        {hasLink && <Link to={this.props.link} className="pure-menu-link">{iconEl} {label}</Link>}
        {!hasLink && <a id="{this.props.id}" className="pure-menu-link" onclick={this.handleClick.bind(this)}>
          {iconEl} {label}
        </a>}
        {items && <ul className="pure-menu-children">
          {items.map((item,i) => (
            <li key={i} className={classNames(item.classes)}>
              {!item.disabled && <Link to={item.link} className="pure-menu-link">{item.text}</Link>}
              {item.disabled && item.text}
            </li>
          ))}
        </ul>}
      </li>
    )
  }
}
export default Menu
