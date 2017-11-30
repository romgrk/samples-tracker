import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'
import { withRouter } from 'react-router'

import { getNewSample } from '../models'
import STATUS from '../constants/status'
import Badge from './Badge'
import Button from './Button'
import Dropdown from './Dropdown'
import Icon from './Icon'
import Input from './Input'
import Label from './Label'
import Modal from './Modal'
import Sample from './Sample'
import SampleModal from './SampleModal'
import Spinner from './Spinner'
import EditableLabel from './EditableLabel'


class Samples extends React.Component {

  createNewSample = (template) => {
    this.props.onCreate(getNewSample(template))
  }

  render() {
    const {
      isLoading,
      data,
      templates,
      selectedId,
      selectedStepIndex,
      onChange,
      onChangeStatus,
      onCreate,
      onDelete,
      onError,
      addFile,
      deleteFile
    } = this.props

    const samples = Object.values(data)

    const selectedSample = data[selectedId]

    const newSampleButton =
      <Button info
        loading={templates.isLoading}
        iconAfter={ templates.isLoading ? undefined : 'caret-down' } >
        Create New Sample
      </Button>

    const createSampleDropdown =
      <Dropdown trigger={newSampleButton}>
        {
          templates.data.map(template =>
            <Dropdown.Item key={template.id} onClick={() => this.createNewSample(template)}>
              { template.name }
            </Dropdown.Item>
          )
        }
      </Dropdown>

    return (
      <section className='Samples vbox'>

        <div className='row'>
          { createSampleDropdown }
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
              <div className='Sample__empty text-muted'>
                No sample to display here.
              </div>
          }
        </div>

        <SampleModal
          id={selectedId}
          stepIndex={selectedStepIndex}
          sample={selectedSample}
          onChange={onChange}
          onChangeStatus={onChangeStatus}
          onDelete={onDelete}
          onError={onError}
          addFile={addFile}
          deleteFile={deleteFile}
        />

      </section>
    )
  }
}

export default withRouter(pure(Samples))
