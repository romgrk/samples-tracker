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
      onChangeStatus,
      onCreate,
      onDelete,
      onError
    } = this.props

    const samples = Object.values(data)


    const newSampleButton =
      <Button info
        loading={templates.isLoading}
        iconAfter={ templates.isLoading ? undefined : 'caret-down' } >
        Create New Sample
      </Button>

    return (
      <section className='Samples vbox'>

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
            <div className='Sample__name'>Name</div>
            <div className='fill'>&nbsp;</div>
            <div className='Sample__created'>Created</div>
            <div className='Sample__modified'>Modified</div>
            <div className='Sample__notes'>Notes</div>
          </div>
          {
            samples.map(sample =>
              <Sample
                key={sample.data.id}
                sample={sample}
                onChange={onChange}
                onChangeStatus={onChangeStatus}
                onDelete={onDelete}
              />
            )
          }
          {
            samples.length === 0 &&
              <div className='Sample empty text-muted'>
                No sample to display here.
              </div>
          }
        </div>

      </section>
    )
  }
}

export default pure(Samples)
