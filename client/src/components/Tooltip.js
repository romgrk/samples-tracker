import React from 'react'
import { findDOMNode, createPortal } from 'react-dom'
import classname from 'classname'

import size from '../utils/size'
import Button from './Button'
import Icon from './Icon'

class Tooltip extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
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

  onMouseOver = ev => {
    ev.stopPropagation()

    if (this.timeout)
      return;

    if (this.props.delay)
      this.timeout = setTimeout(() =>
        this.setState({ visible: true })
        , this.props.delay)
    else
      this.setState({ visible: true })
  }

  onMouseOut = ev => {
    ev.stopPropagation()

    if (this.timeout)
      this.timeout = clearTimeout(this.timeout)

    this.setState({ visible: false })
  }

  onRef = ref => {
    if (ref === null) {
      if (this.element) {
        this.element.removeEventListener('mouseover', this.onMouseOver)
        this.element.removeEventListener('mouseout', this.onMouseOut)
      }
      return
    }
    this.element = findDOMNode(ref)
    this.element.addEventListener('mouseover', this.onMouseOver)
    this.element.addEventListener('mouseout', this.onMouseOut)
  }

  getStyle() {
    if (!this.element)
      return { top: size(0), left: size(0) }

    const box = this.element.getBoundingClientRect()

    const position = this.props.position || 'top'
    const height = this.props.height || 30 /* we're hardcoding the tooltip height here */

    let style

    if (position === 'bottom')
      style = {
        top:  size(box.top + box.height),
        left: size(box.left),
      }
    else if (position === 'right')
      style = {
        top:  size(box.top),
        left: size(box.left + box.width),
      }
    else // default: if (position === 'top')
      style = {
        top:  size(box.top - height),
        left: size(box.left),
      }

    if (this.props.height)
      style.height = this.props.height

    if (this.props.minWidth === 'parent')
      style.minWidth = box.width
    else if (this.props.minWidth)
      style.minWidth = this.props.minWidth

    if (this.props.minHeight === 'parent')
      style.minHeight = box.height
    else if (this.props.minHeight)
      style.minHeight = this.props.minHeight

    return style
  }

  render() {
    const {
      className,
      value,
      loading,
      children,
      content,
      ...rest
    } = this.props

    const tooltipClassName = classname(
      'Tooltip',
      className,
      {
        visible: this.state.visible
      }
    )

    const child = children
    const childChildren = [...(child.props.children || [])]
    childChildren.push(
      createPortal(
        <div className={tooltipClassName} style={this.getStyle()}>
          { content }
        </div>,
        this.domNode
      )
    )

    return React.cloneElement(child, {
      ref: this.onRef,
      onMouseOver: this.onMouseOver,
      onMouseOut: this.onMouseOut,
    }, childChildren)

  }
}

export default Tooltip
