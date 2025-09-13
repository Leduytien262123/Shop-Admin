<script setup>
import { api } from '@/utils'
import { useUserStore } from '@/store/modules/user'
import { onMounted, ref, computed, watch } from 'vue'

defineOptions({ name: 'OrderAddEdit' })

const props = defineProps({
  id: {
    type: [String, Number],
    default: null
  }
})

const router = useRouter()
const userStore = useUserStore()

const isEdit = computed(() => !!props.id)
const products = ref([])
const loading = ref(false)
const coupons = ref([])

const productForm = ref({
  creator_id: userStore.userId,
  creator_name: userStore.username,
  customer_name: '',
  phone: '',
  email: '',
  address: '',
  note: '',
  coupon_code: null,
  shipping_fee: null,
  status: 'new',
  payment_method: 'unpaid',
  order_type: 'retail',
})

const status = [
  { label: 'Đơn hàng mới', value: 'new' },
  { label: 'Đang xử lý', value: 'processing' },
  { label: 'Hoàn thành', value: 'completed' },
  { label: 'Hủy', value: 'canceled' },
]

const paymentsMethod = [
  { label: 'Chưa thanh toán', value: 'unpaid' },
  { label: 'Đã thanh toán', value: 'paid' },
]

const orderTypes = [
  { label: 'Đơn khách lẻ', value: 'retail' },
  { label: 'Đơn web', value: 'web', disabled: !isEdit.value },
]

const rules = {
  creator_name: [
    { required: true, message: 'Không xác định người tạo', trigger: ['blur', 'input'] },
  ],
  customer_name: [
    { required: true, trigger: ['blur', 'input'],
      validator(rule, value) {
        const name = String(value || '').trim();
        if (!name) return new Error('Vui lòng nhập tên khách hàng');
        if (name.length < 2) return new Error('Tên khách hàng phải có ít nhất 2 ký tự');
        if (name.length > 100) return new Error('Tên khách hàng không được quá 100 ký tự');
        return true;
      },
      trigger: ['blur', 'input']
    }
  ],
  phone: [
    { 
      required: true, 
      trigger: ['blur', 'input'],
      validator(rule, value) {
        const phone = String(value || '').trim();
        
        // Kiểm tra nếu trống
        if (!phone) {
          return new Error('Vui lòng nhập số điện thoại');
        }
        
        // Đầu số hợp lệ của nhà mạng Việt Nam
        const validPrefixes = [
          '032','033','034','035','036','037','038','039', // Viettel
          '070','076','077','078','079', // Mobifone
          '081','082','083','084','085','086', // Vinaphone
          '056','058', // Vietnamobile
          '059', // Gmobile
          '090','093','089','092','094','099','098','097','096','091','095' // các đầu số cũ
        ];
        
        // Kiểm tra định dạng cơ bản (10 số, bắt đầu bằng 0)
        if (!/^0\d{9}$/.test(phone)) {
          return new Error('Số điện thoại định dạng không chính xác (phải gồm 10 số và bắt đầu bằng 0)');
        }
        
        // Kiểm tra đầu số hợp lệ
        const prefix = phone.substring(0, 3);
        if (!validPrefixes.includes(prefix)) {
          return new Error('Số điện thoại định dạng không chính xác (đầu số không hợp lệ)');
        }
        
        return true;
      }
    },
  ],
  email: [
    { 
      required: true, 
      trigger: ['blur', 'input'], 
      validator(rule, value) {
        const email = String(value || '').trim();
        
        // Kiểm tra nếu trống
        if (!email) {
          return new Error('Vui lòng nhập email');
        }
        
        // Kiểm tra định dạng email cơ bản (không chỉ giới hạn @gmail.com)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          return new Error('Email không đúng định dạng');
        }
        
        return true;
      },
    }
  ],
  address: [
    { required: true, trigger: ['blur', 'input'],
      validator(rule, value) {
        const address = String(value || '').trim();
        if (!address) return new Error('Vui lòng nhập địa chỉ');
        if (address.length < 10) return new Error('Địa chỉ phải có ít nhất 10 ký tự');
        if (address.length > 255) return new Error('Địa chỉ không được quá 255 ký tự');
        return true;
      },
      trigger: ['blur', 'input']
    }
  ],
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

watch(() => productForm.value.name, (newName) => {
  if (newName) {
    productForm.value.slug = generateSlug(newName)
  }
})

const formRef = ref(null)

async function loadProducts() {
  try {
    loading.value = true
    const params = {
      page: 1,
      length: 10
    }
    const response = await api.getProducts(params)
    products.value = response.data?.data?.products.map(e => ({
      label: e.name,
      value: e.id
    })) || []
  } catch (error) {
    $message.error('Không thể tải danh sách đơn hàng')
  } finally {
    loading.value = false
  }
}   

