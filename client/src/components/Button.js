import React from 'react'
import pure from 'recompose/pure'

import Icon from './Icon'
import Spinner from './Spinner'


function Button(props) {
  const { className, type, children, icon, iconAfter, onClick } = props
  const buttonClassName = [
    'Button',
    type,
    has(props, 'flat') ? 'flat' : undefined,
    className
  ].join(' ').trim()

  const loading  = has(props, 'loading')
  const disabled = has(props, 'disabled')

  return (
    <button className={buttonClassName}
      onClick={onClick}
      disabled={loading || disabled}
    >
      { icon !== undefined && <Icon name={icon} /> }
      <span>{ children }</span>
      {
        loading &&
          <Spinner />
      }
      { iconAfter !== undefined && <Icon name={iconAfter} /> }
    </button>
  )
}

function has(props, name) {
  if (((name in props) && props[name] === undefined) || props[name] === true)
    return true
  return false
}

export default pure(Button)
