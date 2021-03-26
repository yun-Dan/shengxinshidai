<template>
  <div class="app-project-ylx">
    <div id="subOutputRank-print">
      <div class="app-project-ylx-main">
        <template v-for="v in 2">
          <div class="app-project-ylx-item" :key="v" style="padding-top: 30px;">
            <div class="app-project-ylx-item-head clearfix">
              <div class="text-align-center project-ylx-item-title">介绍信</div>
              <div class="project-ylx-item-no fr">NO： {{ query.ylx }}</div>
            </div>
            <div class="app-project-ylx-item-body">
              <div>{{ v===1 ? '财务处' : '学校办公室'}}：</div>
              <div class="div-text-indent">
                我单位
                <span class="project-ylx-text">{{ query.name }}</span> 项目，项目编号
                <span class="project-ylx-text">{{ query.code }}</span> ，已经继续教育处审批通过允许举办。
                兹有我单位
                <span
                  class="project-ylx-text"
                >{{ query.user }}</span> 同志，因工作需要，前往贵处办理：
                <template v-if="proConfig.preliminary && preliminary">
                  <template v-for="(v, i) in preliminary">
                    <span
                      v-if="proConfig.preliminary[v]"
                      :key="v"
                    >{{ proConfig.preliminary[v] }}{{ preliminary.length-1 > i ? '、' : '' }}</span>
                  </template>
                </template>事宜，用于培训项目招投标工作。请予接洽并予协助办理为盼。
              </div>
              <div class="div-text-indent">随介绍信附此培训项目《立项通知书》复印件，请予审核检查。</div>
            </div>
            <div class="clearfix">
              <div class="fr">
                <div style="text-align: right">{{ query.college }}</div>
                <div>{{ time.getFullYear() }}年{{ time.getMonth()+1 }}月{{ time.getDate() }}日</div>
              </div>
            </div>
          </div>
          <div v-if="v===1" class="no-print" :key="`${v}-2`"></div>
          <div v-if="v===1" style="page-break-before:always;" :key="`${v}-3`">
            <br>
          </div>
        </template>
      </div>
    </div>
    <div class="text-align-center" style="margin-top: 40px">
      <el-button type="primary" @click="doPrint">打 印</el-button>
      <el-button type @click="handleBack">返 回</el-button>
    </div>
  </div>
</template>

<script>
import { doPrint } from '@/assets/js/doPrint.js'
export default {
  name: "app-project-ylx",
  data() {
    return {
      time: new Date(),
      query: {},
      preliminary: [],
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {}
    };
  },
  methods: {
    initData() {
      this.query = this.$route.query;
      this.preliminary = this.query.preliminary.split(",");
    },
    doPrint() {
      doPrint()
    },
    handleBack() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.initData();
  }
};
</script>

<style scoped>
.app-project-ylx {
  padding: 50px 0;
}
.app-project-ylx-main {
  width: 600px;
  margin: 0 auto;
  font-family: "新宋体";
  font-size: 18px;
  line-height: 2.6em;
}
.app-project-ylx-item {
}
.app-project-ylx-item-head {
  border-bottom: 3px solid #aa3130;
  margin-bottom: 40px;
}
.project-ylx-item-title {
  font-size: 40px;
  line-height: 2.2em;
  font-family: "华文行楷";
  color: #aa3130;
  letter-spacing: 1em;
}
.project-ylx-item-no {
  min-width: 160px;
  margin-right: 20px;
  font-size: 24px;
  line-height: 2em;
}
.app-project-ylx-item-body {
  padding: 0 10px;
  margin-bottom: 100px;
}
img {
  vertical-align: middle;
  width: 16px;
  margin-bottom: 6px;
  margin-right: 3px;
}
.project-ylx-text {
  text-decoration: underline;
}
.no-print {
  height: 100px;
}
@media print {
  .no-print {
    display: none;
  }
}
</style>
