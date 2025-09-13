export default [
  {
    rules: {
      // các rule bạn đã có sẵn
      "n/prefer-global/process": "off",
      "no-undef": "error",
      "no-fallthrough": "off",
      "vue/block-order": "off",
      "@typescript-eslint/no-this-alias": "off",
      "prefer-promise-reject-errors": "off",

      // ⬇️ tắt các rule stylistic thường gây lỗi đỏ
      "no-trailing-spaces": "off",
      "no-multiple-empty-lines": "off",
      "eol-last": "off",
      semi: "off",
      quotes: "off",
      indent: "off",
      "space-before-function-paren": "off",
      "comma-dangle": "off",
    },

    languageOptions: {
      globals: {
        h: "readonly",
        unref: "readonly",
        provide: "readonly",
        inject: "readonly",
        markRaw: "readonly",
        defineAsyncComponent: "readonly",
        nextTick: "readonly",
        useRoute: "readonly",
        useRouter: "readonly",
        Message: "readonly",
        $loadingBar: "readonly",
        $message: "readonly",
        $dialog: "readonly",
        $notification: "readonly",
        $modal: "readonly",
      },
    },
  },
];
