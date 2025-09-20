<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListUsers"
        :handleAdd="handleAddStaff"
        :titleAdd="'Thêm nhân sự'"
      />
    </template>

    <n-card title="Quản lý nhân sự">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm nhân sự" class="w-full">
            <NaiveInput
              class="w-full"
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery.search"
              @keyup.enter="throttledLoadStaff"
            />
          </n-form-item>
          <ButtonSearch :searchData />
        </div>

        <n-spin :show="loading">
          <n-data-table
            :columns="columns"
            :data="users"
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
import { NButton, NTag, NAvatar } from "naive-ui";
import userEmpty from "@/public/img/user_empty.jpg";

defineOptions({ name: "ProductManagement" });

const router = useRouter();
const users = ref([]);
const loading = ref(false);
const searchQuery = ref({
  search: "",
  category_id: null,
});
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết nhân sự");
const detailModalRef = ref(null);

const columns = [
  {
    title: "STT",
    key: "stt",
    ellipsis: true,
    width: 60,
    fixed: "left",
    render(row, index) {
      return index + 1;
    },
  },
  {
    title: "Tên nhân sự",
    key: "full_name",
    fixed: "left",
    width: 260,
    ellipsis: true,
    render(row) {
      return h("div", { class: "flex items-center gap-12" }, [
        h(NAvatar, {
          size: "medium",
          src: row.avatar || userEmpty,
          class: "rounded-full min-w-36px max-w-36px min-h-36px max-h-36px",
        }),
        h("div", { class: "flex flex-col text-[14px]" }, [
          h("span", { class: "font-semibold" }, row.full_name),
          h("span", { class: "text-gray-500" }, row.email || ""),
          h("span", { class: "text-gray-500" }, row.phone || ""),
        ]),
      ]);
    },
  },
  {
    title: "Quyền hạn",
    key: "role",
    render(row) {
      return h(
        NTag,
        {
          type:
            row?.role === "owner"
              ? "success"
              : row?.role === "admin"
                ? "info"
                : "",
          size: "small",
        },
        {
          default: () =>
            row?.role === "owner"
              ? "Owner"
              : row?.role === "admin"
                ? "Admin"
                : "",
        }
      );
    },
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
          { size: "small", onClick: () => viewStaff(row.id) },
          { default: () => "Xem" }
        ),
        row?.role === "owner"
          ? h(
              NButton,
              {
                size: "small",
                type: "primary",
                onClick: () => editStaff(row.id),
              },
              { default: () => "Sửa" }
            )
          : null,
        row?.role === "owner"
          ? h(
              NButton,
              {
                size: "small",
                type: "error",
                disabled: true,
                onClick: () => deleteStaff(row.id),
              },
              { default: () => "Xóa" }
            )
          : null,
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

async function loadStaff() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
      role: "Admin",
    };
    if (searchQuery.value?.search) {
      params.search = searchQuery.value?.search;
    }
    const response = await api.getUsers(params);
    if (response.data.success) {
      users.value = response.data?.data?.users || [];
      loading.value = false;
    }
  } catch (error) {
    $message.error("Không thể tải danh sách nhân sự");
  } finally {
    loading.value = false;
  }
}

// Tạo hàm throttle cho loadStaff
const throttledLoadStaff = throttle(loadStaff, 500);

// Xem chi tiết nhân sự
async function viewStaff(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getUserById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết nhân sự");
  }
}

// Xóa nhân sự
function deleteStaff(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa nhân sự này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteUser(id);
        $message.success("Đã xóa nhân sự thành công");
        loadStaff();
      } catch (error) {
        console.error("Lỗi khi xóa nhân sự:", error);
        $message.error("Không thể xóa nhân sự");
      }
    },
  });
}

function resetListUsers() {
  searchQuery.value.search = "";
  searchQuery.value.category_id = null;
  throttledLoadStaff();
}

function searchData() {
  throttledLoadStaff();
}

function handleAddStaff() {
  router.push("/staff/add");
}

// Sửa nhân sự
function editStaff(id) {
  router.push(`/staff/edit/${id}`);
}

onMounted(() => {
  loadStaff();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
