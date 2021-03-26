<template>
  <div class="app-document-yngw-form" v-loading="loading">
    <div class="document-form-page-box">
      <div class="document-form-page-title">继续教育处发文处内签批单</div>
      <div class="document-form-page-subtitle clearfix">
        <div class="fr">
          <span class="fl">编号：</span>
          <span class="fl" style="width: 240px"></span>
        </div>
      </div>
      <!--签批单正文-->
      <div class="document-form-page-content">
        <div class="clearfix document-form-page-line">
          <div class="fl document-form-page-left" style="padding: 60px 0">&nbsp;<span v-html="chuNamePublic({time: showData.create_time * 1000, isHtml: true})"></span></div>
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
            <div class="document-form-page-showtext">
              <span v-if="showData.statuszhi === 3">{{ showData.statuszhi_content1 }}</span>
              <span v-if="showData.statuszhi === 2">{{ showData.statuszhi_content2 }}</span>
            </div>
          </div>
          <div class="fl document-form-page-right" style="padding: 60px 0">
            <template v-if="userInfo.role === 1 && query['1'] && query['2']">
              <el-button
                type="success"
                size="small"
                plain
                :disabled="userInfo.role !== 1 || !(query['1'] && query['2'])"
                @click="handleCheckTrue(3, 1)"
              >同意</el-button>
              <el-button
                type="danger"
                size="small"
                plain
                :disabled="userInfo.role !== 1 || !(query['1'] && query['2'])"
                @click="handleCheckTrue(2, 1)"
              >退回</el-button>
            </template>
            <template v-else>
              <span v-if="showData.statuszhi === 3" class="success">同 意</span>
              <span v-if="showData.statuszhi === 2" class="danger">退 回</span>
            </template>
          </div>
        </div>
        <div class="clearfix document-form-page-line">
          <div class="fl document-form-page-left" style="padding: 60px 0">&nbsp;<span v-html="chuNamePublic({type: 2, isHtml: true})"></span></div>
          <div class="fl document-form-page-center" style="line-height: 24px; text-align: left">
            <el-input
              v-if="query['1'] && !query['2']"
              v-model="status_content_2"
              type="textarea"
              rows="5"
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
            <template v-if="userInfo.role === 1 && query['1'] && !query['2']">
              <el-button
                type="success"
                size="small"
                plain
                :disabled="userInfo.role !== 1 || !(query['1'] && !query['2'])"
                @click="handleCheckTrue(3, 2)"
              >同意</el-button>
              <el-button
                type="danger"
                size="small"
                plain
                :disabled="userInfo.role !== 1 || !(query['1'] && !query['2'])"
                @click="handleCheckTrue(2, 2)"
              >退回</el-button>
            </template>
            <template v-else>
              <span v-if="showData.status === 3" class="success">同 意</span>
              <span v-if="showData.status === 2" class="danger">退 回</span>
            </template>
          </div>
        </div>
        <div class="clearfix document-form-page-line">
          <div class="fl document-form-page-left">
            <span class="danger">*</span>类&nbsp;&nbsp; 型
          </div>
          <div class="fl document-form-page-center" style="width: 640px">
            <template v-if="proConfig.document_type">
              <el-select
                v-model="form.document_type"
                :disabled="query['3']"
                clearable
                placeholder="请选择类型"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, key) in proConfig.document_type"
                  :label="item"
                  :value="key -0"
                  :key="key"
                ></el-option>
              </el-select>
            </template>
          </div>
        </div>
        <div class="clearfix document-form-page-line">
          <div class="fl document-form-page-left">
            <span class="danger">*</span>拟&nbsp;&nbsp; 稿
          </div>
          <div class="fl document-form-page-center" style="width: 240px; color: #444;">
            <el-input v-model="form.name" :disabled="query['3']" clearable placeholder="拟稿人姓名">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </div>
          <div class="fl document-form-page-cl">
            <span class="danger">*</span>电&nbsp;&nbsp; 话
          </div>
          <div class="fl document-form-page-center" style="width: 240px; color: #444;">
            <el-input v-model="form.tel" :disabled="query['3']" clearable placeholder="联系电话">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </div>
        </div>
        <div class="clearfix document-form-page-line document-form-page-line-last">
          <div class="fl document-form-page-left">
            <span class="danger">*</span>标&nbsp;&nbsp; 题
          </div>
          <div class="fl document-form-page-center" style="width: 640px; padding-top: 1px">
            <el-input v-model="form.title1" :disabled="query['3']" clearable placeholder="请输入公文标题">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </div>
        </div>
        <div class="clearfix document-form-page-line document-form-page-line-last">
          <div class="fl document-form-page-left">
            <span class="danger">*</span>主题词
          </div>
          <div class="fl document-form-page-center" style="width: 640px; padding-top: 1px">
            <el-input v-model="form.title" :disabled="query['3']" clearable placeholder="请输入主题词">
              <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            </el-input>
          </div>
        </div>
      </div>
      <!--内容-->
      <div class="document-form-page-ueditor">
        <div class="ueditor-box">
          <UE :defaultMsg="content" :config="UE_config.options_document" ref="ue"></UE>
        </div>
      </div>
      <div style="font-size: 14px; text-align: left">
        *
        <span>请勿在编辑公文内容时自行添加落款！</span>
      </div>
      <!--附件-->
      <div>
        <!--<div class="upload-box" style="text-align: left">-->
        <!--<el-radio-group v-model="uploadType" size="mini" style="margin-bottom: 10px">-->
        <!--<el-radio-button :label="1">图片或PDF格式</el-radio-button>-->
        <!--<el-radio-button :label="0">其他格式</el-radio-button>-->
        <!--</el-radio-group>-->
        <!--<el-upload-->
        <!--class="upload"-->
        <!--:action="uploadType ? uploadExcelUrl1 : uploadExcelUrl"-->
        <!--:on-success="handleSuccess"-->
        <!--:on-remove="handleRemove"-->
        <!--:before-upload="beforeUpload"-->
        <!--:headers="headers"-->
        <!--:with-credentials="true"-->
        <!--name="attachment"-->
        <!--:accept="uploadType ? '.pdf, .PDF, .JPG, .jpg, .png, .PNG' : '.doc, .DOC, .docx, .DOCX'"-->
        <!--:file-list="fileList"-->
        <!--:limit="1"-->
        <!--:auto-upload="true">-->
        <!--<el-button :key="1" type="primary" plain size="mini" icon="el-icon-upload el-icon&#45;&#45;right" >附件上传（限 {{ uploadType ? 'JPG / PNG / PDF' : 'DOCX / DOC' }} 文件）</el-button>-->
        <!--</el-upload>-->
        <!--</div>-->
      </div>
      <!--提交-->
      <div v-if="!query['1']" style="padding-top: 20px">
        <el-button type="primary" plain @click.native="handleTrue(1, {}, 1)">签批单预览</el-button>
        <el-button type="primary" plain @click.native="handleTrue(1, {}, 2)">打印预览</el-button>
        <el-button v-if="!query['3']" type="primary" @click.native=" handleTrue(1)">提 交</el-button>
        <el-button @click.native="handleBack">返 回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UE from "@/components/compose/AppUE";
