import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'
import Tether from 'tether'
import cuid from 'cuid'

import has from '../utils/has'
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

  componentDidMount() {
    dropdowns.push(this)
  }

  componentWillUnmount() {
    dropdowns.splice(dropdowns.findIndex(x => x === this), 1)
  }

  onDocumentClick(ev) {
    if (!this.element.contains(ev.target))
      this.close()
  }

  onRef = ref => {
    if (ref === null) {
      return
    }
    if (this.tether) {
      this.tether.destroy()
    }

    this.element = ref
    this.tether = new Tether({
      element: `.${this.id} > .Dropdown__content`,
      target: `.${this.id} > :first-child`,
      attachment:       'top left',
      targetAttachment: 'bottom left',
      constraints: [
        {
          to: 'window',
          attachment: 'together'
        }
      ]
    })
  }

  close = () => {
    this.setState({ open: false })
  }

  toggle = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { className, value, loading, children, ...rest } = this.props
    const { open } = this.state

    const dropdownClassName = classname(
      'Dropdown',
      className,
      this.id,
      {
        open: open,
      })

    const trigger =
      React.cloneElement(
        rest.trigger || <Button flat icon='caret-down' />,
        { onClick: this.toggle }
      )

    return (
      <div className={dropdownClassName} ref={this.onRef}>
        { trigger }
        <div className='Dropdown__content'>
          { children }
        </div>
      </div>
    )
  }
}

const defaultExport = pure(Dropdown)
export default defaultExport

defaultExport.Item = function Item({ icon, children, ...rest }) {
  return (
    <button className='item' { ...rest }>
      { icon && <Icon name={icon} /> }
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

