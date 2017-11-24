import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'
import Tether from 'tether'
import cuid from 'cuid'

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

  onContextMenu = (ev) => {
    ev.preventDefault()
    this.setContextMenuOpen(true)
  }

  onRef = (ref) => {
    if (ref === null) {
      return
    }

    this.element = ref
    this.attachTooltip()
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

  onRefTooltip = (ref) => {
    if (ref === null) {
      return
    }

    this.tooltip = ref
    this.attachTooltip()
  }

  attachTooltip() {
    if (!this.element || !this.tooltip)
      return
    this.tooltip.attach(this.element)
  }

  setStatus = (status) => {
    const step = { ...this.props.step, status }
    this.props.onChange(step)
    this.setContextMenuOpen(false)
  }

  render() {
    const { step } = this.props
    const { contextMenuOpen } = this.state

    return (
      <button id={this.id}
        className='Step block'
        onContextMenu={this.onContextMenu}
        ref={this.onRef}
      >
        <Tooltip ref={this.onRefTooltip} position='top'>
          { step.name } - <small>{ step.status }</small>
        </Tooltip>

        <StatusIcon name={step.status} />

        <div
          className={'Step__menu Popup' + (contextMenuOpen ? ' open' : '')}
          ref={this.onRefPopup}
        >
          {
            Object.values(STATUS)
            .filter(status => status !== step.status)
            .map(status =>
              <button className='item' onClick={() => this.setStatus(status)}>
                <StatusIcon name={status} />
              </button>
            )
          }
        </div>
      </button>
    )
  }
}

export default pure(Step)
