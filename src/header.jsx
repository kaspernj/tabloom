import {Animated, StyleSheet} from "react-native"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"
import PropTypes from "prop-types"
import React from "react"
import {RowContext} from "./row"
import {TableContext} from "./table"
import useEventEmitter from "ya-use-event-emitter"
import {v4 as uuidv4} from "uuid"

export default React.memo(shapeComponent(class TableHeader extends ShapeComponent {
  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.func, PropTypes.object]),
    width: PropTypes.number
  }

  id = uuidv4()
  position = null

  setup() {
    const {style} = this.props

    this.rowContext = React.useContext(RowContext)
    this.tableContext = React.useContext(TableContext)
    this.width = React.useMemo(() => new Animated.Value(this.props.width || 0), [])
    this.style = React.useMemo(() => ({width: this.tt.width}), [])

    React.useMemo(() => {
      this.headerData = this.tableContext.table.onMountHeader({header: this})
      this.position = this.headerData.position
    }, [])

    React.useEffect(() => {
      return () => {
        this.tableContext.table.onUnmountHeader({header: this})
      }
    }, [])

    React.useLayoutEffect(() => {
      if (typeof style == "function") {
        style({
          column: this,
          headerData: this.tt.headerData,
          rowContext: this.tt.rowContext,
          style: this.style,
          tableContext: this.tt.tableContext
        })
      } else if (style) {
        Object.assign(this.style, StyleSheet.flatten(style))
      }
    }, [style])

    useEventEmitter(this.tableContext.events, `column-width-changed-${this.id}`, this.tt.onColumnWidthChanged)
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
