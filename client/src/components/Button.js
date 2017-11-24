import React from 'react'
import pure from 'recompose/pure'
import classname from 'classname'

import Icon from './Icon'
import Spinner from './Spinner'


function Button(props) {
  const {
    className,
    type,
    size,
    loading,
    disabled,
    children,
    icon,
    iconAfter,
    onClick
  } = props

  const buttonClassName = classname(
    'Button',
    className,
    {
      'flat': props.flat,
      'small': props.small,
      'large': props.large,
      'info': props.info,
      'success': props.success,
      'warning': props.warning,
      'error': props.error,
      'muted': props.muted,
      'subtle': props.subtle,
      'highlight': props.highlight,
      [type]: type !== undefined,
      [size]: size !== undefined,
    }
  )

  return (
    <button className={buttonClassName}
      onClick={onClick}
      disabled={loading || disabled}
    >
      { icon !== undefined && <Icon name={icon} /> }
      <span>{ children }</span>
      {
        loading &&
          <Spinner />
      }
      { iconAfter !== undefined && <Icon name={iconAfter} /> }
    </button>
  )
}

export default pure(Button)
