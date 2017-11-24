import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

function Label(props) {
  const { children, className, type, size, ...rest } = props

  const labelClassName = classname(
    'label',
    size,
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
    <div className={labelClassName} { ...rest }>
      { children }
    </div>
  )
}

export default pure(Label)
