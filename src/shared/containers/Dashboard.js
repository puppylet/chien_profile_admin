import React, { Component } from 'react'
import {ChangeTitle} from '../libs/utils'
import Summary from '../components/dashboard/Summary'
import {Segment, Table, Icon} from 'semantic-ui-react'

class Dashboard extends Component {
  render () {
    ChangeTitle('Dashboard')
    return (
      <div>
        <Summary />
        <Segment.Group>
          <Segment color='blue'>
            <h3>Some dummy text</h3>
          </Segment>
          <Segment>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel nulla vel turpis tincidunt feugiat et vitae felis. Sed in sagittis magna. Quisque velit ex, elementum sed tempor mollis, bibendum quis arcu. Aliquam feugiat, leo nec aliquet rutrum, arcu leo tincidunt mauris, viverra dapibus lectus ipsum ut ipsum. Duis ut quam ultrices, tempor massa eget, aliquam neque. Curabitur vehicula molestie arcu, vel consectetur nulla porttitor eu. Nunc rhoncus mauris in pulvinar malesuada.</p>

            <p>Sed pellentesque metus vitae aliquet aliquam. In euismod nisi diam, vel sodales nisl congue sed. Donec sed nulla at purus pretium ultrices. Nunc placerat pulvinar nibh, id lobortis ipsum posuere in. Integer consequat ligula sed ligula viverra porta. Mauris rutrum tellus eu sollicitudin ultricies. Ut aliquam dictum fermentum. Integer sed feugiat urna. Sed ut sem eu elit fermentum facilisis eget at nulla. Pellentesque a risus commodo justo porttitor volutpat at in quam. Praesent posuere ultrices ex. Morbi dignissim pretium massa, eget tincidunt arcu gravida id. Donec tincidunt nec urna scelerisque malesuada. Cras ultrices tincidunt efficitur. Integer eu aliquam sem, in iaculis turpis.</p>

            <p>Sed egestas metus in orci tristique iaculis. Nam dignissim, arcu sit amet accumsan lobortis, velit odio maximus neque, in hendrerit felis turpis et nulla. Curabitur convallis non diam a pretium. Curabitur placerat magna eu accumsan dictum. Integer dignissim nisl et dui vulputate tincidunt. Vestibulum gravida mauris sit amet nisl cursus lobortis. Ut dignissim, ligula sed posuere maximus, lorem turpis aliquam ligula, eget sodales leo tortor non leo.</p>
          </Segment>
        </Segment.Group>

        <Table striped color='blue'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='3'>Dummy Git Repository</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell collapsing>
                <Icon name='folder' /> node_modules
              </Table.Cell>
              <Table.Cell>Initial commit</Table.Cell>
              <Table.Cell textAlign='right'>10 hours ago</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Icon name='folder' /> test
              </Table.Cell>
              <Table.Cell>Initial commit</Table.Cell>
              <Table.Cell textAlign='right'>10 hours ago</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Icon name='folder' /> build
              </Table.Cell>
              <Table.Cell>Initial commit</Table.Cell>
              <Table.Cell textAlign='right'>10 hours ago</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Icon name='file outline' /> package.json
              </Table.Cell>
              <Table.Cell>Initial commit</Table.Cell>
              <Table.Cell textAlign='right'>10 hours ago</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <Icon name='file outline' /> Gruntfile.js
              </Table.Cell>
              <Table.Cell>Initial commit</Table.Cell>
              <Table.Cell textAlign='right'>10 hours ago</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    )
  }
}

Dashboard.propTypes = {}

export default Dashboard
