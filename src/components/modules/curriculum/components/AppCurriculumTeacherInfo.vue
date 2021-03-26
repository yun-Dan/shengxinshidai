<template>
  <div class="app-curriculum-teacher-info clearfix" v-loading="loading">
    <div class="fr">
      <el-button type="primary" @click="$router.go(-1)">返 回</el-button>
    </div>
    <el-form :inline="true">
      <el-form-item label="教师姓名：">
        <div class="curriculum-teacher-info-value">{{ infoData.name }}</div>
      </el-form-item>
      <el-form-item label="单位名称：">
        <div class="curriculum-teacher-info-value">{{ infoData.unit }}</div>
      </el-form-item>
      <el-form-item label="职称：">
        <div class="curriculum-teacher-info-value">{{ infoData.job }}</div>
      </el-form-item>
      <el-form-item label="教师类型：">
        <div class="curriculum-teacher-info-value">
          <el-tag v-if="infoData.is_inschool===1" type="success" size="mini">校内</el-tag>
          <el-tag v-if="infoData.is_inschool===2" type="primary" size="mini">校外</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="职工号/身份证号：">
        <div class="curriculum-teacher-info-value">{{ infoData.idnumber }}</div>
      </el-form-item>
      <el-form-item label="黑名单：">
        <div class="curriculum-teacher-info-value">
          <el-tag v-if="infoData.is_black===1" type="info" size="mini">否</el-tag>
          <el-tag v-if="infoData.is_black===2" type="danger" size="mini">黑名单</el-tag>
        </div>
      </el-form-item>
    </el-form>
    <p>参与项目及课程：{{ infoData.pro_num ? '' : '（无）' }}</p>
    <div style="padding-left: 20px">
      <el-form label-position="top">
        <el-form-item
          v-for="(item, index) in infoData.pro_num_cont"
          :key="index"
          :label="`${index+1}、${item}：`"
        >
          <div style="padding-left: 40px">{{ infoData.cou_num_cont[index] }}</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-curriculum-teacher-info",
  data() {
    return {
      loading: false,
      infoData: {}
    };
  },
  methods: {
    initData() {
      this.loading = true;
      if (this.loading) {
        this.infoData = JSON.parse(JSON.stringify(this.$route.query));
        this.loading = false;
      }
    }
  },
  created() {
    this.initData();
  }
};
</script>

<style scoped>
.app-curriculum-teacher-info {
  padding: 30px;
  max-width: 1200px;
}
.curriculum-teacher-info-value {
  padding-right: 24px;
}
</style>
