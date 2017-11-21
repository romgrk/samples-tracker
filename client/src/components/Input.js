import React from 'react'
import pure from 'recompose/pure'

class Input extends React.Component {
  onChange = (ev) => {
    this.props.onChange && this.props.onChange(ev.target.value, ev)
  }

  onKeyDown = (ev) => {
    if (ev.which === 13 /* Enter */) {
      this.props.onEnter && this.props.onEnter(ev.target.value, ev)
    }
  }

  render() {
    const { className, value } = this.props
    return (
      <input type='text'
        className={className}
        value={value}
        onChange={this.onChange}
        onKeyDown={this.props.onKeyDown || this.onKeyDown}
      />
    )
  }
}

export default pure(Input)
