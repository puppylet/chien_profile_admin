import React, {Component} from 'react'
import {client, clients} from '../../../store/models'
import ListItems from '../../components/common/ListItems'
import {Icon} from 'semantic-ui-react'

export default class ClientList extends Component {
  render () {
    const sortOptions = [
      {value: 'name', text: 'Client Name', isLink: true},
      {value: 'website', text: 'Website'},
      {value: 'isActive',
        text: 'Active',
        width: 80,
        isBoolean: true,
        css: {textAlign: 'center'},
        trueValue: true,
        true: <Icon name='unlock' style={{color: 'green'}} />,
        false: <Icon name='lock' style={{color: 'red'}} />,
        searchOptions: [
          {value: true, text: 'Active'},
          {value: false, text: 'Inactive'}
        ]
      }
    ]
    return <ListItems
      itemConfig={client}
      itemName='Client'
      itemsConfig={clients}
      route='client'
      search='name'
      sortOptions={sortOptions}/>
  }
}
