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
        <el-button v-auth="'msgTplEdit'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">添加</el-button>
        <el-button
          v-auth="'msgTplDelete'"
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
          <el-button type="primary" :icon="View" @click="openDrawer('查看', scope.row)" title="查看" v-auth="'msgTplEdit'" />
          <el-button type="primary" :icon="EditPen" @click="openDrawer('编辑', scope.row)" title="编辑" v-auth="'msgTplEdit'" />
          <el-button type="primary" :icon="Delete" @click="handleDelete(scope.row)" title="删除" v-auth="'msgTplDelete'" />
        </el-button-group>
      </template>
    </ProTable>
    <DetailDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="msgTpl">
import { ref, reactive } from "vue";
import { MessageTemplate } from "@/api/interface/message/template";
import { Sender } from "@/api/interface/message/sender";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import DetailDrawer from "./components/DetailDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import templateApi from "@/api/modules/message/template";
import senderApi from "@/api/modules/message/sender";
import dictApi from "@/api/modules/system/dict";
import { SelNode } from "@/api/interface/index";

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
  return templateApi.getList(newParams);
};
let typeList: SelNode[];
const getTypeList = async () => {
  const { data } = await dictApi.getDicts("消息类型");
  typeList = data;
};
getTypeList();

// 表格配置项
const columns = reactive<ColumnProps<MessageTemplate.ResTemplate>[]>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "code",
    label: "编号"
  },

  {
    prop: "title",
    label: "标题",
    search: { el: "input" }
  },
  {
    prop: "type",
    label: "类型",
    enum: dictApi.getMsgTypeDicts
  },
  {
    prop: "idMessageSender",
    label: "消息发送器",
    enum: () => senderApi.queryAll(),
    search: { el: "select" },
    fieldNames: { label: "name", value: "id" }
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
const handleDelete = async (params: MessageTemplate.ResTemplate) => {
  await useHandleData(templateApi.remove, { id: [params.id] }, `删除【${params.title}】`);
  proTable.value?.getTableList();
};

// 批量删除记录
const handleBatchDelete = async (id: string[]) => {
  await useHandleData(templateApi.remove, { id }, "删除所选信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)

const drawerRef = ref<InstanceType<typeof DetailDrawer> | null>(null);
let senderList: Sender.ResSender[];
const getAllSender = async () => {
  const res = await senderApi.queryAll();
  senderList = res.data;
};

getAllSender();
const openDrawer = (title: string, row: Partial<MessageTemplate.ResTemplate> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    typeList: typeList,
    senderList: senderList,
    api: templateApi.save,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
