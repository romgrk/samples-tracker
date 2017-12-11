import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

function Title(props) {
  const {
    children,
    className,
    keepCase,
    small,
    large,
  } = props

  const titleClassName = classname(
    'title',
    className,
    {
      'keep-case': keepCase,
      'small': small,
      'large': large,
    }
  )

  return (
    <div className={titleClassName}>
      { children }
    </div>
  )
}

export default pure(Title)
