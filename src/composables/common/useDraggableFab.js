import { computed, onMounted, onUnmounted, readonly, ref } from 'vue'

/**
 * @param {Object} options - Configuration options
 * @param {string} options.storageKey - localStorage key for saving position (default: 'fabPosition')
 * @param {number} options.fabSize - Size of the FAB in pixels (default: 56)
 * @param {number} options.initialOffsetX - Initial offset from right edge (default: 80)
 * @param {number} options.initialOffsetY - Initial offset from bottom edge (default: 120)
 */
export function useDraggableFab (options = {}) {
  const {
    storageKey = 'fabPosition',
    fabSize = 56,
    initialOffsetX = 80,
    initialOffsetY = 120,
  } = options

  const isDragging = ref(false)
  const fabPosition = ref({ x: 0, y: 0 })
  const dragOffset = ref({ x: 0, y: 0 })

  const initializePosition = () => {
    const initialX = window.innerWidth - initialOffsetX
    const initialY = window.innerHeight - initialOffsetY
    fabPosition.value = { x: initialX, y: initialY }

    const savedPosition = localStorage.getItem(storageKey)
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition)
        if (parsed.x >= 0 && parsed.x <= window.innerWidth - fabSize &&
            parsed.y >= 0 && parsed.y <= window.innerHeight - fabSize) {
          fabPosition.value = parsed
        }
      } catch (e) {
        console.warn('Failed to parse saved FAB position:', e)
      }
    }
  }

  const startDrag = event => {
    event.preventDefault()
    isDragging.value = true
    const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX
    const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY

    dragOffset.value = {
      x: clientX - fabPosition.value.x,
      y: clientY - fabPosition.value.y,
    }

    // Add event listeners for drag
    if (event.type === 'touchstart') {
      document.addEventListener('touchmove', onDrag, { passive: false })
      document.addEventListener('touchend', stopDrag)
    } else {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', stopDrag)
    }
  }

  const onDrag = event => {
    if (!isDragging.value) return

    event.preventDefault()

    const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX
    const clientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY

    let newX = clientX - dragOffset.value.x
    let newY = clientY - dragOffset.value.y

    // Constrain to viewport bounds
    newX = Math.max(0, Math.min(window.innerWidth - fabSize, newX))
    newY = Math.max(0, Math.min(window.innerHeight - fabSize, newY))

    fabPosition.value = { x: newX, y: newY }
  }

  const stopDrag = () => {
    isDragging.value = false

    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('touchmove', onDrag)
    document.removeEventListener('touchend', stopDrag)

    localStorage.setItem(storageKey, JSON.stringify(fabPosition.value))
  }

  const cleanup = () => {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('touchmove', onDrag)
    document.removeEventListener('touchend', stopDrag)
  }

  const handleResize = () => {
    const currentPos = fabPosition.value
    const maxX = window.innerWidth - fabSize
    const maxY = window.innerHeight - fabSize

    if (currentPos.x > maxX || currentPos.y > maxY) {
      fabPosition.value = {
        x: Math.min(currentPos.x, maxX),
        y: Math.min(currentPos.y, maxY),
      }
      localStorage.setItem(storageKey, JSON.stringify(fabPosition.value))
    }
  }

  // Lifecycle hooks
  onMounted(() => {
    initializePosition()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    cleanup()
    window.removeEventListener('resize', handleResize)
  })

  // Computed style for the FAB
  const fabStyle = computed(() => ({
    position: 'fixed',
    left: fabPosition.value.x + 'px',
    top: fabPosition.value.y + 'px',
    zIndex: 1000,
    cursor: isDragging.value ? 'grabbing' : 'grab',
  }))

  // Return reactive state and methods
  return {
    // State
    isDragging: readonly(isDragging),
    fabPosition: readonly(fabPosition),
    fabStyle,

    // Methods
    startDrag,

    // Utilities
    resetPosition: () => {
      localStorage.removeItem(storageKey)
      initializePosition()
    },
  }
}
