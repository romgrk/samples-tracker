import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'

import * as Interval from '../utils/postgres-interval'
import uniq from '../utils/uniq'
import getEmails from '../utils/get-emails'
import IntervalInput from './IntervalInput'
import Title from './Title'
import EditableList from './EditableList'


const Group = styled.div`
  margin-bottom: calc(4 * var(--padding));
`

class Settings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      alertDelay: {},
      whitelist: {},
    }
    this.componentWillReceiveProps(props)
  }

  componentWillReceiveProps(props) {
    const { data } = props

    const state = {}

    Object.keys(data).forEach(key => {
      const value = data[key]

      if (!value.isLoading) {
        state[key] = value
      } else {
        state[key] = { isLoading: true, data: this.state[key] ? this.state[key].data : value.data }
      }
    })

    this.setState(state)
  }

  changeData = (which, value) => {
    this.setState({ [which]: { ...this.state[which], data: value }})
  }

  onWhitelistAdd = value => {
    const { onChange, onError } = this.props
    const { whitelist } = this.state

    const emails = uniq(getEmails(value))
    if (emails.length > 0)
      onChange('whitelist', uniq(whitelist.data.concat(emails)))
    else
      onError(`Couldn't find any email in the input value.`)
  }

  onWhitelistDelete = value => {
    const { onChange, onError } = this.props
    const { whitelist } = this.state

    onChange('whitelist', whitelist.data.filter(v => v !== value))
  }

  onChangeAlertDelay = value => {
    this.changeData('alertDelay', value)
  }

  onAcceptAlertDelay = () => {
    const value = this.state.alertDelay.data

    if (Interval.isValid(value))
      this.props.onChange('alertDelay', value)
    else
      this.props.onError('Invalid interval', `Use format:\n "1 year 2 months 3 weeks 4 days 5 hours 6 minutes 7 seconds"`)
  }

  render() {
    const {
      isLoading,
      data,
      onChange,
      onError
    } = this.props

    const { alertDelay, whitelist } = this.state

    return (
      <section className='Settings'>

        <Group>
          <Title>Alert delay</Title>
          <p>Default interval of time after which emails are sent when there is no activity.</p>
          <IntervalInput
            value={alertDelay.data}
            loading={alertDelay.isLoading}
            onChange={this.onChangeAlertDelay}
            onAccept={this.onAcceptAlertDelay}
          />
        </Group>

        <Group>
          <Title>Email-Whitelist</Title>
          <p>Emails in this list are allowed to sign up to this application.</p>
          <EditableList
            placeholder='Multiple emails allowed'
            loading={whitelist.isLoading}
            values={whitelist.data || []}
            onAdd={this.onWhitelistAdd}
            onDelete={this.onWhitelistDelete}
          />
        </Group>

      </section>
    )
  }
}

function getLoadable(data, which) {
  if (data[which])
    return data[which]
  return { isLoading: true, data: undefined }
}

Settings.propTypes = {
  onChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
}

export default pure(Settings)
