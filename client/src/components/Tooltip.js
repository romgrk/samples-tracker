import React from 'react'
import { findDOMNode } from 'react-dom'
import classname from 'classname'
import Tether from 'tether'
import cuid from 'cuid'

import has from '../utils/has'
import Button from './Button'
import Icon from './Icon'

class Tooltip extends React.Component {
  constructor(props) {
    super(props)

    this.id = cuid()
    this.state = {
      visible: false,
    }
  }

  onMouseOver = ev => {
    this.setState({ visible: true })
  }

  onMouseOut = ev => {
    this.setState({ visible: false })
  }

  onRef = ref => {
    if (ref === null)
      return;

    if (this.tether)
      this.tether.destroy()

    this.target = findDOMNode(ref)
    this.tether = new Tether({
      element: `#${this.id}`,
      target: this.target,
      ...getPosition(this.props.position, this.props.offset),
      constraints: [
        {
          to: 'window',
          attachment: 'together'
        }
      ]
    })
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
      <div id={this.id} className={tooltipClassName}>
        { content }
      </div>
    )

    return React.cloneElement(child, {
      ref: this.onRef,
      onMouseOver: this.onMouseOver,
      onMouseOut: this.onMouseOut,
      style: Object.assign(child.props.style || {}, { position: 'relative' })
    }, childChildren)

  }
}

function getPosition(position = 'top', offset = '0 0') {
  if (position === 'top')
    return {
      attachment:       'bottom left',
      targetAttachment: 'top left',
      offset: offset,
    }

  if (position === 'bottom')
    return {
      attachment:       'top left',
      targetAttachment: 'bottom left',
      offset: offset,
    }
}

export default Tooltip
