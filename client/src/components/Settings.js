import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'
import { sortBy, prop } from 'ramda'

import * as _ from '../constants/text'
import * as Interval from '../utils/postgres-interval'
import uniq from '../utils/uniq'
import getEmails from '../utils/get-emails'
import Button from './Button'
import EditableLabel from './EditableLabel'
import EditableList from './EditableList'
import Help from './Help'
import Icon from './Icon'
import IntervalInput from './IntervalInput'
import Label from './Label'
import Text from './Text'
import Title from './Title'


const Group = styled.div`
  margin-bottom: calc(6 * var(--padding));
`

class Settings extends React.Component {
  constructor(props) {
    super(props)

    this.state = Object.assign({
      alertDelay: {},
      alertEmails: {},
      whitelist: {},
      archiveInterval: {},
    }, this.parseProps(props))
  }

  componentWillReceiveProps(props) {
    this.setState(this.parseProps(props))
  }

  parseProps(props) {
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

    return state
  }

  changeData = (which, value) => {
    this.setState({ [which]: { ...this.state[which], data: value }})
  }

  onListAdd = (which, value) => {
    const { onChange, onError } = this.props
    const list = this.state[which]

    const emails = uniq(getEmails(value))
    if (emails.length > 0)
      onChange(which, uniq(list.data.concat(emails)))
    else
      onError(`Couldn't find any email in the input value.`)
  }

  onListDelete = (which, value) => {
    const { onChange, onError } = this.props
    const list = this.state[which]

    onChange(which, list.data.filter(v => v !== value))
  }

  onChangeInterval = (which, value) => {
    this.changeData(which, value)
  }

  onAcceptInterval = (which) => {
    const value = this.state[which].data
    if (Interval.isValid(value))
      this.props.onChange(which, value)
    else
      this.props.onError('Invalid interval', _.INTERVAL_FORMAT)
  }

  onDeleteUser = (id) => {
    this.props.deleteUser(id)
  }

  onUpdateUserName = (id, name) => {
    const user = { ...this.props.users.find(u => u.id === id), name }
    this.props.updateUser(id, user)
  }

  onUpdateUserEmail = (id, email) => {
    const user = { ...this.props.users.find(u => u.id === id), email }
    this.props.updateUser(id, user)
  }

  render() {
    const {
      isLoading,
      data,
      users,
      onChange,
      onError
    } = this.props

    const {
      alertDelay,
      archiveInterval,
      alertEmails,
      whitelist
    } = this.state

    return (
      <section className='Settings vbox'>

        <div className='HeaderBar row'>
          <Title large keepCase muted>
            GenAP FOLLOW
          </Title>

          <Title large keepCase>
            Settings
          </Title>
        </div>

        <div className='Settings__content hbox'>
          <div className='Settings__left fill'>
            <Group>
              <Title>Archive-Interval</Title>
              <Text block muted>
                Delay after which completed samples are hidden from the list.
              </Text>
              <IntervalInput
                value={archiveInterval.data}
                loading={archiveInterval.isLoading}
                onChange={value => this.onChangeInterval('archiveInterval', value)}
                onAccept={() => this.onAcceptInterval('archiveInterval')}
              /> <Help>{ _.INTERVAL_FORMAT }</Help>
            </Group>

            <Group>
              <Title>Alert-Delay</Title>
              <Text block muted>
                Default interval of time after which emails are sent when there is no activity.
              </Text>
              <IntervalInput
                value={alertDelay.data}
                loading={alertDelay.isLoading}
                onChange={value => this.onChangeInterval('alertDelay', value)}
                onAccept={() => this.onAcceptInterval('alertDelay')}
              /> <Help>{ _.INTERVAL_FORMAT }</Help>
            </Group>

            <Group>
              <Title>Alert-Emails</Title>
              <Text block muted>
                Emails in this list will receive notifications when a sample is overdue.
              </Text>
              <EditableList
                help='Multiple emails allowed. Press <Enter> to submit.'
                placeHolder='Add email…'
                loading={alertEmails.isLoading}
                values={alertEmails.data || []}
                onAdd={value => this.onListAdd('alertEmails', value)}
                onDelete={value => this.onListDelete('alertEmails', value)}
              />
            </Group>

            <Group>
              <Title>Whitelist</Title>
              <Text block muted>
                Emails in this list are allowed to log-in/sign-up to this application.
              </Text>
              <EditableList
                help='Multiple emails allowed. Press <Enter> to submit.'
                placeHolder='Add email…'
                loading={whitelist.isLoading}
                values={whitelist.data || []}
                onAdd={value => this.onListAdd('whitelist', value)}
                onDelete={value => this.onListDelete('whitelist', value)}
              />
            </Group>
          </div>

          <div className='Settings__right fill'>

            <Title>Users</Title>
            <Text block muted>
              This is the list of users with an account. <br/>
            </Text>

            <table className='table UsersTable'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  sortBy(prop('id'), users).map(user =>
                    <tr>
                      <td>
                        {
                          user.googleId === null ?
                            <Label>{user.name}</Label>
                            :
                            <EditableLabel
                              value={user.name}
                              onEnter={name => this.onUpdateUserName(user.id, name)}
                            />
                        }
                      </td>
                      <td>
                        {
                          user.googleId === null ?
                            <Label>{user.email}</Label>
                            :
                            <EditableLabel
                              value={user.email}
                              onEnter={email => this.onUpdateUserEmail(user.id, email)}
                            />
                        }
                    </td>
                      <td className='button-column'>
                        {
                          user.googleId !== null &&
                            <Button
                              flat
                              square
                              small
                              icon='close'
                              onClick={() => this.onDeleteUser(user.id)}
                            />
                        }
                      </td>
                    </tr>
                  )
                }
                {
                  users.length === 0 &&
                    <tr className='empty'>
                      <td colSpan='3'>
                        No users yet
                      </td>
                    </tr>
                }
              </tbody>
            </table>

          </div>
        </div>

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
