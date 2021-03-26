<template>
  <div
    class="news-table-box"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <template v-if="userInfo.role===1">
              <el-button type="primary" icon="el-icon-plus" @click.native="handleUpdate(-1)">新增</el-button>
              <el-button @click.native="handleReset" icon="el-icon-menu">全部</el-button>
              <el-button
                v-if="showDelete"
                type="danger"
                icon="el-icon-delete"
                @click.native="handleDelete(0)"
              >删除</el-button>
            </template>
            <template v-if="userInfo.role===2">
              <el-button @click.native="handleReset" type="primary" icon="el-icon-menu">全部</el-button>
            </template>
          </el-button-group>
        </div>
        <div class="fr" @keyup.enter="handleSearch">
          <el-form inline @submit.native.prevent>
            <el-form-item v-if="userInfo.role===1">
               <el-select v-model="getForm.sys_type"
                placeholder="-- 发布系统 --" @change="handleSearch" clearable style="width: 150px">
                  <el-option
                    v-for="item in sys_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索标题"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
                style="width: 190px"
              >
                <el-button @click.native="handleSearch" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="news inform-main" v-cloak>
        <el-table :data="tableData"
          @selection-change="handleSelectionChange"
          style="width: 100%" class="news-table"
          :row-class-name="tableRowClassName">
          <template v-if="userInfo.role===1">
            <el-table-column type="selection" width="55"></el-table-column>
          </template>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="userInfo.role===1" align="center" label="发布系统">
            <template slot-scope="scope">
              <span v-if="sys_type[scope.row.sys_type]" :style="{color: sys_type[scope.row.sys_type].color}">
                {{ sys_type[scope.row.sys_type].label }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="标题">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.dotop" type="success" size="mini" effect="dark">置顶</el-tag>
              {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="文章类型">
            <template slot-scope="scope">
              <template v-if="scope.row.articletype === 0">
                <el-tag type="success" effect="plain" size="mini">文章</el-tag>
              </template>
              <template v-else-if="scope.row.articletype === 1">
                <el-tag type="primary" effect="plain" size="mini">外链</el-tag>
              </template>
              <template v-else>
                <el-tag type="danger" effect="plain" size="mini">公文</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建日期">
            <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <template v-if="userInfo.role===1">
            <el-table-column align="center" label="阅读统计">
              <template slot-scope="scope">
                <el-popover trigger="click" placement="top" width="500">
                  <ul class="list-box">
                    <li v-for="item in readList" :key="item.id">
                      <span v-if="item.readStatus" style="color: #67c23a">{{ item.realname }}</span>
                      <span v-else>{{ item.realname }}</span>
                    </li>
                  </ul>
                  <el-button
                    @click.native="handleReadUsers(scope.row)"
                    type="text"
                    slot="reference"
                  >查看</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </template>
          <el-table-column v-if="userInfo.role===1" align="center" label="排序值">
            <template slot-scope="scope">
              <span>{{ scope.row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="260px">
            <template slot-scope="scope">
              <el-button v-if="userInfo.role===1" size="mini" @click.native="handleUpdate(scope.row.id)">编辑</el-button>
              <el-button
                v-if="userInfo.role===1"
                size="mini"
                type="danger"
                @click.native="handleDelete(scope.row.id)"
              >删除</el-button>
              <el-button @click.native="handleInfo(scope.row)" type="primary" size="mini">查看</el-button>
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
    <!--编辑框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      width="800px"
    >
      <div v-cloak>
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          style="text-align: left; margin-right: 30px"
        >
          <el-form-item label="发布系统：" :rules="[{required: true}]">
            <el-radio-group v-model="form.sys_type">
              <el-radio v-for="item in sys_type" :key="item.value" :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文章标题：" :rules="[{required: true}]">
            <el-input v-model.trim="form.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="文章类型：" :rules="[{required: true}]">
            <el-radio-group v-model="form.articletype">
              <el-radio :label="0">文章</el-radio>
              <el-radio :label="1">外链</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.articletype" label="外链地址：">
            <el-input v-model.trim="form.link" placeholder="文章类型为外链时地址为必填项"></el-input>
          </el-form-item>
          <el-form-item label="文章简介：">
            <el-input
              type="textarea"
              v-model.trim="form.description"
              :rows="3"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="文章内容：" :rules="[{required: true}]">
            <div class="ueditor-box">
              <UE :defaultMsg="content" :config="UE_config.options" ref="ue"></UE>
            </div>
          </el-form-item>
          <el-form-item label="是否置顶：">
            <el-radio-group v-model="form.dotop">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序值：">
            <el-input-number v-model="form.sort" :min="0"></el-input-number>
            <span class="tip-text" style="color: #8492a6">&nbsp;&nbsp;&nbsp;* 默认排序值是0，排序值越大排序越靠前</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native=" handleTrue">提 交</el-button>
        <el-button @click.native="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UE from "@/components/compose/AppUE";
import UE_config from '@/assets/js/UE_config.js'

export default {
  name: "app-news-table",
  data() {
    return {
      loading: false,
      showDelete: false,
      headers: {},
      getForm: {
        pid: null,
        keywords: "",
        sys_type: null, // 系统类型
        page: 1,
        limit: 10
      },
      total: 0,
      tableData: [],
      dialogFormVisible: false, // 控制编辑框的显示
      key: -1, // 标记为新增或编辑：-1新增，其他编辑
      dialogTitle: "",
      form: {
        pid: 0, // 文章分类id
        uid: 0, //系统登录用户id
        title: "",
        sys_type: 1, // 发布系统
        articletype: 0, //文章类型:0文章 1外链
        link: "", //articletype为1时，必须填写链接地址
        description: "", //简介
        content: "", //
        dotop: 0, //0不置顶(默认)，1置顶
        sort: 0, //0(默认)，数值越大排名越靠前
        status: 1 // 状态：0禁用 1开启
      },
      ids: [],
      readList: [],
      // 富文本编辑框
      content: "",
      UE_config,
      // 系统类型
      sys_type: {
        1: {
          value: 1,
          label: '继续教育微系统',
          color: '#bb0c2d'
        },
        2: {
          value: 2,
          label: '课程班系统',
          color: '#c1a10e'
        },
        3: {
          value: 3,
          label: '成教管理',
          color: '#44acb6'
        }
      },
      
      isYXB: false
    };
  },
  props: ["pidVal"],
  computed: {
    ...mapState(["usersData", "articleId", "readUsers", "URL", 'userInfo'])
  },
  components: {
    UE
  },
  methods: {
    ...mapActions([
      "getArticleData",
      "getUsers",
      "getArticleId",
      "addArticle",
      "updateArticle",
      "deleteArticle",
      "deleteSelectedArticle",
      "getReadUsers",
      "getDocumentNewsNum"
    ]),
    initData() {
      this.loading = true;
      this.plotSysType()
      if (this.loading) {
        this.getArticleData({
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
    handleSearch() {
      // if (!this.getForm.keywords) {
      //   this.$message({
      //     message: "请输入搜索关键字！",
      //     type: "warning"
      //   });
      //   return false;
      // }
      this.$set(this.getForm, 'page', 1)
      this.initData();
    },
    handleUpdate(id) {
      // -1新增、其他编辑
      this.content = "";
      this.key = id;
      Object.assign(this.form, this.$options.data().form);
      if (id === -1) {
        if (this.pidVal === "1") {
          this.dialogTitle = "新增内部通知";
        } else {
          this.dialogTitle = "新增信息参考";
        }
        Object.assign(this.form, this.$options.data().form);
        this.dialogFormVisible = true;
      } else {
        if (this.pidVal === "1") {
          this.dialogTitle = "编辑内部通知";
        } else {
          this.dialogTitle = "编辑工作刊物";
        }
        this.getArticleId({
          id: id
        }).then(() => {
          for (let key in this.form) {
            this.$set(this.form, key, this.articleId[0][key]);
          }
          this.content = this.form.content;
          this.dialogFormVisible = true;
        });
      }
    },
    handleTrue() {
      // 确认修改当前编辑
      let content = this.$refs.ue.getUEContent();
      this.$set(this.form, "content", content);
      if (!this.form.title) {
        this.$message({
          type: "warning",
          message: "请输入文章标题！"
        });
        return false;
      }
      this.$set(this.form, "pid", this.pidVal);
      if (this.form.articletype === 1) {
        if (!this.form.link) {
          this.$message({
            type: "warning",
            message: "请输入链接地址！"
          });
          return false;
        }
      }
      if (!this.form.content) {
        this.$message({
          type: "warning",
          message: "请输入文章内容！"
        });
        return false;
      }
      if (this.key === -1) {
        // 新增
        this.addArticle({
          data: this.form
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              message: data.data.data,
              type: "success"
            });
            this.dialogFormVisible = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialogFormVisible = false;
              }
            });
          }
        });
      } else {
        // 编辑
        this.updateArticle({
          data: this.form,
          id: this.key
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              message: data.data.data,
              type: "success"
            });
            this.dialogFormVisible = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.dialogFormVisible = false;
              }
            });
          }
        });
      }
    },
    handleSelectionChange(val) {
      // 选中的checkbox触发的事件
      if (val.length) {
        this.showDelete = true;
      } else {
        this.showDelete = false;
      }
      this.ids = val.map(item => {
        return item.id;
      });
    },
    handleDelete(id) {
      // 0批量删除、单条删除传id
      let list = id ? [id] : this.ids;
      this.$confirm("此操作将彻底删除所选中的消息，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          this.deleteSelectedArticle({
            data: {
              ids: list
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
    handleReadUsers(val) {
      this.getReadUsers({
        data: {
          aid: val.id
        }
      }).then(() => {
        this.readList = this.usersData.list.map(item => {
          item.readStatus = 0;
          return item;
        });
        if (!!this.readUsers) {
          this.readUsers.forEach(value => {
            this.readList.forEach(item => {
              if (item.id === value) {
                item.readStatus = 1;
              }
            });
          });
        } else {
          this.readList.forEach(item => {
            item.readStatus = 0;
          });
        }
      });
    },
    handleInfo(val) {
      if (val.articletype === 0) {
        let Path = this.$route.path;
        let k = 0;
        if (Path.indexOf("inform") !== -1) {
          k = 1;
        } else if (Path.indexOf("reference") !== -1) {
          k = 2;
        }
        this.$router.push({
          path: "/home/news/article/" + val.id,
          query: {
            key: k
          }
        });
      } else {
        this.getArticleId({
          id: val.id,
          data: {
            uid: this.userInfo.uid
          }
        }).then(data => {
          if (data.data.code === 200) {
            if (val.articletype === 1) {
              window.open(val.link);
            } else {
              let link = `${this.URL}${val.link}&authkey=${
                this.headers.authkey
              }&sessionid=${this.headers.sessionid}`;
              window.open(link);
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    getInfo(id) {
      this.getArticleId({
        id: id,
        data: {
          uid: this.userInfo.role === 2 ? this.userInfo.uid : null
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
    },
    tableRowClassName ({row, rowIndex}) {
      return `sys-type-${row.sys_type}`
    },
    plotSysType () { // 获取对应系统的新闻列表（仅用于“微系统”、“课程班”）
      if (this.userInfo.role === 2) {
        if (this.isYXB) {
          this.$set(this.getForm, "sys_type", 2);
        } else {
          this.$set(this.getForm, "sys_type", 1);
        }
      }
    }
  },
  created() {
    this.isYXB = this.isYXBPublic()
    this.$set(this.getForm, "pid", this.pidVal);
    let Path = this.$route.path;
    if (Path.indexOf("inform") !== -1) {
      this.keepGetFormPublic(1, 1);
    } else if (Path.indexOf("reference") !== -1) {
      this.keepGetFormPublic(1, 2);
    }
    this.initData();
  },
  beforeMount() {
    this.headers = JSON.parse(this.$cookie.get("headers"));
    this.$set(this.form, "uid", this.userInfo.uid);
    this.getDocumentNewsNum({
      data: {
        uid: this.userInfo.uid
      }
    });
    this.getUsers({
      data: {
        tp: 2,
        fields: "id,realname"
      }
    }).then(() => {
      if (this.usersData.list) {
        this.readList = this.usersData.list.map(item => {
          item.readStatus = 0;
          return item;
        });
      }
    });
  },
  beforeDestroy() {
    let Path = this.$route;
    this.keepGetFormPublic(2, Path.query.key);
  }
};
</script>

<style scoped>
.tip-text {
  font-size: 12px;
}
.list-box li {
  float: left;
  margin: 0 4px;
  color: #a1a1a1;
}
</style>
