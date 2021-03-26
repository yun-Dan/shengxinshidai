<template>
  <div class="app-protocol-entrust-check">
    <el-card class="card-box">
      <div class="content-wrap">
        <AppProtocolEntrustContent></AppProtocolEntrustContent>
      </div>
    </el-card>
  </div>
</template>
<script>
import AppProtocolEntrustContent from "./AppProtocolEntrustContent";
export default {
  name: "app-protocol-entrust-check",
  components: {
    AppProtocolEntrustContent
  }
};
</script>

<style scoped>
.content-wrap {
  width: 900px;
  margin: 20px auto;
}
</style>
