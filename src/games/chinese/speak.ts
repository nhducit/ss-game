export function speakChinese(text: string, rate = 0.7): Promise<void> {
  window.speechSynthesis.cancel()
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'zh-CN'
    u.rate = rate
    u.onend = () => resolve()
    u.onerror = () => resolve()
    window.speechSynthesis.speak(u)
  })
}

export async function speakChineseSequence(items: { text: string; rate?: number; pause?: number }[]) {
  for (const item of items) {
    if (item.pause) await new Promise(r => setTimeout(r, item.pause))
    await speakChinese(item.text, item.rate ?? 0.7)
  }
}
