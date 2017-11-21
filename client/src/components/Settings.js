import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'

import Label from './Label'
import EditableList from './EditableList'

const Line = ({ children }) =>
  <div className='line'>
    { children }
  </div>

function Settings({ data, onChange }) {
  return (
    <section>

      <Line>
        <Label>Default alert delay</Label>
        <input type='text' value={data.alertDelay} />
      </Line>

      <Label>Email-Whitelist</Label>
      <EditableList
        values={data.whitelist || []}
        onAdd={value => onChange('whitelist', data.whitelist.concat(value))}
        onDelete={value => onChange('whitelist', data.whitelist.filter(v => v === value))}
      />

    </section>
  )
}

Settings.propTypes = {
  onChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
}

export default Settings
