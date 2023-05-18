import testSetStyle from "./set-style"
import testStorage from "./storage"

export const test = async () => {
  await testStorage()
  await testSetStyle()
}
