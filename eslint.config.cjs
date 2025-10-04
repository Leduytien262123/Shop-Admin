const vuePlugin = require("eslint-plugin-vue");

module.exports = [
  // Ignore patterns - loại trừ dist và node_modules
  {
    ignores: ["dist/**", "node_modules/**", "build/**"]
  },
  
  // Cấu hình cho tất cả JS/TS files
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
        // Vue 3 Composition API globals
        h: "readonly",
        unref: "readonly",
        provide: "readonly",
        inject: "readonly",
        markRaw: "readonly",
        defineAsyncComponent: "readonly",
        nextTick: "readonly",
        useRoute: "readonly",
        useRouter: "readonly",
        ref: "readonly",
        reactive: "readonly",
        computed: "readonly",
        watch: "readonly",
        watchEffect: "readonly",
        onMounted: "readonly",
        onUnmounted: "readonly",
        shallowRef: "readonly",
        
        // Naive UI globals
        Message: "readonly",
        $loadingBar: "readonly",
        $message: "readonly",
        $dialog: "readonly",
        $notification: "readonly",
        $modal: "readonly",
        useMessage: "readonly",
        message: "readonly",
        NSwitch: "readonly",
        NButton: "readonly",
        
        // Pinia/Store globals
        useUserStore: "readonly",
        
        // Library globals
        dayjs: "readonly",
        
        // Application specific globals
        api: "readonly",
        useCrud: "readonly",
        
        // Browser globals
        window: "readonly",
        document: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        navigator: "readonly",
        location: "readonly",
        history: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        FormData: "readonly",
        Blob: "readonly",
        File: "readonly",
        FileReader: "readonly",
        Image: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
        InputEvent: "readonly",
        Element: "readonly",
        HTMLElement: "readonly",
        SVGElement: "readonly",
        MathMLElement: "readonly",
        DOMMatrix: "readonly",
        WebKitCSSMatrix: "readonly",
        MutationObserver: "readonly",
        ResizeObserver: "readonly",
        IntersectionObserver: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setImmediate: "readonly",
        queueMicrotask: "readonly",
        getComputedStyle: "readonly",
        performance: "readonly",
        devicePixelRatio: "readonly",
        atob: "readonly",
        btoa: "readonly",
        CSS: "readonly",
        Storage: "readonly",
        StorageEvent: "readonly",
        XMLHttpRequest: "readonly",
        AbortController: "readonly",
        ReadableStream: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        Buffer: "readonly",
        
        // Node.js/Build globals
        process: "readonly",
        global: "readonly",
        self: "readonly",
        exports: "readonly",
        module: "readonly",
        require: "readonly",
        
        // Framework/Library specific
        wx: "readonly",
        chrome: "readonly",
        saveAs: "readonly",
        IE_SaveFile: "readonly",
        Deno: "readonly",
        encrypt_agile: "readonly",
        WorkerGlobalScope: "readonly",
        
        // Application specific
        handleSave: "readonly",
        code: "readonly"
      },
    },
  },
  
  // Cấu hình đặc biệt cho Vue files
  {
    files: ["**/*.vue"],
    plugins: {
      vue: vuePlugin,
    },
    languageOptions: {
      parser: require("vue-eslint-parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // Vue 3 recommended rules (manual definition)
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "vue/require-default-prop": "off",
      "vue/require-explicit-emits": "off",
      "vue/component-definition-name-casing": ["error", "PascalCase"],
      "vue/html-self-closing": ["error", {
        "html": {
          "void": "never",
          "normal": "always",
          "component": "always"
        }
      }]
    },
  },
];
