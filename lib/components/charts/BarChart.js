import React from 'react'
import dc from 'dc'
import { panel } from '../../decorators'

@panel()
export default class BarChart extends React.Component {

  static propTypes = {
    dimension: React.PropTypes.object,
    group: React.PropTypes.object,
    colorRange: React.PropTypes.array,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    barWidth: React.PropTypes.number,
    margins: React.PropTypes.object,
    domain: React.PropTypes.array,
    sort: React.PropTypes.func,
    maxItems: React.PropTypes.number,
    label: React.PropTypes.func,
    xLabel: React.PropTypes.string,
    yLabel: React.PropTypes.string,
    xUnit: React.PropTypes.number};

  static defaultProps = {
    colorRange: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
    width: 500,
    height: 500,
    barWidth: 30,
    maxItems: 0,
    domain: [0,100],
    xUnit: 10,
    margins: { top: 20, left: 40, right: 20, bottom: 30 },
    sort: (d) => -d.value,
    label: (d) => d.value
  };

  componentDidMount() {
    this.chart = (this.props.name) ? dc.barChart(this.refs.chart, this.props.name): dc.barChart(this.refs.chart)

    this.chart
        .brushOn(true)
        .mouseZoomable(true)
        .margins(this.props.margins)
        .x(d3.scale.linear())
        .width(this.props.width)
        .height(this.props.height)
        .dimension(this.props.dimension)
        .group(this.props.group)
        .outerPadding(0)
        .centerBar(true)
        .elasticY(true)
        .xUnits(this._xUnits.bind(this))

    this.chart.yAxis().ticks(3)
    this.updateChart(this.props)
  }

  updateChart(props) {
    if (props.domain && props.domain[1] > 0) {
      this.chart.x(d3.scale.linear().domain(props.domain))
    }

    if (props.yLabel) this.chart.yAxisLabel(props.yLabel)
    if (props.xLabel) this.chart.xAxisLabel(props.xLabel)
  }

  _xUnits(start,end) {
    return Math.floor((end-start)/this.props.xUnit)
  }

  componentWillReceiveProps(nextProps) {
    this.updateChart(nextProps)
  }

  render() {
    return (<div ref="chart" className="chart chart-bar"></div>)
  }
}