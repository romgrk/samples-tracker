import React from 'react'
import pure from 'recompose/pure'
import { set, lensPath } from 'ramda'
import { withRouter } from 'react-router'
import classname from 'classname'

import openFile from '../utils/open-file'
import humanReadableTime from '../utils/human-readable-time'
import * as MimeType from '../utils/mime-type'
import Status from '../constants/status'
import Badge from './Badge'
import Button from './Button'
import Dropdown from './Dropdown'
import DropZone from 'react-drop-zone'
import EditableLabel from './EditableLabel'
import EditableList from './EditableList'
import EditableText from './EditableText'
import Help from './Help'
import Icon from './Icon'
import Input from './Input'
import IntervalInput from './IntervalInput'
import Label from './Label'
import Link from './Link'
import Modal from './Modal'
import Sample from './Sample'
import Spinner from './Spinner'
import StatusIcon from './StatusIcon'
import Text from './Text'
import Time from './Time'
import Title from './Title'
import Tooltip from './Tooltip'


class SampleModal extends React.Component {
  constructor(props) {
    super()

    this.lastMouseOver = undefined
    this.canMouseOver = true

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

      // Sample might be undefined if we're loading the page
      if (sample !== undefined) {
        if (stepIndex > sample.data.steps.length - 1)
          stepIndex = sample.data.steps.length - 1

        step = sample.data.steps[stepIndex]
      }

      if (this.props.id === undefined) {
        this.canMouseOver = false
        setTimeout(() => this.canMouseOver = true, 500)
      }
    }

