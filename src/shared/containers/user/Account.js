import React, { Component } from 'react'
import { ChangeTitle, validatePhone } from '../../libs/utils'
import defaultAvatar from '../../../assests/avatar.jpg'
import DateTime from 'react-datetime'
import moment from 'moment'
import DropDown from '../../components/common/Dropdown'
import { toast } from 'react-toastify'
import { user, addCredit, addVip } from '../../../store/models'
import { put, post } from '../../../store/resourceServices'
import { withRouter } from 'react-router-dom'
import {Button, Form, Segment, Divider, Loader, Icon, Modal, Popup} from 'semantic-ui-react'
import CloseButton from '../../components/common/CloseButton'

@withRouter
export default class Account extends Component {
  state = {
    loading: false,
    avatar: {
      preview: defaultAvatar,
      fileName: '',
      file: null
    }
  }

  componentDidMount () {
    const {avKey} = this.props
    const res = this.props.userInfo
    res.birthday = moment.utc(res.birthday)
    if (res.avatar && res.avatar.length > 0) res.avatar = {preview: res.avatar + '?' + avKey}
    this.setState({...this.state, ...res})
  }

  _handleChange = (e, {name, value}) => this.setState({[ name ]: value})

  _handleDateChange = (value, name) => this.setState({[ name ]: value})

  _handleFileChange = (event) => {
    const {name, value, files} = event.target
    const formContent = {fileName: value}
    const reader = new window.FileReader()
    formContent.file = files[ 0 ]
    reader.readAsDataURL(files[ 0 ])
    reader.onload = () => {
      formContent.preview = reader.result
      this.setState({[ name ]: formContent})
    }
  }

