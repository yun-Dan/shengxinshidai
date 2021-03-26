<template>
  <div class="app-propaganda-promote-print" v-loading="loading">
    <div id="subOutputRank-print" v-cloak>
      <!-- 版本二 -->
      <div v-if="createTime > versionTime_4" class="propaganda-promote-print-main propaganda-promote-print-main-v4">
        <el-row :gutter="20">
          <el-col :span="16" :offset="2">
            <div class="propaganda-promote-print-head text-align-center">教育培训宣传推广审查备案书</div>
          </el-col>
          <el-col :span="6">
            <div class="promote-code-img">
              <img :src="imgUrl" >
            </div>
          </el-col>
        </el-row>
        <div class="promote-code-num">
          <template v-if="showData.code">
            编号：<span class="danger">{{ showData.code }}</span>
          </template>
        </div>
        <!-- <div class="propaganda-promote-print-head text-align-center">证 明</div> -->
        <div>采购与招标管理中心、财务处：</div>
        <div class="div-text-indent">
          我单位举办的 <span
            class="propaganda-promote-print-text"
          >{{ showData.pro_name }}{{ showData.pro_name }}{{ showData.pro_name }}</span> ，
          项目编号：
          <span class="propaganda-promote-print-text">{{ showData.pro_code }}</span> ，
          在继续教育处批准立项，有关广告推广活动主要内容和形式已通过继续教育处审查备案，经其同意可开展有关广告宣传活动。
        </div>
        <div class="div-text-indent">请贵单位协助我单位办理有关服务采购或财务报销手续。</div>
        <div class="div-text-indent">广告相关信息如下：</div>
        <div class="div-text-indent promote-print-type">
          广告类型：
          <template v-for="(item, key) in proConfig.promote_type">
            <template v-if="key == showData.type">
              <img src="../../../../assets/images/yes.gif" :key="`${key}1`">
              <span :key="`${key}text`" style="padding: 0 10px 0 4px">{{ item }}</span>
            </template>
            <template v-else>
              <img src="../../../../assets/images/no.gif" :key="`${key}2`">
              <span :key="`${key}text`" style="padding: 0 10px 0 4px">{{ item }}</span>
            </template>
          </template>
        </div>
        <div class="div-text-indent">
          广告媒体：
          <span class="propaganda-promote-print-text">{{ showData.putin }}</span>
        </div>
        <div class="div-text-indent">
          广告时间：
          {{ showData.sta_time | TimestampChangeFilter(true) }}
          <span
            style="padding-right: 4px"
          >至</span>
          {{ showData.end_time | TimestampChangeFilter(true) }}
        </div>
        <div class="clearfix">
          <div class="fr propaganda-promote-print-foot">
            <div>{{ showData.college }}</div>
            <div>
              {{ new Date().getFullYear() }} 年
              {{ new Date().getMonth()+1 }} 月
              {{ new Date().getDate() }} 日
            </div>
          </div>
        </div>
        <div style="page-break-before:always;">
          <br>
        </div>
        <div>附件：</div>
        <div class="propaganda-promote-print-filebox">
          <img :src="`${lookUrl}/${showData.img}`" alt style="width: 100%">
        </div>
      </div>
      <!-- 版本一 -->
      <div v-else class="propaganda-promote-print-main">
        <el-row :gutter="20">
          <el-col :span="8" :offset="8">
            <div class="propaganda-promote-print-head text-align-center">证 明</div>
          </el-col>
          <el-col :span="8">
            <div class="promote-code-img">
              <img :src="imgUrl" >
            </div>
          </el-col>
        </el-row>
        <div class="promote-code-num">
          <template v-if="showData.code">
            编号：<span class="danger">{{ showData.code }}</span>
          </template>
        </div>
        <!-- <div class="propaganda-promote-print-head text-align-center">证 明</div> -->
        <div>财务处：</div>
        <div class="div-text-indent">
          <span
            class="propaganda-promote-print-text"
          >{{ showData.pro_name }}{{ showData.pro_name }}{{ showData.pro_name }}</span> 项目，
          项目编号：
          <span class="propaganda-promote-print-text">{{ showData.pro_code }}</span> ，
          项目申请单位为
          <span class="propaganda-promote-print-text">{{ showData.college }}</span>，
          经我处审核批准立项，我处同意立项单位开展广告宣传活动。
        </div>
        <div class="div-text-indent">广告相关信息如下：</div>
        <div class="div-text-indent">
          广告服务商：
          <span class="propaganda-promote-print-text">{{ showData.putin }}</span>
        </div>
        <div class="div-text-indent promote-print-type">
          广告类型：
          <template v-for="(item, key) in proConfig.promote_type">
            <template v-if="key == showData.type">
              <img src="../../../../assets/images/yes.gif" :key="`${key}1`">
              <span :key="`${key}text`" style="padding: 0 10px 0 4px">{{ item }}</span>
            </template>
            <template v-else>
              <img src="../../../../assets/images/no.gif" :key="`${key}2`">
              <span :key="`${key}text`" style="padding: 0 10px 0 4px">{{ item }}</span>
            </template>
          </template>
        </div>
        <div class="div-text-indent">
          广告时间：
          {{ showData.sta_time | TimestampChangeFilter(true) }}
          <span
            style="padding-right: 4px"
          >至</span>
          {{ showData.end_time | TimestampChangeFilter(true) }}
        </div>
        <div class="div-text-indent">
          广告金额：
          <span class="propaganda-promote-print-text">{{ showData.amount }} 元</span>
        </div>
        <div class="div-text-indent">特此证明。</div>
        <div class="clearfix">
          <div class="fr propaganda-promote-print-foot">
            <div>继续教育处</div>
            <div>
              {{ new Date().getFullYear() }} 年
              {{ new Date().getMonth()+1 }} 月
              {{ new Date().getDate() }} 日
            </div>
          </div>
        </div>
        <div style="page-break-before:always;">
          <br>
        </div>
        <div>附件：</div>
        <div class="propaganda-promote-print-filebox">
          <img :src="`${lookUrl}/${showData.img}`" alt style="width: 100%">
        </div>
      </div>
    </div>
    <div v-if="$route.path.indexOf('home/') !== -1" class="text-align-center" style="padding-bottom: 50px">
      <el-button type="primary" @click="doPrint">打 印</el-button>
      <el-button type @click="handleBack">返 回</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'

