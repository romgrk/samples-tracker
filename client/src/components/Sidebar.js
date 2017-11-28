import React from 'react'
import { Link } from 'react-router-dom'

import Icon from './Icon'

/*{
   index: 0,
   items: [
     { type: 'item', icon: 'settings', title: 'Settings' },
     { type: 'item', icon: 'view_list' },
     { type: 'item', icon: 'edit' },
     { type: 'fill' },
     { type: 'button', icon: 'help_outline' },
     { type: 'button', icon: 'lock' }
   ],
 }*/

class Sidebar extends React.Component {
  render() {
    const {
      index,
      items,
    } = this.props

    return (
      <div className='Sidebar vbox'>
        {
          items.map((n, i) => {
            switch(n.type) {
              case 'item': {
                return (
                  <Link key={i} className={'Sidebar__item ' + (i === index ? 'active' : '')}
                    to={n.path}
                    title={n.title}
                  >
                    <Icon large name={n.icon} />
                  </Link>
                )
              }
              case 'button': {
                return (
                  <button key={i} className='Sidebar__item ' onClick={n.onClick}>
                    <Icon large name={n.icon} />
                  </button>
                )
              }
              case 'fill': {
                return <div key={i} className='Sidebar__fill' />
              }
              default: throw new Error('unreachable')
            }
          })
        }

        <div className='Sidebar__border' style={{ top: index * 40 }} />
      </div>
    )
  }
}

export default Sidebar
