export const basicRoutes = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: 'Trang đăng nhập',
      layout: 'empty',
    },
  },

  {
    name: 'Home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: 'Trang chủ',
    },
  },

  {
    name: 'category',
    path: '/category',
    component: () => import('@/views/category/index.vue'),
    meta: {
      title: 'Quản lý danh mục',
    },
  },

  {
    name: 'category_add',
    path: '/category/add',
    component: () => import('@/views/category/add.vue'),
    meta: {
      title: 'Thêm danh mục',
    },
  },

  {
    name: 'category_edit',
    path: '/category/edit/:id',
    component: () => import('@/views/category/edit/[id].vue'),
    meta: {
      title: 'Sửa danh mục',
    },
  },

  {
    name: 'product',
    path: '/product',
    component: () => import('@/views/product/index.vue'),
    meta: {
      title: 'Quản lý sản phẩm',
    },
  },

  {
    name: 'product_add',
    path: '/product/add',
    component: () => import('@/views/product/add.vue'),
    meta: {
      title: 'Thêm sản phẩm',
    },
  },

  {
    name: 'product_edit',
    path: '/product/edit/:id',
    component: () => import('@/views/product/edit/[id].vue'),
    meta: {
      title: 'Sửa sản phẩm',
    },
  },

  {
    name: 'order',
    path: '/order',
    component: () => import('@/views/order/index.vue'),
    meta: {
      title: 'Quản lý đơn hàng',
    },
  },

  {
    name: 'order_add',
    path: '/order/add',
    component: () => import('@/views/order/add.vue'),
    meta: {
      title: 'Thêm đơn hàng',
    },
  },

  {
    name: 'order_edit',
    path: '/order/edit/:id',
    component: () => import('@/views/order/edit/[id].vue'),
    meta: {
      title: 'Sửa đơn hàng',
    },
  },

  {
    name: 'coupon',
    path: '/coupon',
    component: () => import('@/views/coupon/index.vue'),
    meta: {
      title: 'Quản lý mã giảm giá',
    },
  },

  {
    name: 'coupon_add',
    path: '/coupon/add',
    component: () => import('@/views/coupon/add.vue'),
    meta: {
      title: 'Thêm mã giảm giá',
    },
  },

  {
    name: 'coupon_edit',
    path: '/coupon/edit/:id',
    component: () => import('@/views/coupon/edit/[id].vue'),
    meta: {
      title: 'Sửa mã giảm giá',
    },
  },

  {
    name: 'user',
    path: '/pms/user',
    component: () => import('@/views/pms/user/index.vue'),
    meta: {
      title: 'Quản lý khách hàng',
    },
  },

  {
    name: 'user',
    path: '/pms/staff',
    component: () => import('@/views/pms/user/index.vue'),
    meta: {
      title: 'Quản lý nhân sự',
    },
  },

  {
    name: 'role',
    path: '/pms/role',
    component: () => import('@/views/pms/role/index.vue'),
    meta: {
      title: 'Quản lý vai trò',
    },
  },

  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      title: 'Trang không tồn tại',
      layout: 'empty',
    },
  },

  {
    name: '403',
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      title: 'Không có quyền truy cập',
      layout: 'empty',
    },
  },
]
