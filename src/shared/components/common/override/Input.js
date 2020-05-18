import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Form} from 'semantic-ui-react'

export default class Input extends Component {
  static propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string
  }

  state = {
    value: '',
    lastValue: ''
  }
  componentDidMount () {
    const {value} = this.props
    this.setState({value, lastValue: value})
  }
  handleChange = (e, {value}) => this.setState({value})
  handleKeyDown = (e) => {
    const {value, lastValue} = this.state
    const {name, onChange} = this.props
    if (e.keyCode === 13 && lastValue !== value) {
      this.setState({lastValue: value}, () => onChange && onChange(e, {name, value}))
    }
  }
  handleBlur = (e) => {
    const {value, lastValue} = this.state
    const {name, onChange} = this.props
    if (lastValue !== value) {
      this.setState({lastValue: value}, () => onChange && onChange(e, {name, value}))
    }
  }
  render () {
    const {value} = this.state
    const props = {...this.props, value, onChange: this.handleChange, onKeyDown: this.handleKeyDown, onBlur: this.handleBlur}
    return <Form.Input {...props} />
  }
}
