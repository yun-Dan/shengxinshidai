<template>
  <div
    class="app-protocol-other-info"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card>
      <div slot="header" class="clearfix" v-cloak>
        <div class="fr" style="padding-right: 20px">
          <el-button type="success" icon @click.native="$router.go(-1)">返 回</el-button>&nbsp;
        </div>
        <div class="protocol-other-info-title">{{ showData.pro_name }}【{{ showData.pro_code }}】</div>
      </div>
      <div class v-cloak>
        <ul class="step-list">
          <li>
            <strong>合同名称：</strong>
            {{ showData.htmc }}
          </li>
          <li>
            <strong>合同编号：</strong>
            <span v-if="showData.contract_code">{{ showData.contract_code }}</span>
            <span style="color: #f56c6c" v-else>未分配</span>
          </li>
          <li>
            <strong>合同金额：</strong>
            {{ showData.htje }} 元
          </li>
          <li>
            <strong>合同相对方：</strong>
            {{ showData.htxdf }}
          </li>
          <li>
            <strong>合同执行开始时间：</strong>
            {{ showData.start_time | TimestampChangeFilter }}
          </li>
          <li>
            <strong>合同执行结束时间：</strong>
            {{ showData.end_time | TimestampChangeFilter }}
          </li>
          <li>
            <strong>合同附件：</strong>
            <div v-for="(item,index) in showData.attachment" :key="index" style="padding-left: 2em">
              {{ index+1}}.
              <a target="_blank" :href=" lookUrl+ '/'+item.code">
                <el-button type="text" style="padding: 0px">{{ item.origin_name }}</el-button>
              </a>
            </div>
          </li>
        </ul>
        <el-form v-if="is_check" :model="checkForm" label-width="120px" v-cloak>
          <el-form-item label="审核结果：" :rules="[{required: true}]">
            <el-radio-group v-model="checkForm.status">
              <el-radio :label="3">审核通过</el-radio>
              <el-radio :label="2">审核不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="checkForm.status===2" label="审核不通过原因" :rules="[{required: true}]">
            <el-row>
              <el-col :sm="24" :lg="12">
                <div class="grid-content bg-purple">
                  <el-input type="textarea" v-model.trim="checkForm.content"></el-input>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.native="handleCheckTrue">确 定</el-button>
            <el-button @click="$router.go(-1)">取 消</el-button>
          </el-form-item>
        </el-form>
        <div id="note" style>
          <strong>完整协议文本：</strong>
          <div ref="pxap" style="padding: 0 2em"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "app-protocol-other-info",
  data() {
    return {
      loading2: false,
      showData: {},
      checkForm: {
        id: 0,
        uid: 0,
        pro_id: 0,
        status: 3,
        content: ""
      },
      is_check: false
    };
  },
  computed: {
    ...mapState(["lookUrl", 'userInfo'])
  },
  methods: {
    ...mapActions(["getOtherProtocol", "checkOther"]),
    initData(id) {
      this.loading2 = true;
      this.getOtherProtocol({
        data: {
          id: id
        }
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          this.showData = Data;
          this.showPxap(this.showData.note);
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
    },
    showPxap(strContent = "") {
      this.$nextTick(() => {
        if (this.showData.note) {
          strContent = strContent.replace(/\r\n/g, "<br/>"); //IE9、FF、chrome
          strContent = strContent.replace(/\n/g, "<br/>"); //IE7-8
          strContent = strContent.replace(/\s/g, " "); //空格处理
          this.$refs.pxap.innerHTML = strContent;
        } else {
          this.$refs.pxap.innerHTML = "无";
        }
      });
    },
    handleCheckTrue() {
      if (this.checkForm.status === 2) {
        if (!this.checkForm.content) {
          this.$message({
            type: "warning",
            message: "请输入审核不通过原因！"
          });
          return false;
        }
      }
      Object.assign(this.checkForm, {
        id: this.showData.id,
        uid: this.userInfo.uid,
        pro_id: this.showData.pro_id
      });
      this.loading2 = true;
      this.checkOther({
        data: this.checkForm
      }).then(data => {
        if (data.data.code === 200) {
          this.$message({
            type: "success",
            message: data.data.data,
            onClose: () => {
              this.loading2 = false;
              this.$router.go(-1);
            }
          });
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
  beforeMount () {
    const path = this.$route;
    if (path.fullPath.indexOf("check") > 0) {
      this.is_check = true;
    } else {
      this.is_check = false;
    }
    this.initData(path.params.id);
  }
};
</script>

<style scoped>
.protocol-other-info-title {
  font-size: 1.2em;
  color: #444;
  font-weight: bold;
  margin-bottom: 28px;
  text-align: center;
}
.step-list {
  margin: 20px;
}
.step-list li {
  line-height: 40px;
  padding: 0 10px;
}
.step-list li:nth-of-type(2n) {
  background-color: #fafafa;
}
.step-list li:nth-of-type(2n + 1) {
  background-color: #ebeef5;
}
#note {
  line-height: 24px;
  padding: 20px 40px;
  background-color: #ebeef5;
  margin: 40px 20px;
}
</style>
