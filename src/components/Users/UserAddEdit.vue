<script setup>
defineOptions({ name: "UserAddEdit" });

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const context = computed(() => {
  if (route.path.includes("staff")) return "nhân sự";
  if (route.path.includes("user")) return "khách hàng";
});
const isEdit = computed(() => !!props.id);
const loading = ref(false);

const userForm = ref({
  role: null,
  creator_id: userStore.userId,
  creator_name: userStore.username,
  full_name: "",
  phone: "",
  email: "",
  address: "",
  addresses: [""],
  avatar: null,
});

const rules = {
  creator_name: [
    {
      required: true,
      message: "Không xác định người tạo",
      trigger: ["blur", "input"],
    },
  ],
  full_name: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const name = String(value || "").trim();
        if (!name) return new Error(`Vui lòng nhập tên ${context.value}`);
        if (name.length < 10)
          return new Error(`Tên ${context.value} phải có ít nhất 10 ký tự`);
        if (name.length > 100)
          return new Error(`Tên ${context.value} không được quá 100 ký tự`);
        return true;
      },
      trigger: ["blur", "input"],
    },
  ],
  phone: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const phone = String(value || "").trim();

        // Kiểm tra nếu trống
        if (!phone) {
          return new Error("Vui lòng nhập số điện thoại");
        }

        // Đầu số hợp lệ của nhà mạng Việt Nam
        const validPrefixes = [
          "032",
          "033",
          "034",
          "035",
          "036",
          "037",
          "038",
          "039", // Viettel
          "070",
          "076",
          "077",
          "078",
          "079", // Mobifone
          "081",
          "082",
          "083",
          "084",
          "085",
          "086", // Vinaphone
          "056",
          "058", // Vietnamobile
          "059", // Gmobile
          "090",
          "093",
          "089",
          "092",
          "094",
          "099",
          "098",
          "097",
          "096",
          "091",
          "095", // các đầu số cũ
        ];

        // Kiểm tra định dạng cơ bản (10 số, bắt đầu bằng 0)
        if (!/^0\d{9}$/.test(phone)) {
          return new Error(
            "Số điện thoại định dạng không chính xác (phải gồm 10 số và bắt đầu bằng 0)"
          );
        }

        // Kiểm tra đầu số hợp lệ
        const prefix = phone.substring(0, 3);
        if (!validPrefixes.includes(prefix)) {
          return new Error(
            "Số điện thoại định dạng không chính xác (đầu số không hợp lệ)"
          );
        }

        return true;
      },
    },
  ],
  email: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const email = String(value || "").trim();

        // Kiểm tra nếu trống
        if (!email) {
          return new Error("Vui lòng nhập email");
        }

        // Kiểm tra định dạng email cơ bản (không chỉ giới hạn @gmail.com)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          return new Error("Email không đúng định dạng");
        }

        return true;
      },
    },
  ],
  address: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        const address = userForm.value.address;
        if (!address) {
          return new Error("Vui lòng nhập địa chỉ");
        }
        if (address.length < 20) {
          return new Error("Địa chỉ phải có ít nhất 20 ký tự");
        }
        if (address.length > 255) {
          return new Error("Địa chỉ không được quá 255 ký tự");
        }
        return true;
      },
    },
  ],
};

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim("-");
}

watch(
  () => userForm.value.name,
  (newName) => {
    if (newName) {
      userForm.value.slug = generateSlug(newName);
    }
  }
);

const formRef = ref(null);
const updateAddressRef = ref(null);

async function loadUser() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getUserById(props.id);
    if (response.data.success) {
      const d = response.data.data;
      userForm.value = {
        role: d.role || null,
        creator_id: d.creator_id,
        creator_name: d.creator_name,
        full_name: d.full_name || "",
        phone: d.phone || "",
        email: d.email || "",
        addresses: d.addresses?.map((a) => a.address) || [""],
        avatar: d.avatar || null,
      };
    }
  } catch (error) {
    $message.error(`Không thể tải thông tin ${context.value}`);
    console.error("Load order error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // Gán người tạo khi tạo mới
  if (!isEdit.value) {
    userForm.value.creator_id = userStore.userId;
    userForm.value.creator_name = userStore.username;
  }
  if (isEdit.value) {
    loadUser();
  }
});

function handleBack() {
  if (route.path.includes("staff")) {
    return router.push("/staff");
  } else return router.push("/user");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    if (updateAddressRef.value && !updateAddressRef.value.handleSaveRequest()) {
      return;
    }

    if (
      userForm.value.addresses.length === 0 ||
      !userForm.value.addresses[0].trim()
    ) {
      $message.error("Vui lòng nhập địa chỉ");
      return;
    }

    loading.value = true;

    const body = {
      ...userForm.value,
      creator_id: userStore.userId,
      addresses: userForm.value.addresses.filter((addr) => addr.trim() !== ""),
    };
    if (isEdit.value) {
      await api.updateUser(props.id, body);
      $message.success(`Cập nhật ${context.value} thành công!`);
    } else {
      await api.createUser(body);
      $message.success(`Thêm ${context.value} thành công!`);
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? `Cập nhật ${context.value} thất bại`
      : `Thêm ${context.value} thất bại`;
    $message.error(errorMessage);
    console.error("Save order error:", error);
  } finally {
    loading.value = false;
  }
}

function handleInput() {
  if (userForm.value.full_name) {
    userForm.value.full_name = userForm.value.full_name
      .trim()
      .replace(/\s+/g, " ");
  }
}

function handleAddressChange(val) {
  userForm.value.address = val;
}
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card :title="isEdit ? `Sửa ${context}` : `Thêm ${context}`">
      <n-form :model="userForm" :rules="rules" ref="formRef">
        <n-grid cols="3" x-gap="16" y-gap="16">
          <n-grid-item span="1">
            <n-form-item :label="`Tên ${context}`" path="full_name">
              <NaiveInput
                v-model:value="userForm.full_name"
                @blur="handleInput"
                :placeholder="`Nhập tên ${context}`"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Số điện thoại" path="phone">
              <NaiveInput
                v-model:value="userForm.phone"
                @input="
                  userForm.phone = $event.replace(/[^\d]/g, '').slice(0, 10)
                "
                :input-props="{
                  inputmode: 'numeric',
                  pattern: '[0-9]*',
                  maxlength: 10,
                }"
                placeholder="Nhập số điện thoại"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Email" path="email">
              <NaiveInput
                v-model:value="userForm.email"
                @input="userForm.email = $event.replace(/[^\d]/g, '')"
                placeholder="Nhập email"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item
              label="Địa chỉ"
              :path="userForm.role === 'owner' ? '' : 'address'"
            >
              <UpdateAddress
                ref="updateAddressRef"
                :addresses="userForm.addresses"
                @update:addresses="userForm.addresses = $event"
                @input-address-change="handleAddressChange"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item label="Chọn ảnh đại diện" path="avatar">
              <NaiveUpload
                :file-list="avatar"
                @update:file-list="emit('update:avatar', $event)"
                :max="1"
                list-type="image-card"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
      </n-form>

      <template #action>
        <ButtonSave
          :isEdit="isEdit"
          :handleBack="handleBack"
          :handleSave="handleSave"
        />
      </template>
    </n-card>
  </CommonPage>
</template>
