<template>
  <div
    class="app-config-log"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="fl" style="padding-bottom: 10px">
          <el-button-group style="margin-bottom: 10px">
            <el-button @click.native="handleReset" type="primary" icon="el-icon-menu">全部</el-button>
            <el-button
              v-if="showDelete"
              type="danger"
              icon="el-icon-delete"
              @click.native="handleDelete"
            >删除</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-date-picker
                v-model="time"
                type="datetimerange"
                align="right"
                unlink-panels
                start-placeholder="登录开始时间"
                range-separator="至"
                end-placeholder="登录截止时间"
                value-format="timestamp"
                style="width: 320px;margin-bottom: 10px"
                :disabled="false"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="用户账号或姓名"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
                style="width: 200px"
              >
                <el-button slot="append" @click.native="handleSearch" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="app-config-log-content">
        <el-table :data="tableData" @selection-change="handleSelectionChange" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="序号" width="60">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="username" label="账号"></el-table-column>
          <el-table-column align="center" prop="realname" label="姓名"></el-table-column>
          <el-table-column align="center" label="用户身份">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.tp===1" size="mini">管理员</el-tag>
              <el-tag v-if="scope.row.tp===2" type="success" size="mini">普通用户</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="登录方式">
            <template slot-scope="scope">
              <span v-if="scope.row.login_tp===1">账号密码</span>
              <span v-if="scope.row.login_tp===2">微信扫码登录</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="login_time" label="登录时间"></el-table-column>
          <el-table-column align="center" label="操作" width="120px">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click.native="handleDelete(scope.row,true)">删除</el-button>
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
  name: "app-config-log",
  data() {
    return {
      loading: false,
      time: "",
      getForm: {
        keywords: "",
        log_start_time: null,
        log_end_time: null,
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0,
      ids: [],
      showDelete: false
    };
  },
  methods: {
    ...mapActions(["getConfigLogList", "deleteConfigLog"]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getConfigLogList({
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
      this.time = "";
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      if (this.time) {
        let start = this.time[0] / 1000;
        let end = (this.time[1] + 24 * 60 * 60 * 1000) / 1000;
        this.$set(this.getForm, "log_start_time", start);
        this.$set(this.getForm, "log_end_time", end);
      } else {
        this.$set(this.getForm, "log_start_time", null);
        this.$set(this.getForm, "log_end_time", null);
      }
      this.$set(this.getForm, "page", 1);
      this.initData();
    },
    handleSelectionChange(val) {
      if (val.length) {
        this.showDelete = true;
      } else {
        this.showDelete = false;
      }
      this.ids = val.map(item => {
        return item.id;
      });
    },
    handleDelete(val, one) {
      if (one) {
        this.ids = [val.id];
      }
      this.$confirm("此操作将彻底删除所选中的数据，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          this.deleteConfigLog({
            data: {
              ids: this.ids
            }
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: data.data.data
              });
              this.initData();
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
