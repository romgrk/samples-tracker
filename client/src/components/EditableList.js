import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import arrayEquals from '../utils/array-equals'
import Icon from './Icon'
import Input from './Input'
import Button from './Button'

class EditableList extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    values: PropTypes.array.isRequired,
    control: PropTypes.element,
    render: PropTypes.func,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }

  constructor() {
    super()
    this.state = {
      value: '',
    }
  }

  onChange = (ev) => {
    this.props.onChange && this.props.onChange(ev.target.value, ev)
  }

  onKeyDown = (ev) => {
    if (ev.code === 13 /* Enter */) {
      this.props.onEnter && this.props.onEnter(ev.target.value, ev)
    }
  }

  componentWillReceiveProps(props) {
    if (!arrayEquals(props.values, this.props.values))
      this.setState({ value: '' })
  }

  render() {
    const { values, loading, placeholder } = this.props
    const { value } = this.state

    const control = this.props.control ||
      <Input
        placeholder={placeholder}
        loading={loading}
        disabled={loading}
        value={value}
        onChange={value => this.setState({ value })}
        onEnter={value => this.props.onAdd(value)}
      />

    return (
      <table className='EditableList'>
      <tbody>
        {
          values.map(value =>
            <tr key={value} className='EditableList__item'>
              <td className='EditableList__value'>{ this.props.render ? this.props.render(value) : value }</td>
              <td>
                <Button flat icon='close' onClick={() => this.props.onDelete(value)}/>
              </td>
            </tr>
          )
        }
        <tr className='EditableList__item'>
          <td className='EditableList__value' colSpan='2'>
            { control }
          </td>
        </tr>
      </tbody>
      </table>
    )
  }
}

export default EditableList
