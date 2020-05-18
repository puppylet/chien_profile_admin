import React, {Component} from 'react'
import {ChangeTitle} from '../../libs/utils'
import defaultLogo from '../../../assests/logo.png'
import {toast} from 'react-toastify'
import {techs, experience} from '../../../store/models'
import {getAll, get, put} from '../../../store/resourceServices'
import {withRouter} from 'react-router-dom'
import {Button, Form, Segment, Divider} from 'semantic-ui-react'
import range from 'lodash/range'
import moment from 'moment'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

@withRouter
export default class EditCompany extends Component {
  state = {
    loading: false,
    logo: {
      preview: defaultLogo
    },
    allTechs: [],
    fromMonth: 1,
    fromYear: 2020,
    toMonth: 1,
    toYear: 2020
  }

  componentDidMount () {
    getAll(techs).then(res => {
      this.setState({allTechs: res.data})
      this._getData()
    })
  }

  _getData = () => {
    const {id} = this.props.match.params
    const {avKey} = this.props
    get(experience, {id}).then(res => {
      const {logo, from, to} = res
      const fromDate = moment(from)
      const toDate = moment(to)
      const fromMonth = fromDate.get('month') + 1
      const toMonth = toDate.get('month') + 1
      const fromYear = fromDate.get('year')
      const toYear = toDate.get('year')
      if (logo && logo.length > 0) res.logo = {preview: res.logo + '?' + avKey}
      else res.logo = {preview: defaultLogo}
      this.setState({...this.state, ...res, fromMonth, fromYear, toMonth, toYear})
    })
  }

  _handleChange = (e, {name, value}) => this.setState({[name]: value})

  _handleFileChange = (event) => {
    const {name, value, files} = event.target
    const formContent = {fileName: value}
    const reader = new window.FileReader()
    formContent.file = files[0]
    reader.readAsDataURL(files[0])
    reader.onload = () => {
      formContent.preview = reader.result
      this.setState({[name]: formContent})
    }
  }

  _handleSubmit = (back) => {
    this.setState({loading: true})
    const {logo, name, position, description, tech, fromMonth, fromYear, toMonth, toYear, isCurrent, _id} = this.state
    const data = {name, position, description, tech, isCurrent}
    data.from = moment(`${fromYear}-${fromMonth}-1`)
    if (!isCurrent) data.to = moment(`${toYear}-${toMonth}-1`)
    if (logo.file) data.logo = logo.preview
    put(experience, data, {id: _id}).then(res => {
      this.setState({loading: false})
      if (back) this._goBack()
      toast.success('Update company Success')
    }).catch(err => {
      toast.error(err.data.errmsg)
      this.setState({loading: false})
    })
  }

  _goBack = () => {
    const {history} = this.props
    if (history.length > 2) history.goBack()
    else history.push('/companies/list')
  }

  render () {
    const {logo, name, position, description, fromMonth, fromYear, toMonth, toYear, isCurrent, loading, allTechs, tech} = this.state
    ChangeTitle('Add company')
    return (
      <div className='users main-form'>
        <Segment.Group>
          <Segment color='blue' className='segment-header'>
            <div className='clearfix'>
              <h2 className='left'>Add company</h2>
            </div>
          </Segment>
          <Segment>
            <Form className='users-form clearfix' loading={loading}>
              <div className='avatar'>
                <div className='photo-wrap bottom-10' style={{backgroundImage: 'url(' + logo.preview + ')'}} />
                <label htmlFor='file'><Button as='span' primary fluid content='Add logo' /></label>
                <input id='file' accept='image/*' type='file' name='logo' onChange={this._handleFileChange} />

              </div>
              <div className='general-info'>
                <Form.Input
                  name='name' value={name} placeholder='Company Name' label='Company Name:'
                  onChange={this._handleChange} />
                <Form.Input
                  name='position' value={position} placeholder='Position' label='Position:'
                  onChange={this._handleChange} />
                <Form.TextArea
                  name='description' value={description} autoHeight placeholder='About' label='About:'
                  onChange={this._handleChange} />
                <Form.Select
                  placeholder='Select technologies'
                  label='Technologies used'
                  search
                  selection
                  multiple
                  name='tech'
                  value={tech}
                  options={allTechs.map(t => ({value: t._id, text: t.name, image: {src: t.logo}}))}
                  onChange={this._handleChange}
                />
                <Form.Checkbox
                  checked={isCurrent}
                  label='This is my current job'
                  onChange={(e, {checked}) => this.setState({isCurrent: checked})}
                />
                <Form.Field label='From:' style={{marginBottom: 0}} />

                <Form.Group widths='equal'>
                  <Form.Select
                    name='fromMonth'
                    value={fromMonth}
                    options={months.map((month, i) => ({value: i + 1, text: month}))}
                    onChange={this._handleChange}
                  />
                  <Form.Select
                    name='fromYear'
                    value={fromYear}
                    options={range(2020, 2002).map(year => ({value: year, text: year}))}
                    onChange={this._handleChange}
                  />
                </Form.Group>

                {!isCurrent && <React.Fragment>
                  <Form.Field label='To:' style={{marginBottom: 0}} />
                  <Form.Group widths='equal'>
                    <Form.Select
                      name='toMonth'
                      value={toMonth}
                      options={months.map((month, i) => ({value: i + 1, text: month}))}
                      onChange={this._handleChange}
                    />
                    <Form.Select
                      name='toYear'
                      value={toYear}
                      options={range(2020, 2002).map(year => ({value: year, text: year}))}
                      onChange={this._handleChange}
                    />
                  </Form.Group>
                </React.Fragment>}

              </div>
              <Divider />
              <div className='clearfix'>
                <Button
                  loading={loading} primary content='Save' icon='save' labelPosition='left' type='submit'
                  floated='right'
                  onClick={() => this._handleSubmit(true)} />
                <Button
                  loading={loading} color='green' content='Apply' icon='check' labelPosition='left' type='submit'
                  floated='right' onClick={() => this._handleSubmit(false)} />
                <Button
                  content='Back' icon='left angle' labelPosition='left' floated='right' as='span'
                  onClick={this._goBack} />
              </div>

            </Form>
          </Segment>
        </Segment.Group>
      </div>
    )
  }
}
