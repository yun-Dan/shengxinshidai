<template>
  <div class="app-protocol-modify-list">
    <el-card>
      <div slot="header" class="clearfix" v-cloak>
        <el-button class="fr" type="primary" @click.native="$router.go(-1)">返 回</el-button>
        <h3 style="line-height: 40px;text-indent: 2em">{{ pro_name }}</h3>
      </div>
      <div class="protocol-modify-list-main" v-cloak>
        <div v-if="!checkForm.id">
          <el-table
            :data="tableData"
            border
            :header-cell-style="{backgroundColor:'#fafafa'}"
            style="width: 100%"
          >
            <el-table-column align="center" label="序号" width="50">
              <template slot-scope="scope">{{ scope.$index+1}}</template>
            </el-table-column>
            <el-table-column align="center" prop="date" label="申请日期" width="120px">
              <template slot-scope="scope">{{ scope.row.create_time | TimestampChangeFilter }}</template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="审核日期" width="120px">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.review_time"
                >{{ scope.row.review_time | TimestampChangeFilter }}</span>
                <span v-else>未审核</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" label="修改详情">
              <template slot-scope="scope">
                <div
                  v-for="(item,index) in scope.row.mod_content"
                  :key="index"
                  class="modify-list-main-list"
                >
                  {{ index+1}}、
                  <!--修改-->
                  <template v-if="item.before_cont&&item.after_cont">
                    【{{ item.field_desc }}】：
                    <!--培训对象-->
                    <template v-if="item.field_name==='pxdx'">
                      <template v-for="(val,key) in proConfig.pxdx">
                        <span v-if="key == item.before_cont" :key="key + 'a'">{{ val}}</span>
                      </template>
                      修改为
                      <template v-for="(val,key) in proConfig.pxdx">
                        <span v-if="key == item.after_cont" :key="key + 'b'">{{ val}}</span>
                      </template>
                    </template>
                    <!--支付金额-->
                    <template v-else-if="item.field_name==='sfbz_dw'||item.field_name==='sfbz_xy'">
                      <span>{{ item.before_cont }}元</span>
                      修改为
                      <span>{{ item.after_cont }}元</span>
                    </template>
                    <!--比例%-->
                    <template v-else-if="item.field_name==='wyjbl'">
                      <span>{{ item.before_cont }}%</span>
                      修改为
                      <span>{{ item.after_cont }}%</span>
                    </template>
                    <!--时间-->
                    <template
                      v-else-if="item.field_name==='px_start_time'||item.field_name==='px_end_time'||item.field_name==='zs_start_time'||item.field_name==='zs_end_time'"
                    >
                      <span>{{ item.before_cont|TimestampChangeFilter }}</span>
                      修改为
                      <span>{{ item.after_cont|TimestampChangeFilter }}</span>
                    </template>
                    <template v-else>
                      <span>{{ item.before_cont }}</span> 修改为
                      <span>{{ item.after_cont }}</span>
                    </template>
                  </template>
                  <!--新增-->
                  <template v-if="(!item.before_cont)&&item.after_cont">
                    新增【{{ item.field_desc }}】：
                    <template v-if="item.field_name==='attachment'">
                      <a target="_blank" :href=" lookUrl+ '/'+item.after_cont.split('{#}')[1]">
                        <el-button
                          type="text"
                          style="padding: 0px"
                        >{{ item.after_cont.split('{#}')[0]}}</el-button>
                      </a>
                    </template>
                    <template v-else>
                      <span>{{ item.after_cont }}</span>
                    </template>
                  </template>
                  <!--删除-->
                  <template v-if="item.before_cont&&(!item.after_cont)">
                    删除【{{ item.field_desc }}】：
                    <template v-if="item.field_name==='attachment'">
                      <a target="_blank" :href=" lookUrl+ '/'+item.before_cont.split('{#}')[1]">
                        <el-button
                          type="text"
                          style="padding: 0px"
                        >{{ item.before_cont.split('{#}')[0]}}</el-button>
                      </a>
                    </template>
                    <template v-else>
                      <span>{{ item.before_cont }}</span>
                    </template>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.status===1" style="color: #e6a23c">待审核</span>
                <span v-if="scope.row.status===2" style="color: #f56c6c">不通过</span>
                <span v-if="scope.row.status===3" style="color: #67c23a">通过</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="100px">
              <template slot-scope="scope">
                <template v-if="scope.row.status===1">
                  <el-button
                    v-if="userInfo.role===1"
                    type="text"
                    @click.native="handleCheck(scope.row)"
                    :disabled="false"
                  >审核</el-button>
                </template>
                <el-button v-else type="text" @click.native="handleInfo(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="userInfo.role===1&&tableData.length" class="mod-list-text-box">
            <AppProtocolModifyText1 v-if="getForm.cont_type===1"></AppProtocolModifyText1>
            <AppProtocolModifyText2 v-if="getForm.cont_type===2"></AppProtocolModifyText2>
            <AppProtocolModifyText3 v-if="getForm.cont_type===3"></AppProtocolModifyText3>
          </div>
        </div>
        <div v-if="checkForm.id" style="margin-top: 60px">
          <el-form :model="checkForm" label-width="200px" style="text-align: left">
            <el-form-item v-if="checkShow.status!==1" label="审核状态：">
              <span v-if="checkShow.status===2" style="color: #f56c6c">不通过</span>
              <span v-if="checkShow.status===3" style="color: #67c23a">通过</span>
            </el-form-item>
            <el-form-item label="申请日期：">{{ checkShow.create_time | TimestampChangeFilter }}</el-form-item>
            <el-form-item label="申请修改详情：">
              <el-row>
                <el-col :xs="24" :sm="18">
                  <div
                    v-for="(item,index) in checkShow.mod_content"
                    :key="index"
                    class="modify-list-main-list"
                    style="line-height: 24px;padding-top: 10px"
                  >
                    <span
                      style="display: inline-block;width: 24px;border-bottom: none;text-align: center"
                    >{{ index+1}}、</span>
                    <!--修改-->
                    <template v-if="item.before_cont&&item.after_cont">
                      【{{ item.field_desc }}】：
                      <!--培训对象-->
                      <template v-if="item.field_name==='pxdx'">
                        <template v-for="(val,key) in proConfig.pxdx">
                          <span v-if="key==item.before_cont" :key="key + 'a'">{{ val}}</span>
                        </template>
                        修改为
                        <template v-for="(val,key) in proConfig.pxdx">
                          <span v-if="key==item.after_cont" :key="key + 'b'">{{ val}}</span>
                        </template>
                      </template>
                      <!--支付金额-->
                      <template
                        v-else-if="item.field_name==='sfbz_dw'||item.field_name==='sfbz_xy'"
                      >
                        <span>{{ item.before_cont }}元</span>
                        修改为
                        <span>{{ item.after_cont }}元</span>
                      </template>
                      <!--比例%-->
                      <template v-else-if="item.field_name==='wyjbl'">
                        <span>{{ item.before_cont }}%</span>
                        修改为
                        <span>{{ item.after_cont }}%</span>
                      </template>
                      <!--时间-->
                      <template
                        v-else-if="item.field_name==='px_start_time'||item.field_name==='px_end_time'||item.field_name==='zs_start_time'||item.field_name==='zs_end_time'"
                      >
                        <span>{{ item.before_cont|TimestampChangeFilter }}</span>
                        修改为
                        <span>{{ item.after_cont|TimestampChangeFilter }}</span>
                      </template>
                      <template v-else>
                        <span>{{ item.before_cont }}</span> 修改为
                        <span>{{ item.after_cont }}</span>
                      </template>
                    </template>
                    <!--新增-->
                    <template v-if="(!item.before_cont)&&item.after_cont">
                      新增【{{ item.field_desc }}】：
                      <template v-if="item.field_name==='attachment'">
                        <a target="_blank" :href=" lookUrl+ '/'+item.after_cont.split('{#}')[1]">
                          <el-button
                            type="text"
                            style="padding: 0px"
                          >{{ item.after_cont.split('{#}')[0]}}</el-button>
                        </a>
                      </template>
                      <template v-else>
                        <span>{{ item.after_cont }}</span>
                      </template>
                    </template>
                    <!--删除-->
                    <template v-if="item.before_cont&&(!item.after_cont)">
                      删除【{{ item.field_desc }}】：
                      <template v-if="item.field_name==='attachment'">
                        <a target="_blank" :href=" lookUrl+ '/'+item.before_cont.split('{#}')[1]">
                          <el-button
                            type="text"
                            style="padding: 0px"
                          >{{ item.before_cont.split('{#}')[0]}}</el-button>
                        </a>
                      </template>
                      <template v-else>
                        <span>{{ item.before_cont }}</span>
                      </template>
                    </template>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <template v-if="checkShow.status===1">
              <el-form-item label="审核结果：" :rules="[{required:true}]">
                <el-radio-group v-model="checkForm.status">
                  <el-radio :label="3">通过</el-radio>
                  <el-radio :label="2">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="checkForm.status===2" label="审核不通过原因：" :rules="[{required:true}]">
                <el-row>
                  <el-col :xs="24" :sm="12">
                    <el-input type="textarea" v-model.trim="checkForm.content"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleTrue">确 定</el-button>
                <el-button type @click="handleNo">取 消</el-button>
              </el-form-item>
            </template>
            <el-form-item v-else>
              <el-button type="primary" plain @click="handleNo">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AppProtocolModifyText1 from "./AppProtocolModifyText1";
