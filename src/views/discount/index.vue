<template>
  <CommonPage>
    <template #action>
      <AddReload
        :reset="resetListDiscounts"
        :handleAdd="handleAddDiscount"
        :titleAdd="'Thêm mã giảm giá'"
      />
    </template>

    <n-card title="Quản lý mã giảm giá">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm mã giảm giá" class="w-[40%]">
            <n-input
              class="w-full"
              clearable
              placeholder="Nhập tìm kiếm ..."
              v-model:value="searchQuery.search"
              @keyup.enter="throttledLoaddiscounts"
            />
          </n-form-item>
          <n-form-item label="Loại giảm giá" class="w-[30%]">
            <n-select
              class="w-full"
              v-model:value="searchQuery.type"
              @update:value="searchByQueryValue"
              :options="type_discount"
              filterable
              placeholder="Tất cả loại giảm giá"
              clearable
            />
          </n-form-item>
          <n-form-item label="Trạng thái" class="w-[30%]">
            <n-select
              class="w-full"
              v-model:value="searchQuery.status"
              @update:value="searchByQueryValue"
              :options="status_discount"
              filterable
              placeholder="Tất cả trạng thái"
              clearable
            />
          </n-form-item>
          <n-button type="primary" @click="searchData">Tìm kiếm</n-button>
        </div>

        <n-spin :show="loading">
          <n-data-table
            :columns="columns"
            :data="discounts"
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

defineOptions({ name: "DiscountManagement" });

const router = useRouter();
const discounts = ref([]);
const loading = ref(false);
const searchQuery = ref({
  search: null,
  type: null,
  status: null,
});
const dataDetail = ref(null);
const showDetailModal = ref(false);
const titleDetail = ref("Chi tiết mã giảm giá");
const detailModalRef = ref(null);

const type_discount = ref([
  { label: "Giảm theo phần trăm", value: "percentage" },
  { label: "Giảm theo số tiền", value: "fixed_amount" },
]);

const status_discount = ref([
  { label: "Sắp diễn ra", value: "upcoming" },
  { label: "Đang diễn ra", value: "active" },
  { label: "Dừng chạy", value: "stopped" },
  { label: "Đã kết thúc", value: "ended" },
]);

const columns = [
  {
    title: "Chương trình khuyến mại",
    key: "name",
    fixed: "left",
    width: 220,
    ellipsis: true,
  },
  {
    title: "Mã giảm giá",
    key: "category_id",
    ellipsis: true,
  },
  {
    title: "Loại giảm giá",
    key: "type",
    ellipsis: true,
  },
  {
    title: "Thời gia kết thúc",
    key: "created_at",
    render(row) {
      return dayjs(row.created_at).format("DD/MM/YYYY");
    },
  },
  {
    title: "Giá trị",
    key: "value",
    ellipsis: true,
  },
  {
    title: "Trạng thái",
    key: "status",
    render(row) {
      return h(
        NTag,
        {
          type:
            row?.status === "active"
              ? "success"
              : row?.status === "ended"
                ? "error"
                : row?.status === "upcoming"
                  ? "info"
                  : row?.status === "stopped"
                    ? "warning"
                    : "",
          size: "small",
        },
        {
          default: () =>
            row?.status === "upcoming"
              ? "Sắp diễn ra"
              : row?.status === "active"
                ? "Đang diễn ra"
                : row?.status === "stopped"
                  ? "Dừng chạy"
                  : row?.status === "ended"
                    ? "Đã kết thúc"
                    : "",
        }
      );
    },
  },
  {
    title: "Hành động",
    key: "actions",
    render(row) {
      return h("div", { class: "flex gap-2" }, [
        h(
          NButton,
          { size: "small", onClick: () => viewDiscount(row.id) },
          { default: () => "Xem" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            onClick: () => editDiscount(row.id),
          },
          { default: () => "Sửa" }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            onClick: () => deleteDiscount(row.id),
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

async function loadDiscounts() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    if (searchQuery.value?.search) {
      params.search = searchQuery.value?.search;
    }
    if (searchQuery.value?.type) {
      params.type = searchQuery.value?.type;
    }
    if (searchQuery.value?.status) {
      params.status = searchQuery.value?.status;
    }
    const response = await api.getDiscounts(params);
    if (response.data.success) {
      discounts.value = response.data?.data?.discounts || [];
      loading.value = false;
    }
  } catch (error) {
    $message.error("Không thể tải danh sách mã giảm giá");
  } finally {
    loading.value = false;
  }
}

// Tạo hàm throttle cho loadDiscounts
const throttledLoaddiscounts = throttle(loadDiscounts, 500);

// Xem chi tiết mã giảm giá
async function viewDiscount(id) {
  showDetailModal.value = true;
  await nextTick();
  detailModalRef.value?.focus && detailModalRef.value.focus();
  try {
    const response = await api.getDiscountById(id);
    dataDetail.value = response.data?.data || null;
  } catch (error) {
    $message.error("Không thể tải chi tiết mã giảm giá");
  }
}

// Xóa mã giảm giá
function deleteDiscount(id) {
  $dialog.warning({
    title: "Xác nhận xóa",
    content: "Bạn có chắc chắn muốn xóa mã giảm giá này?",
    positiveText: "Xóa",
    negativeText: "Hủy",
    onPositiveClick: async () => {
      try {
        await api.deleteDiscount(id);
        $message.success("Đã xóa mã giảm giá thành công");
        loadDiscounts();
      } catch (error) {
        console.error("Lỗi khi xóa mã giảm giá:", error);
        $message.error("Không thể xóa mã giảm giá");
      }
    },
  });
}

function resetListDiscounts() {
  searchQuery.value.search = null;
  searchQuery.value.category_id = null;
  throttledLoaddiscounts();
}

function searchByQueryValue() {
  if (!searchQuery.value?.search) {
    throttledLoaddiscounts();
  }
}

function searchData() {
  throttledLoaddiscounts();
}

function handleAddDiscount() {
  router.push("/discount/add");
}

// Sửa mã giảm giá
function editDiscount(id) {
  router.push(`/discount/edit/${id}`);
}

onMounted(() => {
  loadDiscounts();
});
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>