async function loadOrder() {
  if (!props.id) return
  
  try {
    loading.value = true
    const response = await api.getOrderById(props.id)
    if (response.data.success) {
      const d = response.data.data
      productForm.value = {
        creator_id: d.creator_id,
        creator_name: d.creator_name,
        customer_name: d.customer_name || '',
        phone: d.phone || '',
        email: d.email || '',
        address: d.address || '',
        note: d.note || '',
        coupon_code: d.coupon_code || '',
        shipping_fee: d.shipping_fee || null,
        status: d.status || null,
        payment_method: d.payment_method || null,
        order_type: d.order_type || null,
      }
    }
  } catch (error) {
    $message.error('Không thể tải thông tin đơn hàng')
    console.error('Load order error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Gán người tạo khi tạo mới
  if (!isEdit.value) {
    productForm.value.creator_id = userStore.userId
    productForm.value.creator_name = userStore.username
  }
  loadProducts()
  if(isEdit.value){ 
    loadOrder()
  }
})

function handleBack() {
  router.push('/order')
}

async function handleSave() {
  try {
    await formRef.value?.validate()
    
    loading.value = true
    const body = { ...productForm.value, creator_id: userStore.userId }
    if (isEdit.value) {
      await api.updateOrder(props.id, body)
      $message.success('Cập nhật đơn hàng thành công!')
    } else {
      await api.createOrder(body)
      $message.success('Thêm đơn hàng thành công!')
    }
    
    handleBack()
  } catch (error) {
    if (error?.errors) {
      return
    }
    
    const errorMessage = isEdit.value ? 'Cập nhật đơn hàng thất bại' : 'Thêm đơn hàng thất bại'
    $message.error(errorMessage)
    console.error('Save order error:', error)
  } finally {
    loading.value = false
  }
}

const parse = (input) => {
  const nums = input.replace(/[^\d.]/g, "").trim();
  if (/^\d+(\.(\d+)?)?$/.test(nums))
    return Number(nums);
  return nums === "" ? null : Number.NaN;
};

const format = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "";
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

function handleInput() {
  if (productForm.value.customer_name) {
    productForm.value.customer_name = productForm.value.customer_name.trim().replace(/\s+/g, " ")
  }
  if (productForm.value.address) {
    productForm.value.address = productForm.value.address.trim().replace(/\s+/g, " ")
  }
  if (productForm.value.note) {
    productForm.value.note = productForm.value.note.trim().replace(/\s+/g, " ")
  }  
}
</script>

<template>
  <CommonPage>
    <template #action>
      <NButton @click="handleBack">
        <i class="i-material-symbols:arrow-back mr-4 text-18" />
        Quay lại
      </NButton>
    </template>

    <n-card :title="isEdit ? 'Sửa đơn hàng' : 'Thêm đơn hàng'">
      <n-form :model="productForm" :rules="rules" ref="formRef">
        <n-grid cols="3" x-gap="16" y-gap="16">
          <n-grid-item span="1">
            <n-form-item label="Trạng thái" path="status">
              <n-select v-model:value="productForm.status" :options="status" :disabled="!isEdit" placeholder="Chọn trạng thái" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Thanh toán" path="payment_method">
              <n-select v-model:value="productForm.payment_method" :options="paymentsMethod" placeholder="Chọn thanh toán" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Loại đơn" path="order_type">
              <n-select v-model:value="productForm.order_type" :options="orderTypes" :disabled="isEdit" placeholder="Chọn loại đơn" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Người tạo" path="creator_name">
              <n-input v-model:value="productForm.creator_name" @blur="handleInput" placeholder="Nhập tên người tạo" readonly />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Tên khách hàng" path="customer_name">
              <n-input v-model:value="productForm.customer_name" @blur="handleInput" placeholder="Nhập tên khách hàng" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Số điện thoại" path="phone">
              <n-input v-model:value="productForm.phone"
                @input="productForm.phone = $event.replace(/[^\d]/g, '').slice(0, 10)"
                :input-props="{ inputmode: 'numeric', pattern: '[0-9]*', maxlength: 10 }"
                placeholder="Nhập số điện thoại" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Email" path="email">
              <n-input v-model:value="productForm.email" @input="productForm.email = $event.replace(/[^\d]/g, '')" placeholder="Nhập email" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="2">
            <n-form-item label="Địa chỉ" path="address">
              <n-input v-model:value="productForm.address" @blur="handleInput" placeholder="Nhập địa chỉ" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="2">
            <n-form-item label="Ghi chú" path="note">
              <n-input v-model:value="productForm.note" @blur="handleInput" placeholder="Ghi chú" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1"></n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Mã giảm giá" path="coupon_code">
              <n-select v-model:value="productForm.coupon_code" :options="coupons" filterable placeholder="Chọn mã giảm giá" clearable />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Phí ship" path="shipping_fee">
              <n-input-number v-model:value="productForm.shipping_fee" :parse="parse" :format="format" :show-button="false" placeholder="Nhập phí ship" class="w-full" />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="2">
            <n-form-item label="Chọn sản phẩm" path="category_id">
              <n-select v-model:value="productForm.category_id" :options="products" filterable placeholder="Chọn sản phẩm" />
            </n-form-item>
          </n-grid-item>
        </n-grid>
      </n-form>

      <template #action>
        <div class="flex items-center justify-center">
          <n-space>
            <NButton @click="handleBack">Hủy</NButton>
            <NButton type="primary" @click="handleSave">{{ isEdit ? 'Cập nhật' : 'Lưu' }}</NButton>
          </n-space>
        </div>
      </template>
    </n-card>
  </CommonPage>
</template>