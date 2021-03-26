<template>
  <div class="app-adult-paper-list" v-loading="loading">
    <el-card>
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button @click.native="handleReset" type="primary" icon="el-icon-menu">全部</el-button>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.education" placeholder="请选择" @change="handleSearch">
                <el-option key="层次" label=" -- 办学层次 -- " :value="null" style="width: 134px"></el-option>
                <el-option
                  v-for="(item, key) in proConfig.education"
                  :key="key"
                  :label="item"
                  :value="item"
                  style="width: 134px"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="getForm.grade"
                type="year"
                format="yyyy级"
                value-format="yyyy"
                placeholder="选择年级"
                style="width: 140px"
                @change="handleSearch"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索试卷名称"
                v-model="getForm.name"
                class="input-with-select"
                clearable
                style="width: 210px"
              >
                <el-button slot="append" @click.native="handleSearch" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column align="center" prop="name" label="试卷名称"></el-table-column>
          <el-table-column align="center" prop="grade" label="年级"></el-table-column>
          <el-table-column align="center" prop="education" label="办学层次"></el-table-column>
          <el-table-column align="center" prop="profession" label="专业"></el-table-column>
          <el-table-column align="center" prop="cou_name" label="课程名称"></el-table-column>
          <el-table-column align="center" prop="score" label="试卷总分"></el-table-column>
          <el-table-column align="center" label="附件">
            <template>
              ???
              <!-- {{ scope.row.files }} -->
            </template>
          </el-table-column>
          <el-table-column align="center" prop="create_time" label="创建日期"></el-table-column>
          <el-table-column align="center" prop="user" label="创建人"></el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getForm.page"
          :page-size="getForm.limit"
          layout="total, prev, pager, next ,jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-adult-paper-list",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      getForm: {
        grade: null,
        name: "",
        profession: null,
        course: null,
        education: null,
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0
    };
  },
  methods: {
    ...mapActions(["getAdultPaperList"]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getAdultPaperList({
          data: this.getForm
        }).then(data => {
          if (data.data.code == 200) {
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
    handleReset() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
    }
  },
  created() {
    this.initData();
  }
};
</script>
