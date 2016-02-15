import React from 'react';
import dc from 'dc';

export default class RowChart extends React.Component {

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
    label: React.PropTypes.func
  };

  static defaultProps = {
    colorRange: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
    width: 500,
    height: 500,
    barHeight: 30,
    maxItems: 0,
    margins: { top: 0, left: 30, right: 10, bottom: 40 },
    sort: (d) => -d.value,
    label: (d) => d.key
  };

  _buildChart(props) {
    this.chart = (props.name) ? dc.rowChart(this.refs.chart, props.name): dc.rowChart(this.refs.chart)

    this.chart
        .width(props.width)
        .height(props.height)
        .dimension(props.dimension)
        .group(props.group)
        .margins(props.margins)
        .ordering(props.sort)
        .label(props.label)
        .elasticX(true)

    if (props.maxItems > 0) {
      const gap = this.chart.gap()
      const height = this.chart.height()-props.margins.top-props.margins.bottom
      const barHeight = Math.floor((height-gap)/props.maxItems-gap)
      this.chart.group(topk(props.maxItems)(props.group))
          .fixedBarHeight(barHeight)
    }
    this.chart.xAxis().ticks(3)
  }

  componentDidMount() {
    this._buildChart(this.props)
  }


  componentWillReceiveProps(nextProps) {
    this._buildChart(nextProps)
  }

  render() {
    return (<div ref="chart" className="chart chart-row"></div>)
  }
}

function topk(maxItems) {
  return (group) => ({
    all:function () {
      return group.top(maxItems);
    }
  })
}

