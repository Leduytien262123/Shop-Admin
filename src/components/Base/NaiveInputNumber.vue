<script setup>
const props = defineProps({
  value: {
    type: Number,
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
  showButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value'])
</script>

<template>
  <n-form-item :label="label" :path="path">
    <n-input-number 
      :value="value" 
      @update:value="emit('update:value', $event)"
      :show-button="showButton" 
      :placeholder="placeholder" 
      class="w-full" 
    />
  </n-form-item>
</template>