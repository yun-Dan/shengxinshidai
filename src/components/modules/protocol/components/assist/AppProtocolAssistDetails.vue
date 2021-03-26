<template>
  <div class="app-protocol-assist-details">
    <el-card class="card-box">
      <div class="bg-img">
        <div class="content-wrap">
          <AppProtocolAssistContent></AppProtocolAssistContent>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import AppProtocolAssistContent from "./AppProtocolAssistContent";
export default {
  name: "app-protocol-assist-details",
  components: {
    AppProtocolAssistContent
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
