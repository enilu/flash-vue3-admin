<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      :pagination="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-auth="'menuAdd'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">添加</el-button>
        <el-button
          v-auth="'menuDelete'"
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
          <el-button type="primary" :icon="View" @click="openDrawer('查看', scope.row)" title="查看" v-auth="'menuAdd'" />
          <el-button type="primary" :icon="EditPen" @click="openDrawer('编辑', scope.row)" title="编辑" v-auth="'menuEdit'" />
          <el-button type="primary" :icon="Delete" @click="handleDelete(scope.row)" title="删除" v-auth="'menuDelete'" />
        </el-button-group>
      </template>
    </ProTable>
    <DetailDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="menu">
import { ref, reactive } from "vue";
import { Menu } from "@/api/interface/system/menu";
import { useHandleData } from "@/hooks/useHandleData";
import ProTable from "@/components/ProTable/index.vue";
import DetailDrawer from "./components/DetailDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import menuApi from "@/api/modules/system/menu";

const proTable = ref<ProTableInstance>();

const initParam = reactive({});
let menuList = reactive([]);
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  console.log("params", newParams);
  return menuApi.getList(newParams);
};

const dataCallback = (data: any) => {
  menuList = data;
  return data;
};

// 表格配置项
const columns = reactive<ColumnProps<Menu.ResMenu>[]>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "name",
    label: "名称"
  },
  {
    prop: "code",
    label: "编码"
  },
  {
    prop: "icon",
    label: "图标",
    render: scope => {
      return <SvgIcon name={scope.row.icon} />;
    }
  },
  { prop: "component", label: "组件" },
  {
    prop: "ismenu",
    label: "类型",
    render: scope => {
      return <span>{scope.row.ismenu == 1 ? "菜单" : "按钮"}</span>;
    }
  },

  { prop: "url", label: "URL" },
  {
    prop: "hidden",
    label: "是否隐藏",
    render: scope => {
      return <span>{scope.row.hidden == true ? "是" : "否"}</span>;
    }
  },
  {
    prop: "num",
    label: "顺序"
  },
  { prop: "operation", label: "操作", fixed: "right", width: 180 }
]);

// 删除记录
const handleDelete = async (params: Menu.ResMenu) => {
  await useHandleData(menuApi.remove, { id: [params.id] }, `删除【${params.name}】`);
  proTable.value?.getTableList();
};

// 批量删除记录
const handleBatchDelete = async (id: string[]) => {
  await useHandleData(menuApi.remove, { id }, "删除所选信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof DetailDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Menu.ResMenu> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: menuApi.save,
    menuList: menuList,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
