<template>
  <div class="avatar-group-container">
    <div class="avatar-stack" :style="{ width: stackWidth }">
      <v-avatar
        v-for="(member, index) in visibleMembers"
        :key="member.id || index"
        class="avatar-item"
        :color="member.color || 'primary'"
        :size="size"
        :style="getAvatarStyle(index)"
        @click="$emit('avatar-click', member)"
      >
        <v-img v-if="member.avatar" :alt="member.name" :src="member.avatar" />
        <span v-else class="avatar-text">{{ getInitials(member) }}</span>
      </v-avatar>

      <!-- Overflow indicator -->
      <v-avatar
        v-if="hasOverflow"
        class="avatar-item overflow-avatar"
        :color="overflowColor"
        :size="size"
        :style="getAvatarStyle(visibleMembers.length)"
        @click="$emit('overflow-click', hiddenMembers)"
      >
        <span class="text-caption font-weight-bold">+{{ hiddenCount }}</span>
      </v-avatar>
    </div>

    <!-- Tooltip for overflow -->
    <v-tooltip v-if="hasOverflow && showTooltip" activator="parent" location="top">
      <div class="overflow-tooltip">
        <div v-for="member in hiddenMembers" :key="member.id" class="tooltip-member">
          {{ member.name || member.initials }}
        </div>
      </div>
    </v-tooltip>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    members: {
      type: Array,
      required: false,
      default: () => [],
    },
    max: {
      type: Number,
      default: 3,
    },
    size: {
      type: [String, Number],
      default: 32,
    },
    spacing: {
      type: Number,
      default: -8,
    },
    overflowColor: {
      type: String,
      default: 'grey-lighten-1',
    },
    showTooltip: {
      type: Boolean,
      default: true,
    },
    clickable: {
      type: Boolean,
      default: true,
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const emit = defineEmits(['avatar-click', 'overflow-click'])

  const visibleMembers = computed(() => props.members.slice(0, props.max))
  const hiddenMembers = computed(() => props.members.slice(props.max))
  const hiddenCount = computed(() => hiddenMembers.value.length)
  const hasOverflow = computed(() => props.members.length > props.max)

  const stackWidth = computed(() => {
    const avatarSize = typeof props.size === 'string' ? Number.parseInt(props.size) : props.size
    const visibleCount = visibleMembers.value.length
    const overflowCount = hasOverflow.value ? 1 : 0
    const totalAvatars = visibleCount + overflowCount

    if (totalAvatars <= 1) return `${avatarSize}px`

    return `${avatarSize + (totalAvatars - 1) * Math.abs(props.spacing)}px`
  })

  const getAvatarStyle = index => ({
    marginLeft: index > 0 ? `${props.spacing}px` : '0',
    zIndex: props.members.length - index,
    cursor: props.clickable ? 'pointer' : 'default',
  })

  const getInitials = member => {
    if (member.initials) return member.initials
    if (member.name) {
      return member.name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return '??'
  }
</script>

<style scoped>
.avatar-group-container {
  position: relative;
  display: inline-block;
}

.avatar-stack {
  display: flex;
  align-items: center;
  position: relative;
}

.avatar-item {
  border: 2px solid white;
  transition: all 0.2s ease;
  position: relative;
}

.avatar-item:hover {
  transform: scale(1.1);
  z-index: 999 !important;
}

.avatar-text {
  font-weight: 600;
  font-size: 0.75rem;
}

.overflow-avatar {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

.overflow-tooltip {
  max-width: 200px;
}

.tooltip-member {
  padding: 2px 0;
  font-size: 0.875rem;
}

/* Dark theme adjustments */
.v-theme--dark .avatar-item {
  border-color: #2d3748;
}

.v-theme--dark .overflow-avatar {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
