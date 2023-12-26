<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}任务`">
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="编号" prop="code">
        <el-input v-model="drawerProps.row!.code" placeholder="请填写编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="drawerProps.row!.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="消息类型">
        <el-radio-group v-model="drawerProps.row!.type">
          <el-radio v-for="item in drawerProps.typeList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发送器">
        <el-select v-model="drawerProps.row!.idMessageSender" placeholder="请选择发送器" clearable>
          <el-option v-for="item in drawerProps.senderList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="远程模板编号">
        <el-input v-model="drawerProps.row!.remoteTplCode" clearable></el-input>
      </el-form-item>
      <el-form-item label="模板内容">
        <el-input type="textarea" :rows="4" v-model="drawerProps.row!.content" clearable></el-input>
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
import { MessageTemplate } from "@/api/interface/message/template";
import { Sender } from "@/api/interface/message/sender";
import { SelNode } from "@/api/interface";
const rules = reactive({
  cfgName: [{ required: true, message: "请填写参数名" }],
  cfgValue: [{ required: true, message: "请填写参数值" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  typeList: SelNode[];
  senderList: Sender.ResSender[];
  row: Partial<MessageTemplate.ResTemplate>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  typeList: [],
  senderList: [],
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    await drawerProps.value.api!(drawerProps.value.row);
    ElMessage.success({ message: `${drawerProps.value.title}模板成功！` });
    drawerProps.value.getTableList!();
    drawerVisible.value = false;
  });
};

defineExpose({
  acceptParams
});
</script>
