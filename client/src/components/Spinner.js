import React from 'react'
import pure from 'recompose/pure'

function Spinner(props) {
  let { className, size = 'tiny', ...rest } = props

  if (has(props, 'tiny'))
    size = 'tiny'
  if (has(props, 'small'))
    size = 'small'
  if (has(props, 'medium'))
    size = 'medium'
  if (has(props, 'large'))
    size = 'large'

  const spinnerClassName = [
    `loading-spinner-${size}`,
    size,
    className
  ].join(' ').trim()

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
