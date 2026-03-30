export function speak(text: string, rate = 0.7): Promise<void> {
  window.speechSynthesis.cancel()
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = rate
    u.onend = () => resolve()
    u.onerror = () => resolve()
    window.speechSynthesis.speak(u)
  })
}

/** Speak multiple texts in sequence with a pause between each */
export async function speakSequence(items: { text: string; rate?: number; pause?: number }[]) {
  for (const item of items) {
    if (item.pause) await new Promise(r => setTimeout(r, item.pause))
    await speak(item.text, item.rate ?? 0.7)
  }
}
