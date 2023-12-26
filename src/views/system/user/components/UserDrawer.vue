<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
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
          :check-strictly="true"
          :props="treeProps"
          :render-after-expand="false"
        />
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model="drawerProps.row!.account" placeholder="请填写账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写用户姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="drawerProps.row!.sex" placeholder="请选择性别" clearable>
          <el-option v-for="item in genderType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="drawerProps.row!.phone" placeholder="请填写手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请填写邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday" style="width: 100%">
        <div style="width: 100%">
          <el-date-picker
            style="width: 100%"
            v-model="drawerProps.row!.birthday"
            type="date"
            placeholder="请选择生日"
            clearable
          />
        </div>
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
import { genderType } from "@/utils/dict";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface/system/user";
import { Dept } from "@/api/interface/system/dept";

const rules = reactive({
  account: [{ required: true, message: "请填写账号" }],
  name: [{ required: true, message: "请填写用户姓名" }],
  sex: [{ required: true, message: "请选择性别" }],
  phone: [{ required: true, message: "请填写手机号" }],
  email: [{ required: true, message: "请填写邮箱" }],
  birthday: [{ required: true, message: "请选择生日" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResUserList>;
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
    try {
      console.log("post user", drawerProps.value.row);
      const result = await drawerProps.value.api!(drawerProps.value.row);
      if (result.data) {
        ElMessage.success({ message: `新增账号成功,账号密码：${result.data}`, showClose: true });
      } else {
        ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
      }
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
