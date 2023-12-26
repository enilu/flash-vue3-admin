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
        <el-button v-auth="'msgClear'" type="danger" :icon="Delete" @click="handleClearLog(scope)">清除消息</el-button>
      </template>
      <template #expand="scope">
        <el-form :model="scope.row" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="模板编号">
                <div>{{ scope.row.tplCode }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接收者">
                <div>{{ scope.row.receiver }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发送日期">
                <div>{{ scope.row.createTime }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="发送结果">
                <div>{{ scope.row.state == 1 ? "成功" : "失败" }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="消息内容">
                <div>{{ scope.row.content }}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="msg">
import { ref, reactive } from "vue";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete } from "@element-plus/icons-vue";
import messageApi from "@/api/modules/message/message";
import dictApi from "@/api/modules/system/dict";
import { Message } from "@/api/interface/message/message";

// ProTable 实例
const proTable = ref<ProTableInstance>();

const initParam = reactive({});

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
  return messageApi.getLogList(newParams);
};

// 表格配置项
const columns = reactive<ColumnProps<Message.ResMessage>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "expand", label: "" },
  {
    prop: "tplCode",
    label: "模板编号",
    search: { el: "input" }
  },
  { prop: "receiver", label: "接收者" },
  {
    prop: "type",
    label: "消息类型",
    enum: () => dictApi.getDicts("消息类型"),
    search: { el: "select", props: { filterable: true } }
  },
  {
    prop: "state",
    label: "发送结果",
    enum: () => dictApi.getDicts("消息状态")
  },
  {
    prop: "createTime",
    label: "发送时间",
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" }
    }
  }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 批量删除登录日志信息
const handleClearLog = async (row: any) => {
  console.log(row);
  await useHandleData(messageApi.clearLog, null, "清除所有日志");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};
</script>
