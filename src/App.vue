<template>
  <div class="layout">
    <RequestBrand />
    <RequestFilters
      v-model:filters="filters"
      @clear="methods.onClear"
      @setting="methods.onSetting"
    />
    <RequestList :list="list" />
    <RequestSettingModal ref="modal" />
  </div>
</template>

<script setup>
import { settings } from "./stores";
import { reactive, ref, computed } from "vue";
import RequestBrand from "./components/RequestBrand.vue";
import RequestFilters from "./components/RequestFilters.vue";
import RequestList from "./components/RequestList.vue";
import RequestSettingModal from "./components/RequestSettingModal.vue";

const modal = ref(null);
const filters = reactive({
  url: "",
  type: "all",
});
const source = ref([]);

const list = computed(() => {
  //处理类型过滤
  let cache = [...source.value];
  if (filters.type !== "all") {
    cache = cache.filter((i) => i.type === filters.type);
  }
  //处理url过滤
  return cache.filter((i) => i.url.includes(filters.url));
});

const methods = {
  onClear() {
    source.value = [];
  },
  onAddListener() {
    chrome.devtools.network.onRequestFinished.addListener((req) => {
      if (req.request.method.toUpperCase() === "OPTIONS") return;

      req.getContent((body) => {
        const parsedResponse = utils.parseHandler(body);
        const parsedPayload = utils.parseHandler(
          req.request.postData?.text || ""
        );
        const headersObj = {};

        const headerIgnores = settings.value.headers
          .split(",")
          .map((i) => i.trim().toLowerCase());

        req.request.headers.forEach((h) => {
          if (!headerIgnores.includes(h.name.toLowerCase())) {
            headersObj[h.name] = h.value;
          }
        });

        const type = utils.typeHandler(req);

        const item = {
          url: req.request.url,
          method: req.request.method,
          headers: headersObj,
          payload: parsedPayload,
          response: parsedResponse,
          type,
        };

        source.value.unshift(item);
      });
    });
  },
  onSetting() {
    console.log("modal", modal.value.onOpen());
    // modal.value?.onOpen();
  },
};

const utils = {
  typeHandler(req) {
    const url = req.request.url.split("?")[0].toLowerCase();

    const staticExts = [
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".webp",
      ".svg",
      ".mp4",
      ".mp3",
      ".wav",
      ".js",
      ".css",
      ".html",
      ".htm",
      ".ico",
      ".woff",
      ".woff2",
      ".ttf",
      ".eot",
    ];

    if (staticExts.some((ext) => url.endsWith(ext))) {
      return "static";
    }

    const headers = req.request.headers.reduce((acc, h) => {
      acc[h.name.toLowerCase()] = h.value;
      return acc;
    }, {});

    if (
      headers["content-type"]?.includes("application/json") ||
      headers["x-requested-with"] === "XMLHttpRequest"
    ) {
      return "xhr";
    }

    if (["POST", "PUT", "PATCH"].includes(req.request.method.toUpperCase())) {
      return "xhr";
    }

    return "xhr";
  },
  parseHandler(str) {
    if (!str) return "";
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  },
};
methods.onAddListener();
</script>
<style lang="scss" scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  grid-gap: 10px;
}
</style>
