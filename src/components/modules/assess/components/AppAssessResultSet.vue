<template>
  <div
    class="app-assess-result-set"
    v-loading="loading2"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-card>
      <div slot="header" class="clearfix">
        <div style="text-align: center">
          <span class="assess-result-set-title">{{ result_Pro.pro_name }}</span>
        </div>
        <div class="fr" style="padding-right: 40px">
          <el-button type="primary" @click.native="$router.go(-1)">返回</el-button>
        </div>
      </div>
      <div style="padding: 20px">
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="grid-content bg-purple">
              <el-tabs type="border-card">
                <el-tab-pane v-for="(item,key,index) in resultData" :key="index" :label="key">
                  <el-table
                    :data="item"
                    border
                    class="assess-result-set-table-item"
                    style="width: 100%"
                    @select="handleSelect"
                  >
                    <el-table-column align="center" type="selection" width="55"></el-table-column>
                    <el-table-column align="center" label="序号" type="index" width="80"></el-table-column>
                    <el-table-column header-align="center" prop="title" label="违规行为"></el-table-column>
                    <el-table-column align="center" prop="score" label="培训考核扣分标准"></el-table-column>
                    <el-table-column align="center" prop="manage_scale" label="加罚管理费比例标准"></el-table-column>
                    <el-table-column align="center" prop="descrip" label="备注"></el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div class>
                <el-form :model="form" label-position="top" style="text-align: left">
                  <el-form-item label="剩余考核分数：">
                    <span
                      v-if="result_Pro.proapp_count_res<60"
                      style="color: #ff0000"
                    >{{ result_Pro.proapp_count_res }}</span>
                    <span v-else style="color: #008000">{{ result_Pro.proapp_count_res }}</span>
                    分
                  </el-form-item>
                  <el-form-item label="本次考核扣除总分：" :rules="[{required:true}]">
                    <el-input-number
                      v-model="form.score"
                      :min="0"
                      :max="resultData.proapp_count_res"
                      label="描述文字"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item label="考核说明：">
                    <el-input type="textarea" v-model.trim="form.desc" :rows="4"></el-input>
                  </el-form-item>
                  <el-form-item style="text-align: center">
                    <el-button type @click="$router.go(-1)">返 回</el-button>
                    <el-button type="success" @click="handleTrue">提交考核</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-assess-result-set",
  data() {
    return {
      loading2: false,
      result_Pro: {},
      resultData: {},
      form: {
        pro_id: 0,
        score_key: [],
        score: 0,
        description: ""
      },
      list: [] // 真
    };
  },
  methods: {
    ...mapActions(["standardResult", "addAssessResult"]),
    initData() {
      this.standardResult({
        data: {}
      }).then(data => {
        if (data.data.code === 200) {
          this.resultData = data.data.data.list;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleSelect(selection, row) {
      // 勾选当前项触发
      let status = true;
      let num = -1;
      if (this.list.length) {
        status = this.list.some((item, index) => {
          if (item.id === row.id) {
            num = index;
            return true;
          }
        });
        if (status) {
          this.list.splice(num, 1);
        } else {
          this.list.push(row);
        }
      } else {
        this.list.push(row);
      }

      let total = 0;
      let scoreArr = this.list.map(item => {
        total += item.score;
        return item.id;
      });
      this.$set(this.form, "score_key", scoreArr);
      this.$set(this.form, "score", total);
    },
    handleTrue() {
      this.addAssessResult({
        data: this.form
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
  beforeMount() {
    if (sessionStorage.getItem("result_Pro")) {
      let obj = JSON.parse(sessionStorage.getItem("result_Pro"));
      Object.assign(this.result_Pro, obj);
      this.$set(this.form, "pro_id", this.$route.params.id);
      this.initData();
    } else {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.assess-result-set-title {
  font-size: 1.2em;
  color: #444;
  font-weight: bold;
  margin-bottom: 28px;
}
</style>
