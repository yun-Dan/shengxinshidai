<template>
  <div
    class="app-document-hyjy"
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
            placeholder="会议名称"
            v-model.trim="getForm.keywords"
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
          <el-table-column align="center" prop="title1" label="标题"></el-table-column>
          <el-table-column align="center" prop="title" label="会议名称"></el-table-column>
          <el-table-column align="center" prop="document_official" label="编号"></el-table-column>
          <el-table-column align="center" prop="type" label="会议类型">
            <template slot-scope="scope">
              <div v-if="proConfig.meeting_type">{{ proConfig.meeting_type[scope.row.type] }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="meeting_host" label="拟稿"></el-table-column>
          <el-table-column align="center" prop="meeting_place" label="电话"></el-table-column>
          <el-table-column align="center" label="发布时间">
            <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <!--作废状态：1正常、2作废-->
              <!--审核状态status/statuzhi：1待审核  2审核不通过 3审核通过 4审核不通过-->
              <template v-if="scope.row.scrap === 1 && scope.row.archive === 1">
                <span v-if="scope.row.status === 1" class="warning">待审批</span>
                <template v-if="scope.row.status === 2">
                  <span class="danger">退回</span>
                </template>
                <template v-if="scope.row.status === 3">
                  <span v-if="scope.row.statuszhi === 1" class="warning">待处长审批</span>
                  <template v-if="scope.row.statuszhi === 2">
                    <span class="danger">处长退回</span>
                  </template>
                  <span v-if="scope.row.statuszhi === 3" class="success">同意</span>
                </template>
              </template>
              <span v-if="scope.row.scrap === 2" class="danger2">已作废</span>
              <span v-if="scope.row.archive === 2" class="success2">已归档</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="220px">
            <template slot-scope="scope">
              <!--作废状态：1正常、2作废-->
              <!--审核状态：1待审核  2审核不通过 3审核通过 4审核不通过-->
              <el-button type="text" @click.native="handleUpdate(0, scope.row, true)">查看</el-button>
              <template v-if="scope.row.scrap === 1 && scope.row.archive === 1">
                <template v-if="userInfo.role === 1">
                  <template v-if="userInfo.chuID_1">
                    <template v-if="scope.row.status === 1 || scope.row.status === 2">
                      <el-button type="text" @click.native="handleUpdate(0, scope.row)">编辑</el-button>
                      <el-button type="text" @click.native="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                    <template v-if="scope.row.status === 3">
                      <template v-if="scope.row.statuszhi === 1 || scope.row.statuszhi === 2">
                        <el-button
                          type="text"
                          @click.native="handleUpdate(0, scope.row, false, true, true)"
                        >{{ scope.row.statuszhi === 1 ? '审批' : '重新审批' }}</el-button>
                        <el-button type="text" @click.native="handleUpdate(0, scope.row)">编辑</el-button>
                        <el-button type="text" @click.native="handleDelete(scope.row.id)">删除</el-button>
                      </template>
                      <!--<template v-if="scope.row.statuszhi === 3">-->
                      <!--<template v-if="scope.row.meeting_user.length">-->
                      <!--&lt;!&ndash;<el-button type="text" @click="handleArchive(scope.row)">归档</el-button>&ndash;&gt;-->
                      <!--</template>-->
                      <!--<template v-else>-->
                      <!--<el-button type="text" @click="handleLssued(scope.row)">下发</el-button>-->
                      <!--</template>-->
                      <!--&lt;!&ndash;<el-button type="text" @click="handleDiscard(scope.row)">作废</el-button>&ndash;&gt;-->
                      <!--</template>-->
                    </template>
                  </template>
                  <template v-else-if="userInfo.chuID_2">
                    <template v-if="scope.row.status === 1 || scope.row.status === 2">
                      <el-button
                        type="text"
                        @click.native="handleUpdate(0, scope.row, false, true)"
                      >{{ scope.row.status === 1 ? '审批' : '重新审批' }}</el-button>
                      <el-button type="text" @click.native="handleUpdate(0, scope.row)">编辑</el-button>
                      <el-button type="text" @click.native="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                    <template v-if="scope.row.status === 3">
                      <template v-if="scope.row.statuszhi === 1 || scope.row.statuszhi === 2">
                        <el-button type="text" @click.native="handleUpdate(0, scope.row)">编辑</el-button>
                        <el-button type="text" @click.native="handleDelete(scope.row.id)">删除</el-button>
                      </template>
                      <!--<template v-if="scope.row.statuszhi === 3">-->
                      <!--<template v-if="scope.row.meeting_user.length">-->
                      <!--&lt;!&ndash;<el-button type="text" @click="handleArchive(scope.row)">归档</el-button>&ndash;&gt;-->
                      <!--</template>-->
                      <!--<template v-else>-->
                      <!--<el-button type="text" @click="handleLssued(scope.row)">下发</el-button>-->
                      <!--</template>-->
                      <!--&lt;!&ndash;<el-button type="text" @click="handleDiscard(scope.row)">作废</el-button>&ndash;&gt;-->
                      <!--</template>-->
                    </template>
                  </template>
                  <template v-else>
                    <template v-if="scope.row.status === 2 || scope.row.statuszhi === 2">
                      <el-button type="text" @click.native="handleUpdate(0, scope.row)">编辑</el-button>
                      <el-button type="text" @click.native="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                  </template>
                </template>
              </template>
              <template v-if="scope.row.meeting_user.length">
                <el-button type="text" @click="handleSituation(scope.row)">下发情况一览</el-button>
              </template>
              <template v-if="scope.row.status === 3 && scope.row.statuszhi === 3">
                <!-- <template v-if="scope.row.is_sign">
                <template v-if="!scope.row.meeting_user.length">-->
                <!-- <el-button type="text" @click="handleLssued(scope.row)">下发</el-button> -->
                <!-- </template>
                                <el-button type="text" @click="handlePrint(scope.row)">打印</el-button>
                            </template>
                <el-button v-else type="text" @click="handlePrint(scope.row, true)">签章</el-button>-->
                <el-button type="text" @click="handlePrint(scope.row)">打印</el-button>
              </template>
              <template
                v-if="userInfo.role === 1 && userInfo.chuID_2 && scope.row.status === 3 && scope.row.statuszhi === 3"
              >
                <el-button type="text" @click.native="handleUpdate(0, scope.row)">编辑</el-button>
              </template>
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
          layout="total, prev, pager, next ,jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 作废 -->
    <el-dialog
      title="会议作废"
      :visible.sync="dialogVisible_discard"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
      center
      append-to-body
    >
      <div v-loading="dialog_loading_discard">
        <el-form :model="form_discard" class="dialog-form" label-position="top" @submit.native.prevent>
          <el-form-item label="作废说明：" :rules="[{required: true}]">
            <el-input
              v-model.trim="form_discard.scrap_content"
              type="textarea"
              rows="3"
              :maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer text-align-center">
          <el-button @click="dialogVisible_discard = false">取 消</el-button>
          <el-button type="primary" @click="handleDiscardTrue">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 归档 -->
    <el-dialog
      title="会议归档"
      :visible.sync="dialogVisible_archive"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
      center
      append-to-body
    >
      <div v-loading="dialog_loading_archive">
        <el-form :model="form_archive" class="dialog-form" label-position="top" @submit.native.prevent>
          <el-form-item label="归档说明：" :rules="[{required: true}]">
            <el-input
              v-model.trim="form_archive.archive_content"
              type="textarea"
              rows="3"
              :maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer text-align-center">
          <el-button @click="dialogVisible_archive = false">取 消</el-button>
          <el-button type="primary" @click="handleArchiveTrue">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-document-hyjy",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      getForm: {
        status: null,
        keywords: "",
        page: 1,
        limit: 20
      },
      total: 0,
      tableData: [],
      // 作废
      dialogVisible_discard: false,
      dialog_loading_discard: false,
      form_discard: {
        id: null,
        scrap: 2,
        scrap_content: "" // 作废说明
      },
      // 归档
      dialogVisible_archive: false,
      dialog_loading_archive: false,
      form_archive: {
        id: null,
        archive: 2,
        archive_content: "" // 归档说明
      }
    };
  },
  computed: {
    ...mapState(['userInfo']),
    pushData() {
      return this.lssuedUsers.map(item => {
        return {
          key: item.id,
          label: `${item.realname}${
            item.c_name ? "（" + item.c_name + "）" : ""
          }`,
          disabled: false
        };
      });
    }
  },
  methods: {
    ...mapActions([
      "getDocumentHyjyList",
      "addDocumentHyjy",
      "editDocumentHyjy",
      "deleteDocumentHyjy",
      "scrapDocumentHyjy",
      "archiveDocumentHyjy",
      "checkDocumentHyjy",
      "checkChuDocumentHyjy",
      "getDocumentNewsNum"
    ]),
    initData() {
      this.loading = true;
      if (this.loading) {
        this.getDocumentHyjyList({
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
    handleUpdate(key, val, look = false, check = false, chu = false) {
      // key：-1新增、0编辑。chu = true，处长审核功能
      sessionStorage.removeItem("yulan_99");
      //参数键名：is_check、is_chu、look、key、id
      const Params = {
        "1": check,
        "2": chu,
        "3": look,
        "4": key,
        "5": key === -1 ? 0 : val.id
      };
      if (look) {
        this.$router.push({
          name: "AppDocumentHyjyInfo",
          query: Params
        });
      } else {
        this.$router.push({
          name: "AppDocumentHyjyForm",
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
          this.deleteDocumentHyjy({
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
    handleDiscard(val) {
      // 作废
      Object.assign(this.form_discard, this.$options.data().form_discard, {
        id: val.id
      });
      this.dialog_loading_discard = false;
      this.dialogVisible_discard = true;
    },
    handleDiscardTrue(val) {
      // 作废提交
      if (!this.form_discard.scrap_content) {
        this.$message({
          message: "“作废说明”不能为空！",
          type: "warning"
        });
        return false;
      }
      this.dialog_loading_discard = true;
      if (this.dialog_loading_discard) {
        this.scrapDocumentHyjy({
          data: this.form_discard
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogVisible_discard = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialog_loading_discard = false;
              }
            });
          }
        });
      }
    },
    handleArchive(val) {
      // 归档
      Object.assign(this.form_archive, this.$options.data().form_archive, {
        id: val.id
      });
      this.dialog_loading_archive = false;
      this.dialogVisible_archive = true;
    },
    handleArchiveTrue() {
      // 归档提交
      if (!this.form_archive.archive_content) {
        this.$message({
          message: "“归档说明”不能为空！",
          type: "warning"
        });
        return false;
      }
      this.dialog_loading_archive = true;
      if (this.dialog_loading_archive) {
        this.archiveDocumentHyjy({
          data: this.form_archive
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogVisible_archive = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialog_loading_archive = false;
              }
            });
          }
        });
      }
    },
    handleLssued(val) {
      this.$router.push({
        name: "AppDocumentHyjyIssue",
        query: {
          id: val.id,
          title: val.title,
          code: val.document_official,
          issue: val.meeting_user.length, // 下发人员数量（0可下发、>0已下发）
          is_sign: val.is_sign || 0 // 是否签章（1是）
        }
      });
    },
    handleSituation(val) {
      this.$router.push({
        name: "AppDocumentHyjyIssueSituation",
        query: {
          id: val.id
        }
      });
    },
    handlePrint(val, sign) {
      let query = {
        print: `2${this.randomNumPublic(10, 99)}${val.id}${this.randomNumPublic(
          0,
          9
        )}`
      };
      if (sign) {
        Object.assign(query, {
          is_sign: val.is_sign // 是否签章（1是、0否）
        });
      }
      this.$router.push({
        name: "AppDocumentHyjyPrint",
        query: query
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
.list-box li {
  float: left;
  margin: 0 4px;
  color: #a1a1a1;
}
.dialog-situation-item {
  font-weight: 600;
}
</style>
