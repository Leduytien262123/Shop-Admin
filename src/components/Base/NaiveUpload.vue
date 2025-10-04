<script setup>
const props = defineProps({
  fileList: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  max: {
    type: Number,
    default: undefined,
  },
  listType: {
    type: String,
    default: "image-card",
  },
  defaultFileList: {
    type: Array,
    default: undefined,
  },
  alt: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:fileList", "change", "remove", "preview"]);

const showModal = ref(false);
const previewImageUrl = ref(null);

function handleUpdateFileList(newList) {
  emit("update:fileList", newList);
}

function handleChange({ file, fileList }) {
  emit("change", { file, fileList });
  emit("update:fileList", fileList);
}

function handleRemove({ file, fileList }) {
  emit("remove", { file, fileList });
  emit("update:fileList", fileList);
}

function handlePreview(file) {
  emit("preview", file);
  previewImageUrl.value = file.url || file.thumbUrl;
  showModal.value = true;
}

const updateAlt = (index, value) => {
  const newList = [...props.fileList];
  if (newList[index]) {
    newList[index] = { ...newList[index], alt: value };
    emit("update:fileList", newList);
  }
};
</script>

<template>
  <div class="flex gap-12 w-full">
    <n-upload
      :default-file-list="fileList"
      :list-type="listType"
      :disabled="disabled"
      :multiple="multiple"
      :max="max"
      @update:file-list="handleUpdateFileList"
      @change="handleChange"
      @remove="handleRemove"
      @preview="handlePreview"
      class="max-w-[100px]"
    />
    <div v-if="fileList && fileList.length > 0" class="w-full">
      <div class="w-full flex flex-col gap-12px">
        <div
          v-for="(file, idx) in fileList"
          :key="file.uid || file.url || idx"
          class="min-h-96px max-h-96px flex items-start"
        >
          <n-form-item
            :label="'Alt image ' + (multiple ? idx + 1 : '')"
            class="w-full"
          >
            <n-input
              v-model:value="file.alt"
              placeholder="Nhập alt ..."
              class="w-full"
              @update:value="(val) => updateAlt(idx, val)"
            />
          </n-form-item>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-upload-file-list.n-upload-file-list--grid) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
