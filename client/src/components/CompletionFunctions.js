import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import { getNewCompletionFunction } from '../models'
import Button from './Button'
import EditableLabel from './EditableLabel'
import Editor from './Editor'
import Icon from './Icon'
import Label from './Label'
import Spinner from './Spinner'

class CompletionFunctions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFunction: undefined
    }
    this.componentWillReceiveProps(props)
  }

  componentWillReceiveProps(props) {
    if (props.selectedId !== undefined) {
      if (props.selectedId === 'new' && !this.props.isCreating) {
        this.props.history.push('/completions')
        this.createFunction()
      }
      else {
        setTimeout(() =>
          this.setState({
            selectedFunction: props.data[props.selectedId]
          })
        , 10)
      }
    }
  }

  update(selectedFunction) {
    this.setState({ isLoading: true, data: selectedFunction })
    this.props.onChange(selectedFunction.id, selectedFunction)
  }

  getSelectedFunction() {
    return this.props.data[this.props.selectedId]
  }

  setSelectedFunction(selectedId) {
    this.props.history.push(`/completions/${selectedId}`)
  }

  createFunction = () => {
    this.props.onCreate(getNewCompletionFunction())
      .then(({ id }) =>
        this.props.history.push(`/completions/${id}`)
      )
  }

  deleteFunction(id) {
    this.props.onDelete(id)
  }

  setName = (name) => {
    const completion = this.getSelectedFunction().data
    this.update({ ...completion, name })
  }

  setCode = () => {
    const code = this.editor.getValue()
    const completion = this.getSelectedFunction().data
    this.update({ ...completion, code })
  }

  render() {
    const {
      isLoading,
      isCreating,
      data,
      selectedId,
      onError,
      onInfo,
      onSuccess
    } = this.props

    const completionFunctions = Object.values(data)

    const { selectedFunction } = this.state

    return (
      <section className='CompletionFunctions hbox'>

        <div className='CompletionFunctions__list list'>
          <div className='group'>
            Completion Functions
          </div>
          {
            completionFunctions.map(({ isLoading, data: { id, name }}) =>
              <a key={id}
                className={'item' + (id === +selectedId ? ' active' : '')}
                onClick={() => this.setSelectedFunction(id)}
              >
                <div className='content'>
                  <Label inline>{ name }</Label>
                </div>
                {
                  isLoading &&
                    <Spinner />
                }
                {
                  !isLoading &&
                    <Icon
                      className='delete-icon'
                      name='trash'
                      onClick={() => this.deleteFunction(id)}
                    />
                }
              </a>
            )
          }
          {
            completionFunctions.length === 0 &&
              <div className='item disabled'>
                <Label muted>
                  No completion functions yet
                </Label>
              </div>
          }
          <div className='separator' />
          <div className='item'>
            <Button info onClick={this.createFunction} loading={isCreating}>
              Create
            </Button>
          </div>
        </div>

        <div className='CompletionFunctions__editor vbox'>
          <div className='row'>
            <div className='CompletionFunctions__name'>
              {
                selectedFunction !== undefined &&
                <EditableLabel
                  value={selectedFunction.data.name}
                  onEnter={this.setName}
                />
              }
              {
                selectedFunction === undefined &&
                <Label muted>No completion function selected</Label>
              }
            </div>

            <div className='fill' />

            <Button info
              disabled={selectedFunction === undefined}
              loading={selectedFunction ? selectedFunction.isLoading : false}
              onClick={this.setCode}
            >
              Save
            </Button>
          </div>

          <Editor
            className='fill'
            ref={ref => ref && (this.editor = ref)}
            value={selectedFunction ? selectedFunction.data.code : ''}
            onSave={this.setCode}
          />
        </div>

      </section>
    )
  }
}

CompletionFunctions.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  onCreate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default withRouter(CompletionFunctions)
