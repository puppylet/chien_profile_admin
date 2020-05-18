import React, {Component, Fragment} from 'react'
import {Table, Segment, Button, Popup, Confirm, Loader, Dimmer, Checkbox, Icon, Input} from 'semantic-ui-react'
import {ChangeTitle} from '../../libs/utils'
import Pagination from '../../components/common/Pagination'
import {Link, withRouter} from 'react-router-dom'
import {toast} from 'react-toastify'
import DropDown from '../../components/common/Dropdown'
import {find, remove} from '../../../store/resourceServices'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'

@withRouter
class ListItems extends Component {
  state = {
    removedItem: {},
    showConfirm: false,
    showBulkConfirm: false,
    isLoading: [],
    loading: false,
    isSearching: false,
    items: [],
    selected: [],
    pageSize: 10,
    sortingField: null,
    sortType: 'DESC',
    searchField: this.props.search,
    searchString: '',
    confirmedSearchString: '',
    total: 0,
    page: 1,
    rectStyle: {
      display: 'none',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    mouseDown: {x: 0, y: 0}
  }

  componentDidMount () {
    const pageSize = parseInt(window.sessionStorage.getItem('pageSize'), 0) || 10
    this.setState({pageSize}, this._getData)
  }

  componentDidUpdate () {
    const currentPage = this.state.page
    const page = this._getPage()
    if (page !== currentPage) {
      this.setState({page}, this._getData)
    }
  }

  componentWillUnmount () {
    window.$('#selectable')
  }

  _getPage = () => {
    const {location} = this.props
    let page = 1
    if (location) {
      const query = location.pathname.split('/')
      const lastParam = query[(query.length - 1)]
      if (lastParam !== 'list') page = parseInt(lastParam, 0)
    }
    return page
  }

  _getData = () => {
    const {itemsConfig} = this.props
    const {pageSize, searchField, sortType, sortingField, searchString} = this.state
    const page = this._getPage()
    const params = {limit: pageSize, page}
    this.setState({loading: true})
    params[searchField] = searchString

    if (sortingField) {
      params.sortType = sortType
      params.sortingField = sortingField
    }
    const $ = window.$
    find(itemsConfig, params).then(res => this.setState({
      items: res.result || res.data,
      total: res.total,
      loading: false,
      isSearching: false,
      selected: []
    }, () => $('#selectable').selectable({
      filter: 'tr',
      cancel: 'a, button, label',
      stop: result => {
        const selectedDom = $('tr.ui-selected')
        const selected = []
        selectedDom.each(item => selected.push($(selectedDom[item]).attr('id').toString()))
        this.setState({selected})
      }
    }))).catch(e => this.setState({loading: false}))
  }

  _showConfirm = (removedItem, e) => {
    e.stopPropagation()
    this.setState({removedItem, showConfirm: true})
  }

  _handleRemove = () => {
    const {removedItem, selected, isLoading} = this.state
    const {itemConfig, itemName} = this.props
    isLoading.push(removedItem._id)
    this.setState({showConfirm: false, isLoading})

    remove(itemConfig, {}, {id: removedItem._id}).then(() => {
      this._getData()
      selected.splice(selected.indexOf(removedItem._id), 1)
      isLoading.splice(isLoading.indexOf(removedItem._id), 1)
      this.setState({selected, isLoading})
      toast.success(`${itemName} [${removedItem.fullName}] removed successfully.`)
    })
  }

  _handleBulkRemove = () => {
    const {selected} = this.state
    const {itemsConfig, itemName} = this.props
    this.setState({isLoading: selected, showBulkConfirm: false})
    remove(itemsConfig, {id: selected}).then(res => {
      toast.success(`selected ${itemName} removed successfully`)
      this.setState({selected: [], isLoading: []}, this._getData)
    })
  }

  _changePageSize = (e, data) => {
    const {history, location, route} = this.props
    window.sessionStorage.setItem('pageSize', data.value)
    if (location.pathname !== `/${pluralize(route)}/list`) history.push(`/${pluralize(route)}/list`)
    this.setState({pageSize: data.value}, this._getData)
  }

  _handleSelect = (e, id) => {
    e.preventDefault()
    const {selected} = this.state
    const index = selected.indexOf(id)
    if (index !== -1) selected.splice(index, 1)
    else selected.push(id)
    this.setState({selected})
  }

  _handleSelectAll = e => {
    e.preventDefault()
    const {selected, items} = this.state
    if (selected.length >= items.length) this.setState({selected: []})
    else this.setState({selected: items.map(item => item._id)})
  }

  _renderSortableHeader = (field, title, width) => {
    const {sortingField, sortType} = this.state
    const isSorting = sortingField === field
    return <Table.HeaderCell
      key={field}
      onClick={() => this._handleSort(field)}
      className={isSorting ? 'is-sorting' : 'no-sort'}
      style={{width: width}}>
      <div className='clearfix'>
        <div className='left'>{title}</div>
        {isSorting && <div className='right'><Icon name={sortType === 'ASC' ? 'angle down' : 'angle up'} /></div>}
      </div>
    </Table.HeaderCell>
  }

  _handleSort = field => {
    const {sortingField, sortType} = this.state
    if (sortingField === field) this.setState({sortType: sortType === 'ASC' ? 'DESC' : 'ASC'}, this._getData)
    else this.setState({sortingField: field}, this._getData)
    this.setState({selected: []})
  }

  _handleSearch = () => {
    const {history, route} = this.props
    this.setState({isSearching: true}, this._getData)
    history.push(`/${pluralize(route)}/list`)
  }

  _handleEnter = e => {
    if (e.keyCode === 13) this._handleSearch()
  }

  render () {
    const {
      isLoading, loading, selected, pageSize, showConfirm, showBulkConfirm, sortingField,
      searchField, searchString, isSearching, items, total
    } = this.state
    const {history, itemName, sortOptions, route} = this.props
    const page = this._getPage()
    const {searchOptions} = sortOptions.filter(option => option.value === searchField)[0]
    ChangeTitle(`${itemName} list`)
    return (
      <div className='list-items'>
        <Segment.Group style={{boxShadow: 'none'}}>
          <Segment color='blue' className='segment-header'>
            <h2>{itemName} manager</h2>
            <div className='clearfix bottom-10' />
            <div className='clearfix'>
              <div className='left'>
                <DropDown
                  value={searchField}
                  style={{width: 120, marginRight: 5}}
                  compact
                  selection
                  onChange={(e, {value}) => this.setState({searchField: value, searchString: ''})}
                  options={sortOptions.filter(option => !option.hidden).map(option => {
                    const {value, text} = option
                    return {text, value}
                  })}
                />
                {!searchOptions && <Input
                  icon='search'
                  loading={isSearching}
                  style={{width: 250, marginRight: 5}}
                  value={searchString}
                  onKeyDown={this._handleEnter}
                  onChange={(e, {value}) => this.setState({searchString: value})}
                  placeholder='Search by' />}
                {searchOptions && <Fragment>
                  <DropDown
                    selection
                    style={{width: 120, marginRight: 5}}
                    value={searchString}
                    options={searchOptions}
                    onChange={(e, {value}) => this.setState({searchString: value})}
                    placeholder='Select to search...'
                  />
                </Fragment>}
                <Button as='span' size='tiny' onClick={this._handleSearch}><Icon name='search' /> Search</Button>
              </div>
              <div className='right'>
                {sortingField && <Button
                  size='tiny'
                  content='Undo sort'
                  onClick={() => this.setState({sortingField: null, selected: []})} />}
                {items && !!items.length && !!selected.length && <Button
                  size='tiny'
                  content={`Remove selected ${itemName}`}
                  negative
                  onClick={() => this.setState({showBulkConfirm: true})} />}
                <Button
                  size='tiny'
                  primary
                  content={`Add ${itemName}`}
                  as={Link}
                  to={`/${pluralize(route)}/new-${route}`} />
              </div>
            </div>
          </Segment>
          {items && items.length === 0 && <Segment>
            {loading ? <div><Loader active inline size='mini' /> &nbsp; Loading {pluralize(itemName)}...</div>
              : <i style={{color: '#999'}}>
                Sorry. There is no data to show.
              </i>}
          </Segment>
          }
        </Segment.Group>

        {items && items.length > 0 && <div style={{position: 'relative'}}>
          <Dimmer active={loading} inverted>
            <Loader inverted>Loading...</Loader>
          </Dimmer>
          <Table style={{marginTop: -15}}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{width: 50}}>
                  <Checkbox
                    checked={selected.length === items.length}
                    indeterminate={selected.length < items.length && selected.length > 0}
                    onChange={this._handleSelectAll}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell style={{width: 50}}>#</Table.HeaderCell>
                {sortOptions.map(option => this._renderSortableHeader(option.value, option.text, option.width || 'auto'))}
                <Table.HeaderCell style={{width: 100, textAlign: 'right'}}>Controls</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body id='selectable'>
              {items.map((item, index) => (
                <Table.Row
                  className={selected.indexOf(item._id) !== -1 ? 'selected-row' : ''}
                  key={index}
                  id={item._id}
                  onClick={(e) => this._handleSelect(e, item._id)}>
                  <Table.Cell><Checkbox checked={selected.indexOf(item._id) !== -1} /></Table.Cell>
                  <Table.Cell>{index + 1}</Table.Cell>
                  {sortOptions.map(option => (
                    <Table.Cell
                      key={option.value}
                      style={option.css || {}}
                      className={sortingField === option.value ? 'is-sorting' : ''}>
                      {option.isLink && <Link to={`/${pluralize(route)}/details/${item._id}`}>{item[option.value]}</Link>}
                      {option.isBoolean && item[option.value] === option.trueValue && <span>{option.true}</span>}
                      {option.isBoolean && item[option.value] !== option.trueValue && <span>{option.false}</span>}
                      {!option.isBoolean && !option.isLink && <span>{item[option.value]}</span>}
                    </Table.Cell>)
                  )}

                  <Table.Cell style={{textAlign: 'right'}}>
                    {isLoading.indexOf(item._id) !== -1
                      ? <div style={{height: 21}}>
                        <Loader active size='mini' inline />
                        <span style={{fontSize: '10px'}}> &nbsp; Removing...</span>
                      </div>
                      : <div>
                        <Popup
                          trigger={<Button
                            onClick={e => e.stopPropagation()}
                            icon='edit' size='mini' as={Link} to={`/${pluralize(route)}/details/${item._id}`} />}
                          content={`View ${itemName} details.`}
                          inverted
                        />
                        <Popup
                          trigger={<Button icon='trash' size='mini' onClick={e => this._showConfirm(item, e)} />}
                          content={`Remove this ${itemName}`}
                          inverted
                        />
                      </div>}

                  </Table.Cell>
                </Table.Row>))}
            </Table.Body>
          </Table>

          <Pagination
            currentPage={page}
            pageSize={pageSize}
            total={total}
            history={history}
            onchangeSize={this._changePageSize}
            url={`/${pluralize(route)}/list`} />
          <Confirm
            size='tiny'
            open={showConfirm}
            content={`Are you sure to remove ${itemName} [${this.state.removedItem.name || this.state.removedItem.fullName}]? This action can not be undone.`}
            cancelButton='No, thanks'
            confirmButton="Yeah! I'm sure"
            onCancel={() => this.setState({showConfirm: false})}
            onConfirm={this._handleRemove}
          />
          <Confirm
            size='tiny'
            open={showBulkConfirm}
            content={`Are you sure to remove selected ${selected.length} ${itemName}s? This action can not be undone.`}
            cancelButton='No, thanks'
            confirmButton="Yeah! I'm sure"
            onCancel={() => this.setState({showBulkConfirm: false})}
            onConfirm={this._handleBulkRemove}
          />
        </div>}
      </div>
    )
  }
}

ListItems.propTypes = {
  itemConfig: PropTypes.any.isRequired,
  itemName: PropTypes.string.isRequired,
  itemsConfig: PropTypes.any.isRequired,
  route: PropTypes.string.isRequired,
  sortOptions: PropTypes.array.isRequired
}

export default ListItems
