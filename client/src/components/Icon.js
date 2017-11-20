import React from 'react'
import pure from 'recompose/pure'

function Icon(props) {
  const { name, className } = props
  const iconClassName = [
    'Icon fa',
    `fa-${name}`,
    has(props, 'spin', 'fa-spin'),
    has(props, 'large', 'fa-lg'),
    className // .join filters undefined
  ].join(' ').trim()
  return (
    <i className={iconClassName} />
  )
}

function has(props, name, value) {
  if (((name in props) && props[name] === undefined) || props[name] === true)
    return value
  return ''
}

export default pure(Icon)
