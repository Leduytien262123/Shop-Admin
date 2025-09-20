<script setup>
defineOptions({ name: "DiscountAddEdit" });

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
});

const router = useRouter();

const discountForm = ref({
  discount_code: "",
  start_at: null,
  end_at: null,
  type: 1, // Loại giảm giá
  value_voucher: null, // giá trị giảm giá
  quantity: null, // số lượng mã giảm giá
  usage_limit: 0, // giới hạn sử dụng
  usage_count: 1, // số lần sử dụng
  applied_products: [], // sản phẩm áp dụng
  description: "",
});

const isEdit = computed(() => !!props.id);
const products = ref([]); // sản phẩm áp dụng
const loading = ref(false);

const typeDiscount = [
  { label: "Giảm phần trăm", value: 1 },
  { label: "Số tiền", value: 2 },
];

const usageLimit = [
  { label: "Không giới hạn", value: 0 },
  { label: "Giới hạn", value: 1 },
];

const rules = {
  discount_code: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        if (value === null || value === undefined || value === "")
          return new Error("Vui lòng nhập mã giảm giá");
        if (!/^[A-Z0-9]+$/.test(value))
          return new Error("Chỉ nhập chữ in hoa và số");
        return true;
      },
    },
  ],
  date_range: {
    required: true,
    trigger: ["input", "blur"],
    validator: () => {
      return new Promise((resolve, reject) => {
        if (!discountForm.value?.start_at || !discountForm.value?.end_at) {
          reject(new Error("Thời gian áp dụng không được để trống"));
          return;
        }
        const now = Date.now();
        const start = Number(new Date(discountForm.value.start_at));
        const end = Number(new Date(discountForm.value.end_at));
        if (start < now) {
          reject(new Error("Không được chọn ngày bắt đầu trong quá khứ"));
          return;
        }
        if (end < now) {
          reject(new Error("Không được chọn ngày kết thúc trong quá khứ"));
          return;
        }
        if (start > end) {
          reject(new Error("Thời gian kết thúc phải sau thời gian bắt đầu"));
          return;
        }
        resolve();
      });
    },
  },
  value_voucher: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(_, value) {
        if (!value) {
          return new Error("Vui lòng nhập giá trị giảm giá");
        }
        return true;
      },
    },
  ],
  quantity: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(_, value) {
        if (!value) {
          return new Error("Vui lòng nhập số lượng mã giảm giá");
        }
        return true;
      },
    },
  ],
  usage_count: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(_, value) {
        if (!value) {
          return new Error("Vui lòng nhập số lần sử dụng");
        }
        return true;
      },
    },
  ],
};

watch(
  () => discountForm.value.discount_code,
  (newCode) => {
    if (newCode) {
      discountForm.value.discount_code = (newCode || "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
    }
  }
);

watch(
  () => discountForm.value.value_voucher,
  (newCode) => {
    if (discountForm.value.type === 1 && newCode > 100) {
      discountForm.value.value_voucher = 100;
    }
  }
);

const formRef = ref(null);

async function loadProducts() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    const response = await api.getProducts(params);
    products.value =
      response.data?.data?.products.map((e) => ({
        label: e.name,
        value: e.id,
      })) || [];
  } catch (error) {
    $message.error("Không thể tải danh sách sản phẩm");
  } finally {
    loading.value = false;
  }
}

