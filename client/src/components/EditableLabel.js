import React from 'react'
import pure from 'recompose/pure'

import Icon from './Icon'

class EditableLabel extends React.Component {
  constructor() {
    super()
    this.state = {
      editing: false,
    }
  }

  onChange = (ev) => {
    this.props.onChange && this.props.onChange(ev.target.value, ev)
  }

  onKeyDown = (ev) => {
    if (ev.which === 13 /* Enter */) {
      ev.preventDefault()
      this.accept(ev)
    }
    if (ev.which === 27 /* Escape */) {
      ev.preventDefault()
      this.setNotEditing()
    }
  }

  accept = (ev) => {
    if (ev.target.value !== this.props.value)
      this.props.onEnter && this.props.onEnter(ev.target.value, ev)
    this.setNotEditing()
  }

  setNotEditing = () => {
    this.setState({ editing: false })
  }

  setEditing = () => {
    this.setState({ editing: true })
  }

  render() {
    const {
      value,
      className,
      children,
      onEnter,
      small,
      type,
      size,
      ...rest
    } = this.props
    const { editing } = this.state

    const labelClassName = [
      'label editable vcenter',
      type ? `text-${type}` : '',
      has(this.props, 'small') ? 'small' : undefined,
      has(this.props, 'info') ? 'text-info' : undefined,
      has(this.props, 'success') ? 'text-success' : undefined,
      has(this.props, 'warning') ? 'text-warning' : undefined,
      has(this.props, 'error') ? 'text-error' : undefined,
      size,
      className
    ].join(' ').trim()

    const labelProps = {}

    if (editing) {
      return (
        <input type='text'
          className={labelClassName}
          { ...rest }
          defaultValue={value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onBlur={this.accept}
          ref={ref => ref ? ref.select() : undefined}
        />
      )
    }

    return (
      <div className={labelClassName}
          { ...rest }
          onClick={this.setEditing}
        >
        <span>{ value }{ children }</span> <Icon name='pencil' />
      </div>
    )
  }
}

function has(props, name) {
  if (((name in props) && props[name] === undefined) || props[name] === true)
    return true
  return false
}


export default EditableLabel
