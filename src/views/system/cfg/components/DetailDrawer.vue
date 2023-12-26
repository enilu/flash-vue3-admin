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
      <el-form-item label="参数名" prop="cfgName">
        <el-input v-model="drawerProps.row!.cfgName" placeholder="请填写参数名" clearable></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="cfgValue">
        <el-input type="textarea" :rows="4" v-model="drawerProps.row!.cfgValue" placeholder="请填写参数值" clearable></el-input>
      </el-form-item>
      <el-form-item label="参数备注">
        <el-input type="textarea" :rows="4" v-model="drawerProps.row!.cfgDesc" placeholder="请填写参数备注" clearable></el-input>
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
import { Cfg } from "@/api/interface/system/cfg";

const rules = reactive({
  cfgName: [{ required: true, message: "请填写参数名" }],
  cfgValue: [{ required: true, message: "请填写参数值" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Cfg.ResCfgList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
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
    ElMessage.success({ message: `${drawerProps.value.title}任务成功！` });
    drawerProps.value.getTableList!();
    drawerVisible.value = false;
  });
};

defineExpose({
  acceptParams
});
</script>
