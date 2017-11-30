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
    this.setState({ visible: true })
  }

  onMouseOut = ev => {
    this.setState({ visible: false })
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

    const position = this.props.position || 'top'

    if (position === 'bottom')
      return {
        top:  size(box.top + box.height),
        left: size(box.left),
      }
    if (position === 'right')
      return {
        top:  size(box.top),
        left: size(box.left + box.width),
      }
    // default: if (position === 'top')
    return {
      top:  size(box.top - 30), /* we're hardcoding the tooltip height here */
      left: size(box.left),
    }
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
        <div className={tooltipClassName} style={this.getPosition()}>
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
