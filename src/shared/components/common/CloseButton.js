import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CloseButton extends Component {
  render () {
    const {size, onClick} = this.props
    return (
      <div className= {'cb-wrap ' + size} onClick={onClick}>
        <div className='cb' />
      </div>
    )
  }
}

CloseButton.propTypes = {
  size: PropTypes.string,
  onClick: PropTypes.func
}

CloseButton.defaultProps = {
  size: 'medium'
}

export default CloseButton
