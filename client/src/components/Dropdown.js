import React from 'react'
import { createPortal, findDOMNode } from 'react-dom'
import pure from 'recompose/pure'
import classname from 'classname'

import size from '../utils/size'
import Button from './Button'
import Icon from './Icon'

const dropdowns = []

document.addEventListener('click', ev => {
  dropdowns.forEach(d => d.onDocumentClick(ev))
})


function Item({ icon, children, ...rest }) {
  return (
    <button className='item' { ...rest }>
      { icon && <Icon name={icon} className='menu' /> }
      { children }
    </button>
  )
}

function Content({ icon, children, ...rest }) {
  return (
    <button className='item' { ...rest }>
      { icon && <Icon name={icon} className='menu' /> }
      { children }
    </button>
  )
}

function Group({ children }) {
  return (
    <div className='group'>
      { children }
    </div>
  )
}

function Separator() {
  return (
    <div className='separator' />
  )
}


class Dropdown extends React.Component {
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

  componentDidMount() {
    dropdowns.push(this)
  }

  componentWillUnmount() {
    dropdowns.splice(dropdowns.findIndex(x => x === this), 1)
    this.mountNode.removeChild(this.domNode)
  }

  onDocumentClick(ev) {
    if (
         !this.element.contains(ev.target)
      && !this.menu.contains(ev.target)
      && this.state.open
    ) {
      this.close()
    }
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
        trigger || <Button iconAfter='chevron-down'>{ this.props.label }</Button>,
        {
          ref: this.onRef,
          onClick: this.toggle,
        }
      )

    const children = React.Children.map(this.props.children, child =>
      child.type !== Item ?
        child :
        React.cloneElement(
          child,
          { onClick: (ev) => { this.close(); child.props.onClick(ev)} }
        )
    )

    return (
      <div className={dropdownClassName}>
        { button }
        {
          createPortal(
            <div className={menuClassName} style={this.getPosition()} ref={ref => ref && (this.menu = ref)}>
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
defaultExport.Item      = Item
defaultExport.Content   = Content
defaultExport.Group     = Group
defaultExport.Separator = Separator
