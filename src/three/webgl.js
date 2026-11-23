let supported

// Probe once: repeated renders must not allocate additional GPU contexts.
export function webglOK() {
  if (supported !== undefined) return supported
  if (typeof document === 'undefined') return false
  try {
    const context = document.createElement('canvas').getContext('webgl2')
    supported = Boolean(context)
    context?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    supported = false
  }
  return supported
}
