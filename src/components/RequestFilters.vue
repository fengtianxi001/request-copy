<template>
  <div class="request-filters">
    <div class="request-filters-list">
      <Button type="primary" size="mini" @click="emits('setting')">
        <template #icon>
          <IconSettings />
        </template>
      </Button>
      <Button
        type="primary"
        status="danger"
        size="mini"
        @click="emits('clear')"
      >
        清空
      </Button>
      <RadioGroup v-model="form.type" type="button" size="mini">
        <Radio value="all">All</Radio>
        <Radio value="xhr">XHR</Radio>
        <Radio value="static">静态资源</Radio>
      </RadioGroup>
    </div>
    <div class="request-filters-input">
      <Input
        v-model="form.url"
        size="mini"
        placeholder="路径过滤"
        allow-clear
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Button, Input, RadioGroup, Radio } from "@arco-design/web-vue";
import { computed } from "vue";
import { IconSettings } from "@arco-design/web-vue/es/icon";

const props = defineProps({
  filters: Object,
});

const emits = defineEmits(["update:filters", "clear", "setting"]);

const form = computed({
  get: () => props.filters!,
  set: (val) => emits("update:filters", val),
});
</script>
<style lang="scss" scoped>
.request-filters {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  box-sizing: border-box;
  grid-gap: 5px;
  flex-shrink: 0;
  .request-filters-list {
    display: flex;
    grid-gap: 5px;
  }
}
</style>
