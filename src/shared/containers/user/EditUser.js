import React, {Component} from 'react'
import {ChangeTitle, validatePhone} from '../../libs/utils'
import defaultAvatar from '../../../assests/avatar.jpg'
import DateTime from 'react-datetime'
import moment from 'moment'
import DropDown from '../../components/common/Dropdown'
import {toast} from 'react-toastify'
import {user} from '../../../store/models'
import {get, put} from '../../../store/resourceServices'
import {withRouter} from 'react-router-dom'
import {Button, Form, Segment, Divider, Loader, Icon} from 'semantic-ui-react'
import AutofillRemover from '../../components/common/AutofillRemover'

@withRouter
class EditUser extends Component {
  state = {
    loading: false,
    avatar: {
      preview: defaultAvatar,
      fileName: '',
      file: null
    }
  }

  componentDidMount () {
    this._getData()
  }

  _getData = () => {
    const {id} = this.props.match.params
    const {avKey} = this.props
    get(user, {id}).then(res => {
      res.birthday = moment.utc(res.birthday)
      if (res.avatar && res.avatar.length > 0) res.avatar = {preview: res.avatar + '?' + avKey}
      else res.avatar = {preview: defaultAvatar}
      this.setState({...this.state, ...res})
    })
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
    this.setState({loading: true})
    const {userInfo, changeMe} = this.props
    const {fullName, birthday, isActive, phoneNumber, address, sex, description, avatar, _id, password, confirm} = this.state

    if (confirm !== password && password) {
      toast.error('Xác nhận không đúng mất khẩu.')
      this.setState({loading: false})
      return null
    }

    if (!validatePhone(phoneNumber) && phoneNumber !== '') {
      toast.error('Số điện thoại không hợp lệ.')
      this.setState({loading: false})
      return null
    }

    const data = {
      fullName,
      birthday,
      isActive,
      address,
      sex,
      description
    }
    if (avatar.file) data.avatar = avatar.preview
    if (password !== '') data.password = password
    if (phoneNumber !== '') data.phoneNumber = phoneNumber

    put(user, data, {id: _id}).then(res => {
      this.setState({loading: false})
      if (_id === userInfo._id) changeMe && changeMe()
      back && this._goBack()
      toast.success('Cập nhật thông tin thành viên thành công.')
    })
  }

  _goBack = () => {
    const {history} = this.props
    if (history.length > 2) history.goBack()
    else history.push('/thanh-vien/list')
  }

  render () {
    const {birthday, avatar, fullName, userName, confirm, password, email, description, phoneNumber, address, loading, sex} = this.state
    ChangeTitle('Edit user')
    if (!userName) return <div style={{position: 'relative', height: 'calc(100vh - 40px)'}}><Loader active /></div>
    return (
      <div className='users main-form'>
        <Segment.Group>
          <Segment color='blue' className='segment-header'>
            <div className='clearfix'>
              <h2 className='left'>Edit user</h2>
            </div>
          </Segment>
          <Segment>
            <Form className='users-form clearfix' loading={loading}>
              <div className='avatar'>
                <div className='photo-wrap bottom-10' style={{backgroundImage: 'url(' + avatar.preview + ')'}} />
                <label htmlFor='file'><Button as='span' primary fluid content='Change Avatar' /></label>
                <input id='file' accept='image/*' type='file' name='avatar' onChange={this._handleFileChange} />

                <Divider />
                <p><Icon name='user' /> {userName}</p>
                <p><Icon name='mail' /> {email}</p>
              </div>
              <div className='general-info'>
                <Form.Input
                  name='fullName' value={fullName} placeholder='Full Name' label='Full Name:'
                  onChange={this._handleChange} />
                <AutofillRemover />
                <Form.Group widths='equal'>
                  <Form.Input
                    name='password' value={password} type='password' placeholder='Password' label='Password:'
                    onChange={this._handleChange} />
                  <Form.Input
                    name='confirm' type='password' value={confirm} placeholder='Confirm Password'
                    label='Confirm Password:' onChange={this._handleChange} />
                </Form.Group>

                <Form.Group widths='equal'>
                  <Form.Field>
                    <label>Date of Birth</label>
                    <DateTime
                      utc timeFormat={false} value={birthday} onChange={e => this._handleDateChange(e, 'birthday')} />
                  </Form.Field>
                  <Form.Field>
                    <label>Genfer </label>
                    <DropDown
                      options={[
                        {key: 0, value: 0, text: 'Male'},
                        {key: 1, value: 1, text: 'Female'}
                      ]} value={sex} selection fluid name='sex' onChange={this._handleChange} />
                  </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                  <Form.Input
                    name='phoneNumber' value={phoneNumber} placeholder='Phone Number' label='Phone Number:'
                    onChange={this._handleChange} />
                </Form.Group>

                <Form.Input
                  name='address' value={address} placeholder='Address' label='Address:' onChange={this._handleChange} />

                <Form.TextArea
                  name='description' value={description} autoHeight placeholder='About me'
                  label='About me:' onChange={this._handleChange} />

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

export default EditUser
