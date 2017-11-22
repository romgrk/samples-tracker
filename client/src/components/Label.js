import React from 'react'
import pure from 'recompose/pure'

function Label(props) {
  const { children, className, type, size, ...rest } = props

  const labelClassName = [
    'label',
    type ? `text-${type}` : '',
    has(props, 'small') ? 'small' : undefined,
    has(props, 'info') ? 'text-info' : undefined,
    has(props, 'success') ? 'text-success' : undefined,
    has(props, 'warning') ? 'text-warning' : undefined,
    has(props, 'error') ? 'text-error' : undefined,
    size,
    className
  ].join(' ').trim()

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
