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
      'small': has(props, 'small'),
      'large': has(props, 'large'),
      'text-info': has(props, 'info'),
      'text-success': has(props, 'success'),
      'text-warning': has(props, 'warning'),
      'text-error': has(props, 'error'),
      'text-muted': has(props, 'muted'),
      'text-highlight': has(props, 'highlight'),
    }
  )

  return (
    <div className={labelClassName} { ...rest }>
      { children }
    </div>
  )
}

function has(props, name) {
  if (((name in props) && props[name] === undefined) || props[name] === true)
    return true
  return false
}


export default pure(Label)
