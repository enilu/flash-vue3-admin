<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-auth="'mgrAdd'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除用户
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button-group>
          <el-button type="primary" :icon="View" @click="openDrawer('查看', scope.row)" title="查看" />
          <el-button type="primary" :icon="EditPen" @click="openDrawer('编辑', scope.row)" title="编辑" />
          <el-button type="primary" :icon="Operation" @click="setRole(scope.row)" title="设置角色" />
          <el-button type="primary" :icon="Refresh" @click="resetPass(scope.row)" title="重置密码" />
          <el-button type="primary" :icon="Delete" @click="deleteAccount(scope.row)" title="删除" />
        </el-button-group>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />

    <el-dialog v-model="showSetRoleDialog" title="设置角色" width="30%">
      <el-tree-select
        multiple
        node-key="id"
        v-model="roleTreeValue"
        :data="roleTreeData"
        :render-after-expand="false"
        :props="roleTreeProps"
        show-checkbox
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSetRoleDialog = false">取消</el-button>
          <el-button type="primary" @click="submitSetRole"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="user">
import { ref, reactive } from "vue";
import { User } from "@/api/interface/system/user";
import { Dept } from "@/api/interface/system/dept";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import UserDrawer from "@/views/system/user/components/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View, Refresh, Operation } from "@element-plus/icons-vue";
import {
  getUserList,
  deleteUser,
  saveUser,
  resetUserPassWord,
  getUserStatus,
  getUserGender,
  setUserRole
} from "@/api/modules/user";

import { roleTreeListByIdUser } from "@/api/modules/system/role";
import deptApi from "@/api/modules/system/dept";

// ProTable 实例
const proTable = ref<ProTableInstance>();

const initParam = reactive({ type: 1 });

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getUserList(newParams);
};

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { prop: "account", label: "账号", search: { el: "input", tooltip: "支持模糊匹配" } },
  {
    prop: "name",
    label: "用户姓名",
    search: { el: "input", tooltip: "支持模糊匹配" },
    render: scope => {
      return (
        <el-button type="primary" link onClick={() => openDrawer("查看", scope.row)}>
          {scope.row.name}
        </el-button>
      );
    }
  },
  {
    prop: "deptid",
    label: "部门",
    enum: deptApi.getList,
    search: { el: "tree-select", props: { filterable: true, checkStrictly: true } },
    fieldNames: { label: "simplename", value: "id" }
  },
  {
    prop: "sex",
    label: "性别",
    enum: getUserGender,
    // 字典请求携带参数
    // enum: () => getUserGender({ id: 1 }),
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" }
  },
  {
    // 多级 prop
    prop: "birthday",
    label: "生日"
  },
  { prop: "email", label: "邮箱" },
  { prop: "phone", label: "手机号", search: { el: "input" } },
  {
    prop: "status",
    label: "用户状态",
    enum: getUserStatus,
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "label", value: "value" },
    render: scope => {
      return (
        <>
          <el-tag type={scope.row.status == 1 ? "success" : "danger"}>{scope.row.status == 1 ? "启用" : "禁用"}</el-tag>
        </>
      );
    }
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 180,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
      // defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.name}】用户`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 重置用户密码
const resetPass = async (params: User.ResUserList) => {
  const result: any = await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.name}】用户密码`);
  ElMessage.success({ message: `新密码为：${result.data}`, showClose: true });
  proTable.value?.getTableList();
};
let showSetRoleDialog = ref<boolean>(false);
let roleTreeProps = {
  value: "id",
  label: "name",
  children: "children"
};
let currentUserId = ref();
let roleTreeData = ref();
let roleTreeValue = ref<number[]>([]);
//设置密码
const setRole = async (params: User.ResUserList) => {
  currentUserId.value = params.id;
  const result = await roleTreeListByIdUser({ id: params.id });
  roleTreeData.value = result.data.treeData;
  roleTreeValue.value = result.data.checkedIds;
  showSetRoleDialog.value = true;
};
const submitSetRole = async () => {
  showSetRoleDialog.value = false;
  let roleIds: string = "";
  roleTreeValue.value.forEach(element => {
    roleIds += element + ",";
  });
  const params = {
    userId: currentUserId.value,
    roleIds: roleIds
  };
  await setUserRole(params);
  proTable.value?.getTableList();
};

// 批量添加用户

let deptList: Dept.ResDeptList[];
const getAllDepts = async () => {
  const res = await deptApi.getList();
  deptList = res.data;
};

getAllDepts();
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    deptList: deptList,
    api: title === "新增" ? saveUser : title === "编辑" ? saveUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
