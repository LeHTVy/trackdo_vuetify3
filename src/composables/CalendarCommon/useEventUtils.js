export function useEventUtils (eventsStore) {
  const findEventById = (eventId, events = null) => {
    const eventsList = events || eventsStore.events
    return eventsList.find(e =>
      (e.id && e.id === eventId) ||
      (e._id && e._id === eventId)
    )
  }

  const findEventByReference = (referenceEvent, events = null) => {
    const eventsList = events || eventsStore.events
    return eventsList.find(e =>
      (e.id && referenceEvent.id && e.id === referenceEvent.id) ||
      (e._id && referenceEvent._id && e._id === referenceEvent._id) ||
      (e.title === referenceEvent.title && e.start === referenceEvent.start)
    )
  }

  const findEventIndex = (event, events = null) => {
    const eventsList = events || eventsStore.events
    const index = eventsList.findIndex(e =>
      (e.id && e.id === event.id) ||
      (e._id && e._id === event._id) ||
      (e.title === event.title && e.start === event.start)
    )
    return index !== -1 ? index : 0
  }

  const getEventIdentifier = event => {
    return event?.id || event?._id || `${event?.title}-${event?.start}`
  }

  return {
    findEventById,
    findEventByReference,
    findEventIndex,
    getEventIdentifier,
  }
}
