import React from 'react'
import dc from 'dc'
import { panel } from '../../decorators'

@panel()
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
    if (this.chart == null) {
      this.chart = (props.name) ? dc.rowChart(this.refs.chart, props.name): dc.rowChart(this.refs.chart)
    }

    this.chart
        .width(props.width)
        .height(props.height)
        .dimension(props.dimension)
        .group(props.group)
        .margins(props.margins)
        .ordering(props.sort)
        .valueAccessor(d => d.value)
        .label(props.label)
        .elasticX(true)

    if (props.maxItems > 0) {
      const gap = this.chart.gap()
      const height = this.chart.height()-props.margins.top-props.margins.bottom
      const barHeight = Math.floor((height-gap)/props.maxItems-gap)
      this.chart.group(props.group).fixedBarHeight(barHeight)
    }
    this.chart.xAxis().ticks(3)
  }

  componentWillUnmount() {
    dc.deregisterChart(this.chart);
    this.chart = null;
  }
  
  componentDidMount() {
    this._buildChart(this.props)
    this.chart.render();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name != this.props.name) {
      if (this.chart != null) {
        dc.deregisterChart(this.chart);
        this.chart = null;
      }
    }
    this._buildChart(nextProps)
    if (this.chart && this.chart.chartID() == nextProps.update) this.chart.redraw();
  }

  render() {
    return (<div ref="chart" className="chart chart-row"></div>)
  }
}

function topk(maxItems) {
  return (group) => ({
    all:function () {
      return group.all().slice(0,maxItems);
    }
  })
}

