import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

function Spinner(props) {
  let { className, size = 'tiny', ...rest } = props

  if (props.tiny)
    size = 'tiny'
  if (props.small)
    size = 'small'
  if (props.medium)
    size = 'medium'
  if (props.large)
    size = 'large'

  const spinnerClassName = classname(
    'Spinner',
    `loading-spinner-${size}`,
    size,
    className,
    {
      hidden: props.visible === false,
    }
  )

  return (
    <span className={spinnerClassName} { ...rest } />
  )
}

function has(props, name) {
  if (((name in props) && props[name] === undefined) || props[name] === true)
    return true
  return false
}


export default pure(Spinner)
