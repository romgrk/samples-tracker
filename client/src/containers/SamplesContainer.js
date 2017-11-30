import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import { fromLoadable } from '../utils/to-loadable'
import Samples from '../components/Samples'
import GlobalActions from '../actions/global'
import SampleActions from '../actions/samples'

class SamplesContainer extends React.Component {
  render() {
    return (
      <Samples
        isLoading={this.props.samples.isLoading}
        data={this.props.samples.data}
        templates={this.props.templates}
        selectedId={this.props.match.params.id ? Number(this.props.match.params.id) : undefined}
        selectedStepIndex={this.props.match.params.stepIndex ? Number(this.props.match.params.stepIndex) : undefined}
        onCreate={this.props.create}
        onChange={this.props.update}
        onChangeStatus={this.props.updateStepStatus}
        onDelete={this.props.delete}
        onError={this.props.showError}
        addFile={this.props.addFile}
        deleteFile={this.props.deleteFile}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  samples: createSelector(state => state.samples, state => state),
  templates: createSelector(state => ({
    isLoading: state.templates.isLoading,
    data: Object.values(fromLoadable(state.templates.data)),
  }), state => state),
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...SampleActions, ...GlobalActions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SamplesContainer)
