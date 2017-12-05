import React from 'react'
import { createPortal } from 'react-dom'
import pure from 'recompose/pure'
import classname from 'classname'

import size from '../utils/size'
import Button from './Button'
import Icon from './Icon'


class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  componentWillMount() {
    this.mountNode = this.props.mountNode || document.body
    this.domNode = document.createElement('div')
    this.mountNode.appendChild(this.domNode)
  }

  componentWillUnmount() {
    this.mountNode.removeChild(this.domNode)
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
      small,
      large,
      width,
      height,
      showHeader = true,
      showClose = true,
    } = this.props

    const modalClassName = classname(
      'Modal',
      className,
      {
        open: open,
        small: small,
        large: large,
      })

    const style = {
      width:  size(width),
      height: size(height),
    }

    return createPortal(
      <div id={this.id} className={modalClassName} ref={this.onRef} tabIndex='-1' onKeyDown={this.onKeyDown}>
        <div className='Modal__background' onClick={this.onClickBackground} />
        <div className='Modal__scrollArea' onClick={this.onClickBackground}>
          <div className='Modal__container vbox' style={style} onClick={ev => ev.stopPropagation()}>

            {
              showHeader &&
                <div className='Modal__header hbox'>
                  <div className='Modal__title title fill'>
                    { title }
                  </div>
                  {
                    showClose &&
                      <Button
                        className='Modal__close'
                        round
                        icon='close'
                        onClick={this.props.onClose}
                      />
                  }
                </div>
            }

            <div className='Modal__content'>
              { this.props.children }
            </div>

            <div className='Modal__actions'>
            </div>
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

