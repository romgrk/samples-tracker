import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'

import uniq from '../utils/uniq'
import getEmails from '../utils/get-emails'
import Label from './Label'
import EditableList from './EditableList'


const Group = styled.div`
  margin-bottom: calc(4 * var(--padding));
`

function Settings({ isLoading, data, onChange, onError }) {

  const onWhitelistAdd = value => {
    const emails = uniq(getEmails(value))
    if (emails.length > 0)
      onChange('whitelist', uniq(data.whitelist.concat(emails)))
    else
      onError(`Couldn't find any email in the input value.`)
  }

  const onWhitelistDelete = value =>
    onChange('whitelist', data.whitelist.filter(v => v !== value))

  return (
    <section className='Settings'>

      <Group>
        <Label>Alert delay</Label>
        <p>Default interval of time after which emails are sent when there is no activity.</p>
        <input type='text' value={data.alertDelay} />
      </Group>

      <Group>
        <Label>Email-Whitelist</Label>
        <p>Emails in this list are allowed to sign up to this application.</p>
        <EditableList
          loading={isLoading}
          values={data.whitelist || []}
          onAdd={onWhitelistAdd}
          onDelete={onWhitelistDelete}
        />
      </Group>

    </section>
  )
}

Settings.propTypes = {
  onChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
}

export default pure(Settings)
