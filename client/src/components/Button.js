import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

import Icon from './Icon'
import Spinner from './Spinner'


function Button(props) {
  const {
    className,
    type,
    size,
    flat,
    round,
    small,
    large,
    info,
    success,
    warning,
    error,
    muted,
    subtle,
    highlight,
    loading,
    disabled,
    children,
    icon,
    iconAfter,
    onClick
  } = props

  const buttonClassName = classname(
    'Button',
    className,
    type,
    size,
    {
      'flat': flat,
      'round': round,
      'small': small,
      'large': large,
      'info': info,
      'success': success,
      'warning': warning,
      'error': error,
      'muted': muted,
      'subtle': subtle,
      'highlight': highlight,
    }
  )

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

export default pure(Button)
