<template>
  <div class="request-list">
    <Empty class="request-list-empty" v-show="list.length === 0" />
    <RequestItem v-for="item in list" :item="item" />
  </div>
</template>
<script setup>
import RequestItem from "./RequestItem.vue";
import { Empty } from "@arco-design/web-vue";

const props = defineProps({
  list: Object,
});
</script>
<style lang="scss" scoped>
.request-list {
  flex: 1;
  overflow: auto;
  padding: 0 10px;
  box-sizing: border-box;
  .request-list-empty {
    height: calc(100% - 10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);
  }
}
</style>
