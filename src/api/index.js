import { request } from '@/utils'

export default {
  // Authentication APIs
  login: data => request.post('/api/auth/login', data, { needToken: false }),
  logout: () => request.post('/api/auth/logout', {}, { needTip: false }),
  refreshToken: () => request.post('/api/auth/refresh', {}),
  getCaptcha: () => request.get('/api/auth/captcha', { needToken: false, responseType: 'blob' }),
  
  // User APIs
  getUser: () => request.get('/api/user/profile'),
  updateProfile: data => request.put('/api/user/profile', data),
  changePassword: data => request.post('/api/user/change-password', data),
  
  // Role & Permission APIs
  getRolePermissions: () => request.get('/api/admin/roles/permissions'),
  switchCurrentRole: role => request.post('/api/user/switch-role', { role }),
  validateMenuPath: path => request.get('/api/permissions/validate-menu', { params: { path } }),
  
  // Categories APIs
  getCategories: (params = {}) => request.get('/api/admin/manage/categories', { params }),
  getCategoryById: (id) => request.get(`/api/admin/manage/category/${id}`),
  createCategory: (data) => request.post('/api/admin/manage/category', data),
  updateCategory: (id, data) => request.put(`/api/admin/manage/category/${id}`, data),
  deleteCategory: (id) => request.delete(`/api/admin/manage/category/${id}`),

  // Products APIs
  getProducts: (params = {}) => request.get('/api/admin/manage/products', { params }),
  getProductById: (id) => request.get(`/api/admin/manage/product/${id}`),
  createProduct: (data) => request.post('/api/admin/manage/product', data),
  updateProduct: (id, data) => request.put(`/api/admin/manage/product/${id}`, data),
  deleteProduct: (id) => request.delete(`/api/admin/manage/product/${id}`),

  // Orders APIs
  getOrders: (params = {}) => request.get('/api/admin/manage/orders', { params }),
  getOrderById: (id) => request.get(`/api/admin/manage/order/${id}`),
  createOrder: (data) => request.post('/api/admin/manage/order', data),
  updateOrder: (id, data) => request.put(`/api/admin/manage/order/${id}`, data),
  deleteOrder: (id) => request.delete(`/api/admin/manage/order/${id}`),

  // Coupons APIs
  getCoupons: (params = {}) => request.get('/api/admin/manage/coupons', { params }),
  getCouponById: (id) => request.get(`/api/admin/manage/coupon/${id}`),
  createCoupon: (data) => request.post('/api/admin/manage/coupon', data),
  updateCoupon: (id, data) => request.put(`/api/admin/manage/coupon/${id}`, data),
  deleteCoupon: (id) => request.delete(`/api/admin/manage/coupon/${id}`),
  
  // User Management APIs (Admin)
  getAllUsers: (params = {}) => request.get('/api/admin/manage/users', { params }),
  createUser: (data) => request.post('/api/admin/manage/users', data),
  updateUser: (id, data) => request.put(`/api/admin/manage/users/${id}`, data),
  deleteUser: (id) => request.delete(`/api/admin/manage/users/${id}`),
  resetUserPassword: (id, data) => request.post(`/api/admin/manage/users/${id}/reset-password`, data),
  
  // Role Management APIs (Admin/manage)
  getAllRoles: (params = {}) => request.get('/api/admin/manage/roles', { params }),
  createRole: (data) => request.post('/api/admin/manage/roles', data),
  updateRole: (id, data) => request.put(`/api/admin/manage/roles/${id}`, data),
  deleteRole: (id) => request.delete(`/api/admin/manage/roles/${id}`),
  addRoleUsers: (roleId, data) => request.post(`/api/admin/manage/roles/${roleId}/users`, data),
  removeRoleUsers: (roleId, data) => request.delete(`/api/admin/manage/roles/${roleId}/users`, { data }),
  
  // Permission Management APIs (Admin)
  getMenuTree: () => request.get('/api/admin/permissions/menu-tree'),
  getButtons: (parentId) => request.get(`/api/admin/permissions/buttons/${parentId}`),
  addPermission: (data) => request.post('/api/admin/permissions', data),
  updatePermission: (id, data) => request.put(`/api/admin/permissions/${id}`, data),
  deletePermission: (id) => request.delete(`/api/admin/permissions/${id}`),
  getAllPermissionTree: () => request.get('/api/admin/permissions/tree'),
}
