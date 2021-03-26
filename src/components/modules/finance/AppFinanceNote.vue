<template>
  <div class="app-finance-note">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-cloak>
        <div class="fl">
          <el-button-group style="margin-bottom: 10px">
            <el-button @click.native="handleAll" type="primary" icon="el-icon-menu">全部</el-button>
          </el-button-group>
        </div>
        <div class="fr query-box">
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
                v-model="getForm.structrue"
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
                v-model="getForm.pxlx"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 不限类型 --" :value="''"></el-option>
                <el-option
                  v-for="(item,key,index) in proConfig.pxlx"
                  :label="item"
                  :value="key"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="getForm.xklb"
                placeholder="请选择"
                @change="handleSelect"
              >
                <el-option label="-- 不限类别 --" :value="''"></el-option>
                <el-option
                  v-for="(item,key,index) in proConfig.xklb"
                  :label="item"
                  :value="key"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="getForm.sea_field" placeholder="请选择">
                <el-option label="项目编号" value="pro_code"></el-option>
                <el-option label="项目名称" value="pro_name"></el-option>
                <el-option label="招生对象" value="zsdx"></el-option>
                <el-option label="联系人姓名" value="user"></el-option>
                <el-option label="联系方式" value="tel"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form inline class="fr" @submit.native.prevent>
            <el-form-item>
              <el-input
                placeholder="Search"
                v-model.trim="getForm.keywords"
                class="input-with-select"
                clearable
              >
                <el-button @click.native="handleSearch" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="finance-account-main" v-cloak></div>
      <div class="page-box" >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="getForm.page"
          :page-size.sync="getForm.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-finance-note",
  data() {
    return {
      total: 0,
      tableData: [],
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      getForm: {
        xklb: "",
        pxlx: "",
        college: null,
        structrue: null,
        sea_field: "pro_code",
        keywords: "",
        page: 1,
        limit: 20
      },
      collegeList: [],
      structuresList: []
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(["getStructures"]),
    initData() {},
    handleAll() {
      Object.assign(this.getForm, this.$options.data().getForm);
      this.initData();
    },
    handleSearch() {
      if (!this.getForm.keywords) {
        this.$message({
          message: "请输入搜索关键字！",
          type: "warning"
        });
      } else {
        this.initData();
        this.showAll = true;
      }
    },
    handleSizeChange(pageSize) {
      // pageSize 改变时会触发
      this.$set(this.getForm, "limit", pageSize);
      this.initData();
    },
    handleCurrentChange(currentPage) {
      //  currentPage 改变时会触发
      this.$set(this.getForm, "page", currentPage);
      this.initData();
      this.$nextTick(() => {
        this.$el.offsetParent.offsetParent.scrollTop = 0;
      });
    },
    handleSelect() {
      Object.assign(this.getForm, {
        page: 1,
        limit: 20
      });
      this.initData();
    }
  },
  beforeMount() {
    this.getStructures({
      data: {
        // level:1
      }
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
    this.initData();
  }
};
</script>
