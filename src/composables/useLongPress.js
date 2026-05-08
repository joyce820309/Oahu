import { onUnmounted } from 'vue'

export function useLongPress(callback, { delay = 500, moveThreshold = 8 } = {}) {
  let timer = null
  let startX = 0
  let startY = 0

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return

    startX = e.clientX
    startY = e.clientY

    timer = setTimeout(() => {
      timer = null
      callback(e)
    }, delay)

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', cancel)
    window.addEventListener('pointercancel', cancel)
  }

  function onPointerMove(e) {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (Math.sqrt(dx * dx + dy * dy) > moveThreshold) cancel()
  }

  function cancel() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', cancel)
    window.removeEventListener('pointercancel', cancel)
  }

  onUnmounted(cancel)

  return { onPointerDown }
}
