import React from 'react'
import { bindActionCreators } from 'redux'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector, createSelector } from 'reselect'

import GlobalActions from '../actions/global'
import Sidebar from '../components/Sidebar'
import CompletionFunctionsContainer from '../containers/CompletionFunctionsContainer'
import FAQContainer from '../containers/FAQContainer'
import IndexContainer from '../containers/IndexContainer'
import NotificationsContainer from '../containers/NotificationsContainer'
import SamplesContainer from '../containers/SamplesContainer'
import SettingsContainer from '../containers/SettingsContainer'
import TemplatesContainer from '../containers/TemplatesContainer'

const items = [
  { type: 'item', icon: 'cogs',  path: '/settings',  title: 'Settings' },
  { type: 'item', icon: 'flask', path: '/samples',   title: 'Samples', showTitle: false },
  { type: 'item', icon: 'list',  path: '/templates', title: 'Templates' },
  { type: 'item', icon: 'code',  path: '/completions', title: 'Completion Functions', showTitle: false },
]

function Routes({ isLoggedIn, logOut, showFAQ }) {
  return (
    <Router>
      <div className='App hbox'>

        <Route render={(props) =>
          (!isLoggedIn && props.location.pathname !== '/') ?
            <Redirect to='/' /> :
          (isLoggedIn && props.location.pathname === '/') ?
            <Redirect to='/samples' /> :
            null
        }/>

        <div className='App__sidebar'>
          <Route render={(props) =>

            <Sidebar
              visible={isLoggedIn}
              index={items.findIndex(i => props.location.pathname.startsWith(i.path))}
              items={items}
            >
              <Sidebar.Button icon='question-circle' onClick={showFAQ} />
              <Sidebar.Button icon='sign-out' onClick={logOut} />
            </Sidebar>

          }/>
        </div>
        <div className='App__content vbox'>
          <Route render={(props) => {
            const activeItem = items.find(i => i.path === props.location.pathname)

            if (!activeItem || activeItem.title === undefined)
              return <div/>

            document.title = `Tracker - ${activeItem.title}`

            if (activeItem.showTitle === false)
              return <div/>

            return (
              <h1 className='App__section'>{ activeItem.title }</h1>
            )
          } }/>

          <Switch>
            <Route path='/settings' component={SettingsContainer} />
            <Route path='/samples/:id?/:stepIndex?' component={SamplesContainer} />
            <Route path='/templates' component={TemplatesContainer} />
            <Route path='/completions/:id?' component={CompletionFunctionsContainer} />
          </Switch>
        </div>

        <NotificationsContainer />
        <IndexContainer />
        <FAQContainer />
      </div>
    </Router>
  )
}

const mapStateToProps = createStructuredSelector({
  isLoggedIn: createSelector(state => state.ui.loggedIn.value, state => state),
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(GlobalActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)
