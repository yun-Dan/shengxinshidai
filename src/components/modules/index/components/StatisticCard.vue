<template>
  <div class="statistic-card-box">
    <el-card shadow="hover" :body-style="{padding: '0px'}" v-cloak>
      <div class="grid-content" :style="{'backgroundColor': isYXB ? '' : ''}">
        <i
          class="fa grid-con-icon"
          :class="propData.icon"
          :style="{'backgroundColor': isYXB ? '#fff' : propData.color, 'color': isYXB ? propData.color : '#fff', boxShadow: '2px 2px 100px 20px'}"
        ></i>
        <div class="grid-cont-right">
          <div class="grid-num" :style="{'color': propData.color}">{{ propData.num}}</div>
          <div :style="{'color': isYXB ? propData.color : ''}">{{ propData.title }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "statistic-card",
  data () {
    return {
      isYXB: false
    }
  },
  props: ["propData"],
  created () {
    this.isYXB = this.isYXBPublic()
  }
};
</script>

<style scoped>
.grid-content {
  display: flex;
  align-items: center;
  height: 80px;
}
.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}
.grid-num {
  font-size: 24px;
  font-weight: bold;
}
.grid-con-icon {
  font-size: 40px;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  color: #fff;
}
</style>
