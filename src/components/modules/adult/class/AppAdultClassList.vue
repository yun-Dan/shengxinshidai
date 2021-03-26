<template>
  <div class="app-adult-class-list" v-loading="loading">
    <el-card>
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button @click.native="handleReset" type="primary" icon="el-icon-menu">全部</el-button>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select
                v-model="getForm.type"
                placeholder="-- 班级分类 --"
                @change="handleSearch"
                clearable
              >
                <el-option label="夜大学" :value="1"></el-option>
                <el-option label="教学站" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="getForm.grade"
                type="year"
                format="yyyy级"
                placeholder="选择年级"
                style="width: 140px"
                @change="handleSearch"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索班级名称"
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
          <el-table-column align="center" prop="class" label="班号"></el-table-column>
          <el-table-column align="center" prop="name" label="班级名称"></el-table-column>
          <el-table-column align="center" label="班级分类">
            <template slot-scope="scope">
              <el-tag size="mini" effect="plain" v-if="scope.row.type === 1">夜大学</el-tag>
              <el-tag size="mini" effect="plain" type="success" v-else-if="scope.row.type === 2">教学站</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="grade" label="年级"></el-table-column>
          <el-table-column align="center" prop="education_level" label="层次"></el-table-column>
          <el-table-column align="center" prop="profession" label="专业"></el-table-column>
          <el-table-column align="center" label="学习时间">
            <template slot-scope="scope">
              {{ scope.row.start_time | TimestampChangeFilter }}
              <template v-if="scope.row.end_time">
                <br>至
                <br>
                {{ scope.row.end_time | TimestampChangeFilter }}
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="teachers" label="班主任"></el-table-column>
          <el-table-column align="center" prop="create_time" label="创建日期">
            <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="handleInfo(1, scope.row)">学生信息</el-button>
              </div>
              <div>
                <el-button type="text" @click="handleInfo(2, scope.row)">课表信息</el-button>
              </div>
            </template>
          </el-table-column>
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
  name: "app-adult-class-list",
  data() {
    return {
      loading: false,
      getForm: {
        type: null,
        grade: null,
        name: "",
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0
    };
  },
  methods: {
    ...mapActions(["getAdultClassList"]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getAdultClassList({
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
    handleInfo(type, val) {
      // 1学生信息、2课表信息
      const query = {
        class: val.id
      };
      if (type === 1) {
        this.$router.push({
          name: "AppAdultClassStudentList",
          query
        });
      } else if (type === 2) {
        this.$router.push({
          name: "AppAdultClassScheduleList",
          query
        });
      }
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
