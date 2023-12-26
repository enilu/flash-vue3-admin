<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}角色`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="部门" prop="deptid">
        <el-tree-select
          v-model="drawerProps.row!.deptid"
          :data="drawerProps.deptList"
          :props="treeProps"
          :check-strictly="true"
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="drawerProps.row!.code" placeholder="请填写角色编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="num">
        <el-input type="number" v-model="drawerProps.row!.num" placeholder="请填写排序" clearable></el-input>
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
import { Role } from "@/api/interface/system/role";
import { Dept } from "@/api/interface/system/dept";

const rules = reactive({
  name: [{ required: true, message: "请填写名称" }],
  code: [{ required: true, message: "请填写编码" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Role.ResRoleList>;
  deptList: Partial<Dept.ResDeptList>[];
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
let treeProps = {
  value: "id",
  label: "simplename",
  children: "children"
};
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
    console.log("post user", drawerProps.value.row);
    await drawerProps.value.api!(drawerProps.value.row);
    ElMessage.success({ message: `${drawerProps.value.title}角色成功！` });
    drawerProps.value.getTableList!();
    drawerVisible.value = false;
  });
};

defineExpose({
  acceptParams
});
</script>
