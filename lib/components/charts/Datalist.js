import React from 'react';
import dc from 'dc';
import { Table, Thead, Td, Th, Tr } from 'reactable';

export default class Datalist extends React.Component {

  static propTypes = {
    name: React.PropTypes.string,
    query: React.PropTypes.string,
    data: React.PropTypes.array,
    dimension: React.PropTypes.func,
    group: React.PropTypes.object,
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
          itemsPerPage={this.props.pageLimit} pageButtonLimit={10} currentPage={0}
        >
          {this.props.data.map((d,i) => (
            <Tr key={i} onClick={this.handleClick.bind(this,d)} data={d} className={className(d)} ></Tr>
          ))}
        </Table>
    )
  }
}