async function loadProduct() {
  if (!props.id) return;

  try {
    loading.value = true;
    const response = await api.getProductById(props.id);
    if (response.data.success) {
      discountForm.value = {
        discount_code: response.data.data.discount_code || "",
        start_at: response.data.data.start_at || null,
        end_at: response.data.data.end_at || null,
        type: response.data.data.type || null,
        value_voucher: response.data.data.value_voucher || null,
        quantity: response.data.data.quantity || null,
        usage_limit: response.data.data.usage_limit || null,
        usage_count: response.data.data.usage_count || null,
        applied_products: response.data.data.applied_products || [],
        description: response.data.data.description || "",
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin mã giảm giá");
    console.error("Load discount error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadProducts();
  if (isEdit.value) {
    loadProduct();
  }
});

function handleBack() {
  router.push("/discount");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    loading.value = true;

    if (isEdit.value) {
      await api.updateDiscount(props.id, discountForm.value);
      $message.success("Cập nhật mã giảm giá thành công!");
    } else {
      await api.createDiscount(discountForm.value);
      $message.success("Thêm mã giảm giá thành công!");
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? "Cập nhật mã giảm giá thất bại"
      : "Thêm mã giảm giá thất bại";
    $message.error(errorMessage);
    console.error("Save discount error:", error);
  } finally {
    loading.value = false;
  }
}

const ONE_DAY_IN_MILLISECOND = 86400000;
const disablePreviousDate = (date) =>
  date < Date.now() - ONE_DAY_IN_MILLISECOND;
const disableEndDate = (date) => {
  const now = dayjs();
  const currentDate = dayjs(date);
  const startDate = discountForm.start_at ? dayjs(discountForm.start_at) : null;

  return startDate
    ? currentDate.isBefore(startDate, "days")
    : currentDate.isBefore(now, "seconds");
};
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card :title="isEdit ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'">
      <n-form :model="discountForm" :rules="rules" ref="formRef">
        <n-grid cols="3" x-gap="16" y-gap="16">
          <n-grid-item span="1">
            <n-form-item label="Mã giảm giá" path="discount_code">
              <NaiveInput
                v-model:value="discountForm.discount_code"
                placeholder="Nhập mã giảm giá"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="2">
            <n-form-item label="Thời gian áp dụng" path="date_range">
              <div
                class="flex flex-auto items-center justify-between md:gap-16 gap-8"
              >
                <n-date-picker
                  type="datetime"
                  format="dd/MM/yyyy HH:mm:ss"
                  class="w-full lg:max-w-1/2"
                  :disabled="isEdit"
                  :is-date-disabled="disablePreviousDate"
                  v-model:value="discountForm.start_at"
                  placeholder="Thời gian bắt đầu"
                >
                </n-date-picker>

                <n-date-picker
                  type="datetime"
                  format="dd/MM/yyyy HH:mm:ss"
                  class="w-full lg:max-w-1/2"
                  :is-date-disabled="disableEndDate"
                  v-model:value="discountForm.end_at"
                  placeholder="Thời gian kết thúc"
                >
                </n-date-picker>
              </div>
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Loại giảm giá" path="type">
              <n-select
                v-model:value="discountForm.type"
                :options="typeDiscount"
                @update:value="(val) => (discountForm.value_voucher = null)"
                placeholder="Chọn loại giảm giá"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item v-if="discountForm.type === 1" span="1">
            <n-form-item label="Giá trị giảm giá" path="value_voucher">
              <NaiveInputNumber
                v-model:value="discountForm.value_voucher"
                :show-button="false"
                :percent="true"
                placeholder="Nhập phần trăm giảm"
                class="w-full"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item v-else span="1">
            <n-form-item label="Giá trị giảm giá" path="value_voucher">
              <NaiveInputNumber
                v-model:value="discountForm.value_voucher"
                :show-button="false"
                placeholder="Nhập số tiền giảm"
                :money="true"
                class="w-full"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Số lượng mã giảm giá" path="quantity">
              <NaiveInputNumber
                v-model:value="discountForm.quantity"
                :show-button="false"
                :max="100"
                placeholder="Nhập số lượng mã giảm giá"
                class="w-full"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Giới hạn sử dụng" path="usage_limit">
              <n-select
                v-model:value="discountForm.usage_limit"
                :options="usageLimit"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item v-if="discountForm.usage_limit === 1" span="2">
            <n-form-item
              label="Số lần sử dụng (tính theo số điện thoại đặt hàng)"
              path="usage_count"
            >
              <NaiveInputNumber
                v-model:value="discountForm.usage_count"
                :show-button="false"
                placeholder="Nhập số lần sử dụng"
                class="w-full"
                :min="1"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item label="Sản phẩm áp dụng">
              <n-select
                v-model:value="discountForm.applied_products"
                :options="products"
                multiple
                placeholder="Áp dụng cho tất cả sản phẩm"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item label="Ghi chú" path="description">
              <NaiveInput
                v-model:value="discountForm.description"
                type="textarea"
                placeholder="Nhập mô tả mã giảm giá"
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
