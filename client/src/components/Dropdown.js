import React from 'react'
import { createPortal, findDOMNode } from 'react-dom'
import pure from 'recompose/pure'
import classname from 'classname'
import Tether from 'tether'
import cuid from 'cuid'

import size from '../utils/size'
import Button from './Button'
import Icon from './Icon'

const dropdowns = []

document.addEventListener('click', ev => {
  dropdowns.forEach(d => d.onDocumentClick(ev))
})

class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    this.id = cuid()
    this.state = {
      open: false,
    }
  }

  componentWillMount() {
    this.mountNode = this.props.mountNode || document.body
    this.domNode = document.createElement('div')
    this.mountNode.appendChild(this.domNode)
  }

  componentDidMount() {
    dropdowns.push(this)
  }

  componentWillUnmount() {
    dropdowns.splice(dropdowns.findIndex(x => x === this), 1)
    this.mountNode.removeChild(this.domNode)
  }

  onDocumentClick(ev) {
    if (!this.element.contains(ev.target))
      this.close()
  }

  onRef = ref => {
    if (ref === null)
      return

    this.element = findDOMNode(ref)
  }

  getPosition() {
    if (!this.element)
      return { top: size(0), left: size(0) }

    const box = this.element.getBoundingClientRect()

    return {
      top:  size(box.top + box.height),
      left: size(box.left),
    }
  }

  close = () => {
    this.setState({ open: false })
  }

  toggle = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { className, value, loading, trigger  } = this.props
    const { open } = this.state

    const dropdownClassName = classname(
      'Dropdown',
      className,
      {
        'open': open,
        'with-icons': this.props.icons,
      })

    const menuClassName = classname(
      'Dropdown__menu',
      className,
      {
        'open': open,
        'with-icons': this.props.icons,
      })

    const button =
      React.cloneElement(
        trigger || <Button flat icon='caret-down' />,
        {
          ref: this.onRef,
          onClick: this.toggle,
        }
      )

    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(
        child,
        { onClick: (ev) => { this.close(); child.props.onClick(ev)} }
      )
    )

    return (
      <div id={this.id} className={dropdownClassName}>
        { button }
        {
          createPortal(
            <div className={menuClassName} style={this.getPosition()}>
              <div className='Dropdown__inner'>
                { children }
              </div>
            </div>
            , this.domNode)
        }
      </div>
    )
  }
}

const defaultExport = pure(Dropdown)
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

