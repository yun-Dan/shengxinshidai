<template>
  <div class="app-avatar-info" v-loading="params.list && params.list.length ? false : true">
    <el-row :gutter="20">
      <el-col :xs="6" :sm="4" :md="3" :lg="2" :xl="2">
        <div v-if="params.name" class="app-avatar-info-left">
          <el-avatar
            shape="square"
            size="large"
            fit="cover"
            :src="params.avatar || avatar"
            :style="{ width: `${params.avatarSize ? params.avatarSize[0] : avatarSize[0]}px`,
            height: `${params.avatarSize ? params.avatarSize[1] : avatarSize[1]}px` }"
          ></el-avatar>
        </div>
      </el-col>
      <el-col :xs="18" :sm="20" :md="21" :lg="22" :xl="22">
        <div class="app-avatar-info-right">
          <div style="margin-bottom: 20px">
            <span v-if="params.name" class="app-avatar-info-right-name">{{ params.name }}</span>
            <el-tag
              v-if="params.statusText"
              size="mini"
              :type="params.statusType || statusType"
              effect="plain"
            >{{ params.statusText }}</el-tag>
          </div>
          <div>
            <el-row :gutter="10" v-if="params.list">
              <template v-for="(item, index) in params.list">
                <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" :key="index">
                  <el-form label-width="100px" label-position="right">
                    <el-form-item
                      :label="item.label"
                      style="margin-bottom: 20px; word-break: break-all"
                    >{{ item.content }}</el-form-item>
                  </el-form>
                </el-col>
              </template>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import avatar from '@/assets/images/avatar.png'
export default {
  name: 'app-avatar-info',
  data() {
    return {
      avatarSize: [68, 68],
      statusType: 'info',
      avatar
    };
  },
  props: {
    params: {
      type: Object,
      default() {
        return {
          name: '姓名',
          avatar: '',
          avatarSize: [68, 68],
          statusText: '',
          statusType: '', // 
          list: []
        };
      },
      required: true
    }
  }
};
</script>

<style scoped>
.app-avatar-info-left {
  padding-top: 22px;
  text-align: center;
}
.app-avatar-info-right-name {
  display: inline-block;
  min-width: 58px;
  text-align: right;
  font-size: 18px;
  padding-right: 10px;
}
</style>
