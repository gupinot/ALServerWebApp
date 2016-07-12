import React from 'react';
import dc from 'dc';
import { panel } from '../../decorators'

@panel()
export default class KibanaChart extends React.Component {

  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    url: React.PropTypes.string
  };

  static defaultProps = {
    width: 500,
    height: 500
  };

  render() {
    return (<iframe src={this.props.url} width="600" height="800"></iframe>)
  }
}