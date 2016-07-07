import React from 'react';
import dc from 'dc';
import { panel } from '../../decorators'

@panel()
export default class HeatmapChart extends React.Component {

  static propTypes = {
    name: React.PropTypes.string,
    dimension: React.PropTypes.func,
    group: React.PropTypes.object,
    colorRange: React.PropTypes.array,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    barWidth: React.PropTypes.number,
    margins: React.PropTypes.object,
    domain: React.PropTypes.array,
    sort: React.PropTypes.func,
    maxItems: React.PropTypes.number,
    title: React.PropTypes.func
  };

  static defaultProps = {
    colorRange: ['#f0f9e8','#ccebc5','#a8ddb5','#7bccc4','#43a2ca','#0868ac'],
    width: 500,
    height: 500,
    barWidth: 30,
    maxItems: 0,
    domain: [0,100],
    margins: { top: 0, left: 200, right: 10, bottom: 40 },
    sort: (d) => -d.value,
    title: (d) => d.value
  };

  componentDidMount() {
    this.chart = (this.props.name) ? dc.heatMap(this.refs.chart, this.props.name): dc.heatMap(this.refs.chart)
    this.chart
        .width(this.props.width)
        .height(this.props.height)
        .renderLabel(true)
        .dimension(this.props.dimension)
        .group(this.props.group)
        .keyAccessor((d) => d.key[0])
        .valueAccessor((d) => d.key[1])
        .colorAccessor((d) => (+d.value))
        .margins(this.props.margins)
        .title((d) => "Storage: " + (d.value) + " GB")
        .label((d) => Math.round(d.value) + " GB")
        .colors(this.props.colorRange);

    this.chart.on("preRender",(chart)=>{
      chart.calculateColorDomain()
    })
  }

  componentWillUnmount() {
    this.chart.on("preRender",null)
    this.chart.on("renderlet",null)
  }

  render() {
    return (<div ref="chart" className="chart chart-heatmap"></div>)
  }
}