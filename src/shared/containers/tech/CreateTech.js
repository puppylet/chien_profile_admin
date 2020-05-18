import React, {Component} from 'react'
import {ChangeTitle} from '../../libs/utils'
import defaultLogo from '../../../assests/logo.png'
import {toast} from 'react-toastify'
import {techs} from '../../../store/models'
import {post} from '../../../store/resourceServices'
import {withRouter} from 'react-router-dom'
import {Button, Form, Segment, Divider} from 'semantic-ui-react'

@withRouter
export default class CreateTech extends Component {
  state = {
    loading: false,
    logo: {
      preview: defaultLogo
    }
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
    const {history} = this.props
    this.setState({loading: true})
    const {logo, name, url, description} = this.state
    const data = {name, url, description}
    if (logo.file) data.logo = logo.preview

    post(techs, data).then(res => {
      if (back) this._goBack()
      else history.push('/technologies/details/' + res._id)
      toast.success('Create tech Success')
    }).catch(err => {
      toast.error(err.data.errmsg)
      this.setState({loading: false})
    })
  }

  _goBack = () => {
    const {history} = this.props
    if (history.length > 2) history.goBack()
    else history.push('/technologies/list')
  }

  render () {
    const {logo, name, url, description, loading} = this.state
    ChangeTitle('Add tech')
    return (
      <div className='users main-form'>
        <Segment.Group>
          <Segment color='blue' className='segment-header'>
            <div className='clearfix'>
              <h2 className='left'>Add technology</h2>
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
                {/* <AutofillRemover type='text' name='techName' /> */}
                <Form.Input
                  name='name' value={name} placeholder='Tech Name' label='Technology Name:'
                  onChange={this._handleChange} />
                <Form.Input
                  name='url' value={url} placeholder='URL' label='URL:'
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