import UE_config from '@/assets/js/UE_config.js'

export default {
  name: "app-document-yngw-form",
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
        document_type: null, // 公文类别
        name: "", // 联系人
        tel: "", // 联系人电话
        content: "", // 内容
        frdb_file: {
          code: "",
          origin_name: "" // 附件名称
        }
      },
      //富文本编辑框
      content: "",
      UE_config,
      //  上传
      headers: {},
      fileList: [],
      uploadType: 1, // 上传类型'：1图片PDF、0附件
      // 审核：审批意见
      status_content_1: "",
      status_content_2: ""
    };
  },
  computed: {
    ...mapState([
      "uploadExcelUrl1", // 图片
      "uploadExcelUrl", // 附件
      "lookUrl",
      'userInfo'
    ])
  },
  components: {
    UE
  },
  methods: {
    ...mapActions([
      "getDocumentYngwList",
      "addDocumentYngw",
      "editDocumentYngw",
      "checkDocumentYngw",
      "checkChuDocumentYngw"
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
        this.$set(this.form, "name", this.userInfo.realname);
        this.$set(this.form, "tel", this.userInfo.tel);
      } else if (this.query["4"] == 0 && this.query["5"]) {
        if (this.loading) {
          this.getDocumentYngwList({
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
                  document_type: this.form.document_type - 0
                });
                this.$nextTick(() => {
                  this.content = this.form.content;
                  if (this.$refs.ue) {
                    this.$refs.ue.setUEContent(this.form.content);
                  }
                });
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
    handleTrue(yes, checkParams, preview) {
      // 确认修改当前编辑
      let content = this.$refs.ue.getUEContent();
      let Params = Object.assign(JSON.parse(JSON.stringify(this.form)), {
        content: content,
        uid: this.query["4"] == -1 ? this.userInfo.uid : this.showData.uid
      });
      if (!Params.document_type) {
        this.$message({
          type: "warning",
          message: "请选择类型！"
        });
        return false;
      }
      if (!Params.title1) {
        this.$message({
          type: "warning",
          message: "请输入标题！"
        });
        return false;
      }
      if (!Params.title) {
        this.$message({
          type: "warning",
          message: "请输入主题词！"
        });
        return false;
      }
      if (!Params.content) {
        this.$message({
          type: "warning",
          message: "请输入内容"
        });
        return false;
      }
      if (this.query["4"] == 0) {
        delete Params.uid;
      }
      if (yes) {
        Object.assign(Params, {
          status: 1,
          status_content1: "",
          status_content2: "",
          statuszhi: 1,
          statuszhi_content1: "",
          statuszhi_content2: ""
        });
      }
      if (checkParams) {
        Object.assign(Params, checkParams);
      }
      if (this.query["1"] && this.query["2"]) {
        Object.assign(Params, {
          status: this.showData.status,
          status_content1: this.showData.status_content1,
          status_content2: this.showData.status_content2
        });
      }
      if (preview) {
        // 预览
        this.handlePreview(preview);
      } else {
        // 新增、编辑、审核
        this.loading = true;
        if (this.loading) {
          if (this.query["1"]) {
            // 审批
            if (this.query["2"]) {
              this.checkChuDocumentYngw({
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
            } else {
              this.checkDocumentYngw({
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
          } else {
            // 新增并编辑
            if (this.query["4"] == -1) {
              // 新增
              this.addDocumentYngw({
                data: Params
              }).then(data => {
                if (data.data.code === 200) {
                  this.$message({
                    message: data.data.data,
                    type: "success"
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
            } else {
              // 编辑
              this.editDocumentYngw({
                data: Params,
                id: this.query["5"]
              }).then(data => {
                if (data.data.code === 200) {
                  this.$message({
                    message: data.data.data,
                    type: "success"
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
      }
    },
    beforeUpload(file) {
      let format = file.name.substring(file.name.lastIndexOf(".") + 1);
      let list = this.uploadType
        ? ["jpg", "JPG", "png", "PNG", "pdf", "PDF"]
        : ["DOCX", "docx", "DOC", "doc"];
      const isTYPE = list.indexOf(format) !== -1;
      const isLtM = file.size / 1024 / 1024 < 8;

      if (!isTYPE) {
        this.$message.error("上传文件只能是 PDF/ JPG/ PNG/ DOCX/ DOC 格式!");
      }
      if (!isLtM) {
        this.$message.error("上传文件大小不能超过 8MB!");
      }
      return isTYPE && isLtM;
    }, // PDF png jpg
    handleSuccess(response, file, fileList) {
      // 上传成功的回调
      if (response.code === 200) {
        fileList.map(item => {
          if (item.response) {
            this.$set(this.form.frdb_file, "code", item.response.data.code);
            this.$set(
              this.form.frdb_file,
              "origin_name",
              item.response.data.origin_name
            );
          } else {
            this.$set(this.form.frdb_file, "code", item.code);
            this.$set(this.form.frdb_file, "origin_name", item.name);
          }
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
        this.$set(this.form.frdb_file, "code", "");
        this.$set(this.form.frdb_file, "origin_name", "");
        this.fileList = [];
      }
    },
    handleRemove(file, fileList) {
      this.$set(this.form.frdb_file, "code", "");
      this.$set(this.form.frdb_file, "origin_name", "");
      this.fileList = [];
    },
    handleCheckTrue(status, type) {
      // status：3通过、2退回。type：1、2
      const Params = {
        id: this.query["5"]
      };
      if (type === 1) {
        // if (!this.status_content_1) {
        //     this.$message.warning('审批意见不能为空！');
        //     return false;
        // }
        Object.assign(Params, {
          statuszhi: status,
          statuszhi_content1: status === 3 ? this.status_content_1 : "",
          statuszhi_content2: status === 3 ? "" : this.status_content_1
        });
      } else if (type === 2) {
        // if (!this.status_content_2) {
        //     this.$message.warning('审批意见不能为空！');
        //     return false;
        // }
        Object.assign(Params, {
          status: status,
          status_content1: status === 3 ? this.status_content_2 : "",
          status_content2: status === 3 ? "" : this.status_content_2
        });
      }
      this.handleTrue(1, Params);
    },
    handlePreview(preview) {
      // 预览页  @preview：1签批单预览、2打印预览
      let content = this.$refs.ue.getUEContent();
      const Obj = Object.assign({}, this.form, { content });
      sessionStorage.setItem("yulan_100", JSON.stringify(Obj));
      if (preview === 1) {
        this.$router.push({
          name: "AppDocumentYngwInfo",
          query: {
            "1": false,
            "2": false,
            "3": true,
            "4": 0,
            "5": 0,
            "100": true // 预览
          }
        });
      } else {
        this.$router.push({
          name: "AppDocumentYngwPrint",
          query: {
            "100": true
          }
        });
      }
    },
    handleBack() {
      this.$router.go(-1);
    },
    keepEdit() {
      this.showData = JSON.parse(sessionStorage.getItem("yulan_100"));
      this.form = JSON.parse(JSON.stringify(this.showData));
      for (let key in this.form) {
        if (!this.$options.data().form.hasOwnProperty(key)) {
          this.$delete(this.form, key);
        }
      }
      Object.assign(this.form, {
        document_type: this.form.document_type - 0
      });
      this.$nextTick(() => {
        this.content = this.form.content;
        if (this.$refs.ue) {
          setTimeout(() => {
            this.$refs.ue.setUEContent(this.form.content);
          }, 500);
        }
      });
      sessionStorage.removeItem("yulan_100");
    }
  },
  beforeMount() {
    this.$set(this.form, "uid", this.userInfo.uid);
    this.headers = JSON.parse(this.$cookie.get("headers"));
  },
  mounted() {
    if (this.$refs.ue) {
      if (sessionStorage.getItem("yulan_100")) {
        // 继续编辑（从预览页返回编辑）
        this.keepEdit();
      } else {
        this.initData();
      }
    }
  }
};
</script>

<style scoped>
.app-document-yngw-form {
  padding: 60px 0;
  color: #aa3130;
}
.document-form-page-ueditor {
  width: 800px;
  text-align: left;
}
</style>
