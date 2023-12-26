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
        <el-input v-model="drawerProps.row!.name" placeholder="请填写名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="发送类" prop="className">
        <el-input type="textarea" :rows="4" v-model="drawerProps.row!.className" placeholder="请填写发送类" clearable></el-input>
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
import { Sender } from "@/api/interface/message/sender";

const rules = reactive({
  name: [{ required: true, message: "请填写名称" }],
  className: [{ required: true, message: "请填写发送类" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Sender.ResSender>;
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
    ElMessage.success({ message: `${drawerProps.value.title}消息发送者成功！` });
    drawerProps.value.getTableList!();
    drawerVisible.value = false;
  });
};

defineExpose({
  acceptParams
});
</script>
