import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import { CounterContainer } from 'containers'
import Sidebar from '../components/Sidebar'
import { Header } from 'components'

const Container = styled.div`text-align: center;`

const items = [
  { type: 'item', icon: 'cogs',  path: '/settings',  title: 'Settings' },
  { type: 'item', icon: 'flask', path: '/samples',   title: 'Samples' },
  { type: 'item', icon: 'list',  path: '/templates', title: 'Templates' },
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
              index={items.findIndex(i => i.path === props.location.pathname)}
              items={items}
            />
          }/>
        </div>
        <div className='App__content'>
          <Container>
            <Header />

            <Switch>
              <Route exact path='/' component={CounterContainer} />
              <Route path='/settings' component={CounterContainer} />
            </Switch>
          </Container>
        </div>
      </div>
    </Router>
  )
}

export default Routes
