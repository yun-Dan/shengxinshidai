<template>
  <div
    class="app-assess-result"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
    
  >
    <el-card class="card-box">
      <div slot="header" class="clearfix">
        <div class="fl" style="margin-bottom: 10px">
          <el-button-group>
            <el-button v-if="isYXB" @click="$router.go(-1)" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.college" placeholder="请选择">
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
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索关键字"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
              >
                <el-button slot="append" icon="el-icon-search" @click.native="handleSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="assess-result-main" v-cloak>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="pro_code" label="项目编号"></el-table-column>
          <el-table-column align="center" prop="college" label="主办学院"></el-table-column>
          <el-table-column align="center" label="举办时间">
            <template slot-scope="scope">
              <div v-cloak>{{ scope.row.px_start_time | TimestampChangeFilter }}</div>
              <div>至</div>
              <div v-cloak>{{ scope.row.px_end_time | TimestampChangeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="分数值">
            <template slot-scope="scope">
              <span
                v-if="scope.row.proapp_count_res>=60"
                style="color: #008000"
              >{{ scope.row.proapp_count_res }}</span>
              <span
                v-if="scope.row.proapp_count_res<60"
                style="color: #ff0000"
              >{{ scope.row.proapp_count_res }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click.native="handleResult(scope.row)">考核</el-button>
              <el-button
                v-if="scope.row.proapp_list&&scope.row.proapp_list.length"
                type="text"
                @click.native="handleCheckList(scope.row)"
              >总体考核情况</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box" >
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
import { mapActions } from "vuex";
export default {
  name: "app-assess-result",
  data() {
    return {
      loading2: false,
      tableData: [],
      total: 0,
      getForm: {
        page: 1,
        limit: 20,
        sea_field: "pro_code",
        keywords: "",
        college: null
      },
      collegeList: [],
      isYXB: false
    };
  },
  methods: {
    ...mapActions(["getStructures", "getAssessResult"]),
    initData() {
      this.loading2 = true;
      this.getAssessResult({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          this.tableData = data.data.data.list;
          this.total = data.data.data.dataCount;
          this.loading2 = false;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error,
            onClose: () => {
              this.loading2 = false;
            }
          });
        }
      });
    },
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      if (!this.getForm.keywords) {
        this.$message({
          message: "请输入搜索内容！",
          type: "warning"
        });
      } else {
        this.$set(this.getForm, "page", 1);
        this.initData();
      }
    },
    handleResult(val) {
      this.$router.push("/home/assess/result/set/" + val.pro_id);
      sessionStorage.setItem("result_Pro", JSON.stringify(val));
    },
    handleCheckList(val) {
      this.$router.push("/home/assess/result/history/" + val.pro_id);
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
  created() {
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
  },
  beforeMount() {
    this.initData();
    this.getStructures({
      data: {
        level: 1
      }
    }).then(data => {
      if (data.data.code === 200) {
        this.collegeList = data.data.data;
      }
    });
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  },
  watch: {
    "getForm.college"() {
      this.handleSelect();
    }
  }
};
</script>
