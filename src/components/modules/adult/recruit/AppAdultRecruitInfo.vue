<template>
  <div class="app-adult-recruit-form" v-loading="loading">
    <el-form
      class="el-form submit-el-form"
      :label-position="query['3'] ? '' : 'top'"
      label-width="140px"
    >
      <el-form-item v-if="query['3']" label="审核状态：">
        <span v-if="showData.audit === 0" class="warning">待审核</span>
        <span v-if="showData.audit === 1" class="success">审核通过</span>
        <span v-if="showData.audit === 2" class="danger">审核不通过</span>
        <span v-if="query['3'] && showData.audit > 0" class="info">
          <template
            v-if="showData.audit === 1 && showData.statuszhi_content1"
          >（{{ showData.statuszhi_content1}}）</template>
          <template
            v-if="showData.audit === 2 && showData.statuszhi_content2"
          >（{{ showData.statuszhi_content2}}）</template>
        </span>
      </el-form-item>
      <el-form-item label="专业：">{{ form.name }}（{{ form.code }}）</el-form-item>
      <el-form-item label="办学层次：">
        <template v-if="proConfig.education">
          <span>{{ proConfig.education[form.education] }}</span>
        </template>
      </el-form-item>
      <el-form-item label="办学期限：">
        <span>{{ form.date1 }} 至 {{ form.date2 }}</span>
      </el-form-item>
      <el-form-item label="办学地点：">{{ form.url }}</el-form-item>
      <el-form-item label="招生人数：">{{ form.introduction}} 人</el-form-item>
      <el-form-item :label="`${new Date(form.date1).getFullYear()}年学费：`">{{ form.tuition1 }} 元</el-form-item>
      <el-form-item :label="`${new Date(form.date1).getFullYear() + 1}年学费：`">{{ form.tuition2 }} 元</el-form-item>
      <el-form-item :label="`${new Date(form.date1).getFullYear() + 2}年学费：`">{{ form.tuition3 }} 元</el-form-item>
      <el-form-item label="招生章程附件：" :rules="[{required: !query['3']}]">
        <el-link
          v-if="form.frdb_file"
          type="primary"
          icon="el-icon-view"
          @click="handleLookFile(form.frdb_file)"
        >点击查看</el-link>
        <span v-else class="danger">未上传附件</span>
      </el-form-item>
      <el-form-item label="招生章程文本：" v-cloak>
        <div v-html="form.articles" class="recruit-articles-box"></div>
      </el-form-item>
      <template v-if="query['1'] && userInfo.role === 1">
        <el-form-item label="推送至财务收费系统：" :rules="[{required: !query['3']}]">
          <el-radio-group v-model="form_check.financial" style="margin-left: 30px">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核结果：" :rules="[{required: true}]">
          <el-radio-group v-model="form_check.audit" style="margin-left: 30px">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核说明：" :rules="[{required: true}]">
          <el-input
            v-model.trim="form_check.content"
            type="textarea"
            rows="2"
            :maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
      </template>
      <el-form-item class="text-align-center">
        <el-button
          v-if="query['1'] && userInfo.role === 1"
          type="primary"
          @click.native=" handleCheckTrue"
        >确 定</el-button>
        <el-button @click.native="handleBack">返 回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-adult-recruit-form",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      query: {
        "1": false, // is_check
        "2": [], // name
        "3": false, // look  （true查看、false新增或编辑）
        "4": 1, // key（1新增，0编辑）
        "5": 0 // id
      },
      showData: {},
      form: {
        uid: 0,
        type: 1, // 类型：1成人学历 2网络学历
        name: "", // 专业名称（如果是多个中间用,分开，是英文的逗号）
        code: "",
        education: 3, // 层次
        date1: null, // 开始时间
        date2: null, // 结束时间
        url: "", // 地点
        introduction: null, // 人数
        tuition1: 0, // 第一年学费
        tuition2: 0, // 第二年学费
        tuition3: 0, // 第三年学费
        articles: "", // 招生章程文本
        frdb_file: "", // 招生章程附件上传PDF文件code码
        is_status: 0 // 0保存、1保存并提交
      },
      articles: "", // 招生章程文本
      fileList: [],
      name: [],
      typeConfig: {
        1: "成人学历",
        2: "网络学历"
      },
      // 审核
      form_check: {
        id: null,
        audit: 1, // 1审核通过、2审核不通过
        content: "", // 审核不通过原因
        financial: 0 // 是否推送至财务收费系统
      }
    };
  },
  computed: {
    ...mapState(["lookUrl", 'userInfo'])
  },
  methods: {
    ...mapActions(["getAdultRecruitInfo", "checkAdultRecruit"]),
    initData() {
      let query = this.$route.query;
      this.query = Object.assign({}, query, {
        "1":
          this.$route.query["1"] === true || this.$route.query["1"] === "true",
        "3":
          this.$route.query["3"] === true || this.$route.query["3"] === "true"
      });
      this.loading = true;
      if (this.query["4"] == 1) {
        this.loading = false;
      } else if (this.query["4"] == 0 && this.query["5"]) {
        if (this.loading) {
          this.getAdultRecruitInfo({
            id: this.query["5"],
            data: {}
          }).then(data => {
            if (data.data.code === 200) {
              const Data = data.data.data;
              this.showData = Data;
              this.form = JSON.parse(JSON.stringify(this.showData));
              for (let key in this.form) {
                if (!this.$options.data().form.hasOwnProperty(key)) {
                  this.$delete(this.form, key);
                }
              }
              Object.assign(this.form, {
                education: this.form.education - 0
              });
              if (this.form.frdb_file) {
                this.fileList = [
                  {
                    code: this.form.frdb_file,
                    name: "招生简章附件"
                  }
                ];
              }
              if (this.query["1"]) {
                this.handleCheck();
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
    handleCheck() {
      Object.assign(this.form_check, this.$options.data().form_check, {
        id: this.showData.id,
        audit:
          this.showData.audit > 0
            ? this.showData.audit
            : this.$options.data().form_check.audit,
        content:
          this.showData.audit > 0
            ? this.showData.audit === 1
              ? this.showData.statuszhi_content1
              : this.showData.statuszhi_content2
            : ""
      });
    },
    handleCheckTrue() {
      let Params = {
        id: this.form_check.id,
        audit: this.form_check.audit,
        financial: this.form_check.financial
      };
      if (!this.form_check.content) {
        this.$message({
          message: "“审核说明”不能为空！",
          type: "warning"
        });
        return false;
      }
      if (Params.audit === 1) {
        Object.assign(Params, {
          statuszhi_content1: this.form_check.content,
          statuszhi_content2: ""
        });
      } else if (Params.audit === 2) {
        Object.assign(Params, {
          statuszhi_content1: "",
          statuszhi_content2: this.form_check.content
        });
      }
      this.loading = true;
      if (this.loading) {
        this.checkAdultRecruit({
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
    },
    handleBack() {
      this.$router.go(-1);
    },
    handleLookFile(code) {
      window.open(this.lookUrl + "/" + code);
    }
  },
  mounted() {
    this.initData();
  }
};
</script>

<style scoped>
.app-adult-recruit-form {
  min-width: 500px;
  max-width: 800px;
  margin: 0 auto;
  padding: 50px 30px;
}
.recruit-articles-box {
  width: 600px;
}
</style>
