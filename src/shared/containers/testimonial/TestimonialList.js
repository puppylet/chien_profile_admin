import React, {Component} from 'react'
import {testimonial, testimonials} from '../../../store/models'
import ListItems from '../../components/common/ListItems'

export default class ClientList extends Component {
  render () {
    const sortOptions = [
      {value: 'name', text: 'Name', isLink: true},
      {value: 'position', text: 'Position'},
      {value: 'company', text: 'Company'},
      {value: 'testimonial', text: 'Testimonial'},
      {value: 'created_at', text: 'Time', isTime: true}
    ]
    return <ListItems
      itemConfig={testimonial}
      itemName='Testimonial'
      itemsConfig={testimonials}
      route='testimonial'
      search='name'
      disableEditing
      sortOptions={sortOptions}/>
  }
}
