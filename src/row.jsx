import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import {Animated} from "react-native"
import React from "react"
import {TableContext} from "./table"
import useEventEmitter from "ya-use-event-emitter"
import {v4 as uuidv4} from "uuid"

const RowContext = React.createContext()

export {RowContext}

export default React.memo(shapeComponent(class TableRow extends ShapeComponent {
  columns = {}
  columnsCount = 0
  id = uuidv4()
  position = null

  setup() {
    this.tableContext = React.useContext(TableContext)
    this.rowContext = React.useMemo(() => ({
      row: this
    }), [])
    this.width = React.useMemo(() => new Animated.Value(this.tableContext.width || 0), [])

    useEventEmitter(this.tableContext.events, "table-width-changed", this.tt.onTableWidthChange)

    React.useMemo(() => {
      const {position} = this.tableContext.table.onMountRow({row: this})

      this.position = position
    }, [])

    React.useEffect(() => {
      return () => {
        this.tableContext.table.onUnmountRow({row: this})
      }
    }, [])
  }

  render() {
    const {children, style, ...restProps} = this.props
    const rowStyle = React.useMemo(() => {
      return Object.assign(
        {flexDirection: "row", width: this.tt.width},
        style
      )
    }, [style])

    return (
      <RowContext.Provider value={this.tt.rowContext}>
        <Animated.View style={rowStyle} {...restProps}>
          {children}
        </Animated.View>
      </RowContext.Provider>
    )
  }

  onColumnMount({column}) {
    const position = this.columnsCount

    this.columnsCount++
    this.columns[column.id] = {
      column,
      position
    }

    return {position}
  }

  onColumnUnmount({column}) {
    delete this.columns[column.id]
    this.columnsCount--
  }

  onTableWidthChange = ({width}) => this.tt.width.setValue(width)
}))
