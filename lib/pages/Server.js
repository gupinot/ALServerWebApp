import React from 'react'
import { Table, Tr, Td } from 'reactable'
import { CounterBox } from '../components/panels'
import { Titlebar } from '../components/navigation'

class Server extends React.Component {

  static propTypes = {
    dimensions: React.PropTypes.object,
    groups: React.PropTypes.object,
    server: React.PropTypes.object
  };

  constructor(props) {
    super(props)
  }

  render () {
    const { server }  = this.props
    if (server == {}) return;
    const usage = Math.round(1000*server.avail_sum/server.total_sum)/10
    return (
      <div className="content">
        <Titlebar title={server.host_name} tags={[server.type]}>
            <CounterBox value={server.cpu_num*server.cpu_cores} title="# Cores" />
            <CounterBox value={Math.round(server.total_sum)} title="Total Capacity (GB)" />
            <CounterBox value={usage} title="Avail (%)" />
        </Titlebar>
        <div>
          <Table data={server.devices}
                 className="pure-table pure-table-striped table-condensed"
                 columns={['device','type','q100_total_mb','charged_total_mb','charged_used_mb','q50_avail_mb','q100_percent_avail']}
          >
          </Table>
        </div>
      </div>
    )
  }
}

export default Server
