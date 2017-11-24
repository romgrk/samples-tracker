import React from 'react'
import classname from 'classname'
import Tether from 'tether'
import cuid from 'cuid'

import has from '../utils/has'
import Button from './Button'
import Icon from './Icon'

class Tooltip extends React.Component {
  constructor(props) {
    super(props)

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

  bind() {
    if (!this.element || !this.target) {
      return
    }

    this.unbind()
    this.target.addEventListener('mouseover', this.onMouseOver)
    this.target.addEventListener('mouseout', this.onMouseOut)

    this.tether = new Tether({
      element: this.element,
      target: this.target,
      ...getPosition(this.props.position),
      constraints: [
        {
          to: 'window',
          attachment: 'together'
        }
      ]
    })
  }

  unbind() {
    if (this.tether)
      this.tether.destroy()

    if (this.target) {
      this.target.removeEventListener('mouseover', this.onMouseOver)
      this.target.removeEventListener('mouseout', this.onMouseOut)
    }
  }

  attach(target) {
    this.target = target
    this.bind()
  }

  onRef = ref => {
    if (ref === null)
      return

    this.element = ref
    this.bind()
  }

  render() {
    const { className, value, loading, children, ...rest } = this.props

    const tooltipClassName = classname(
      'Tooltip',
      className,
      {
        visible: this.state.visible
      }
    )

    return (
      <div className={tooltipClassName} ref={this.onRef}>
        { children }
      </div>
    )
  }
}

function getPosition(position = 'top') {
  if (position === 'top')
    return {
      attachment:       'bottom left',
      targetAttachment: 'top left',
      offset: '30px 0px',
    }

  if (position === 'bottom')
    return {
      attachment:       'top left',
      targetAttachment: 'bottom left',
    }
}

export default Tooltip
