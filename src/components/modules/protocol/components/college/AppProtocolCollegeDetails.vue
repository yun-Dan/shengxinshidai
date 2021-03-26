<template>
  <div class="app-protocol-college-details">
    <el-card class="card-box">
      <div class="bg-img">
        <div class="content-wrap">
          <AppProtocolCollegeContent></AppProtocolCollegeContent>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import AppProtocolCollegeContent from "./AppProtocolCollegeContent";
export default {
  name: "app-protocol-college-details",
  components: {
    AppProtocolCollegeContent
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
