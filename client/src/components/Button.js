import React from 'react'
import pure from 'recompose/pure'

import Icon from './Icon'


function Button({ className, children, icon, onClick }) {
  const buttonClassName = [
    'Button',
    className
  ].join(' ')

  return (
    <button className={buttonClassName}
      onClick={onClick}
    >
      { icon !== undefined && <Icon name={icon} /> }
      { children }
    </button>
  )
}

export default pure(Button)
