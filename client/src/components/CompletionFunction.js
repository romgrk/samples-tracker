import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'

import { getNewCompletionFunction } from '../models'
import Button from './Button'
import EditableLabel from './EditableLabel'
import Editor from './Editor'
import Input from './Input'
import Label from './Label'
//import CompletionFunction from './CompletionFunction'


function CompletionFunction({
  isLoading,
  data,
  onChange,
  onDelete,
  onCreate,
  onError,
  onInfo,
  onSuccess
}) {

  const setName = (name) =>
    onChange({ ...data, name })

  const setCode = (code) =>
    onChange({ ...data, code })

  return (
    <div className='CompletionFunction'>

      <EditableLabel className='CompletionFunction__name'
        value={data.name}
        onEnter={setName}
      />

      <Editor value={data.code} onSave={setCode} />

    </div>
  )
}

CompletionFunction.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default pure(CompletionFunction)
