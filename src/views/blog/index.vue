<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListBlogs"
        :handleAdd="handleAddBlog"
        :titleAdd="'Tạo bài viết'"
      />
    </template>

    <n-card title="Quản lý bài viết">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm bài viết" class="w-full">
            <NaiveInput
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery.search"
              @keyup.enter="throttledLoadBlogs"
            />
          </n-form-item>
          <n-form-item label="Danh mục bài viết" class="w-full">
            <NaiveSelect
              v-model:value="searchQuery.category"
              clearable
              placeholder="Chọn danh mục bài viết"
              :options="blogCategories"
            />
          </n-form-item>
          <n-form-item label="Tag" class="w-full">
            <NaiveInput
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery.tag"
              @keyup.enter="throttledLoadBlogs"
            />
          </n-form-item>
          <n-button type="primary" @click="searchData">Tìm kiếm</n-button>
        </div>

        <n-spin :show="loading">
          <n-data-table
            :columns="columns"
            :data="blogs"
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

defineOptions({ name: "BlogManagement" });

const router = useRouter();
const blogs = ref([]);
const loading = ref(false);
const searchQuery = ref({
  search: "",
  category: null,
  tag: "",
});
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết bài viết");
const detailModalRef = ref(null);
const blogCategories = ref([]);

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
          { size: "small", onClick: () => viewBlog(row.id) },
          { default: () => "Xem" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            onClick: () => editBlog(row.id),
          },
          { default: () => "Sửa" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            onClick: () => deleteBlog(row.id),
          },
          { default: () => "Xóa" }
        ),
      ]);
    },
  },
];

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
async function loadBlogs() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    const response = await api.getBlogs(params);
    blogs.value = response.data?.data?.news || [];
  } catch (error) {
    $message.error("Không thể tải danh sách bài viết");
  } finally {
    loading.value = false;
  }
}

// Tạo hàm throttle cho loadBlogs
const throttledLoadBlogs = throttle(loadBlogs, 500);

// Xem chi tiết bài viết
async function viewBlog(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getBlogById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết bài viết");
  }
}

// Sửa bài viết
function editBlog(id) {
  router.push(`/blog/edit/${id}`);
}

// Xóa bài viết
function deleteBlog(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa bài viết này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteBlog(id);
        $message.success("Đã xóa bài viết thành công");
        loadBlogs();
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        $message.error("Không thể xóa bài viết");
      }
    },
  });
}

// Thêm bài viết mới
function handleAddBlog() {
  router.push("/blog/add");
}

function resetListBlogs() {
  searchQuery.value = {
    search: "",
    category: "",
    tag: "",
  };
  throttledLoadBlogs();
}

function searchData() {
  throttledLoadBlogs();
}

// Tải danh sách khi component được mount
onMounted(() => {
  loadBlogs();
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
