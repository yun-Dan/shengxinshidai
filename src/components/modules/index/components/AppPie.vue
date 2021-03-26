<template>
  <el-card v-cloak>
    <div slot="header">
      <span>
        <i class="fa fa-pie-chart"></i> 系统管理划分
      </span>
    </div>
    <ve-pie :data="chartData"></ve-pie>
  </el-card>
</template>

<script>
import VePie from "v-charts/lib/pie.common";
export default {
  name: "app-pie",
  data() {
    return {
      chartData: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "1/1", 访问用户: 1393 },
          { 日期: "1/2", 访问用户: 3530 },
          { 日期: "1/3", 访问用户: 2923 },
          { 日期: "1/4", 访问用户: 1723 },
          { 日期: "1/5", 访问用户: 3792 },
          { 日期: "1/6", 访问用户: 4593 }
        ]
      }
    };
  },
  components: {
    VePie
  }
};
</script>
