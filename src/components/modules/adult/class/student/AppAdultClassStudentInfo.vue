<template>
  <div class="app-adult-class-student-info" v-loading="loading">
    <div style="padding: 50px 20px;">
      <el-table
        :data="[{}]"
        border
        width="100%"
        :header-cell-style="{backgroundColor:'#e4eefd', color: '#303133', fontSize: '14px'}"
      >
        <el-table-column prop="date" label="基本信息">
          <AppAvatarInfo :params="avatarParams"/>
        </el-table-column>
      </el-table>
      <el-table
        :data="[{}]"
        border
        width="100%"
        :header-cell-style="{backgroundColor:'#e4eefd', color: '#303133', fontSize: '14px'}"
      >
        <el-table-column prop="date" label="成绩信息">
          <AppAvatarInfo :params="avatarParams"/>
        </el-table-column>
      </el-table>
      <el-table
        :data="[{}]"
        border
        width="100%"
        :header-cell-style="{backgroundColor:'#e4eefd', color: '#303133', fontSize: '14px'}"
      >
        <el-table-column prop="date" label="休复学申请/退学申请信息">
          <AppAvatarInfo :params="avatarParams"/>
        </el-table-column>
      </el-table>
      <el-table
        :data="[{}]"
        border
        width="100%"
        :header-cell-style="{backgroundColor:'#e4eefd', color: '#303133', fontSize: '14px'}"
      >
        <el-table-column prop="date" label="毕业申请信息">
          <AppAvatarInfo :params="avatarParams"/>
        </el-table-column>
      </el-table>
      <el-table
        :data="[{}]"
        border
        width="100%"
        :header-cell-style="{backgroundColor:'#e4eefd', color: '#303133', fontSize: '14px'}"
      >
        <el-table-column prop="date" label="学位申请信息">
          <AppAvatarInfo :params="avatarParams"/>
        </el-table-column>
      </el-table>
    </div>
    <!-- end -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import AppAvatarInfo from "@/components/compose/AppAvatarInfo.vue";
