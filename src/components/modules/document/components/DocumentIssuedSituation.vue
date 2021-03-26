<template>
  <div class="document-issue-situation" v-loading="loading">
    <div class="document-content-issue-situation" v-if="type">
      <div class="clearfix" style="margin-right: 10px">
        <div class="fl">
          <div
            style="font-size: 18px; line-height: 2em"
          >{{ type === 1 ? showData.document.title : showData.meeting.title }}</div>
          <div style="margin-bottom: 10px">
            <el-tag size="mini">
              <template
                v-if="type===1 && proConfig.document_type"
              >{{ proConfig.document_type[showData.document.document_type] }}</template>
              <template
                v-else-if="type===2 && proConfig.meeting_type"
              >{{ proConfig.meeting_type[showData.meeting.type] }}</template>
            </el-tag>
            <span>{{ type === 1 ? showData.document.document_official : showData.meeting.document_official}}</span>
          </div>
        </div>
        <el-button type="primary" size="small" @click="$router.go(-1)" class="fr">返 回</el-button>
      </div>
      <div>
        <el-table :data="showData.list" size="mini" border style="width: 100%">
          <el-table-column align="center" type="index" label="序号"></el-table-column>
          <el-table-column align="center" prop="username" label="职工号"></el-table-column>
          <el-table-column align="center" prop="realname" label="姓名"></el-table-column>
          <el-table-column align="center" prop="college" label="部门名称"></el-table-column>
          <el-table-column align="center" prop="job" label="职务"></el-table-column>
          <el-table-column align="center" prop="tel" label="办公电话"></el-table-column>
          <el-table-column align="center" prop="mobile" label="手机"></el-table-column>
          <el-table-column align="center" prop="address" label="查阅状态">
            <template slot-scope="scope">
              <template v-if="scope.row.ck">
                <span class="success">已阅</span>
                <div>{{ scope.row.ctime | TimestampChangeFilter }}</div>
              </template>
              <span v-else class="info">未阅</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "document-issue-situation",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      type: null, // 1公文、2纪要
      showData: {
        document: {},
        meeting: {},
        list: []
      }
    };
  },
  methods: {
    ...mapActions(["situationDocumentYngw", "situationDocumentHyjy"]),
    initData() {
      const Route = this.$route;
      const ID = Route.query.id;
      this.loading = true;
      if (this.loading && ID) {
        if (Route.name === "AppDocumentYngwIssueSituation") {
          this.type = 1;
          this.situationDocumentYngw({
            data: {
              id: ID
            }
          }).then(data => {
            if (data.data.code === 200) {
              const Data = data.data.data;
              this.showData = Data;
              this.loading = false;
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error
              });
            }
          });
        } else if (Route.name === "AppDocumentHyjyIssueSituation") {
          this.type = 2;
          this.situationDocumentHyjy({
            data: {
              id: ID
            }
          }).then(data => {
            if (data.data.code === 200) {
              const Data = data.data.data;
              this.showData = Data;
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
    }
  },
  created() {
    this.initData();
  }
};
</script>

<style scoped>
.document-issue-situation {
  padding: 30px 20px;
  max-width: 1200px;
  min-width: 600px;
  margin: 0 auto;
}
</style>
