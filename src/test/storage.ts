import {
  addValueChangeListener,
  deleteValue,
  getValue,
  listValues,
  setValue,
} from "browser-extension-storage"

import { assertEquals, assertTrue, runTest } from "./test-helper"

const sleep = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, 100)
  })
}

export default async function test() {
  await runTest("storage", async () => {
    console.log(
      // eslint-disable-next-line n/prefer-global/process
      `[${process.env.PLASMO_TARGET}] [${process.env.PLASMO_TAG}] runs on`,
      location.href
    )

    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const key = "test_" + Date.now()
    let value2 = null
    let changeCount = 0

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const removeValueChangeListener = addValueChangeListener(
      key,
      (_key, oldValue, newValue) => {
        console.log("addValueChangeListener", _key, oldValue, newValue)

        changeCount++
        assertEquals(key, _key)
        assertTrue(
          JSON.stringify(oldValue) !== JSON.stringify(newValue),
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `oldValue: ${oldValue}, newValue: ${newValue}`
        )

        if (
          // eslint-disable-next-line n/prefer-global/process
          process.env.PLASMO_TARGET === "userscript" ||
          // eslint-disable-next-line n/prefer-global/process
          process.env.PLASMO_TARGET === "bookmarklet" ||
          // eslint-disable-next-line n/prefer-global/process
          process.env.PLASMO_TARGET === "module"
        ) {
          newValue = JSON.parse(newValue as string)
        }

        value2 = newValue
      }
    )

    let value = await getValue(key)
    console.log("getValue newKey", value)
    assertEquals(value, undefined)

    let keys = await listValues()
    assertTrue(!keys.includes(key))

    await setValue(key, undefined)
    value = await getValue(key)
    console.log("setValue undefined", "getValue", value)
    assertEquals(value, undefined)

    // wait for executes listener which added to addValueChangeListener
    await sleep()
    keys = await listValues()
    assertTrue(!keys.includes(key))
    assertEquals(changeCount, 0)

    await setValue(key, null)
    value = await getValue(key)
    console.log("setValue null", "getValue", value)
    assertEquals(value, null)

    keys = await listValues()
    assertTrue(keys.includes(key))
    await sleep()
    assertEquals(changeCount, 1)
    assertEquals(value, value2)

    await setValue(key, undefined)
    value = await getValue(key)
    console.log("setValue undefined", "getValue", value)
    await sleep()
    assertEquals(value, null)
    assertEquals(value, value2)

    keys = await listValues()
    assertTrue(keys.includes(key))
    assertEquals(changeCount, 1)

    await setValue(key, 123)
    value = await getValue(key)
    console.log("setValue 123", "getValue", value)
    assertEquals(value, 123)
    await sleep()
    keys = await listValues()
    assertTrue(keys.includes(key))
    assertEquals(changeCount, 2)
    assertEquals(value, value2)

    await setValue(key, undefined)
    value = await getValue(key)
    console.log("setValue undefined", "getValue", value)
    assertEquals(value, 123)
    await sleep()
    assertEquals(changeCount, 2)
    assertEquals(value, value2)

    await setValue(key, null)
    value = await getValue(key)
    console.log("setValue null", "getValue", value)
    assertEquals(value, null)
    await sleep()
    assertEquals(changeCount, 3)

    await setValue(key, "abc")
    value = await getValue(key)
    console.log("setValue abc", "getValue", value)
    assertEquals(value, "abc")
    await sleep()
    assertEquals(changeCount, 4)

    await setValue(key, undefined)
    value = await getValue(key)
    console.log("setValue undefined", "getValue", value)
    assertEquals(value, "abc")
    await sleep()
    assertEquals(changeCount, 4)

    await setValue(key, null)
    value = await getValue(key)
    console.log("setValue null", "getValue", value)
    assertEquals(value, null)
    await sleep()
    assertEquals(changeCount, 5)

    await setValue(key, [1, 2, 3])
    value = await getValue(key)
    console.log("setValue [1, 2, 3]", "getValue", value)
    assertEquals(JSON.stringify(value), JSON.stringify([1, 2, 3]))
    await sleep()
    assertEquals(changeCount, 6)

    // Should not emit valueChange event
    await setValue(key, [1, 2, 3])
    value = await getValue(key)
    console.log("setValue [1, 2, 3]", "getValue", value)
    assertEquals(JSON.stringify(value), JSON.stringify([1, 2, 3]))
    await sleep()
    assertEquals(changeCount, 6)

    await setValue(key, undefined)
    value = await getValue(key)
    console.log("setValue undefined", "getValue", value)
    assertEquals(JSON.stringify(value), JSON.stringify([1, 2, 3]))
    await sleep()
    assertEquals(changeCount, 6)

    removeValueChangeListener()

    await setValue(key, null)
    value = await getValue(key)
    console.log("setValue null", "getValue", value)
    assertEquals(value, null)
    await sleep()
    assertEquals(changeCount, 6)

    keys = await listValues()
    assertTrue(keys.includes(key))

    await deleteValue(key)
    keys = await listValues()
    assertTrue(!keys.includes(key))
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  })
}
