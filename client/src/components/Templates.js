import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'

import Button from './Button'
import Input from './Input'
import Label from './Label'


const Group = styled.div`
  margin-bottom: calc(4 * var(--padding));
`

function Templates({ isLoading, data, onChange, onCreate, onError }) {

  return (
    <section className='Templates'>

      {
        data.map(template =>
          <div className='Template'>
            <div className='Template__info vcenter'>
              <Label>{ template.name }</Label>
            </div>
            <div className='Steps'>
              {
                template.steps.map(step =>
                  <div className='Step center'>
                    <Label small>{ step.name }</Label>
                  </div>
                )
              }
            </div>
          </div>
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
