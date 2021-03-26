<template>
  <div class="document-issue" v-loading="loading">
    <div class="document-issue-main" v-if="type && query.issue == 0">
      <div class="text-align-center" style="margin-bottom: 20px">
        <span style="font-size: 18px">{{ query.title }}</span>
        <span>（ {{ query.code }} ）</span>
      </div>
      <div class="app-el-transfer">
        <el-transfer
          v-model="form_lssued.user"
          :data="pushData"
          :titles="['待选人员名单', '已选人员名单']"
          filter-placeholder="姓名、部门关键字搜索"
          filterable
          style="height: 500px"
        ></el-transfer>
      </div>
      <div class="text-align-center">
        <p v-if="query.is_sign == 0" style="font-size: 12px; text-align: left">
          <span class="danger">*</span>
          <span class="warning">待签章</span>，
          <span class="info">请先完成签章，签章完成后可进行下发操作！</span>
        </p>
        <el-button v-if="query.is_sign == 0" type="primary" @click="handleToSign">签 章</el-button>
        <el-button v-else type="primary" @click="handleLssuedTrue">下 发</el-button>
        <el-button @click="handleBack">返 回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "document-issue",
  data() {
    return {
      loading: false,
      type: null, // 1公文、2纪要
      query: {},
      //下发
      form_lssued: {
        id: null,
        user: []
      },
      lssuedUsers: [] // 待下发人员列表（工作人员列表）
    };
  },
  computed: {
    pushData() {
      return this.lssuedUsers.map(item => {
        return {
          key: item.id,
          label: `${item.realname}${
            item.c_name ? "（" + item.c_name + "）" : ""
          }`,
          disabled: false
        };
      });
    }
  },
  methods: {
    ...mapActions(["getUsers", "lssuedDocumentYngw", "lssuedDocumentHyjy"]),
    initData() {
      const Route = this.$route;
      this.query = Route.query;
      this.loading = true;
      if (this.loading && this.query.id) {
        this.$set(this.form_lssued, "id", this.query.id);
        if (Route.name === "AppDocumentYngwIssue") {
          this.type = 1;
        } else if (Route.name === "AppDocumentHyjyIssue") {
          this.type = 2;
        }
        this.getLssuedUsers();
      }
    },
    getLssuedUsers() {
      // 获取待下发人员列表
      this.loading = true;
      if (this.loading) {
        this.getUsers({
          data: {
            tp: 2, // 1管理员 2工作人员
            page: 1,
            limit: 999999
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.lssuedUsers = Data.list;
            this.loading = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleLssuedTrue() {
      const Params = {
        id: this.form_lssued.id
      };
      if (this.form_lssued.user && !this.form_lssued.user.length) {
        this.$message({
          message: "请选择下发人员名单！",
          type: "warning"
        });
        return false;
      } else {
        if (this.type === 1) {
          Object.assign(Params, {
            document_user: this.form_lssued.user
          });
        } else if (this.type === 2) {
          Object.assign(Params, {
            meeting_user: this.form_lssued.user
          });
        }
      }
      this.loading = true;
      if (this.loading) {
        if (this.type === 1) {
          this.lssuedDocumentYngw({
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
                  this.dialog_loading_lssued = false;
                }
              });
            }
          });
        } else if (this.type === 2) {
          this.lssuedDocumentHyjy({
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
                  this.dialog_loading_lssued = false;
                }
              });
            }
          });
        }
      }
    },
    handleToSign() {
      if (this.type === 1) {
        this.$router.push({
          name: "AppDocumentYngwPrint",
          query: {
            print: `1${this.randomNumPublic(10, 99)}${
              this.query.id
            }${this.randomNumPublic(0, 9)}`,
            is_sign: this.query.is_sign // 是否签章（1是、0否）
          }
        });
      } else if (this.type === 2) {
        this.$router.push({
          name: "AppDocumentHyjyPrint",
          query: {
            print: `2${this.randomNumPublic(10, 99)}${
              this.query.id
            }${this.randomNumPublic(0, 9)}`,
            is_sign: this.query.is_sign // 是否签章（1是、0否）
          }
        });
      }
    },
    handleBack() {
      this.$router.go(-1);
    }
  },
  created() {
    this.initData();
  }
};
</script>

<style scoped>
.document-issue {
  padding: 30px 20px;
}
.document-issue-main {
  width: 700px;
  margin: 0 auto;
}
.app-el-transfer {
  margin-bottom: 20px;
}
</style>
