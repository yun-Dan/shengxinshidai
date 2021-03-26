<template>
  <div class="document-content-print" v-loading="loading">
    <div id="subOutputRank-print">
      <div class="document-content-print-main">
        <div class="document-content-print-head-box">
          <div class="document-content-print-head text-align-center">中国人民大学继续教育处</div>
        </div>
        <div class="document-content-print-title text-align-center">
          <template
            v-if="`${type}` === '1' || (`${type}` === '2' && `${showData.type}` !== '1')"
          >{{ showData.title1 || showData.title }}</template>
          <template v-else>
            <div v-html="titleBr"></div>
          </template>
        </div>
        <div
          class="document-content-print-num text-align-center"
        >{{ showData.document_official || '编号***' }}</div>
        <div class="document-content-print-content">
          <div v-html="showData.content"></div>
        </div>
        <div class="sign-box clearfix" id="sigDIV">
          <div class="fr" style="width: 200px">
            继续教育处
            <span v-if="`${type}` === '1' && showData.id == 38">&nbsp;财务处</span>
            <br>
            {{ showData.statuszhi_time | TimestampChangeFilter(true) }}
          </div>
        </div>
        <div v-if="`${type}` === '2'" class="users-signature-box">
          参会人员签字：
        </div>
        <input type="hidden" id="qianfa" v-model="sign_value">
      </div>
    </div>
    <div class="text-align-center" style="margin-top: 60px">
      <template v-if="this.query.print">
        <template v-if="query.is_sign == 0 &&! showData.is_sign">
          <el-button type="primary" @click="handleSign">签 章</el-button>
          <el-button type="primary" @click="handleSignTrue">提 交</el-button>
        </template>
        <el-button v-else type="primary" @click="doPrint">打 印</el-button>
        <el-button @click="handleBack">返 回</el-button>
        <div
          v-if="query.is_sign == 0 &&! showData.is_sign"
          style="font-size: 12px; line-height: 3em"
          class="info"
        >
          <span class="danger">*</span>
          请先管理员操作“签 章”后执行“提 交”！
        </div>
      </template>
      <el-button v-else @click="handleBack" icon="el-icon-edit">继续编辑</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import BJCA from "@/assets/js/BJCAWebSign.js";
import { doPrint } from '@/assets/js/doPrint.js'

