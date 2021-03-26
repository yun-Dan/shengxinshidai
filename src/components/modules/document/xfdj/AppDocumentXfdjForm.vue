<template>
  <div class="app-document-xfdj-form">
    <div class="document-xfdj-form-head">
      <div class="document-xfdj-head-title">继续教育处信访处置记录单</div>
      <div class="clearfix">
        <span class="fr" style="margin-right: 150px; line-height: 3em">编号：</span>
      </div>
    </div>
    <div class="document-xfdj-form-table-box">
      <table border="1" width="100%" style="border-spacing : 0">
        <tr>
          <td colspan="4">
            <div class="xfdj-table-label">收件时间</div>
          </td>
          <td colspan="8">
            <el-date-picker
              v-model="form.time"
              type="date"
              value-format="timestamp"
              default-time="08:00:00"
              placeholder="选择日期"
              :disabled="query['3']"
              style="width: 100%"
            ></el-date-picker>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">信访来源</div>
          </td>
          <td colspan="8">
            <el-input
              v-model.trim="form.source"
              placeholder="请输入"
              :disabled="query['3']"
              style="width: 100%"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="xfdj-table-label">来访方式</div>
          </td>
          <td colspan="20">
            <el-select
              v-model="form.admission_type"
              placeholder="请选择"
              style="width: 100%"
              filterable
            >
              <template v-if="proConfig.admission_type">
                <el-option
                  v-for="(item, key) in proConfig.admission_type"
                  :key="key"
                  :label="item"
                  :value="key-0"
                ></el-option>
              </template>
            </el-select>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="xfdj-table-label">来访人</div>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">
              <el-input
                v-model.trim="form.visitor"
                type="textarea"
                rows="4"
                resize="none"
                placeholder="请输入（如：张三 / 匿名）"
                :disabled="query['3']"
                style="width: 100%"
              ></el-input>
            </div>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">
              <div>单位及职务</div>
              <div>（职称）</div>
            </div>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">
              <el-input
                v-model.trim="form.visitor_position"
                type="textarea"
                rows="4"
                resize="none"
                placeholder="请输入（如：继续教育学院，学生 / 无）"
                :disabled="query['3']"
                style="width: 100%"
              ></el-input>
            </div>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话</div>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">
              <el-input
                v-model.trim="form.visitor_tel"
                type="textarea"
                rows="4"
                resize="none"
                placeholder="请输入（如：13812345678 / 无）"
                :disabled="query['3']"
                style="width: 100%"
              ></el-input>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="xfdj-table-label">被反映人</div>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">
              <el-input
                v-model.trim="form.man"
                type="textarea"
                rows="4"
                resize="none"
                placeholder="请输入（如：李四）"
                :disabled="query['3']"
                style="width: 100%"
              ></el-input>
            </div>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">
              <div>单位及职务</div>
              <div>（职称）</div>
            </div>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">
              <el-input
                v-model.trim="form.man_position"
                type="textarea"
                rows="4"
                resize="none"
                placeholder="请输入（如：继续教育学院，学生）"
                :disabled="query['3']"
                style="width: 100%"
              ></el-input>
            </div>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话</div>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">
              <el-input
                v-model.trim="form.man_tel"
                type="textarea"
                rows="4"
                resize="none"
                placeholder="请输入（如：15712345678 / 无）"
                :disabled="query['3']"
                style="width: 100%"
              ></el-input>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="xfdj-table-label">接访人</div>
          </td>
          <td colspan="8">
            <el-input
              v-model.trim="form.people"
              placeholder="请输入"
              :disabled="query['3']"
              style="width: 100%"
            ></el-input>
          </td>
          <td colspan="4">
            <div class="xfdj-table-label">处理人</div>
          </td>
          <td colspan="8">
            <el-input
              v-model.trim="form.agent"
              placeholder="请输入"
              :disabled="query['3']"
              style="width: 100%"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="xfdj-table-label">问题摘要</div>
          </td>
          <td colspan="20">
            <div style="text-align: left">
              <UE :id="'problem'" :defaultMsg="problem" :config="UE_config.options2" ref="problem"></UE>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="xfdj-table-label">线索调查</div>
          </td>
          <td colspan="20">
            <div style="text-align: left">
              <UE
                :id="'investigation'"
                :defaultMsg="investigation"
                :config="UE_config.options2"
                ref="investigation"
              ></UE>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="xfdj-table-label">领导意见</div>
          </td>
          <td colspan="20">
            <div style="text-align: left">
              <UE
                :id="'instructions'"
                :defaultMsg="instructions"
                :config="UE_config.options2"
                ref="instructions"
              ></UE>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div class="xfdj-table-label">处理结果</div>
          </td>
          <td colspan="20">
            <div style="text-align: left">
              <UE :id="'results'" :defaultMsg="results" :config="UE_config.options2" ref="results"></UE>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div style="margin-top: 20px">
      <el-button v-if="!query['3']" type="primary" @click.native=" handleTrue(1, 1)">保 存</el-button>
      <el-button v-if="!query['3']" type="primary" @click.native=" handleTrue(1, 2)">保存并提交</el-button>
      <el-button @click.native="handleBack">返 回</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import UE from "@/components/compose/AppUE2";
