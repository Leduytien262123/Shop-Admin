import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
  }),
  getters: {
    userId() {
      return this.userInfo?.id
    },
    username() {
      return this.userInfo?.username
    },
    nickName() {
      return this.userInfo?.full_name || this.userInfo?.nickName
    },
    avatar() {
      return this.userInfo?.avatar
    },
    email() {
      return this.userInfo?.email
    },
    role() {
      return this.userInfo?.role
    },
    isActive() {
      return this.userInfo?.is_active
    },
    currentRole() {
      return this.userInfo?.currentRole || { name: this.userInfo?.role }
    },
    roles() {
      return this.userInfo?.roles || []
    },
  },
  actions: {
    setUser(user) {
      // Xử lý format user mới từ API
      this.userInfo = {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        nickName: user.full_name, // Sử dụng full_name làm nickName
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
        avatar: user.avatar || null,
        // Tương thích với format cũ
        currentRole: { name: user.role },
        roles: [{ name: user.role }]
      }
    },
    resetUser() {
      this.$reset()
    },
  },
})
