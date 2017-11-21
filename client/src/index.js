import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from './store'
import Routes from './routes'
import registerServiceWorker from './utils/registerServiceWorker'

import 'font-awesome/css/font-awesome.min.css'
import './styles/reset.css'
import './styles/global-styles.css'

import settings from './actions/settings'

const store = configureStore()

render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)

console.log(settings)

store.dispatch(settings.fetch())



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
