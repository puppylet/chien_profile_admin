import React, {Component} from 'react'
import {experience, experiences} from '../../../store/models'
import ListItems from '../../components/common/ListItems'
import {Icon} from 'semantic-ui-react'

export default class CompanyList extends Component {
  render () {
    const sortOptions = [
      {value: 'name', text: 'Company Name', isLink: true},
      {value: 'position', text: 'Position'},
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
      itemConfig={experience}
      itemName='Company'
      itemsConfig={experiences}
      route='company'
      search='name'
      sortOptions={sortOptions}/>
  }
}
