<template>
  <div
    class="app-adult-recruit-year"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card class="box-card">
      <div v-if="userInfo.role !== 1" slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button type="primary" icon="el-icon-plus" @click.native="handleUpdate(1)">新增</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="news inform-main" v-cloak>
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column align="center" label="序号" type="index" width="50"></el-table-column>
          <el-table-column align="center" prop="add_year" label="年级">
            <template slot-scope="scope">{{ scope.row.add_year }}级专业管理</template>
          </el-table-column>
          <el-table-column align="center" prop="education" label="层次数量"></el-table-column>
          <el-table-column align="center" prop="name" label="专业数量"></el-table-column>
          <el-table-column align="center" label="操作" width="220px">
            <template slot-scope="scope">
              <el-button type="text" @click="handleInfo(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-adult-recruit-year",
  data() {
    return {
      loading: false,
      getForm: {
        type: 1 // 1成人学历 2网络学历
      },
      tableData: []
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getAdultRecruitYearList"]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getAdultRecruitYearList({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.tableData = Data.list || [];
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
    handleUpdate(key, val, look = false, check = false) {
      // key：1新增、0编辑
      const Params = {
        "1": check, // is_check
        "2": [], // name
        "3": look, // look
        "4": key, // key
        "5": key === 1 ? 0 : val.id // id
      };
      if (!look) {
        this.$router.push({
          name: "AppAdultRecruitForm",
          query: Params
        });
      }
    },
    handleInfo(val) {
      this.$router.push({
        name: "AppAdultRecruitProfession",
        query: {
          y: val.add_year
        }
      });
    }
  },
  created() {
    this.initData();
  }
}
</script>
