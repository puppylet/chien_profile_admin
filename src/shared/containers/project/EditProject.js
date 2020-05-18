import React, {Component} from 'react'
import {ChangeTitle} from '../../libs/utils'
import defaultLogo from '../../../assests/logo.png'
import {toast} from 'react-toastify'
import {projects, project, clients, techs} from '../../../store/models'
import {getAll, get, put, post} from '../../../store/resourceServices'
import {withRouter} from 'react-router-dom'
import {Button, Form, Segment, Divider, Icon} from 'semantic-ui-react'

@withRouter
export default class EditProject extends Component {
  state = {
    loading: false,
    allTechs: [],
    allClients: [],
    logo: {
      preview: defaultLogo
    },
    photos: []
  }

  componentDidMount () {
    getAll(techs).then(res => {
      this.setState({allTechs: res.data})
    })

    getAll(clients).then(res => {
      this.setState({allClients: res.data})
    })

    this._getData()
  }

  _getData = () => {
    const {id} = this.props.match.params
    get(project, {id}).then(res => {
      if (res.logo && res.logo.length > 0) res.logo = {preview: res.logo + '?' + new Date().getTime()}
      else res.logo = {preview: defaultLogo}
      this.setState({...this.state, ...res})
    })
  }

  _handleChange = (e, {name, value}) => this.setState({[name]: value})

  _handleFileChange = event => {
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
    const {logo, name, website, description, tech, client, _id: id} = this.state
    const data = {name, website, description, tech, client}
    if (logo.file) data.logo = logo.preview

    put(projects, data, {id}).then(res => {
      this.setState({loading: false})
      if (back) this._goBack()
      toast.success('Update project Successfully')
    }).catch(err => {
      toast.error(err.data.errmsg)
      this.setState({loading: false})
    })
  }

  _goBack = () => {
    const {history} = this.props
    if (history.length > 2) history.goBack()
    else history.push('/projects/list')
  }

  _handlePhotoChange = event => {
    this.setState({loading: true})
    const {_id: id} = this.state
    const {value, files} = event.target
    const formContent = {fileName: value}
    const reader = new window.FileReader()
    formContent.file = files[0]
    reader.readAsDataURL(files[0])
    reader.onload = () => {
      const photo = reader.result
      post(project, {photo}, {id}).then(res => this.setState({photos: res.photos, loading: false}))
    }
  }

  render () {
    const {logo, name, website, description, loading, tech, allTechs, allClients, client, photos} = this.state
    ChangeTitle('Add project')
    return (
      <div className='users main-form'>
        <Segment.Group>
          <Segment color='blue' className='segment-header'>
            <div className='clearfix'>
              <h2 className='left'>Add project</h2>
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
                  name='name' value={name} placeholder='Project Name' label='Project Name:'
                  onChange={this._handleChange} />
                <Form.Input
                  name='website' value={website} placeholder='Website' label='Website:'
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

                <Form.Select
                  placeholder='Select clients'
                  label='Clients'
                  search
                  selection
                  multiple
                  name='client'
                  value={client}
                  options={allClients.map(t => ({value: t._id, text: t.name, image: {src: t.logo}}))}
                  onChange={this._handleChange}
                />
                <Form.TextArea
                  name='description' value={description} autoHeight placeholder='About' label='About:'
                  onChange={this._handleChange} />
                <Form.Field label='Photos:' style={{marginBottom: 0}}/>

                <div className='project-photos'>
                  {photos.map(photo => <div className='project-photo' style={{backgroundImage: 'url(' + photo + ')'}} />)}
                  <div className='project-photo' />
                  <div className='project-photo' />
                  <div className='project-photo' />
                  <div className='project-photo' />
                  <div className='project-photo' />
                  <div className='project-photo' />
                  <div className='project-photo' />
                  <div className='project-photo' />
                  <div className='project-photo' />
                  <div className='project-photo' />
                  <label htmlFor='photo' className='project-photo'><Icon name='plus' /></label>
                  <input id='photo' accept='image/*' type='file' name='logo' onChange={this._handlePhotoChange} />
                </div>
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
