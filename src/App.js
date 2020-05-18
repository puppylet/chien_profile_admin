import React, {Component} from 'react'
import {HashRouter} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import Routes from './Routes'
import Header from './shared/components/common/Header'
import SideMenu from './shared/components/common/sideBar/SideMenu'
import LoginForm from './shared/containers/LoginForm'
import {load, remove} from 'react-cookies'
import {get} from './store/resourceServices'
import {me} from './store/models'

class App extends Component {
  state = {
    visible: true,
    isLogin: false,
    key: 1,
    loading: false,
    userInfo: {}
  }

  componentDidMount () {
    this._checkLogin()
  }

  _checkLogin = () => {
    let {key} = this.state
    key++
    const isLogin = !!load('_profile_admin__token')

    if (isLogin) {
      const userInfo = window.localStorage.getItem('_profile_admin__me')
      if (userInfo === null) {
        get(me).then(res => {
          if (res.success) {
            window.localStorage.setItem('_profile_admin__me', JSON.stringify(res.data))
            this.setState({isLogin, key, userInfo: res.data})
          }
        })
      } else this.setState({isLogin, key, userInfo: JSON.parse(userInfo)})
    } else {
      this.setState({isLogin, key})
    }
  }

  changeMe = () => {
    const key = Math.random()
    window.localStorage.removeItem('_profile_admin__me')
    get(me).then(res => {
      if (res.success) {
        window.localStorage.setItem('_profile_admin__me', JSON.stringify(res.data))
        this.setState({key, userInfo: res.data})
      }
    })
  }

  _handleLogOut = () => {
    const key = Math.random()
    window.localStorage.removeItem('_profile_admin__me')
    remove('_profile_admin__token')
    this.setState({isLogin: false, key})
  }

  render () {
    const {key, userInfo, isLogin} = this.state
    if (!isLogin) return <LoginForm onLogin={this._checkLogin} />
    return (
      <HashRouter>
        <div id='page-bg'>
          <ToastContainer hideProgressBar position='top-right' style={{top: 50, zIndex: 1060}} />
          <Header onLogout={this._handleLogOut} userInfo={userInfo} avKey={key} />
          {/* <SearchBar /> */}
          <div className='main-content'>
            <SideMenu />
            <Routes key={key} userInfo={userInfo} avKey={key} changeMe={this.changeMe} />
          </div>
        </div>
      </HashRouter>
    )
  }
}

export default App
