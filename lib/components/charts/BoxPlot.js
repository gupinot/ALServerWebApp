import React from 'react';
import dc from 'dc';
import { panel } from '../../decorators'

@panel()
export default class BoxPlot extends React.Component {

  static propTypes = {
    name: React.PropTypes.string,
    dimension: React.PropTypes.object,
    group: React.PropTypes.object,
    colorRange: React.PropTypes.array,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    barHeight: React.PropTypes.number,
    margins: React.PropTypes.object,
    sort: React.PropTypes.func,
    maxItems: React.PropTypes.number,
    title: React.PropTypes.func
  };

  static defaultProps = {
    colorRange: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
    width: 500,
    height: 500,
    barHeight: 30,
    maxItems: 0,
    margins: { top: 0, left: 30, right: 10, bottom: 40 },
    sort: (d) => -d.value,
    title: (d) => d.value
  };

  componentDidMount() {
    function topk(maxItems) {
      return (group) => ({
        all:function () {
          return group.top(maxItems);
        }
      })
    }

    this.chart = (this.props.name) ? dc.rowChart(this.refs.chart, this.props.name): dc.rowChart(this.refs.chart)

    this.chart
        .width(this.props.width)
        .height(this.props.height)
        .dimension(this.props.dimension)
        .group(this.props.group)
        .margins(this.props.margins)
        .ordering((d)=>-d.value)
        .title((d) => d.value)
        .elasticX(true)

    if (this.props.maxItems > 0) {
      const gap = this.chart.gap()
      const height = this.chart.height()-this.props.margins.top-this.props.margins.bottom
      const barHeight = Math.floor((height-gap)/this.props.maxItems-gap)
      this.chart.group(topk(this.props.maxItems)(this.props.group))
          .fixedBarHeight(barHeight)
    }
    this.chart.xAxis().ticks(3)
  }

  render() {
    return (<div ref="chart" className="chart chart-boxplot"></div>)
  }
}