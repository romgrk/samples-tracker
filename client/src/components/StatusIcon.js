import React from 'react'
import pure from 'recompose/pure'

import STATUS from '../constants/status'
import Icon from './Icon'

const StatusIcon = ({ name }) =>
  name === STATUS.NOT_DONE    ?  <Icon name='circle' subtle /> :
  name === STATUS.IN_PROGRESS ?  <Icon name='circle-o-notch' info /> :
  name === STATUS.DONE        ?  <Icon name='check' success /> :
  name === STATUS.ERROR       ?  <Icon name='warning' error /> :
  name === STATUS.ON_HOLD     ?  <Icon name='hourglass-2' warning /> : undefined

export default pure(StatusIcon)
