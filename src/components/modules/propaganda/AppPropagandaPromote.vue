<template>
  <div
    class="app-propaganda-promote"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button v-if="isYXB" @click="$router.push('/home/propaganda/promote/wrap')" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <el-button
              v-if="userInfo.role !== 1"
              type="primary"
              icon="el-icon-plus"
              @click.native="handleUpdate(-1)"
            >新增</el-button>
            <el-button
              :type="userInfo.role === 1 ? 'primary' : ''"
              @click.native="handleReset"
              icon="el-icon-menu"
            >全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box query-box2">
          <el-form inline @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.type" placeholder="推广类型" @change="handleSelect" clearable>
                <el-option
                  v-for="(item, key) in proConfig.promote_type"
                  :key="key"
                  :label="item"
                  :value="key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="news inform-main" v-cloak>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="code" label="编号"></el-table-column>
          <el-table-column align="center" prop="pro_name" label="推广项目"></el-table-column>
          <el-table-column align="center" prop="type" label="推广类型">
            <template slot-scope="scope">{{ proConfig.promote_type[scope.row.type] }}</template>
          </el-table-column>
          <el-table-column align="center" prop="chain" label="目标链接"></el-table-column>
          <el-table-column align="center" prop="putin" label="投放形式"></el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <template v-if="scope.row.is_published">
                <span v-if="scope.row.status === 1" class="warning">待审核</span>
                <span v-if="scope.row.status === 2" class="danger">不通过</span>
                <span v-if="scope.row.status === 3" class="success">通过</span>
              </template>
              <span v-else class="info">未提交</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="220px">
            <template slot-scope="scope">
              <!--审核状态：1待审核  2审核不通过 3审核通过 4审核不通过-->
              <el-button type="text" @click.native="handleUpdate(0, scope.row, true)">查看</el-button>
              <el-button
                v-if="userInfo.role === 1 && scope.row.is_published"
                type="text"
                @click.native="handleUpdate(0, scope.row, true, true)"
              >{{ scope.row.status === 1 ? '审核' : '重新审核' }}</el-button>
              <el-button
                v-if="scope.row.audit === 2 || userInfo.role === 1 || !scope.row.is_published"
                type="text"
                @click.native="handleUpdate(0, scope.row)"
              >编辑</el-button>
              <el-button
                v-if="userInfo.role === 1 && scope.row.status === 3"
                type="text"
                @click.native="handlePrint(scope.row)"
              >打印</el-button>
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
          layout="total, prev, pager, next ,jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-propaganda-promote",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      getForm: {
        status: null,
        type: null,
        page: 1,
        limit: 20
      },
      total: 0,
      tableData: [],
      isYXB: false
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getPropagandaPromoteList"]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getPropagandaPromoteList({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.tableData = Data.list || [];
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
    handleSelect() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    },
    handleUpdate(key, val, look = false, check) {
      // key：-1新增、0编辑
      const Params = {
        "1": key, // key
        "2": look, // look
        "3": key === -1 ? 0 : val.id, // id
        "4": check, // is_check
        "5": key === -1 ? this.userInfo.uid : val.uid,
        "6": key === -1 ? 0 : val.pro_id // 项目id
      };
      this.$router.push({
        name: "AppPropagandaPromoteForm",
        query: Object.assign({}, Params, this.$route.query)
      });
    },
    handlePrint(val) {
      this.$router.push({
        name: "AppPropagandaPromotePrint",
        query: {
          // '0'的格式：**id*
          "0": `${this.randomNumPublic(10, 80)}${val.id}${this.randomNumPublic(
            0,
            9
          )}`
        }
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
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
    this.initData();
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  }
};
</script>

<style scoped>
</style>
