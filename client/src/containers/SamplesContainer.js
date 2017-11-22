import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import Samples from '../components/Samples'
import GlobalActions from '../actions/global'
import SampleActions from '../actions/samples'

class SamplesContainer extends React.Component {
  render() {
    return (
      <Samples
        isLoading={this.props.samples.isLoading}
        data={this.props.samples.data}
        onCreate={this.props.create}
        onChange={this.props.update}
        onError={this.props.showError}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  samples: createSelector(state => state.samples, state => state),
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...SampleActions, ...GlobalActions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SamplesContainer)
