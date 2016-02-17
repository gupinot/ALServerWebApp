import React from 'react';
import dc from 'dc';
import { Link } from 'react-router';
import { Table, Thead, Td, Th, Tr } from 'reactable';

export default class Datalist extends React.Component {

  static propTypes = {
    name: React.PropTypes.string,
    data: React.PropTypes.array,
    dimension: React.PropTypes.object,
    group: React.PropTypes.func,
    columns: React.PropTypes.array,
    width: React.PropTypes.string,
    maxItems: React.PropTypes.number,
    pageLimit: React.PropTypes.number,
    handleClick: React.PropTypes.func
  };

  static defaultProps = {
    name: null,
    width: "100%",
    maxItems: Infinity,
    pageLimit: 100
  };

  constructor(props) {
    super(props)
    this.state = { data: this.props.dimension.top(this.props.maxItems)}
  }

  _refresh() {
    dc.events.trigger(() => this.setState({ data: this.props.dimension.top(this.props.maxItems) }))
  }

  componentDidMount() {
    const _this=this
    this.refresher = window.setInterval(()=>{
      for (let chart of dc.chartRegistry.list(_this.props.name)) {
        chart.on("filtered", _this._refresh.bind(_this));
      }
    },1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.refresher)
    for (let chart of dc.chartRegistry.list(this.props.name)) {
      chart.on("filtered", null);
    }
  }

  handleClick(d,e) {
    e.preventDefault()
    if (!!d.devices && d.devices.length > 0) {
      if (typeof this.props.handleClick == 'function') this.props.handleClick(d)
    }
  }

  render() {
    const className = (d) =>
        ((!d.devices || d.devices.length === 0) ? 'disabled' : 'enabled')
    return (<Table className="pure-table pure-table-striped table-condensed chart-datalist" style={{width: '100%'}}
          sortable={true} filterable={this.props.columns} columns={this.props.columns}
          itemsPerPage={this.props.pageLimit} pageButtonLimit={10}
        >
          {this.state.data.map((d,i) => (
            <Tr key={i} onClick={this.handleClick.bind(this,d)} data={d} className={className(d)} ></Tr>
          ))}
        </Table>
    )
  }
}