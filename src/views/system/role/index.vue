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
        <el-button v-auth="'roleAdd'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">添加</el-button>
        <el-button
          v-auth="'roleDelete'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
        >
          批量删除
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
          <el-button type="primary" :icon="Operation" @click="setRole(scope.row)" title="设置权限" />
          <el-button type="primary" :icon="Delete" @click="deleteAccount(scope.row)" title="删除" />
        </el-button-group>
      </template>
    </ProTable>
    <DetailDrawer ref="drawerRef" />

    <el-dialog v-model="showSetRoleDialog" title="设置权限" width="30%">
      <el-tree-select
        ref="treeRef"
        multiple
        node-key="id"
        collapse-tags
        v-model="menuTreeValue"
        :data="menuTreeData"
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

<script setup lang="tsx" name="role">
import { ref, reactive } from "vue";
import { Role } from "@/api/interface/system/role";
import { Dept } from "@/api/interface/system/dept";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage, ElTree } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import DetailDrawer from "./components/DetailDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View, Operation } from "@element-plus/icons-vue";
import { getUserDepartment } from "@/api/modules/user";
import { getRoleList, saveRole, removeRole, savePermisson } from "@/api/modules/system/role";
import deptApi from "@/api/modules/system/dept";
import menuApi from "@/api/modules/system/menu";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getRoleList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）

// 表格配置项
const columns = reactive<ColumnProps<Role.ResRoleList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "name",
    label: "名称",
    search: { el: "input" }
  },
  { prop: "code", label: "编码", search: { el: "input" } },
  {
    prop: "deptid",
    label: "部门",
    enum: getUserDepartment,
    fieldNames: { label: "simplename", value: "id" }
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 180
  },
  { prop: "operation", label: "操作", fixed: "right" }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async (params: Role.ResRoleList) => {
  await useHandleData(removeRole, { id: [params.id] }, `删除【${params.name}】`);
  proTable.value?.getTableList();
};

// 批量删除角色信息
const batchDelete = async (id: string[]) => {
  await useHandleData(removeRole, { id }, "删除所选信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

let showSetRoleDialog = ref<boolean>(false);
let roleTreeProps = {
  value: "id",
  label: "name",
  children: "children"
};
let currentUserId = ref();
let menuTreeData = ref();
let menuTreeValue = ref();

//设置密码
const setRole = async (params: Role.ResRoleList) => {
  currentUserId.value = params.id;
  const result = await menuApi.menuTreeListByRoleId(params.id);
  menuTreeData.value = result.data.treeData;
  menuTreeValue.value = result.data.checkedIds;
  showSetRoleDialog.value = true;
};

const treeRef = ref<InstanceType<typeof ElTree>>();
const submitSetRole = async () => {
  showSetRoleDialog.value = false;
  let permissions: string = "";
  //menuTreeValue 方法只能获取选中的叶子节点
  // menuTreeValue.value.forEach(element => {
  //   permissions += element + ",";
  // });
  //getCheckedNodes 可以获取叶子节点以及父节点的数据
  const checkedNodes = treeRef.value!.getCheckedNodes();
  checkedNodes.forEach(element => {
    permissions += element.id + ",";
  });
  const params = {
    roleId: currentUserId.value,
    permissions: permissions
  };
  await savePermisson(params);
  proTable.value?.getTableList();
};

let deptList: Dept.ResDeptList[];
const getAllDepts = async () => {
  const res = await deptApi.getList();
  deptList = res.data;
};

getAllDepts();
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof DetailDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Role.ResRoleList> = {}) => {
  console.log("depts2", deptList);
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    deptList: deptList,
    api: saveRole,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
