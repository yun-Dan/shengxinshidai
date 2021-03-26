<template>
  <div class="app-document-hyjy-info" v-loading="loading">
    <div class="document-form-page-box">
      <div class="document-form-page-title">继续教育处发文处内签批单</div>
      <div class="document-form-page-subtitle clearfix">
        <div class="fr">
          <span class="fl">编号：</span>
          <span class="fl" style="width: 240px; color: #444">{{ showData.document_official }}</span>
        </div>
      </div>
      <!--签批单正文-->
      <div class="document-form-page-content">
        <div class="clearfix document-form-page-line">
          <div class="fl document-form-page-left" style="padding: 60px 0"><span v-html="chuNamePublic({time: showData.create_time * 1000, isHtml: true})"></span></div>
          <div class="fl document-form-page-center">
            <el-input
              v-if="query['1'] && query['2']"
              v-model="status_content_1"
              type="textarea"
              rows="3"
              :maxlength="100"
              show-word-limit
              resize="none"
              placeholder="签批意见"
            ></el-input>
            <div v-else class="document-form-page-showtext">
              <span v-if="showData.statuszhi === 3">{{ showData.statuszhi_content1 }}</span>
              <span v-if="showData.statuszhi === 2">{{ showData.statuszhi_content2 }}</span>
            </div>
          </div>
          <div class="fl document-form-page-right" style="padding: 60px 0">
            <el-button
              v-if="query['1'] && query['2']"
              type="success"
              size="small"
              plain
              :disabled="userInfo.role !== 1 || !(query['1'] && query['2'])"
              @click="handleCheckTrue(3, 1)"
            >同意</el-button>
            <span v-else class="success">{{ showData.statuszhi === 3 ? '同 意' : '' }}</span>
            <el-button
              v-if="query['1'] && query['2']"
              type="danger"
              size="small"
              plain
              :disabled="userInfo.role !== 1 || !(query['1'] && query['2'])"
              @click="handleCheckTrue(2, 1)"
            >退回</el-button>
            <span v-else class="danger">{{ showData.statuszhi === 2 ? '退 回' : '' }}</span>
          </div>
        </div>
        <div class="clearfix document-form-page-line">
          <div class="fl document-form-page-left" style="padding: 60px 0"><span v-html="chuNamePublic({type: 2, isHtml: true})"></span></div>
          <div class="fl document-form-page-center" style="line-height: 24px; text-align: left">
            <el-input
              v-if="query['1'] && !query['2']"
              v-model="status_content_2"
              type="textarea"
              rows="3"
              :maxlength="100"
              show-word-limit
              resize="none"
              placeholder="签批意见"
            ></el-input>
            <div v-else class="document-form-page-showtext">
              <span v-if="showData.status === 3">{{ showData.status_content1 }}</span>
              <span v-if="showData.status === 2">{{ showData.status_content2 }}</span>
            </div>
          </div>
          <div class="fl document-form-page-right" style="padding: 60px 0">
            <el-button
              v-if="query['1'] && !query['2']"
              type="success"
              size="small"
              plain
              :disabled="userInfo.role !== 1 || !(query['1'] && !query['2'])"
              @click="handleCheckTrue(3, 2)"
            >同意</el-button>
            <span v-else class="success">{{ showData.status === 3 ? '同 意' : '' }}</span>
            <el-button
              v-if="query['1'] && !query['2']"
              type="danger"
              size="small"
              plain
              :disabled="userInfo.role !== 1 || !(query['1'] && !query['2'])"
              @click="handleCheckTrue(2, 2)"
            >退回</el-button>
            <span v-else class="danger">{{ showData.status === 2 ? '退 回' : '' }}</span>
          </div>
        </div>
        <div class="clearfix document-form-page-line">
          <div class="fl document-form-page-left">类&nbsp;&nbsp; 型</div>
          <div class="fl document-form-page-center" style="width: 640px; color: #444">
            <template v-if="proConfig.meeting_type">
              <div v-if="query['3']">{{ proConfig.meeting_type[form.type] }}</div>
            </template>
          </div>
        </div>
        <div class="clearfix document-form-page-line">
          <div class="fl document-form-page-left">拟&nbsp;&nbsp; 稿</div>
          <div class="fl document-form-page-center" style="width: 240px; color: #444;">
            <span v-if="query['3']">{{ form.meeting_host }}</span>
          </div>
          <div class="fl document-form-page-cl">电&nbsp;&nbsp; 话</div>
          <div class="fl document-form-page-center" style="width: 240px; color: #444;">
            <span v-if="query['3']">{{ form.meeting_place }}</span>
          </div>
        </div>
        <div class="clearfix document-form-page-line document-form-page-line-last">
          <div class="fl document-form-page-left">标&nbsp;&nbsp; 题</div>
          <div
            class="fl document-form-page-center"
            style="width: 640px; padding-top: 1px; color: #444"
          >
            <span v-if="query['3']">{{ form.title1 }}</span>
          </div>
        </div>
        <div class="clearfix document-form-page-line document-form-page-line-last">
          <div class="fl document-form-page-left">主题词</div>
          <div
            class="fl document-form-page-center"
            style="width: 640px; padding-top: 1px; color: #444"
          >
            <span v-if="query['3']">{{ form.title }}</span>
          </div>
        </div>
      </div>
      <!--内容-->
      <div class="document-form-page-ueditor">
        <div class="ueditor-box">
          <div
            v-html="form.content"
            class="document-form-page-ueditor-html"
            style="min-height: 100px"
          ></div>
        </div>
      </div>
      <!--附件-->
      <!--<div v-if="query['3']" style="text-align: left; margin-bottom: 20px">-->
      <!--<el-link-->
      <!--v-if="form.frdb_file.origin_name || form.frdb_file.code" type="primary"-->
      <!--@click="handleLookFile(form.frdb_file.code)" icon="el-icon-paperclip">-->
      <!--附件查看-->
      <!--</el-link>-->
      <!--</div>-->
      <!--提交-->
      <div v-if="query['99']">
        <el-button @click="handleBack" icon="el-icon-edit">继续编辑</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-document-hyjy-info",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      query: {
        //参数键名：is_check、is_chu、look、key、id
        "1": false, // is_check： 是否审核
        "2": false, // is_chu：是否处长审核
        "3": false, //  look： true查看、false新增或编辑
        "4": -1, // key：标记为新增或编辑：-1新增，0编辑
        "5": 0 // id：编辑时的id
      },
      showData: {},
      form: {
        uid: 0,
        title1: "",
        title: "",
        type: null, // 公文类别
        meeting_host: "", // 拟稿
        meeting_place: "", // 电话
        content: "", // 内容
        frdb_file: {
          code: "",
          origin_name: "" // 附件名称
        }
      },
      // 审核：审批意见
      status_content_1: "",
      status_content_2: ""
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getDocumentHyjyList",
      "checkDocumentHyjy",
      "checkChuDocumentHyjy"
    ]),
    initData() {
      let query = this.$route.query;
      this.query = Object.assign({}, query, {
        "1":
          this.$route.query["1"] === true || this.$route.query["1"] === "true",
        "2":
          this.$route.query["2"] === true || this.$route.query["2"] === "true",
        "3":
          this.$route.query["3"] === true || this.$route.query["3"] === "true"
      });
      this.loading = true;
      //  1 is_check、2 is_chu、3 look、4 key、5 id
      if (this.query["4"] == -1) {
        this.loading = false;
      } else if (this.query["4"] == 0 && this.query["5"]) {
        if (this.loading) {
          this.getDocumentHyjyList({
            data: {
              id: this.query["5"]
            }
          }).then(data => {
            if (data.data.code === 200) {
              const Data = data.data.data;
              let list = Data.list || [];
              if (list.length) {
                this.showData = list[0];
                this.form = JSON.parse(JSON.stringify(this.showData));
                for (let key in this.form) {
                  if (!this.$options.data().form.hasOwnProperty(key)) {
                    this.$delete(this.form, key);
                  }
                }
                Object.assign(this.form, {
                  type: this.form.type - 0
                });
                if (this.query["1"]) {
                  if (this.query["2"]) {
                    if (this.showData.statuszhi === 2) {
                      this.status_content_1 = this.showData.statuszhi_content2;
                    } else if (this.showData.statuszhi === 3) {
                      this.status_content_1 = this.showData.statuszhi_content1;
                    }
                  } else {
                    if (this.showData.status === 2) {
                      this.status_content_2 = this.showData.status_content2;
                    } else if (this.showData.status === 3) {
                      this.status_content_2 = this.showData.status_content1;
                    }
                  }
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
      } else if (
        this.query["4"] === 0 &&
        this.query["99"] &&
        sessionStorage.getItem("yulan_99")
      ) {
        // 预览
        this.showData = JSON.parse(sessionStorage.getItem("yulan_99"));
        this.form = JSON.parse(JSON.stringify(this.showData));
        for (let key in this.form) {
          if (!this.$options.data().form.hasOwnProperty(key)) {
            this.$delete(this.form, key);
          }
        }
        Object.assign(this.form, {
          document_type: this.form.document_type - 0
        });
        this.loading = false;
      }
    },
    handleBack() {
      this.$router.go(-1);
    },
    handleCheckTrue(status, type) {
      // status：3通过、2退回。type：1、2
      const Params = {
        id: this.query["5"]
      };
      if (type === 1) {
        if (!this.status_content_1) {
          this.$message.warning("审批意见不能为空！");
          return false;
        }
        Object.assign(Params, {
          statuszhi: status,
          statuszhi_content1: status === 3 ? this.status_content_1 : "",
          statuszhi_content2: status === 3 ? "" : this.status_content_1
        });
      } else if (type === 2) {
        if (!this.status_content_2) {
          this.$message.warning("审批意见不能为空！");
          return false;
        }
        Object.assign(Params, {
          status: status,
          status_content1: status === 3 ? this.status_content_2 : "",
          status_content2: status === 3 ? "" : this.status_content_2
        });
      }
      this.loading = true;
      if (this.loading) {
        if (type === 1) {
          this.checkChuDocumentHyjy({
            data: Params
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: data.data.data
              });
              this.handleBack();
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
        } else if (type === 2) {
          this.checkDocumentHyjy({
            data: Params
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: data.data.data
              });
              this.handleBack();
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
  beforeMount() {
    this.$set(this.form, "uid", this.userInfo.uid);
  },
  mounted() {
    this.initData();
  }
};
</script>

<style scoped>
.app-document-hyjy-info {
  padding: 60px 0;
  color: #aa3130;
}
</style>
