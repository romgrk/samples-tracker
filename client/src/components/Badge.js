import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

function Badge(props) {
  const {
    children,
    className,
    type,
    size,
    small,
    large,
    info,
    success,
    warning,
    error,
    muted,
    subtle,
    highlight,
    spin,
    ...rest
  } = props

  const badgeClassName = classname(
    'Badge',
    size,
    type,
    className,
    {
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
    <span className={badgeClassName} { ...rest }>
      { children }
    </span>
  )
}

export default pure(Badge)
