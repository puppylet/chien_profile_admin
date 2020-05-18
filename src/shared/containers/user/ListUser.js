import React, {Component} from 'react'
import {user, users} from '../../../store/models'
import ListItems from '../../components/common/ListItems'
import {Icon} from 'semantic-ui-react'

export default class ListUser extends Component {
  render () {
    const sortOptions = [
      {value: 'fullName', text: 'Full name', isLink: true},
      {value: 'email', text: 'Email'},
      {value: 'userName', text: 'login name'},
      {value: 'phoneNumber', text: 'Phone Number', width: 130},
      {value: 'sex',
        text: 'Gender',
        width: 100,
        isBoolean: true,
        css: {textAlign: 'center'},
        trueValue: 0,
        true: <Icon name='man' style={{color: '#2185D0'}} />,
        false: <Icon name='woman' style={{color: 'pink'}} />,
        searchOptions: [
          {value: 0, text: 'Male'},
          {value: 1, text: 'Female'}
        ]
      },
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
      itemConfig={user}
      itemName='Users'
      itemsConfig={users}
      route='user'
      search='email'
      sortOptions={sortOptions} />
  }
}
