export async function hashPin(pin) {
  const bytes = new TextEncoder().encode(`tempo-local-lock:${pin}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function verifyPin(pin, hash) {
  return (await hashPin(pin)) === hash
}
