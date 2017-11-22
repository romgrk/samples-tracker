import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'

import Button from './Button'
import Input from './Input'
import Label from './Label'
import Spinner from './Spinner'
import EditableLabel from './EditableLabel'


class Samples extends React.Component {
  constructor(props) {
    super()

    const { data, data: { name, steps } } = props

    this.state = {
      data: {
        ...data,
        name: name || '',
        steps: steps || [],
      },
    }
  }

  componentWillReceiveProps(props) {
    const { data } = props
    this.setState({ data })
  }

  setName = name => {
    const data = { ...this.state.data, name }
    this.setState({ data })
    this.props.onChange(data.id, data)
  }

  render() {
    const { isLoading, onChange, onCreate, onError } = this.props
    const { editing } = this.state
    const { name, steps } = this.state.data

    return (
      <div className='Samples'>
        <div className='Template__info vcenter'>
          <EditableLabel onEnter={this.setName} value={name} />
          {
            isLoading &&
              <Spinner />
          }
        </div>
        <div className='Steps'>
          {
            [].map(step =>
              <div className='Step center'>
                <Label small>{ step.name }</Label>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default pure(Samples)
