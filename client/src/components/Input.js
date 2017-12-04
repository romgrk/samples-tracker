import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

import has from '../utils/has'

class Input extends React.Component {

  accept(ev) {
    this.props.onEnter && this.props.onEnter(ev.target.value, ev)
    if (this.props.clearOnEnter)
      ev.target.value = ''
  }

  onChange = (ev) => {
    this.props.onChange && this.props.onChange(ev.target.value, ev)
  }

  onKeyDown = (ev) => {
    if (ev.which === 13 /* Enter */) {
      this.accept(ev)
    }
    if (ev.which === 32 /* Space */) {
      if (this.props.acceptOnSpace)
        this.accept(ev)
      else if (this.props.onSpace)
        this.props.onSpace(ev.target.value, ev)
    }
  }

  onFocus = (ev) => {
    if (has(this.props, 'autoSelect'))
      ev.target.select()
    this.props.onFocus && this.props.onFocus(ev)
  }

  render() {
    const {
      className,
      value,
      loading,
      autoSelect,
      clearOnEnter,
      hasError,
      onEnter,
      ...rest
    } = this.props

    const inputClassName = classname(
      'Input',
      className,
      {
        error: hasError,
      }
    )

    return (
      <div className={inputClassName}>
        <input type='text'
          { ...rest }
          className='Input__element'
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
