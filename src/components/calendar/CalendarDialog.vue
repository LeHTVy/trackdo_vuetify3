<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5 pa-4" :style="{ backgroundColor: $vuetify.theme.current.colors.primary, color: 'white' }">
        <v-icon icon="mdi-calendar-plus" class="mr-2"></v-icon>
        {{ formTitle }}
      </v-card-title>

      <v-card-text class="pa-4">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedEvent.name"
                label="Event Title"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
                required
                :rules="[v => !!v || 'Event title is required']"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="editedEvent.details"
                label="Event Details"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
                rows="3"
                auto-grow
              ></v-textarea>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedEvent.start"
                label="Start Date"
                type="date"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedEvent.end"
                label="End Date"
                type="date"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-select
                v-model="editedEvent.color"
                :items="eventColors"
                label="Event Color"
                variant="outlined"
                :color="$vuetify.theme.current.colors.primary"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon :color="item.raw.value" icon="mdi-circle"></v-icon>
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ item }">
                  <v-chip :color="item.raw.value" size="small" class="mr-2">
                    {{ item.raw.text }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="closeDialog"
          :disabled="loading"
        >
          Cancel
        </v-btn>
        <v-btn
          :color="$vuetify.theme.current.colors.primary"
          variant="elevated"
          @click="saveEvent"
          :disabled="!editedEvent.name || loading"
          :loading="loading"
        >
          {{ editedIndex === -1 ? 'Create' : 'Update' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Event Details Dialog -->
  <v-dialog v-model="detailsDialog" max-width="500px">
    <v-card v-if="selectedEvent">
      <v-card-title class="text-h6 pa-4" :style="{ backgroundColor: selectedEvent.color, color: 'white' }">
        <v-icon icon="mdi-calendar-check" class="mr-2"></v-icon>
        {{ selectedEvent.name }}
      </v-card-title>

      <v-card-text class="pa-4">
        <div v-if="selectedEvent.details" class="mb-3">
          <v-icon icon="mdi-text" :color="$vuetify.theme.current.colors.primary" class="mr-2"></v-icon>
          {{ selectedEvent.details }}
        </div>

        <div class="mb-2">
          <v-icon icon="mdi-calendar-start" :color="$vuetify.theme.current.colors.primary" class="mr-2"></v-icon>
          <strong>Start:</strong> {{ formatDate(selectedEvent.start) }}
        </div>

        <div v-if="selectedEvent.end && selectedEvent.end !== selectedEvent.start">
          <v-icon icon="mdi-calendar-end" :color="$vuetify.theme.current.colors.primary" class="mr-2"></v-icon>
          <strong>End:</strong> {{ formatDate(selectedEvent.end) }}
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="text"
          @click="deleteEvent"
        >
          <v-icon icon="mdi-delete" class="mr-1"></v-icon>
          Delete
        </v-btn>
        <v-btn
          :color="$vuetify.theme.current.colors.primary"
          variant="text"
          @click="editEvent"
        >
          <v-icon icon="mdi-pencil" class="mr-1"></v-icon>
          Edit
        </v-btn>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="detailsDialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CalendarDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    detailsModelValue: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object,
      default: () => ({})
    },
    selectedEvent: {
      type: Object,
      default: null
    },
    editedIndex: {
      type: Number,
      default: -1
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'update:detailsModelValue', 'save-event', 'delete-event', 'edit-event', 'close'],
  data() {
    return {
      editedEvent: {
        name: '',
        details: '',
        start: new Date().toISOString().substr(0, 10),
        end: new Date().toISOString().substr(0, 10),
        color: 'primary',
      },
      eventColors: [
        { text: 'Primary', value: 'primary' },
        { text: 'Secondary', value: 'secondary' },
        { text: 'Accent', value: 'accent' },
        { text: 'Success', value: 'success' },
        { text: 'Warning', value: 'warning' },
        { text: 'Error', value: 'error' },
        { text: 'Info', value: 'info' },
      ]
    }
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    detailsDialog: {
      get() {
        return this.detailsModelValue
      },
      set(value) {
        this.$emit('update:detailsModelValue', value)
      }
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Event' : 'Edit Event'
    }
  },
  watch: {
    event: {
      handler(newEvent) {
        this.editedEvent = { ...newEvent }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    closeDialog() {
      this.dialog = false
      this.resetForm()
      this.$emit('close')
    },
    resetForm() {
      this.editedEvent = {
        name: '',
        details: '',
        start: new Date().toISOString().substr(0, 10),
        end: new Date().toISOString().substr(0, 10),
        color: 'primary',
      }
    },
    saveEvent() {
      if (new Date(this.editedEvent.end) < new Date(this.editedEvent.start)) {
        this.editedEvent.end = this.editedEvent.start
      }

      this.$emit('save-event', { ...this.editedEvent })
      this.closeDialog()
    },
    deleteEvent() {
      if (confirm('Are you sure you want to delete this event?')) {
        this.$emit('delete-event', this.selectedEvent)
        this.detailsDialog = false
      }
    },
    editEvent() {
      this.$emit('edit-event', this.selectedEvent)
      this.detailsDialog = false
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.v-card-title {
  border-radius: 4px 4px 0 0;
}

.v-chip {
  font-weight: 500;
}
</style>
