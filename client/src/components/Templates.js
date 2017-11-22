import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'

import Button from './Button'
import Input from './Input'
import Label from './Label'
import Template from './Template'


const Group = styled.div`
  margin-bottom: calc(4 * var(--padding));
`

function Templates({ isLoading, data, onChange, onCreate, onError }) {

  return (
    <section className='Templates'>

      {
        data.map(template =>
          <Template onChange={onChange} data={template} />
        )
      }

      <br/>

      <Button type='info'>
        Create
      </Button>

    </section>
  )
}

Templates.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  onCreate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default pure(Templates)
