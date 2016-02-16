import React from 'react'

export default class Tag extends React.Component {

  static propTypes = {
    type: React.PropTypes.string,
    caption: React.PropTypes.string,
    value: React.PropTypes.any,
    onDelete: React.PropTypes.func
  };

  onDelete(value,evt) {
    evt.preventDefault()
    this.props.onDelete(value)
  }

  render () {
    const classNames = ['tag']
    if (!!this.props.type) classNames.push('tag-'+this.props.type)
    const hasCaption = (this.props.caption != null)
    const hasDelete = (this.props.onDelete != null)
    return (
      <div className={classNames.join(' ')}>
        {hasCaption && <span className="tag-caption">{this.props.caption}</span>}
        <a href="#" className="tag-value" onClick={(e)=>e.preventDefault()} title={this.props.value}>{this.props.value}</a>
        {hasDelete && <a className="tag-delete" onClick={this.onDelete.bind(this,this.props.value)}> <i className="fa fa-trash-o"></i></a>}
      </div>
    );
  }
}