  _handleSubmit = () => {
    this.setState({loading: true})
    const {changeMe} = this.props
    const {fullName, birthday, isActive, phoneNumber, address, sex, description, avatar, _id, password, confirm} = this.state
    if (confirm !== password) {
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
      changeMe && changeMe()
      toast.success('Cập nhật thông tin cá nhân thành công.')
    })
  }

  _addCredit = () => {
    const {creditReason, addedCredit, _id} = this.state
    const data = {
      _id,
      value: addedCredit,
      reason: creditReason
    }

    post(addCredit, data).then(res => {
      const {changeMe} = this.props
      this.setState({showCreditModal: false}, changeMe)
      toast.success('Thêm credit thành công.')
    })
  }

  _addVip = () => {
    const {vipReason, addedVip, _id} = this.state
    const data = {
      _id,
      value: addedVip,
      reason: vipReason
    }

    post(addVip, data).then(res => {
      const {changeMe} = this.props
      changeMe()
      this.setState({showVipModal: false}, changeMe)
      toast.success('Thêm ngày VIP thành công.')
    })
  }

  render () {
    const {birthday, avatar, fullName, userName, confirm, password, email, description, phoneNumber, address, loading, sex,
      credit, showCreditModal, showVipModal, addedCredit, creditReason, vipReason, addedVip, vipTime
    } = this.state
    ChangeTitle('Edit user')
    const now = moment().endOf('day')
    const currentVip = moment(vipTime).endOf('day')
    const vip = currentVip.isBefore(now) ? 0 : currentVip.diff(now, 'days')
    if (!userName) return <div style={ {position: 'relative', height: 'calc(100vh - 40px)'} }><Loader active /></div>
    return (
      <div className='users main-form'>
        <Segment.Group>
          <Segment color='blue' className='segment-header'>
            <div className='clearfix'>
              <h2 className='left'>Thông tin cá nhân</h2>
            </div>
          </Segment>
          <Segment>
            <Form className='users-form clearfix' loading={ loading } onSubmit={ this._handleSubmit }>
              <div className='avatar'>
                <div className='photo-wrap bottom-10' style={ {backgroundImage: 'url(' + avatar.preview + ')'} } />
                <label htmlFor='file'><Button as='span' primary fluid content='Đổi avatar' /></label>
                <input id='file' accept='image/*' type='file' name='avatar' onChange={ this._handleFileChange } />
                <Divider />
                <p><Icon name='user' /> {userName}</p>
                <p><Icon name='mail' /> {email}</p>
                <p>
                  <Icon name='dollar' />
                  {credit} credits
                  <span style={{float: 'right'}}>
                    <Popup
                      trigger={<Icon name='plus' onClick={() => this.setState({showCreditModal: true})} />}
                      content='Thêm credit'
                      inverted
                    />
                  </span>
                </p>
                <p>
                  <Icon name='star' />
                  Còn {vip} ngày VIP
                  <span style={{float: 'right'}}>
                    <Popup
                      trigger={<Icon name='plus' onClick={() => this.setState({showVipModal: true})} />}
                      content='Thêm ngày vip'
                      inverted
                    />
                  </span>
                </p>

              </div>
              <div className='general-info'>
                <Form.Input
                  name='fullName' value={ fullName } placeholder='Họ tên' label='Họ tên:'
                  onChange={ this._handleChange } />
                <Form.Group widths='equal'>
                  <Form.Input
                    name='password' value={ password } type='password' placeholder='Mật khẩu' label='Mật khẩu:'
                    onChange={ this._handleChange } />
                  <Form.Input
                    name='confirm' type='password' value={ confirm } placeholder='Xác nhận mật khẩu'
                    label='Xác nhận mật khẩu:' onChange={ this._handleChange } />
                </Form.Group>

                <Form.Group widths='equal'>
                  <Form.Field>
                    <label>Sinh nhật: </label>
                    <DateTime
                      utc timeFormat={ false } value={ moment(birthday) }
                      onChange={ e => this._handleDateChange(e, 'birthday') } />
                  </Form.Field>
                  <Form.Field>
                    <label>Giới tính: </label>
                    <DropDown
                      options={ [
                        {key: 0, value: 0, text: 'Nam'},
                        {key: 1, value: 1, text: 'Nữ'}
                      ] } value={ sex } selection fluid name='sex' onChange={ this._handleChange } />
                  </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                  <Form.Input
                    name='phoneNumber' value={ phoneNumber } placeholder='Số điện thoại' label='Số điện thoại:'
                    onChange={ this._handleChange } />
                </Form.Group>

                <Form.Input
                  name='address' value={ address } placeholder='Địa chỉ' label='Địa chỉ:'
                  onChange={ this._handleChange } />

                <Form.TextArea
                  name='description' value={ description } autoHeight placeholder='User description'
                  label='User description:' onChange={ this._handleChange } />

              </div>
              <Divider />
              <div className='clearfix'>
                <Button primary content='Lưu' icon='save' labelPosition='left' type='submit' floated='right' />
              </div>

            </Form>
          </Segment>
        </Segment.Group>

        <Modal open={showCreditModal} size='mini'>
          <Modal.Header>
            Nạp credit cho {fullName}
            <div style={{position: 'absolute', right: 5, top: 10}}><CloseButton
              onClick={() => this.setState({showCreditModal: false})} /></div>
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form>
                <label>Mẫu: </label>
                <Form.Field>
                  <DropDown
                    selection
                    options={[
                      {value: 1, text: 'Nạp VIP gói 300'},
                      {value: 2, text: 'Nạp VIP gói 500'},
                      {value: 3, text: 'Nạp VIP gói 1200'},
                      {value: 4, text: 'Nạp VIP gói 2000'}
                    ]}
                  />
                </Form.Field>
                <Form.Input
                  type='number' name='addedCredit' placeholder='Nhập lượng credit muốn thêm' value={addedCredit}
                  label='Nhập lượng credit muốn thêm:' onChange={this._handleChange} />
                <Form.TextArea
                  name='creditReason' value={creditReason} placeholder='Lý do nạp' label='Lý do nạp:' onChange={this._handleChange} />
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.setState({showCreditModal: false})}>Thoát</Button>
            <Button primary content='Chấp nhận' onClick={this._addCredit} />
          </Modal.Actions>
        </Modal>
        <Modal open={showVipModal} size='mini'>
          <Modal.Header>Thêm ngày VIP cho {fullName}
            <div style={{position: 'absolute', right: 5, top: 10}}><CloseButton
              onClick={() => this.setState({showVipModal: false})} /></div>
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form>
                <label>Mẫu: </label>
                <Form.Field>
                  <DropDown
                    selection
                    options={[
                      {value: 1, text: 'Nạp VIP gói 300'},
                      {value: 2, text: 'Nạp VIP gói 500'},
                      {value: 3, text: 'Nạp VIP gói 1200'},
                      {value: 4, text: 'Nạp VIP gói 2000'}
                    ]}
                  />
                </Form.Field>
                <Form.Input
                  type='number' name='addedVip' value={addedVip} placeholder='Nhập số ngày VIP muốn thêm' label='Nhập ngày VIP muốn thêm:' onChange={this._handleChange} />
                <Form.TextArea name='vipReason' value={vipReason} placeholder='Lý do nạp' label='Lý do nạp:' onChange={this._handleChange} />
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.setState({showVipModal: false})}>Thoát</Button>
            <Button primary content='Chấp nhận' onClick={this._addVip} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}
