<script setup>
const route = useRoute()
import CouponAddEdit from '@/components/Coupons/CouponAddEdit.vue'
</script>

<template>
  <CouponAddEdit :id="route?.params?.id" />
</template>