export default {
  name: "app-propaganda-promote-print",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      showData: {},
      imgUrl: '',
      // 创建日期
      createTime: null
    };
  },
  computed: {
    ...mapState(["lookUrl", 'EWM', 'versionTime_4'])
  },
  methods: {
    ...mapActions(["getPropagandaPromoteList"]),
    initData() {
      const Route = this.$route
      let id = null
      if (Route.query['0']) {
        let str = Route.query['0'].substring(2)
        id = str.substring(0, str.length - 1)
      } else if (Route.params.id) {
        id = Route.params.id
      }
      if (id) {
        this.loading = true
        if (this.loading) {
          this.getPropagandaPromoteList({
            data: {
              id: id
            }
          }).then(data => {
            if (data.data.code === 200) {
              const Data = data.data.data;
              let list = Data.list || [];
              if (list && list.length) {
                this.showData = list[0];
                this.imgUrl = `${this.EWM}/10/id/${id}`
                this.createTime = this.showData.create_time * 1000 || new Date().getTime()
              }
              this.loading = false;
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error
              });
            }
          });
        }
      }
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
.app-propaganda-promote-print{
  background-color: #fff;
}
.propaganda-promote-print-main {
  width: 600px;
  margin: 0 auto;
  padding: 50px;
  font-size: 18px;
  line-height: 2.6em;
  font-family: "新宋体";
}
.propaganda-promote-print-head {
  font-size: 30px;
  letter-spacing: 10px;
  font-family: "华文楷体";
  margin-bottom: 40px;
}
.propaganda-promote-print-text {
  line-height: 1.6em;
  text-indent: 0;
  text-decoration: underline;
}
.propaganda-promote-print-foot {
  text-align: right;
  margin-top: 40px;
}
.promote-print-type img {
  vertical-align: middle;
  width: 15px;
  margin-bottom: 3px;
}
.propaganda-promote-print-filebox {
  padding: 40px 40px 0;
}
.promote-code-img{
  text-align: right;
}
.promote-code-img img{
  width: 112px;
  height: 112px;
}
.promote-code-num{
  height: 30px;
  line-height: 30px;
  text-align: right;
}

.propaganda-promote-print-main-v4 .propaganda-promote-print-head{
  letter-spacing: 0;
  padding-top: 30px;
  padding-bottom: 20px;
  margin-bottom: 0;
}
</style>
