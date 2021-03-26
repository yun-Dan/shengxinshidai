<template>
  <div class="app-protocol-other-list">
    <el-card>
      <div slot="header" class="clearfix" v-cloak>
        <el-button-group>
          <template v-if="switcher===1">
            <el-button
              type="primary"
              @click.native="handleBack"
              icon="el-icon-d-arrow-left"
              key="11"
            >返 回</el-button>
            <el-button
              v-if="userInfo.role===2"
              type="primary"
              @click.native="handleAdd"
              icon="el-icon-plus"
              key="12"
            >新 增</el-button>
            <el-button
              v-if="userInfo.role===2"
              type="primary"
              @click.native="handleChange(2)"
              icon="el-icon-delete"
              plain
              key="13"
            >回收站</el-button>
          </template>
          <el-button
            v-else
            type="primary"
            @click.native="handleChange(1)"
            icon="el-icon-d-arrow-left"
            key="14"
          >全 部</el-button>
        </el-button-group>
      </div>
      <div class="protocol-other-list-main" v-cloak>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column align="center" prop="pro_name" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="htmc" label="合同名称"></el-table-column>
          <el-table-column align="center" prop="htxdf" label="合同相对方"></el-table-column>
          <el-table-column align="center" label="合同执行时间">
            <template slot-scope="scope">
              <template v-if="scope.row.start_time&&scope.row.end_time">
                <div>{{ scope.row.start_time | TimestampChangeFilter }}</div>
                <div>至</div>
                <div>{{ scope.row.end_time | TimestampChangeFilter }}</div>
              </template>
              <span v-else>未填写</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="协议编号">
            <template slot-scope="scope">
              <span v-if="scope.row.contract_code">{{ scope.row.contract_code }}</span>
              <span v-else style="color: #ff0000">未分配</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status===0">未提交</span>
              <span v-if="scope.row.status===1" style="color: #e6a23c">待审核</span>
              <span v-if="scope.row.status===2||scope.row.status===4" style="color: #f56c6c">不通过</span>
              <span v-if="scope.row.status===3" style="color: #67c23a">通过</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="160px">
            <template slot-scope="scope">
              <template v-if="switcher===1">
                <template v-if="userInfo.role===1">
                  <template v-if="scope.row.status===1">
                    <el-button type="text" @click.native="handleCheck(scope.row)">审核</el-button>
                  </template>
                  <template v-if="scope.row.status===2||scope.row.status===4">
                    <el-button type="text" @click.native="handleCheck(scope.row)">重新审核</el-button>
                    <el-button type="text" @click.native="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" @click.native="handleLook(scope.row)">查看详情</el-button>
                  </template>
                  <template v-if="scope.row.status===3">
                    <el-button type="text" @click.native="handleLook(scope.row)">查看详情</el-button>
                    <el-button type="text" @click.native="handleLetter(scope.row)">打印承若书</el-button>
                    <el-button type="text" @click.native="handleCheck(scope.row)">重新审核</el-button>
                    <el-button
                      v-if="scope.row.ot_balance"
                      type="text"
                      @click="handleBalance(scope.row.ot_balance)"
                    >查看协议扫描件</el-button>
                  </template>
                </template>
                <template v-if="userInfo.role===2">
                  <template v-if="scope.row.status===0">
                    <el-button
                      v-if="scope.row.status===2||scope.row.status===0"
                      type="text"
                      @click.native="handleEdit(scope.row)"
                    >编辑</el-button>
                    <el-button
                      v-if="switcher===1"
                      type="text"
                      @click.native="handleStatus(scope.row,2)"
                    >删除</el-button>
                  </template>
                  <template v-if="scope.row.status===1">
                    <el-button type="text" @click.native="handleLook(scope.row)">查看详情</el-button>
                  </template>
                  <template v-if="scope.row.status===2">
                    <el-button
                      v-if="scope.row.status===2||scope.row.status===0"
                      type="text"
                      @click.native="handleEdit(scope.row)"
                    >编辑</el-button>
                    <el-button type="text" @click.native="handleLook(scope.row)">查看详情</el-button>
                    <el-button
                      v-if="switcher===1"
                      type="text"
                      @click.native="handleStatus(scope.row,2)"
                    >删除</el-button>
                  </template>
                  <template v-if="scope.row.status===3">
                    <el-button type="text" @click.native="handleLook(scope.row)">查看详情</el-button>
                    <el-button type="text" @click.native="handleLetter(scope.row)">打印承若书</el-button>
                    <el-button
                      v-if="scope.row.ot_balance"
                      type="text"
                      @click="handleBalance(scope.row.ot_balance)"
                    >查看协议扫描件</el-button>
                  </template>
                </template>
              </template>
              <el-button v-else type="text" @click.native="handleStatus(scope.row,1)">还原</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination layout="total" :total="total"></el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog
      width="50%"
      title="新增其他协议信息"
      :visible.sync="innerVisible"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="addForm" :model="addForm" label-width="120px" v-cloak>
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
        <el-form-item v-if="status_2" label="本次修改说明：" :rules="[{required: true}]">
          <el-input type="textarea" v-model.trim="addForm.update_note"></el-input>
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
  name: "app-protocol-other-list",
  data() {
    return {
      tableData: [],
      total: 0,
      switcher: 1, // 1正常、2禁用
      innerVisible: false,
      dialogShow: true,
      addForm: {
        //编辑时的协议id
        id: 0,
        //审核不通过时
        update_note: "",
        //公用
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
      key: 1, // 1新增，2编辑
      status_2: false,
      is_submit: false, // 是否新增/编辑后提交
      submit_id: 0, // 提交修改时的id
      collegeList: [],
      //上传
      fileList: [], // 上传的文件列表
      headers: {} // 图片上传时的请求头信息
    };
  },
  computed: {
    ...mapState(["uploadExcelUrl1", "lookUrl", 'userInfo'])
  },
  methods: {
    ...mapActions([
      "getOtherList",
      "addOtherProtocol",
      "getOtherProtocol",
      "updateOtherProtocol",
      "submitOther",
      "checkOther",
      "changeOther"
    ]),
    initData() {
      if (this.$route.fullPath.indexOf("list") > 0) {
        this.switcher = 1;
      } else {
        this.switcher = 2;
      }
      this.getOtherList({
        data: {
          pro_id: this.$route.params.id,
          is_deleted: this.switcher
        }
      }).then(data => {
        if (data.data.code === 200) {
          this.tableData = data.data.data.list;
          this.total = data.data.data.dataCount;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleChange(is_deleted = 1) {
      const ID = this.$route.params.id;
      this.switcher = is_deleted;
      const query = this.$route.query
      if (is_deleted === 1) {
        this.$router.push({
          path: "/home/protocol/other/list/" + ID,
          query
        });
        this.getOtherList({
          data: {
            pro_id: this.$route.params.id,
            is_deleted: this.switcher
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.tableData = data.data.data.list;
            this.total = data.data.data.dataCount;
          }
        });
      } else {
        this.$router.push({
          path: "/home/protocol/other/recycle/" + ID, 
          query
        });
        this.getOtherList({
          data: {
            pro_id: this.$route.params.id,
            is_deleted: this.switcher
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.tableData = data.data.data.list;
            this.total = data.data.data.dataCount;
          }
        });
      }
    },
    handleAdd() {
      this.key = 1;
      this.status_2 = false;
      Object.assign(this.addForm, this.$options.data().addForm, {
        pro_id: this.$route.params.id
      });
      this.fileList = [];
      this.innerVisible = true;
      this.dialogShow = true;
    },
    handleTrue() {
      if (!this.addForm.attachment.length) {
        this.$message({
          type: "warning",
          message: "请上传附件！"
        });
        return false;
      }
      if (this.status_2) {
        if (!this.addForm.update_note) {
          this.$message({
            type: "warning",
            message: "请输入本次修改说明！"
          });
          return false;
        }
      }
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
      this.loading1 = true;
      this.dialogShow = false;
      if (this.key) {
        // 新增
        delete obj.id;
        delete obj.update_note;
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
                      this.loading1 = false;
                    }
                  });
                  this.innerVisible = false;
                  this.initData();
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: data.data.error,
                    onClose: () => {
                      this.loading1 = false;
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
                  this.loading1 = false;
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
                this.loading1 = false;
                this.dialogShow = true;
              }
            });
          }
        });
      } else {
        if (!this.status_2) {
          delete obj.update_note;
        }
        this.updateOtherProtocol({
          data: obj
        }).then(data => {
          if (data.data.code === 200) {
            if (this.is_submit) {
              // 保存并提交
              this.submitOther({
                data: {
                  id: this.submit_id
                }
              }).then(data => {
                if (data.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: data.data.data,
                    onClose: () => {
                      this.loading1 = false;
                    }
                  });
                  this.innerVisible = false;
                  this.initData();
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: data.data.error,
                    onClose: () => {
                      this.loading1 = false;
                      this.dialogShow = true;
                    }
                  });
                }
              });
            } else {
              // 保存
              this.$message({
                type: "success",
                message: "操作成功",
                onClose: () => {
                  this.loading1 = false;
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
                this.loading1 = false;
                this.dialogShow = true;
              }
            });
          }
        });
      }
    },
    handleTrueSave() {
      this.is_submit = false;
      this.handleTrue();
    },
    handleTrueSubmit() {
      this.is_submit = true;
      this.handleTrue();
    },
    handleEdit(val) {
      this.key = 0;
      this.submit_id = val.id;
      this.getOtherProtocol({
        data: {
          id: val.id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          if (Data.status === 2) {
            this.status_2 = true;
          } else {
            this.status_2 = false;
          }
          Object.assign(this.addForm, Data);
          for (let key in this.addForm) {
            if (!this.$options.data().addForm.hasOwnProperty(key)) {
              delete this.addForm[key];
            }
          }
          this.fileList = Data.attachment.map(item => {
            return {
              name: item.origin_name,
              code: item.code,
              id: item.id
            };
          });
          let obj = Data.attachment.map(item => {
            return {
              origin_name: item.origin_name,
              code: item.code,
              id: item.id
            };
          });
          Object.assign(this.addForm, {
            attachment: obj,
            start_time: Data.start_time * 1000, // 合同执行开始时间
            end_time: Data.end_time * 1000
          });
          this.innerVisible = true;
          this.dialogShow = true;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleLetter(val) {
      this.$router.push("/home/protocol/other/letter/" + val.id);
    },
    handleCheck(val) {
      this.$router.push("/home/protocol/other/check/" + val.id);
    },
    handleLook(val) {
      this.$router.push("/home/protocol/other/info/" + val.id);
    },
    handleStatus(val, is_deleted) {
      const list = [val.id];
      if (is_deleted === 2) {
        this.$confirm("删除的协议可在回收站找回，是否继续删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.changeOther({
              data: {
                ids: list,
                is_deleted: is_deleted
              }
            }).then(data => {
              if (data.data.code === 200) {
                this.initData();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
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
      } else {
        this.changeOther({
          data: {
            ids: list,
            is_deleted: is_deleted
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
      }
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
    }, // PDF png jpg gif
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
    },
    handleBalance(code) {
      // 查看协议扫描件
      window.open(this.lookUrl + "/" + code, "_blank");
    },
    handleBack () {
      this.$router.push({
        path: '/home/protocol/other',
        query: this.$route.query
      })
    }
  },
  created () {
    this.headers = JSON.parse(this.$cookie.get("headers"))
    this.initData();
  }
};
</script>

<style scoped>
.show-data-check {
  margin-bottom: 20px;
}
.show-data-check li {
  line-height: 30px;
  border-bottom: 1px solid #8492a6;
  background-color: #fafafa;
}
li strong {
  display: inline-block;
  width: 140px;
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
