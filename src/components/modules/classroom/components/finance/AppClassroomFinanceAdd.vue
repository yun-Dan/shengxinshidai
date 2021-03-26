<template>
  <div class="app-classroom-finance-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
      </div>
      <div class="classroom-finance-add-main">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form label-width="120px" style="text-align: left">
              <el-form-item label="申报学院">{{ form.xy }}</el-form-item>
              <el-form-item label="申报人姓名">
                <el-input v-model.trim="form.a18" placeholder="请输入申报人姓名" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="教室归属学院" :rules="[{required:true}]">
                <el-select
                  v-model="form.a20"
                  placeholder="请选择教室归属学院"
                  style="width: 100%"
                  @change="handleChangeCollegeClassroom"
                >
                  <template v-for="(item,index) in collegeClassroom_college">
                    <el-option :key="index" :label="item.name" :value="item.name"></el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item label="教室名称" :rules="[{required:true}]">
                <el-select v-model="form.a19" placeholder="请选择教室归属学院" style="width: 100%">
                  <template v-for="(item, index) in collegeClassroom_classroom">
                    <el-option
                      v-if="item.state == 4"
                      :key="index"
                      :label="`${item.a3}`"
                      :value="item.a3"
                    >
                      <span style="float: left">{{ item.a3 }}</span>
                      <span
                        v-if="item.seat"
                        style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.seat }}座</span>
                    </el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item label="使用时间" :rules="[{required:true}]">
                <el-row>
                  <el-col :span="11">
                    <el-date-picker
                      type="date"
                      placeholder="开始日期"
                      v-model="form.a21"
                      style="width: 100%;"
                      value-format="timestamp"
                    ></el-date-picker>
                  </el-col>
                  <el-col :span="2" style="text-align: center">-</el-col>
                  <el-col :span="11">
                    <el-date-picker
                      type="date"
                      placeholder="结束日期"
                      v-model="form.a22"
                      style="width: 100%;"
                      value-format="timestamp"
                    ></el-date-picker>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="教室应用于" :rules="[{required:true}]">
                <el-select
                  v-model="form.a23"
                  placeholder="请选择该教室用于的培训项目"
                  style="width: 100%"
                  filterable
                >
                  <template v-for="(item,index) in proList">
                    <el-option
                      :label="item.pro_name"
                      :value="item.pro_name"
                      :key="index"
                    >{{ index+1}}、{{ item.pro_name }}</el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item label="费用标准（金额）" :rules="[{required:true}]">
                <el-input-number v-model="form.a24" controls-position="right" :min="0" :step="1"></el-input-number>
              </el-form-item>
              <el-form-item label="费用标准（单位）" :rules="[{required:true}]">
                <el-radio-group v-model="form.a25">
                  <el-radio label="元/天"></el-radio>
                  <el-radio label="元/座"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="费用总额（小写）" :rules="[{required:true}]">
                <el-input-number v-model="form.a15" controls-position="right" :min="0" :step="1"></el-input-number>元
              </el-form-item>
              <el-form-item label="费用总额（大写）" :rules="[{required:true}]">
                <el-input v-model.trim="NumberToChinese"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click.native="handleTrue">保 存</el-button>
                <el-button type="success" @click.native="handleTrue(2)">提 交</el-button>
                <el-button type @click.native="handleReset">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form label-width="170px" style="text-align: left">
              <el-form-item label="支出学院" :rules="[{required:true}]">
                <el-select v-model="form.a1" placeholder="请选择支出学院" style="width: 100%">
                  <el-option
                    v-for="(item,index) in collegeList"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="支出学院财务部门号和名称" :rules="[{required:true}]">
                <el-input v-model.trim="form.a2"></el-input>
              </el-form-item>
              <el-form-item label="支出学院财务项目号和名称" :rules="[{required:true}]">
                <el-input v-model.trim="form.a3"></el-input>
              </el-form-item>
              <el-form-item label="支出学院联系电话" :rules="[{required:true}]">
                <el-input v-model.trim="form.a4"></el-input>
              </el-form-item>
              <el-form-item label="支出学院经办人" :rules="[{required:true}]">
                <el-input v-model.trim="form.a12"></el-input>
              </el-form-item>
              <el-form-item label="收入学院" :rules="[{required:true}]">
                <el-select v-model="form.a7" placeholder="请选择收入学院" style="width: 100%" disabled>
                  <el-option
                    v-for="(item,index) in collegeList"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="收入学院财务部门号和名称" :rules="[{required:true}]">
                <el-input v-model.trim="form.a8"></el-input>
              </el-form-item>
              <el-form-item label="收入学院财务项目号和名称" :rules="[{required:true}]">
                <el-input v-model.trim="form.a9"></el-input>
              </el-form-item>
              <el-form-item label="收入学院联系电话" :rules="[{required:true}]">
                <el-input v-model.trim="form.a10"></el-input>
              </el-form-item>
              <el-form-item label="收入学院经办人" :rules="[{required:true}]">
                <el-input v-model.trim="form.a13"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-classroom-finance-add",
  data() {
    return {
      type: 2, // 1来款、2付款

      collegeList: [],
      proList: [],
      key: 1,
      form: {
        id: null, // 编辑
        lf: 1,
        xy: "",
        // time2:'',
        a1: "", //
        a2: "", //
        a3: "", //
        a4: "", //
        a7: "", //
        a8: "", //
        a9: "", //
        a10: "", //
        a12: "", //
        a13: "", //
        a15: "0", //
        a16: "", //
        a18: "", //
        a19: "", //
        a20: "", //
        a21: "", //
        a22: "", //
        a23: "", //
        a24: "", //
        a25: "元/天", //
        state: 1,
        uid: 0
      },
      collegeClassroom_college: [],
      collegeClassroom_classroom: []
    };
  },
  computed: {
    ...mapState(['userInfo']),
    // 价格转大写
    NumberToChinese() {
      let m = this.form.a15;
      const unit = ["仟", "佰", "拾", "", "仟", "佰", "拾", "", "角", "分"];
      m *= 100;
      m += "";
      var length = m.length;

      var result = "";
      for (var i = 0; i < length; i++) {
        if (i == 2) {
          result = "元" + result;
        } else if (i == 6) {
          result = "万" + result;
        }
        if (m.charAt(length - i - 1) == 0) {
          if (i != 0 && i != 1) {
            if (
              result.charAt(0) != "零" &&
              result.charAt(0) != "元" &&
              result.charAt(0) != "万"
            ) {
              result = "零" + result;
            }
          }
          continue;
        }
        let A = null;
        const A_ = m.charAt(length - i - 1);
        if (A_ === "0") {
          A = "零";
        } else if (A_ === "1") {
          A = "壹";
        } else if (A_ === "2") {
          A = "贰";
        } else if (A_ === "3") {
          A = "叁";
        } else if (A_ === "4") {
          A = "肆";
        } else if (A_ === "5") {
          A = "伍";
        } else if (A_ === "6") {
          A = "陆";
        } else if (A_ === "7") {
          A = "柒";
        } else if (A_ === "8") {
          A = "捌";
        } else if (A_ === "9") {
          A = "玖";
        }
        result = A + unit[unit.length - i - 1] + result;
      }
      result += result.charAt(result.length - 1) == "元" ? "整" : "";
      return result;
    }
  },
  methods: {
    ...mapActions([
      "editClassroomFinance", // 新增、编辑
      "getClassroomFinanceInfo",
      "getStructures",
      "getProjectFields",
      "classroomFinanceJsXy"
    ]),
    initData() {
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
      this.classroomFinanceJsXy({}).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.collegeClassroom_college = Data;
          if (this.form.a20) {
            this.handleChangeCollegeClassroom(this.form.a20, this.form.a19);
          }
        }
      });
      this.getProjectFields({
        data: {
          status: 0,
          pro_status: 3
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.list && Data.list.length) {
            this.proList = Data.list;
          }
        }
      });
      if (!this.key) {
        this.getClassroomFinanceInfo({
          data: {
            id: this.$route.params.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            Object.assign(this.form, Data, {
              a21: Data.a21 * 1000,
              a22: Data.a22 * 1000
            });
            for (let key in this.form) {
              if (!this.$options.data().form.hasOwnProperty(key)) {
                delete this.form[key];
              }
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
    handleReset() {
      Object.assign(this.form, this.$options.data().form, {
        a18: this.userInfo.realname,
        xy: this.userInfo.college
      });
    },
    handleTrue(state) {
      const Obj = {};
      Object.assign(Obj, this.form, {
        uid: this.userInfo.uid,
        a16: this.NumberToChinese,
        a21: this.form.a21 / 1000,
        a22: this.form.a22 / 1000
      });
      if (state) {
        Object.assign(Obj, {
          state: state
        });
      }

      if (!Obj.a20) {
        this.$message({
          type: "warning",
          message: "请选择教室归属学院！"
        });
        return false;
      }
      if (!Obj.a19) {
        this.$message({
          type: "warning",
          message: "输入教室名称！"
        });
        return false;
      }
      if (!Obj.a21) {
        this.$message({
          type: "warning",
          message: "请选择教室开始使用时间！"
        });
        return false;
      }
      if (!Obj.a22) {
        this.$message({
          type: "warning",
          message: "请选择教室结束使用时间！"
        });
        return false;
      }
      if (!Obj.a23) {
        this.$message({
          type: "warning",
          message: "请选择教室应用的培训项目！"
        });
        return false;
      }
      if (!Obj.a24) {
        this.$message({
          type: "warning",
          message: "请输入教室使用费用标准！"
        });
        return false;
      }
      if (!Obj.a15) {
        this.$message({
          type: "warning",
          message: "请输入教室使用总费用（小写）！"
        });
        return false;
      }
      if (!Obj.a16) {
        this.$message({
          type: "warning",
          message: "请输入教室使用总费用（大写）！"
        });
        return false;
      }
      if (!Obj.a1) {
        this.$message({
          type: "warning",
          message: "请选择费用支出学院！"
        });
        return false;
      }
      if (!Obj.a2) {
        this.$message({
          type: "warning",
          message: "请输入支出学院财务部门号和名称！"
        });
        return false;
      }
      if (!Obj.a3) {
        this.$message({
          type: "warning",
          message: "请输入支出学院财务项目号和名称！"
        });
        return false;
      }
      if (!Obj.a4) {
        this.$message({
          type: "warning",
          message: "请输入支出学院联系电话！"
        });
        return false;
      }
      if (!Obj.a12) {
        this.$message({
          type: "warning",
          message: "请输入支出学院经办人姓名！"
        });
        return false;
      }
      if (!Obj.a7) {
        this.$message({
          type: "warning",
          message: "请选择费用收入学院！"
        });
        return false;
      }
      if (!Obj.a8) {
        this.$message({
          type: "warning",
          message: "请输入收入学院部门号和名称！"
        });
        return false;
      }
      if (!Obj.a9) {
        this.$message({
          type: "warning",
          message: "请输入收入学院项目号和名称！"
        });
        return false;
      }
      if (!Obj.a10) {
        this.$message({
          type: "warning",
          message: "请输入收入学院联系电话！"
        });
        return false;
      }
      if (!Obj.a13) {
        this.$message({
          type: "warning",
          message: "请输入收入学院经办人姓名！"
        });
        return false;
      }

      if (true) {
        this.editClassroomFinance({
          data: Obj
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            this.$router.go(-1);
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      }
    },
    handleChangeCollegeClassroom(val, a19 = "") {
      this.$set(this.form, "a19", a19);
      this.collegeClassroom_college.map(item => {
        if (item.name === val) {
          this.collegeClassroom_classroom = item.list;
        }
      });
    }
  },
  beforeMount() {
    this.$set(this.form, "a18", this.userInfo.realname); // 填表人
    this.$set(this.form, "xy", this.userInfo.college); // 申报学院
    const route = this.$route;
    if (route.path.indexOf("add") > 0) {
      this.key = 1;
      const ID = route.params.id;
      if (ID == 1 || ID == 2) {
        this.type = ID;
        this.$set(this.form, "lf", ID);
      } else {
        this.$router.go(-1);
      }
      this.initData();
    } else {
      this.key = 0;
      this.initData();
    }
  },
  watch: {
    type() {
      this.$nextTick(() => {
        if (this.type == 1) {
          this.$set(this.form, "a7", this.form.xy);
          this.$set(this.form, "a7", this.form.xy);
        } else if (this.type == 2) {
          this.$set(this.form, "a1", this.form.xy);
        }
      });
    },
    "form.a20"() {
      this.$nextTick(() => {
        this.$set(this.form, "a7", this.form.a20);
      });
    },
    "form.a7"() {
      this.$nextTick(() => {
        this.$set(this.form, "a20", this.form.a7);
      });
    }
  }
};
</script>

<style scoped>
.classroom-finance-add-main {
  width: 80%;
  margin: 0 auto;
  padding-top: 20px;
}
</style>
