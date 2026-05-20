import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from 'src/firebase'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'

const BOOKING_TYPES = {
  flight: { icon: 'flight', color: '--lagoon', colorSoft: '--lagoon-soft' },
  hotel: { icon: 'hotel', color: '--accent', colorSoft: '--accent-soft' },
  restaurant: { icon: 'restaurant', color: '--hibiscus', colorSoft: '--hibiscus-soft' },
  activity: { icon: 'confirmation_number', color: '--leaf', colorSoft: '--leaf-soft' },
  other: { icon: 'bookmark', color: '--warm', colorSoft: '--warm-soft' },
}

export { BOOKING_TYPES }

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref([])
  const loading = ref(true)
  const error = ref(null)

  let unsubscribe = null

  const colRef = () => collection(db, 'trips', 'oahu-2026', 'bookings')

  function subscribe() {
    if (unsubscribe) return
    loading.value = true
    unsubscribe = onSnapshot(
      query(colRef(), orderBy('date', 'asc')),
      (snap) => {
        bookings.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        loading.value = false
      },
      (e) => {
        error.value = e.message
        loading.value = false
      },
    )
  }

  function unsubscribeAll() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  async function addBooking(data) {
    await addDoc(colRef(), { ...data, createdAt: serverTimestamp() })
  }

  async function updateBooking(id, data) {
    await updateDoc(doc(db, 'trips', 'oahu-2026', 'bookings', id), data)
  }

  async function deleteBooking(id) {
    await deleteDoc(doc(db, 'trips', 'oahu-2026', 'bookings', id))
  }

  return { bookings, loading, error, subscribe, unsubscribeAll, addBooking, updateBooking, deleteBooking }
})
