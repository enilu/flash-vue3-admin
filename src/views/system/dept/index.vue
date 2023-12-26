<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      :pagination="false"
      @darg-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-auth="'deptAdd'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">添加</el-button>
        <el-button
          v-auth="'deptDelete'"
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="handleBatchDelete(scope.selectedListIds)"
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
          <el-button type="primary" :icon="View" @click="openDrawer('查看', scope.row)" title="查看" v-auth="'deptAdd'" />
          <el-button type="primary" :icon="EditPen" @click="openDrawer('编辑', scope.row)" title="编辑" v-auth="'deptEdit'" />
          <el-button type="primary" :icon="Delete" @click="handleDelete(scope.row)" title="删除" v-auth="'deptDelete'" />
        </el-button-group>
      </template>
    </ProTable>
    <DetailDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="dept">
import { ref, reactive } from "vue";
import { Dept } from "@/api/interface/system/dept";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import DetailDrawer from "./components/DetailDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import deptApi from "@/api/modules/system/dept";

const proTable = ref<ProTableInstance>();

const initParam = reactive({});
let deptList = reactive([]);
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  console.log("params", newParams);
  return deptApi.getList(newParams);
};

const dataCallback = (data: any) => {
  deptList = data;
  return data;
};

// 表格配置项
const columns = reactive<ColumnProps<Dept.ResDeptList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "simplename",
    label: "简称"
  },
  {
    prop: "fullname",
    label: "全称"
  },
  {
    prop: "num",
    label: "顺序"
  },
  { prop: "operation", label: "操作", fixed: "right", width: 180 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除记录
const handleDelete = async (params: Dept.ResDeptList) => {
  await useHandleData(deptApi.remove, { id: [params.id] }, `删除【${params.simplename}】`);
  proTable.value?.getTableList();
};

// 批量删除记录
const handleBatchDelete = async (id: string[]) => {
  await useHandleData(deptApi.remove, { id }, "删除所选信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof DetailDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Dept.ResDeptList> = {}) => {
  console.log("deptList", deptList);
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: deptApi.save,
    deptList: deptList,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
