import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from './store'
import Routes from './routes'
import registerServiceWorker from './utils/registerServiceWorker'

import 'font-awesome/css/font-awesome.min.css'
import './styles/export-variables.css'
import './styles/reset.css'
import './styles/spinner.css'
import './styles/button.css'
import './styles/badges.css'
import './styles/notifications.css'
import './styles/modal.css'
import './styles/global-styles.css'

import { getNewSample, getNewCompletionFunction } from './models'
import completionFunctions from './actions/completion-functions'
import samples from './actions/samples'
import settings from './actions/settings'
import templates from './actions/templates'
import users from './actions/users'

const store = configureStore()

render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)


Promise.all([
  store.dispatch(completionFunctions.fetch()),
  store.dispatch(samples.fetch()),
  store.dispatch(settings.fetch()),
  store.dispatch(templates.fetch()),
  store.dispatch(users.fetch())
])
.then(() => {
  const state = store.getState()

  // Prefill some data for development testing
  if (process.env.NODE_ENV === 'development' && Object.keys(state.samples.data).length === 0) {

    const newSample = getNewSample(state.templates.data[1].data)
    newSample.tags = ['other', 'tags']
    store.dispatch(samples.create(newSample))
    store.dispatch(samples.create(getNewSample(state.templates.data[2].data)))
    store.dispatch(samples.create(getNewSample(state.templates.data[1].data)))
    store.dispatch(samples.create(getNewSample(state.templates.data[2].data)))

    store.dispatch(completionFunctions.create(getNewCompletionFunction()))
    .then(data => store.dispatch(completionFunctions.update(data.id, { ...data, name: 'has-one-file' })))
    store.dispatch(completionFunctions.create(getNewCompletionFunction()))
    .then(data => store.dispatch(completionFunctions.update(data.id, { ...data, name: 'is-not-john' })))
    store.dispatch(completionFunctions.create(getNewCompletionFunction()))
    .then(data => store.dispatch(completionFunctions.update(data.id, { ...data, name: 'has-some-notes' })))
  }
})



// Register service worker

registerServiceWorker()



// HMR

if (module.hot) {
  module.hot.accept(['./routes'], () => {
    const NextRoutes = require('./routes').default;
    render(
      <Provider store={store}>
        <NextRoutes />
      </Provider>,
      document.querySelector('#root')
    )
  })
  module.hot.accept('./styles/global-styles.css', () => {
    /* eslint-disable global-require */
    require('styles/global-styles.css')
  })
  module.hot.accept('./styles/reset.css', () => {
    /* eslint-disable global-require */
    require('./styles/reset.css')
  })
}
