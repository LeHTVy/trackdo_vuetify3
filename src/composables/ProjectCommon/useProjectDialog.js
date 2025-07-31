import { computed, ref } from 'vue'
import { useProjectColors } from './useProjectColors.js'
import { useProjectProgress } from './useProjectProgress.js'

export function useProjectDialog (editingProject = ref(null)) {
  const {
    colors,
    getStatusColor,
    getPriorityColor,
    getPrimaryColor,
    getSecondaryColor,
    getThemeColor,
    applyCssVars,
  } = useProjectColors()

  // Form state
  const form = ref(null)
  const valid = ref(false)
  const loading = ref(false)

  // Form data with default values
  const formData = ref({
    title: '',
    description: '',
    status: 'Active',
    progress: 0,
    startDate: '',
    endDate: '',
    budget: null,
    priority: 'Medium',
    category: 'General',
    teamMembers: [],
  })

  // Progress management with auto-completion
  const {
    progressRules,
    formatProgress,
    isProgressValid,
    validateProgressInput,
    handleProgressBlur,
  } = useProjectProgress(formData, (newStatus, reason) => {
    console.log(`Status auto-changed to ${newStatus}: ${reason}`)
  })

  // Validation rules
  const rules = {
    required: value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'This field is required' : true,
    title: value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Project title is required' : true,
    startDate: value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'Start date is required' : true,
    endDate: value => (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) ? 'End date is required' : true,
    progress: progressRules[0],
  }

  // Computed property to check if required fields are filled
  const isFormValid = computed(() => {
    return !!(
      formData.value.title &&
      formData.value.startDate &&
      formData.value.endDate &&
      valid.value
    )
  })

  // Status options with dynamic colors
  const statusOptions = computed(() => {
    const baseOptions = [
      {
        title: 'Active',
        value: 'Active',
        icon: 'mdi-play-circle',
        color: getStatusColor('active'),
      },
      {
        title: 'Completed',
        value: 'Completed',
        icon: 'mdi-check-circle',
        color: getStatusColor('completed'),
      },
      {
        title: 'On Hold',
        value: 'On Hold',
        icon: 'mdi-pause-circle',
        color: getStatusColor('onhold'),
      },
    ]

    // Add cancelled option only when editing
    if (editingProject.value) {
      baseOptions.push({
        title: 'Cancelled',
        value: 'Cancelled',
        icon: 'mdi-close-circle',
        color: getStatusColor('cancelled'),
      })
    }

    return baseOptions
  })

  // Priority options with dynamic colors
  const priorityOptions = computed(() => [
    {
      title: 'Low',
      value: 'Low',
      color: getPriorityColor('low'),
    },
    {
      title: 'Medium',
      value: 'Medium',
      color: getPriorityColor('medium'),
    },
    {
      title: 'High',
      value: 'High',
      color: getPriorityColor('high'),
    },
    {
      title: 'Critical',
      value: 'Critical',
      color: getPriorityColor('critical'),
    },
  ])

  // Category options with dynamic colors
  const categoryOptions = computed(() => [
    {
      title: 'Web Development',
      value: 'Web Development',
      icon: 'mdi-web',
      color: getPrimaryColor(),
    },
    {
      title: 'Mobile App',
      value: 'Mobile App',
      icon: 'mdi-cellphone',
      color: getThemeColor('info'),
    },
    {
      title: 'Data Science',
      value: 'Data Science',
      icon: 'mdi-chart-line',
      color: getThemeColor('success'),
    },
    {
      title: 'DevOps',
      value: 'DevOps',
      icon: 'mdi-server',
      color: getThemeColor('warning'),
    },
    {
      title: 'Design',
      value: 'Design',
      icon: 'mdi-palette',
      color: getSecondaryColor(),
    },
    {
      title: 'Marketing',
      value: 'Marketing',
      icon: 'mdi-bullhorn',
      color: getThemeColor('error'),
    },
    {
      title: 'Research',
      value: 'Research',
      icon: 'mdi-magnify',
      color: getThemeColor('purple'),
    },
    {
      title: 'Development',
      value: 'Development',
      icon: 'mdi-code-tags',
      color: getThemeColor('indigo'),
    },
    {
      title: 'Other',
      value: 'Other',
      icon: 'mdi-folder',
      color: getThemeColor('secondary'),
    },
  ])

  // Form management methods
  const resetForm = (initialData = {}, currentEditingProject = null) => {
    const projectToEdit = currentEditingProject || editingProject.value

    console.log('resetForm called with:', { initialData, currentEditingProject, projectToEdit })

    if (projectToEdit) {
      console.log('Editing project:', projectToEdit)
      // Create a deep copy of the project data
      formData.value = {
        title: projectToEdit.title || projectToEdit.name || '',
        description: projectToEdit.description || '',
        status: projectToEdit.status || 'Active',
        progress: projectToEdit.progress || 0,
        startDate: projectToEdit.startDate || '',
        endDate: projectToEdit.endDate || '',
        budget: projectToEdit.budget || null,
        priority: projectToEdit.priority || 'Medium',
        category: projectToEdit.category || 'Other',
        teamMembers: Array.isArray(projectToEdit.teamMembers)
          ? projectToEdit.teamMembers.map(member =>
            typeof member === 'string' ? member : (member.title || member.value || member.name || String(member))
          ).filter(member => member && member.trim() !== '')
          : [],
        id: projectToEdit._id || projectToEdit.id,
      }

      // Format dates for input fields
      if (formData.value.startDate) {
        const startDate = new Date(formData.value.startDate)
        if (!isNaN(startDate.getTime())) {
          formData.value.startDate = startDate.toISOString().split('T')[0]
        }
      }
      if (formData.value.endDate) {
        const endDate = new Date(formData.value.endDate)
        if (!isNaN(endDate.getTime())) {
          formData.value.endDate = endDate.toISOString().split('T')[0]
        }
      }

      console.log('Form data after reset:', formData.value)
    } else {
      console.log('Creating new project')
      formData.value = {
        title: '',
        description: '',
        status: 'Active',
        progress: 0,
        startDate: '',
        endDate: '',
        budget: null,
        priority: 'Medium',
        category: 'Other',
        teamMembers: [],
        ...initialData,
      }
      console.log('Form data for new project:', formData.value)
    }
  }

  // Form validation and submission
  const validateAndSubmit = async onSave => {
    console.log('validateAndSubmit called')
    console.log('form.value:', form.value)

    if (form.value) {
      console.log('Form reference exists, validating...')
      const { valid: isValid } = await form.value.validate()
      console.log('Form validation result:', isValid)

      if (isValid) {
        console.log('Form is valid, proceeding with save...')
        loading.value = true
        try {
          const projectData = { ...formData.value }

          // Format dates
          if (projectData.startDate) {
            projectData.startDate = new Date(projectData.startDate)
          }
          if (projectData.endDate) {
            projectData.endDate = new Date(projectData.endDate)
          }

          // Ensure numeric values
          projectData.progress = Number(projectData.progress) || 0
          if (projectData.budget) {
            projectData.budget = Number(projectData.budget)
          }

          // Ensure teamMembers is an array of strings
          if (projectData.teamMembers && Array.isArray(projectData.teamMembers)) {
            projectData.teamMembers = projectData.teamMembers.map(member => {
              if (typeof member === 'string') {
                return member
              } else if (member && typeof member === 'object') {
                return member.title || member.value || member.name || String(member)
              }
              return String(member)
            }).filter(member => member && member.trim() !== '')
          } else {
            projectData.teamMembers = []
          }

          console.log('Calling onSave with projectData:', projectData)
          await onSave(projectData)
        } catch (error) {
          console.error('Error in validateAndSubmit:', error)
        } finally {
          loading.value = false
        }
      } else {
        console.log('Form validation failed')
      }
    } else {
      console.error('Form reference is null or undefined')
    }
  }

  return {
    // State
    form,
    valid,
    loading,
    formData,

    // Validation
    rules,
    isFormValid,

    // Progress management
    formatProgress,
    isProgressValid,
    validateProgressInput,
    handleProgressBlur,

    // Computed options
    statusOptions,
    priorityOptions,
    categoryOptions,

    // Methods
    resetForm,
    validateAndSubmit,

    // Colors
    colors,
    getStatusColor,
    getPriorityColor,
    getPrimaryColor,
    getSecondaryColor,
    getThemeColor,
    applyCssVars,
  }
}
