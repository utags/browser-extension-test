const failures: Error[] = []

export function assertEquals(value1: any, value2: any) {
  if (value1 !== value2) {
    const error = new Error(
      `Assert failed: ${String(value1)} with ${String(value2)}`
    )
    console.error(error)
    failures.push(error)
  }
}

export function assertTrue(value: boolean, message?: string) {
  if (!value) {
    const error = new Error(`Assert failed. ${message ?? ""}`)
    console.error(error)
    failures.push(error)
  }
}

export async function runTest(name: string, func: () => Promise<void>) {
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
