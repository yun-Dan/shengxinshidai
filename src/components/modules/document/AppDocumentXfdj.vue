<template>
  <div
    class="app-document-xfdj"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button
              v-if="userInfo.role === 1"
              type="primary"
              icon="el-icon-plus"
              @click.native="handleUpdate(-1)"
            >新增</el-button>
            <el-button @click.native="handleReset" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr" @keyup.enter="handleSearch">
          <el-input
            placeholder="经办人"
            v-model.trim="getForm.agent"
            class="input-with-select"
            clearable
            style="width: 190px"
          >
            <el-button @click.native="handleSearch" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="news inform-main" v-cloak>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="document_official" label="编号">
            <template slot-scope="scope">
              <span v-if="scope.row.document_official">{{ scope.row.document_official }}</span>
              <span v-else class="danger">未分配</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="收件时间">
            <template slot-scope="scope">{{ scope.row.time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" prop="source" label="信访来源"></el-table-column>
          <el-table-column align="center" label="来访方式">
            <template slot-scope="scope">
              <template
                v-if="proConfig.admission_type"
              >{{ proConfig.admission_type[scope.row.admission_type] }}</template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="agent" label="处理人"></el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <template v-if="scope.row.status === 1">
                <span v-if="scope.row.is_published === 1" class="info">未提交</span>
                <span v-else-if="scope.row.is_published === 2" class="warning">待审核</span>
              </template>
              <span v-else-if="scope.row.status === 2" class="danger">不通过</span>
              <span v-else-if="scope.row.status === 3" class="success">通过</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="220px">
            <template slot-scope="scope">
              <!--1待审核(默认)  2审核不通过 3审核通过-->
              <el-button
                v-if="!(scope.row.status === 1 && scope.row.is_published === 1)"
                type="text"
                @click.native="handleUpdate(0, scope.row, true)"
              >查看</el-button>
              <template v-if="(userInfo.chuID_2 || userInfo.chuID_1) && scope.row.is_published === 2">
                <el-button
                  type="text"
                  @click.native="handleUpdate(0, scope.row, true, true)"
                >{{ scope.row.status === 1 ? '审核' : '重新审核' }}</el-button>
                <el-button type="text" @click.native="handleUpdate(0, scope.row)">编辑</el-button>
                <el-button
                  v-if="scope.row.status !==3 "
                  type="text"
                  @click.native="handleDelete(scope.row.id)"
                >删除</el-button>
              </template>
              <template v-else>
                <template
                  v-if="scope.row.status === 2 || scope.row.is_published === 1 && scope.row.status === 1"
                >
                  <el-button type="text" @click.native="handleUpdate(0, scope.row)">编辑</el-button>
                  <el-button type="text" @click.native="handleDelete(scope.row.id)">删除</el-button>
                </template>
              </template>
              <el-button
                v-if="scope.row.status === 3 || scope.row.is_published === 1 && scope.row.status === 1"
                type="text"
                @click.native="handleUpdate(0, scope.row, true, false, false, true)"
              >打印记录单</el-button>
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
import { mapState, mapActions } from "vuex";
export default {
  name: "app-document-xfdj",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      getForm: {
        agent: "",
        page: 1,
        limit: 20
      },
      total: 0,
      tableData: []
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getDocumentXfdjList",
      "addDocumentXfdj",
      "editDocumentXfdj",
      "deleteDocumentXfdj",
      "scrapDocumentHyjy",
      "archiveDocumentHyjy",
      "checkDocumentXfdj",
      "checkChuDocumentXfdj",
      "getDocumentNewsNum"
    ]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getDocumentXfdjList({
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.tableData = Data.list || [];
            this.total = Data.dataCount;
            this.loading = false;
            this.getDocumentNewsNum({
              data: {
                uid: this.userInfo.uid
              }
            });
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
    handleUpdate(
      key,
      val,
      look = false,
      check = false,
      chu = false,
      print = false
    ) {
      // key：-1新增、0编辑
      const Params = {
        "1": check,
        "2": chu,
        "3": look,
        "4": key,
        "5": key === -1 ? 0 : val.id,
        "6": print
      };
      if (look) {
        this.$router.push({
          name: "AppDocumentXfdjInfo",
          query: Params
        });
      } else {
        this.$router.push({
          name: "AppDocumentXfdjForm",
          query: Params
        });
      }
    },
    handleDelete(id) {
      this.$confirm("此操作将彻底删除所选信息，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          this.deleteDocumentXfdj({
            data: {},
            id: id
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
