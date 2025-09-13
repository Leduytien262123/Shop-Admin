<template>
  <CommonPage>
    <template #action>
      <div class="flex justify-end gap-12">
        <NButton type="info" @click="resetListCategories">
          <i class="i-material-symbols:refresh mr-4 text-18" />
          Tải lại danh sách
        </NButton>
        <NButton type="primary" @click="handleAddCategory()">
          <i class="i-material-symbols:add mr-4 text-18" />
          Tạo danh mục
        </NButton>
      </div>
    </template>

    <n-card title="Quản lý danh mục">
      <n-space vertical>
        <div class="flex gap-12 mb-8 items-end">
          <n-form-item label="Tìm kiếm danh mục" class="w-full">
            <n-input clearable placeholder="Nhập tìm kiếm ..." v-model:value="searchQuery" @keyup.enter="throttledLoadCategories" />
          </n-form-item>
          <n-button type="primary" @click="searchData">Tìm kiếm</n-button>
        </div>

        <n-spin :show="loading">
          <n-data-table
            :columns="columns"
            :data="categories"
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

defineOptions({ name: 'CategoryManagement' })

const router = useRouter()
const categories = ref([])
const loading = ref(false)
const searchQuery = ref('')
const dataDetail = ref(null)
const showDetailModal = ref(false)
const titleDetail = ref('Chi tiết danh mục')
const detailModalRef = ref(null)

const columns = [
  {
    title: 'Tên',
    key: 'name',
    ellipsis: true
  },
  {
    title: 'Mô tả',
    key: 'description',
    ellipsis: true
  },
  {
    title: 'Trạng thái',
    key: 'is_active',
    render(row) {
      return h(
        NTag,
        { type: row.is_active ? 'success' : '', size: 'small' },
        { default: () => (row.is_active ? 'Hoạt động' : 'Dừng hoạt động') }
      )
    }
  },
  {
    title: 'Ngày tạo',
    key: 'created_at',
    render(row) {
      return dayjs(row.created_at).format('DD/MM/YYYY')
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
          h(NButton, { size: 'small', onClick: () => viewCategory(row.id) }, { default: () => 'Xem' }),
          h(NButton, { size: 'small', type: 'primary', onClick: () => editCategory(row.id) }, { default: () => 'Sửa' }),
          h(NButton, { size: 'small', type: 'error', onClick: () => deleteCategory(row.id) }, { default: () => 'Xóa' })
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

// Tải danh sách danh mục
async function loadCategories() {
  try {
    loading.value = true
    const params = {
      page: 1,
      length: 10
    }
    if(searchQuery.value) {
      params.search = searchQuery.value
    }
    const response = await api.getCategories(params)
    categories.value = response.data?.data || []
  } catch (error) {
    $message.error('Không thể tải danh sách danh mục')
  } finally {
    loading.value = false
  }
}     

// Tạo hàm throttle cho loadCategories
const throttledLoadCategories = throttle(loadCategories, 500)

// Xem chi tiết danh mục
async function viewCategory(id) {
  showDetailModal.value = true
  await nextTick()
  detailModalRef.value?.focus && detailModalRef.value.focus()
  try {
    const response = await api.getCategoryById(id)
    dataDetail.value = response.data?.data || null
  } catch (error) {
    $message.error('Không thể tải chi tiết danh mục')
  }
}

// Sửa danh mục
function editCategory(id) {
  router.push(`/category/edit/${id}`)
}

// Xóa danh mục
function deleteCategory(id) {
  $dialog.warning({
    title: 'Xác nhận xóa',
    content: 'Bạn có chắc chắn muốn xóa danh mục này?',
    positiveText: 'Xóa',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      try {
        await api.deleteCategory(id)
        $message.success('Đã xóa danh mục thành công')
        loadCategories()
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error)
        $message.error('Không thể xóa danh mục')
      }
    }
  })
}

// Thêm danh mục mới
function handleAddCategory() {
  router.push('/category/add')
}

function resetListCategories() {
  searchQuery.value = null;
  throttledLoadCategories();
}

function searchData() {
  throttledLoadCategories()
}

// Tải danh sách khi component được mount
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}
</style>