<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}菜单`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="访问地址" prop="url">
        <el-input v-model="drawerProps.row!.url" placeholder="请填写访问地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-switch
          v-model="isMenu"
          @change="changeType"
          inline-prompt
          active-text="菜单"
          inactive-text="按钮"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label="是否隐藏" prop="url" v-if="drawerProps.row!.ismenu == 1">
        <el-switch
          v-model="drawerProps.row!.hidden"
          inline-prompt
          active-text="是"
          inactive-text="否"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label="编号" prop="code">
        <el-input v-model="drawerProps.row!.code" placeholder="请填写编号" clearable></el-input>
      </el-form-item>

      <el-form-item label="父菜单">
        <el-tree-select
          v-model="drawerProps.row!.pcode"
          :data="drawerProps.menuList"
          :props="treeProps"
          :check-strictly="true"
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="组件" prop="component" v-if="drawerProps.row!.ismenu == 1">
        <el-input v-model="drawerProps.row!.component" placeholder="请填写组件" clearable @focus="showToolTip"></el-input>
      </el-form-item>
      <el-form-item label="图标" v-if="drawerProps.row!.ismenu == 1">
        <SelectIconFlash v-model:icon-value="drawerProps.row!.icon" />
      </el-form-item>

      <el-form-item label="顺序">
        <el-input type="number" v-model="drawerProps.row!.num" placeholder="请填写顺序" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="detailDrawer">
import { ref, reactive, computed } from "vue";
import { ElMessage, ElNotification, FormInstance } from "element-plus";
import { Menu } from "@/api/interface/system/menu";
import SelectIconFlash from "@/components/SelectIconFlash/index.vue";

const rules = reactive({
  name: [{ required: true, message: "请填写名称" }],
  url: [{ required: true, message: "请填写访问地址" }],
  code: [{ required: true, message: "请填写编码" }],
  num: [{ required: true, message: "请填写顺序" }]
});

let treeProps = {
  value: "code",
  label: "name",
  children: "children"
};
interface DrawerProps {
  title: string;
  isView: boolean;
  menuList: Partial<Menu.ResMenu>[];
  row: Partial<Menu.ResMenu>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  menuList: [],
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  params.row.pcode = params.row.pcode == "0" ? "" : params.row.pcode;
  drawerProps.value = params;
  if (params.row.ismenu == undefined) {
    drawerProps.value.row.ismenu = 1;
  }
  drawerVisible.value = true;
};
const isMenu = computed(() => {
  console.log("isMenu", drawerProps.value.row.ismenu);
  return drawerProps.value.row.ismenu == 1;
});

const changeType = (params: any) => {
  console.log("p", params);
  drawerProps.value.row.ismenu = params ? 1 : 0;
};

const showToolTip = () => {
  ElNotification({
    dangerouslyUseHTMLString: true,
    message: "顶级目录请输入layout,<br/>左侧菜单请根据实际组件路径输入:views/...<br/>功能按钮无需输入该值"
  });
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    await drawerProps.value.api!(drawerProps.value.row);
    ElMessage.success({ message: `${drawerProps.value.title}成功！` });
    drawerProps.value.getTableList!();
    drawerVisible.value = false;
  });
};

defineExpose({
  acceptParams
});
</script>

<style scoped lang="scss">
.el-notification {
  z-idnex: 5000 !important;
}
</style>
