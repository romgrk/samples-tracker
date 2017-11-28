import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'

import humanReadableTime from '../utils/human-readable-time'
import STATUS from '../constants/status'
import Badge from './Badge'
import Button from './Button'
import EditableLabel from './EditableLabel'
import Icon from './Icon'
import Input from './Input'
import Label from './Label'
import Spinner from './Spinner'
import Step from './Step'

class Sample extends React.Component {
  constructor(props) {
    super()

    this.state = {
      data: props.sample.data || {}
    }
  }

  componentWillReceiveProps(props) {
    if (props.sample !== this.state.sample) {
      const { data } = props.sample
      this.setState({ data })
    }
  }

  update(data) {
    this.props.onChange(data.id, data)
    this.setState({ data })
  }

  updateStep(index, step) {
    const steps = [ ...this.state.data.steps ]
    steps[index]= step
    const data = { ...this.state.data, steps }
    this.update(data)
  }

  updateStepStatus(index, status) {
    this.props.onChangeStatus(this.state.data.id, index, status)
  }

  setName = (name) => {
    const data = { ...this.state.data, name }
    this.update(data)
  }

  setNotes = (notes) => {
    const data = { ...this.state.data, notes }
    this.update(data)
  }

  render() {
    const { isLoading } = this.props.sample
    const sample = this.state.data

    return (
      <div className='Sample'>
        <div className='Sample__name'>
          <EditableLabel small
            value={sample.name}
            onEnter={this.setName}
          />
          <Badge info>{sample.tags[0]}</Badge>
          <Spinner visible={isLoading} />
        </div>
        {
          sample.steps.map((step, index) =>
            <Step key={index}
              step={step}
              onChange={data => this.updateStep(index, data)}
              onChangeStatus={status => this.updateStepStatus(index, status)}
            />
          )
        }
        <div className='Sample__fill' />
        <div className='Sample__created line text-center'>
          <small>{ humanReadableTime(sample.created) }</small>
        </div>
        <div className='Sample__modified line text-center'>
          <small>{ humanReadableTime(sample.modified) }</small>
        </div>
        <div className='Sample__notes'>
          <EditableLabel small
            value={sample.notes}
            onEnter={this.setNotes}
          />
        </div>
      </div>
    )
  }
}

export default pure(Sample)
