import { applyMiddleware, createStore } from "redux"
import { cancel } from "redux-saga/effects.js"
import createSagaMiddleware from "redux-saga"

const sagaMiddleware = createSagaMiddleware({
  onError(e, { sagaStack }) {
    console.error(e)
    console.error(sagaStack)
  },
})
const store = createStore((s) => s || {}, applyMiddleware(sagaMiddleware))

export default function saga(generator) {
  return async function () {
    const task = sagaMiddleware.run(function* () {
      const g = generator()
      let state = g.next()
      while (!state.done) {
        const ret = yield state.value
        state = g.next(ret)
      }
      yield cancel()
    })
    await task.toPromise()
  }
}
