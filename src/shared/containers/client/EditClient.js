import React, {Component} from 'react'
import {ChangeTitle} from '../../libs/utils'
import defaultLogo from '../../../assests/logo.png'
import {toast} from 'react-toastify'
import {client} from '../../../store/models'
import {get, put} from '../../../store/resourceServices'
import {withRouter} from 'react-router-dom'
import {Button, Form, Segment, Divider} from 'semantic-ui-react'

@withRouter
export default class EditClient extends Component {
  state = {
    loading: false,
    logo: {
      preview: defaultLogo
    }
  }

  componentDidMount () {
    this._getData()
  }

  _getData = () => {
    const {id} = this.props.match.params
    const {avKey} = this.props
    get(client, {id}).then(res => {
      if (res.logo && res.logo.length > 0) res.logo = {preview: res.logo + '?' + avKey}
      else res.logo = {preview: defaultLogo}
      this.setState({...this.state, ...res})
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
    const {logo, name, website, description, _id} = this.state
    const data = {name, website, description}
    if (logo.file) data.logo = logo.preview

    put(client, data, {id: _id}).then(res => {
      this.setState({loading: false})
      if (back) this._goBack()
      toast.success('Update client Successfully')
    }).catch(err => {
      toast.error(err.data.errmsg)
      this.setState({loading: false})
    })
  }

  _goBack = () => {
    const {history} = this.props
    if (history.length > 2) history.goBack()
    else history.push('/clients/list')
  }

  render () {
    const {logo, name, website, description, loading} = this.state
    ChangeTitle('Add client')
    return (
      <div className='users main-form'>
        <Segment.Group>
          <Segment color='blue' className='segment-header'>
            <div className='clearfix'>
              <h2 className='left'>Client details</h2>
            </div>
          </Segment>
          <Segment>
            <Form className='users-form clearfix' loading={loading}>
              <div className='avatar'>
                <div className='photo-wrap bottom-10' style={{backgroundImage: 'url(' + logo.preview + ')'}} />
                <label htmlFor='file'><Button as='span' primary fluid content='Change logo' /></label>
                <input id='file' accept='image/*' type='file' name='logo' onChange={this._handleFileChange} />

              </div>
              <div className='general-info'>
                {/* <AutofillRemover type='text' name='clientName' /> */}
                <Form.Input
                  name='name' value={name} placeholder='Client Name' label='Client Name:'
                  onChange={this._handleChange} />
                <Form.Input
                  name='website' value={website} placeholder='WEBSITE' label='WEBSITE:'
                  onChange={this._handleChange} />
                <Form.TextArea
                  name='description' value={description} autoHeight placeholder='About' label='About:'
                  onChange={this._handleChange} />

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
