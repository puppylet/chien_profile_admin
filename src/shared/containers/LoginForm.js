import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {toast, ToastContainer} from 'react-toastify'
import {ChangeTitle} from '../libs/utils'
import {login} from '../../store/models'
import {post} from '../../store/resourceServices'
import { Form, Divider, Message } from 'semantic-ui-react'
import {save, remove} from 'react-cookies'

class LoginForm extends Component {
  state = {
    userName: '',
    password: '',
    error: false,
    isLoading: false
  }

  _handleChange = (e, {name, value}) => this.setState({[name]: value, error: false})

  _checkLogin = () => {
    const {onLogin} = this.props
    const {userName, password} = this.state
    this.setState({isLoading: true})
    post(login, {userName, password}).then(res => {
      if (res.success) {
        save('_profile_admin__token', res.token)
        toast.success('Đăng nhập thành công')
        onLogin && onLogin()
      } else {
        remove('_profile_admin__token')
        window.localStorage.removeItem('_profile_admin__me')
        toast.error('Đăng nhập thất bại.')
        this.setState({isLoading: false})
      }
    })
  }

  render () {
    const {error, isLoading} = this.state
    ChangeTitle('Login')
    return (
      <div className='login'>
        <div className='login-form'>
          <ToastContainer hideProgressBar position='top-right' style={{zIndex: 1060}} />
          <h1 style={{color: 'white', fontWeight: 'normal', textTransform: 'uppercase'}}>Profile manager</h1>

          <Form className='clearfix' onSubmit={this._checkLogin} error={error}>
            <h2>Login</h2>
            <p>Welcome to profile admin manager panel</p>
            <Form.Group widths='equal'>
              <Form.Field>
                <Form.Input
                  name='userName'
                  type='text'
                  icon='user'
                  onChange={this._handleChange}
                  placeholder='Enter your user name or email...' />
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <Form.Input
                  name='password'
                  type='password'
                  icon='key'
                  onChange={this._handleChange}
                  placeholder='Enter your password...' />
              </Form.Field>
            </Form.Group>
            <Divider />
            <Message
              error
              content='Sorry. Your user name or password is invalid.'
            />
            <div className='left'>
              <Form.Checkbox label='Remember me' />
            </div>
            <div className='right'>
              <Form.Button primary content='Login' type='submit' loading={isLoading} />
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

LoginForm.propTypes = {
  onLogin: PropTypes.func
}

export default LoginForm
