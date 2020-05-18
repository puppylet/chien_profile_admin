import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CloseButton extends Component {
  render () {
    const {size, onClick, right} = this.props
    return (
      <div className={'cb-wrap ' + size + (right ? ' cb-right' : '')} onClick={onClick}>
        <div className='cb' />
      </div>
    )
  }
}

CloseButton.propTypes = {
  size: PropTypes.string,
  right: PropTypes.bool,
  onClick: PropTypes.func
}

CloseButton.defaultProps = {
  size: 'medium'
}

export default CloseButton
