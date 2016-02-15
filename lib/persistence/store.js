import * as constants from '../constants'
import * as storage from './storage'

export default function persistenceHandler (next) {
  return (reducer, initialState) => {
    const store = next(reducer, initialState)

    return Object.assign({}, store, {
      dispatch (action) {
        store.dispatch(action)

        return action
      }
    })
  }
}
