<template>
  <div class="app-protocol-college-check">
    <el-card class="card-box">
      <div class="content-wrap">
        <AppProtocolCollegeContent></AppProtocolCollegeContent>
      </div>
    </el-card>
  </div>
</template>
<script>
import AppProtocolCollegeContent from "./AppProtocolCollegeContent";
export default {
  name: "app-protocol-college-check",
  components: {
    AppProtocolCollegeContent
  }
};
</script>

<style scoped>
.content-wrap {
  width: 900px;
  margin: 20px auto;
}
</style>
