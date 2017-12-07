import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'
import { withRouter } from 'react-router'

import Button from './Button'
import Checkbox from './Checkbox'
import Dropdown from './Dropdown'
import Gap from './Gap'
import Icon from './Icon'
import Input from './Input'
import Label from './Label'
import Modal from './Modal'
import Sample from './Sample'
import Spinner from './Spinner'
import EditableLabel from './EditableLabel'


class Index extends React.Component {

  render() {
    const {
      isLoading,
      isLoggedIn,
      logIn
    } = this.props

    return (
      <Modal width='900px' height='60%' open={!isLoggedIn} showHeader={false}>
        <div className='vbox fill full'>

          <h1 className='hcenter'>Tracking app</h1>

          <div className='fill center'>

            <Button icon='google' error onClick={logIn}>
              Log in with Google
            </Button>

          </div>

        </div>
      </Modal>
    )
  }
}

export default pure(Index)
