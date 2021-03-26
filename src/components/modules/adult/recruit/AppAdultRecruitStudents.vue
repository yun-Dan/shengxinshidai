<template>
  <div class="app-adult-recruit-students" v-loading="loading">
    <div class="recruit-students-box">
      <div class="clearfix">
        <div class="fl" style="line-height: 60px">
          <el-button type="text" icon="el-icon-d-arrow-left" @click="$router.go(-1)">返回</el-button>
          <span style="font-size: 18px;">{{ query.name }}</span>
          <span v-if="proConfig.education">（{{ proConfig.education[query.education] }}）</span>
          <span style="padding-left: 20px">招生人数：{{ query.introduction }}</span>
        </div>
        <div style="margin-bottom: 20px" class="fr">
          <el-input
            placeholder="请输入姓名"
            v-model="getForm.name"
            clearable
            style="width: 180px; margin-left: 10px"
            class="fr"
          >
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
          <el-select
            v-model="getForm.fees"
            placeholder="-- 缴费状态 --"
            clearable
            style="width: 120px"
            class="fr"
            @change="handleSearch"
          >
            <el-option label="已缴费" :value="1"></el-option>
            <el-option label="未缴费" :value="2"></el-option>
          </el-select>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        default-expand-all
        :header-cell-style="{backgroundColor:'#fafafa'}"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="right"
              label-width="125px"
              inline
              v-for="(item, index) in props.row.check"
              :key="index"
            >
              <el-form-item :label="`${item.year}学年应缴学费：`">
                <span>{{ item.fees }} 元</span>
              </el-form-item>
              <el-form-item label="缴费发票：">
                <el-button v-if="`${item.is_fees}` === '1'" type="text">查看</el-button>
                <span v-else-if="`${item.is_fees}` === '0'" class="danger" style="font-size: 12px">无</span>
              </el-form-item>
              <el-form-item label="缴费状态：">
                <el-tag
                  v-if="`${item.is_fees}` === '1'"
                  size="mini"
                  type="success"
                  effect="plain"
                >已缴</el-tag>
                <el-tag
                  v-else-if="`${item.is_fees}` === '0'"
                  size="mini"
                  type="danger"
                  effect="plain"
                >未缴</el-tag>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="姓名"></el-table-column>
        <el-table-column align="center" prop="code" label="学号"></el-table-column>
        <el-table-column align="center" prop="cardno" label="身份证号"></el-table-column>
        <el-table-column align="center" prop="grade" label="年级"></el-table-column>
        <el-table-column align="center" prop="zymc" label="专业">
          <template slot-scope="scope">{{ scope.row.zymc }}（{{ scope.row.zydm }}）</template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="getForm.page"
          :page-size="getForm.limit"
          layout="total, prev, pager, next ,jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-adult-recruit-students",
  data() {
    return {
      loading: false,
      getForm: {
        id: null,
        name: "", // 学生姓名
        fees: null, // 是否缴费：1已缴、2未缴
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0,
      query: {},
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {}
    };
  },
  methods: {
    ...mapActions(["getAdultRecruitStudentsList"]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getAdultRecruitStudentsList({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.tableData = Data.list;
            this.total = Data.dataCount;
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
    handleSearch() {
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
    }
  },
  created() {
    this.query = this.$route.query;
    if (this.query.id) {
      this.$set(this.getForm, "id", this.query.id);
      if (this.getForm.id) {
        this.initData();
      }
    }
  }
};
</script>

<style scoped>
.app-adult-recruit-students {
  padding: 10px;
}
.recruit-students-box {
  padding: 20px 20px 0;
}
</style>
