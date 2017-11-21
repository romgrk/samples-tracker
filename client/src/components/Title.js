import React from 'react'
import pure from 'recompose/pure'

function Title(props) {
  const { children, className } = props

  const titleClassName = [
    'title',
    className
  ].join(' ')

  return (
    <div className={titleClassName}>
      { children }
    </div>
  )
}

export default pure(Title)
