import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

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

  setEditing = (ev) => {
    if (ev)
      ev.stopPropagation()
    this.setState({ editing: true })
  }

  render() {
    const {
      value,
      className,
      children,
      onEnter,
      inline,
      size,
      small,
      large,
      info,
      success,
      warning,
      error,
      muted,
      subtle,
      highlight,
      ...rest
    } = this.props
    const { editing } = this.state

    const labelClassName = classname(
      'label editable vcenter',
      size,
      className,
      {
        'small': small,
        'large': large,
        'inline': inline,
        'text-info': info,
        'text-success': success,
        'text-warning': warning,
        'text-error': error,
        'text-muted': muted,
        'text-subtle': subtle,
        'text-highlight': highlight,
      }
    )

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

export default EditableLabel
