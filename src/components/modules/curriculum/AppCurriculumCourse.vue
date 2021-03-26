<template>
  <div
    class="app-curriculum-course"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <template v-if="userInfo.role===1">
              <el-form-item>
                <el-select
                  v-model="getForm.college"
                  placeholder="请选择"
                  @change="handleSelect"
                >
                  <el-option label="-- 不限学院 --" :value="null"></el-option>
                  <el-option
                    v-for="(item,index) in collegeList"
                    :label="item.name"
                    :value="item.id"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="getForm.structure"
                  placeholder="请选择"
                  @change="handleSelect"
                >
                  <el-option label="-- 不限部门 --" :value="null"></el-option>
                  <el-option
                    v-for="(item,index) in structuresList"
                    :label="item.name"
                    :value="item.id"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item>
              <el-select
                v-model="getForm.pxlx"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 不限类型 --" :value="''"></el-option>
                <el-option
                  v-for="(item,key,index) in proConfig.pxlx"
                  :label="item"
                  :value="key"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="getForm.xklb"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 不限类别 --" :value="''"></el-option>
                <el-option
                  v-for="(item,key,index) in proConfig.xklb"
                  :label="item"
                  :value="key"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="项目联系人" value="user"></el-option>
                <el-option label="联系方式" value="tel"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="Search"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
              >
                <el-button @click.native="handleSearch" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="finance-account-main" v-cloak>
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{backgroundColor:'#fafafa'}"
        >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="cou_total" label="课程总数"></el-table-column>
          <el-table-column align="center" prop="college" label="学院"></el-table-column>
          <el-table-column align="center" label="举办日期">
            <template slot-scope="scope">
              <div>{{ scope.row.px_start_time | TimestampChangeFilter }}</div>
              <div>至</div>
              <div>{{ scope.row.px_end_time | TimestampChangeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click.native="handleList(scope.row)">课程查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="getForm.page"
          :page-size.sync="getForm.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-curriculum-course",
  data() {
    return {
      loading2: false,
      total: 0,
      tableData: [],
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      getForm: {
        xklb: "",
        pxlx: "",
        college: null,
        structure: null,
        sea_field: "pro_code",
        keywords: "",
        page: 1,
        limit: 20
      },
      collegeList: [],
      structuresList: []
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getStructures", "getCurriculumCoursesList"]),
    initData() {
      this.loading2 = true;
      this.getCurriculumCoursesList({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          this.tableData = data.data.data.list;
          this.total = data.data.data.dataCount;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
        this.loading2 = false;
      });
    },
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      // 搜索事件
      if (!this.getForm.keywords) {
        this.$message({
          message: "请输入搜索内容！",
          type: "warning"
        });
      } else {
        this.$set(this.getForm, "page", 1);
        this.initData();
        //  过滤搜索结果请求
      }
    },
    handleList(val) {
      this.$router.push("/home/curriculum/course/list/" + val.pro_id);
      sessionStorage.setItem("pro_name", val.pro_name);
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0;
      });
    },
    handleSelect() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    }
  },
  created () {
    this.keepGetFormPublic(1);
  },
  beforeMount() {
    this.getStructures({
      data: {
        // level:1
      }
    }).then(data => {
      if (data.data.code === 200) {
        data.data.data.forEach(item => {
          if (item.level === 1) {
            this.collegeList.push(item);
          } else if (item.level === 2) {
            this.structuresList.push(item);
          }
        });
      }
    });
    this.initData();
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  }
};
</script>
