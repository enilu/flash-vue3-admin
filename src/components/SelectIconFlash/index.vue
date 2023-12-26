<template>
  <div class="icon-box">
    <el-input
      ref="inputRef"
      v-model="valueIcon"
      v-bind="$attrs"
      :placeholder="placeholder"
      :clearable="clearable"
      @clear="clearIcon"
      @click="openDialog"
    >
      <template #append>
        <SvgIcon :name="iconValue" />
      </template>
    </el-input>
    <el-dialog v-model="dialogVisible" :title="placeholder" top="50px" width="66%">
      <el-input v-model="inputValue" placeholder="搜索图标" size="large" :prefix-icon="Icons.Search" />
      <el-scrollbar v-if="Object.keys(iconsList).length">
        <div class="icon-list">
          <div v-for="item in iconsList" :key="item" class="icon-item" @click="selectIcon(item)">
            <SvgIcon :name="item.name" />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </el-scrollbar>
      <el-empty v-else description="未搜索到您要找的图标~" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="SelectIconFlash">
// SelectIconFlash图标选择器用于选择自定义图标（图标目录：src/assets/icons/*.svg)
import { ref, computed } from "vue";
import * as Icons from "@element-plus/icons-vue";
import SvgIcon from "@/components/SvgIcon/index.vue";

interface SelectIconProps {
  iconValue: string;
  title?: string;
  clearable?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<SelectIconProps>(), {
  iconValue: "",
  title: "请选择图标",
  clearable: true,
  placeholder: "请选择图标"
});

// 重新接收一下，防止打包后 clearable 报错
const valueIcon = ref(props.iconValue);

// open Dialog
const dialogVisible = ref(false);
const openDialog = () => (dialogVisible.value = true);

// 选择图标(触发更新父组件数据)
const emit = defineEmits<{
  "update:iconValue": [value: string];
}>();
const selectIcon = (item: any) => {
  dialogVisible.value = false;
  valueIcon.value = item.name;
  emit("update:iconValue", item.name);
  setTimeout(() => inputRef.value.blur(), 0);
};

// 清空图标
const inputRef = ref();
const clearIcon = () => {
  valueIcon.value = "";
  emit("update:iconValue", "");
  setTimeout(() => inputRef.value.blur(), 0);
};

// 监听搜索框值
const inputValue = ref("");
// let customIcons: { [key: string]: any } = [];
const iconsList = computed((): { [key: string]: any } => {
  let files: Record<string, any> = import.meta.glob("/src/assets/icons/*.svg");
  let result: { [key: string]: any } = {};
  for (const item in files) {
    const name = item.substring(item.lastIndexOf("/") + 1).replace(".svg", "");
    result[name] = { name: name };
  }
  if (!inputValue.value) return result;
  let result2: { [key: string]: any } = {};
  for (const key in result) {
    if (key.toLowerCase().indexOf(inputValue.value.toLowerCase()) > -1) {
      result2[key] = result[key];
    }
  }
  return result2;
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
