<template>
  <div class="app-certificate-apply-print">
    <el-card>
      <div slot="header" class="clearfix">
        <el-button type="primary" @click.native="$router.go(-1)">返 回</el-button>
      </div>
      <div id="subOutputRank-print" class="certificate-apply-print-main">
        <div class="certificate-apply-print-content">
          <h2 style="text-align: center;line-height: 40px;margin-bottom: 40px">关于修改（或新增申领）结业证书的申请</h2>
          <h4>继续教育处：</h4>
          <div style="text-indent: 2em">
            我单位举办的《{{ proShow.pro_name }}》，项目编号:{{ proShow.pro_code }}，
            <span
              v-if="showData.note"
            >由于{{ showData.note }}原因，</span>申请
            <template v-if="is_cert_name">将证书项目名称修改为：{{ cert_name.after_cont }} ；</template>
            <template v-if="is_is_bilingual">证书类别修改为：{{ is_bilingual.after_cont }} ；</template>
            <template v-if="is_cert_name_en">
              <template
                v-if="cert_name_en.before_cont&&!cert_name_en.after_cont"
              >删除证书英文名称：{{ cert_name_en.after_cont }} ；</template>
              <template
                v-if="cert_name_en.before_cont&&cert_name_en.after_cont"
              >证书英文名称修改为：{{ cert_name_en.after_cont }} ；</template>
              <template
                v-if="!cert_name_en.before_cont&&cert_name_en.after_cont"
              >增加证书英文名称：{{ cert_name_en.after_cont }} ；</template>
            </template>
            <template v-if="is_is_photo">是否粘贴照片修改为：{{ is_photo.after_cont }} ；</template>
            <template v-if="is_is_all">全员领取证书修改为：{{ is_all.after_cont }} ；</template>
            <template v-if="is_cert_start_time || is_cert_end_time">
              项目举办时间修改为：
              <template v-if="is_cert_start_time&&!is_cert_end_time">
                <span>{{ cert_start_time.after_cont | TimestampChangeFilter }}</span>
                至
                <span>{{ proShow.cert_end_time | TimestampChangeFilter }}</span>
              </template>
              <template v-if="(!is_cert_start_time)&&is_cert_end_time">
                <span>{{ proShow.cert_start_time | TimestampChangeFilter }}</span>
                至
                <span>{{ cert_end_time.after_cont | TimestampChangeFilter }}</span>
              </template>
              <template v-if="is_cert_start_time&&is_cert_end_time">
                <span>{{ cert_start_time.after_cont | TimestampChangeFilter }}</span>
                至
                <span>{{ cert_end_time.after_cont | TimestampChangeFilter }}</span>
              </template>
              {{ (is_edit_students||is_add_students)?'；':'。'}}
            </template>
            <template v-if="is_edit_students">修改{{ edit_students.length}}位学员的结业证书</template>
            <template v-if="is_edit_students&&is_add_students">、</template>
            <template v-if="is_add_students">新增申领{{ add_students.length}}位学员结业证书</template>
            <template v-if="is_del_students">
              <template v-if="is_edit_students||is_add_students">、</template>
              <template>删除{{ del_students.length}}位学员结业证书</template>
            </template>
            <template v-if="is_edit_students||is_add_students||is_del_students">。</template>
          </div>
          <div v-if="is_edit_students">
            <h4>修改：</h4>
            <div style="padding-left: 32px">
              <table border="1" style="width:100%;border-collapse: collapse;border-color: #303133">
                <tr style="text-align: center">
                  <td>证书编号</td>
                  <td>原姓名</td>
                  <td>更正姓名</td>
                  <td>备注</td>
                </tr>
                <tr v-for="item in edit_students" :key="item.id" style="text-align: center">
                  <td style="width: 180px">{{ item.student_info.cert_code }}</td>
                  <td style="width: 120px">{{ item.before_cont }}</td>
                  <td style="width: 120px">{{ item.after_cont }}</td>
                  <td></td>
                </tr>
              </table>
            </div>
          </div>
          <div v-if="is_add_students">
            <h4>新增：</h4>
            <div v-for="item in add_students" :key="item.id" style="text-indent: 2em; word-break: break-all;">
              <span v-if="item.content.name"> {{ item.content.name }}</span>
              <span v-if="item.content.sex">，{{ item.content.sex }}</span>
              <span v-if="item.content.national">，{{ item.content.national }}</span>
              <span v-if="item.content.idcard">，{{ item.content.idcard }}</span>
              <span v-if="item.content.company">，{{ item.content.company }}</span>
              <span v-if="item.content.resign">，{{ item.content.resign}}</span>
              <span v-if="item.content.mobile">，{{ item.content.mobile }}</span>
              <span v-if="item.content.email">，{{ item.content.email }}</span>
              。
            </div>
          </div>
          <div v-if="is_del_students">
            <h4>删除：</h4>
            <div style="text-indent: 2em">
              <div
                v-for="(item,index) in del_students"
                :key="index"
              >{{ index+1}}、{{ item.student_info.cert_code }}，{{ item.before_cont }}，{{ item.student_info.company }}，{{ item.student_info.resign}}，{{ item.student_info.mobile }}。</div>
            </div>
          </div>
          <div style="text-indent: 2em;line-height: 100px">特此申请。</div>
          <div style="text-align: right">
            <div>{{ proShow.college }}</div>
            <div>{{ showData.create_time | TimestampChangeFilter(true) }}</div>
          </div>
          <div style="font-size: 12px;line-height: 26px;padding-top: 40px;text-indent: 2em">
            <strong>重要提示：</strong>所有需要修改的证书，需将原件交回继续教育处以旧换新！结业证书遗失不补，由办班单位自行为学员开具培训证明。
          </div>
        </div>
      </div>
      <div class="certificate-apply-print-foot">
        <el-button type @click.native="$router.go(-1)">返 回</el-button>
        <el-button type="success" @click.native="doPrint">打 印</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { doPrint } from '@/assets/js/doPrint.js'
