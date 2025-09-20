<script setup>
defineOptions({ name: "TagAddEdit" });

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
});

const router = useRouter();

const formRef = ref(null);
const loading = ref(false);
const isEdit = computed(() => !!props.id);

const tagForm = ref({
  name: "",
  description: null,
  slug: "",
  is_active: true,
  show_menu: false,
  show_home: false,
  show_footer: false,
  meta_title: "",
  meta_keywords: "",
  meta_description: "",
  meta_image: [],
  content: {
    cover_photo: [],
    images: [],
    description: "",
  },
});

const rules = {
  name: [
    {
      required: true,
      message: "Tên thẻ Tag không được để trống",
      trigger: ["blur", "input"],
    },
  ],
  slug: [
    {
      required: true,
      message: "Đường dẫn không được để trống",
      trigger: ["blur", "input"],
    },
  ],
};

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

watch(
  () => tagForm.value.name,
  (newName) => {
    if (newName) {
      tagForm.value.slug = generateSlug(newName);
    }
  }
);

async function loadTag() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getTagById(props.id);
    if (response.data.success) {
      const data = response.data.data;
      tagForm.value = {
        name: data.name || "",
        description: data.description || null,
        slug: data.slug || "",
        is_active: data.is_active,
        show_menu: data.show_menu,
        show_home: data.show_home,
        show_footer: data.show_footer,
        meta_title: data.meta_title || "",
        meta_keywords: data.meta_keywords || "",
        meta_description: data.meta_description || "",
        meta_image: data.meta_image
          ? Array.isArray(data.meta_image)
            ? data.meta_image.map((img) => ({
                url_file: img.url_file || img.url || img,
                alt: img.alt || data.alt || "",
              }))
            : [{ url_file: data.meta_image, alt: data.alt || "" }]
          : [],
        cover_photo: data.cover_photo
          ? [{ url_file: data.cover_photo, alt: data.alt || "" }]
          : [],
        images: data.images
          ? Array.isArray(data.images)
            ? data.images.map((img) => ({
                url_file: img.url_file || img.url || img,
                alt: img.alt || data.alt || "",
              }))
            : [{ url_file: data.images, alt: data.alt || "" }]
          : [],
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin thẻ Tag");
    console.error("Load blog category error:", error);
  } finally {
    loading.value = false;
  }
}

function normalizeImageField(field) {
  if (!Array.isArray(field)) return [];
  return field.map((img) => {
    if (typeof img === "string") {
      return { url_file: img, alt: "" };
    }
    return {
      url_file: img.url_file || img.url || "",
      alt: img.alt || "",
    };
  });
}

const handleBack = () => {
  router.push("/tag");
};

async function handleSave() {
  try {
    await formRef.value?.validate();
    loading.value = true;
    // Chuẩn hóa body gửi lên
    const body = {
      ...tagForm.value,
      meta_image:
        tagForm.value.meta_image && tagForm.value.meta_image.length > 0
          ? normalizeImageField(tagForm.value.meta_image)[0]
          : null,
      cover_photo:
        tagForm.value.cover_photo && tagForm.value.cover_photo.length > 0
          ? normalizeImageField(tagForm.value.cover_photo)[0]
          : null,
      images: normalizeImageField(tagForm.value.images),
    };
    if (isEdit.value) {
      await api.updateTag(props.id, body);
      $message.success("Cập nhật thẻ Tag thành công!");
    } else {
      await api.createTag(body);
      $message.success("Thêm thẻ Tag thành công!");
    }
    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }
    const errorMessage = isEdit.value
      ? "Cập nhật thẻ Tag thất bại"
      : "Thêm thẻ Tag thất bại";
    $message.error(errorMessage);
    console.error("Save category error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (isEdit.value) {
    loadTag();
  }
});
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card :title="isEdit ? 'Sửa thẻ Tag' : 'Thêm thẻ Tag'">
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :model="tagForm"
          :rules="rules"
          label-placement="top"
        >
          <n-grid cols="3" x-gap="16" y-gap="16">
            <n-grid-item span="1">
              <n-form-item label="Tên thẻ Tag" path="name">
                <NaiveInput
                  v-model:value="tagForm.name"
                  placeholder="Nhập tên danh mục"
                  :disabled="loading"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Đường dẫn" path="slug">
                <NaiveInput
                  v-model:value="tagForm.slug"
                  placeholder="Nhập đường dẫn"
                  :slug="tagForm.name"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Số thứ tự hiển thị">
                <NaiveInputNumber
                  v-model:value="tagForm.description"
                  placeholder="Nhập số thứ tự hiển thị"
                  class="w-full"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="3">
              <FormMeta
                v-model:metaTitle="tagForm.meta_title"
                v-model:metaKeywords="tagForm.meta_keywords"
                v-model:metaDescription="tagForm.meta_description"
                v-model:metaImage="tagForm.meta_image"
              />
            </n-grid-item>

            <n-grid-item span="3">
              <ContentBlog
                :title="'Nội dung thẻ Tag'"
                v-model:coverPhoto="tagForm.content.cover_photo"
                v-model:images="tagForm.content.images"
                v-model:description="tagForm.content.description"
              />
            </n-grid-item>
          </n-grid>
        </n-form>
      </n-spin>

      <template #action>
        <ButtonSave
          :isEdit="isEdit"
          :handleBack="handleBack"
          :handleSave="handleSave"
        />
      </template>
    </n-card>
  </CommonPage>
</template>

<style scoped>
:deep(.n-collapse-item__header-main) {
  justify-content: space-between;
  font-size: 18px;
}
</style>
