import React from "react"
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native"
import SystemTestBrowserHelper from "system-testing/build/system-test-browser-helper.js"

import {Column, Header, Row, Table} from "tabloom"

const enableSystemTestingOnWeb = () => {
  if (typeof window === "undefined") return

  const params = new URLSearchParams(window.location.search)
  if (params.get("systemTest") !== "true") return

  const helper = new SystemTestBrowserHelper()
  helper.enableOnBrowser()
}

enableSystemTestingOnWeb()

export default function App() {
  return (
    <SafeAreaView style={styles.container} testID="systemTestingComponent">
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>tabloom example</Text>
        <View testID="tabloomRoot" style={styles.tableWrapper}>
          <Table style={styles.table}>
            <Row style={styles.headerRow}>
              <Header style={styles.headerCell} testID="nameHeader" width={180}>
                <Text style={styles.headerText}>Name</Text>
              </Header>
              <Header style={styles.headerCell} testID="pointsHeader">
                <Text style={styles.headerText}>Points</Text>
              </Header>
            </Row>
            <Row style={styles.dataRow} testID="aliceRow">
              <Column style={styles.cell} testID="aliceName">
                <Text>Alice</Text>
              </Column>
              <Column style={styles.cell} testID="alicePoints">
                <Text>12</Text>
              </Column>
            </Row>
            <Row style={styles.dataRow} testID="bobRow">
              <Column style={styles.cell} testID="bobName">
                <Text>Bob</Text>
              </Column>
              <Column style={styles.cell} testID="bobPoints">
                <Text>9</Text>
              </Column>
            </Row>
          </Table>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  cell: {
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 12
  },
  container: {
    backgroundColor: "#f8fafc",
    flex: 1
  },
  content: {
    alignItems: "center",
    padding: 24
  },
  dataRow: {
    backgroundColor: "#ffffff"
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16
  },
  headerCell: {
    backgroundColor: "#dbeafe",
    borderBottomWidth: 1,
    borderColor: "#93c5fd",
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 12
  },
  headerRow: {
    backgroundColor: "#dbeafe"
  },
  headerText: {
    fontWeight: "700"
  },
  table: {
    width: 340
  },
  tableWrapper: {
    borderColor: "#bfdbfe",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden"
  }
})
