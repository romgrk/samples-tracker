import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

function Badge(props) {
  const { children, className, type, size, ...rest } = props

  const badgeClassName = classname(
    'Badge',
    size,
    type,
    className,
    {
      'small': props.small,
      'large': props.large,
      'info': props.info,
      'success': props.success,
      'warning': props.warning,
      'error': props.error,
      'muted': props.muted,
      'subtle': props.subtle,
      'highlight': props.highlight,
    }
  )

  return (
    <span className={badgeClassName} { ...rest }>
      { children }
    </span>
  )
}

export default pure(Badge)
