<template>
  <div class="app-weixin-reply">
    <el-card class="box-card">
      <div class="weixin-reply-main" v-cloak>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" type="index" label="序号"></el-table-column>
          <el-table-column align="center" label="更新日期" width="180">
            <template slot-scope="scope">{{ scope.row.update_time | TimestampChangeFilter }}</template>
          </el-table-column>
          <el-table-column align="center" label="回复类型">
            <template slot-scope="scope">{{ scope.row.type===1?'关注回复':'未匹配到的回复'}}</template>
          </el-table-column>
          <el-table-column header-align="center" prop="content" label="回复内容"></el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click.native="handlerEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getForm.page"
          :page-size="getForm.limit"
          layout="total,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="自定义回复管理"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-card v-cloak>
        <el-form ref="form" :model="form" label-width="90px" style="text-align: left">
          <el-form-item label="回复类型：">
            <div>{{ form.type===1?'关注回复':'未匹配到的回复' }}</div>
          </el-form-item>
          <el-form-item label="回复内容：">
            <el-input type="textarea" :rows="8" v-model.trim="form.content"></el-input>
            <span class="input-tip">* 请不要多于1000字否则无法发送!</span>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native=" handleTrue">提 交</el-button>
        <el-button @click.native="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-weixin-reply",
  data() {
    return {
      total: 0,
      tableData: [],
      getForm: {
        page: 1,
        limit: 20,
        uid: 0
      },
      dialogFormVisible: false,
      form: {
        type: 0,
        content: ""
      },
      editId: 0
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getWeiXinReply", "updateWeiXinReply"]),
    initData() {
      this.$set(this.getForm, "uid", this.userInfo.uid);
      this.getWeiXinReply({
        data: this.getForm
      }).then(data => {
        if (data.data.code === 200) {
          this.tableData = data.data.data.list;
          this.total = data.data.data.dataCount;
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.erro
          });
        }
      });
    },
    handlerEdit(val) {
      Object.assign(this.form, {
        type: val.type,
        content: val.content
      });
      this.editId = val.id;
      this.dialogFormVisible = true;
    },
    handleTrue() {
      // 编辑框的确认按钮
      if (!this.form.content) {
        this.$message({
          message: "输入内容不能为空！",
          type: "error"
        });
        return false;
      }
      if (this.form.content.length > 1000) {
        this.$message({
          message: "输入内容不能超过1000字符！",
          type: "error"
        });
        return false;
      }
      this.updateWeiXinReply({
        id: this.editId,
        data: this.form
      }).then(data => {
        if (data.data.code === 200) {
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: data.data.data
          });
          this.initData();
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, "page", currentPage);
      this.initData();
    }
  },
  created () {
    this.initData();
  }
};
</script>

<style scoped>
.input-tip {
  font-size: 12px;
  color: #8492a6;
}
</style>
