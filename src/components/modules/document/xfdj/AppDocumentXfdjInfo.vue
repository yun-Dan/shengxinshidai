<template>
  <div class="app-document-xfdj-info">
    <div id="subOutputRank-print">
      <div class="document-xfdj-info-content">
        <div class="document-xfdj-form-head">
          <div class="document-xfdj-head-title">继续教育处信访处置记录单</div>
          <div class="clearfix">
            <div
              class="fr"
              style="min-width: 150px; line-height: 3em; font-weight: bolder"
            >编号：{{ showData.document_official }}</div>
          </div>
        </div>
        <div class="document-xfdj-form-table-box">
          <table border="1" width="100%" style="border-spacing : 0">
            <tr>
              <td colspan="4">
                <div class="xfdj-table-label">收件时间</div>
              </td>
              <td colspan="8">
                <span
                  v-if="showData.time"
                  style="padding: 0 10px"
                >{{ showData.time | TimestampChangeFilter }}</span>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">信访来源</div>
              </td>
              <td colspan="8">
                <span style="padding: 0 10px">{{ showData.source }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div class="xfdj-table-label">来访方式</div>
              </td>
              <td colspan="20">
                <template v-if="proConfig.admission_type">
                  <template v-for="(item, key) in proConfig.admission_type">
                    <img
                      v-if="showData.admission_type == key"
                      :key="`${key}-1`"
                      src="../../../../assets/images/yes.gif"
                      alt
                    >
                    <img v-else :key="`${key}-2`" src="../../../../assets/images/no.gif" alt>
                    <span :key="key" style="padding-right: 20px">{{ item }}</span>
                  </template>
                </template>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div class="xfdj-table-label">来访人</div>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">{{ showData.visitor }}</div>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">
                  <div>单位及职务</div>
                  <div>（职称）</div>
                </div>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">{{ showData.visitor_position }}</div>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">电&nbsp;&nbsp;&nbsp;&nbsp;话</div>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">{{ showData.visitor_tel }}</div>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div class="xfdj-table-label">被反映人</div>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">{{ showData.man }}</div>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">
                  <div>单位及职务</div>
                  <div>（职称）</div>
                </div>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">{{ showData.man_position }}</div>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">电&nbsp;&nbsp;&nbsp;&nbsp;话</div>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">{{ showData.man_tel }}</div>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div class="xfdj-table-label">接访人</div>
              </td>
              <td colspan="8">
                <span style="padding: 0 10px">{{ showData.people }}</span>
              </td>
              <td colspan="4">
                <div class="xfdj-table-label">处理人</div>
              </td>
              <td colspan="8">
                <span style="padding: 0 10px">{{ showData.agent }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div class="xfdj-table-label">问题摘要</div>
              </td>
              <td colspan="20">
                <div style="text-align: left; padding: 10px">
                  <div v-html="showData.problem"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div class="xfdj-table-label">线索调查</div>
              </td>
              <td colspan="20">
                <div style="text-align: left; padding: 10px">
                  <div v-html="showData.investigation"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div class="xfdj-table-label">领导意见</div>
              </td>
              <td colspan="20">
                <div style="text-align: left; padding: 10px; min-height: 60px">
                  <div v-html="showData.instructions"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div class="xfdj-table-label">处理结果</div>
              </td>
              <td colspan="20">
                <div style="text-align: left; padding: 10px; min-height: 60px">
                  <div v-html="showData.results"></div>
                </div>
              </td>
            </tr>
          </table>
          <div
            v-if="query['3']&&!query['6']"
            style="line-height: 2em; text-align: left; padding-top: 20px"
          >
            <template v-if="showData.status === 1">
              <span class="warning">待审核</span>
            </template>
            <template v-if="showData.status === 2">
              <span class="danger">不通过：</span>
              {{ showData.status_content2 }}
            </template>
            <template v-if="showData.status === 3">
              <span class="success">通过：</span>
              {{ showData.status_content1 }}
            </template>
          </div>
        </div>
      </div>
    </div>
    <div style="padding: 20px">
      <el-form
        v-if="query['3']&&query['1']"
        style="text-align: left"
        label-position="left"
        label-width="90px"
      >
        <el-form-item label="审批结果：" :rules="[{required: true}]">
          <el-radio-group v-model="status">
            <el-radio :label="3">通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批说明：" :rules="[{required: true}]">
          <el-input
            type="textarea"
            v-model="status_content"
            rows="3"
            maxlength="600"
            show-word-limit
            placeholder="请输入审批说明"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: center;">
      <el-button
        v-if="userInfo.role === 1 && query['1']"
        type="primary"
        @click.native=" handleCheckTrue"
      >确 定</el-button>
      <el-button
        v-if="userInfo.role === 1 && query['3'] && query['6']"
        type="primary"
        @click.native=" handlePrint"
      >打 印</el-button>
      <el-button @click.native="handleBack">返 回</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-document-xfdj-info",
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
        "5": 0, // id：编辑时的id
        "6": false // print：是否打印
      },
      showData: {},
      // 审批
      status: 3, // 1待审核(默认)  2审核不通过 3审核通过
      status_content: "" // 审批说明
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getDocumentXfdjList", "checkDocumentXfdj"]),
    initData() {
      let query = this.$route.query;
      this.query = Object.assign({}, query, {
        //  1 is_check、2 is_chu、3 look、4 key、5 id、6 print
        "1":
          this.$route.query["1"] === true || this.$route.query["1"] === "true",
        "2":
          this.$route.query["2"] === true || this.$route.query["2"] === "true",
        "3":
          this.$route.query["3"] === true || this.$route.query["3"] === "true",
        "6":
          this.$route.query["6"] === true || this.$route.query["6"] === "true"
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
                this.status =
                  this.showData.status > 1
                    ? this.showData.status
                    : this.$options.data().status;
                if (this.status === 2) {
                  this.status_content = this.showData.status_content2;
                } else if (this.status === 3) {
                  this.status_content = this.showData.status_content1;
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
    },
    handleBack() {
      this.$router.go(-1);
    },
    handleCheckTrue() {
      // 确认修改当前编辑
      if (!this.status_content) {
        this.$message({
          type: "warning",
          message: "请输入审批说明！"
        });
        return false;
      }
      const Params = {
        id: this.query["5"] - 0,
        status: this.status,
        status_content1: this.status === 2 ? "" : this.status_content,
        status_content2: this.status === 3 ? "" : this.status_content
      };

      this.loading = true;
      if (this.loading) {
        this.checkDocumentXfdj({
          data: Params
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogVisible = false;
            this.handleBack();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialogLoading = false;
              }
            });
          }
        });
      }
    },
    handlePrint() {
      let subOutputRankPrint = document.getElementById("subOutputRank-print");
      let newContent = subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    }
  },
  mounted() {
    this.initData();
  }
};
</script>

<style scoped>
.app-document-xfdj-info {
  width: 680px;
  margin: 0 auto;
  padding: 40px 0;
  text-align: center;
}
.document-xfdj-info-content {
  /*width: 700px;*/
  width: 680px;
  margin: 0 auto;
  font-size: 18px;
  text-align: center;
  font-family: "仿宋", "FangSong";
}
.document-xfdj-head-title {
  font-size: 30px;
  line-height: 2em;
  font-weight: bolder;
  font-family: "方正小标宋简体", "新宋体", "NSimSun", "宋体", "SimSun",
    "微软雅黑", "Microsoft YaHei";
}
table tr td {
  overflow: hidden;
}
.xfdj-table-label {
  width: 110px;
  padding: 12px 0;
}
img {
  vertical-align: middle;
  width: 16px;
  margin-bottom: 3px;
}
</style>
