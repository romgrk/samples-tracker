import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

import * as Interval from '../utils/postgres-interval'
import Input from './Input'

class IntervalInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue || '',
    }
  }

  componentWillReceiveProps(props) {
    if (props.defaultValue !== this.props.defaultValue)
      this.setState({ value: props.defaultValue })
  }

  onAccept = (ev) => {
    if (this.props.value) {
      this.props.onAccept()
    }
    else {
      if (Interval.isValid(this.state.value))
        this.props.onAccept && this.props.onAccept(this.state.value)
      else
        this.props.onError && this.props.onError(this.state.value)
    }
  }

  onChange = (value) => {
    this.setState({ value })
    this.props.onChange && this.props.onChange(value)
  }

  render() {
    const {
      className,
      value,
      onAccept,
      ...rest
    } = this.props

    const inputClassName = classname('IntervalInput', className)
    const hasError = !Interval.isValid(value ? value : this.state.value)

    return (
      <Input
        { ...rest }
        autoSelect
        className={inputClassName}
        value={value}
        hasError={hasError}
        onChange={this.onChange}
        onEnter={this.onAccept}
        onBlur={this.onAccept}
      />
    )
  }
}



export default pure(IntervalInput)