export default {
  name: "app-adult-class-student-info",
  data() {
    return {
      loading: false,
      query: {
        type: null, // 0个人信息、1学籍申请、2学位申请
        s_id: null, // 学生id
        s_s: null, // 学籍状态 1:在读 2:休学 3:退学 4:结业 5:缓毕业 6:毕业
        d_s: null // 学位状态 0: 无 1:有
      },
      showInfo: {
        id: 16,
        name: "董祥云", //学生姓名
        code: "20010989", //学生学号
        sex: 2, //性别。1:男 2:女
        grade: 2016, //年级
        session: null, //学期(总的)
        avatar: null, //头像地址
        phone: 13678989098, //学生手机号
        email: "13678989098@126.com", //邮箱
        birthday: "1990-09-10", //出生日期
        start_time: "2019-09-10", //入学日期
        finish_time: "2020-09-10", //毕业日期
        finish_code: 898902343234498, //毕业证书编号
        finish_result: "毕结业结论", //毕结业结论
        finish_remark: "毕结业备注", //毕结业备注
        school_master: "高文彦", //校长姓名
        cardno: "110221194901011695", //身份证号
        address: "中国人民大学中关村大街100号", //通讯地址
        education_level_id: null, //教育等级
        profession_id: 13, //专业
        nationality_id: null, //民族
        province_id: null, //籍贯-省
        city_id: null, //籍贯-省
        class_id: 0, //当前班级(最新的)
        xxdm: null, //学校代码
        xxmc: null, //学校名称
        xm: null, //姓名
        xb: null, //性别
        csrq: null, //出生日期
        ksh: null, //考生号
        fy: null, //分院（教学点）
        zydm: "020301", //专业代码
        xsh: null, //系所
        zymc: "金融学", //专业名称
        bh: null, //班号
        mz: null, //民族
        cc: "专升本", //层次
        nj: null, //年级
        xz: null, //学制
        rxrq: null, //入学日期
        xxxs: null, //学习形式
        fees: null, //学费
        year: null, //年份
        is_fees: null, //是否交费
        invoice: null, //发票地址
        professional: null, //专业ids
        yjbyrq: null, //预计毕业日期
        zzmm: "党员", //政治面目
        student_status: 1, //学籍状态。1:在读 2:休学 3:退学 4:结业 5:缓毕业 6:毕业
        degree_status: 0, //学位状态 0: 无 1:有
        create_time: null,
        update_time: null,
        education_level: "专升本", //教育等级名称
        nationality: "汉", //民族名称
        province: "北京", //籍贯-省名称
        city: null, //籍贯-市名称
        name_alias: "董大拿", //曾用名
        position: "主任", //职务
        birth_address: "山东", //户口所在地
        work_company: "中国人民大学继续教育处", //工作单位
        work_postcode: 243422, //工作邮政编码
        work_phone: "010-2343213", //工作电话
        work_time: "2019-09-10", //参加工作时间
        home_address: "北京市海淀区中关村大街101", //通讯所在地
        home_postcode: 234342, //通讯邮政编码
        home_phone: 13890909000, //通讯电话
        english_exam_date: "2018-09" //英语考试时间(时间戳)
      }, // 学生基本信息
      resultInfo: [], // 学生成绩信息
      changeInfo: {}, // 休、退学申请信息
      graduationtInfo: {}, // 毕业申请信息
      degreeInfo: {}, // 毕业学位申请信息

      avatarParams: {
        // 基础信息组件传参
        name: "",
        avatar: "",
        statusText: "",
        statusType: "",
        list: []
      }
    };
  },
  components: {
    AppAvatarInfo
  },
  methods: {
    ...mapActions([
      "getAdultClassStudentsInfo",
      "getAdultClassStudentsResult",
      "getAdultClassStudentsChange",
      "getAdultClassStudentsGraduationt",
      "getAdultClassStudentsDegree"
    ]),
    initData() {
      // 获取学生的基本信息
      this.loading = true;
      if (this.loading) {
        this.getAdultClassStudentsInfo({
          data: {
            id: this.query.s_id
          }
        }).then(data => {
          /** start!!! */
          this.loading = false;
          Object.assign(this.avatarParams, {
            name: `${this.showInfo.name} / ${this.showInfo.code}`,
            avatar: this.showInfo.avatar,
            statusText: "测试",
            statusType: "success",
            list: [
              {
                label: "性别",
                content: "女"
              },
              {
                label: "出生日期",
                content: this.showInfo.birthday
              },
              {
                label: "民族",
                content: this.showInfo.nationality
              },
              {
                label: "政治面貌",
                content: this.showInfo.zzmm
              },
              {
                label: "身份证号",
                content: this.showInfo.cardno
              },
              {
                label: "通讯地址",
                content: this.showInfo.address
              },
              {
                label: "邮箱",
                content: this.showInfo.email
              },
              {
                label: "联系电话",
                content: this.showInfo.phone
              },
              {
                label: "年级",
                content: this.showInfo.grade
              },
              {
                label: "层次",
                content: this.showInfo.education_level
              },
              {
                label: "专业",
                content: this.showInfo.profession
              },
              {
                label: "学制",
                content: this.showInfo.xz
              },
              {
                label: "分院(教学站)",
                content: this.showInfo.fy
              },
              {
                label: "系所",
                content: this.showInfo.xsh
              },
              {
                label: "入学时间",
                content: this.showInfo.rxrq
              },
              {
                label: "预计毕业时间",
                content: this.showInfo.yjbyrq
              },
              {
                label: "准考证号",
                content: this.showInfo.zkzh
              },
              {
                label: "入学总分",
                content: this.showInfo.rxzf
              }
            ]
          });
          return;
          /** end!!! */
          if (data.data.code === 200) {
            this.showInfo = data.data.data;
            this.loading = false;
            if (this.query.type == 0) {
              // 个人信息
              this.getResult(); // 获取学生成绩
            } else if (this.query.type == 1) {
              // 休学申请信息、退学申请信息、毕业申请信息
              if (this.query.s_s == 2 || this.query.s_s == 3) {
                // 休学、退学
                this.getChange(); // 获取休复、学/退学申请信息
              } else if (
                this.query.s_s == 4 ||
                this.query.s_s == 5 ||
                this.query.s_s == 6
              ) {
                // 结业、缓毕业、毕业
                this.getGraduation(); // 获取毕业申请信息
              }
            } else if (this.query.type == 2) {
              // 学位申请
              this.getDegree(); // 获取学位申请信息
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
    getResult() {
      // 获取成绩
      this.loading = true;
      if (this.loading) {
        this.getAdultClassStudentsResult({
          data: {
            id: this.query.s_id
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.resultInfo = data.data.data.list;
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
    getChange() {
      // 获取休复学信息、获取退学信息
    },
    getGraduation() {
      // 获取毕业信息
    },
    getDegree() {
      // 获取学位信息
    }
  },
  created() {
    this.query = this.$route.query;
    if (this.query.s_id) {
      this.initData();
    }
  }
};
</script>

<style scoped>
.app-adult-class-student-info-body {
  width: 800px;
  margin: 50px auto;
}
table {
  border-collapse: collapse;
  line-height: 2em;
  font-family: "仿宋", "FangSong";
  font-size: 16px;
}
td {
  padding: 6px 2px;
}
</style>
