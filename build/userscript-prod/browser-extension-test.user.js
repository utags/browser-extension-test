// ==UserScript==
// @name                 Browser Extension Test
// @name:zh-CN           Browser Extension Test
// @namespace            https://github.com/utags/browser-extension-starter
// @homepageURL          https://github.com/utags/browser-extension-starter#readme
// @supportURL           https://github.com/utags/browser-extension-starter/issues
// @version              0.1.0
// @description          try to take over the world!
// @description:zh-CN    让世界更美好！
// @icon                 https://www.tampermonkey.net/favicon.ico
// @author               You
// @license              MIT
// @match                https://*/*
// @match                http://*/*
// @grant                GM.getValue
// @grant                GM.setValue
// @grant                GM.deleteValue
// @grant                GM.listValues
// @grant                GM_addValueChangeListener
// @grant                GM_removeValueChangeListener
// @grant                GM_addElement
// @grant                GM_addStyle
// ==/UserScript==
//
;(() => {
  "use strict"
  var getValue = async (key) => {
    const value = await GM.getValue(key)
    return value && value !== "undefined" ? JSON.parse(value) : void 0
  }
  var setValue = async (key, value) => {
    if (value !== void 0) GM.setValue(key, JSON.stringify(value))
  }
  var deleteValue = async (key) => GM.deleteValue(key)
  var listValues = async () => GM.listValues()
  var addValueChangeListener = (key, func) => {
    if (typeof GM_addValueChangeListener !== "function") {
      console.warn("Do not support GM_addValueChangeListener!")
      return () => void 0
    }
    const listenerId = GM_addValueChangeListener(key, func)
    return () => {
      GM_removeValueChangeListener(listenerId)
    }
  }
  var doc = document
  var $ = (selectors, element) => (element || doc).querySelector(selectors)
  var $$ = (selectors, element) => [
    ...(element || doc).querySelectorAll(selectors),
  ]
  var createElement = (tagName, attributes) =>
    setAttributes(doc.createElement(tagName), attributes)
  var addElement = (parentNode, tagName, attributes) => {
    if (!parentNode) {
      return
    }
    if (typeof parentNode === "string") {
      attributes = tagName
      tagName = parentNode
      parentNode = doc.head
    }
    if (typeof tagName === "string") {
      const element = createElement(tagName, attributes)
      parentNode.append(element)
      return element
    }
    setAttributes(tagName, attributes)
    parentNode.append(tagName)
    return tagName
  }
  var addStyle = (styleText) => {
    const element = createElement("style", { textContent: styleText })
    doc.head.append(element)
    return element
  }
  var addEventListener = (element, type, listener, options) => {
    if (!element) {
      return
    }
    if (typeof type === "object") {
      for (const type1 in type) {
        if (Object.hasOwn(type, type1)) {
          element.addEventListener(type1, type[type1])
        }
      }
    } else if (typeof type === "string" && typeof listener === "function") {
      element.addEventListener(type, listener, options)
    }
  }
  var setAttribute = (element, name, value) =>
    element ? element.setAttribute(name, value) : void 0
  var setAttributes = (element, attributes) => {
    if (element && attributes) {
      for (const name in attributes) {
        if (Object.hasOwn(attributes, name)) {
          const value = attributes[name]
          if (value === void 0) {
            continue
          }
          if (/^(value|textContent|innerText|innerHTML)$/.test(name)) {
            element[name] = value
          } else if (name === "style") {
            setStyle(element, value, true)
          } else if (/on\w+/.test(name)) {
            const type = name.slice(2)
            addEventListener(element, type, value)
          } else {
            setAttribute(element, name, value)
          }
        }
      }
    }
    return element
  }
  var setStyle = (element, values, overwrite) => {
    if (!element) {
      return
    }
    const style = element.style
    if (typeof values === "string") {
      style.cssText = overwrite ? values : style.cssText + ";" + values
      return
    }
    if (overwrite) {
      style.cssText = ""
    }
    for (const key in values) {
      if (Object.hasOwn(values, key)) {
        style[key] = values[key].replace("!important", "")
      }
    }
  }
  if (typeof Object.hasOwn !== "function") {
    Object.hasOwn = (instance, prop) =>
      Object.prototype.hasOwnProperty.call(instance, prop)
  }
  var addElement2 =
    typeof GM_addElement === "function"
      ? (parentNode, tagName, attributes) => {
          if (!parentNode) {
            return
          }
          if (typeof parentNode === "string") {
            attributes = tagName
            tagName = parentNode
            parentNode = doc.head
          }
          if (typeof tagName === "string") {
            const element = GM_addElement(tagName)
            setAttributes(element, attributes)
            parentNode.append(element)
            return element
          }
          setAttributes(tagName, attributes)
          parentNode.append(tagName)
          return tagName
        }
      : addElement
  var addStyle2 =
    typeof GM_addStyle === "function"
      ? (styleText) => GM_addStyle(styleText)
      : addStyle
  var content_default =
    '#myprefix_div{color:#000;box-sizing:border-box;padding:10px 15px;background-color:#fff;border-radius:5px;-webkit-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);-moz-box-shadow:0px 10px 39px 10px rgba(62,66,66,.22);box-shadow:0px 10px 39px 10px rgba(62,66,66,.22) !important}#myprefix_div div{color:green}#myprefix_test_link{--border-color: linear-gradient(-45deg, #ffae00, #7e03aa, #00fffb);--border-width: 0.125em;--curve-size: 0.5em;--blur: 30px;--bg: #080312;--color: #afffff;color:var(--color);position:relative;isolation:isolate;display:inline-grid;place-content:center;padding:.5em 1.5em;font-size:17px;border:0;text-transform:uppercase;box-shadow:10px 10px 20px rgba(0,0,0,.6);clip-path:polygon(0% var(--curve-size), var(--curve-size) 0, 100% 0, 100% calc(100% - var(--curve-size)), calc(100% - var(--curve-size)) 100%, 0 100%);transition:color 250ms}#myprefix_test_link::after,#myprefix_test_link::before{content:"";position:absolute;inset:0}#myprefix_test_link::before{background:var(--border-color);background-size:300% 300%;animation:move-bg7234 5s ease infinite;z-index:-2}@keyframes move-bg7234{0%{background-position:31% 0%}50%{background-position:70% 100%}100%{background-position:31% 0%}}#myprefix_test_link::after{background:var(--bg);z-index:-1;clip-path:polygon(var(--border-width) calc(var(--curve-size) + var(--border-width) * 0.5), calc(var(--curve-size) + var(--border-width) * 0.5) var(--border-width), calc(100% - var(--border-width)) var(--border-width), calc(100% - var(--border-width)) calc(100% - (var(--curve-size) + var(--border-width) * 0.5)), calc(100% - (var(--curve-size) + var(--border-width) * 0.5)) calc(100% - var(--border-width)), var(--border-width) calc(100% - var(--border-width)));transition:clip-path 500ms}#myprefix_test_link:where(:hover,:focus)::after{clip-path:polygon(calc(100% - var(--border-width)) calc(100% - (var(--curve-size) + var(--border-width) * 0.5)), calc(100% - var(--border-width)) var(--border-width), calc(100% - var(--border-width)) var(--border-width), calc(100% - var(--border-width)) calc(100% - (var(--curve-size) + var(--border-width) * 0.5)), calc(100% - (var(--curve-size) + var(--border-width) * 0.5)) calc(100% - var(--border-width)), calc(100% - (var(--curve-size) + var(--border-width) * 0.5)) calc(100% - var(--border-width)));transition:200ms}#myprefix_test_link:where(:hover,:focus){color:#fff}'
  var failures = []
  function assertEquals(value1, value2) {
    if (value1 !== value2) {
      const error = new Error(
        `Assert failed: ${String(value1)} with ${String(value2)}`
      )
      console.error(error)
      failures.push(error)
    }
  }
  function assertTrue(value, message) {
    if (!value) {
      const error = new Error(
        `Assert failed. ${message != null ? message : ""}`
      )
      console.error(error)
      failures.push(error)
    }
  }
  async function runTest(name, func) {
    console.log("Start test", name)
    await func()
    if (failures.length === 0) {
      console.log("All test passed")
    } else {
      for (const failure of failures) {
        console.error(failure)
      }
    }
  }
  var sleep = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 100)
    })
  }
  async function test() {
    await runTest("storage", async () => {
      console.log(`[${"userscript"}] [${"prod"}] runs on`, location.href)
      const key = "test_" + Date.now()
      let value2 = null
      let changeCount = 0
      const removeValueChangeListener = addValueChangeListener(
        key,
        (_key, oldValue, newValue) => {
          console.log("addValueChangeListener", _key, oldValue, newValue)
          changeCount++
          assertEquals(key, _key)
          assertTrue(
            oldValue !== newValue,
            `oldValue: ${oldValue}, newValue: ${newValue}`
          )
          if (true) {
            newValue = JSON.parse(newValue)
          }
          value2 = newValue
        }
      )
      let value = await getValue(key)
      console.log("getValue newKey", value)
      assertEquals(value, void 0)
      let keys = await listValues()
      assertTrue(!keys.includes(key))
      await setValue(key, void 0)
      value = await getValue(key)
      console.log("setValue undefined", "getValue", value)
      assertEquals(value, void 0)
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
      await setValue(key, void 0)
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
      await setValue(key, void 0)
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
      await setValue(key, void 0)
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
      await setValue(key, [1, 2, 3])
      value = await getValue(key)
      console.log("setValue [1, 2, 3]", "getValue", value)
      assertEquals(JSON.stringify(value), JSON.stringify([1, 2, 3]))
      await sleep()
      assertEquals(changeCount, 6)
      await setValue(key, void 0)
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
    })
  }
  var test2 = async () => {
    await test()
  }
  test2()
  function showVisitCount(visitCount) {
    const div =
      $("#myprefix_div") ||
      addElement2(document.body, "div", {
        id: "myprefix_div",
        style:
          "display: block; position: fixed; top: 50px; right: 50px; z-index: 100000;",
      })
    const div2 =
      $$("div", div)[0] ||
      addElement2(div, "div", {
        style:
          "display: block; background-color: yellow; margin-bottom: 10px; padding: 4px 12px; box-sizing: border-box;",
      })
    div2.innerHTML = visitCount
  }
  async function main() {
    if (!document.body || $("#myprefix_div")) {
      return
    }
    const visitCount = (await getValue("visitCount")) || "0"
    let visitCountInt = Number.parseInt(visitCount, 10)
    showVisitCount(String(++visitCountInt))
    await setValue("visitCount", visitCountInt)
    addValueChangeListener("visitCount", async () => {
      const visitCount2 = (await getValue("visitCount")) || "0"
      showVisitCount(visitCount2)
    })
    addElement2($("#myprefix_div"), "a", {
      id: "myprefix_test_link",
      href: "https://utags.pipecraft.net/",
      target: "_blank",
      textContent: "Get UTags",
    })
    addElement2(document.head, "style", {
      textContent: content_default,
    })
    addStyle2("#myprefix_div { padding: 6px; };")
  }
  main()
})()
