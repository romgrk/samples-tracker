import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'

import { getNewSample } from '../models'
import STATUS from '../constants/status'
import Button from './Button'
import Dropdown from './Dropdown'
import Icon from './Icon'
import Input from './Input'
import Label from './Label'
import Sample from './Sample'
import Spinner from './Spinner'
import EditableLabel from './EditableLabel'


class Samples extends React.Component {
  constructor(props) {
    super()

    this.state = { }
  }

  createNewSample = (template) => {
    const sample = getNewSample(template)
    this.props.onCreate(sample)
  }

  render() {
    const {
      isLoading,
      data,
      templates,
      onChange,
      onCreate,
      onDelete,
      onError
    } = this.props

    const newSampleButton =
      <Button loading={templates.isLoading} iconAfter={ templates.isLoading ? undefined : 'caret-down' }>
        Create New Sample
      </Button>

    return (
      <div className='Samples'>

        <div className='row'>
          <Dropdown trigger={newSampleButton}>
            {
              templates.data.map(template =>
                <Dropdown.Item key={template.id} onClick={() => this.createNewSample(template)}>
                  { template.name }
                </Dropdown.Item>
              )
            }
          </Dropdown>
        </div>

        <div className='Samples__table bordered'>
          <div className='Samples__header Sample'>
            <div>Name</div>
            <div>&nbsp;</div>
          </div>
          {
            Object.values(data).map(sample =>
              <Sample
                key={sample.id}
                sample={sample}
                onChange={onChange}
                onDelete={onDelete}
              />
            )
          }
        </div>

      </div>
    )
  }
}

export default pure(Samples)
