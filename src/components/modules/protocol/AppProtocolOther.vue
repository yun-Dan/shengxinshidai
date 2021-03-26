<template>
  <div
    class="app-protocol-other"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)" >
    <el-card>
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button v-if="isYXB" @click="$router.push('/home/protocol/other/wrap')" type="info" icon="el-icon-d-arrow-left">专业列表</el-button>
            <el-button type="primary" icon="el-icon-menu" @click.native="handleAll">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form inline v-if="userInfo.role===1" @submit.native.prevent>
            <el-form-item>
              <el-select
                v-model="getForm.college"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 不限学院 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in collegeList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="getForm.structure"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 不限部门 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in structuresList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="getForm.province"
                placeholder="请选择"
                :disabled="false"
              >
                <el-option label="-- 不限省份 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in provincesList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="getForm.city"
                placeholder="请选择"
                :disabled="false"
                @change="handleSelect"
              >
                <el-option label="-- 不限城市 --" :value="null"></el-option>
                <el-option
                  v-for="(item,index) in cityList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="联系人姓名" value="user"></el-option>
                <el-option label="联系方式" value="tel"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form inline class="fr" @submit.native.prevent>
            <el-form-item v-if="userInfo.role===2">
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="联系人姓名" value="user"></el-option>
                <el-option label="联系方式" value="tel"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="搜索关键字"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
              >
                <el-button slot="append" icon="el-icon-search" @click.native="handleSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="protocol-other-main" v-cloak>
        <el-table
          :data="tableData"
          :header-cell-style="{backgroundColor:'#fafafa'}"
          style="width: 100%;margin-top: 0px"
        >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="pro_code" label="项目编号"></el-table-column>
          <el-table-column align="center" prop="college" label="主办学院"></el-table-column>
          <el-table-column align="center" label="消息提示">
            <template slot-scope="scope">
              <template v-if="userInfo.role===1">
                <span v-if="scope.row.has_rev_contract" style="color: #e6a23c">待审核</span>
                <span v-else>无</span>
              </template>
              <template v-if="userInfo.role===2">
                <el-button
                  v-if="scope.row.has_contract"
                  type="text"
                  @click.native="handleMore(scope.row)"
                >查看</el-button>
                <span v-else style="color: #f56c6c">无</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="130">
            <template slot-scope="scope">
              <!--1待审核 2审核不通过 3审核通过-->
              <template v-if="userInfo.role===1">
                <el-button
                  v-if="scope.row.has_rev_contract"
                  type="text"
                  @click.native="handleMore(scope.row)"
                  size="mini"
                >审核</el-button>
              </template>
              <template v-if="userInfo.role===2">
                <el-button
                  v-if="!scope.row.has_rev_contract"
                  type="text"
                  @click.native="handleAdd(scope.row)"
                  size="mini"
                >新增</el-button>
              </template>
              <div>
                <el-button
                  v-if="scope.row.has_contract"
                  type="text"
                  @click.native="handleMore(scope.row)"
                  size="mini"
                >查看协议列表</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box" >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager-count="5"
          :current-page.sync="getForm.page"
          :page-size.sync="getForm.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog
      width="50%"
      title="新增其他协议信息"
      :visible.sync="innerVisible"
      center
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="addForm" :model="addForm" label-width="120px" style="text-align: left" v-cloak>
        <el-form-item label="合同名称：">
          <el-input v-model.trim="addForm.htmc"></el-input>
        </el-form-item>
        <el-form-item label="合同金额：">
          <el-input-number
            v-model="addForm.htje"
            :precision="2"
            :step="1"
            :min="0"
            controls-position="right"
          ></el-input-number>元
        </el-form-item>
        <el-form-item label="合同相对方：">
          <el-input v-model.trim="addForm.htxdf"></el-input>
        </el-form-item>
        <el-form-item label="合同执行时间：">
          <el-row>
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="开始时间"
                v-model="addForm.start_time"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">
              <div style="text-align: center">-</div>
            </el-col>
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                v-model="addForm.end_time"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="完整协议文本：">
          <el-input type="textarea" :rows="8" v-model.trim="addForm.note"></el-input>
        </el-form-item>
        <el-form-item label="上传完整协议：" :rules="[{required:true}]">
          <div class="upload-box" style="text-align: left">
            <el-upload
              class="upload"
              :action="uploadExcelUrl1"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              :headers="headers"
              name="attachment"
              :with-credentials="true"
              accept=".pdf, .PDF, .JPG, .jpg, .png, .PNG"
              :file-list="fileList"
              :auto-upload="true"
            >
              <el-button
                :key="1"
                type="primary"
                size="mini"
                icon="el-icon-upload el-icon--right"
              >附件上传</el-button>
              <span>（只能上传PDF / JPG / PNG 文件）</span>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-cloak style="position: relative">
        <el-button type="primary" @click.native="handleTrueSave">保 存</el-button>
        <el-button type="primary" @click.native="handleTrueSubmit">保存并提交</el-button>
        <el-button @click="innerVisible = false">取 消</el-button>
        <div class="dialog-footer-show" :class="{'dialog-footer-none':dialogShow}"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-protocol-other",
  data() {
    return {
      loading2: false,
      tableData: [],
      total: 0,
      getForm: {
        sea_field: "pro_code",
        keywords: "",
        page: 1,
        limit: 20,
        // status:1,
        college: null,
        structure: null, // 部门
        province: null,
        city: null
      },
      innerVisible: false,
      dialogShow: true,
      addForm: {
        uid: 0,
        pro_id: 0,
        htmc: "", //合同名称
        htje: 0, // 合同金额
        htxdf: "", //合同相对方
        start_time: null, // 合同执行开始时间
        end_time: null,
        attachment: [
          // {
          //     origin_name:'',
          //     code:''
          // }
        ],
        note: ""
      },
      is_submit: false,
      collegeList: [],
      structuresList: [],
      provincesList: [],
      cityList: [],
      //上传
      fileList: [], // 上传的文件列表
      headers: {}, // 图片上传时的请求头信息
      is_check: false, // 当前列表数据是否是待审核的列表
      isYXB: false
    };
  },
  computed: {
    ...mapState(["uploadExcelUrl1", 'userInfo'])
  },
  methods: {
    ...mapActions([
      "getStructures",
      "getAreaList",
      "getOtherProjectList",
      "addOtherProtocol",
      "submitOther"
    ]),
    initData() {
      if (sessionStorage.getItem("PRO_IS_OTHER")) {
        this.is_check = true;
      }
      this.loading2 = true;
      if (this.loading2) {
        this.getOtherProjectList({
          data: this.getForm,
          is_check: this.is_check
        }).then(data => {
          if (data.data.code === 200) {
            this.tableData = data.data.data.list;
            this.total = data.data.data.dataCount;
            this.loading2 = false;
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
    handleAll() {
      sessionStorage.removeItem("PRO_IS_OTHER");
      this.is_check = false;
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
    handleAdd(val) {
      Object.assign(this.addForm, this.$options.data().addForm, {
        pro_id: val.id
      });
      this.fileList = [];
      this.innerVisible = true;
      this.dialogShow = true;
    },
    handleTrue() {
      let obj = {};
      Object.assign(obj, this.addForm, {
        uid: this.userInfo.uid,
        start_time: this.addForm.start_time
          ? new Date(this.addForm.start_time).getTime() / 1000
          : 0,
        end_time: this.addForm.end_time
          ? new Date(this.addForm.end_time).getTime() / 1000
          : 0
      });
      if (!obj.attachment.length) {
        this.$message({
          type: "warning",
          message: "请上传附件！"
        });
        return false;
      }
      this.loading2 = true;
      this.dialogShow = false;
      this.addOtherProtocol({
        data: obj
      }).then(data => {
        if (data.data.code === 200) {
          if (this.is_submit) {
            // 保存并提交
            this.submitOther({
              data: {
                id: data.data.data
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.$message({
                  type: "success",
                  message: data.data.data,
                  onClose: () => {
                    this.loading2 = false;
                  }
                });
                this.innerVisible = false;
                this.initData();
              } else {
                this.$notify.error({
                  title: "错误",
                  message: data.data.error,
                  onClose: () => {
                    this.loading2 = false;
                    this.dialogShow = true;
                  }
                });
              }
            });
          } else {
            // 新增保存
            this.$message({
              type: "success",
              message: "操作成功",
              onClose: () => {
                this.loading2 = false;
              }
            });
            this.innerVisible = false;
            this.initData();
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error,
            onClose: () => {
              this.loading2 = false;
              this.dialogShow = true;
            }
          });
        }
      });
    },
    handleTrueSave() {
      this.is_submit = false;
      this.handleTrue();
    },
    handleTrueSubmit() {
      this.is_submit = true;
      this.handleTrue();
    },
    handleMore(val) {
      this.$router.push({
        path: "/home/protocol/other/list/" + val.id,
        query: this.$route.query
      });
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
      // this.$set(this.getForm,'keywords','');
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    },
    //文件上传相关事件
    beforeUpload(file) {
      const isTYPE =
        file.type === "application/pdf" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.name.indexOf(".jpg") !== -1;
      const isLtM = file.size / 1024 / 1024 < 8;

      if (!isTYPE) {
        this.$message.error("上传文件只能是 PDF/ JPG/ PNG 格式!");
      }
      if (!isLtM) {
        this.$message.error("上传文件大小不能超过 8MB!");
      }
      return isTYPE && isLtM;
    }, // PDF png jpg
    handleSuccess(response, file, fileList) {
      // 上传成功的回调
      if (response.code === 200) {
        this.addForm.attachment = fileList.map(item => {
          if (item.response) {
            return {
              origin_name: item.response.data.origin_name,
              code: item.response.data.code
            };
          } else {
            return {
              origin_name: item.name,
              code: item.code,
              id: item.id
            };
          }
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
    handleRemove(file, fileList) {
      this.addForm.attachment = fileList.map(item => {
        if (item.response) {
          return {
            origin_name: item.response.data.origin_name,
            code: item.response.data.code
          };
        } else {
          return {
            origin_name: item.name,
            code: item.code,
            id: item.id
          };
        }
      });
    }
  },
  created() {
    this.isYXB = this.isYXBPublic()
    this.keepGetFormPublic(1);
  },
  beforeMount() {
    this.headers = JSON.parse(this.$cookie.get("headers"))
    this.initData();
    if (this.userInfo.role === 1) {
      this.getStructures({
        data: {}
      }).then(data => {
        if (data.data.code === 200) {
          data.data.data.forEach(item => {
            if (item.level === 1) {
              this.collegeList.push(item);
            } else if (item.level === 2) {
              this.structuresList.push(item);
            }
          });
        }
      });
      this.getAreaList({
        data: {
          pid: 0
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.provincesList = Data.list;
        }
      });
    }
  },
  beforeDestroy() {
    // sessionStorage.removeItem('PRO_IS_OTHER')
    this.keepGetFormPublic(2);
  },
  watch: {
    "getForm.province"() {
      this.handleSelect();
      this.$set(this.getForm, "city", null);
      if (1) {
        this.getAreaList({
          data: {
            pid: this.getForm.province
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.cityList = Data.list;
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.submit-over {
  text-align: center;
  font-size: 20px;
}
.submit-over .icon {
  color: #67c23a;
}
.submit-over .text {
  line-height: 36px;
}
.dialog-footer-show {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.dialog-footer-none {
  display: none;
}
</style>
