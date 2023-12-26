<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}任务`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="父部门">
        <el-tree-select
          v-model="drawerProps.row!.pid"
          :data="drawerProps.deptList"
          :props="treeProps"
          :check-strictly="true"
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="简称" prop="simplename">
        <el-input v-model="drawerProps.row!.simplename" placeholder="请填写简称" clearable></el-input>
      </el-form-item>
      <el-form-item label="全称" prop="fullname">
        <el-input v-model="drawerProps.row!.fullname" placeholder="请填写全称" clearable></el-input>
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
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Dept } from "@/api/interface/system/dept";

const rules = reactive({
  simplename: [{ required: true, message: "请填写简称" }],
  fullname: [{ required: true, message: "请填写参全称" }]
});

let treeProps = {
  value: "id",
  label: "simplename",
  children: "children"
};
interface DrawerProps {
  title: string;
  isView: boolean;
  deptList: Partial<Dept.ResDeptList>[];
  row: Partial<Dept.ResDeptList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  deptList: [],
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
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
