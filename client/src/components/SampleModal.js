import React from 'react'
import pure from 'recompose/pure'
import { withRouter } from 'react-router'
import classname from 'classname'

import humanReadableTime from '../utils/human-readable-time'
import Status from '../constants/status'
import Badge from './Badge'
import Button from './Button'
import Dropdown from './Dropdown'
import DropZone from './DropZone'
import EditableLabel from './EditableLabel'
import EditableText from './EditableText'
import Icon from './Icon'
import Input from './Input'
import IntervalInput from './IntervalInput'
import Label from './Label'
import Modal from './Modal'
import Sample from './Sample'
import Spinner from './Spinner'
import StatusIcon from './StatusIcon'
import Text from './Text'
import Time from './Time'
import Title from './Title'


class SampleModal extends React.Component {
  constructor(props) {
    super()

    this.state = {
      id: undefined,
      stepIndex: undefined,
      sample: undefined,
      step: undefined,
    }
  }

  componentWillReceiveProps(props) {
    let id = this.state.id
    let stepIndex = this.state.stepIndex
    let sample = this.state.sample
    let step = this.state.step

    if (props.id !== this.state.id
    || props.stepIndex !== this.state.stepIndex) {
      id = props.id
      stepIndex = props.stepIndex
    }

    if (props.sample !== this.state.sample && props.sample !== undefined) {
      if (props.sample.isLoading) {
        sample = { isLoading: true, data: sample.data }
      } else {
        sample = props.sample
      }
    }

    if (props.id !== undefined) {
      if (stepIndex === undefined)
        stepIndex = 0
      if (stepIndex > sample.data.steps.length - 1)
        stepIndex = sample.data.steps.length - 1

      step = sample.data.steps[stepIndex]
    }

    this.setState({ id, stepIndex, sample, step })
  }

  closeModal = () => {
    this.props.history.push('/samples')
  }

  gotoStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex <= this.state.sample.data.steps.length - 1)
      this.props.history.push(`/samples/${this.state.id}/${stepIndex}`)
  }

  update(data) {
    this.props.onChange(data.id, data)
  }

  removeTag(tag) {
    const data = this.state.sample.data
    const newData = { ...data, tags: data.tags.filter(v => v !== tag) }
    this.update(newData)
  }

  addTag = (tag) => {
    const data = this.state.sample.data
    const newData = { ...data, tags: data.tags.concat(tag) }
    this.update(newData)
  }

  setName = (name) => {
    const data = this.state.sample.data
    const newData = { ...data, name }
    this.update(newData)
  }

  setNotes = (notes) => {
    const data = this.state.sample.data
    const newData = { ...data, notes }
    this.update(newData)
  }

  setAlertDelay = (stepIndex, alertDelay) => {
    const data = this.state.sample.data
    const steps = [ ...data.steps ]
    steps[stepIndex] = { ...steps[stepIndex], alertDelay }
    const newData = { ...data, steps }
    this.update(newData)
  }

  setStepNotes = (stepIndex, notes) => {
    const data = this.state.sample.data
    const steps = [ ...data.steps ]
    steps[stepIndex] = { ...steps[stepIndex], notes }
    const newData = { ...data, steps }
    this.update(newData)
  }

  setStepStarted = (stepIndex) => {
    const data = this.state.sample.data
    const steps = [ ...data.steps ]
    steps[stepIndex] = { ...steps[stepIndex], started: new Date() }
    const newData = { ...data, steps }
    this.update(newData)
  }

  render() {
    const {
      onChange,
      onChangeStatus,
      onDelete,
      onError
    } = this.props
    const {
      id,
      stepIndex,
      sample,
      step
    } = this.state

    const stepWidth = 700

    return (
      <Modal
        title={
          <EditableLabel value={sample ? sample.data.name : ''} onEnter={this.setName} />
        }
        width={600}
        open={id !== undefined}
        onClose={this.closeModal}
      >
        {
          sample !== undefined &&
            <div>
              <div className='SampleModal__badges'>
                {
                  sample.data.tags.map(tag =>
                    <Badge info>
                      { tag }
                      <Button round flat icon='close' onClick={() => this.removeTag(tag)} />
                    </Badge>
                  )
                }
                <Input
                  className='badge'
                  clearOnEnter
                  onEnter={this.addTag}
                />
              </div>

              <EditableText
                placeHolder='Enter sample notes...'
                value={sample.data.notes}
                onEnter={this.setNotes}
              />

              <div className='StepsModal'>
                <div className='StepsModal__content hbox' style={contentStyle(stepIndex, stepWidth)}>
                  {
                    sample.data.steps.map((step, stepIndex) =>
                      <DropZone>
                        {
                          ({ dragOver, dragOverDocument }) =>

                          <div
                            className={ classname('StepsModal__step', 'drop-zone', {
                              over: dragOver,
                              active: dragOverDocument,
                            }) }
                            >
                              <Label highlight>
                                { step.name }
                              </Label>

                              <table className='StepsModal__status'>
                                <tbody>
                                  <tr>
                                    <td>
                                      <StatusIcon name={step.status} /> <Text>{ step.status }</Text>
                                    </td>
                                    <td>
                                      { step.status === Status.IN_PROGRESS &&
                                          <Text>&nbsp;&nbsp; Since:</Text>
                                      }
                                    </td>
                                    <td>
                                      {
                                        step.status === Status.IN_PROGRESS &&
                                          <Time>{ step.started }</Time>
                                      } {
                                        step.status === Status.IN_PROGRESS &&
                                          <Button small onClick={() => this.setStepStarted(stepIndex)}>Reset</Button>
                                      }
                                    </td>
                                  </tr>

                                  <tr>
                                    <td></td>
                                    <td>
                                      {
                                        step.isOverdue &&
                                          <Icon name='warning' warning />
                                      } {
                                        step.isOverdue &&
                                          <Text>Overdue since:</Text>
                                      }
                                      {
                                        step.isOverdue === false &&
                                          <Text>Will be overdue at:</Text>
                                      }
                                    </td>
                                    <td>
                                      {
                                        step.isOverdue &&
                                          <Time>{ step.overdueAt }</Time>
                                      }
                                      {
                                        step.isOverdue === false &&
                                          <Time>{ step.overdueAt }</Time>
                                      }
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <div className='row'>
                                <Label>Alert delay</Label>
                                <IntervalInput
                                  defaultValue={step.alertDelay}
                                  onAccept={(alertDelay) => this.setAlertDelay(stepIndex, alertDelay)}
                                />
                              </div>

                              <div className='row'>
                                <EditableText
                                  placeHolder='Enter step notes...'
                                  value={step.notes}
                                  onEnter={(notes) => this.setStepNotes(stepIndex, notes)}
                                />
                              </div>

                              <div className='row'>
                                <Title>
                                  Files
                                </Title>
                              </div>

                            </div>
                        }
                      </DropZone>
                    )
                  }
                </div>
                <Button large
                  className='StepsModal__left'
                  icon='chevron-left'
                  onClick={() => this.gotoStep(stepIndex - 1)}
                  disabled={stepIndex <= 0}
                />
                <Button large
                  className='StepsModal__right'
                  icon='chevron-right'
                  onClick={() => this.gotoStep(stepIndex + 1)}
                  disabled={stepIndex >= this.state.sample.data.steps.length - 1}
                />
              </div>

            </div>
        }
      </Modal>
    )
  }
}

function contentStyle(stepIndex, stepWidth) {
  return {
    transform: `translateX(${-stepIndex * stepWidth}px)`
  }
}

export default withRouter(pure(SampleModal))
