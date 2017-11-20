import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import Icon from './Icon'
import Input from './Input'
import Button from './Button'

class List extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    values: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }

  onChange = (ev) => {
    this.props.onChange && this.props.onChange(ev.target.value, ev)
  }

  onKeyDown = (ev) => {
    if (ev.code === 13 /* Enter */) {
      this.props.onEnter && this.props.onEnter(ev.target.value, ev)
    }
  }

  render() {
    const { values, isLoading } = this.props
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
            <Input onEnter={(value) => this.props.onAdd(value)} />
            {
              isLoading && <Icon name='spinner' spin />
            }
          </td>
        </tr>
      </tbody>
      </table>
    )
  }
}

export default List
