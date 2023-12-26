<template>
  <div class="dashboad-container">
    <el-row>
      <el-col :span="6">
        <div class="box-card">
          <div class="box-icon">
            <SvgIcon name="system" style="width: 50px; height: 50px" />
          </div>
          <div class="box-title">
            <div>在线文档</div>
            <div>Document</div>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="box-card">
          <div class="box-icon">
            <SvgIcon name="user" style="width: 50px; height: 50px" />
          </div>
          <div class="box-title">
            <div>新增用户</div>
            <div>102,400</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box-card">
          <div class="box-icon">
            <SvgIcon name="message" style="width: 50px; height: 50px" />
          </div>
          <div class="box-title">
            <div>未处理消息</div>
            <div>5</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box-card">
          <div class="box-icon">
            <SvgIcon name="money" style="width: 50px; height: 50px" />
          </div>
          <div class="box-title">
            <div>收入</div>
            <div>10000</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>
          <div class="card content-box" style="margin: 4px 8px">
            <ECharts :option="option" style="height: 300px" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="card content-box" style="margin: 4px 4px 8px 8px">
          <ECharts :option="option" style="height: 300px" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card content-box" style="margin: 4px 8px 8px 4px">
          <ECharts :option="option" style="height: 300px" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="home">
import SvgIcon from "@/components/SvgIcon/index.vue";
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";

const option: ECOption = {
  title: {
    text: "堆叠图",
    textStyle: {
      color: "#a1a1a1"
    }
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985"
      }
    }
  },
  legend: {
    data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
    textStyle: {
      color: "#a1a1a1"
    }
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLabel: {
        color: "#a1a1a1"
      }
    }
  ],
  yAxis: [
    {
      type: "value",
      axisLabel: {
        color: "#a1a1a1"
      }
    }
  ],
  series: [
    {
      name: "Email",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: "Union Ads",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: "Video Ads",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: "Direct",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: "Search Engine",
      type: "line",
      stack: "Total",
      label: {
        show: true,
        position: "top"
      },
      areaStyle: {},
      emphasis: {
        focus: "series"
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
};
</script>

<style scoped lang="scss">
@import "./index.scss";
.box-card {
  display: flex;
  justify-content: flex-start;
  height: 108px;
  padding: 8px;
  margin: 8px;
  background-color: #ffffff;
  .box-icon {
    margin: 30px;
  }
  .box-title {
    margin: 30px 30px 30px 20px;
  }
}
</style>
