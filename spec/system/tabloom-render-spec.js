import "velocious/build/src/testing/test.js"
import timeout from "awaitery/build/timeout.js"
import waitFor from "awaitery/build/wait-for.js"
import SystemTest from "system-testing/build/system-test.js"
import {setupSystemTestLifecycle, systemTestArgs} from "./system-test-lifecycle.js"

setupSystemTestLifecycle()

describe("tabloom", () => {
  it("renders in the example app", async () => {
    await timeout({errorMessage: "render test timed out: renders in the example app", timeout: 30000}, async () => {
      const systemTest = SystemTest.current(systemTestArgs)

      await systemTest.findByTestID("tabloomRoot", {timeout: 5000})
      await systemTest.findByTestID("nameHeader", {timeout: 5000})
      await systemTest.findByTestID("pointsHeader", {timeout: 5000})
      await systemTest.findByTestID("alicePoints", {timeout: 5000})
    })
  })

  it("keeps configured header and column widths aligned", async () => {
    await timeout({errorMessage: "render test timed out: keeps configured header and column widths aligned", timeout: 30000}, async () => {
      const systemTest = SystemTest.current(systemTestArgs)
      await systemTest.findByTestID("tabloomRoot", {timeout: 5000})

      await waitFor({timeout: 5000}, async () => {
        const header = await systemTest.findByTestID("nameHeader", {timeout: 0})
        const column = await systemTest.findByTestID("aliceName", {timeout: 0})
        const headerWidth = parseFloat(await header.getCssValue("width"))
        const columnWidth = parseFloat(await column.getCssValue("width"))

        if (Number.isNaN(headerWidth) || Number.isNaN(columnWidth)) {
          throw new Error(`Expected measurable widths, got header=${headerWidth}, column=${columnWidth}`)
        }

        if (Math.abs(headerWidth - 180) > 2) {
          throw new Error(`Expected header width around 180px, got ${headerWidth}`)
        }

        if (Math.abs(columnWidth - 180) > 2) {
          throw new Error(`Expected column width around 180px, got ${columnWidth}`)
        }
      })
    })
  })
})
