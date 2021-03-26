<template>
  <div class="app-assess-result-history">
    <el-card>
      <div slot="header" class="clearfix">
        <div style="text-align: center">
          <span class="assess-result-history-title">{{ proData.pro_name }}</span>
        </div>
        <div class="fr" style="padding-right: 40px">
          <el-button type="primary" @click.native="$router.go(-1)">返回</el-button>
        </div>
      </div>
      <div style="padding-bottom: 50px">
        <el-form :inline="true" class="demo-form-inline" style="text-align: left">
          <el-form-item label="项目名称：">{{ proData.pro_name }}</el-form-item>
          <el-form-item label="项目编号：">{{ proData.pro_code }}</el-form-item>
          <el-form-item label="培训结束时间：">
            <span v-cloak>{{ proData.pro_px_end_time | TimestampChangeFilter }}</span>
          </el-form-item>
          <el-form-item label="是否迟报漏报：">{{ proData.pro_is_dgdwjs?'是':'否'}}</el-form-item>
          <el-form-item label="剩余考核分数：">{{ proapp_count_res }} 分</el-form-item>
          <el-form-item label="考核扣除总分数：">{{ proapp_count }} 分</el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          border
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%;margin-top: 50px"
        >
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">{{ scope.$index+1}}</template>
          </el-table-column>
          <el-table-column align="center" prop="date" label="考核日期">
            <template slot-scope="scope">
              <span v-cloak>{{ scope.row.create_time | TimestampChangeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="score" label="考核扣除分数"></el-table-column>
          <el-table-column header-align="center" label="考核详情项">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.score_key" :key="index" v-cloak>
                {{ index + 1}}、
                <span
                  style="border-bottom: 1px solid #000"
                >{{ rulesList[item].title }}</span>
                扣除
                <span
                  style="border-bottom: 1px solid #000"
                >{{ rulesList[item].score }}分</span>。
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="考核说明">
            <template slot-scope="scope">{{ scope.row.description?scope.row.description:'无'}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-assess-result-history",
  data() {
    return {
      tableData: [],
      proData: {},
      proapp_count: 0,
      proapp_count_res: 0,
      rulesList: {}
    };
  },
  methods: {
    ...mapActions(["getAssessResultHistory", "standardResult"]),
    initData(id) {
      this.getAssessResultHistory({
        data: {
          pro_id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.tableData = Data.list;
          this.proData = Data.prolist;
          this.proapp_count = Data.proapp_count;
          this.proapp_count_res = Data.proapp_count_res;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    initRule() {
      this.standardResult({
        data: {}
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data.list;
          for (let key in Data) {
            Data[key].forEach(item => {
              Object.assign(this.rulesList, {
                [item.id]: item
              });
            });
          }
        }
      });
    }
  },
  beforeMount() {
    const ID = this.$route.params.id;
    this.initRule();
    this.initData(ID);
  }
};
</script>

<style scoped>
.assess-result-history-title {
  font-size: 1.2em;
  color: #444;
  font-weight: bold;
  margin-bottom: 28px;
}
</style>
