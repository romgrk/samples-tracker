import React from 'react'
import pure from 'recompose/pure'

function Label({ children }) {
  return (
    <div className='label'>
      { children }
    </div>
  )
}

export default pure(Label)
