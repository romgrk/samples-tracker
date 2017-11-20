import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from './store'
import Routes from './routes'
import registerServiceWorker from './utils/registerServiceWorker'

import 'font-awesome/css/font-awesome.min.css'
import './styles/reset.css'
import './styles/global-styles.css'

render(
  <Provider store={configureStore()}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
