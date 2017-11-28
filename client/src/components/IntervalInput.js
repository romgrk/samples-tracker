import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

import * as Interval from '../utils/postgres-interval'
import Input from './Input'

class IntervalInput extends React.Component {
  constructor(props) {
    super(props)
  }

  onAccept = (ev) => {
    this.props.onAccept()
  }

  render() {
    const {
      className,
      value,
      onAccept,
      ...rest
    } = this.props

    const inputClassName = classname('IntervalInput', className)

    return (
      <Input
        { ...rest }
        autoSelect
        className={inputClassName}
        value={value}
        hasError={!Interval.isValid(value)}
        onEnter={this.onAccept}
        onBlur={this.onAccept}
      />
    )
  }
}



export default pure(IntervalInput)
