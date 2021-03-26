<template>
  <div class="app-certificate-apply" v-loading="loading2"
    element-loading-text="加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0)">
    <el-card>
      <div slot="header" class="clearfix">
        <el-button type="text" icon="el-icon-d-arrow-left" @click.native="$router.go(-1)">返回</el-button>
        <span class="app-certificate-apply-title">{{ title }}</span>
      </div>
      <div class="certificate-apply-main" v-cloak>
        <el-form label-width="150px" label-position="top" class="certificate-apply-form">
          <el-form-item label="项目修改名称：" :rules="[{required: true}]">
            <el-input v-model="applyData.cert_name" placeholder="请输入打印证书时显示的项目名称" style="max-width: 800px;"></el-input>
          </el-form-item>
          <el-form-item v-if="!isYXB && applyData.skfs == 2" label="申领类型：" :rules="[{required: true}]">
            <el-radio-group v-model="applyData.types" disabled>
              <el-radio :label="1">纸质版证书</el-radio>
              <el-radio :label="2">电子版证书</el-radio>
            </el-radio-group>
            <span v-if="applyData.types === 2" class="danger" style="font-size: 12px;">
               （电子版证书均为无照片证书）
            </span>
          </el-form-item>
          <el-form-item label="课程时间：" :rules="[{required: true}]" v-cloak>
            <el-date-picker type="date" placeholder="课程开始时间" v-model="applyData.cert_start_time"></el-date-picker>
            <span style="padding: 0 10px;">-</span>
            <el-date-picker type="date" placeholder="课程结束时间" v-model="applyData.cert_end_time"></el-date-picker>
          </el-form-item>
          <template v-if="applyData.types === 1">
            <template v-if="!isYXB">
              <el-form-item label="证书类别：" :rules="[{required: true}]">
                <el-radio-group v-model="applyData.is_bilingual" @change="handleChangeIsBilingual">
                  <el-radio :label="1">中文版</el-radio>
                  <el-radio :label="2">英文版</el-radio>
                  <el-radio :label="3">中英文版</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="applyData.is_bilingual!==1" label="英文名称：" :rules="[{required: true}]">
                <el-input v-model="applyData.cert_name_en" placeholder="请输入英文名称"></el-input>
              </el-form-item>
              <el-form-item label="是否粘贴照片：" :rules="[{required: true}]">
                <el-radio-group v-model="applyData.is_photo">
                  <el-radio :label="1">否</el-radio>
                  <el-radio :label="2" :disabled="applyData.is_bilingual === 2">是</el-radio>
                </el-radio-group>
                <span
                  v-if="applyData.is_bilingual === 3 &&applyData.is_photo ===2"
                  style="color: #409EFF"
                >（* 其中英文版证书为无照片格式）</span>
              </el-form-item>
            </template>
            <el-form-item label="是否全员领取证书：" :rules="[{required: true}]">
              <el-radio-group v-model="applyData.is_all" @change="changeAll">
                <el-radio :label="1">否</el-radio>
                <el-radio :label="2">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <el-form-item v-if="applyData.is_all === 1" label="申领证书名单：">
            <div slot="label">
              <span class="danger">* </span>
              <span>申领证书名单：</span>
              <span v-if="applyData.types === 2" class="danger">（未填写身份证号的学员不能申请电子版证书）</span>
            </div>
           <!--  -->
            <template v-if="applyData.types === 2">
              <el-checkbox-group v-model="applyData.students" @change="handleCheckedChange">
                <el-checkbox v-for="item in studentsList" :key="item.id"
                  :label="JSON.stringify({
                    id: item.id,
                    name: item.name
                  })" :disabled="!item.idcard"
                  style="margin-left: 0; margin-right: 16px"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </template>
            <template v-else>
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="applyData.students" @change="handleCheckedChange">
                <el-checkbox
                  v-for="item in studentsList"
                  :label="JSON.stringify({
                    id: item.id,
                    name: item.name
                  })"
                  :key="item.id"
                  style="margin-left: 0;margin-right: 16px"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </template>
            <!--  -->
          </el-form-item>
          <!-- 修改学员信息（全部信息） -->
          <!-- <el-form-item label="修改已领证书学员信息：" class="certificate-apply-s-table">
            <div slot="label">
              <span>修改已领证书学员信息：</span>
              <span class="danger">（若修改学员信息请在对应学员下一行填写修改信息）</span>
            </div>
            <el-table :data="editList" border :span-method="objectSpanMethod" :row-class-name="tableRowClassName"
              class="input-center" size="mini" max-height="400" style="min-width: 970px; max-width: 1600px;">
              <el-table-column align="center" type="index"></el-table-column>
              <el-table-column align="center" label="姓名" min-width="100">
                <template slot-scope="scope">
                  <span v-if="!(scope.$index % 2)">{{ scope.row.old_name || '-' }}</span>
                  <el-input v-else v-model="scope.row.new_name" placeholder="请输入姓名"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="性别">
                <template slot-scope="scope">
                  <span v-if="!(scope.$index % 2)">{{ scope.row.old_sex || '-' }}</span>
                  <el-select v-else v-model="scope.row.new_sex" placeholder="性别">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="民族" min-width="100">
                <template slot-scope="scope">
                  <span v-if="!(scope.$index % 2)">{{ scope.row.old_national || '-' }}</span>
                  <el-input v-else v-model="scope.row.new_national" placeholder="请输入民族"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="身份证号" min-width="160">
                <template slot-scope="scope">
                  <span v-if="!(scope.$index % 2)">{{ scope.row.old_idcard || '-' }}</span>
                  <el-input v-else v-model.trim="scope.row.new_idcard" placeholder="请输入身份证号"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="手机号码" min-width="130">
                <template slot-scope="scope">
                  <span v-if="!(scope.$index % 2)">{{ scope.row.old_mobile || '-' }}</span>
                  <el-input v-else v-model="scope.row.new_mobile" placeholder="请输入手机号码"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="邮箱" min-width="130">
                <template slot-scope="scope">
                  <span v-if="!(scope.$index % 2)">{{ scope.row.old_email || '-' }}</span>
                  <el-input v-else v-model.trim="scope.row.new_email" placeholder="请输入邮箱"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="工作单位" min-width="110">
                <template slot-scope="scope">
                  <span v-if="!(scope.$index % 2)">{{ scope.row.old_company || '-' }}</span>
                  <el-input v-else v-model="scope.row.new_company" placeholder="请输入工作单位"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="职务" min-width="100">
                <template slot-scope="scope">
                  <span v-if="!(scope.$index % 2)">{{ scope.row.old_resign || '-' }}</span>
                  <el-input v-else v-model.trim="scope.row.new_resign" placeholder="请输入职务"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item> -->
          <!-- 修改学员信息（姓名） -->
           <el-form-item label="修改已领证书学员姓名：" class="certificate-apply-s-table">
            <el-table
              :data="editList.filter((item, index) => index % 2)"
              border
              class="input-center"
              size="mini"
              max-height="300"
              style="width: 410px">
              <el-table-column align="center" type="index"></el-table-column>
              <el-table-column align="center" prop="old_name" label="姓名" width="180"></el-table-column>
              <el-table-column align="center" label="修改后的姓名" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.new_name" placeholder="请输入修改后的名字"></el-input>
                </template>>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!--  -->
          <el-form-item label="新增学员信息：" class="certificate-apply-s-table">
            <div slot="label">
              <span>新增学员信息：</span>
              <el-button type="text" @click.native="handleAdd">【点击新增】</el-button>
              （新增学员信息的
              <span class="danger"> “姓名”</span>，
              <template v-if="applyData.types === 2">
                <span class="danger">“身份证号”</span>，
              </template>
              <span class="danger">“手机号”</span>，
              <span class="danger">“工作单位”</span>
              <template v-if="isYXB">，
                <span class="danger">“开票单位”</span>，
                <span class="danger">“开票税号”</span>，
                <span class="danger">“开票邮箱”</span>
              </template>
              为必填项）
              <el-upload v-if="!isYXB" ref="upload" class="upload aaa"
                :action="uploadExcelUrl"
                accept=".xls, .xlsx, .XLS, .XLSX"
                :show-file-list="false" :limit="1"
                :on-success="handleSuccess"
                :headers="headers" :with-credentials="true"
                name="attachment" :auto-upload="true">
                <el-button type="primary" plain size="mini" icon="el-icon-upload">
                  导入新增学员名单
                </el-button>
                <span slot="tip" class="el-upload__tip">
                  （ <el-button @click.native="handleImport(1)" type="text">
                    下载 <i class="fa fa-download"></i>
                  </el-button>标准格式后上传 ）
                </span>
              </el-upload>
            </div>
            <el-table :data="addList" class="input-center" border size="mini"
            style="min-width: 970px; max-width: 1600px;"  :row-class-name="() => 'newdata-row'">
              <el-table-column align="center" label="姓名" min-width="90">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" placeholder="请输入姓名"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="性别" min-width="60">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.sex" placeholder="性别">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="民族" min-width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.national" placeholder="请输入民族"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="身份证号" min-width="160">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.idcard" placeholder="请输入身份证号"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="手机号码" min-width="130">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.mobile" placeholder="请输入手机号码"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="邮箱" min-width="120">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.email" placeholder="请输入邮箱"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="工作单位" min-width="110">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.company" placeholder="请输入工作单位"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="职务" min-width="90">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.resign" placeholder="请输入职务"></el-input>
                </template>
              </el-table-column>
              <template v-if="isYXB">
                <el-table-column align="center" label="开票单位" min-width="110">
                  <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.invoice_unit" placeholder="请输入开票单位"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="开票税号" min-width="110">
                  <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.invoice_number" placeholder="请输入开票税号"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="开票邮箱" min-width="120">
                  <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.invoice_email" placeholder="请输入开票邮箱"></el-input>
                  </template>
                </el-table-column>
              </template>
              <el-table-column align="center" label="操作" width="40">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    icon="el-icon-close"
                    @click.native="handleDelete(scope.$index)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="申请修改说明：" :rules="[{required: true}]">
            <el-input type="textarea" v-model="applyData.note" maxlength="100" show-word-limit style="max-width: 800px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click.native="$router.go(-1)">返 回</el-button>
            <el-button type="primary" @click.native="handleTrue">确 认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    
    <!--上传错误数据提示-->
    <el-dialog title="导入名单错误"
      :visible.sync="dialogVisibleError"
      center append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="700px">
      <el-table :data="errorData" border style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column header-align="center" label="导入名单具体说明">
          <template slot-scope="scope">
            <strong>第 {{ scope.row.row }} 行</strong>
            ，{{ scope.row.error_msg }} 。
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"

