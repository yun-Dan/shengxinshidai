<template>
  <div class="app-certificate-info">
    <el-card>
      <div slot="header" class="clearfix certificate-info-head" v-cloak>
        <h1>
          {{ showData.pro_name }}
          <span>（项目名称）</span>
        </h1>
        <h1 class="cert-name">
          {{ showData.cert_name }}
          <span>（证书名称）</span>
        </h1>
        <h1 v-if="showData.cert_name_en" class="cert-name">
          {{ showData.cert_name_en}}
          <span>（英文名称）</span>
        </h1>
      </div>
      <div style="width: 80%;margin: 0 auto">
        <div class="certificate-info-main" v-cloak>
          <div>
            <el-form label-width="160px" style="text-align: left">
              <el-form-item label="主办学院：">{{ showData.college }}</el-form-item>
              <!-- <el-form-item label="创建日期：">{{ showData.create_time | TimestampChangeFilter }}</el-form-item> -->
              <el-form-item v-if="!isYXB" label="申领类型：">
                {{ showData.types === 2 ? '电子版证书' : '纸质版证书' }}
                <span v-if="showData.types === 2" class="danger" style="font-size: 12px;">
                  （电子版证书均为无照片证书）
                </span>
              </el-form-item>
              <el-form-item label="课程时间：">
                {{ showData.cert_start_time | TimestampChangeFilter }} 至 {{ showData.cert_end_time | TimestampChangeFilter }}
              </el-form-item>
              <template v-if="showData.types !== 2">
                <el-form-item label="证书类型：">{{ showData.cert_type===1?'普通':'高级'}}</el-form-item>
                <template v-if="!isYXB">
                  <el-form-item label="证书类别：">
                    <span v-if="showData.is_bilingual===1">中文版</span>
                    <span v-if="showData.is_bilingual===2">英文版</span>
                    <span v-if="showData.is_bilingual===3">中英文版</span>
                  </el-form-item>
                  <el-form-item label="是否粘贴照片：">{{ showData.is_photo===1?'否':'是'}}</el-form-item>
                </template>
                <el-form-item label="是否全员领取证书：">{{ showData.is_all===1?'否':'是'}}</el-form-item>
              </template>
              <el-form-item :label="`申领证书名单（${showData.students ? showData.students.length || 0 : 0} 人）：`">
                <span v-for="(item, index) in showData.students" :key="index" class="student-name">{{ item.stu_name }}</span>
                <!-- <strong v-if="showData.students" style="padding-right: 8px;color: #55565a">【共 {{ showData.students.length}} 名】</strong> -->
              </el-form-item>
              <el-form-item label="经办人姓名：">{{ showData.user_name }}</el-form-item>
              <el-form-item label="联系方式：">{{ showData.user_tel}}</el-form-item>
              <el-form-item label="备注：">
                <span v-if="showData.note">{{ showData.note }}</span>
                <span v-else class="info">（无）</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="certificate-info-foot">
          <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-certificate-info",
  data() {
    return {
      showData: {},
      
      isYXB: false
    };
  },
  methods: {
    ...mapActions(["getCertificatesId"]),
    initData() {
      let ID = this.$route.params.id;
      this.getCertificatesId({
        id: ID
      }).then(data => {
        if (data.data.code === 200) {
          this.showData = data.data.data;
        } else {
          this.$router.go(-1);
        }
      });
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    this.initData();
  }
};
</script>

<style scoped>
.certificate-info-head {
  line-height: 2em;
  text-align: center;
}
.certificate-info-head span {
  font-size: 14px;
  color: #c0c0c0;
}
.cert-name {
  color: #008000;
}
.certificate-info-main {
  padding: 20px 10px 40px;
  line-height: 30px;
}
li {
  border-bottom: 1px solid #8492a6;
  background-color: #fafafa;
}
li strong {
  display: inline-block;
  width: 140px;
}
.student-name {
  padding-right: 8px;
  color: #55565a;
}
.certificate-info-foot {
  padding-left: 160px;
  padding-bottom: 40px;
}
</style>
