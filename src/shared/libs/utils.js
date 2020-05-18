import React from 'react'
import {Loader} from 'semantic-ui-react'
import cheerio from 'cheerio'

export function asyncComponent (getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null
    state = {Component: AsyncComponent.Component}

    componentWillMount () {
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component
          this.setState({Component})
        })
      }
    }

    render () {
      const {Component} = this.state
      if (Component) return <Component {...this.props} />
      else return <div style={{position: 'relative', height: 'calc(100vh - 40px)'}}><Loader active /></div>
    }
  }
}

export function ChangeTitle (title) {
  window.document.title = title + ' | Nhokchien'
}

export function arrayMove (arr, previousIndex, newIndex) {
  const array = arr.slice(0)
  if (newIndex >= array.length) {
    let k = newIndex - array.length
    while (k-- + 1) {
      array.push(undefined)
    }
  }
  array.splice(newIndex, 0, array.splice(previousIndex, 1)[0])
  return array
}

export function table2json (html, options) {
  options = Object.assign(
    {
      useFirstRowForHeadings: false,
      stripHtmlFromHeadings: true,
      stripHtmlFromCells: true,
      stripHtml: null,
      forceIndexAsNumber: false
    },
    options
  )

  if (options.stripHtml === true) {
    options.stripHtmlFromHeadings = true
    options.stripHtmlFromCells = true
  } else if (options.stripHtml === false) {
    options.stripHtmlFromHeadings = false
    options.stripHtmlFromCells = false
  }

  let jsonResponse = []
  let alreadySeen = []
  let suffix

  const $ = cheerio.load(html)

  $('table').each(function (i, table) {
    const tableAsJson = []
    // Get column headings
    // @fixme Doesn't support vertical column headings.
    // @todo Try to support badly formated tables.
    const columnHeadings = []

    let trs = $(table).find('tr')

    if (options.useFirstRowForHeadings) trs = $(trs[0])

    trs.each(function (i, row) {
      $(row).find('th').each(function (j, cell) {
        const value = options.stripHtmlFromHeadings
          ? $(cell).text().trim()
          : $(cell).html().trim()

        const seen = alreadySeen[value]
        if (seen) {
          suffix = ++alreadySeen[value]
          columnHeadings[j] = value + '_' + suffix
        } else {
          alreadySeen[value] = 1
          columnHeadings[j] = value
        }
      })
    })

    // Fetch each row
    $(table).find('tr').each(function (i, row) {
      const rowAsJson = {}

      const rows = options.useFirstRowForHeadings ? $(row).find('td, th') : $(row).find('td')
      rows.each(function (j, cell) {
        const content = options.stripHtmlFromCells
          ? $(cell).text().trim()
          : $(cell).html().trim()

        if (columnHeadings[j] && !options.forceIndexAsNumber) {
          rowAsJson[columnHeadings[j]] = content
        } else {
          rowAsJson[j] = content
        }
      })

      // Skip blank rows
      if (JSON.stringify(rowAsJson) !== '{}') tableAsJson.push(rowAsJson)
    })

    // Add the table to the response
    if (tableAsJson.length !== 0) jsonResponse.push(tableAsJson)
  })

  return jsonResponse
}

export const checkRole = (role, auth) => auth.isAdmin || (auth.roles && auth.roles.indexOf(role) !== -1)
export const validateEmail = _ => /^[a-z0-9._%+-]{1,64}@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/.test(_.toLowerCase())
export const validatePhone = _ => /^[0-9- .]{8,15}$/.test(_.toLowerCase())

const getBoundsForNode = node => {
  const rect = node.getBoundingClientRect()
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft,
    offsetWidth: node.offsetWidth,
    offsetHeight: node.offsetHeight
  }
}

const coordsCollide = (aTop, aLeft, bTop, bLeft, aWidth, aHeight, bWidth, bHeight, tolerance) => {
  if (typeof tolerance === 'undefined') {
    tolerance = 0
  }

  return !(
    // 'a' bottom doesn't touch 'b' top
    ((aTop + aHeight - tolerance) < bTop) ||
    // 'a' top doesn't touch 'b' bottom
    ((aTop + tolerance) > (bTop + bHeight)) ||
    // 'a' right doesn't touch 'b' left
    ((aLeft + aWidth - tolerance) < bLeft) ||
    // 'a' left doesn't touch 'b' right
    ((aLeft + tolerance) > (bLeft + bWidth))
  )
}

export const isOverlap = (a, b, tolerance) => {
  const aObj = (a instanceof HTMLElement) ? getBoundsForNode(a) : a
  const bObj = (b instanceof HTMLElement) ? getBoundsForNode(b) : b
  // console.log(a, b, aObj, bObj)
  return coordsCollide(
    aObj.top,
    aObj.left,
    bObj.top,
    bObj.left,
    aObj.offsetWidth,
    aObj.offsetHeight,
    bObj.offsetWidth,
    bObj.offsetHeight,
    tolerance
  )
}

export function friendly (a) {
  a = a.toLowerCase()
  a = a.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
  a = a.replace(/[èéẹẻẽêềếệểễ]/g, 'e')
  a = a.replace(/[ìíịỉĩ]/g, 'i')
  a = a.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
  a = a.replace(/[ùúụủũưừứựửữ]/g, 'u')
  a = a.replace(/[ỳýỵỷỹ]/g, 'y')
  a = a.replace(/đ/g, 'd')
  /* eslint-disable comma-spacing,no-tabs,no-useless-escape */
  a = a.replace(/[$\\@\\\#%\^\&\*\(\)\[\]\+\_\!\"\'\>\<\?\,\.\;\:\/\	\{\}\`\~\=\|]/g, '')
  a = a.replace(/\s+/g, ' ')
  a = a.replace(/ /g, '-')
  a = a.replace(/-+-/g, '-')
  return a
}
