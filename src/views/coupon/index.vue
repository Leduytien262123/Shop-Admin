<template>
  <CommonPage>
    <template #action>
      <div class="flex justìy-end gap-12">
        <NButton type="info" @click="resetListCoupons">
            <i class="i-material-symbols:refresh mr-4 text-18" />
            Tải lại danh sách
          </NButton>
        <NButton type="primary" @click="handleAddCoupon">
          <i class="i-material-symbols:add mr-4 text-18" />
          Thêm mã giảm giá
        </NButton>
      </div>
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
            @keyup.enter="throttledLoadCoupons"
          />
          </n-form-item>
          <n-form-item label="Loại giảm giá" class="w-[30%]">
            <n-select class="w-full" v-model:value="searchQuery.type" @update:value="searchByQueryValue" :options="type_coupon" filterable placeholder="Tất cả loại giảm giá" clearable />
          </n-form-item>
          <n-form-item label="Trạng thái" class="w-[30%]">
            <n-select class="w-full" v-model:value="searchQuery.status" @update:value="searchByQueryValue" :options="status_coupon" filterable placeholder="Tất cả trạng thái" clearable />
          </n-form-item>
          <n-button type="primary" @click="searchData">Tìm kiếm</n-button>
        </div>

        <n-spin :show="loading">
          <n-data-table
            :columns="columns"
            :data="coupons"
            :bordered="true"
            :striped="true"
            :loading="loading"
          />
        </n-spin>
      </n-space>
    </n-card>

    <ModalDetail ref="detailModalRef" v-model:show="showDetailModal" :data="dataDetail" :title="titleDetail" />
  </CommonPage>
</template>

<script setup>
import { ref, onMounted, h, nextTick } from 'vue'
import ModalDetail from '@/components/Modal/ModalDetail.vue'
import { useRouter } from 'vue-router'
import { NButton, NTag } from 'naive-ui'
import { api } from '@/utils'
import dayjs from 'dayjs'

defineOptions({ name: 'CouponManagement' })

const router = useRouter()
const coupons = ref([])
const loading = ref(false)
const searchQuery = ref(
  {
    search: null,
    type: null,
    status: null
  }
)
const dataDetail = ref(null)
const showDetailModal = ref(false)
const titleDetail = ref('Chi tiết mã giảm giá')
const detailModalRef = ref(null)

const type_coupon = ref([
  { label: 'Giảm theo phần trăm', value: 'percentage' },
  { label: 'Giảm theo số tiền', value: 'fixed_amount' }
])

const status_coupon = ref([
  { label: 'Sắp diễn ra', value: 'upcoming' },
  { label: 'Đang diễn ra', value: 'active' },
  { label: 'Dừng chạy', value: 'stopped' },
  { label: 'Đã kết thúc', value: 'ended' }
])

const columns = [
  {
    title: 'Chương trình khuyến mại',
    key: 'name',
    fixed: 'left',
    width: 220,
    ellipsis: true
  },
  {
    title: 'Mã giảm giá',
    key: 'category_id',
    ellipsis: true,
  },
  {
    title: 'Loại giảm giá',
    key: 'type',
    ellipsis: true,
  },
  {
    title: 'Thời gia kết thúc',
    key: 'created_at',
    render(row) {
      return dayjs(row.created_at).format('DD/MM/YYYY')
    }
  },
  {
    title: 'Giá trị',
    key: 'value',
    ellipsis: true,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    render(row) {
      return h(
        NTag,
        { type: row?.status === 'active' ? 'success' : row?.status === 'ended' ? 'error' : row?.status === 'upcoming' ? 'info' : row?.status === 'stopped' ? 'warning' : '', size: 'small' },
        { default: () => (row?.status === 'upcoming' ? 'Sắp diễn ra' : row?.status === 'active' ? 'Đang diễn ra' : row?.status === 'stopped' ? 'Dừng chạy' : row?.status === 'ended' ? 'Đã kết thúc' : '') }
      )
    }
  },
  {
    title: 'Hành động',
    key: 'actions',
    render(row) {
      return h(
        'div',
        { class: 'flex gap-2' },
        [
          h(NButton, { size: 'small', onClick: () => viewCoupon(row.id) }, { default: () => 'Xem' }),
          h(NButton, { size: 'small', type: 'primary', onClick: () => editCoupon(row.id) }, { default: () => 'Sửa' }),
          h(NButton, { size: 'small', type: 'error', onClick: () => deleteCoupon(row.id) }, { default: () => 'Xóa' })
        ]
      )
    }
  }
]

function throttle(fn, delay) {
  let lastCall = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return fn.apply(this, args)
    }
  }
}

async function loadCoupons() {
  try {
    loading.value = true
    const params = {
      page: 1,
      length: 10
    }
    if(searchQuery.value?.search) {
      params.search = searchQuery.value?.search
    }
    if(searchQuery.value?.type) {
      params.type = searchQuery.value?.type
    }
    if(searchQuery.value?.status) {
      params.status = searchQuery.value?.status
    }
    const response = await api.getCoupons(params)
    if(response.data.success) {
      coupons.value = response.data?.data?.coupons || []
      loading.value = false
    }
  } catch (error) {
    $message.error('Không thể tải danh sách mã giảm giá')
  } finally {
    loading.value = false
  }
}        

// Tạo hàm throttle cho loadCoupons
const throttledLoadCoupons = throttle(loadCoupons, 500) 

// Xem chi tiết mã giảm giá
async function viewCoupon(id) {
  showDetailModal.value = true
  await nextTick()
  detailModalRef.value?.focus && detailModalRef.value.focus()
  try {
    const response = await api.getCouponById(id)
    dataDetail.value = response.data?.data || null
  } catch (error) {
    $message.error('Không thể tải chi tiết mã giảm giá')
  }
}

// Xóa mã giảm giá
function deleteCoupon(id) {
  $dialog.warning({
    title: 'Xác nhận xóa',
    content: 'Bạn có chắc chắn muốn xóa mã giảm giá này?',
    positiveText: 'Xóa',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      try {
        await api.deleteCoupon(id)
        $message.success('Đã xóa mã giảm giá thành công')
        loadCoupons()
      } catch (error) {
        console.error('Lỗi khi xóa mã giảm giá:', error)
        $message.error('Không thể xóa mã giảm giá')
      }
    }
  })
}

function resetListCoupons() {
  searchQuery.value.search = null;
  searchQuery.value.category_id = null;
  throttledLoadCoupons();
}

function searchByQueryValue() {
  if (!searchQuery.value?.search) {
    throttledLoadCoupons();
  }
}

function searchData() {
  throttledLoadCoupons()
}

function handleAddCoupon() {
  router.push('/coupon/add')
}

// Sửa mã giảm giá
function editCoupon(id) {
  router.push(`/coupon/edit/${id}`)
}

onMounted(() => {
  loadCoupons()
})
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>