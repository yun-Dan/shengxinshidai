<template>
  <div class="app-classroom-image">
    <div class="classroom-image-box">
      <img src="../../../assets/images/rd_map.jpg" alt style="height: 800px">
      <div class="coord-box">
        <el-badge :value="a.list.length" class="coord-item coord-item-a">
          <el-button
            size="mini"
            type="text"
            style="font-weight: bold"
            @click.native="showInfo(a)"
          >{{ a.name }}</el-button>
        </el-badge>
        <el-badge :value="b.list.length" class="coord-item coord-item-b">
          <el-button
            size="mini"
            type="text"
            style="font-weight: bold"
            @click.native="showInfo(b)"
          >{{ b.name }}</el-button>
        </el-badge>
        <el-badge :value="c.list.length" class="coord-item coord-item-c">
          <el-button
            size="mini"
            type="text"
            style="font-weight: bold"
            @click.native="showInfo(c)"
          >{{ c.name }}</el-button>
        </el-badge>
        <el-badge :value="d.list.length" class="coord-item coord-item-d">
          <el-button
            size="mini"
            type="text"
            style="font-weight: bold"
            @click.native="showInfo(d)"
          >{{ d.name }}</el-button>
        </el-badge>
        <el-badge :value="e.list.length" class="coord-item coord-item-e">
          <el-button
            size="mini"
            type="text"
            style="font-weight: bold"
            @click.native="showInfo(e)"
          >{{ e.name }}</el-button>
        </el-badge>
        <el-badge :value="f.list.length" class="coord-item coord-item-f">
          <el-button
            size="mini"
            type="text"
            style="font-weight: bold"
            @click.native="showInfo(f)"
          >{{ f.name }}</el-button>
        </el-badge>
      </div>
    </div>
    <!--楼宇信息-->
    <el-dialog
      :title="dialogVisible_title"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      width="800px"
    >
      <div>
        <el-table border :data="dialogVisible_table" style="width: 100%">
          <el-table-column align="center" prop="a3" label="教室名称"></el-table-column>
          <el-table-column align="center" prop="xy" label="教室所属学院"></el-table-column>
          <el-table-column align="center" label="所在位置">
            <template slot-scope="scope">
              <div>{{ scope.row.a4}}</div>
              <el-tag v-if="scope.row.a8" size="mini">{{ scope.row.a8}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="a5" label="设备情况"></el-table-column>
          <el-table-column align="center" prop="a1" label="教室管理人" width="124px">
            <template slot-scope="scope">
              <div>{{ scope.row.a1}}</div>
              <div v-if="scope.row.a2" style="color: #5daf34">{{ scope.row.a2}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="收费标准">
            <template slot-scope="scope">
              <strong>{{ scope.row.a6}} {{ scope.row.a7}}</strong>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "app-classroom-image",
  data() {
    return {
      a: {
        name: "明德楼",
        list: []
      }, // 明德楼
      b: {
        name: "求是楼",
        list: []
      }, // 求是楼
      c: {
        name: "音乐厅",
        list: []
      }, // 音乐厅
      d: {
        name: "校医院",
        list: []
      }, // 校医院
      e: {
        name: "汇贤大厦",
        list: []
      }, // 汇贤大厦
      f: {
        name: "人文楼",
        list: []
      }, // 人文楼
      dialogVisible: false,
      dialogVisible_title: "信息",
      dialogVisible_table: []
    };
  },
  methods: {
    ...mapActions(["getClassroomImage"]),
    initData() {
      this.getClassroomImage({}).then(data => {
        if (data.data.code === 200) {
          const Data = data.data.data;
          Data.map(item => {
            if (item.state == 4) {
              if (item.a8 === "明德楼") {
                this.$set(this.a, "name", item.a8);
                this.a.list.push(item);
              }
              if (item.a8 === "求是楼") {
                this.$set(this.b, "name", item.a8);
                this.b.list.push(item);
              }
              if (item.a8 === "音乐厅") {
                this.$set(this.c, "name", item.a8);
                this.c.list.push(item);
              }
              if (item.a8 === "校医院") {
                this.$set(this.d, "name", "校医院");
                this.d.list.push(item);
              }
              if (item.a8 === "汇贤大厦") {
                this.$set(this.e, "name", "汇贤大厦");
                this.e.list.push(item);
              }
              if (item.a8 === "人文楼") {
                this.$set(this.f, "name", "人文楼");
                this.f.list.push(item);
              }
            }
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.error
          });
        }
      });
    },
    showInfo(val) {
      this.dialogVisible_title = val.name;
      this.dialogVisible_table = val.list;
      this.dialogVisible = true;
    }
  },
  beforeMount() {
    this.initData();
  }
};
</script>

<style scoped>
.app-classroom-image {
  text-align: center;
  vertical-align: top;
}
.classroom-image-box {
  position: relative;
  display: inline-block;
  margin: 0 auto;
}
.coord-item {
  position: absolute;
  font-weight: bold;
}
.coord-item-a {
  top: 280px;
  left: 160px;
}
.coord-item-b {
  top: 470px;
  left: 770px;
}
.coord-item-c {
  top: 370px;
  left: 570px;
}
.coord-item-d {
  top: 590px;
  left: 430px;
}
.coord-item-e {
  top: 350px;
  left: 100px;
}
.coord-item-f {
  top: 455px;
  left: 590px;
}
</style>
