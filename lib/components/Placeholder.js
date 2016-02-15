import React from 'react'

export default class Placeholder extends React.Component {
  render () {

    return (
      <div>
        <div className="header">
          <h1>Placeholder</h1>
        </div>
        <div className="content">
          <h2>Properties</h2>
          <ul>
            {Object.keys(this.props).map((p) => <li>{p+':'+this.props[p]}</li>)}
          </ul>
        </div>
      </div>
    )
  }
}
