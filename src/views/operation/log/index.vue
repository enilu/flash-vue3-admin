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
        <el-button v-auth="'logClear'" type="danger" :icon="Delete" @click="handleClearLog(scope)">清除日志</el-button>
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button-group>
          <el-button type="primary" :icon="View" @click="showDetail(scope.row)" title="查看" />
        </el-button-group>
      </template>
    </ProTable>

    <el-dialog v-model="showDetailDialog" title="日志详情" width="50%">
      <el-form :model="selRecord" label-width="120px">
        <el-form-item label="类 名">
          <div>{{ selRecord.classname }}</div>
        </el-form-item>
        <el-form-item label="方法名">
          <div>{{ selRecord.method }}</div>
        </el-form-item>
        <el-form-item label="日志详情">
          <div>{{ selRecord.message }}</div>
        </el-form-item>
        <el-form-item label="日期">
          <div>{{ selRecord.createTime }}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDetailDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="log">
import { ref, reactive } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete, View } from "@element-plus/icons-vue";
import { getLogList, clearLog } from "@/api/modules/operation/log";
import { Log } from "@/api/interface/operation/log";

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
  return getLogList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）

// 表格配置项
const columns = reactive<ColumnProps<Log.ResLogList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "userName",
    label: "用户"
  },
  { prop: "logtype", label: "类别", search: { el: "input" } },
  {
    prop: "logname",
    label: "内容",
    search: { el: "input" }
  },
  {
    prop: "createTime",
    label: "时间",
    width: 180
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 批量删除角色信息
const handleClearLog = async (row: any) => {
  console.log(row);
  await useHandleData(clearLog, null, "清除所有日志");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};
let selRecord = ref();
let showDetailDialog = ref<boolean>(false);
const showDetail = async (params: Log.ResLogList) => {
  selRecord.value = params;
  showDetailDialog.value = true;
};
</script>
