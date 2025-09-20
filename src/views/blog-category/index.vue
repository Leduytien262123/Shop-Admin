<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListBlogCategories"
        :handleAdd="handleAddBlogCategory"
        :titleAdd="'Tạo danh mục bài viết'"
      />
    </template>

    <n-card title="Quản lý danh mục bài viết">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm danh mục bài viết" class="w-full">
            <NaiveInput
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery"
              @keyup.enter="throttledLoadBlogCategories"
            />
          </n-form-item>
          <n-button type="primary" @click="searchData">Tìm kiếm</n-button>
        </div>

        <n-spin :show="loading">
          <n-data-table
            :columns="columns"
            :data="blogCategories"
            :bordered="true"
            :striped="true"
            :loading="loading"
          />
        </n-spin>
      </n-space>
    </n-card>

    <ModalDetail
      ref="detailModalRef"
      v-model:show="showDetailModal"
      :data="dataDetail"
      :title="titleDetail"
    />
  </CommonPage>
</template>

<script setup>
import { NButton, NTag } from "naive-ui";

defineOptions({ name: "BlogCategoryManagement" });

const router = useRouter();
const blogCategories = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết danh mục bài viết");
const detailModalRef = ref(null);

const columns = [
  {
    title: "Tên",
    key: "name",
    ellipsis: true,
  },
  {
    title: "Mô tả",
    key: "description",
    ellipsis: true,
  },
  {
    title: "Trạng thái",
    key: "is_active",
    render(row) {
      return h(
        NTag,
        { type: row.is_active ? "success" : "", size: "small" },
        { default: () => (row.is_active ? "Hoạt động" : "Dừng hoạt động") }
      );
    },
  },
  {
    title: "Ngày tạo",
    key: "created_at",
    render(row) {
      return dayjs(row.created_at).format("DD/MM/YYYY");
    },
  },
  {
    title: "Hành động",
    key: "actions",
    render(row) {
      return h("div", { class: "flex gap-2" }, [
        h(
          NButton,
          { size: "small", onClick: () => viewBlogCategory(row.id) },
          { default: () => "Xem" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            onClick: () => editBlogCategory(row.id),
          },
          { default: () => "Sửa" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            onClick: () => deleteBlogCategory(row.id),
          },
          { default: () => "Xóa" }
        ),
      ]);
    },
  },
];

function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

// Tải danh sách bài viết
async function loadBlogCategories() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    const response = await api.getBlogCategories(params);
    blogCategories.value = response.data?.data?.categories || [];
  } catch (error) {
    $message.error("Không thể tải danh sách bài viết");
  } finally {
    loading.value = false;
  }
}

// Tạo hàm throttle cho loadBlogCategories
const throttledLoadBlogCategories = throttle(loadBlogCategories, 500);

// Xem chi tiết danh mục bài viết
async function viewBlogCategory(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getBlogCategoryById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết danh mục bài viết");
  }
}

// Sửa danh mục bài viết
function editBlogCategory(id) {
  router.push(`/blog-category/edit/${id}`);
}

// Xóa danh mục bài viết
function deleteBlogCategory(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa danh mục bài viết này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteBlogCategory(id);
        $message.success("Đã xóa danh mục bài viết thành công");
        loadBlogCategories();
      } catch (error) {
        console.error("Lỗi khi xóa danh mục bài viết:", error);
        $message.error("Không thể xóa danh mục bài viết");
      }
    },
  });
}

// Thêm danh mục bài viết mới
function handleAddBlogCategory() {
  router.push("/blog-category/add");
}

function resetListBlogCategories() {
  searchQuery.value = "";
  throttledLoadBlogCategories();
}

function searchData() {
  throttledLoadBlogCategories();
}

// Tải danh sách khi component được mount
onMounted(() => {
  loadBlogCategories();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
