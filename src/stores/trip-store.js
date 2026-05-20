import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from 'src/firebase'
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore'

export const useTripStore = defineStore('trip', () => {
  const days = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchDays() {
    loading.value = true
    error.value = null
    try {
      const snap = await getDocs(query(collection(db, 'trips', 'oahu-2026', 'days'), orderBy('day')))
      days.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function _persistEvents(dayId, events) {
    const dayRef = doc(db, 'trips', 'oahu-2026', 'days', dayId)
    await updateDoc(dayRef, { events })
    const idx = days.value.findIndex((d) => d.id === dayId)
    if (idx !== -1) days.value[idx].events = events
  }

  async function reorderEvents(dayId, reorderedEvents) {
    await _persistEvents(dayId, reorderedEvents)
  }

  async function addEvent(dayId, event) {
    const day = days.value.find((d) => d.id === dayId)
    if (!day) return
    const events = [...(day.events || []), event]
    await _persistEvents(dayId, events)
  }

  async function updateEvent(dayId, index, event) {
    const day = days.value.find((d) => d.id === dayId)
    if (!day) return
    const events = [...(day.events || [])]
    events[index] = event
    await _persistEvents(dayId, events)
  }

  async function deleteEvent(dayId, index) {
    const day = days.value.find((d) => d.id === dayId)
    if (!day) return
    const events = [...(day.events || [])]
    events.splice(index, 1)
    await _persistEvents(dayId, events)
  }

  return { days, loading, error, fetchDays, reorderEvents, addEvent, updateEvent, deleteEvent }
})
