import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import EventEmitter from "eventemitter3"
import React from "react"
import {View} from "react-native"

const TableContext = React.createContext()

export {TableContext}

export default React.memo(shapeComponent(class Table extends ShapeComponent {
  events = new EventEmitter()
  headers = {}
  headersCount = 0
  rows = {}
  rowsCount = 0

  setup() {
    this.tableContext = React.useMemo(() => ({
      events: this.events,
      table: this
    }), [])

    React.useMemo(() => {
      if (typeof this.events.setMaxListeners == "function") {
        this.events.setMaxListeners(9999)
      }
    }, [])
  }

  render() {
    const {children, onLayout, style, ...restProps} = this.props
    const tableStyle = React.useMemo(() => {
      return Object.assign({}, style)
    }, [style])

    return (
      <TableContext.Provider value={this.tableContext}>
        <View onLayout={this.tt.onLayout} style={tableStyle} {...restProps}>
          {children}
        </View>
      </TableContext.Provider>
    )
  }

  onLayout = (e, ...restArgs) => {
    if (this.props.onLayout) this.props.onLayout(e, ...restArgs)

    this.width = e.nativeEvent.layout.width
    this.events.emit("table-width-changed", {width: this.width})
    this.setColumnWidthsLater()
  }

  onMountHeader({header}) {
    const position = this.headersCount

    this.headersCount++

    const headerData = {
      header,
      position,
      width: null
    }

    this.headers[header.id] = headerData

    return headerData
  }

  onUnmountHeader({header}) {
    delete this.headers[header.id]
    this.headersCount--
    this.setColumnWidthsLater()
  }

  onMountRow({row}) {
    const rowData = {
      row,
      position: this.rowsCount
    }

    this.rowsCount++
    this.rows[row.id] = rowData

    return rowData
  }

  onUnmountRow({row}) {
    delete this.rows[row.id]
    this.rowsCount--
  }

  setColumnWidthsLater() {
    clearTimeout(this.setColumnWidthsLaterTimeout)

    this.setColumnWidthsLaterTimeout = setTimeout(this.tt.setColumnWidths, 0)
  }

  setColumnWidths = () => {
    const {headers, width} = this.tt
    const headersCount = this.headersCount

    if (width === null || headersCount === 0) {
      return
    }

    let widthOfHeadersWithSetWidth = 0
    let headersWidthoutSetWidth = 0

    for (const headerID in headers) {
      const headerData = headers[headerID]
      const header = headerData.header

      if (header.props.width !== undefined) {
        widthOfHeadersWithSetWidth += header.props.width
      } else {
        headersWidthoutSetWidth++
      }
    }

    const restWidth = width - widthOfHeadersWithSetWidth
    const headerDefaultWidth = headersWidthoutSetWidth > 0 ? (restWidth / headersWidthoutSetWidth) : 0

    for (const headerID in headers) {
      const headerData = headers[headerID]
      const newWidth = headerData.header.props.width || headerDefaultWidth

      if (headerData.width !== newWidth) {
        headerData.width = newWidth

        this.tableContext.events.emit(`column-width-changed-${headerID}`, {
          width: newWidth
        })
      }
    }
  }
}))
