<script setup>
const route = useRoute();
import StaffAddEdit from "@/components/Tags/StaffAddEdit.vue";
</script>

<template>
  <StaffAddEdit :id="route?.params?.id" />
</template>
