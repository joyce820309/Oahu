<template>
  <q-page class="q-pb-xl" style="background: transparent;">
    <div style="padding: 24px 16px 0;">

      <!-- Header -->
      <div class="t-mono-cap" style="margin-bottom: 4px;">RESERVATIONS</div>
      <div class="t-display" style="font-size: 40px; color: var(--lagoon); margin-bottom: 8px;">Bookings</div>

      <!-- Summary chips -->
      <div class="booking-type-row" style="margin-bottom: 20px;">
        <button
          v-for="f in filters"
          :key="f.key"
          class="type-chip"
          :class="{ active: activeFilter === f.key }"
          @click="activeFilter = f.key"
        >
          <q-icon :name="f.icon" size="13px" style="margin-right: 4px;" />
          {{ t(f.labelKey) }}
          <span v-if="countByType(f.key) > 0" class="chip-badge">{{ countByType(f.key) }}</span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="glass-strong" style="padding: 32px; text-align: center;">
        <q-spinner color="primary" size="32px" />
      </div>

      <!-- Empty state -->
      <div
        v-else-if="filteredBookings.length === 0"
        class="glass-strong"
        style="padding: 40px 24px; text-align: center;"
      >
        <q-icon name="bookmark_border" size="40px" style="color: var(--ink-faint); margin-bottom: 12px; display: block;" />
        <div style="font-size: 15px; font-weight: 600; color: var(--ink);">{{ t('booking_empty_title') }}</div>
        <div style="font-size: 13px; color: var(--ink-mute); margin-top: 4px;">{{ t('booking_empty_hint') }}</div>
      </div>

      <!-- Booking cards -->
      <div v-else style="display: flex; flex-direction: column; gap: 12px;">
        <div
          v-for="b in filteredBookings"
          :key="b.id"
          class="glass-strong booking-card"
        >
          <!-- Left accent bar -->
          <div class="booking-accent-bar" :style="{ background: `var(${typeColor(b.type)})` }" />

          <div class="booking-card-inner">
            <!-- Top row -->
            <div class="row items-start justify-between no-wrap">
              <div class="row items-center no-wrap" style="gap: 10px; flex: 1; min-width: 0;">
                <div class="booking-type-icon" :style="{ background: `var(${typeColorSoft(b.type)})`, color: `var(${typeColor(b.type)})` }">
                  <q-icon :name="typeIcon(b.type)" size="18px" />
                </div>
                <div style="min-width: 0;">
                  <div class="t-mono-cap" style="margin-bottom: 2px;">{{ t('booking_type_' + b.type) }}</div>
                  <div style="font-size: 16px; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    {{ b.title }}
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="row no-wrap" style="gap: 4px; flex-shrink: 0; margin-left: 8px;">
                <q-btn flat dense round icon="edit" size="sm" style="color: var(--ink-mute);" @click="openEdit(b)" />
                <q-btn flat dense round icon="delete_outline" size="sm" style="color: var(--hibiscus);" @click="confirmDelete(b)" />
              </div>
            </div>

            <!-- Detail rows -->
            <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 6px;">
              <div v-if="b.date" class="booking-detail-row">
                <q-icon name="calendar_today" size="14px" />
                <span>{{ b.date }}<span v-if="b.time"> · {{ b.time }}</span></span>
              </div>
              <div v-if="b.location" class="booking-detail-row">
                <q-icon name="place" size="14px" />
                <span>{{ b.location }}</span>
              </div>
              <div v-if="b.confirmationNo" class="booking-detail-row">
                <q-icon name="confirmation_number" size="14px" />
                <span>{{ t('booking_conf_no') }} {{ b.confirmationNo }}</span>
              </div>
              <div v-if="b.amount" class="booking-detail-row">
                <q-icon name="payments" size="14px" />
                <span>{{ b.amount }}</span>
              </div>
              <div v-if="b.notes" class="booking-note">{{ b.notes }}</div>
            </div>

            <!-- Status badge -->
            <div style="margin-top: 10px;">
              <span class="booking-status-badge" :class="'status-' + (b.status || 'confirmed')">
                {{ t('booking_status_' + (b.status || 'confirmed')) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAB -->
    <q-btn
      fab
      icon="add"
      style="position: fixed; bottom: 80px; right: 20px; z-index: 100; border-radius: 10px; background: var(--lagoon); color: #fff;"
      @click="openAdd"
    />

    <!-- Add / Edit Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="width: 100%; max-width: 480px; border-radius: 20px; background: var(--surface);">
        <q-card-section style="padding: 20px 20px 0;">
          <div class="t-mono-cap" style="margin-bottom: 4px;">{{ isEditing ? t('booking_dialog_edit') : t('booking_dialog_add') }}</div>
          <div style="font-size: 20px; font-weight: 700; color: var(--ink);">{{ t('booking_dialog_title') }}</div>
        </q-card-section>

        <q-card-section style="padding: 16px 20px; display: flex; flex-direction: column; gap: 14px;">
          <!-- Type selector -->
          <div>
            <div style="font-size: 12px; color: var(--ink-mute); margin-bottom: 8px;">{{ t('booking_field_type') }}</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button
                v-for="bt in bookingTypes"
                :key="bt.key"
                class="type-chip"
                :class="{ active: form.type === bt.key }"
                @click="form.type = bt.key"
              >
                <q-icon :name="bt.icon" size="13px" style="margin-right: 4px;" />
                {{ t('booking_type_' + bt.key) }}
              </button>
            </div>
          </div>

          <q-input
            v-model="form.title"
            :label="t('booking_field_title')"
            outlined rounded
            dense
            color="primary"
            bg-color="transparent"
            :rules="[v => !!v || t('booking_required')]"
          />
          <div class="row q-gutter-sm">
            <!-- Date picker -->
            <q-input
              v-model="form.date"
              :label="t('booking_field_date')"
              outlined rounded dense color="primary" bg-color="transparent"
              class="col"
              readonly
            >
              <template #append>
                <q-icon name="calendar_today" size="16px" style="cursor:pointer; color: var(--ink-mute);">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="form.date"
                      mask="YYYY.MM.DD"
                      color="primary"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="t('booking_picker_ok')" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <!-- Time picker -->
            <q-input
              v-model="form.time"
              :label="t('booking_field_time')"
              outlined rounded dense color="primary" bg-color="transparent"
              class="col"
              readonly
            >
              <template #append>
                <q-icon name="schedule" size="16px" style="cursor:pointer; color: var(--ink-mute);">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time
                      v-model="form.time"
                      mask="HH:mm"
                      format24h
                      color="primary"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label="t('booking_picker_ok')" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-input
            v-model="form.location"
            :label="t('booking_field_location')"
            outlined rounded dense color="primary" bg-color="transparent"
          />
          <q-input
            v-model="form.confirmationNo"
            :label="t('booking_field_conf_no')"
            outlined rounded dense color="primary" bg-color="transparent"
          />
          <q-input
            v-model="form.amount"
            :label="t('booking_field_amount')"
            outlined rounded dense color="primary" bg-color="transparent"
            placeholder="USD 120"
          />

          <!-- Status -->
          <div>
            <div style="font-size: 12px; color: var(--ink-mute); margin-bottom: 8px;">{{ t('booking_field_status') }}</div>
            <div style="display: flex; gap: 8px;">
              <button
                v-for="s in statuses"
                :key="s"
                class="type-chip"
                :class="{ active: form.status === s }"
                @click="form.status = s"
              >{{ t('booking_status_' + s) }}</button>
            </div>
          </div>

          <q-input
            v-model="form.notes"
            :label="t('booking_field_notes')"
            outlined dense color="primary" bg-color="transparent"
            type="textarea"
            rows="2"
            autogrow
          />
        </q-card-section>

        <q-card-actions style="padding: 8px 20px 20px; gap: 8px;">
          <q-btn flat :label="t('booking_cancel')" style="color: var(--ink-mute);" @click="closeDialog" />
          <q-space />
          <q-btn
            unelevated
            :label="isEditing ? t('booking_save') : t('booking_add_btn')"
            color="primary"
            :loading="saving"
            @click="submitForm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete confirm dialog -->
    <q-dialog v-model="deleteDialogOpen">
      <q-card style="border-radius: 20px; background: var(--surface); min-width: 280px;">
        <q-card-section style="padding: 20px;">
          <div style="font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 6px;">{{ t('booking_delete_title') }}</div>
          <div style="font-size: 13px; color: var(--ink-mute);">{{ deletingItem?.title }}</div>
        </q-card-section>
        <q-card-actions style="padding: 0 20px 20px; gap: 8px;">
          <q-btn flat :label="t('booking_cancel')" style="color: var(--ink-mute);" @click="deleteDialogOpen = false" />
          <q-space />
          <q-btn unelevated :label="t('booking_delete_confirm')" color="negative" :loading="deleting" @click="executeDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { useBookingStore, BOOKING_TYPES } from 'src/stores/booking-store'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const bookingStore = useBookingStore()
const { bookings, loading } = storeToRefs(bookingStore)

onMounted(() => bookingStore.subscribe())

// ── Filters ──────────────────────────────────────────
const activeFilter = ref('all')

const filters = [
  { key: 'all', icon: 'apps', labelKey: 'booking_filter_all' },
  { key: 'flight', icon: 'flight', labelKey: 'booking_type_flight' },
  { key: 'hotel', icon: 'hotel', labelKey: 'booking_type_hotel' },
  { key: 'restaurant', icon: 'restaurant', labelKey: 'booking_type_restaurant' },
  { key: 'activity', icon: 'confirmation_number', labelKey: 'booking_type_activity' },
  { key: 'other', icon: 'bookmark', labelKey: 'booking_type_other' },
]

const bookingTypes = [
  { key: 'flight', icon: 'flight' },
  { key: 'hotel', icon: 'hotel' },
  { key: 'restaurant', icon: 'restaurant' },
  { key: 'activity', icon: 'confirmation_number' },
  { key: 'other', icon: 'bookmark' },
]

const statuses = ['confirmed', 'pending', 'cancelled']

const filteredBookings = computed(() =>
  activeFilter.value === 'all'
    ? bookings.value
    : bookings.value.filter((b) => b.type === activeFilter.value),
)

const countByType = (type) =>
  type === 'all' ? bookings.value.length : bookings.value.filter((b) => b.type === type).length

// ── Type helpers ──────────────────────────────────────
const typeIcon = (type) => BOOKING_TYPES[type]?.icon ?? 'bookmark'
const typeColor = (type) => BOOKING_TYPES[type]?.color ?? '--warm'
const typeColorSoft = (type) => BOOKING_TYPES[type]?.colorSoft ?? '--warm-soft'

// ── Form ──────────────────────────────────────────────
const emptyForm = () => ({
  type: 'flight',
  title: '',
  date: '',
  time: '',
  location: '',
  confirmationNo: '',
  amount: '',
  status: 'confirmed',
  notes: '',
})

const dialogOpen = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const form = ref(emptyForm())
const saving = ref(false)

const openAdd = () => {
  form.value = emptyForm()
  isEditing.value = false
  editingId.value = null
  dialogOpen.value = true
}

const openEdit = (b) => {
  form.value = {
    type: b.type ?? 'flight',
    title: b.title ?? '',
    date: b.date ?? '',
    time: b.time ?? '',
    location: b.location ?? '',
    confirmationNo: b.confirmationNo ?? '',
    amount: b.amount ?? '',
    status: b.status ?? 'confirmed',
    notes: b.notes ?? '',
  }
  isEditing.value = true
  editingId.value = b.id
  dialogOpen.value = true
}

const closeDialog = () => {
  dialogOpen.value = false
}

const submitForm = async () => {
  if (!form.value.title.trim()) return
  saving.value = true
  try {
    if (isEditing.value) {
      await bookingStore.updateBooking(editingId.value, { ...form.value })
    } else {
      await bookingStore.addBooking({ ...form.value })
    }
    dialogOpen.value = false
  } finally {
    saving.value = false
  }
}

// ── Delete ────────────────────────────────────────────
const deleteDialogOpen = ref(false)
const deletingItem = ref(null)
const deleting = ref(false)

const confirmDelete = (b) => {
  deletingItem.value = b
  deleteDialogOpen.value = true
}

const executeDelete = async () => {
  deleting.value = true
  try {
    await bookingStore.deleteBooking(deletingItem.value.id)
    deleteDialogOpen.value = false
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.booking-type-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1.5px solid var(--surface-stroke);
  background: transparent;
  color: var(--ink-mute);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.18s ease;
  position: relative;
}

.type-chip.active {
  background: var(--lagoon-soft);
  border-color: var(--lagoon);
  color: var(--lagoon);
}

.chip-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  background: var(--lagoon);
  color: #fff;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
}

.booking-card {
  position: relative;
  overflow: hidden;
  display: flex;
}

.booking-accent-bar {
  width: 4px;
  flex-shrink: 0;
  border-radius: 22px 0 0 22px;
}

.booking-card-inner {
  flex: 1;
  padding: 14px 14px 14px 12px;
  min-width: 0;
}

.booking-type-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.booking-detail-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--ink-soft);
}

.booking-note {
  font-size: 12px;
  color: var(--ink-mute);
  background: var(--surface-stroke);
  border-radius: 8px;
  padding: 8px 10px;
  line-height: 1.5;
  margin-top: 2px;
}

.booking-status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.status-confirmed {
  background: var(--lagoon-soft);
  color: var(--lagoon);
}

.status-pending {
  background: var(--warm-soft);
  color: var(--accent-deep);
}

.status-cancelled {
  background: var(--hibiscus-soft);
  color: var(--hibiscus);
}
</style>
