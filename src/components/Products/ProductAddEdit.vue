<script setup>
defineOptions({ name: "ProductAddEdit" });

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
});

const router = useRouter();

const productForm = ref({
  name: "",
  slug: "",
  sku: "",
  category_id: null,
  description: "",
  price: null,
  discount_price: null,
  meta_title: "",
  meta_keywords: "",
  meta_description: "",
  meta_image: [],
});

const isEdit = computed(() => !!props.id);
const categories = ref([]);
const loading = ref(false);

const rules = {
  name: [
    {
      required: true,
      message: "Vui lòng nhập tên sản phẩm",
      trigger: ["blur", "input"],
    },
  ],
  slug: [
    {
      required: true,
      message: "Vui lòng nhập đường dẫn",
      trigger: ["blur", "input"],
    },
  ],
  sku: [
    {
      required: true,
      message: "Vui lòng nhập SKU",
      trigger: ["blur", "input"],
    },
  ],
  // category_id: [
  //   {
  //     required: true,
  //     message: "Vui lòng chọn danh mục",
  //     trigger: ["blur", "change"],
  //   },
  // ],
  price: [
    {
      required: true,
      trigger: ["blur", "input"],
      validator(rule, value) {
        if (!value) return new Error("Vui lòng nhập giá sản phẩm");
        return true;
      },
    },
  ],
  discount_price: [
    {
      required: false,
      trigger: ["blur", "input"],
      validator(rule, value) {
        if (value !== null && value !== undefined && value !== "") {
          if (Number(value) > Number(productForm.value?.price)) {
            return new Error("Giá sale không được lớn hơn giá bán");
          } else if (Number(value) === Number(productForm.value?.price)) {
            return new Error("Giá sale không được bằng giá bán");
          }
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
  () => productForm.value.name,
  (newName) => {
    if (newName) {
      productForm.value.slug = generateSlug(newName);
    }
  }
);

const formRef = ref(null);

async function loadCategories() {
  try {
    loading.value = true;
    const params = {
      page: 1,
      length: 10,
    };
    const response = await api.getCategories(params);
    categories.value =
      response.data?.data?.categories?.map((e) => ({
        label: e.name,
        value: e.id,
      })) || [];
  } catch (error) {
    $message.error("Không thể tải danh sách danh mục");
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
      productForm.value = {
        name: response.data.data.name || "",
        description: response.data.data.description || "",
        slug: response.data.data.slug || "",
        is_active: response.data.data.is_active,
        category_id: response.data.data.category_id || null,
        sku: response.data.data.sku || "",
        price: response.data.data.price || null,
        discount_price: response.data.data.discount_price || null,
        show_menu: response.data.data.show_menu,
        show_home: response.data.data.show_home,
        show_footer: response.data.data.show_footer,
        meta_title: response.data.data.meta_title || "",
        meta_keywords: response.data.data.meta_keywords || "",
        meta_description: response.data.data.meta_description || "",
        meta_image: response.data.data.meta_image || [],
      };
    }
  } catch (error) {
    $message.error("Không thể tải thông tin danh mục");
    console.error("Load category error:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCategories();
  if (isEdit.value) {
    loadProduct();
  }
});

function handleBack() {
  router.push("/product");
}

async function handleSave() {
  try {
    await formRef.value?.validate();

    loading.value = true;

    if (isEdit.value) {
      await api.updateProduct(props.id, productForm.value);
      $message.success("Cập nhật sản phẩm thành công!");
    } else {
      await api.createProduct(productForm.value);
      $message.success("Thêm sản phẩm thành công!");
    }

    handleBack();
  } catch (error) {
    if (error?.errors) {
      return;
    }

    const errorMessage = isEdit.value
      ? "Cập nhật sản phẩm thất bại"
      : "Thêm sản phẩm thất bại";
    $message.error(errorMessage);
    console.error("Save category error:", error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <CommonPage>
    <template #action>
      <ButtonBack :handleBack />
    </template>

    <n-card :title="isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'">
      <n-form :model="productForm" :rules="rules" ref="formRef">
        <n-grid cols="3" x-gap="16" y-gap="16">
          <n-grid-item span="3">
            <n-form-item label="Tên sản phẩm" path="name">
              <NaiveInput
                v-model:value="productForm.name"
                placeholder="Nhập tên sản phẩm"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="2">
            <n-form-item label="Đường dẫn" path="slug">
              <NaiveInput
                v-model:value="productForm.slug"
                placeholder="Nhập đường dẫn"
                :slug="productForm.name"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Danh mục" path="category_id">
              <NaiveSelect
                v-model:value="productForm.category_id"
                :options="categories"
                filterable
                placeholder="Chọn danh mục"
                clearable
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="SKU" path="sku">
              <NaiveInput
                v-model:value="productForm.sku"
                placeholder="Nhập sku"
                :sku="true"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Giá" path="price">
              <NaiveInputNumber
                v-model:value="productForm.price"
                :show-button="false"
                :money="true"
                placeholder="Nhập giá sản phẩm"
                class="w-full"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="1">
            <n-form-item label="Giá sale" path="discount_price">
              <NaiveInputNumber
                v-model:value="productForm.discount_price"
                :show-button="false"
                :money="true"
                placeholder="Nhập giá khuyến mãi"
                class="w-full"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item span="3">
            <n-form-item label="Mô tả" path="description">
              <NaiveInput
                v-model:value="productForm.description"
                type="textarea"
                placeholder="Nhập mô tả sản phẩm"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>

        <FormMeta
          v-model:metaTitle="productForm.meta_title"
          v-model:metaKeywords="productForm.meta_keywords"
          v-model:metaDescription="productForm.meta_description"
          v-model:metaImage="productForm.meta_image"
        />
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
