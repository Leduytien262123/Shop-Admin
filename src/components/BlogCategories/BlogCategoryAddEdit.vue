<script setup>
defineOptions({ name: "BlogCategoriesAddEdit" });

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

const blogCategoryForm = ref({
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
      message: "Tên danh mục bài viết không được để trống",
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
  () => blogCategoryForm.value.name,
  (newName) => {
    if (newName) {
      blogCategoryForm.value.slug = generateSlug(newName);
    }
  }
);

async function loadBlogCategory() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getBlogCategoryById(props.id);
    if (response.data.success) {
      const data = response.data.data;
      blogCategoryForm.value = {
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
        alt: data.alt || "",
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin danh mục bài viết");
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
  router.push("/blog-category");
};

async function handleSave() {
  try {
    await formRef.value?.validate();
    loading.value = true;
    // Chuẩn hóa body gửi lên
    const body = {
      ...blogCategoryForm.value,
      meta_image:
        blogCategoryForm.value.meta_image &&
        blogCategoryForm.value.meta_image.length > 0
          ? normalizeImageField(blogCategoryForm.value.meta_image)[0]
          : null,
      cover_photo:
        blogCategoryForm.value.cover_photo &&
        blogCategoryForm.value.cover_photo.length > 0
          ? normalizeImageField(blogCategoryForm.value.cover_photo)[0]
          : null,
      images: normalizeImageField(blogCategoryForm.value.images),
    };
    if (isEdit.value) {
      await api.updateBlogCategory(props.id, body);
      $message.success("Cập nhật danh mục bài viết thành công!");
    } else {
      await api.createBlogCategory(body);
      $message.success("Thêm danh mục bài viết thành công!");
    }
    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }
    const errorMessage = isEdit.value
      ? "Cập nhật danh mục bài viết thất bại"
      : "Thêm danh mục bài viết thất bại";
    $message.error(errorMessage);
    console.error("Save category error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (isEdit.value) {
    loadBlogCategory();
  }
});
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card
      :title="isEdit ? 'Sửa danh mục bài viết' : 'Thêm danh mục bài viết'"
    >
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :model="blogCategoryForm"
          :rules="rules"
          label-placement="top"
        >
          <n-grid cols="3" x-gap="16" y-gap="16">
            <n-grid-item span="1">
              <n-form-item label="Tên danh mục bài viết" path="name">
                <NaiveInput
                  v-model:value="blogCategoryForm.name"
                  placeholder="Nhập tên danh mục"
                  :disabled="loading"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Đường dẫn" path="slug">
                <NaiveInput
                  v-model:value="blogCategoryForm.slug"
                  placeholder="Nhập đường dẫn"
                  :slug="blogCategoryForm.name"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="1">
              <n-form-item label="Số thứ tự hiển thị">
                <NaiveInputNumber
                  v-model:value="blogCategoryForm.description"
                  placeholder="Nhập số thứ tự hiển thị"
                  class="w-full"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="3">
              <FormMeta
                v-model:metaTitle="blogCategoryForm.meta_title"
                v-model:metaKeywords="blogCategoryForm.meta_keywords"
                v-model:metaDescription="blogCategoryForm.meta_description"
                v-model:metaImage="blogCategoryForm.meta_image"
              />
            </n-grid-item>

            <n-grid-item span="3">
              <ContentBlog
                :title="'Nội dung danh mục bài viết'"
                v-model:coverPhoto="blogCategoryForm.content.cover_photo"
                v-model:images="blogCategoryForm.content.images"
                v-model:description="blogCategoryForm.content.description"
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
