<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListUsers"
        :handleAdd="handleAddUser"
        :titleAdd="'Thêm khách hàng'"
      />
    </template>

    <n-card title="Danh sách khách hàng">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm khách hàng" class="w-full">
            <NaiveInput
              class="w-full"
              clearable
              placeholder="Nhập tìm kiếm theo tên, số điện thoại, email ..."
              v-model:value="searchQuery.search"
              @keyup.enter="throttledLoadUsers"
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
const titleDetail = ref("Chi tiết khách hàng");
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
    title: "Tên khách hàng",
    key: "full_name",
    fixed: "left",
    width: 300,
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
          { size: "small", onClick: () => viewUser(row.id) },
          { default: () => "Xem" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            onClick: () => editUser(row.id),
          },
          { default: () => "Sửa" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            onClick: () => deleteUser(row.id),
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

async function loadUsers() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
      role: "USER",
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
    $message.error("Không thể tải danh sách khách hàng");
  } finally {
    loading.value = false;
  }
}

// Tạo hàm throttle cho loadUsers
const throttledLoadUsers = throttle(loadUsers, 500);

// Xem chi tiết khách hàng
async function viewUser(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getUserById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết khách hàng");
  }
}

// Xóa khách hàng
function deleteUser(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa khách hàng này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteUser(id);
        $message.success("Đã xóa khách hàng thành công");
        loadUsers();
      } catch (error) {
        console.error("Lỗi khi xóa khách hàng:", error);
        $message.error("Không thể xóa khách hàng");
      }
    },
  });
}

function resetListUsers() {
  searchQuery.value.search = "";
  searchQuery.value.category_id = null;
  throttledLoadUsers();
}

function searchData() {
  throttledLoadUsers();
}

function handleAddUser() {
  router.push("/user/add");
}

// Sửa khách hàng
function editUser(id) {
  router.push(`/user/edit/${id}`);
}

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
