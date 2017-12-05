import React from 'react'
import pure from 'recompose/pure'

import STATUS from '../constants/status'
import Icon from './Icon'

const StatusIcon = ({ name, showInProgress }) =>
  name.isLoading              ?  <Icon name='circle-o-notch' info spin /> :
  name === STATUS.NOT_DONE    ?  <Icon name='circle' subtle /> :
  name === STATUS.IN_PROGRESS ?  (showInProgress ? <Icon name='circle-o-notch' info /> : <Icon name='circle' subtle />) :
  name === STATUS.DONE        ?  <Icon name='check' success /> :
  name === STATUS.ERROR       ?  <Icon name='warning' error /> :
  name === STATUS.ON_HOLD     ?  <Icon name='hourglass-2' warning /> : null

export default pure(StatusIcon)