export default {
  name: "document-content-print",
  data() {
    return {
      loading: false,
      showData: {},
      query: {},
      type: null,
      id: null,
      sign_value: ""
    };
  },
  computed: {
    ...mapState(['userInfo']),
    titleBr() {
      const Title = this.showData.title1 || this.showData.title || "";
      return Title.replace(/\学年\s{0,}第/g, "学年<br/>第");
    }
  },
  methods: {
    ...mapActions([
      "getDocumentYngwList",
      "getDocumentHyjyList",
      "signDocumentYngw",
      "signDocumentHyjy"
    ]),
    initData() {
      this.query = this.$route.query;
      if (this.query.print) {
        this.type = this.query.print.substring(0, 1);
        this.id = this.query.print.substring(3, this.query.print.length - 1);
        this.sign_value = `${this.userInfo.role}-${this.type}-${this.id}`;
        this.loading = true;
        if (this.loading && this.type && this.id) {
          if (this.type === "1") {
            this.getDocumentYngwList({
              data: {
                id: this.id
              }
            }).then(data => {
              if (data.data.code === 200) {
                const Data = data.data.data;
                let list = Data.list || [];
                if (list.length) {
                  this.showData = list[0];
                  if (this.showData.is_sign && this.showData.sign_info) {
                    this.f_BT11Click();
                  }
                }
                this.loading = false;
              } else {
                this.$notify.error({
                  title: "错误",
                  message: data.data.error
                });
              }
            });
          } else if (this.type === "2") {
            this.getDocumentHyjyList({
              data: {
                id: this.id
              }
            }).then(data => {
              if (data.data.code === 200) {
                const Data = data.data.data;
                let list = Data.list || [];
                if (list.length) {
                  this.showData = list[0];
                  if (this.showData.is_sign && this.showData.sign_info) {
                    this.f_BT11Click();
                  }
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
      } else {
        if (this.query["100"] && sessionStorage.getItem("yulan_100")) {
          let newTime = new Date().getTime();
          this.showData = JSON.parse(sessionStorage.getItem("yulan_100")) || {};
          this.$set(this.showData, "statuszhi_time", newTime);
        } else if (this.query["99"] && sessionStorage.getItem("yulan_99")) {
          let newTime = new Date().getTime();
          this.showData = JSON.parse(sessionStorage.getItem("yulan_99")) || {};
          this.$set(this.showData, "statuszhi_time", newTime);
        }
      }
    },
    doPrint() {
      doPrint()
    },
    handleSign() {
      this.signClick();
    },
    handleSignTrue() {
      let signData = BJCA.ESeaL_GetSignatureData("1");
      if (!signData) {
        return false;
      } else {
        const Params = {
          id: this.id,
          is_sign: 1,
          sign_info: signData
        };
        this.loading = true;
        if (this.loading) {
          if (this.type === "1") {
            this.signDocumentYngw({
              data: Params
            }).then(data => {
              if (data.data.code === 200) {
                this.$message.success({
                  message: "操作成功！",
                  onClose: () => {
                    // this.loading = false;
                    this.handleBack();
                  }
                });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: data.data.error,
                  onClose: () => {
                    this.loading = false;
                  }
                });
              }
            });
          } else if (this.type === "2") {
            this.signDocumentHyjy({
              data: Params
            }).then(data => {
              if (data.data.code === 200) {
                this.$message.success({
                  message: "操作成功！",
                  onClose: () => {
                    this.handleBack();
                  }
                });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: data.data.error,
                  onClose: () => {
                    this.loading = false;
                  }
                });
              }
            });
          }
        }
      }
    },
    signClick() {
      BJCA.ESeaL_InsertStamp("1", "sigDIV", "qianfa", false);
      BJCA.ESeaL_SetSealPosAndSign("1", "qianfa", 420, 0);
    },
    f_BT11Click() {
      this.$nextTick(() => {
        if (this.showData.is_sign && this.showData.sign_info) {
          var data = this.showData.sign_info;
          BJCA.ESeaL_InsertStamp("1", "sigDIV", "qianfa", false);
          BJCA.ESeaL_SetData(
            "1",
            "qianfa",
            data,
            "SHA256WithRSA",
            "qianfa",
            420,
            0
          );
        }
      });
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
.document-content-print {
  padding-bottom: 40px;
}
.document-content-print-main {
  position: relative;
  width: 600px;
  margin: 0 auto;
  padding-top: 20px;
}
.document-content-print-head-box {
  padding-bottom: 2px;
  border-bottom: 1px solid #aa3130;
  margin-bottom: 14px;
}
.document-content-print-head {
  font-size: 52px;
  color: #aa3130;
  font-weight: 600;
  height: 60px;
  line-height: 60px;
  border-bottom: 2px solid #aa3130;
  font-family: "方正小标宋简体", "新宋体", "NSimSun", "宋体", "SimSun",
    "微软雅黑", "Microsoft YaHei";
  letter-spacing: 1px;
}
.document-content-print-title {
  width: 88%;
  margin: 0 auto;
  font-size: 28px;
  line-height: 48px;
  font-family: "方正小标宋简体", "新宋体", "NSimSun", "宋体", "SimSun",
    "微软雅黑", "Microsoft YaHei";
  font-weight: 600;
}
.document-content-print-num {
  font-size: 19px;
  padding: 20px 0;
  font-family: "仿宋", "FangSong";
}
.document-content-print-content {
  width: 96%;
  margin: 0 auto;
  font-size: 21px;
  line-height: 34px;
  font-family: "仿宋", "FangSong";
}
@media print {
  .document-content-print-content {
    font-size: 21px;
    line-height: 34px;
    font-family: "仿宋", "FangSong";
  }
}

.sign-box {
  padding: 20px 0;
  font-size: 21px;
  line-height: 34px;
  font-family: "仿宋", "FangSong";
  text-align: center;
}
#sigDIV {
  position: relative;
}
#qianfa {
  position: absolute;
  width: 200px;
  height: 24px;
  bottom: 0;
  right: 50px;
  font-size: 14px;
  padding: 0 4px;
}

.users-signature-box{
  padding: 20px 10px;
  border-top: 1px dotted #666;
  margin: 70px auto 20px;
  font-size: 18px;
  font-family: "仿宋", "FangSong";
}
</style>
