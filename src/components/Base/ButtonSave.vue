<script setup>
const props = defineProps({
  isEdit: {
    type: Boolean,
    required: true,
  },
  handleBack: {
    type: Function,
    required: true,
  },
  handleSave: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <div class="flex items-center justify-center">
    <NSpace>
      <NButton @click="handleBack">Hủy</NButton>
      <NButton type="primary" @click="handleSave">{{
        isEdit ? "Cập nhật" : "Thêm mới"
      }}</NButton>
    </NSpace>
  </div>
</template>
