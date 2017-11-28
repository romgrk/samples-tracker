import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'
import Tether from 'tether'
import cuid from 'cuid'

import Button from './Button'
import Icon from './Icon'

const modalContainer = document.createElement('div')
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

  componentWillUnmount() {
    modalComponents.splice(modalComponents.findIndex(x => x === this), 1)
  }

  onDocumentClick(ev) {
    if (!this.element.contains(ev.target))
      this.close()
  }

  close = () => {
    this.setState({ open: false })
  }

  toggle = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { className  } = this.props
    const { open } = this.state

    const modalClassName = classname(
      'Modal',
      className,
      {
        open: open,
        'with-icons': this.props.icons,
      })

    return (
      <div id={this.id} className={modalClassName} ref={this.onRef}>
        { button }
        <div className='Modal__content'>
          <div className='Modal__inner'>
            { children }
          </div>
        </div>
      </div>
    )
  }
}

const defaultExport = pure(Modal)
export default defaultExport

defaultExport.Item = function Item({ icon, children, ...rest }) {
  return (
    <button className='item' { ...rest }>
      { icon && <Icon name={icon} className='menu' /> }
      { children }
    </button>
  )
}

defaultExport.Group = function Group({ children }) {
  return (
    <div className='group'>
      { children }
    </div>
  )
}

defaultExport.Separator = function Separator() {
  return (
    <div className='separator' />
  )
}

