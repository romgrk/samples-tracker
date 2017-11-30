import React from 'react'
import { createPortal } from 'react-dom'
import pure from 'recompose/pure'
import classname from 'classname'
import Tether from 'tether'
import cuid from 'cuid'

import size from '../utils/size'
import Button from './Button'
import Icon from './Icon'

const modalComponents = []

document.addEventListener('click', ev => {
  modalComponents.forEach(d => d.onDocumentClick(ev))
})



class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.id = cuid()
    this.state = {
      open: false,
    }
  }

  componentDidMount() {
    modalComponents.push(this)
  }

  componentWillMount() {
    this.mountNode = this.props.mountNode || document.body
    this.domNode = document.createElement('div')
    this.mountNode.appendChild(this.domNode)
  }

  componentWillUnmount() {
    modalComponents.splice(modalComponents.findIndex(x => x === this), 1)
    this.mountNode.removeChild(this.domNode)
  }

  onDocumentClick(ev) {
  }

  onKeyDown = (ev) => {
    if (ev.which === 27 /* Escape */) {
      ev.preventDefault()
      ev.stopPropagation()
      this.props.onClose && this.props.onClose()
    }
  }

  onClickBackground = (ev) => {
    this.props.onClose && this.props.onClose()
  }

  close = () => {
    this.setState({ open: false })
  }

  toggle = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const {
      className,
      title,
      open,
      width,
      height,
    } = this.props

    const modalClassName = classname(
      'Modal',
      className,
      {
        open: open,
      })

    const style = {
      width:  size(width),
      height: size(height),
    }

    return createPortal(
      <div id={this.id} className={modalClassName} ref={this.onRef} tabIndex='-1' onKeyDown={this.onKeyDown}>
        <div className='Modal__background' onClick={this.onClickBackground} />
        <div className='Modal__container' style={style}>

          <div className='Modal__header hbox'>
            <div className='Modal__title title fill'>
              { title }
            </div>
            <Button
              className='Modal__close'
              round
              icon='close'
              onClick={this.props.onClose}
            />
          </div>

          <div className='Modal__content'>
            { this.props.children }
          </div>

          <div className='Modal__actions'>
          </div>
        </div>
      </div>
      , this.domNode)
  }
}

const defaultExport = pure(Modal)
export default defaultExport

defaultExport.Title = function Title({ children, ...rest }) {
  return (
    <div className='Modal__title' { ...rest }>
      { children }
    </div>
  )
}

defaultExport.Content = function Content({ children }) {
  return (
    <div className='Modal__content'>
      { children }
    </div>
  )
}

defaultExport.Actions = function Actions({ children }) {
  return (
    <div className='Modal__actions'>
      { children }
    </div>
  )
}

