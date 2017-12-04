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

import { getNewSample } from './models'
import completionFunctions from './actions/completion-functions'
import samples from './actions/samples'
import settings from './actions/settings'
import templates from './actions/templates'

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
  store.dispatch(templates.fetch())
])
.then(() => {
  // Prefill some data for development testing
  if (process.env.NODE_ENV === 'development') {
    const { templates } = store.getState()

    store.dispatch(samples.create(getNewSample(templates.data[1].data)))
    store.dispatch(samples.create(getNewSample(templates.data[2].data)))
    store.dispatch(samples.create(getNewSample(templates.data[1].data)))
    store.dispatch(samples.create(getNewSample(templates.data[2].data)))
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
