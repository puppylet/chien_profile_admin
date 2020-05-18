import React, {Component} from 'react'
import {ChangeTitle, validatePhone, validateEmail} from '../../libs/utils'
import defaultAvatar from '../../../assests/avatar.jpg'
import DateTime from 'react-datetime'
import DropDown from '../../components/common/Dropdown'
import {toast} from 'react-toastify'
import {users} from '../../../store/models'
import {post} from '../../../store/resourceServices'
import {withRouter} from 'react-router-dom'
import {Button, Form, Segment, Divider} from 'semantic-ui-react'
import AutofillRemover from '../../components/common/AutofillRemover'

@withRouter
export default class CreateUser extends Component {
  state = {
    loading: false,
    avatar: {
      preview: defaultAvatar
    },
    birthday: new Date(),
    password: ''
  }

  _handleChange = (e, {name, value}) => this.setState({[name]: value})

  _handleDateChange = (value, name) => this.setState({[name]: value})

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
    const {fullName, birthday, phoneNumber, address, sex, description, avatar, password, confirm, email, userName} = this.state

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      this.setState({loading: false})
      return null
    }

    if (confirm !== password) {
      toast.error('Confirm password does not match')
      this.setState({loading: false})
      return null
    }

    if (!validatePhone(phoneNumber) && phoneNumber !== '') {
      toast.error('Invalid phone number.')
      this.setState({loading: false})
      return null
    }

    if (!validateEmail(email)) {
      toast.error('Invalid email address.')
      this.setState({loading: false})
      return null
    }

    if (!birthday) {
      toast.error('Please enter a valid date.')
      this.setState({loading: false})
      return null
    }

    const data = {
      fullName,
      address,
      sex,
      description,
      email,
      userName
    }
    if (avatar.file) data.avatar = avatar.preview
    if (password !== '') data.password = password
    if (phoneNumber !== '') data.phoneNumber = phoneNumber
    if (birthday) data.birthday = birthday

    post(users, data).then(res => {
      if (back) this._goBack()
      else history.push('/users/details/' + res._id)
      toast.success('Create User Success')
    }).catch(err => {
      toast.error(err.data.errmsg)
      this.setState({loading: false})
    })
  }

  _goBack = () => {
    const {history} = this.props
    if (history.length > 2) history.goBack()
    else history.push('/users/list')
  }

  render () {
    const {birthday, avatar, fullName, userName, confirm, password, email, description, phoneNumber, address, loading, sex} = this.state
    ChangeTitle('Add User')
    return (
      <div className='users main-form'>
        <Segment.Group>
          <Segment color='blue' className='segment-header'>
            <div className='clearfix'>
              <h2 className='left'>User info</h2>
            </div>
          </Segment>
          <Segment>
            <Form className='users-form clearfix' loading={loading}>
              <div className='avatar'>
                <div className='photo-wrap bottom-10' style={{backgroundImage: 'url(' + avatar.preview + ')'}} />
                <label htmlFor='file'><Button as='span' primary fluid content='Change avatar' /></label>
                <input id='file' accept='image/*' type='file' name='avatar' onChange={this._handleFileChange} />

              </div>
              <div className='general-info'>
                {/* <AutofillRemover type='text' name='userName' /> */}
                <Form.Input name='userName' value={userName} placeholder='User name' label='User name:' onChange={this._handleChange} />
                <Form.Input name='email' value={email} placeholder='email' label='email:' onChange={this._handleChange} />
                <Form.Input name='fullName' value={fullName} placeholder='Full Name' label='Full Name:' onChange={this._handleChange} />
                <Form.Input name='phoneNumber' value={phoneNumber} placeholder='Phone Number' label='Phone Number:' onChange={this._handleChange} />
                <AutofillRemover/>
                <Form.Group widths='equal'>
                  <Form.Input name='password' value={password} type='password' placeholder='Password' label='Password' onChange={this._handleChange} />
                  <Form.Input name='confirm' type='password' value={confirm} placeholder='Confirm Password' label='Confirm Password' onChange={this._handleChange} />
                </Form.Group>

                <Form.Group widths='equal'>
                  <Form.Field>
                    <label>Date of Birth: </label>
                    <DateTime utc timeFormat={false} value={birthday} onChange={e => this._handleDateChange(e, 'birthday')} />
                  </Form.Field>
                  <Form.Field>
                    <label>Gender: </label>
                    <DropDown
                      defaultValue={1}
                      options={[
                        {key: 0, value: 0, text: 'Male'},
                        {key: 1, value: 1, text: 'Female'}
                      ]} value={sex} selection fluid name='sex' onChange={this._handleChange} />
                  </Form.Field>
                </Form.Group>
                <Form.Input name='address' value={address} placeholder='Address' label='Address: ' onChange={this._handleChange} />
                <Form.TextArea name='description' value={description} autoHeight placeholder='About me' label='About me:' onChange={this._handleChange} />

              </div>
              <Divider />
              <div className='clearfix'>
                <Button
                  loading={loading} primary content='Save' icon='save' labelPosition='left' type='submit' floated='right'
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
