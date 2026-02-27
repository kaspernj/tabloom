import {Animated, StyleSheet} from "react-native"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import React from "react"
import {RowContext} from "./row"
import {TableContext} from "./table"
import useEventEmitter from "ya-use-event-emitter"
import {v4 as uuidv4} from "uuid"

export default React.memo(shapeComponent(class TableColumn extends ShapeComponent {
  id = uuidv4()
  position = null

  setup() {
    const {style} = this.props

    this.rowContext = React.useContext(RowContext)
    this.tableContext = React.useContext(TableContext)

    React.useMemo(() => {
      const {position} = this.rowContext.row.onColumnMount({
        column: this
      })

      this.position = position
    }, [])

    React.useEffect(() => {
      return () => {
        this.rowContext.row.onColumnUnmount({
          column: this
        })
      }
    }, [])

    this.headerData = React.useMemo(() => {
      const columnPositionInRow = Object.keys(this.rowContext.row.tt.columns).length - 1
      const headers = Object.values(this.tableContext.table.tt.headers)
      const headerData = headers.find((headerData) => headerData.position === columnPositionInRow)

      return headerData
    }, [])
    this.header = this.headerData.header
    this.width = React.useMemo(() => new Animated.Value(this.headerData.width || 0), [])
    this.style = React.useMemo(() => {
      const resolvedStyle = {width: this.tt.width}

      if (typeof style == "function") {
        style({
          column: this,
          headerData: this.tt.headerData,
          rowContext: this.tt.rowContext,
          style: resolvedStyle,
          tableContext: this.tt.tableContext
        })
      } else if (style) {
        Object.assign(resolvedStyle, StyleSheet.flatten(style))
      }

      return resolvedStyle
    }, [style])

    useEventEmitter(this.tableContext.events, `column-width-changed-${this.tt.header.id}`, this.tt.onColumnWidthChanged)
  }

  render() {
    const {children, style, ...restProps} = this.props

    return (
      <Animated.View style={this.tt.style} {...restProps}>
        {children}
      </Animated.View>
    )
  }

  onColumnWidthChanged = ({width}) => this.tt.width.setValue(width)
}))
