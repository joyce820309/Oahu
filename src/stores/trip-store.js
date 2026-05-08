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

  async function reorderEvents(dayId, reorderedEvents) {
    const dayRef = doc(db, 'trips', 'oahu-2026', 'days', dayId)
    await updateDoc(dayRef, { events: reorderedEvents })
    const dayIndex = days.value.findIndex((d) => d.id === dayId)
    if (dayIndex !== -1) days.value[dayIndex].events = reorderedEvents
  }

  return { days, loading, error, fetchDays, reorderEvents }
})
