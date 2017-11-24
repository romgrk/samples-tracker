import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import { set, lensPath } from 'ramda'

import Button from './Button'
import Dropdown from './Dropdown'
import Icon from './Icon'
import Input from './Input'
import Label from './Label'
import Spinner from './Spinner'
import EditableLabel from './EditableLabel'


class Template extends React.Component {
  static propTypes = {
    template: PropTypes.object.isRequired,
  }

  constructor(props) {
    super()

    this.focusLastStep = false
    this.didReceiveStep = false

    const { data } = props.template
    const { name, steps } = data

    this.state = {
      data: {
        ...data,
        name: name || '',
        steps: steps || [],
      },
    }
  }

  componentWillReceiveProps(props) {
    const { data } = props.template
    this.setState({ data })
    if (props.template.data.steps.length > this.props.template.data.steps.length)
      this.didReceiveStep = true
  }

  componentDidUpdate() {
    if (this.focusLastStep && this.didReceiveStep && this.lastStepInput) {
      this.focusLastStep = false
      this.didReceiveStep = false
      this.lastStepInput.setEditing()
    }
  }

  update(data) {
    this.setState({ data })
    this.props.onChange(data.id, data)
  }

  setName = name => {
    const data = { ...this.state.data, name }
    this.update(data)
  }

  setStepName = (i, name) => {
    const data = set(lensPath(['steps', i, 'name']), name,  this.state.data)
    this.update(data)
  }

  addStep = () => {
    const data = { ...this.state.data, steps:
      this.state.data.steps.concat({
        name: 'New Step',
        status: 'NOT_DONE',
        notes: '',
        completionFn: null,
      })
    }
    this.focusLastStep = true
    this.update(data)
  }

  deleteStep = (index) => {
    const data = { ...this.state.data, steps:
      this.state.data.steps.filter((_, i) => i !== index)
    }
    this.update(data)
  }

  deleteTemplate = () => {
    this.props.onDelete(this.state.data.id)
  }

  setLastStepInput = ref => {
    if (ref)
      this.lastStepInput = ref
  }

  createNewFunction = () => {
    throw new Error('unimplemented')
  }

  render() {
    const { template, onChange, onCreate, onError } = this.props
    const { data: { name, steps } } = this.state

    const isLoading = template ? template.isLoading : false

    return (
      <div className='Template'>
        <div className='Template__info vcenter'>
          <EditableLabel onEnter={this.setName} value={name} />
          {
            !isLoading &&
              <Button flat icon='trash' className='delete' onClick={this.deleteTemplate} />
          }
          {
            isLoading &&
              <Spinner />
          }
        </div>
        <div className='Steps'>
          {
            steps.map((step, i) =>
              <div className='TemplateStep center' key={step.id}>
                <EditableLabel
                  value={step.name}
                  onEnter={value => this.setStepName(i, value)}
                  ref={this.setLastStepInput}
                >
                  { step.completionFn &&
                      <span className='text-info'> *</span>
                  }
                </EditableLabel>
                <Dropdown trigger={<Button flat icon='ellipsis-v' />} icons>
                  <Dropdown.Item icon='trash' onClick={() => this.deleteStep(i)}>
                    Delete
                  </Dropdown.Item>
                  <Dropdown.Separator />
                  <Dropdown.Group>
                    Set completion function
                  </Dropdown.Group>
                  {
                  }
                  <Dropdown.Item icon='plus' onClick={this.createNewFunction} disabled>
                    Create new
                  </Dropdown.Item>
                </Dropdown>
              </div>
            )
          }
          <button className='TemplateStep add center' onClick={this.addStep}>
            <Icon name='plus' />
          </button>
        </div>
      </div>
    )
  }
}

export default pure(Template)
