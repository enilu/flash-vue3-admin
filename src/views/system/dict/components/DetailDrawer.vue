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
      <el-form-item v-for="(rec, index) in detailList" :label="'字典' + (index + 1)" :key="rec.key">
        <el-col :span="9">
          <el-input v-model="rec.key" placeholder="值"></el-input>
        </el-col>
        <el-col class="line" :span="1">&nbsp; </el-col>
        <el-col :span="9">
          <el-input v-model="rec.value" placeholder="名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="removeDetail(index)" type="danger" icon="el-icon-delete">删除</el-button>
        </el-col>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
      <el-button v-show="!drawerProps.isView" type="success" @click="addDetail">新增字典</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="detailDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Dict } from "@/api/interface/system/dict";
import { KvNode } from "@/api/interface/index";

const rules = reactive({
  name: [{ required: true, message: "请填写名称" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Dict.ResDict>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

let detailList: KvNode[];
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  detailList = reactive([]);
  const detail = params.row.detail;
  if (detail) {
    detail.split(",").forEach(element => {
      const item = element.split(":");
      detailList.push({ key: item[0], value: item[1] });
    });
  }
  drawerProps.value = params;
  drawerVisible.value = true;
};

const removeDetail = (index: number) => {
  detailList.splice(index, 1);
};
const addDetail = () => {
  detailList.push({ key: "", value: "" });
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    let detail: string = "";
    detailList.forEach((element: KvNode) => {
      detail += element.key + ":" + element.value + ";";
    });
    let formData = drawerProps.value.row;
    formData.detail = detail;
    await drawerProps.value.api!(formData);
    ElMessage.success({ message: `${drawerProps.value.title}字典成功！` });
    drawerProps.value.getTableList!();
    drawerVisible.value = false;
  });
};

defineExpose({
  acceptParams
});
</script>
