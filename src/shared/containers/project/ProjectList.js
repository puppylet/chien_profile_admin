import React, {Component} from 'react'
import {project, projects} from '../../../store/models'
import ListItems from '../../components/common/ListItems'
import {Icon} from 'semantic-ui-react'

export default class ProjectList extends Component {
  render () {
    const sortOptions = [
      {value: 'name', text: 'Project Name', isLink: true},
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
      itemConfig={project}
      itemName='Project'
      itemsConfig={projects}
      route='project'
      search='name'
      sortOptions={sortOptions}/>
  }
}
