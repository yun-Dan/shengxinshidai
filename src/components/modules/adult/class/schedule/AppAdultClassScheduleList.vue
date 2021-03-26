<template>
  <div class="app-adult-class-schedule-list" v-loading="loading">
    <el-card>
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group>
            <el-button type icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
            <el-button @click.native="handleReset" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select
                v-model="getForm.session"
                placeholder=" -- 选择学期 -- "
                @change="handleSearch"
                clearable
              >
                <el-option key="1" label="第一学期" :value="1" style="width: 134px"></el-option>
                <el-option key="2" label="第二学期" :value="2" style="width: 134px"></el-option>
                <el-option key="3" label="第三学期" :value="3" style="width: 134px"></el-option>
                <el-option key="4" label="第四学期" :value="4" style="width: 134px"></el-option>
                <el-option key="5" label="第五学期" :value="5" style="width: 134px"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="getForm.class_time"
                placeholder=" -- 上课时间 -- "
                @change="handleSearch"
                clearable
              >
                <el-option key="1" label="上午" :value="1" style="width: 134px"></el-option>
                <el-option key="2" label="下午" :value="2" style="width: 134px"></el-option>
                <el-option key="4" label="晚上" :value="4" style="width: 134px"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索课程名称"
                v-model="getForm.course"
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
          <el-table-column align="center" prop="course_code" label="课程代码"></el-table-column>
          <el-table-column align="center" prop="course_name" label="课程名称"></el-table-column>
          <el-table-column align="center" prop="session" label="学期">
            <template slot-scope="scope">
              <span v-if="scope.row.session == 1">第一学期</span>
              <span v-else-if="scope.row.session == 2">第二学期</span>
              <span v-else-if="scope.row.session == 3">第三学期</span>
              <span v-else-if="scope.row.session == 4">第四学期</span>
              <span v-else-if="scope.row.session == 5">第五学期</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否免修">
            <template slot-scope="scope">
              <span v-if="scope.row.exemption == 1">是</span>
              <span v-else-if="scope.row.session == 0">否</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="上课日期">
            <template slot-scope="scope">{{ scope.row.start_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" label="上课时间">
            <template slot-scope="scope">
              <el-tag size="mini" effect="plain" v-if="scope.row.class_time === 1">上午</el-tag>
              <el-tag size="mini" effect="plain" type="warning" v-if="scope.row.class_time === 2">下午</el-tag>
              <el-tag size="mini" effect="plain" type="info" v-if="scope.row.class_time === 4">晚上</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="teacher_name" label="授课教师"></el-table-column>
          <el-table-column align="center" prop="code" label="教师代码"></el-table-column>
          <el-table-column align="center" prop="classroom" label="教室"></el-table-column>
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
  name: "app-adult-class-schedule-list",
  data() {
    return {
      loading: false,
      getForm: {
        class: null,
        session: null,
        profession: null,
        class_time: null,
        course: "",
        teacher: "",
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0,
      query: {
        class: null
      }
    };
  },
  methods: {
    ...mapActions(["getAdultClassScheduleList"]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getAdultClassScheduleList({
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
      Object.assign(this.getForm, this.$options.data().getForm, {
        class: this.query.class
      });
      this.initData();
    },
    handleSearch() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20,
        class: this.query.class
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
    this.query = this.$route.query;
    if (this.query.class) {
      this.$set(this.getForm, "class", this.query.class);
      this.initData();
    }
  }
};
</script>

