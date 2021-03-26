<template>
  <div
    class="app-books-card"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)">
    <el-card class="card-box">
      <div slot="header" class="clearfix">
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button
              v-if="userInfo.role===2"
              type="primary"
              @click.native="handleAdd"
              icon="el-icon-plus"
            >新增</el-button>
            <el-button
              :type="userInfo.role===1?'primary':''"
              @click.native="handleAll"
              icon="el-icon-menu"
            >全部</el-button>
          </el-button-group>
        </div>
        <div class="fr" @keyup.enter="handleSearch">
          <el-input
            placeholder="搜索项目编号"
            v-model.trim="getForm.keywords"
            class="input-with-select"
            clearable
            style="width: 200px"
          >
            <el-button slot="append" @click.native="handleSearch" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="books-card-main">
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="pro_code" label="项目编号"></el-table-column>
          <el-table-column align="center" label="申报学院">
            <template slot-scope="scope">
              <div>{{ scope.row.uxmname }}</div>
              <div v-if="userInfo.role===1" style="color: #199f93;line-height: 20px">{{ scope.row.realname }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="阅览开始时间" min-width="140px">
            <template slot-scope="scope">{{ scope.row.tgsj | TimestampChangeFilter(false, true) }}</template>
          </el-table-column>
          <el-table-column align="center" prop="numbers" label="办证数量"></el-table-column>
          <el-table-column align="center" prop="validity" label="阅览证有效期"></el-table-column>
          <el-table-column align="center" label="费用总计">
            <template slot-scope="scope">
              <span v-if="scope.row.validity==='一个月'">{{ scope.row.numbers*50}} 元</span>
              <span v-if="scope.row.validity==='三个月'">{{ scope.row.numbers*100}} 元</span>
              <span v-if="scope.row.validity==='六个月'">{{ scope.row.numbers*200}} 元</span>
              <span v-if="scope.row.validity==='一年'">{{ scope.row.numbers*400}} 元</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state===1">未提交</span>
              <span v-if="scope.row.state===2" style="color: #e6a23c">待审核</span>
              <span v-if="scope.row.state===3" style="color: #f56c6c">不通过</span>
              <template v-if="scope.row.state===4">
                <span style="color: #67c23a">通过</span>
                <i v-if="scope.row.pow===2" class="fa fa-lock" style="color: #67c23a"></i>
                <i v-if="scope.row.pow===1" class="fa fa-unlock-alt"></i>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <!--1未提交审核 2待审核 3未通过 4已通过-->
              <template v-if="userInfo.role===1">
                <template v-if="scope.row.state===2">
                  <el-button type="text" @click.native="handleCheck(scope.row)" size="mini">审核</el-button>
                </template>
                <template v-if="scope.row.state===3">
                  <div>
                    <el-button type="text" @click.native="handleInfo(scope.row)" size="mini">查看详情</el-button>
                  </div>
                  <div>
                    <el-button type="text" @click.native="handleCheck(scope.row)" size="mini">重新审核</el-button>
                  </div>
                </template>
                <template v-if="scope.row.state===4">
                  <div>
                    <el-button type="text" @click.native="handleInfo(scope.row)" size="mini">查看详情</el-button>
                  </div>
                  <div v-if="scope.row.pow===1">
                    <el-button type="text" @click.native="handleCheck(scope.row)" size="mini">重新审核</el-button>
                  </div>
                  <div>
                    <template v-if="scope.row.pow===1">
                      <el-button type="text" @click.native="handleLock(scope.row,2)" size="mini">锁定</el-button>
                    </template>
                    <template v-if="scope.row.pow===2">
                      <el-button
                        type="text"
                        @click.native="handleLock(scope.row,1)"
                        size="mini"
                      >解除锁定</el-button>
                    </template>
                  </div>
                </template>
              </template>
              <template v-if="userInfo.role===2">
                <template v-if="scope.row.state===1||scope.row.state===3">
                  <el-button type="text" @click.native="handleEdit(scope.row)" size="mini">编辑</el-button>
                  <el-button type="text" @click.native="handleDelete(scope.row)" size="mini">删除</el-button>
                </template>
                <template v-if="scope.row.state===2||scope.row.state===4">
                  <el-button type="text" @click.native="handleInfo(scope.row)" size="mini">查看详情</el-button>
                </template>
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
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!--新增-->
    <el-dialog
      title="阅览证申报"
      center
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        label-width="120px"
        style="text-align: left"
      >
        <el-form-item label="项目名称：" :rules="[{required:true}]">
          <el-select
            v-model="form.xm"
            placeholder="请选择申请参观项目"
            style="width: 100%"
            :disabled="key?false:true"
          >
            <template v-for="(item,index) in proList">
              <el-option
                :label="item.pro_name"
                :value="item.id"
                :key="index"
              >{{ index+1}}、{{ item.pro_name }}</el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="使用期限：" :rules="[{required:true}]">
          <el-radio-group v-model="form.validity">
            <el-radio label="一个月" value="1">一个月</el-radio>
            <el-radio label="三个月" value="3">三个月</el-radio>
            <el-radio label="六个月" value="6">六个月</el-radio>
            <el-radio label="一年" value="12">一年</el-radio>
          </el-radio-group>
          <div style="color: #f56c6c;display:inline-block ;padding-left: 14px">
            【
            <span v-if="form.validity=='一个月'">50元/证</span>
            <span v-if="form.validity=='三个月'">100元/证</span>
            <span v-if="form.validity=='六个月'">200元/证</span>
            <span v-if="form.validity=='一年'">400元/证</span>
            】
          </div>
        </el-form-item>
        <el-form-item label="开始阅览时间：" :rules="[{required:true}]">
          <el-date-picker
            v-model="form.tgsj"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间"
            default-time="9:00:00"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="负责人姓名：" :rules="[{required:true}]">
          <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" :rules="[{required:true}]">
          <el-input v-model.trim="form.tel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址：" :rules="[{required:true}]">
          <el-input v-model.trim="form.email"></el-input>
        </el-form-item>
        <el-form-item label="移动电话：" :rules="[{required:true}]">
          <el-input v-model.trim="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="办证学员：" :rules="[{required:true}]">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckedAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="form.personnel" @change="handleCheckedChange">
            <el-checkbox
              v-for="item in studentsList"
              :label="item.id"
              :key="item.id"
              style="margin-left: 0;margin-right: 16px"
            >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="form.state!==3" type="primary" @click="handleTrue(1)">保 存</el-button>
        <el-button type="primary" @click="handleTrue(2)">保存并提交</el-button>
      </div>
    </el-dialog>
    <!--详情及审核-->
    <el-dialog
      title="阅览证申报详情"
      center
      :visible.sync="dialogInfoVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-card class="app-books-card-info">
        <el-form
          label-width="140px"
          style="text-align: left;width: 90%;margin: 0 auto"
        >
          <el-form-item label="【项目编号】：">{{ showData.pro_code }}</el-form-item>
          <el-form-item label="【项目名称】：">{{ showData.pro_name }}</el-form-item>
          <el-form-item label="【申报学院】：">{{ showData.sqdw }}</el-form-item>
          <el-form-item label="【开始阅览时间】：">{{ showData.tgsj | TimestampChangeFilter(false, true) }}</el-form-item>
          <el-form-item label="【办证人数】：">{{ showData.numbers }} 人</el-form-item>
          <!--<el-form-item label="【办证人名单】：">-->
          <!--<el-checkbox-group v-model="showData.personnel">-->
          <!--<el-checkbox v-for="item in studentsList" :label="item.id"-->
          <!--:key="item.id" style="margin-left: 0;margin-right: 16px">-->
          <!--{{ item.name }}-->
          <!--</el-checkbox>-->
          <!--</el-checkbox-group>-->
          <!--</el-form-item>-->
          <el-form-item label="【使用期限】：">
            <span v-if="showData.validity==='一个月'">一个月</span>
            <span v-if="showData.validity==='三个月'">三个月</span>
            <span v-if="showData.validity==='六个月'">六个月</span>
            <span v-if="showData.validity==='一年'">一年</span>
          </el-form-item>
          <el-form-item label="【共计费用】：">
            <span v-if="showData.validity==='一个月'">{{ showData.numbers*50}} 元</span>
            <span v-if="showData.validity==='三个月'">{{ showData.numbers*100}} 元</span>
            <span v-if="showData.validity==='六个月'">{{ showData.numbers*200}} 元</span>
            <span v-if="showData.validity==='一年'">{{ showData.numbers*400}} 元</span>
            <span>（费用请以校内转账形式结算，不接受现金结算。）</span>
          </el-form-item>
          <el-form-item label="【负责人姓名】：">{{ showData.name }}</el-form-item>
          <el-form-item label="【联系电话】：">{{ showData.tel}}</el-form-item>
          <el-form-item label="【邮箱地址】：">{{ showData.email}}</el-form-item>
          <el-form-item label="【移动电话】：">{{ showData.phone }}</el-form-item>
        </el-form>
      </el-card>
      <el-form
        v-if="is_check"
        label-width="140px"
        style="text-align: left;width: 90%;margin: 40px auto 0"
      >
        <el-form-item label="审核结果：" :rules="[{required: true}]">
          <el-radio-group v-model="checkForm.state">
            <el-radio :label="4">审核通过</el-radio>
            <el-radio :label="3">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="checkForm.state===3" label="不通过原因：" :rules="[{required: true}]">
          <el-row>
            <el-col :sm="24" :lg="20">
              <div class="grid-content bg-purple">
                <el-input type="textarea" v-model.trim="checkForm.through"></el-input>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="handleCheckTrue">确 定</el-button>
          <el-button @click="dialogInfoVisible=false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-books-card",
  data() {
    return {
      loading2: false,
      getForm: {
        page: 1,
        limit: 20,
        keywords: "", //项目编号包括（查询）
        xy: null //学院编号（查询学院）
      },
      total: 0,
      tableData: [],
      dialogFormVisible: false,
      key: 1,
      form: {
        xy: 0,
        xm: null,
        validity: "一个月", // 有效期
        tgsj: null, // 开始日期
        name: "",
        tel: "",
        email: "",
        phone: "",
        uid: 0,
        state: 2, //状态 1未提交 2待审核
        personnel: [], //办证的学员
        id: null // 编辑时的id标识
      },
      edit_id: 0,
      proList: [],
      checkAll: false, // 全选
      isIndeterminate: true,
      studentsList: [],
      dialogInfoVisible: false,
      showData: {},
      checkForm: {
        id: 0,
        state: 4,
        through: ""
      },
      is_check: false
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getBookCardList",
      "getBookCardId",
      "getProjectFields",
      "getStudentsData",
      "AddBookCard",
      "updateBookCard",
      "deleteBookCard",
      "checkBookCard",
      "LockBookCard"
    ]),
    initData() {
      this.loading2 = true;
      this.getBookCardList({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.total = Data.dataCount;
          this.tableData = Data.list.map(item => {
            const obj = {};
            Object.assign(obj, item, {
              tgsj: Number(item.tgsj)
            });
            return obj;
          });
          this.loading2 = false;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    getStudents(pro_id) {
      this.getStudentsData({
        data: {
          pro_id: pro_id,
          status: 2
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.studentsList = data.data.data.list;
        }
      });
    },
    getProjects() {
      this.getProjectFields({
        data: {
          fields: "",
          pro_status: 3,
          status: 0
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.proList = data.data.data.list;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleAdd() {
      this.key = 1;
      Object.assign(this.form, this.$options.data().form, {
        xy: this.userInfo.collegeId || null
      });
      this.checkAll = false;
      this.studentsList = [];
      this.dialogFormVisible = true;
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
      }
    },
    handleEdit(val) {
      this.key = 0;
      this.$set(this.form, "id", val.id);
      this.getBookCardId({
        data: {
          id: val.id
        }
      }).then(data => {
        const Data = data.data.data;
        Object.assign(this.form, Data, {
          tgsj: Number(Data.tgsj),
          xm: Number(Data.xm)
        });
        // console.log(this.form)
        this.edit_id = val.id;
        this.dialogFormVisible = true;
      });
    },
    handleTrue(state) {
      const obj = {};
      Object.assign(obj, this.form, {
        uid: this.userInfo.uid,
        state: state
      });
      if (!obj.xm) {
        this.$message({
          type: "warning",
          message: "请选择申请的项目！"
        });
        return false;
      }
      if (!obj.tgsj) {
        this.$message({
          type: "warning",
          message: "请选择开始时间！"
        });
        return false;
      }
      if (!obj.name) {
        this.$message({
          type: "warning",
          message: "请输入负责人姓名！"
        });
        return false;
      }
      if (!obj.tel) {
        this.$message({
          type: "warning",
          message: "请输入联系电话！"
        });
        return false;
      }
      if (!obj.email) {
        this.$message({
          type: "warning",
          message: "请输入邮箱地址！"
        });
        return false;
      }
      if (!obj.phone) {
        this.$message({
          type: "warning",
          message: "请输入移动电话！"
        });
        return false;
      }
      if (!obj.personnel.length) {
        this.$message({
          type: "warning",
          message: "请选择办理阅览证的学员！"
        });
        return false;
      }

      for (let key in obj) {
        if (!this.$options.data().form.hasOwnProperty(key)) {
          delete obj[key];
        }
      }
      if (!obj.id) {
        delete obj.id;
      }
      this.loading2 = true;
      if (this.key) {
        this.AddBookCard({
          data: obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogFormVisible = false;
            this.initData();
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
      } else {
        this.updateBookCard({
          data: obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.dialogFormVisible = false;
            this.initData();
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
      }
    },
    handleDelete(val) {
      // 删除勾选的数据
      this.$confirm("此操作将彻底删除所选中的数据，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteBookCard({
            data: {
              id: val.id
            },
            id: val.id
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
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
    handleCheck(val) {
      Object.assign(this.checkForm, this.$options.data().checkForm, {
        id: val.id
      });
      this.is_check = true;
      this.handleInfo(val);
    },
    handleCheckTrue() {
      if (this.checkForm.state === 3) {
        if (!this.checkForm.through) {
          this.$message({
            type: "warning",
            message: "请输入审核不通过的原因！"
          });
          return false;
        }
      }
      this.checkBookCard({
        data: this.checkForm
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.is_check = false;
          this.dialogInfoVisible = false;
          this.initData();
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleLock(val, lock) {
      this.LockBookCard({
        data: {
          id: val.id,
          pow: lock
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.initData();
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleInfo(val) {
      if (false) {
        this.getStudents(val.xm);
      }
      if (true) {
        this.getBookCardId({
          data: {
            id: val.id
          }
        }).then(data => {
          const Data = data.data.data;
          Object.assign(this.showData, Data, {
            tgsj: Number(Data.tgsj)
          });
          this.dialogInfoVisible = true;
        });
      }
    },
    //全选按钮事件
    handleCheckedAllChange(val) {
      // 全选功能
      let allList = this.studentsList.map(item => {
        return item.id;
      });
      let list = val ? allList : [];
      Object.assign(this.form, {
        personnel: list
      });
      this.isIndeterminate = false;
    },
    // 多选框事件
    handleCheckedChange(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.studentsList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.studentsList.length;
    },
    //分页
    handleSizeChange(pageSize) {
      // pageSize 改变时会触发
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      //  currentPage 改变时会触发
      this.$set(this.getForm, "page", currentPage);
      this.initData();
      // console.log(this.$el.offsetParent.offsetParent,'滚动元素');
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0;
      });
    }
  },
  created () {
    this.initData()
    if (this.userInfo.role === 2) {
      this.getProjects()
    }
  },
  watch: {
    "form.xm"() {
      this.$nextTick(() => {
        if (this.form.xm) {
          this.getStudents(this.form.xm);
        }
      });
    }
  }
};
</script>

<style scoped>
.date-text {
  padding-left: 30px;
}
</style>
