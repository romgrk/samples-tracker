import React from 'react'
import pure from 'recompose/pure'

function Label({ children }) {
  return (
    <span className='label'>
      { children }
    </span>
  )
}

export default pure(Label)