const urls = {
  import: '/admin/certificates/impbatch'
}
export default {
  name: "app-certificate-apply",
  data() {
    return {
      loading2: false,
      title: "",
      studentsList: [],
      checkAll: false,
      applyData: {
        id: 0,
        pro_id: 0,
        uid: 0,
        cert_name: "",
        cert_type: 1, // 默认只能申领普通类型
        cert_start_time: null, // 课程开始时间
        cert_end_time: null,
        is_bilingual: 1,
        cert_name_en: "",
        is_photo: 1, //是否粘贴照片（1否 2是）
        is_all: 2, // 是否全部学员领取证书（1否 2是）
        students: [],
        note: "",
        types: 1 // 1纸质、2电子
      },
      editList: [],
      addList: [
        {
          name: "", // 姓名
          sex: '', // 性别
          national: '', // 民族
          idcard: "", // 身份证
          mobile: "", // 手机号
          email: "", // 邮箱
          company: "", // 单位
          resign: "", // 职务
          invoice_unit: '',
          invoice_number: '',
          invoice_email: ''
        }
      ],
      // 导入新增人员名单
      headers: null,
      dialogVisibleError: false,
      errorData: [],
      
      isYXB: false
    };
  },
  computed: {
    ...mapState(['userInfo', 'uploadExcelUrl', 'URL'])
  },
  methods: {
    ...mapActions([
      "getCertificatesId",
      "getStudentsData",
      "addCertificatesModify",
      "getCertificatesStudentsData",
      'axiosHttp'
    ]),
    initData(id) {
      //获取证书申领信息
      this.getCertificatesId({
        id: id
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data
          let list = Data.students.map(item => {
            let O_val = {
              id: item["stu_id"],
              name: item["stu_name"]
              // cert_num:item["cert_code"]
            };
            return JSON.stringify(O_val);
          });
          Object.assign(this.applyData, Data, {
            cert_start_time: Data.cert_start_time * 1000,
            cert_end_time: Data.cert_end_time * 1000,
            students: list,
            types: Data.types || 1,
            note: ''
          });
          this.title = Data.pro_name;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleTrue() {
      let obj = JSON.parse(JSON.stringify(this.applyData));
      let endList = obj.students.map(item => {
        let end = item.indexOf(',"name"');
        return item.substring(0, end) + "}";
      });
      Object.assign(obj, {
        students: endList
      });

      if (!obj.cert_start_time || !obj.cert_end_time) {
        this.$message({
          type: "warning",
          message: "请完善课程时间！"
        });
        return false;
      }
      if (obj.types === 1) {
        if (obj.is_bilingual !== 1) {
          if (!obj.cert_name_en) {
            this.$message({
              type: "warning",
              message: "请输入英文名称！"
            });
            return false;
          }
        }
      }
      if (!obj.user_name) {
        this.$message({
          type: "warning",
          message: "请输入经手人姓名！"
        });
        return false;
      }
      if (!obj.user_tel) {
        this.$message({
          type: "warning",
          message: "请输入联系方式！"
        });
        return false;
      }
      if (obj.is_all === 1) {
        if (!obj.students.length) {
          this.$message({
            type: "warning",
            message: "请选择申领证书名单！"
          });
          return false;
        } else {
          let list = obj.students.map(item => {
            return JSON.parse(item);
          });
          Object.assign(obj, {
            students: list
          });
        }
      } else if (obj.is_all === 2) {
        delete obj.students;
      }
      if (!obj.note) {
        this.$message({
          type: "warning",
          message: "请输入申请修改说明！"
        });
        return false;
      }

      Object.assign(obj, {
        cert_start_time: obj.cert_start_time ? new Date(obj.cert_start_time).getTime() / 1000 : 0,
        cert_end_time: obj.cert_end_time ? new Date(obj.cert_end_time).getTime() / 1000 : 0,
        is_bilingual: obj.types === 1 ? 1 : obj.is_bilingual,
        cert_name_en: obj.type === 1 ? '' : obj.cert_name_en,
        is_photo: obj.type === 1 ? 1 : obj.is_photo
      });
      for (let key in obj) {
        if (!this.$options.data().applyData.hasOwnProperty(key)) {
          delete obj[key];
        }
      }
      let edit = this.editList.filter((val, ind) => !(ind % 0)).filter(item => {
        return item.new_name || item.new_sex || item.new_national || item.new_idcard || item.new_mobile || item.new_email || item.new_company || item.new_resign
      });
      let add = this.addList.filter(item => {
        let A = item.name && item.company && item.mobile
        if (this.applyData.types === 2) { // 电子版证书
          A = A && item.idcard 
        }
        if (this.isYXB) {
          A = A && item.invoice_unit && item.invoice_number && item.invoice_email 
        }
        return A
        // return item.name && item.company && item.mobile;
      });
      let data = {};
      Object.assign(data, obj, {
        edit_students: edit,
        add_students: add,
        uid: this.userInfo.uid
      });
      if (!data.edit_students.length) {
        delete data.edit_students;
      }
      if (!data.add_students.length) {
        delete data.add_students;
      } else {
        let test = add.map(item => item.name.trim() + item.mobile.trim());
        let set = Array.from(new Set(test));
        if (test.length !== set.length) {
          this.$message({
            type: "warning",
            message: "存在姓名、手机号重复的学员，请修改后再提交！"
          });
          return false;
        }
      }
      this.loading2 = true;
      if (this.loading2) {
        this.addCertificatesModify({
          data: data
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: data.data.data
            });
            // this.$router.push("/home/certificate/index");
            this.$router.go(-1)
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
    handleAdd() {
      this.addList.push(this.$options.data().addList[0]);
    },
    handleCheckAllChange(val) {
      // 全选功能
      let allList = this.studentsList.map(item => {
        return JSON.stringify({
          id: item.id,
          name: item.name
        });
      });
      let list = val ? allList : [];
      Object.assign(this.applyData, {
        students: list
      });
    }, // 多选框事件
    handleCheckedChange(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.studentsList.length;
    },
    changeAll () {
      this.handleCheckedChange(this.applyData.students)
    },
    handleDelete(index) {
      this.addList.splice(index, 1);
    },
    getStudents(pro_id, id) {
      this.getStudentsData({
        data: {
          pro_id: pro_id,
          status: 2
        }
      }).then(data => {
        if (data.data.code === 200) {
          data.data.data.list.map(item => {
            this.studentsList.push({
              id: item.id,
              name: item.name,
              idcard: item.idcard || ''
              // cert_num:item.cert_num
            });
          });
        }
      });

      this.getCertificatesStudentsData({
        data: {
          id: id,
          status: 1,
          is_created: 2,
          fields: ["id", "stu_id", "stu_name"]
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          Data.map(item => {
            this.editList.push({
              aa: 1,
              id: item.stu_id,
              old_name: item.stu_name, // 姓名
              old_sex: item.stu_sex || '', // 性别
              old_national: item.stu_national || '', // 民族
              old_idcard: item.stu_idcard || '', // 身份证
              old_mobile: item.stu_mobile || '', // 手机号
              old_email: item.stu_email || '', // 邮箱
              old_company: item.stu_company || '', // 单位
              old_resign: item.stu_resign || '', // 职务
            }, {
              id: item.stu_id,
              // 修改前数据
              old_name: item.stu_name, // 姓名
              old_sex: item.stu_sex || '', // 性别
              old_national: item.stu_national || '', // 民族
              old_idcard: item.stu_idcard || '', // 身份证
              old_mobile: item.stu_mobile || '', // 手机号
              old_email: item.stu_email || '', // 邮箱
              old_company: item.stu_company || '', // 单位
              old_resign: item.stu_resign || '', // 职务
              // 修改后数据
              new_name: '',
              new_sex: '',
              new_national: '',
              new_idcard: '',
              new_mobile: '',
              new_email: '',
              new_company: '',
              new_resign: '',
            });
          });
        }
      });
    },
    handleChangeIsBilingual(val) {
      // 证书类别为英文版时，是否粘贴照片只能选择否
      if (val == 2) {
        this.$set(this.applyData, "is_photo", 1);
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2) {
        return 'newdata-row'
      } else {
        return ''
      }
      return ''
    },
    // 导入新增人员名单
    handleImport (type) {
      if (type === 1) {
        // 下载标准模板（同“学员管理”模板）
        window.open(`${this.URL}/static/file/import.xls?randomtime=${new Date().getTime()}`)
      }
    },
    handleSuccess(response, file) {
      if (response.code === 200) {
        this.axiosHttp({
          url: urls.import,
          type: 'post',
          data: {
            code: response.data.code
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: '上传成功'
            })
            this.addList = data.data.data.map(item => {
              return {
                name: item.name || '', // 姓名
                sex: item.sex || '', // 性别
                national: item.national || '', // 民族
                idcard: item.idcard || '', // 身份证
                mobile: item.mobile || '', // 手机号
                email: item.email || '', // 邮箱
                company: item.company || '', // 单位
                resign: item.resign || ''
              }
            })
          } else {
            if (typeof data.data.error === "string") {
              this.$notify.error({
                title: "错误",
                message: data.data.error
              });
            } else {
              const Data = data.data.error
              for (let key in Data) {
                this.errorData.push(Data[key])
              }
              this.dialogVisibleError = true
            }
          }
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: response.error
        });
      }
    },
  },
  created() {
    this.isYXB = this.isYXBPublic()
  },
  beforeMount() {
    this.headers = JSON.parse(this.$cookie.get("headers"))
    if (sessionStorage.getItem("APPLY")) {
      let OBJ = JSON.parse(sessionStorage.getItem("APPLY"));
      this.getStudents(OBJ.pro_id, OBJ.id);
      //获取证书申领信息
      this.initData(OBJ.id);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("APPLY");
  }
};
</script>

<style scoped>
.app-certificate-apply-title {
  font-size: 1.2em;
  color: #444;
  font-weight: bold;
  margin-bottom: 28px;
}
.certificate-apply-main {
  padding: 20px;
}

.aaa {
  display: inline-block;
}
</style>
