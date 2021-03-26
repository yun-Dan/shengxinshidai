<template>
  <div class="four-major-index" v-loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <el-button-group>
          <el-button @click.native="handleUpdate(1)" type="primary" icon="el-icon-plus">新增</el-button>
          <el-button icon="el-icon-menu" @click.native="handleSearch(0)">全部</el-button>
        </el-button-group>
        <div class="fr query-box" @keyup.enter="handleSearch">
          <el-form :inline="true" @submit.native.prevent>
            <el-form-item>
              <el-select v-model="getForm.college_id" placeholder="请选择" @change="handleSearch">
                <el-option label="-- 不限学院 --" :value="null"></el-option>
                <el-option v-for="(item,index) in collegeList"
                  :label="item.name" :value="item.id" :key="index" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="getForm.name" placeholder="专业名称" clearable class="input-with-select"
                style="width: 210px">
                <el-button slot="append" icon="el-icon-search" @click.native="handleSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="users-college-main" v-cloak>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              <span>{{ (getForm.page-1)*getForm.limit+(scope.$index+1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="专业名称"></el-table-column>
          <el-table-column align="center" prop="numbers" label="专业代码"></el-table-column>
          <el-table-column align="center" prop="college_name" label="所属学院"></el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" plain @click.native="handleUpdate(scope.row)">编辑</el-button>
              <el-button @click.native="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getForm.page"
        :page-size="getForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!--新增、编辑-->
    <el-dialog
      title="专业信息"
      :visible.sync="dialogVisible"
      append-to-body
      center
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form v-loading="dialogLoading" label-width="100px">
        <el-form-item label="专业名称：" :rules="[{required: true}]">
          <el-input v-model.trim="form.name" placeholder="请输入专业名称"></el-input>
        </el-form-item>
        <el-form-item label="专业代码：" :rules="[{required: true}]">
          <el-input v-model.trim="form.numbers" placeholder="请输入专业代码"></el-input>
        </el-form-item>
        <el-form-item label="所属学院：" :rules="[{required: true}]">
          <el-select v-model="form.college_id" placeholder="请选择">
            <el-option v-for="(item,index) in collegeList"
              :label="item.name" :value="item.id" :key="index" ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="handleTrue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

const urls = {
  list: '/yxb/major/index',
  add: '/yxb/major/save',
  update: '/yxb/major/update',
  info: '/yxb/major/read',
  delete: '/yxb/major/delete'
}

import { mapActions } from 'vuex'
export default {
  name: 'four-major-index',
  data() {
    return {
      loading: false,
      getForm: {
        name: '',
        college_id: null,
        page: 1,
        limit: 20
      },
      tableData: [],
      total: 0,
      key: 1,
      id: null,
      form: {
        name: '',
        numbers: '', 
        college_id: null
      },
      dialogVisible: false,
      dialogLoading: false,
      collegeList: []
    }
  },
  methods: {
    ...mapActions([
      'axiosHttp',
      'getStructures'
    ]),
    initData() {
      this.loading = true
      if (this.loading) {
        this.axiosHttp({
          url: urls.list,
          data: this.getForm
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data
            this.tableData = Data.data
            this.total = Data.dataCount
            this.loading = false
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error
            })
          }
        })
      }
    },
    handleSearch(type) {
      if (type === 0) {
        Object.assign(this.getForm, this.$options.data().getForm)
      }
      this.initData()
    },
    handleUpdate(val) { // @val：1新增、{}编辑
      this.dialogLoading = false
      if (val === 1) {
        this.key = 1
        Object.assign(this.form, this.$options.data().form)
      } else {
        this.key = 0
        this.id = val.id
        Object.assign(this.form, {
          name: val.name,
          numbers: val.numbers,
          college_id: val.college_id - 0 || null
        })
      }
      this.dialogVisible = true
    },
    handleTrue() {
      if (!this.form.name) {
        this.$message({
          type: 'warning',
          message: '专业名称不能为空！'
        })
        return false
      }
      if (!this.form.numbers) {
        this.$message({
          type: 'warning',
          message: '专业代码不能为空！'
        })
        return false
      }
      if (!this.form.college_id) {
        this.$message({
          type: 'warning',
          message: '请选择专业所属学院！'
        })
        return false
      }
      this.dialogLoading = true
      if (this.dialogLoading) {
        this.axiosHttp({
          url: this.key ? urls.add : urls.update,
          type: 'post',
          data: Object.assign({}, this.form, this.key ? {} : {
            id: this.id
          })
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: 'success',
              message: data.data.data
            })
            this.dialogVisible = false
            this.initData()
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error,
              onClose: () => {
                this.dialogLoading = false
              }
            })
          }
        })
      }
    },
    handleDelete(val) {
      this.$confirm('是否删除所选专业信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        this.axiosHttp({
          url: urls.delete,
          type: 'post',
          data: {
            id: val.id
          }
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: 'success',
              message: data.data.data
            })
            this.initData()
          } else {
            this.$notify.error({
              title: '错误',
              message: data.data.error
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(pageSize) {
      this.$set(this.getForm, 'limit', pageSize)
      this.initData()
    },
    handleCurrentChange(currentPage) {
      this.$set(this.getForm, 'page', currentPage)
      this.initData()
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0
      });
    },
    getCollege () {
       this.getStructures({
        data: {}
      }).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data
          Data.forEach(item => {
            if (item.level === 1) {
              this.collegeList.push(item)
            }
          })
        }
      });
    }
  },
  created() {
    this.initData()
    this.getCollege()
  }
}
</script>
