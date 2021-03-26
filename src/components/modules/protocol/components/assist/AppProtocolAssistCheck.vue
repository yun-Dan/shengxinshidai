<template>
  <div class="app-protocol-assist-check">
    <el-card class="card-box">
      <div class="content-wrap">
        <AppProtocolAssistContent></AppProtocolAssistContent>
      </div>
    </el-card>
  </div>
</template>

<script>
import AppProtocolAssistContent from "./AppProtocolAssistContent";
export default {
  name: "app-protocol-assist-check",
  components: {
    AppProtocolAssistContent
  }
};
</script>

<style scoped>
.content-wrap {
  width: 900px;
  margin: 20px auto;
}
</style>
