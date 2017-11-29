import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import CompletionFunctionsContainer from '../containers/CompletionFunctionsContainer'
import NotificationsContainer from '../containers/NotificationsContainer'
import SamplesContainer from '../containers/SamplesContainer'
import SettingsContainer from '../containers/SettingsContainer'
import TemplatesContainer from '../containers/TemplatesContainer'

const items = [
  { type: 'item', icon: 'cogs',  path: '/settings',  title: 'Settings' },
  { type: 'item', icon: 'flask', path: '/samples',   title: 'Samples', showTitle: false },
  { type: 'item', icon: 'list',  path: '/templates', title: 'Templates' },
  { type: 'item', icon: 'code',  path: '/completions', title: 'Completion Functions', showTitle: false },
  { type: 'fill'},
  { type: 'button', icon: 'question-circle', title: 'Help' },
  { type: 'button', icon: 'sign-out', title: 'Sign Out' },
]

function Routes() {
  return (
    <Router>
      <div className='App hbox'>
        <div className='App__sidebar visible'>
          <Route render={(props) =>
            <Sidebar
              index={items.findIndex(i => props.location.pathname.startsWith(i.path))}
              items={items}
            />
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
            <Route exact path='/' render={() => <div>Index</div>} />
            <Route path='/settings' component={SettingsContainer} />
            <Route path='/samples/:id?/:stepIndex?' component={SamplesContainer} />
            <Route path='/templates' component={TemplatesContainer} />
            <Route path='/completions/:id?' component={CompletionFunctionsContainer} />
          </Switch>
        </div>

        <NotificationsContainer />
      </div>
    </Router>
  )
}

export default Routes
