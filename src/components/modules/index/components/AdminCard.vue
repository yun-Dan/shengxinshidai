<template>
  <div class="admin-card box">
    <el-card shadow="hover">
      <div class="user-info" :style="{textAlign: isYXB ? 'center' : '', marginBottom: isYXB ? '0' : '20px', borderColor: isYXB ? '#fff' : ''}">
        <template v-if="isYXB">
          <div class="user-info-cont" :style="{ paddingLeft: isYXB ? '0' : ''}">
            <img v-if="userInfo.image" :src="userInfo.image" class="user-avator-yxb">
            <img src="../../../../assets/images/user.jpg" class="user-avator-yxb" v-else>
            <div class="user-info-name" :style="{paddingTop: isYXB ? '8px' : ''}">
              {{ userInfo.role===1 ? '管理员' : '工作人员' }}
              <el-divider v-if="userInfo.college" direction="vertical"></el-divider>
              {{ userInfo.college }}
            </div>
            <div style="height: 38px; line-height: 36px">
              <el-row :gutter="20">
                <el-col :span="12" style="font-size: 14px; color: #777">
                  {{ userInfo.realname ? userInfo.realname : userInfo.name }}
                </el-col>
                <el-col :span="12">
                  <el-button v-if="userInfo.role===2" type="text" icon="el-icon-edit" @click="visible = true">个人信息</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </template>
        <template v-else>
          <img v-if="userInfo.image" :src="userInfo.image" class="user-avator" alt>
          <img src="../../../../assets/images/user.jpg" class="user-avator" alt v-else>
          <div class="user-info-cont">
            <div class="user-info-name">{{ userInfo.role===1?'管理员':'工作人员'}}</div>
            <div style="height: 38px">
              <span>{{ userInfo.realname ? userInfo.realname : userInfo.name }} </span>
              <el-button v-if="userInfo.role===2" type="text" icon="el-icon-edit" @click="visible = true">个人信息</el-button>
            </div>
          </div>
        </template>
      </div>
      <div v-if="!isYXB" class="user-info-list clearfix">
        <span class="fl">上次登录时间：</span>
        <span class="fr">{{ userInfo.lastTime | TimestampChangeFilter(true) }}</span>
      </div>
    </el-card>
    <AppUserEdit :visible="visible" @change="handleChange"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppUserEdit from '@/components/compose/AppUserEdit.vue'

export default {
  name: "admin-card",
  data() {
    return {
      visible: false,
      
      isYXB: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  components: {
    AppUserEdit
  },
  methods: {
    handleChange () {
      this.visible = !this.visible
    }
  },
  created () {
    this.isYXB = this.isYXBPublic()
  }
}
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 19px;
  border-bottom: 1px solid #EBEEF5;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.user-avator-yxb{
  width: 92px;
  height: 92px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 30px;
  flex: 1;
  font-size: 14px;
  color: #777;
}

.user-info-cont div:first-child {
  font-size: 20px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #777;
  line-height: 20px;
}

.user-info-name {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
