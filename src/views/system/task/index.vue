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
        <el-button v-auth="'taskAdd'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">添加</el-button>
        <el-button
          v-auth="'taskDelete'"
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
          <el-button type="primary" :icon="View" @click="openDrawer('查看', scope.row)" title="查看" v-auth="'taskAdd'" />
          <el-button type="primary" :icon="EditPen" @click="openDrawer('编辑', scope.row)" title="编辑" v-auth="'taskEdit'" />
          <el-button type="primary" :icon="Delete" @click="deleteAccount(scope.row)" title="删除" v-auth="'taskDelete'" />
        </el-button-group>
      </template>
    </ProTable>
    <DetailDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="task">
import { ref, reactive } from "vue";
import { Task } from "@/api/interface/system/task";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import DetailDrawer from "./components/DetailDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import taskApi from "@/api/modules/system/task";

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

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
  return taskApi.getTaskList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）

// 表格配置项
const columns = reactive<ColumnProps<Task.ResTaskList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "name",
    label: "名称",
    search: { el: "input" }
  },

  {
    prop: "cron",
    label: "定时规则",
    width: 180
  },
  {
    prop: "note",
    label: "说明"
  },
  {
    prop: "execAt",
    label: "最近执行时间",
    width: 180
  },
  {
    prop: "execResult",
    label: "最近执行结果",
    width: 180
  },
  {
    prop: "disabled",
    label: "状态",
    enum: [
      { label: "启用", value: false },
      { label: "禁用", value: true }
    ],
    search: { el: "select", props: { filterable: true } },
    render: scope => {
      return <el-switch model-value={!scope.row.disabled} link onClick={() => changeStatus(scope.row)} />;
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 180 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async (params: Task.ResTaskList) => {
  await useHandleData(taskApi.removeTask, { id: [params.id] }, `删除【${params.name}】`);
  proTable.value?.getTableList();
};

// 批量删除角色信息
const batchDelete = async (id: string[]) => {
  await useHandleData(taskApi.removeTask, { id }, "删除所选信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

//启用定时任务
//启用/禁用定时任务
const changeStatus = async (params: Task.ResTaskList) => {
  console.log("pa", params);
  const disabled = params.disabled;
  await useHandleData(
    disabled ? taskApi.enableTask : taskApi.disableTask,
    { id: params.id },
    disabled ? "启用定时任务" : "禁用定时任务"
  );
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof DetailDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Task.ResTaskList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: taskApi.saveTask,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
