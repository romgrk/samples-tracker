import React from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import { withRouter } from 'react-router'

import size from '../utils/size'
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
    this.state = {
      contextMenuOpen: false,
    }
  }

  componentWillReceiveProps(props) {
  }

  componentWillMount() {
    this.mountNode = this.props.mountNode || document.body
    this.domNode = document.createElement('div')
    this.mountNode.appendChild(this.domNode)
  }

  componentDidMount() {
    steps.push(this)
  }

  componentWillUnmount() {
    steps.splice(steps.findIndex(x => x === this), 1)
    this.mountNode.removeChild(this.domNode)
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

  onRef = (ref) => {
    if (ref === null)
      return
    this.element = ref
  }

  onRefPopup = (ref) => {
    if (ref === null)
      return
    this.popup = ref
  }

  setStatus = (status) => {
    this.props.onChangeStatus(status)
    this.setContextMenuOpen(false)
  }

  getPosition() {
    if (!this.element)
      return { top: size(0), left: size(0) }

    const box = this.element.getBoundingClientRect()

    return {
      top:  size(box.top),
      left: size(box.left + 40),
    }
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
        <button
          className='Step block'
          onContextMenu={this.onContextMenu}
          onClick={this.onClick}
        >
          <span className='content' ref={this.onRef}>
            <StatusIcon name={step.status} />
          </span>
          {
            step.files.length > 0 &&
              <span className='file-marker' />
          }
          {
            step.notes.length > 0 &&
              <span className='notes-marker' />
          }

          {
            createPortal(
              <div
                ref={this.onRefPopup}
                className={'Step__menu Popup' + (contextMenuOpen ? ' open' : '')}
                style={this.getPosition()}
              >
                {
                  Object.values(STATUS)
                  .filter(status =>
                    status !== step.status
                    && status !== STATUS.IN_PROGRESS
                  )
                  .map((status, i) =>
                    <button key={i} className='item' onClick={ev => ev.stopPropagation() || this.setStatus(status)}>
                      <StatusIcon name={status} />
                    </button>
                  )
                }
              </div>,
              this.domNode
            )
          }

        </button>
      </Tooltip>
    )
  }
}

export default withRouter(pure(Step))
