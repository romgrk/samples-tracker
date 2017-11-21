import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import Settings from '../components/Settings'
import GlobalActions from '../actions/global'
import SettingsActions from '../actions/settings'

class SettingsContainer extends React.Component {
  render() {
    console.log(this.props)
    return (
      <Settings
        isLoading={this.props.settings.isLoading}
        data={this.props.settings.data}
        onChange={this.props.update}
        onError={this.props.showError}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  settings: createSelector(state => state.settings, state => state),
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...SettingsActions, ...GlobalActions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
