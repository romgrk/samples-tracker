import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import Icon from './Icon'
import Input from './Input'
import Button from './Button'

class List extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    values: PropTypes.array.isRequired,
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
    if (props.values.includes(this.state.value))
      this.setState({ value: '' })
  }

  render() {
    const { values, loading } = this.props
    const { value } = this.state

    return (
      <table className='List'>
      <tbody>
        {
          values.map(value =>
            <tr className='List__item'>
              <td className='List__value'>{ value }</td>
              <td>
                <Button icon='close' onClick={() => this.props.onDelete(value)}/>
              </td>
            </tr>
          )
        }
        <tr className='List__item'>
          <td className='List__value' colspan='2'>
            <Input
              loading={loading}
              disabled={loading}
              value={value}
              onChange={value => this.setState({ value })}
              onEnter={value => this.props.onAdd(value)}
            />
          </td>
        </tr>
      </tbody>
      </table>
    )
  }
}

export default List
