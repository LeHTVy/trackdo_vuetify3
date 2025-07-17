<template>
  <v-dialog v-model="dialogVisible" max-width="600px">
    <v-card>
      <v-card-title class="text-h5 font-weight-bold text-primary">
        {{ editingEvent ? 'Edit Event' : 'Add New Event' }}
      </v-card-title>
      <v-card-text>
        <!-- Title -->
        <v-text-field
          v-model="eventData.title"
          class="mb-3"
          label="Event Title *"
          required
          variant="outlined"
        />

        <!-- Description -->
        <v-textarea
          v-model="eventData.description"
          class="mb-3"
          label="Description"
          rows="3"
          variant="outlined"
        />

        <!-- Date and Time -->
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="startDate"
              label="Start Date *"
              required
              type="date"
              variant="outlined"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="startTime"
              :disabled="eventData.allDay"
              label="Start Time"
              type="time"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="endDate"
              label="End Date *"
              required
              type="date"
              variant="outlined"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="endTime"
              :disabled="eventData.allDay"
              label="End Time"
              type="time"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <!-- All Day Toggle -->
        <v-switch
          v-model="eventData.allDay"
          class="mb-3"
          color="primary"
          label="All Day Event"
        />

        <!-- Type -->
        <v-select
          v-model="eventData.type"
          class="mb-3"
          :items="typeOptions"
          label="Event Type"
          variant="outlined"
        />

        <!-- Priority -->
        <v-select
          v-model="eventData.priority"
          class="mb-3"
          :items="priorityOptions"
          label="Priority"
          variant="outlined"
        />

        <!-- Location -->
        <v-text-field
          v-model="eventData.location"
          class="mb-3"
          label="Location"
          variant="outlined"
        />

        <!-- Attendees -->
        <v-combobox
          v-model="eventData.attendees"
          chips
          class="mb-3"
          closable-chips
          hint="Press Enter to add attendees"
          label="Attendees"
          multiple
          variant="outlined"
        />

        <!-- Color -->
        <v-select
          v-model="eventData.color"
          class="mb-3"
          :items="colorOptions"
          label="Color"
          variant="outlined"
        />

        <!-- Status -->
        <v-select
          v-model="eventData.status"
          class="mb-3"
          :items="statusOptions"
          label="Status"
          variant="outlined"
        />

        <!-- Recurring Event -->
        <v-expansion-panels class="mb-3">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2">mdi-repeat</v-icon>
              Recurring Event
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-switch
                v-model="eventData.recurring.enabled"
                class="mb-3"
                color="primary"
                label="Enable Recurring"
              />

              <div v-if="eventData.recurring.enabled">
                <v-select
                  v-model="eventData.recurring.frequency"
                  class="mb-3"
                  :items="frequencyOptions"
                  label="Frequency"
                  variant="outlined"
                />

                <v-text-field
                  v-model.number="eventData.recurring.interval"
                  class="mb-3"
                  label="Interval"
                  min="1"
                  type="number"
                  variant="outlined"
                />

                <v-text-field
                  v-model="eventData.recurring.endDate"
                  label="End Date (Optional)"
                  type="date"
                  variant="outlined"
                />
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Reminders -->
        <v-combobox
          v-model="eventData.reminders"
          chips
          class="mb-3"
          closable-chips
          hint="Add reminder times (e.g., 15 minutes, 1 hour)"
          label="Reminders"
          multiple
          variant="outlined"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('close')">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="elevated" @click="handleSave">
          {{ editingEvent ? 'Update' : 'Add Event' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false,
    },
    editingEvent: {
      type: Object,
      default: null,
    },
    initialData: {
      type: Object,
      default: () => ({
        title: '',
        description: '',
        start: '',
        end: '',
        allDay: false,
        type: 'meeting',
        priority: 'Medium',
        location: '',
        attendees: [],
        color: '#1976D2',
        recurring: {
          enabled: false,
          frequency: 'weekly',
          interval: 1,
          endDate: '',
        },
        reminders: [],
        status: 'confirmed',
      }),
    },
  })

  const emit = defineEmits(['close', 'save'])

  const eventData = ref({ ...props.initialData })

  const dialogVisible = computed({
    get: () => props.showDialog,
    set: value => {
      if (!value) {
        emit('close')
      }
    },
  })

  const startDate = computed({
    get: () => {
      if (!eventData.value.start) return ''
      return eventData.value.start.split('T')[0]
    },
    set: value => {
      const time = startTime.value || '00:00'
      eventData.value.start = `${value}T${time}`
    },
  })

  const startTime = computed({
    get: () => {
      if (!eventData.value.start) return '00:00'
      const timePart = eventData.value.start.split('T')[1]
      return timePart ? timePart.slice(0, 5) : '00:00'
    },
    set: value => {
      const date = startDate.value || new Date().toISOString().split('T')[0]
      eventData.value.start = `${date}T${value}`
    },
  })

  const endDate = computed({
    get: () => {
      if (!eventData.value.end) return ''
      return eventData.value.end.split('T')[0]
    },
    set: value => {
      const time = endTime.value || '23:59'
      eventData.value.end = `${value}T${time}`
    },
  })

  const endTime = computed({
    get: () => {
      if (!eventData.value.end) return '23:59'
      const timePart = eventData.value.end.split('T')[1]
      return timePart ? timePart.slice(0, 5) : '23:59'
    },
    set: value => {
      const date = endDate.value || new Date().toISOString().split('T')[0]
      eventData.value.end = `${date}T${value}`
    },
  })

  // Options for select fields
  const typeOptions = [
    { title: 'Meeting', value: 'meeting' },
    { title: 'Work', value: 'work' },
    { title: 'Social', value: 'social' },
    { title: 'Milestone', value: 'milestone' },
    { title: 'Deadline', value: 'deadline' },
  ]

  const priorityOptions = [
    { title: 'Low', value: 'Low' },
    { title: 'Medium', value: 'Medium' },
    { title: 'High', value: 'High' },
  ]

  const statusOptions = [
    { title: 'Confirmed', value: 'confirmed' },
    { title: 'Tentative', value: 'tentative' },
    { title: 'Cancelled', value: 'cancelled' },
  ]

  const frequencyOptions = [
    { title: 'Daily', value: 'daily' },
    { title: 'Weekly', value: 'weekly' },
    { title: 'Monthly', value: 'monthly' },
    { title: 'Quarterly', value: 'quarterly' },
    { title: 'Yearly', value: 'yearly' },
  ]

  const colorOptions = [
    { title: 'Blue', value: '#1976D2' },
    { title: 'Green', value: '#4CAF50' },
    { title: 'Red', value: '#F44336' },
    { title: 'Orange', value: '#FF9800' },
    { title: 'Purple', value: '#9C27B0' },
    { title: 'Teal', value: '#009688' },
    { title: 'Pink', value: '#E91E63' },
    { title: 'Indigo', value: '#3F51B5' },
  ]

  const handleSave = () => {
    // Ensure required fields are filled
    if (!eventData.value.title || !eventData.value.start || !eventData.value.end) {
      alert('Please fill in all required fields (Title, Start Date, End Date)')
      return
    }

    // If all day event, set times to full day
    if (eventData.value.allDay) {
      const startDateOnly = eventData.value.start.split('T')[0]
      const endDateOnly = eventData.value.end.split('T')[0]
      eventData.value.start = `${startDateOnly}T00:00`
      eventData.value.end = `${endDateOnly}T23:59`
    }

    emit('save', { ...eventData.value })
  }

  // Watch for all day changes
  watch(() => eventData.value.allDay, newValue => {
    if (newValue) {
      // Set to full day times
      const startDateOnly = startDate.value || new Date().toISOString().split('T')[0]
      const endDateOnly = endDate.value || startDateOnly
      eventData.value.start = `${startDateOnly}T00:00`
      eventData.value.end = `${endDateOnly}T23:59`
    }
  })

  watch(() => props.initialData, newData => {
    eventData.value = {
      ...newData,
      recurring: newData.recurring || {
        enabled: false,
        frequency: 'weekly',
        interval: 1,
        endDate: '',
      },
      attendees: newData.attendees || [],
      reminders: newData.reminders || [],
    }
  }, { deep: true })

  watch(() => props.showDialog, newValue => {
    if (!newValue) {
      eventData.value = {
        ...props.initialData,
        recurring: props.initialData.recurring || {
          enabled: false,
          frequency: 'weekly',
          interval: 1,
          endDate: '',
        },
        attendees: props.initialData.attendees || [],
        reminders: props.initialData.reminders || [],
      }
    }
  })
</script>
