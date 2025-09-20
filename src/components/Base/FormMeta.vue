<script setup>
const props = defineProps({
  metaTitle: {
    type: String,
    required: true,
  },
  metaKeywords: {
    type: String,
    required: true,
  },
  metaDescription: {
    type: String,
    required: true,
  },
  metaImage: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  "update:metaTitle",
  "update:metaKeywords",
  "update:metaDescription",
  "update:metaImage",
]);
</script>

<template>
  <n-collapse
    accordion
    class="custom-collapse-light-blue grow rd-5"
    arrow-placement="right"
  >
    <n-collapse-item
      class="custom-collapse-header-light-blue"
      title="Thông tin Meta"
      name="meta"
    >
      <n-form-item label="Meta Title">
        <NaiveInput
          :value="metaTitle"
          @update:value="emit('update:metaTitle', $event)"
          placeholder="Nhập meta title"
        />
      </n-form-item>
      <n-form-item label="Meta Keywords">
        <NaiveInput
          :value="metaKeywords"
          @update:value="emit('update:metaKeywords', $event)"
          placeholder="Nhập meta keywords"
        />
      </n-form-item>
      <n-form-item label="Meta Description">
        <NaiveInput
          :value="metaDescription"
          @update:value="emit('update:metaDescription', $event)"
          type="textarea"
          placeholder="Nhập meta description"
        />
      </n-form-item>
      <n-form-item label="Meta Image">
        <NaiveUpload
          :file-list="metaImage"
          @update:file-list="emit('update:metaImage', $event)"
          :max="1"
          list-type="image-card"
        />
      </n-form-item>
    </n-collapse-item>
  </n-collapse>
</template>
