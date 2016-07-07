import React from 'react'
import dc from 'dc'
import { panel } from '../../decorators'

@panel()
export default class Pie extends React.Component {

  static propTypes = {
    name: React.PropTypes.string,
    update: React.PropTypes.number,
    dimension: React.PropTypes.object,
    group: React.PropTypes.object,
    colorRange: React.PropTypes.array,
    innerRadius: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  };

  static defaultProps = {
    innerRadius: 0.3,
    colorRange: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
    width: 500,
    height: 500
  };

  componentWillReceiveProps(nextProps) {
    if (this.chart && this.chart.chartID() == nextProps.update) this.chart.render();
  }

  componentWillUnmount() {
    dc.deregisterChart(this.chart);
    this.chart = null;
  }

  componentDidMount() {
    const radius = Math.round((Math.min(this.props.width,this.props.height)/2)*0.9)
    const innerRadius = Math.round(radius*this.props.innerRadius)
    this.chart = (this.props.name) ? dc.pieChart(this.refs.chart, this.props.name): dc.pieChart(this.refs.chart)
    this.chart
        .width(this.props.width)
        .height(this.props.height)
        .radius(radius)
        .valueAccessor(d=>d.value)
        .innerRadius(innerRadius)
        .dimension(this.props.dimension)
        .group(this.props.group);
    this.chart.render();
  }

  render() {
    return (<div ref="chart" className="chart chart-pie"></div>)
  }
}