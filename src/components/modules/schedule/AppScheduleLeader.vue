<template>
  <div class="app-schedule-leader" v-loading="loading">
    <div class="app-schedule-index-search clearfix">
      <el-select
        v-model="getForm.user"
        size="small"
        placeholder="请选择会议领导人"
        style="width: 134px"
        @change="handleSelect"
      >
        <el-option key="所有人" label="-- 所有人 --" value="所有人"></el-option>
        <el-option
          v-for="(item, index) in proConfig.user_nam"
          :key="index"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </div>
    <el-calendar v-model="getForm.date_str">
      <template slot="dateCell" slot-scope="{date, data}">
        <div class="calendar-content-box">
          <div style="margin-bottom: 4px">{{ data.day.split('-').slice(1).join('-') }}</div>
          <template
            v-if="new Date(getForm.date_str).getMonth() + 1 === data.day.split('-').slice(1, 2).join('-') - 0"
          >
            <template v-if="scheduleData[data.day.split('-').slice(2).join('-') - 0]">
              <div
                v-for="(item, index) in scheduleData[data.day.split('-').slice(2).join('-') - 0]"
                :key="index"
                style="margin-bottom: 4px"
              >
                <div v-if="timeStartEnd(item.start_time, item.end_time)" class="clearfix">
                  <el-tag
                    :type="timeType(item.start_time)"
                    size="mini"
                    effect="dark"
                    class="fl"
                  >{{ item.start_time | TimeChangeSegmentFilter }}</el-tag>
                  <div class="fl" style="margin-left: 4px">
                    <span
                      class="calendar-content-box-time"
                    >{{ item.start_time | TimeChangeTimeFilter }}</span>
                    <span style="line-height: 20px">-</span>
                    <span
                      class="calendar-content-box-time"
                    >{{ item.end_time | TimeChangeTimeFilter }}</span>
                  </div>
                </div>
                <el-popover placement="top" :title="item.name" width="260" trigger="hover">
                  <div>
                    <div class="clearfix" style="margin-bottom: 6px">
                      <el-tag
                        type="warning"
                        effect="plain"
                        size="mini"
                        class="fl"
                      >{{ proConfig.schedule_type[item.type] }}</el-tag>
                      <div class="fr schedule-edit-delete">
                        <el-button
                          type="primary"
                          size="mini"
                          icon="el-icon-edit"
                          plain
                          circle
                          @click="handleUpdate(item)"
                        ></el-button>
                        <el-button
                          type="danger"
                          size="mini"
                          :icon="delete_loading ? 'el-icon-loading' : 'el-icon-delete'"
                          plain
                          circle
                          @click="handleDelete(item)"
                        ></el-button>
                      </div>
                    </div>
                    <div>
                      <span class="primary">{{ data.day.split('-').join('.') }}</span>
                      <template v-if="timeStartEnd(item.start_time, item.end_time)">
                        （
                        <span
                          class="calendar-content-box-time"
                        >{{ item.start_time | TimeChangeTimeFilter }}</span>
                        <span style="line-height: 20px">-</span>
                        <span
                          class="calendar-content-box-time"
                        >{{ item.end_time | TimeChangeTimeFilter }}</span>）
                      </template>
                    </div>
                    <div style="margin-bottom: 6px">{{ item.room }}</div>
                    <div style="margin-bottom: 6px">
                      <span style="color: #000; font-weight: 600">人员名单：</span>
                      <span>{{ item.user || '（不明）' }}</span>
                    </div>
                    <div v-if="item.nameuser" style="margin-bottom: 6px">
                      <span style="color: #000; font-weight: 600">主持人：</span>
                      <span>{{ item.nameuser || '（无）' }}</span>
                    </div>
                    <div v-if="item.note">
                      <span style="color: #000; font-weight: 600">备注：</span>
                      <span>{{ item.note || '（无）' }}</span>
                    </div>
                  </div>
                  <el-link type="primary" slot="reference" style="line-height: 20px;">
                    <i class="el-icon-star-on" style="color: #bbeaa6"></i>
                    <span
                      v-if="chuNamePublic({users: item.user})"
                      style="color: #d1274b"
                    >{{ item.name }}</span>
                    <span
                      v-else-if="chuNamePublic({users: item.user, type: 2})"
                      style="color: #007944"
                    >{{ item.name }}</span>
                    <span v-else style="color: #2b2b28">{{ item.name }}</span>
                  </el-link>
                </el-popover>
              </div>
            </template>
            <div class="calendar-content-btn-box">
              <el-button type="text" @click.native="handleClick(date, data)">
                <i class="el-icon-circle-plus"></i>
              </el-button>
            </div>
          </template>
        </div>
      </template>
    </el-calendar>
    <el-dialog
      title="会议日程"
      append-to-body
      center
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-loading="dialogLoading" style="margin-right: 30px">
        <el-form :model="form" class="submit-el-form" label-width="100px">
          <el-form-item label="活动类型：" :rules="[{required: true}]">
            <el-select v-if="proConfig.schedule_type" v-model="form.type" placeholder="选择活动类型">
              <el-option
                v-for="(item, key) in proConfig.schedule_type"
                :label="item"
                :value="key - 0"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称：" :rules="[{required: true}]">
            <el-input v-model.trim="form.name" placeholder="请输入活动名称"></el-input>
          </el-form-item>
          <el-form-item label="人员名单：" :rules="[{required: true}]">
            <el-select
              v-model="form.user"
              multiple
              clearable
              filterable
              allow-create
              default-first-option
              placeholder="请输入活动人员名单"
            >
              <el-option
                v-for="item in users"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主持人：">
            <el-select
              v-model="form.nameuser"
              clearable
              filterable
              allow-create
              default-first-option
              placeholder="请输入活动主持人"
            >
              <el-option
                v-for="item in users"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地点：">
            <el-autocomplete
              style="width: 100%"
              v-model="form.room"
              :fetch-suggestions="querySearch"
              placeholder="请输入活动地点"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="时间：">
            <el-radio-group v-if="!is_edit" v-model="activeType" size="mini">
              <el-radio-button label="1">当日</el-radio-button>
              <el-radio-button label="2">多日</el-radio-button>
            </el-radio-group>
            <template v-if="activeType == 1">
              <div>
                <i class="el-icon-date success2"></i>
                {{ current_day }}
              </div>
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-time-picker
                    v-model="form.start_time"
                    value-format="HH:mm:ss"
                    format="HH:mm"
                    :clearable="true"
                    placeholder="活动开始时间"
                  ></el-time-picker>
                </el-col>
                <el-col :span="2" class="text-align-center">-</el-col>
                <el-col :span="11">
                  <el-time-picker
                    v-model="form.end_time"
                    value-format="HH:mm:ss"
                    format="HH:mm"
                    :clearable="true"
                    placeholder="活动结束时间"
                  ></el-time-picker>
                </el-col>
              </el-row>
            </template>
            <template v-if="activeType == 2">
              <div style="padding-top: 6px">
                <el-date-picker
                  type="dates"
                  v-model="that"
                  value-format="yyyy-MM-dd"
                  placeholder="选择一个或多个日期"
                ></el-date-picker>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              v-model.trim="form.note"
              type="textarea"
              rows="2"
              maxlength="80"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item class="text-align-center">
            <el-button type="primary" @click="handleTrue">确 认</el-button>
            <el-button type @click="dialogVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "app-schedule-leader",
  data() {
    return {
      loading: false,
      proConfig: JSON.parse(localStorage.getItem("pro_config")) || {},
      getForm: {
        date_str: new Date().getTime(), // 时间，如果没有就默认为当前时间
        user: "所有人" // 领导人姓名（默认“所有人”查询所有领导人的日程）
      },
      scheduleData: [],
      current_day: "",
      dialogVisible: false,
      dialogLoading: false,
      form: {
        uid: null,
        type: null, // 1校内会议 2校外会议 3出访 4出差 5其他
        is_type: 2, // 类别 1会议室会议日程 2领导人日程
        user: [],
        nameuser: "", // 主持人
        name: "", // 会议名称
        start_time: null,
        end_time: null,
        that: [], // 多天日程，时间戳集合
        room: "", // 会议地点
        note: "" // 会议备注
      },
      users: [],
      activeType: "1", // '1'：当天、'2'：多天
      that: [], // 多天日程，日期集合['2019-01-01', '2019-01-02]
      is_edit: false,
      id: null,
      delete_loading: false // 删除
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions([
      "getScheduleList",
      "addSchedule",
      "editSchedule",
      "deleteSchedule"
    ]),
    initData() {
      let Params = Object.assign({}, this.getForm, {
        date_str: parseInt(this.getForm.date_str / 1000)
      });
      if (!Params.user) {
        this.$message({
          type: "warning",
          message: "请选择会议领导人！"
        });
        return false;
      }
      this.loading = true;
      if (this.loading) {
        this.getScheduleList({
          data: Params
        }).then(data => {
          if (data.data.code === 200) {
            const Data = data.data.data;
            this.scheduleData = Data;
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
    handleSelect() {
      this.initData();
    },
    handleClick(date, data) {
      this.is_edit = data.is_edit || false;
      this.activeType = "1";
      this.that = [];
      this.current_day = data.day;
      Object.assign(
        this.form,
        this.$options.data().form,
        {
          uid: this.userInfo.uid
        },
        data.is_edit
          ? {
              type: data.val.type,
              name: data.val.name,
              user: data.val.user ? data.val.user.split(",") : [],
              nameuser: data.val.nameuser,
              start_time: this.timestampChange(data.val.start_time, 1),
              end_time: this.timestampChange(data.val.end_time, 1),
              room: data.val.room,
              note: data.val.note
            }
          : {}
      );
      this.dialogLoading = false;
      this.dialogVisible = true;
    },
    handleTrue() {
      let Params = JSON.parse(JSON.stringify(this.form));
      if (!Params.type) {
        this.$message({
          type: "warning",
          message: "请选择活动类型"
        });
        return false;
      }
      if (!Params.name) {
        this.$message({
          type: "warning",
          message: "请输入活动名称"
        });
        return false;
      }
      if (!Params.user.length) {
        this.$message({
          type: "warning",
          message: "人员名单不能为空！"
        });
        return false;
      }
      let start_time = `${this.current_day} 00:00:01`;
      let end_time = `${this.current_day} 00:00:01`;
      if (Params.start_time) {
        start_time = `${this.current_day} ${Params.start_time}`;
      }
      if (Params.end_time) {
        end_time = `${this.current_day} ${Params.end_time}`;
      }
      if (this.activeType === "1") {
        Object.assign(Params, {
          start_time: parseInt(new Date(start_time).getTime() / 1000),
          end_time: parseInt(new Date(end_time).getTime() / 1000)
        });
        delete Params.that;
      } else {
        let list = this.that.map(item => {
          let time = `${item} 00:00:01`;
          return parseInt(new Date(time).getTime() / 1000);
        });
        if (!list.length) {
          this.$message({
            type: "warning",
            message: "请选择一个或多个日期！"
          });
          return false;
        }
        Object.assign(Params, {
          start_time: 0,
          end_time: 0,
          that: list
        });
      }
      this.dialogLoading = true;
      if (this.is_edit) {
        delete Params.uid;
      }
      if (this.dialogLoading) {
        if (this.is_edit) {
          this.editSchedule({
            data: Params,
            id: this.id
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: "操作成功！"
              });
              this.dialogVisible = false;
              this.initData();
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error,
                onClose: () => {
                  this.dialogLoading = false;
                }
              });
            }
          });
        } else {
          this.addSchedule({
            data: Params
          }).then(data => {
            if (data.data.code === 200) {
              this.$message({
                type: "success",
                message: "操作成功！"
              });
              this.dialogVisible = false;
              this.initData();
            } else {
              this.$notify.error({
                title: "错误",
                message: data.data.error,
                onClose: () => {
                  this.dialogLoading = false;
                }
              });
            }
          });
        }
      }
    },
    querySearch(queryString, cb) {
      let restaurants = [];
      for (let key in this.proConfig.schedule_name) {
        restaurants.push({
          value: this.proConfig.schedule_name[key]
        });
      }
      let results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    timeType(timestamp) {
      let date = null;
      if ((timestamp + "").length < 11) {
        date = new Date(timestamp * 1000);
      } else {
        date = new Date(timestamp);
      }
      const H = date.getHours();
      if (H < 12) {
        return "success"; // 上午
      } else if (H < 18) {
        return "warning"; // 下午
      } else if (H < 24) {
        return "info"; // 晚上
      }
    },
    timeStartEnd(timestamp1, timestamp2) {
      // 开始时间等于结束时间都为00:00:01
      let date1 = null;
      let date2 = null;
      if ((timestamp1 + "").length < 11) {
        date1 = new Date(timestamp1 * 1000);
      } else {
        date1 = new Date(timestamp1);
      }
      if ((timestamp2 + "").length < 11) {
        date2 = new Date(timestamp2 * 1000);
      } else {
        date2 = new Date(timestamp2);
      }
      let time1 = `${date1.getHours()}${date1.getMinutes()}${date1.getSeconds()}`;
      let time2 = `${date2.getHours()}${date2.getMinutes()}${date2.getSeconds()}`;
      if (
        (time1 === "0001" && time2 === "001") ||
        (time1 === "000" && time2 === "000") ||
        time1 === time2
      ) {
        // 表示该日程未填写会议起始时间
        return false;
      } else {
        return true;
      }
    },
    handleUpdate(val) {
      // 编辑
      this.id = val.id;
      this.handleClick(null, {
        day: this.timestampChange(val.start_time, 2),
        is_edit: true,
        val: val
      });
    },
    handleDelete(val) {
      if (!this.delete_loading) {
        this.delete_loading = true;
        this.deleteSchedule({
          data: {},
          id: val.id
        }).then(data => {
          if (data.data.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功！"
            });
            this.delete_loading = false;
            this.initData();
          } else {
            this.$notify.error({
              title: "错误",
              message: data.data.error,
              onClose: () => {
                this.delete_loading = false;
              }
            });
          }
        });
      }
    },
    timestampChange(timestamp, type) {
      // 仅当前模块使用
      let date = new Date(timestamp * 1000);
      const Y = date.getFullYear();
      const M = date.getMonth() + 1;
      const D = date.getDate();
      const H = date.getHours();
      const MM = date.getMinutes();
      const S = date.getSeconds();
      if (type === 1) {
        if (H === 0 && MM === 0 && S === 1) {
          return null;
        } else {
          return `${H > 9 ? H : "0" + H}:${MM > 9 ? MM : "0" + MM}:${
            S > 9 ? S : "0" + S
          }`;
        }
      } else {
        return `${Y}-${M > 9 ? M : "0" + M}-${D > 9 ? D : "0" + D}`;
      }
    }
  },
  created() {
    let users = this.proConfig.user_nam;
    if (users) {
      // this.$set(this.getForm, 'user', users['1'] || this.$options.data().getForm.user);
      for (let key in users) {
        this.users.push({
          label: users[key],
          value: users[key]
        });
      }
      this.initData();
    }
  },
  watch: {
    "getForm.date_str"(current, old) {
      let current_y = current.getFullYear();
      let current_m = current.getMonth() + 1;
      let old_y = "";
      let old_m = "";
      if (old > 0) {
        let old2 = new Date(old);
        old_y = old2.getFullYear();
        old_m = old2.getMonth() + 1;
      } else {
        old_y = old.getFullYear();
        old_m = old.getMonth() + 1;
      }
      if (`${current_y}-${current_m}` !== `${old_y}-${old_m}`) {
        this.initData();
      }
    }
  }
};
</script>

<style scoped>
.app-schedule-leader {
  padding: 10px 20px;
  position: relative;
  text-align: left;
}
.app-schedule-index-search {
  position: absolute;
  top: 22px;
  right: 20px;
}
.calendar-content-box {
  position: relative;
  /*height: 68px;*/
  height: 100%;
}
.calendar-content-btn-box {
  position: absolute;
  right: -4px;
  top: -16px;
  text-align: center;
}
.el-icon-circle-plus {
  font-size: 30px;
}
.calendar-content-box-time {
  color: #000;
  font-weight: 600;
  line-height: 20px;
}
</style>
