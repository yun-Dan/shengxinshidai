<template>
  <div class="app-error401">
    <div class="errPage-container">
      <el-row>
        <el-col :span="12">
          <h1 class="text-jumbo text-ginormous">Oops!</h1>
          <h2>你没有权限去该页面</h2>
          <h6>请联系管理员</h6>
        </el-col>
        <el-col :span="12">
          <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
        </el-col>
      </el-row>
      <el-dialog title="随便看" :visible.sync="dialogVisible">
        <img class="pan-img" :src="ewizardClap">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import errGif from "@/assets/images/401.gif";

export default {
  name: "page401",
  data() {
    return {
      errGif: errGif + "?" + +new Date(),
      ewizardClap:
        "https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646",
      dialogVisible: false
    };
  }
};
</script>

<style scoped>
.app-error401 {
  height: 100%;
  background-color: #fff;
  box-shadow: 0 400px #f2f6fc;
}
.errPage-container {
  width: 800px;
  margin: 0 auto;
  padding: 100px 0;
}
.errPage-container .pan-back-btn {
  background: #008489;
  color: #fff;
}
.errPage-container .pan-gif {
  margin: 0 auto;
  display: block;
}
.errPage-container .pan-img {
  display: block;
  margin: 0 auto;
  width: 100%;
}
.errPage-container .text-jumbo {
  font-size: 60px;
  font-weight: 700;
  color: #484848;
}
.errPage-container .list-unstyled {
  font-size: 14px;
}
.errPage-container .list-unstyled li {
  padding-bottom: 5px;
}
.errPage-container .list-unstyled a {
  color: #008489;
  text-decoration: none;
}
.errPage-container .list-unstyled a:hover {
  text-decoration: underline;
}
h6 {
  font-size: 1em;
}
.link-type {
  line-height: 2em;
}
</style>
