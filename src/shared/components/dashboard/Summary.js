import React, { Component } from 'react'
import {
  Dropdown,
  Card,
  Statistic,
  Icon
} from 'semantic-ui-react'

const options = [
  {
    key: '0',
    value: 'day',
    text: 'Daily'
  },
  {
    key: '4',
    value: 'week',
    text: 'Weekly'
  },
  {
    key: '1',
    value: 'month',
    text: 'Monthly'
  }, {
    key: '2',
    value: 'year',
    text: 'Yearly'
  }
]

const statistics = [
  {
    title: 'Total Views',
    value: 92208,
    itemName: 'views',
    increased: 4
  },
  {
    title: 'Total videos stared',
    value: 56247,
    itemName: 'videos',
    increased: 6
  },
  {
    title: 'Sign up users',
    value: 2204,
    itemName: 'users',
    increased: -3
  },
  {
    title: 'Subscribed users',
    value: 1240,
    itemName: 'users',
    increased: 5
  },
  {
    title: 'Returned users',
    value: 16981,
    itemName: 'users',
    increased: -2
  }
]

class Summary extends Component {
  state = {
    type: 'month',
    open: false
  }

  handleClick = () => this.setState({open: !this.state.open})

  handleClose = () => this.setState({open: false})

  render () {
    const {type} = this.state
    return (
      <div>
        <div className='clearfix bottom-10'>
          <h3 className='segment-title'>
            Summary statistics
          </h3>
          <div className='right' style={{marginTop: 8}}>
            <span>View statistics as: </span>
            <Dropdown
              selectOnNavigation={false}
              style={{fontWeight: 'bold'}}
              options={options}
              value={this.state.type}
              onChange={(e, {value}) => this.setState({type: value})}
            />
          </div>
        </div>
        <div className='clearfix'>
          <Card.Group itemsPerRow={5}>
            {statistics.map(card => <Card
              header={card.title}
              key={card.title}
              description={
                <div style={{marginTop: 10}}>
                  <Statistic horizontal size='tiny'>
                    <Statistic.Value>{card.value.toLocaleString()}</Statistic.Value>
                    <Statistic.Label>{card.itemName}</Statistic.Label>
                  </Statistic>
                  <div style={{color: card.increased > 0 ? 'green' : 'red'}}>
                    <Icon name={'arrow ' + (card.increased > 0 ? 'up' : 'down')}
                      color={card.increased > 0 ? 'green' : 'red'} />
                    {Math.abs(card.increased)}% than {type === 'day' ? 'yesterday' : 'last ' + type}.
                  </div>
                </div>
              }
            />)}
          </Card.Group>
        </div>
      </div>
    )
  }
}

Summary.propTypes = {}
export default Summary
