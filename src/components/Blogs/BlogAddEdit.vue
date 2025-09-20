<script setup>
defineOptions({ name: "BlogAddEdit" });

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
const blogCategories = ref([]);
const tags = ref([]);

const optionsStatus = [
  { label: "Nháp", value: "draft" },
  { label: "Bài đăng", value: "post" },
];

const blogForm = ref({
  name: "",
  description: "",
  slug: "",
  category_id: null,
  tag_id: null,
  status: "draft",
  published_at: null,
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
      message: "Tên bài viết không được để trống",
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

async function loadBlogCategories() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    const response = await api.getBlogCategories(params);
    blogCategories.value =
      response.data?.data?.categories?.map((e) => ({
        label: e.name,
        value: e.id,
      })) || [];
  } catch (error) {
    $message.error("Không thể tải danh mục bài viết");
  } finally {
    loading.value = false;
  }
}

async function loadTags() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    const response = await api.getTags(params);
    tags.value =
      response.data?.data?.tags?.map((e) => ({
        label: e.name,
        value: e.id,
      })) || [];
  } catch (error) {
    $message.error("Không thể tải danh sách thẻ Tag");
  } finally {
    loading.value = false;
  }
}

async function loadBlog() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getBlogById(props.id);
    if (response.data.success) {
      blogForm.value = {
        name: response.data.name || "",
        description: response.data.description || "",
        slug: response.data.slug || "",
        is_active: response.data.is_active,
        show_menu: response.data.show_menu,
        show_home: response.data.show_home,
        show_footer: response.data.show_footer,
        meta_title: response.data.meta_title || "",
        meta_keywords: response.data.meta_keywords || "",
        meta_description: response.data.meta_description || "",
        meta_image: response.data.meta_image || [],
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin bài viết");
    console.error("Load category error:", error);
  } finally {
    loading.value = false;
  }
}

function handleBack() {
  router.push("/blog");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    loading.value = true;

    if (isEdit.value) {
      await api.updateBlog(props.id, blogForm.value);
      $message.success("Cập nhật bài viết thành công!");
    } else {
      await api.createBlog(blogForm.value);
      $message.success("Thêm bài viết thành công!");
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? "Cập nhật bài viết thất bại"
      : "Thêm bài viết thất bại";
    $message.error(errorMessage);
    console.error("Save category error:", error);
  } finally {
    loading.value = false;
  }
}

function isValidDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d);
}

onMounted(() => {
  loadBlogCategories();
  loadTags();
  if (isEdit.value) {
    loadBlog();
  }
});
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card :title="isEdit ? 'Sửa bài viết' : 'Thêm bài viết'">
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :model="blogForm"
          :rules="rules"
          label-placement="top"
        >
          <n-grid cols="4" x-gap="16" y-gap="16">
            <n-grid-item span="2">
              <n-form-item label="Tên bài viết" path="name">
                <NaiveInput
                  v-model:value="blogForm.name"
                  placeholder="Nhập tên bài viết"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2">
              <n-form-item label="Đường dẫn" path="slug">
                <NaiveInput
                  v-model:value="blogForm.slug"
                  placeholder="Nhập đường dẫn"
                  :slug="blogForm.name"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2">
              <n-form-item label="Danh mục bài viết" path="category_id">
                <NaiveSelect
                  v-model:value="blogForm.category_id"
                  :options="blogCategories"
                  clearable
                  placeholder="Chọn danh mục bài viết"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2">
              <n-form-item label="Thẻ tag" path="tag_id">
                <NaiveSelect
                  v-model:value="blogForm.tag_id"
                  :options="tags"
                  clearable
                  placeholder="Chọn thẻ tag"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2">
              <n-form-item label="Trạng thái" path="status">
                <NaiveSelect
                  v-model:value="blogForm.status"
                  :options="optionsStatus"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="2">
              <n-form-item label="Ngày đăng" path="published_at">
                <NaiveDatePicker
                  :value="
                    isValidDate(blogForm.published_at)
                      ? blogForm.published_at
                      : null
                  "
                  @update:value="(val) => (blogForm.published_at = val)"
                  type="date"
                  class="w-full"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="4">
              <n-form-item label="Mô tả">
                <NaiveInput
                  v-model:value="blogForm.description"
                  type="textarea"
                  placeholder="Nhập mô tả bài viết"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  :disabled="loading"
                />
              </n-form-item>
            </n-grid-item>

            <n-grid-item span="4">
              <FormMeta
                v-model:metaTitle="blogForm.meta_title"
                v-model:metaKeywords="blogForm.meta_keywords"
                v-model:metaDescription="blogForm.meta_description"
                v-model:metaImage="blogForm.meta_image"
              />
            </n-grid-item>

            <n-grid-item span="4">
              <ContentBlog
                :title="'Nội dung bài viết'"
                v-model:coverPhoto="blogForm.content.cover_photo"
                v-model:images="blogForm.content.images"
                v-model:description="blogForm.content.description"
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
