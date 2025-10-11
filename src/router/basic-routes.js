export const basicRoutes = [
  {
    name: "Login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "Trang đăng nhập",
      layout: "empty",
    },
  },

  {
    name: "Home",
    path: "/",
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: "Trang chủ",
    },
  },

  {
    name: "category",
    path: "/category",
    component: () => import("@/views/category/index.vue"),
    meta: {
      title: "Quản lý danh mục",
    },
  },

  {
    name: "category_add",
    path: "/category/add",
    component: () => import("@/views/category/add.vue"),
    meta: {
      title: "Thêm danh mục",
    },
  },

  {
    name: "category_edit",
    path: "/category/edit/:id",
    component: () => import("@/views/category/edit/[id].vue"),
    meta: {
      title: "Sửa danh mục",
    },
  },

  {
    name: "product",
    path: "/product",
    component: () => import("@/views/product/index.vue"),
    meta: {
      title: "Quản lý sản phẩm",
    },
  },

  {
    name: "product_add",
    path: "/product/add",
    component: () => import("@/views/product/add.vue"),
    meta: {
      title: "Thêm sản phẩm",
    },
  },

  {
    name: "product_edit",
    path: "/product/edit/:id",
    component: () => import("@/views/product/edit/[id].vue"),
    meta: {
      title: "Sửa sản phẩm",
    },
  },

  {
    name: "order",
    path: "/order",
    component: () => import("@/views/order/index.vue"),
    meta: {
      title: "Quản lý đơn hàng",
    },
  },

  {
    name: "order_add",
    path: "/order/add",
    component: () => import("@/views/order/add.vue"),
    meta: {
      title: "Thêm đơn hàng",
    },
  },

  {
    name: "order_edit",
    path: "/order/edit/:id",
    component: () => import("@/views/order/edit/[id].vue"),
    meta: {
      title: "Sửa đơn hàng",
    },
  },

  {
    name: "discount",
    path: "/discount",
    component: () => import("@/views/discount/index.vue"),
    meta: {
      title: "Quản lý mã giảm giá",
    },
  },

  {
    name: "discount_add",
    path: "/discount/add",
    component: () => import("@/views/discount/add.vue"),
    meta: {
      title: "Thêm mã giảm giá",
    },
  },

  {
    name: "discount_edit",
    path: "/discount/edit/:id",
    component: () => import("@/views/discount/edit/[id].vue"),
    meta: {
      title: "Sửa mã giảm giá",
    },
  },

  {
    name: "blog-category",
    path: "/blog-category",
    component: () => import("@/views/blog-category/index.vue"),
    meta: {
      title: "Quản lý danh mục bài viết",
    },
  },

  {
    name: "blog-category_add",
    path: "/blog-category/add",
    component: () => import("@/views/blog-category/add.vue"),
    meta: {
      title: "Thêm danh mục bài viết",
    },
  },

  {
    name: "blog-category_edit",
    path: "/blog-category/edit/:id",
    component: () => import("@/views/blog-category/edit/[id].vue"),
    meta: {
      title: "Sửa danh mục bài viết",
    },
  },

  {
    name: "blog",
    path: "/blog",
    component: () => import("@/views/blog/index.vue"),
    meta: {
      title: "Quản lý bài viết",
    },
  },

  {
    name: "blog_add",
    path: "/blog/add",
    component: () => import("@/views/blog/add.vue"),
    meta: {
      title: "Thêm bài viết",
    },
  },

  {
    name: "blog_edit",
    path: "/blog/edit/:id",
    component: () => import("@/views/blog/edit/[id].vue"),
    meta: {
      title: "Sửa bài viết",
    },
  },

  {
    name: "tag",
    path: "/tag",
    component: () => import("@/views/tag/index.vue"),
    meta: {
      title: "Quản lý thẻ Tag",
    },
  },

  {
    name: "tag_add",
    path: "/tag/add",
    component: () => import("@/views/tag/add.vue"),
    meta: {
      title: "Thêm thẻ Tag",
    },
  },

  {
    name: "tag_edit",
    path: "/tag/edit/:id",
    component: () => import("@/views/tag/edit/[id].vue"),
    meta: {
      title: "Sửa thẻ Tag",
    },
  },

  {
    name: "user",
    path: "/user",
    component: () => import("@/views/user/index.vue"),
    meta: {
      title: "Quản lý khách hàng",
    },
  },

  {
    name: "user_add",
    path: "/user/add",
    component: () => import("@/views/user/add.vue"),
    meta: {
      title: "Thêm khách hàng",
    },
  },

  {
    name: "user_edit",
    path: "/user/edit/:id",
    component: () => import("@/views/user/edit/[id].vue"),
    meta: {
      title: "Sửa khách hàng",
    },
  },

  {
    name: "staff",
    path: "/staff",
    component: () => import("@/views/staff/index.vue"),
    meta: {
      title: "Quản lý nhân sự",
    },
  },

  {
    name: "staff_add",
    path: "/staff/add",
    component: () => import("@/views/staff/add.vue"),
    meta: {
      title: "Thêm nhân sự",
    },
  },

  {
    name: "staff_edit",
    path: "/staff/edit/:id",
    component: () => import("@/views/staff/edit/[id].vue"),
    meta: {
      title: "Sửa nhân sự",
    },
  },

  {
    name: "role",
    path: "/role",
    component: () => import("@/views/role/index.vue"),
    meta: {
      title: "Quản lý vai trò",
    },
  },

  {
    name: "profile",
    path: "/profile",
    component: () => import("@/views/profile/index.vue"),
    meta: {
      title: "Hồ sơ cá nhân",
    },
  },

  {
    name: "test-upload",
    path: "/demo/upload",
    component: () => import("@/views/demo/upload/index.vue"),
    meta: {
      title: "Demo upload",
    },
  },

  {
    name: "404",
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      title: "Trang không tồn tại",
      layout: "empty",
    },
  },

  {
    name: "403",
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      title: "Không có quyền truy cập",
      layout: "empty",
    },
  },
];
