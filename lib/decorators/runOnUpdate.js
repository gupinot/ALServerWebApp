import React, { PropTypes } from 'react'
import shallowEqual from 'react-redux/lib/utils/shallowEqual'

function mapParams (paramKeys, params) {
  return paramKeys.reduce((acc, key) => {
    return Object.assign({}, acc, { [key]: params[key] })
  }, {})
}

export default function runOnUpdate (paramKeys, fn) {

  return DecoratedComponent =>
  class RunOnUpdateDecorator extends React.Component {

    static propTypes = {
      actions: PropTypes.object
    };

    componentWillMount () {
      fn(mapParams(paramKeys, this.props), this.props.actions)
    }

    componentDidUpdate (prevProps) {
      const params = mapParams(paramKeys, this.props)
      const prevParams = mapParams(paramKeys, prevProps)

      if (!shallowEqual(params, prevParams))
        fn(params, this.props.actions)
    }

    render () {
      return (
        <DecoratedComponent {...this.props} />
      )
    }
  }
}
