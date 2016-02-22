import React, { PropTypes } from 'react'
import { Panel } from '../components/panels'

export default function panel () {

  return DecoratedComponent =>
  class PanelDecorator extends React.Component {

    static propTypes = {
      title: PropTypes.string
    };

    render () {
      return (<Panel title={this.props.title}><DecoratedComponent {...this.props} /></Panel>)
    }
  }
}
