<script setup>
import { api } from '@/utils'

defineOptions({ name: 'CategoriesAddEdit' })

const props = defineProps({
  id: {
    type: [String, Number],
    default: null
  }
})

const router = useRouter()

const formRef = ref(null)
const loading = ref(false)
const isEdit = computed(() => !!props.id)

const categoryForm = ref({
  name: '',
  description: '',
  slug: '',
  is_active: true,
  show_menu: false,
  show_home: false,
  show_footer: false,
  meta_title: '',
  meta_keywords: '',
  meta_description: '',
  meta_image: []
})

const rules = {
  name: [
    {
      required: true,
      message: 'Tên danh mục không được để trống',
      trigger: ['blur', 'input']
    }
  ],
  slug: [
    {
      required: true,
      message: 'Đường dẫn không được để trống',
      trigger: ['blur', 'input']
    }
  ]
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

watch(() => categoryForm.value.name, (newName) => {
  if (newName) {
    categoryForm.value.slug = generateSlug(newName)
  }
})

async function loadCategory() {
  if (!props.id) return
  
  try {
    loading.value = true
    const response = await api.getCategoryById(props.id)
    if (response.data.success) {
      categoryForm.value = {
        name: response.data.data.name || '',
        description: response.data.data.description || '',
        slug: response.data.data.slug || '',
        is_active: response.data.data.is_active,
        show_menu: response.data.data.show_menu,
        show_home: response.data.data.show_home,
        show_footer: response.data.data.show_footer,
        meta_title: response.data.data.meta_title || '',
        meta_keywords: response.data.data.meta_keywords || '',
        meta_description: response.data.data.meta_description || '',
        meta_image: response.data.data.meta_image || []
      }
    }
  } catch (error) {
    $message.error('Không thể tải thông tin danh mục')
    console.error('Load category error:', error)
  } finally {
    loading.value = false
  }
}

function handleBack() {
  router.push('/category')
}

async function handleSave() {
  try {
    await formRef.value?.validate()
    
    loading.value = true
    
    if (isEdit.value) {
      await api.updateCategory(props.id, categoryForm.value)
      $message.success('Cập nhật danh mục thành công!')
    } else {
      await api.createCategory(categoryForm.value)
      $message.success('Thêm danh mục thành công!')
    }
    
    handleBack()
  } catch (error) {
    if (error?.errors) {
      return
    }
    
    const errorMessage = isEdit.value ? 'Cập nhật danh mục thất bại' : 'Thêm danh mục thất bại'
    $message.error(errorMessage)
    console.error('Save category error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isEdit.value) {
    loadCategory()
  }
})
</script>

<template>
  <CommonPage>
    <template #action>
      <NButton @click="handleBack">
        <i class="i-material-symbols:arrow-back mr-4 text-18" />
        Quay lại
      </NButton>
    </template>

    <n-card :title="isEdit ? 'Sửa danh mục' : 'Thêm danh mục'">
      <n-spin :show="loading">
        <n-form
          ref="formRef"
          :model="categoryForm"
          :rules="rules"
          label-placement="top"
        >
          <n-form-item label="Tên danh mục" path="name">
            <n-input 
              v-model:value="categoryForm.name" 
              placeholder="Nhập tên danh mục"
              :disabled="loading"
            />
          </n-form-item>
          
          <n-form-item label="Đường dẫn" path="slug">
            <n-input 
              v-model:value="categoryForm.slug" 
              placeholder="Nhập đường dẫn"
              :disabled="loading"
            />
          </n-form-item>
          
          <n-form-item label="Mô tả">
            <n-input 
              v-model:value="categoryForm.description" 
              type="textarea"
              placeholder="Nhập mô tả danh mục"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :disabled="loading"
            />
          </n-form-item>

          <n-form-item label="Trạng thái">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <n-switch v-model:value="categoryForm.is_active" :disabled="loading" />
                <span>Hoạt động</span>
              </div>
              <n-checkbox v-model:checked="categoryForm.show_menu" :disabled="loading">
                Hiển thị trên menu
              </n-checkbox>
              <n-checkbox v-model:checked="categoryForm.show_footer" :disabled="loading">
                Hiển thị trên footer
              </n-checkbox>
              <n-checkbox v-model:checked="categoryForm.show_home" :disabled="loading">
                Hiển thị trên trang chủ
              </n-checkbox>
            </div>
          </n-form-item>

          <n-collapse accordion class="custom-collapse-light-blue grow rd-5 my-15" arrow-placement="right">
            <n-collapse-item class="custom-collapse-header-light-blue" title="Thông tin Meta" name="meta">
              <n-form-item label="Meta Title">
                <n-input v-model:value="categoryForm.meta_title" placeholder="Nhập meta title" />
              </n-form-item>
              <n-form-item label="Meta Keywords">
                <n-input v-model:value="categoryForm.meta_keywords" placeholder="Nhập meta keywords" />
              </n-form-item>
              <n-form-item label="Meta Description">
                <n-input v-model:value="categoryForm.meta_description" type="textarea" placeholder="Nhập meta description" />
              </n-form-item>
              <n-form-item label="Meta Image">
                <n-upload
                  v-model:file-list="categoryForm.meta_image"
                  :max="1"
                  list-type="image-card"
                  :disabled="loading"
                />
              </n-form-item>
            </n-collapse-item>
          </n-collapse>
        </n-form>
      </n-spin>

      <template #action>
        <div class="flex items-center justify-center">
          <n-space>
            <NButton @click="handleBack" :disabled="loading">
              Hủy
            </NButton>
            <NButton 
              type="primary" 
              @click="handleSave"
              :loading="loading"
            >
              {{ isEdit ? 'Cập nhật' : 'Lưu' }}
            </NButton>
          </n-space>
        </div>
      </template>
    </n-card>
  </CommonPage>
</template>

<style scoped>
:deep(.n-collapse-item__header-main) {
  justify-content: space-between;
  font-size: 18px
}
</style>