import UE_config from '@/assets/js/UE_config.js'

export default {
  name: "app-document-xfdj-form",
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
        time: "", // 收件时间
        source: "", // 信访来源
        agent: "", // 处理人
        problem: "", // 问题摘要
        investigation: "", // 线索调查
        instructions: "", // 领导意见
        results: "", // 处理结果
        admission_type: null, // 来访形式
        visitor: "", // 来访人
        visitor_position: "", // 来访人职称
        visitor_tel: "", // 来访人电话
        man: "", // 被反映人
        man_position: "", // 被反映人职称
        man_tel: "", // 被反映人电话
        people: "", // 接访人
        status: 1,
        is_published: 1 // 1保存、2保存并提交
      },
      //富文本编辑框
      UE_config,
      problem: "", // 问题摘要
      investigation: "", // 线索调查
      instructions: "", // 领导意见
      results: "" // 处理结果
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  components: {
    UE
  },
  methods: {
    ...mapActions([
      "getDocumentXfdjList",
      "addDocumentXfdj",
      "editDocumentXfdj"
    ]),
    initData() {
      let query = this.$route.query;
      this.query = Object.assign({}, query, {
        //  1 is_check、2 is_chu、3 look、4 key、5 id
        "1":
          this.$route.query["1"] === true || this.$route.query["1"] === "true",
        "2":
          this.$route.query["2"] === true || this.$route.query["2"] === "true",
        "3":
          this.$route.query["3"] === true || this.$route.query["3"] === "true"
      });
      this.loading = true;

      if (this.query["4"] == -1) {
        this.loading = false;
      } else if (this.query["4"] == 0 && this.query["5"]) {
        if (this.loading) {
          this.getDocumentXfdjList({
            data: {
              id: this.query["5"]
            }
          }).then(data => {
            if (data.data.code === 200) {
              const Data = data.data.data;
              let list = Data.list || [];
              if (list.length) {
                this.showData = list[0];
                this.form = Object.assign(
                  {},
                  JSON.parse(JSON.stringify(this.showData)),
                  {
                    time: this.showData.time * 1000
                  }
                );
                for (let key in this.form) {
                  if (!this.$options.data().form.hasOwnProperty(key)) {
                    this.$delete(this.form, key);
                  }
                }
                this.$nextTick(() => {
                  this.problem = this.form.problem;
                  this.investigation = this.form.investigation;
                  this.results = this.form.results;
                  this.instructions = this.form.instructions;
                  if (this.$refs.problem) {
                    this.$refs.problem.setUEContent(this.form.problem);
                  }
                  if (this.$refs.investigation) {
                    this.$refs.investigation.setUEContent(
                      this.form.investigation
                    );
                  }
                  if (this.$refs.results) {
                    this.$refs.results.setUEContent(this.form.results);
                  }
                  if (this.$refs.instructions) {
                    this.$refs.instructions.setUEContent(
                      this.form.instructions
                    );
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
    handleBack() {
      this.$router.go(-1);
    },
    handleTrue(status, is_published) {
      // 确认修改当前编辑
      let problem = this.$refs.problem.getUEContent();
      let investigation = this.$refs.investigation.getUEContent();
      let instructions = this.$refs.instructions.getUEContent();
      let results = this.$refs.results.getUEContent();
      let Params = Object.assign(JSON.parse(JSON.stringify(this.form)), {
        problem,
        investigation,
        results,
        instructions,
        time: this.form.time ? parseInt(this.form.time / 1000) : 0,
        uid: this.query["4"] == -1 ? this.userInfo.uid : this.showData.uid
      });
      if (!Params.time) {
        this.$message({
          type: "warning",
          message: "请选择收件时间！"
        });
        return false;
      }
      if (!Params.source) {
        this.$message({
          type: "warning",
          message: "请输入信访来源！"
        });
        return false;
      }
      if (!Params.admission_type) {
        this.$message({
          type: "warning",
          message: "请选择来访方式！"
        });
        return false;
      }

      if (!Params.visitor) {
        this.$message({
          type: "warning",
          message: "来访人姓名不能为空！"
        });
        return false;
      }
      if (!Params.visitor_position) {
        this.$message({
          type: "warning",
          message: "来访人单位及职务不能为空！"
        });
        return false;
      }
      if (!Params.visitor_tel) {
        this.$message({
          type: "warning",
          message: "来访人电话不能为空！"
        });
        return false;
      }
      if (!Params.man) {
        this.$message({
          type: "warning",
          message: "被反映人姓名不能为空！"
        });
        return false;
      }
      if (!Params.man_position) {
        this.$message({
          type: "warning",
          message: "被反映人单位及职务不能为空！"
        });
        return false;
      }
      if (!Params.man_tel) {
        this.$message({
          type: "warning",
          message: "被反映人电话不能为空！"
        });
        return false;
      }

      if (!Params.people) {
        this.$message({
          type: "warning",
          message: "请输入接访人姓名！"
        });
        return false;
      }
      if (!Params.agent) {
        this.$message({
          type: "warning",
          message: "请输入处理人姓名！"
        });
        return false;
      }
      if (!Params.problem) {
        this.$message({
          type: "warning",
          message: "问题摘要不能为空！"
        });
        return false;
      }
      if (!Params.investigation) {
        this.$message({
          type: "warning",
          message: "线索调查不能为空！"
        });
        return false;
      }
      // if(!Params.instructions){
      //     this.$message({
      //         type:'warning',
      //         message:'领导意见不能为空！',
      //     });
      //     return false;
      // }
      // if(!Params.results){
      //     this.$message({
      //         type:'warning',
      //         message:'处理结果不能为空！',
      //     });
      //     return false;
      // }
      if (this.query["4"] == 0) {
        delete Params.uid;
      }

      if (status) {
        Object.assign(Params, {
          status: status,
          is_published: is_published,
          status_content1: "",
          status_content2: ""
        });
      }

      this.loading = true;
      if (this.loading) {
        if (this.query["4"] == -1) {
          // 新增
          this.addDocumentXfdj({
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
          this.editDocumentXfdj({
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
  },
  created () {
    this.$set(this.form, "uid", this.userInfo.uid)
  },
  mounted() {
    this.initData();
  }
};
</script>

<style scoped>
.app-document-xfdj-form {
  /*width: 700px;*/
  width: 784px;
  margin: 0 auto;
  padding: 40px 0;
  font-size: 18px;
  text-align: center;
}
.document-xfdj-head-title {
  font-size: 30px;
  line-height: 2em;
}
.xfdj-table-label {
  /*width: 116px;*/
  width: 126px;
}
</style>