    this.setState({ id, stepIndex, sample, step })
  }

  closeModal = () => {
    this.props.history.push('/samples')
  }

  gotoStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex <= this.state.sample.data.steps.length - 1) {
      this.props.history.push(`/samples/${this.state.id}/${stepIndex}`)
      this.canMouseOver = false
      setTimeout(() => this.canMouseOver = true, 500)
    }
  }

  update = (data = this.state.sample.data) => {
    this.props.onChange(data.id, data)
  }

  setData = (data) => {
    this.setState({ sample: { ...this.state.sample, data }})
  }

  createNewFunction = () => {
    this.props.history.push('/completions/new')
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
    this.setData(newData)
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

  setStepCompletion = (stepIndex, completionFn) => {
    const data = set(lensPath(['steps', stepIndex, 'completionFn']), completionFn,  this.state.sample.data)
    this.update(data)
  }

  setStepStatus = (stepIndex, status) => {
    this.props.onChangeStatus(this.state.id, stepIndex, status)
  }

  onAddFile = (stepIndex, file) => {
    this.props.addFile(this.state.id, stepIndex, file)
  }

  onDeleteFile = (stepIndex, file) => {
    this.props.deleteFile(this.state.id, stepIndex, file.id)
  }

  onMouseOverStep(stepIndex) {
    if (
      stepIndex !== this.state.stepIndex
      && this.lastMouseOver !== stepIndex
      && this.canMouseOver
    ) {
      this.gotoStep(stepIndex)
      this.lastMouseOver = this.state.stepIndex
      setTimeout(() => this.lastMouseOver = undefined, 250)
    }
  }

  render() {
    const {
      completionFunctions,
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
        className='SampleModal'
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

              { /* Steps Button Bar */ }
              <div className='ButtonGroup hcenter flex-fill'>
              {
                sample.data.steps.map((step, stepIndex) =>
                  <Tooltip content={step.name} delay={500} minWidth='parent'>
                    <Button small
                      highlight={stepIndex === this.state.stepIndex}
                      onClick={() => this.gotoStep(stepIndex)}
                    >
                      { step.name }
                    </Button>
                  </Tooltip>
                )
              }
              </div>

              <div className='StepsModal'>
                <div className='StepsModal__content hbox' style={contentStyle(stepIndex, stepWidth)}>
                  {
                    /* Steps sub-modals */
                    sample.data.steps.map((step, stepIndex) =>
                      <DropZone key={ `${sample.id}:${stepIndex}`} onDrop={(file) => this.onAddFile(stepIndex, file)}>
                        {
                          ({ dragOver, dragOverDocument }) =>

                          <div
                            className={ classname('StepsModal__step', 'drop-zone', {
                              'over': dragOver,
                              'over-document': dragOverDocument,
                            }) }
                            onMouseOver={() => this.onMouseOverStep(stepIndex)}
                            >

                              <table className='StepsModal__status'>
                                <tbody>
                                  <tr>
                                    <td>
                                      <Dropdown trigger={
                                        <Button flat style={{ width: '120px'}}>
                                          <StatusIcon name={step.status} />&nbsp;&nbsp; <Text>{ step.status }</Text>
                                        </Button>
                                      }>
                                        {
                                          Object.values(Status)
                                            .filter(status => status !== step.status
                                                           && status !== Status.IN_PROGRESS)
                                            .map((status, i) =>
                                              <Dropdown.Item key={i} onClick={() => this.setStepStatus(stepIndex, status)}>
                                                <StatusIcon name={status} />&nbsp;&nbsp; <Text normal>{ status }</Text>
                                              </Dropdown.Item>
                                            )
                                        }
                                      </Dropdown>
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
                                <table className='StepsModal__controlsTable'>
                                <tbody>
                                  <tr>
                                    <td>
                                      <Label>Alert delay</Label>
                                    </td>
                                    <td>
                                      <IntervalInput
                                        value={step.alertDelay}
                                        onChange={(alertDelay) => this.setAlertDelay(stepIndex, alertDelay)}
                                        onAccept={this.update}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <Label>Completion Function</Label>
                                    </td>
                                    <td>
                                      <Dropdown label={
                                        step.completionFn ?
                                          completionFunctions.data[step.completionFn].name :
                                          <em>None</em>
                                      } icons>
                                        <Dropdown.Item
                                          icon={ step.completionFn === null ? 'dot-circle-o' : 'circle-o'}
                                          onClick={() => this.setStepCompletion(stepIndex, null)}
                                        >
                                          <em>None</em>
                                        </Dropdown.Item>
                                        {
                                          Object.values(completionFunctions.data).map(completion =>
                                            <Dropdown.Item
                                              icon={ step.completionFn === completion.id ? 'dot-circle-o' : 'circle-o'}
                                              onClick={() => this.setStepCompletion(stepIndex, completion.id)}
                                            >
                                              { completion.name }
                                            </Dropdown.Item>
                                          )
                                        }
                                        <Dropdown.Separator />
                                        <Dropdown.Item icon='plus' onClick={this.createNewFunction}>
                                          Create new
                                        </Dropdown.Item>
                                      </Dropdown>
                                    </td>
                                  </tr>
                                </tbody>
                                </table>
                              </div>


                              <div className='row'>
                                <EditableText
                                  placeHolder='Enter step notes...'
                                  value={step.notes}
                                  onEnter={(notes) => this.setStepNotes(stepIndex, notes)}
                                />
                              </div>

                              <Title>Files</Title>
                              <div className='row'>
                                <EditableList
                                  values={step.files}
                                  onAdd={() => {/* nop */}}
                                  onDelete={file => this.onDeleteFile(stepIndex, file)}
                                  render={file =>
                                    <span>
                                      {
                                        !file.hasError ?
                                          <Icon name={MimeType.iconFor(file.mime)} /> :
                                          <Icon name='warning' error />
                                      } <Link href={`/api/file/read/${file.id}`}>
                                        { file.name }
                                      </Link>
                                    </span>
                                  }
                                  emptyMessage={<Label small muted>No files attached</Label>}
                                  control={
                                    <div>
                                      <Button
                                        style={{ marginTop: 'var(--padding)' }}
                                        onClick={() => openFile().then(file => this.onAddFile(stepIndex, file))}>
                                        Add file
                                      </Button> <Help marginLeft={10}>You can also drag-and-drop a file on this step</Help>
                                    </div>
                                  }
                                />
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
    left: `${-stepIndex * stepWidth}px`
  }
}

export default withRouter(pure(SampleModal))
