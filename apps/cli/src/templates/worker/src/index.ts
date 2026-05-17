async function main() {
  console.log('Worker started')
  for await (const job of poll()) {
    console.log('Processing:', job)
  }
}

async function* poll(): AsyncGenerator<string> {
  while (true) {
    await new Promise((r) => setTimeout(r, 5000))
    yield 'job'
  }
}

main().catch(console.error)
