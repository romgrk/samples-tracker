import React from 'react'
import pure from 'recompose/pure'

import has from '../utils/has'

class Input extends React.Component {
  onChange = (ev) => {
    this.props.onChange && this.props.onChange(ev.target.value, ev)
  }

  onKeyDown = (ev) => {
    if (ev.which === 13 /* Enter */) {
      this.props.onEnter && this.props.onEnter(ev.target.value, ev)
    }
  }

  onFocus = (ev) => {
    if (has(this.props, 'autoSelect'))
      ev.target.select()
    this.props.onFocus && this.props.onFocus(ev)
  }

  render() {
    const { className, value, loading, onEnter, ...rest } = this.props
    const inputClassName = 'Input' + (className ? ' ' + className : '')
    return (
      <div>
        <input type='text'
          { ...rest }
          className={inputClassName}
          value={value}
          onChange={this.onChange}
          onKeyDown={this.props.onKeyDown || this.onKeyDown}
          onFocus={this.onFocus}
        />
        { loading && <span className='loading-spinner-tiny'/> }
      </div>
    )
  }
}



export default pure(Input)
