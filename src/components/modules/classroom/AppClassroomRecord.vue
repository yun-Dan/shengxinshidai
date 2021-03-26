<template>
  <div class="app-classroom-record">
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
              v-if="userInfo.role===1"
              :type="userInfo.role===1?'primary':''"
              @click.native="handleAll"
              icon="el-icon-menu"
            >全部</el-button>
            <el-button
              v-if="userInfo.role===2"
              :disabled="!(tableData.length===1&&tableData[0].starts&&tableData[0].starts.length===1&&tableData[0].starts[0].state===4)"
              type
              @click.native="handlePrint2"
              icon="el-icon-printer"
              plain
            >备案表</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline v-if="userInfo.role===1" @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.start" placeholder="请选择" style="width: 120px">
                <el-option label="教室名称" :value="1">教室名称</el-option>
                <el-option label="学院名称" :value="2">学院名称</el-option>
                <el-option label="填表人" :value="3">教室管理人</el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                :placeholder="getForm.start===1?'搜索教室名称':getForm.start===2?'搜索学院名称':'搜索教室管理人'"
                v-model.trim="getForm.keywords"
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
      <div class="classroom-record-main" v-cloak>
        <template v-if="userInfo.role===1">
          <el-table
            :data="tableData"
            :header-cell-style="{backgroundColor:'#fafafa'}"
            style="width: 100%"
          >
            <el-table-column v-if="userInfo.role===1" align="center" label="序号" width="50">
              <template slot-scope="scope">
                <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="xy" label="教室所属学院"></el-table-column>
            <el-table-column align="center" prop="realname" label="教室管理人"></el-table-column>
            <el-table-column align="center" prop="a2" label="联系方式"></el-table-column>
            <el-table-column align="center" prop="number" label="教室数量"></el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <template v-for="(item,index) in scope.row.starts">
                  <div :key="index">
                    <span v-if="item.state===1">未提交</span>
                    <span v-if="item.state===2" style="color: #e6a23c">有待审核数据</span>
                    <span v-if="item.state===3" style="color: #f56c6c">有未通过数据</span>
                    <span
                      v-if="item.state===4&&scope.row.starts.length===1"
                      style="color: #67c23a"
                    >通过</span>
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="180px">
              <template slot-scope="scope">
                <el-button type="text" @click.native="handleInfo(scope.row,true)" size="mini">教室管理</el-button>
                <el-button type="text" @click.native="handleInfo(scope.row,false)" size="mini">查看详情</el-button>
                <el-button
                  v-if="scope.row.starts&&scope.row.starts.length===1&&scope.row.starts[0].state===4"
                  type="text"
                  @click.native="handlePrint(scope.row)"
                  size="mini"
                >打印备案表</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-if="userInfo.role===2">
          <el-table
            class="classroom-record-info-table"
            :data="infoTable"
            :default-expand-all="true"
            :header-cell-style="{backgroundColor:'#fafafa'}"
            style="width: 100%"
          >
            <el-table-column type="expand" width="1">
              <template slot-scope="scope">
                <ul>
                  <template v-for="(item,index) in scope.row.history">
                    <li v-if="item.val" :key="index">
                      <span class="danger">未通过原因【{{ item.time }}】：</span>
                      {{ item.val}}
                    </li>
                  </template>
                </ul>
              </template>
            </el-table-column>
            <el-table-column align="center" label="序号" width="55px">
              <template slot-scope="scope">{{ scope.$index+1}}</template>
            </el-table-column>
            <el-table-column align="center" prop="a3" label="教室名称" min-width="100px"></el-table-column>
            <el-table-column align="center" label="教室所在位置" min-width="100px">
              <template slot-scope="scope">
                <div>{{ scope.row.a4}}</div>
                <div v-if="scope.row.a8" style="color: #5daf34">（{{ scope.row.a8}}）</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="a5" label="教室设备情况" min-width="120px"></el-table-column>
            <el-table-column align="center" label="费用标准">
              <template slot-scope="scope">{{ scope.row.a6}} {{ scope.row.a7}}</template>
            </el-table-column>
            <el-table-column align="center" label="座位数">
              <template slot-scope="scope">{{ scope.row.seat }}</template>
            </el-table-column>
            <el-table-column align="center" prop="a1" label="填表人"></el-table-column>
            <el-table-column align="center" prop="a2" label="联系方式"></el-table-column>
            <el-table-column align="center" label="创建日期" width="130px">
              <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="80px">
              <template slot-scope="scope">
                <span v-if="scope.row.state===1">未提交</span>
                <span v-if="scope.row.state===2" style="color: #e6a23c">待审核</span>
                <span v-if="scope.row.state===3" style="color: #f56c6c">不通过</span>
                <template v-if="scope.row.state===4">
                  <span style="color: #67c23a">通过</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column v-if="is_message" align="center" label="操作" width="80px">
              <template slot-scope="scope">
                <template v-if="userInfo.role===2">
                  <template v-if="scope.row.state===3">
                    <div>
                      <el-button type="text" @click.native="handleEdit(scope.row)" size="mini">编辑</el-button>
                    </div>
                    <div>
                      <el-button type="text" @click.native="handleDelete(scope.row)" size="mini">删除</el-button>
                    </div>
                  </template>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-box" v-cloak>
            <el-pagination :page-size="100" layout="total" :total="infoTable.length"></el-pagination>
          </div>
        </template>
      </div>
      <div v-if="userInfo.role===1" class="page-box">
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
      title="学院教室出借"
      center
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="520px">
      <el-form
        label-width="120px"
        style="text-align: left; margin: 0 auto"
      >
        <el-form-item label="教室管理人" :rules="[{required:true}]">
          <el-input v-model.trim="form.a1" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :rules="[{required:true}]">
          <el-input v-model.trim="form.a2"></el-input>
        </el-form-item>
        <el-form-item label="教室名称" :rules="[{required:true}]">
          <el-input v-model.trim="form.a3"></el-input>
        </el-form-item>
        <el-form-item label="教室所在建筑楼" :rules="[{required:true}]">
          <el-select v-model="form.a8" placeholder="请选择教室所在建筑楼" style="width: 100%">
            <el-option v-for="(item,index) in floor_list" :label="item" :key="index" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教室所在位置" :rules="[{required:true}]">
          <el-input v-model.trim="form.a4"></el-input>
        </el-form-item>
        <el-form-item label="教室设备情况" :rules="[{required:true}]">
          <el-input type="textarea" v-model.trim="form.a5" rows="5"></el-input>
        </el-form-item>
        <el-form-item label="费用标准(价格)" :rules="[{required:true}]">
          <el-input-number
            v-model="form.a6"
            controls-position="right"
            :min="0"
            :precision="2"
            :step="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="费用标准(单位)" :rules="[{required:true}]">
          <el-radio-group v-model="form.a7">
            <el-radio label="元/天">元/天</el-radio>
            <el-radio label="元/座">元/座</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="座位数" :rules="[{required:true}]">
          <el-input-number v-model="form.seat" :min="0" :precision="0" :step="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button v-if="form.state!==3" type="primary" @click="handleTrue(1)">保 存</el-button>-->
        <el-button type="primary" @click="handleTrue(2)">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--详情、管理、操作-->
    <el-dialog
      title="学院教室出借详情"
      center
      :visible.sync="dialogInfoVisible"
      width="80%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-card>
        <el-table
          class="classroom-record-info-table"
          :data="infoTable"
          border
          :default-expand-all="true"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%"
        >
          <el-table-column type="expand" width="1">
            <template slot-scope="scope">
              <ul>
                <template v-for="(item,index) in scope.row.history">
                  <li v-if="item.val" :key="index">
                    <span class="danger">未通过原因【{{ item.time }}】：</span>
                    {{ item.val}}
                  </li>
                </template>
              </ul>
            </template>
          </el-table-column>
          <el-table-column align="center" label="序号" width="55px">
            <template slot-scope="scope">{{ scope.$index+1}}</template>
          </el-table-column>
          <el-table-column align="center" label="创建日期" width="120px">
            <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" prop="a3" label="教室名称" min-width="100px"></el-table-column>
          <el-table-column align="center" prop="a4" label="教室所在位置" min-width="100px">
            <template slot-scope="scope">
              <div>{{ scope.row.a4}}</div>
              <div v-if="scope.row.a8" style="color: #5daf34">（{{ scope.row.a8}}）</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="a5" label="教室设备情况" min-width="120px"></el-table-column>
          <el-table-column align="center" label="费用标准" width="120px">
            <template slot-scope="scope">{{ scope.row.a6}} {{ scope.row.a7}}</template>
          </el-table-column>
          <el-table-column align="center" label="座位数" width="80px">
            <template slot-scope="scope">{{ scope.row.seat }}</template>
          </el-table-column>
          <el-table-column align="center" prop="a1" label="填表人" width="80px"></el-table-column>
          <el-table-column align="center" prop="a2" label="联系方式" width="130px"></el-table-column>
          <el-table-column align="center" label="状态" width="80px">
            <template slot-scope="scope">
              <span v-if="scope.row.state===1">未提交</span>
              <span v-if="scope.row.state===2" style="color: #e6a23c">待审核</span>
              <span v-if="scope.row.state===3" style="color: #f56c6c">不通过</span>
              <template v-if="scope.row.state===4">
                <span style="color: #67c23a">通过</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column v-if="is_message" align="center" label="操作" width="80px">
            <template slot-scope="scope">
              <template v-if="userInfo.role===1">
                <template v-if="scope.row.state===2">
                  <div>
                    <el-button type="text" @click.native="handleCheck(scope.row)">审核</el-button>
                  </div>
                </template>
                <template v-if="scope.row.state===3">
                  <div>
                    <el-button type="text" @click.native="handleCheck(scope.row)">重新审核</el-button>
                  </div>
                  <div>
                    <el-button type="text" @click.native="handleDelete(scope.row)">删除</el-button>
                  </div>
                </template>
                <template v-if="scope.row.state===4">
                  <div v-if="scope.row.pow===1">
                    <el-button type="text" @click.native="handleCheck(scope.row)">重新审核</el-button>
                  </div>
                </template>
              </template>
              <template v-if="userInfo.role===2">
                <template v-if="scope.row.state===3">
                  <div>
                    <el-button type="text" @click.native="handleEdit(scope.row)">编辑</el-button>
                  </div>
                  <div>
                    <el-button type="text" @click.native="handleDelete(scope.row)">删除</el-button>
                  </div>
                </template>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination :page-size="100" layout="total" :total="infoTable.length"></el-pagination>
        </div>
      </el-card>
      <div v-if="userInfo.role===1&&is_check" style="margin-top: 20px">
        <el-form label-width="140px" style="text-align: left" @submit.native.prevent>
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
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button type="primary" @click="dialogInfoVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-classroom-record",
  data() {
    return {
      uname: "", //用户名
      college_name: "", // 用户学院名称
      total: 0,
      tableData: [],
      getForm: {
        keywords: "",
        start: 1, //（1教室名称    2学院  3 填表人）
        page: 1,
        limit: 20
      },
      key: 1,
      form: {
        id: 0, // 新增时无id，编辑时有id
        xy: "",
        // pow:1,
        a1: "",
        a2: "",
        a3: "",
        a4: "",
        a5: "",
        a6: "",
        a7: "元/天",
        a8: null,
        state: 1,
        uid: 0,
        seat: null // 座位数
      },
      dialogFormVisible: false,
      floor_list: ["明德楼", "求是楼", "音乐厅", "校医院", "汇贤大厦"],
      is_through: false, // 审核不通过时true，其他情况为false
      dialogInfoVisible: false,
      infoTable: [],
      is_message: false, // 管理员是否可操作
      current_id: 0,
      is_check: false,
      checkForm: {
        id: 0,
        state: 4,
        through: ""
      },
      print2_id: 0
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getClassroomRecordList",
      "getClassroomRecordInfo",
      "editClassroomRecord", // 新增、编辑
      "deleteClassroomRecord",
      "checkClassroomRecord",
      "LockClassroomRecord",
      "getClassroomFloorList"
    ]),
    initData() {
      this.getClassroomRecordList({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.tableData = Data.list;
          this.total = Data.dataCount;
          if (this.userInfo.role === 2 && this.tableData.length) {
            const list = this.tableData.filter(item => {
              return item.uid == this.userInfo.uid;
            });
            this.handleInfo(list[0], true, true);
            this.print2_id = this.tableData[0].id;
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    initData2(id) {
      this.getClassroomRecordInfo({
        data: {
          id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.infoTable = Data.map(item => {
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
              tgsj: Number(item.tgsj),
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
      this.key = 1;
      Object.assign(this.form, this.$options.data().form, {
        xy: this.college_name,
        a1: this.uname
      });
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
    handleTrue(state) {
      const Obj = {};
      Object.assign(Obj, this.form, {
        state: state,
        uid: this.userInfo.uid
      });
      if (!Obj.a1) {
        this.$message({
          type: "warning",
          message: "请输入填表人姓名！"
        });
        return false;
      }
      if (!Obj.a2) {
        this.$message({
          type: "warning",
          message: "请输入填表人联系方式！"
        });
        return false;
      }
      if (!Obj.a3) {
        this.$message({
          type: "warning",
          message: "请输入教室名称！"
        });
        return false;
      }
      if (!Obj.a4) {
        this.$message({
          type: "warning",
          message: "请输入教室所在位置！"
        });
        return false;
      }
      if (!Obj.a5) {
        this.$message({
          type: "warning",
          message: "请输入教室设备情况！"
        });
        return false;
      }
      if (!Obj.a6) {
        this.$message({
          type: "warning",
          message: "请输入费用标准金额！"
        });
        return false;
      }
      if (!Obj.a8) {
        this.$message({
          type: "warning",
          message: "请选择教室所在建筑楼！"
        });
        return false;
      }
      if (!Obj.seat) {
        this.$message({
          type: "warning",
          message: "请输入座位数！"
        });
        return false;
      }
      if (this.is_through) {
        Object.assign(Obj, {
          through: " "
        });
      } else {
        delete Obj.through;
      }

      if (this.key) {
        delete Obj.id;
      }

      if (Obj) {
        this.editClassroomRecord({
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.initData();
            this.dialogFormVisible = false;
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleInfo(val, is_message, start) {
      this.is_check = false;
      this.is_message = is_message;
      if (is_message) {
        this.current_id = val.id;
      }
      this.getClassroomRecordInfo({
        data: {
          id: val.id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.infoTable = Data.map(item => {
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
              tgsj: Number(item.tgsj),
              history: list
            });
            return obj;
          });
          if (!start) {
            this.dialogInfoVisible = true;
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleEdit(val) {
      this.key = 0;
      if (val.state == 3) {
        this.is_through = true;
      }
      Object.assign(this.form, val);
      for (let key in this.form) {
        if (!this.$options.data().form.hasOwnProperty(key)) {
          delete this.form[key];
        }
      }
      this.dialogFormVisible = true;
      this.dialogInfoVisible = false;
    },
    handleDelete(val) {
      this.$confirm("此操作将彻底删除所选中的教室信息，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteClassroomRecord({
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
              this.dialogInfoVisible = false;
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
      this.is_check = true;
      Object.assign(this.checkForm, {
        id: val.id,
        state: 4,
        through: ""
      });
    },
    handleCheckTrue() {
      const Obj = {};
      Object.assign(Obj, this.checkForm);
      if (Obj.state === 3) {
        if (!Obj.through) {
          this.$message({
            type: "warning",
            message: "请输入审核不通过的原因！"
          });
          return false;
        }
      } else {
        delete Obj.through;
      }
      if (Obj) {
        this.checkClassroomRecord({
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.is_check = false;
            // 审核成功后刷新数据
            if (this.current_id) {
              this.initData2(this.current_id);
              this.initData();
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
    handleLock(val, lock) {
      this.LockClassroomRecord({
        data: {
          id: val.id,
          pow: lock
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.initData2(this.current_id);
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handlePrint(val) {
      this.$router.push("/home/classroom/record/" + val.id);
    },
    handlePrint2() {
      this.$router.push("/home/classroom/record/" + this.print2_id);
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
    },
    memory(params) {
      Object.assign(this.getForm, params);
    }
  },
  created() {
    this.keepGetFormPublic(1);
  },
  beforeMount() {
    if (this.userInfo.role === 2) {
      this.college_name = this.userInfo.college;
      this.uname = this.userInfo.realname;
      this.getClassroomFloorList({}).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          const list = [];
          for (let key in Data) {
            list.push(Data[key]);
          }
          this.floor_list = list;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    }
    this.initData();
  },
  beforeDestroy() {
    this.keepGetFormPublic(2);
  }
};
</script>

<style scoped>
.danger {
  color: #f56c6c;
}
.success {
  color: #67c23a;
}
</style>
