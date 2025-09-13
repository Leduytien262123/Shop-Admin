<script setup>
const props = defineProps({
  value: {
    type: [String, Number],
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    default: 'name'
  },
})

const emit = defineEmits(['update:value'])
</script>

<template>
  <n-form-item :label="label" :path="path">
    <n-select 
      :value="value" 
      @update:value="emit('update:value', $event)"
      :options="options" 
      :placeholder="placeholder" 
    />
  </n-form-item>
</template>