<script setup>
const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  coverPhoto: {
    type: Array,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const emit = defineEmits([
  "update:coverPhoto",
  "update:images",
  "update:description",
]);
</script>

<template>
  <n-collapse
    accordion
    class="custom-collapse-light-blue grow rd-5 mb-10"
    arrow-placement="right"
  >
    <n-collapse-item
      class="custom-collapse-header-light-blue"
      :title="title"
      name="content"
    >
      <n-form-item label="Ảnh bìa">
        <NaiveUpload
          :file-list="coverPhoto"
          @update:file-list="emit('update:coverPhoto', $event)"
          :max="1"
          list-type="image-card"
        />
      </n-form-item>
      <n-form-item label="Ảnh">
        <NaiveUpload
          :file-list="images"
          @update:file-list="emit('update:images', $event)"
          :max="1"
          list-type="image-card"
        />
      </n-form-item>
      <n-form-item label="Mô tả">
        <NaiveInput
          :value="description"
          @update:value="emit('update:description', $event)"
          type="textarea"
          placeholder="Nhập mô tả"
        />
      </n-form-item>
    </n-collapse-item>
  </n-collapse>
</template>
