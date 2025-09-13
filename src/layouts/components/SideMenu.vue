<template>
  <n-menu
    ref="menuRef"
    class="side-menu"
    accordion
    :indent="18"
    :collapsed-icon-size="22"
    :collapsed-width="64"
    :collapsed="appStore.collapsed"
    :options="menuOptions"
    :value="activeKey"
    @update:value="handleMenuSelect"
  />
</template>

<script setup>
import { useAppStore, usePermissionStore } from '@/store'
import { isExternal } from '@/utils'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const menuRef = ref(null)
const activeKey = computed(() => route.meta?.parentKey || route.name)

// Cấu trúc menu đúng format cho Naive UI
const menuOptions = computed(() => [
  {
    label: 'Dashboard',
    key: 'dashboard',
    path: '/'
  },
  {
    label: 'Quản lý sản phẩm',
    key: 'product-management',
    children: [
      {
        label: 'Danh mục sản phẩm',
        key: 'category',
        path: '/category'
      },
      {
        label: 'Sản phẩm',
        key: 'product',
        path: '/product'
      }
    ]
  },
  {
    label: 'Quản lý đơn hàng',
    key: 'order-management',
    children: [
      {
        label: 'Đơn hàng',
        key: 'order',
        path: '/order'
      },
      {
        label: 'Mã giảm giá',
        key: 'coupon',
        path: '/coupon'
      }
    ]
  },
  {
    label: 'Quản lý bài viết',
    key: 'post-management',
    children: [
      {
        label: 'Danh mục bài viết',
        key: 'category_news',
        path: '/category_news'
      },
      {
        label: 'Bài viết',
        key: 'new',
        path: '/new'
      },
      {
        label: 'Tag',
        key: 'tag',
        path: '/tag'
      },
      {
        label: 'FAQ',
        key: 'faq',
        path: '/faq'
      }
    ]
  },
  {
    label: 'Quản lý người dùng',
    key: 'user-management',
    children: [
      {
        label: 'Quản lý khách hàng',
        key: 'user',
        path: '/pms/user'
      },
      {
        label: 'Quản lý nhân sự',
        key: 'staff',
        path: '/pms/staff'
      }
    ]
  },
  {
    label: 'Quản lý hệ thống',
    key: 'system-management',
    children: [
      {
        label: 'Vai trò',
        key: 'role',
        path: '/pms/role'
      },
      {
        label: 'Phân quyền vai trò',
        key: 'role-permission',
        path: '/pms/role-permission'
      },
      {
        label: 'Nhật ký hoạt động',
        key: 'operation-log',
        path: '/pms/operation-log'
      }
    ]
  }
])

// Tìm menu item theo key
function findMenuItem(options, key) {
  for (const item of options) {
    if (item.key === key) {
      return item
    }
    if (item.children) {
      const found = findMenuItem(item.children, key)
      if (found) return found
    }
  }
  return null
}

// Xử lý khi click menu
function handleMenuSelect(key, item) {
  
  // Nếu không có item, tìm trong menu options
  if (!item) {
    item = findMenuItem(menuOptions.value, key)
  }
  
  // Kiểm tra item có path không
  if (!item || !item.path) {
    return
  }

  try {
    if (isExternal(item.originPath || item.path)) {
      $dialog.confirm({
        type: 'info',
        title: 'Vui lòng chọn cách mở',
        positiveText: 'Mở liên kết ngoài',
        negativeText: 'Mở nhúng trong trang này',
        onPositiveClick() {
          window.open(item.originPath || item.path)
        },
        onNegativeClick() {
          router.push(item.path)
        }
      })
    } else {
      router.push(item.path)
    }
  } catch (error) {
    console.error('Lỗi khi xử lý menu:', error)
  }
}

// Watch route changes
watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
    })
  },
  { immediate: true }
)
</script>

<style>
.side-menu:not(.n-menu--collapsed) {
  .n-menu-item-content {
    &::before {
      left: 8px;
      right: 8px;
    }
    &.n-menu-item-content--selected::before {
      border-left: 4px solid rgb(var(--primary-color));
    }
  }
}
</style>