export default {
  name: "app-certificate-apply-print",
  data() {
    return {
      proShow: {},
      showData: {},
      is_cert_name: false, //证书名
      cert_name: {},
      is_is_bilingual: false, //证书类别
      is_bilingual: {},
      is_cert_name_en: false, // 英文名称
      cert_name_en: {},
      is_is_photo: false, //是否粘贴照片
      is_photo: {},
      is_is_all: false, //  是否全员
      is_all: {},
      is_cert_start_time: false, // 开始时间
      cert_start_time: {},
      is_cert_end_time: false, // 结束时间
      cert_end_time: {},
      is_edit_students: false, // 编辑学员
      edit_students: [],
      is_add_students: false, // 新增学员
      add_students: [],
      is_del_students: false, //删除学员
      del_students: []
    };
  },
  methods: {
    ...mapActions(["getCertificatesModifyList"]),
    initData() {
      if (
        sessionStorage.getItem("apply_content_INFO") &&
        sessionStorage.getItem("apply_pro_info")
      ) {
        this.proShow = JSON.parse(sessionStorage.getItem("apply_pro_info"));
        this.showData = JSON.parse(
          sessionStorage.getItem("apply_content_INFO")
        );
        this.showData.mod_content.forEach(item => {
          if (item.field_name === "cert_name") {
            // 证书名
            this.is_cert_name = true;
            this.cert_name = item;
          }
          if (item.field_name === "is_bilingual") {
            // 证书类别
            this.is_is_bilingual = true;
            this.is_bilingual = item;
          }
          if (item.field_name === "is_photo") {
            // 粘贴照片
            this.is_is_photo = true;
            this.is_photo = item;
          }
          if (item.field_name === "is_all") {
            // 是否全员
            this.is_is_all = true;
            this.is_all = item;
          }
          if (item.field_name === "cert_name_en") {
            // 英文名称
            this.is_cert_name_en = true;
            this.cert_name_en = item;
          }
          if (item.field_name === "cert_start_time") {
            // 开始时间
            this.is_cert_start_time = true;
            this.cert_start_time = item;
          }
          if (item.field_name === "cert_end_time") {
            // 结束时间
            this.is_cert_end_time = true;
            this.cert_end_time = item;
          }
          if (item.field_name === "edit_students") {
            // 编辑学员
            this.is_edit_students = true;
            this.edit_students.push(item);
          }
          if (item.field_name === "add_students") {
            //新增学员
            this.is_add_students = true;
            this.add_students.push(item);
          }
          if (item.field_name === "del_students") {
            //新增学员
            this.is_del_students = true;
            this.del_students.push(item);
          }
        });
      } else if (sessionStorage.getItem("certApplyPrint")) {
        this.proShow = JSON.parse(sessionStorage.getItem("apply_pro_info"));
        const cert = JSON.parse(sessionStorage.getItem("certApplyPrint"));
        this.getCertificatesModifyList({
          data: {
            cert_id: cert.cert_id
          }
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            if (Data.list && Data.list.length) {
              const list = Data.list.filter(item => {
                return item.status === 1 && item.cert_id === cert.cert_id;
              });
              if (list.length === 1) {
                this.showData = list[0];
                this.showData.mod_content.forEach(item => {
                  if (item.field_name === "cert_name") {
                    // 证书名
                    this.is_cert_name = true;
                    this.cert_name = item;
                  }
                  if (item.field_name === "is_bilingual") {
                    // 证书类别
                    this.is_is_bilingual = true;
                    this.is_bilingual = item;
                  }
                  if (item.field_name === "is_photo") {
                    // 粘贴照片
                    this.is_is_photo = true;
                    this.is_photo = item;
                  }
                  if (item.field_name === "is_all") {
                    // 是否全员
                    this.is_is_all = true;
                    this.is_all = item;
                  }
                  if (item.field_name === "cert_name_en") {
                    // 英文名称
                    this.is_cert_name_en = true;
                    this.cert_name_en = item;
                  }
                  if (item.field_name === "cert_start_time") {
                    // 开始时间
                    this.is_cert_start_time = true;
                    this.cert_start_time = item;
                  }
                  if (item.field_name === "cert_end_time") {
                    // 结束时间
                    this.is_cert_end_time = true;
                    this.cert_end_time = item;
                  }
                  if (item.field_name === "edit_students") {
                    // 编辑学员
                    this.is_edit_students = true;
                    this.edit_students.push(item);
                  }
                  if (item.field_name === "add_students") {
                    //新增学员
                    this.is_add_students = true;
                    this.add_students.push(item);
                  }
                  if (item.field_name === "del_students") {
                    //新增学员
                    this.is_del_students = true;
                    this.del_students.push(item);
                  }
                });
              }
            }
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error
            });
          }
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: "获取数据失败！"
        });
        this.$router.go(-1);
      }
    },
    doPrint() {
      doPrint()
    }
  },
  beforeMount() {
    this.initData();
  },
  beforeDestroy() {
    sessionStorage.removeItem("apply_content_INFO");
    sessionStorage.removeItem("certApplyPrint");
  }
};
</script>

<style scoped>
.certificate-apply-print-content {
  width: 580px;
  margin: 0 auto;
  padding: 20px 40px 0;
  font-family: "SimSun";
  font-size: 16px;
  line-height: 30px;
}
.certificate-apply-print-foot {
  margin: 50px 0;
  text-align: center;
}
h4 {
  padding-top: 20px;
}
</style>
