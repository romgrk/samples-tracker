import React from 'react'
import { createPortal, findDOMNode } from 'react-dom'
import pure from 'recompose/pure'
import classname from 'classname'

import size from '../utils/size'
import Button from './Button'
import Icon from './Icon'
import Tooltip from './Tooltip'

const dropdowns = []

document.addEventListener('click', ev => {
  dropdowns.forEach(d => d.onDocumentClick(ev))
})


function Item({ icon, children, ...rest }) {
  return (
    <div className='item' { ...rest }>
      { icon && <Icon name={icon} className='menu' /> }
      { children }
    </div>
  )
}

function SegmentedItem({ icon, children, ...rest }) {
  return (
    <div className={classname('item segmented hbox')} { ...rest }>
      { children }
    </div>
  )
}

function SegmentMain({ icon, children, ...rest }) {
  return (
    <button className='main-button segment fill'>
      { icon && <Icon name={icon} className='menu' /> }
      { children }
    </button>
  )
}

function Segment({ icon, children, center, tooltip, ...rest }) {
  const segment = (
    <button className={classname('segment', { 'text-center': center })} { ...rest }>
      { icon && <Icon name={icon} className='menu' /> }
      { children }
    </button>
  )

  if (!tooltip)
    return segment

  return (
    <Tooltip content={tooltip}>
      { segment }
    </Tooltip>
  )
}

function Content({ icon, children, ...rest }) {
  return (
    <div className='item' { ...rest }>
      { icon && <Icon name={icon} className='menu' /> }
      { children }
    </div>
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
      position: {
        top: 0,
        left: 0
      },
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

  componentDidUpdate() {
    const position = this.getPosition()

    if (position.left !== this.state.position.left
      || position.top !== this.state.position.top)
      this.setState({ position })
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
      return { top: 0, left: 0 }

    const element = this.element.getBoundingClientRect()
    const inner    = this.inner.getBoundingClientRect()

    if (this.props.position === 'left')
      return {
        top:  element.top + element.height,
        left: element.left - inner.width + element.width,
      }

    return {
      top:  element.top + element.height,
      left: element.left,
    }
  }

  close = () => {
    const isControlled = 'open' in this.props

    if (isControlled)
      this.props.onClose && this.props.onClose()
    else
      this.setState({ open: false })
  }

  toggle = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const {
      className,
      value,
      loading,
      inline,
      trigger,
      onClick,
    } = this.props

    const isControlled = 'open' in this.props
    const open = isControlled ? this.props.open : this.state.open

    const dropdownClassName = classname(
      'Dropdown',
      className,
      {
        'open': open,
        'with-icons': this.props.icons,
        'inline': inline,
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
          ref: ref => {
            this.onRef(ref)
            if (trigger && typeof trigger.ref === 'function')
              trigger.ref(ref)
          },
          ...(isControlled ? { onClick: onClick } : { onClick: this.toggle }),
        }
      )

    const children = React.Children.map(this.props.children, child =>
      child.type !== Item && child.type !== SegmentedItem ?
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
            <div className={menuClassName}
                style={this.state.position}
                ref={ref => ref && (this.menu = findDOMNode(ref))}
            >
              <div className='Dropdown__inner' ref={ref => ref && (this.inner = findDOMNode(ref))}>
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

defaultExport.Item          = Item
defaultExport.SegmentedItem = SegmentedItem
defaultExport.SegmentMain   = SegmentMain
defaultExport.Segment       = Segment
defaultExport.Content       = Content
defaultExport.Group         = Group
defaultExport.Separator     = Separator
