<template>
  <Modal
    :width="300"
    v-model:visible="visible"
    title="设置"
    body-style="padding:10px"
    :on-before-ok="methods.onSubmit"
  >
    <div style="color: #005af9; margin-bottom: 5px">
      复制时需要排除的Header字段
    </div>
    <Textarea style="height: 300px" size="small" v-model="form" />
  </Modal>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Modal, Textarea } from "@arco-design/web-vue";
import { settings } from "../stores";

const visible = ref(false);

const form = ref("");

const methods = {
  onOpen() {
    visible.value = true;
    form.value = settings.value.headers.split(",").join("\n");
  },
  onClose() {
    visible.value = false;
  },
  onSubmit() {
    const arr = form.value.split("\n").map((item) => {
      return item.trim();
    });
    const str = arr.join(",");
    settings.value.headers = str;
    return true;
  },
};
defineExpose({
  onOpen: methods.onOpen,
  onClose: methods.onClose,
});
</script>
<style lang="scss" scoped></style>
