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
      <el-form-item label="名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="定时规则" prop="cron">
        <el-input v-model="drawerProps.row!.cron" placeholder="请填写定时规则" clearable></el-input>
      </el-form-item>
      <el-form-item label="执行类" prop="jobClass">
        <el-input type="textarea" v-model="drawerProps.row!.jobClass" placeholder="请填写执行类" clearable></el-input>
      </el-form-item>
      <el-form-item label="执行参数">
        <el-input type="textarea" :rows="4" v-model="drawerProps.row!.data" placeholder="请填写任务参数" clearable></el-input>
      </el-form-item>
      <el-form-item label="任务说明">
        <el-input type="textarea" :rows="4" v-model="drawerProps.row!.note" placeholder="请填写说明" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Task } from "@/api/interface/system/task";

const rules = reactive({
  name: [{ required: true, message: "请填写名称" }],
  cron: [{ required: true, message: "请填定时规则" }],
  jobClass: [{ required: true, message: "请填写执行类" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Task.ResTaskList>;
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
