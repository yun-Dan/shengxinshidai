<template>
  <div class="app-classroom-finance">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button
              v-if="userInfo.role===2"
              @click.native="handleAdd"
              type="primary"
              icon="el-icon-plus"
            >新增</el-button>
            <el-button
              @click.native="handleAll"
              :type="userInfo.role===1?'primary':''"
              icon="el-icon-menu"
            >全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box">
          <el-form inline @submit.native.prevent>
            <el-form-item v-if="userInfo.role===1">
              <el-select v-model="getForm.xy" placeholder="请选择">
                <el-option label="-- 不限学院 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in collegeList"
                  :label="item.name"
                  :value="item.name"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.lf" placeholder="选择款类">
                <el-option label="-- 不限款类 --" :value="null"></el-option>
                <el-option label="来款项" :value="1"></el-option>
                <el-option label="付款项" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.start" placeholder="请选择">
                <el-option label="教室名称" :value="1"></el-option>
                <el-option label="凭证编号" :value="2"></el-option>
                <el-option label="教室管理人" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索关键字"
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
      <div class="classroom-finance-main">
        <el-table :data="tableData" :default-expand-all="true" style="width: 100%">
          <el-table-column type="expand" width="1">
            <template slot-scope="scope">
              <ul>
                <li v-for="(item,index) in scope.row.history" :key="index">
                  <span class="danger">未通过原因【{{ item.time }}】：</span>
                  {{ item.val}}
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="xy" label="申报学院"></el-table-column>
          <el-table-column v-if="userInfo.role===1" align="center" prop="a18" label="填表人"></el-table-column>
          <el-table-column align="center" prop="a19" label="教室名称"></el-table-column>
          <el-table-column align="center" prop="a20" label="教室归属学院"></el-table-column>
          <el-table-column align="center" label="使用时间">
            <template slot-scope="scope">
              <div>{{ scope.row.a21 | TimestampChangeFilter }}</div>
              <div>至</div>
              <div>{{ scope.row.a22 | TimestampChangeFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="a23" label="教室应用"></el-table-column>
          <el-table-column align="center" label="收费标准">
            <template slot-scope="scope">{{ scope.row.a24}} {{ scope.row.a25}}</template>
          </el-table-column>
          <el-table-column align="center" label="凭证编号" width="120px">
            <template slot-scope="scope">
              <span v-if="scope.row.htbh">{{ scope.row.htbh}}</span>
              <span v-else style="color: #f56c6c">未分配</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state===1">未提交</span>
              <span v-if="scope.row.state===2" style="color: #e6a23c">待审核</span>
              <span v-if="scope.row.state===3" style="color: #f56c6c">不通过</span>
              <span v-if="scope.row.state===4" style="color: #67c23a">通过</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120px">
            <template slot-scope="scope">
              <template v-if="userInfo.role===1">
                <template v-if="scope.row.state===2">
                  <el-button type="text" @click.native="handleCheck(scope.row)" size="mini">审核</el-button>
                </template>
                <template v-if="scope.row.state===3||scope.row.state===4">
                  <el-button type="text" @click.native="handleCheck(scope.row)" size="mini">重新审核</el-button>
                </template>
              </template>
              <template v-if="userInfo.role===2">
                <template v-if="scope.row.state===1||scope.row.state===3">
                  <div>
                    <el-button type="text" @click.native="handleEdit(scope.row)" size="mini">编辑</el-button>
                    <el-button type="text" @click.native="handleDelete(scope.row)" size="mini">删除</el-button>
                  </div>
                </template>
              </template>
              <div>
                <el-button type="text" @click.native="handleInfo(scope.row)" size="mini">查看详情</el-button>
              </div>
              <div v-if="scope.row.state===4">
                <el-button type="text" @click.native="handlePrint(scope.row)" size="mini">打印凭证</el-button>
              </div>
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
      title="新增教室租借财务手续"
      :visible.sync="dialogAddVisible"
      width="30%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
    >
      <div style="text-align: center">
        <el-radio v-model="lf_type" :label="1" border>来款管理</el-radio>
        <el-radio v-model="lf_type" :label="2" border>付款管理</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-classroom-finance",
  data() {
    return {
      collegeList: [],
      getForm: {
        keywords: "",
        start: 2,
        lf: null,
        xy: null,
        page: 1,
        limit: 20
      },
      total: 0,
      tableData: [],
      dialogAddVisible: false,
      lf_type: 1
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getStructures",
      "getClassroomFinanceList",
      "deleteClassroomFinance"
    ]),
    initData() {
      this.getClassroomFinanceList({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.total = Data.dataCount;
          this.tableData = Data.list.map(item => {
            let list = [];
            if (item.through) {
              list = item.through.split("#");
              list = list.map(value => {
                let L = value.split(" ");
                return {
                  time: L[0],
                  val: L[1]
                };
              });
            }
            const obj = {};
            Object.assign(obj, item, {
              history: list
            });
            return obj;
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleAdd() {
      this.dialogAddVisible = true;
    },
    handleAddTrue() {
      this.$router.push("/home/classroom/finance/add/" + this.lf_type);
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
    handleDelete(val) {
      this.$confirm("此操作将彻底删除本条数据，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteClassroomFinance({
            data: {
              id: val.id
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
    handleInfo(val) {
      this.$router.push("/home/classroom/finance/info/" + val.id);
    },
    handleCheck(val) {
      this.$router.push("/home/classroom/finance/check/" + val.id);
    },
    handleEdit(val) {
      this.$router.push("/home/classroom/finance/edit/" + val.id);
    },
    handlePrint(val) {
      this.$router.push("/home/classroom/finance/print/" + val.id);
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
      // console.log(this.$el.offsetParent.offsetParent,'滚动元素');
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
    this.keepGetFormPublic(1);
  },
  beforeMount() {
    if (this.userInfo.role === 1) {
      this.getStructures({
        data: {
          level: 1
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.collegeList = Data;
        }
      });
    }
    this.initData();
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  },
  watch: {
    "getForm.xy"() {
      this.handleSelect();
    },
    "getForm.lf"() {
      this.handleSelect();
    }
  }
};
</script>

<style scoped>
.danger {
  color: #f56c6c;
}
</style>
