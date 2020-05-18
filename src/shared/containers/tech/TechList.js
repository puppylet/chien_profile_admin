import React, {Component} from 'react'
import {tech, techs} from '../../../store/models'
import ListItems from '../../components/common/ListItems'
import {Icon} from 'semantic-ui-react'

export default class TechList extends Component {
  render () {
    const sortOptions = [
      {value: 'name', text: 'Tech Name', isLink: true},
      {value: 'url', text: 'URL'},
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
      itemConfig={tech}
      itemName='Technology'
      itemsConfig={techs}
      route='technology'
      search='name'
      sortOptions={sortOptions}/>
  }
}
