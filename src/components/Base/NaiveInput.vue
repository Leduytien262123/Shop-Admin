<script setup>
const props = defineProps({
  value: {
    type: String,
    required: false,
  },
  slug: {
    type: String,
    required: false,
  },
  sku: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["update:value", "update:slug", "clear"]);

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-");
}

function handleInput(val) {
  const raw = val == null ? "" : String(val);
  let newValue = raw;
  if (props.sku) {
    newValue = raw.toUpperCase().replace(/\s+/g, "");
  } else if (props.slug) {
    newValue = raw.replace(/\s+/g, "");
  }
  emit("update:value", newValue);
}

function handleBlur() {
  const raw = props.value == null ? "" : String(props.value);
  let normalized = raw;
  if (props.sku) {
    normalized = raw.toUpperCase().replace(/\s+/g, "");
  } else if (props.slug) {
    normalized = raw.replace(/\s+/g, "");
  } else {
    normalized = raw.trim().replace(/\s+/g, " ");
  }
  if (normalized !== props.value) {
    emit("update:value", normalized);
  }
}

watch(
  () => props.slug,
  (newValue) => {
    if (newValue !== undefined && newValue !== null && newValue !== "") {
      emit("update:value", generateSlug(newValue));
    }
  }
);
</script>

<template>
  <n-input
    :value="value"
    @update:value="handleInput"
    @blur="handleBlur"
    clearable
    @clear="
      () => {
        emit('clear');
        emit('update:value', '');
      }
    "
  />
</template>
