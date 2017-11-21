import React from 'react'
import pure from 'recompose/pure'

import Icon from './Icon'


function Button(props) {
  const { className, type, children, icon, onClick } = props
  const buttonClassName = [
    'Button',
    type,
    has(props, 'flat') ? 'flat' : undefined,
    className
  ].join(' ').trim()

  return (
    <button className={buttonClassName}
      onClick={onClick}
    >
      { icon !== undefined && <Icon name={icon} /> }
      { children }
    </button>
  )
}

function has(props, name) {
  if (((name in props) && props[name] === undefined) || props[name] === true)
    return true
  return false
}

export default pure(Button)
