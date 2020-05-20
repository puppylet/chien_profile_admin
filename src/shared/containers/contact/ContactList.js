import React, {Component} from 'react'
import {contact, contacts} from '../../../store/models'
import ListItems from '../../components/common/ListItems'

export default class ClientList extends Component {
  render () {
    const sortOptions = [
      {value: 'title', text: 'Title'},
      {value: 'name', text: 'Contact Name', isLink: true},
      {value: 'email', text: 'Email'},
      {value: 'subject', text: 'Subject'},
      {value: 'message', text: 'Message'},
      {value: 'created_at', text: 'Time', isTime: true}
    ]
    return <ListItems
      itemConfig={contact}
      itemName='Contact'
      itemsConfig={contacts}
      route='contact'
      search='name'
      disableEditing
      sortOptions={sortOptions}/>
  }
}
