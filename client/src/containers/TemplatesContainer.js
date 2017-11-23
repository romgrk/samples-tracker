import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import Templates from '../components/Templates'
import GlobalActions from '../actions/global'
import TemplateActions from '../actions/templates'

class TemplatesContainer extends React.Component {
  render() {
    return (
      <Templates
        isLoading={this.props.templates.isLoading}
        isCreating={this.props.templates.isCreating}
        data={this.props.templates.data}
        onCreate={this.props.create}
        onChange={this.props.update}
        onDelete={this.props.delete}
        onError={this.props.showError}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  templates: createSelector(state => state.templates, state => state),
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TemplateActions, ...GlobalActions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplatesContainer)
