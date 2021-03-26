<template>
  <div class="app-protocol-entrust-details">
    <el-card class="card-box">
      <div class="bg-img">
        <div class="content-wrap">
          <AppProtocolEntrustContent></AppProtocolEntrustContent>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import AppProtocolEntrustContent from "./AppProtocolEntrustContent";
export default {
  name: "app-protocol-entrust-details",
  components: {
    AppProtocolEntrustContent
  }
};
</script>

<style scoped>
.bg-img {
  background-image: url("../../../../../assets/images/01hhh.jpg");
}
.content-wrap {
  width: 694px;
  margin: 20px auto;
}
</style>