import AppProtocolModifyText2 from "./AppProtocolModifyText2";
import AppProtocolModifyText3 from "./AppProtocolModifyText3";
export default {
  name: "app-protocol-modify-list",
  data() {
    return {
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      getForm: {
        cont_type: 0,
        cont_id: 0
      },
      tableData: [],
      pro_name: "",
      checkForm: {
        id: 0,
        status: 3,
        content: ""
      },
      checkShow: {}
    };
  },
  computed: {
    ...mapState(["lookUrl", 'userInfo'])
  },
  components: {
    AppProtocolModifyText1,
    AppProtocolModifyText2,
    AppProtocolModifyText3
  },
  methods: {
    ...mapActions(["getModify", "submitReviewModify"]),
    initData() {
      this.getModify({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          this.tableData = data.data.data.list;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleCheck(val) {
      Object.assign(this.checkShow, val);
      this.$set(this.checkForm, "id", val.id);
    },
    handleInfo(val) {
      Object.assign(this.checkShow, val);
      this.$set(this.checkForm, "id", val.id);
    },
    handleTrue() {
      if (this.checkForm.status === 2) {
        if (!this.checkForm.content) {
          this.$message({
            type: "warning",
            message: "请输入审核不通过原因！"
          });
          return false;
        }
      }
      this.submitReviewModify({
        data: this.checkForm
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
    },
    handleNo() {
      Object.assign(this.checkForm, this.$options.data().checkForm);
    }
  },
  beforeMount() {
    const path = this.$route.path;
    const cont_type = Number(path.substring(path.length - 1));
    this.$set(this.getForm, "cont_type", cont_type);
    if (sessionStorage.getItem("modifyID")) {
      const data = JSON.parse(sessionStorage.getItem("modifyID"));
      this.$set(this.getForm, "cont_id", data.id);
      this.pro_name = data.pro_name;
      this.initData();
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("modifyID");
  }
};
</script>

<style scoped>
.protocol-modify-list-main {
  padding-bottom: 100px;
}
.modify-list-main-list {
  margin-bottom: 6px;
}
.modify-list-main-list span {
  color: #000;
  border-bottom: 1px solid #000;
}
.mod-list-text-box {
  width: 900px;
  margin: 30px auto;
}
</style>
