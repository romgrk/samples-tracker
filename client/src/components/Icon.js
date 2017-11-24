import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

function Icon(props) {
  const { name, type, className } = props

  const iconClassName = classname(
    'Icon fa',
    `fa-${name}`,
    className,
    {
      [`text-${type}`] : type !== undefined,
      'small': props.small,
      'large': props.large,
      'text-info': props.info,
      'text-success': props.success,
      'text-warning': props.warning,
      'text-error': props.error,
      'text-muted': props.muted,
      'text-subtle': props.subtle,
      'text-highlight': props.highlight,
    }
  )

  return (
    <i className={iconClassName} />
  )
}

export default pure(Icon)
