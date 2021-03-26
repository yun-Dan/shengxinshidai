<template>
  <div style="margin-top: -20px;height:100%;" class="error-server">
    <div style="width: 400px;margin: 0 auto;padding-top: 100px">
      <el-card shadow="always">
        <p style="font-weight: bold">
          {{ errorContent }}
          <span style="font-weight: normal;color: #e6a23c">{{ totalTime }}s后返回</span>
        </p>
        <p style="text-align: center">请联系系统维护人员</p>
        <p style="text-align: center">
          <el-button type="primary" round @click="$router.go(-1)" size="small">返 回</el-button>
        </p>
      </el-card>
    </div>
  </div>
</template>

<script>
import error00 from "@/assets/images/error00.jpg";

export default {
  name: "page404",
  data() {
    return {
      error00,
      errorContent: "",
      totalTime: 10,
      clock: 0
    };
  },
  computed: {
    message() {
      return "这个页面不存在......";
    }
  },
  methods: {
    countDown() {
      this.clock = window.setInterval(() => {
        if (this.totalTime > 1) {
          this.totalTime--;
        } else {
          this.$router.go(-1);
        }
      }, 1000);
    }
  },
  beforeMount() {
    this.errorContent = sessionStorage.getItem("error_server");
    this.countDown();
  },
  beforeDestroy() {
    window.clearInterval(this.clock);
    sessionStorage.removeItem("error_server");
  }
};
</script>

<style scoped>
.error-server {
  background: url("../../assets/images/error00.jpg") no-repeat center;
  background-size: cover;
}
</style>
