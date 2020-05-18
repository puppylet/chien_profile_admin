import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const DropDown = ({...props}) => <Dropdown {...props} scrolling selectOnBlur={false} selectOnNavigation={false} />

DropDown.propTypes = {
  as: PropTypes.any,
  additionLabel: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  additionPosition: PropTypes.oneOf(['top', 'bottom']),
  allowAdditions: PropTypes.any,
  basic: PropTypes.bool,
  button: PropTypes.bool,

  /** Primary content. */
  children: PropTypes.any,
  className: PropTypes.string,
  closeOnBlur: PropTypes.bool,
  closeOnChange: PropTypes.bool,
  compact: PropTypes.bool,
  deburr: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  defaultSearchQuery: PropTypes.string,
  defaultSelectedLabel: PropTypes.any,
  defaultValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]))
  ]),
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  floating: PropTypes.bool,
  fluid: PropTypes.bool,
  header: PropTypes.node,
  icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object
  ]),
  inline: PropTypes.bool,
  item: PropTypes.bool,
  labeled: PropTypes.bool,
  loading: PropTypes.bool,
  minCharacters: PropTypes.number,
  multiple: PropTypes.bool,
  noResultsMessage: PropTypes.string,
  onAddItem: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  onFocus: PropTypes.func,
  onLabelClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  onOpen: PropTypes.func,
  onSearchChange: PropTypes.func,
  open: PropTypes.bool,
  openOnFocus: PropTypes.bool,
  options: PropTypes.any,
  placeholder: PropTypes.string,
  pointing: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['left', 'right', 'top', 'top left', 'top right', 'bottom', 'bottom left', 'bottom right'])
  ]),
  renderLabel: PropTypes.func,
  scrolling: PropTypes.bool,
  search: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ]),

  /** A shorthand for a search input. */
  searchInput: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.node,
    PropTypes.object
  ]),
  searchQuery: PropTypes.string,
  selectOnBlur: PropTypes.bool,
  selectOnNavigation: PropTypes.bool,
  selectedLabel: PropTypes.any,
  selection: PropTypes.any,
  simple: PropTypes.bool,
  tabIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  text: PropTypes.string,
  trigger: PropTypes.any,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]))
  ]),
  upward: PropTypes.bool
}

export default DropDown
