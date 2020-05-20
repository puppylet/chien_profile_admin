import React, {Component} from 'react'
import {hiring, hirings} from '../../../store/models'
import ListItems from '../../components/common/ListItems'

export default class ClientList extends Component {
  render () {
    const sortOptions = [
      {value: 'title', text: 'Title'},
      {value: 'name', text: 'Hiring Name', isLink: true},
      {value: 'email', text: 'Email'},
      {value: 'phone', text: 'Phone number'},
      {value: 'company', text: 'Company'},
      {value: 'message', text: 'Message'},
      {value: 'created_at', text: 'Time', isTime: true}
    ]
    return <ListItems
      itemConfig={hiring}
      itemName='Hiring'
      itemsConfig={hirings}
      route='hiring'
      search='name'
      disableEditing
      sortOptions={sortOptions}/>
  }
}
