import { ref } from 'vue'

export function useEventOperations(eventsStore) {

  const error = ref(null)
  const loading = ref(false)

  const clearError = () => {
    error.value = null
  }

  const setError = (err, defaultMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.') => {
    console.error('Event operation error:', err)
    error.value = defaultMessage + ' ' + (err.message || '')
  }

  const saveEvent = async (eventData, isEdit = false, selectedEvent = null) => {
    try {
      loading.value = true
      clearError()

      const eventTitle = eventData.title || eventData.name
      if (!eventTitle || !eventData.start || !eventData.end) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc.')
      }

      if (eventData.title && !eventData.name) {
        eventData.name = eventData.title
      }

      if (new Date(eventData.end) < new Date(eventData.start)) {
        eventData.end = eventData.start
      }

      if (isEdit && selectedEvent) {
        const eventId = selectedEvent.id || selectedEvent._id
        if (!eventId) {
          throw new Error('Không tìm thấy ID của sự kiện để cập nhật.')
        }
        
        await eventsStore.updateEvent({
          ...eventData,
          id: eventId
        })
      } else {
        await eventsStore.addEvent(eventData)
      }

      return { success: true }
    } catch (err) {
      setError(err, 'Không thể lưu sự kiện.')
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteEvent = async (event) => {
    try {
      loading.value = true
      clearError()

      const eventId = event?.id || event?._id
      if (!event || !eventId) {
        throw new Error('Không tìm thấy sự kiện để xóa.')
      }

      await eventsStore.deleteEvent(eventId)

      return { success: true }
    } catch (err) {
      setError(err, 'Không thể xóa sự kiện.')
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const duplicateEvent = async (event) => {
    try {
      loading.value = true
      clearError()

      if (!event) {
        throw new Error('Không tìm thấy sự kiện để sao chép.')
      }

      const duplicatedEvent = {
        ...event,
        name: `${event.name} (Sao chép)`,
        id: undefined
      }

      await eventsStore.addEvent(duplicatedEvent)

      return { success: true }
    } catch (err) {
      setError(err, 'Không thể sao chép sự kiện.')
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteMultipleEvents = async (eventIds) => {
    try {
      loading.value = true
      clearError()

      if (!eventIds || eventIds.length === 0) {
        throw new Error('Không có sự kiện nào được chọn để xóa.')
      }

      const results = await Promise.allSettled(
        eventIds.map(id => eventsStore.deleteEvent(id))
      )

      const failures = results.filter(result => result.status === 'rejected')

      if (failures.length > 0) {
        throw new Error(`Không thể xóa ${failures.length} sự kiện.`)
      }

      return { success: true, deletedCount: eventIds.length }
    } catch (err) {
      setError(err, 'Không thể xóa các sự kiện đã chọn.')
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const refreshEvents = async () => {
    try {
      loading.value = true
      clearError()

      await eventsStore.initializeStore()

      return { success: true }
    } catch (err) {
      setError(err, 'Không thể tải lại danh sách sự kiện.')
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const exportEvents = () => {
    try {
      const events = eventsStore.events
      const dataStr = JSON.stringify(events, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })

      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `events_${new Date().toISOString().split('T')[0]}.json`
      link.click()

      URL.revokeObjectURL(url)

      return { success: true }
    } catch (err) {
      setError(err, 'Không thể xuất dữ liệu sự kiện.')
      return { success: false, error: error.value }
    }
  }

  return {
    // State
    error,
    loading,

    // Methods
    saveEvent,
    deleteEvent,
    duplicateEvent,
    deleteMultipleEvents,
    refreshEvents,
    exportEvents,
    clearError,
    setError
  }
}
