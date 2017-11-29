import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'
import Tether from 'tether'
import cuid from 'cuid'
import { withRouter } from 'react-router'

import STATUS from '../constants/status'
import Badge from './Badge'
import Button from './Button'
import EditableLabel from './EditableLabel'
import Icon from './Icon'
import Input from './Input'
import Label from './Label'
import Spinner from './Spinner'
import StatusIcon from './StatusIcon'
import Tooltip from './Tooltip'

const steps = []

document.addEventListener('click', ev => {
  steps.forEach(d => d.onDocumentClick(ev))
})

class Step extends React.Component {
  constructor(props) {
    super()
    this.id = cuid()
    this.state = {
      contextMenuOpen: false,
    }
  }

  componentWillReceiveProps(props) {
  }

  componentDidMount() {
    steps.push(this)
  }

  componentWillUnmount() {
    steps.splice(steps.findIndex(x => x === this), 1)
  }

  onDocumentClick(ev) {
    if (!this.popup.contains(ev.target))
      this.setContextMenuOpen(false)
  }

  setContextMenuOpen(contextMenuOpen) {
    this.setState({ contextMenuOpen })
  }

  onClick = (ev) => {
    ev.stopPropagation()
    this.props.history.push(`/samples/${this.props.sampleId}/${this.props.index}`)
  }

  onContextMenu = (ev) => {
    ev.preventDefault()
    this.setContextMenuOpen(true)

    steps.forEach(component => {
      if (component !== this)
        component.setContextMenuOpen(false)
    })
  }

  onRefPopup = (ref) => {
    if (ref === null) {
      return
    }
    if (this.tether) {
      this.tether.destroy()
    }

    this.popup = ref
    this.tether = new Tether({
      element: `#${this.id} > .Popup`,
      target: `#${this.id}`,
      attachment:       'top left',
      targetAttachment: 'top right',
      constraints: [
        {
          to: 'window',
          attachment: 'together'
        }
      ]
    })
  }

  setStatus = (status) => {
    this.props.onChangeStatus(status)
    this.setContextMenuOpen(false)
  }

  render() {
    const { step } = this.props
    const { contextMenuOpen } = this.state

    const tooltip = (
      <span>
        { step.name } - <small>{ step.status.isLoading ? 'updating...' : step.status }</small>
      </span>
    )

    return (
      <Tooltip position='top' offset='30px 0' content={tooltip}>
        <button id={this.id}
          className='Step block'
          onContextMenu={this.onContextMenu}
          onClick={this.onClick}
        >
          <StatusIcon name={step.status} />

          <div
            className={'Step__menu Popup' + (contextMenuOpen ? ' open' : '')}
            ref={this.onRefPopup}
          >
            {
              Object.values(STATUS)
              .filter(status =>
                status !== step.status
                && status !== STATUS.IN_PROGRESS
              )
              .map((status, i) =>
                <button key={i} className='item' onClick={() => this.setStatus(status)}>
                  <StatusIcon name={status} />
                </button>
              )
            }
          </div>
        </button>
      </Tooltip>
    )
  }
}

export default withRouter(pure(Step))
