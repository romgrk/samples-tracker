import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

function Title(props) {
  const {
    children,
    className,
    keepCase,
  } = props

  const titleClassName = classname(
    'title',
    className,
    {
      'keep-case': keepCase,
    }
  )

  return (
    <div className={titleClassName}>
      { children }
    </div>
  )
}

export default pure(Title)
