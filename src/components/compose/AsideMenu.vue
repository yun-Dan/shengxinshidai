<template>
  <div
    class="aside-menu"
    :style="{ backgroundColor: userInfo.role === 1 ? ckTitle[ck] ? ckTitle[ck].menu_bg : '#2e363f' : '#2e363f' }"
  >
    <template v-if="!isCollapse">
      <el-menu
        :default-active="active"
        :unique-opened="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        :hide-timeout="0"
        class="el-menu-vertical-demo hidden-md-and-down"
        :background-color="userInfo.role === 1 ? ckTitle[ck] ? ckTitle[ck].menu_bg : '#2e363f' : '#2e363f'"
        :text-color="userInfo.role === 1 ? ckTitle[ck] ? ckTitle[ck].text_color : '#939da8' : '#939da8'"
        active-text-color="#fff"
      >
        <template v-for="(item,index) in menuList">
          <template v-if="isShow(item)">
            <el-submenu v-if="item.subMenu" :index="`${index+1}`" :key="`${index+1}`">
              <template slot="title">
                <i class="fa" :class="item.icon"></i>&nbsp;&nbsp;
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item-group>
                <template v-for="(val,ind) in item.subMenu">
                  <el-menu-item
                    v-if="isShow(val)"
                    :key="ind"
                    :index="`${index+1}-${ind+1}`"
                    @click.native.stop="menuClick(val,`${index+1}-${ind+1}`)"
                  >
                    <i class="fa fa-dot-circle-o"></i> &nbsp;
                    <el-badge
                      v-if="val.tip2 && (userInfo.chuID_1 || userInfo.chuID_2) && documentNews"
                      :value="documentNews[val.tip2]"
                      :hidden="documentNews[val.tip2] == 0"
                      :max="99"
                      class="item"
                    >{{ val.title }}</el-badge>
                    <span v-else>{{ val.title }}</span>
                  </el-menu-item>
                </template>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item
              v-else
              @click.native="menuClick(item,`${index+1}`)"
              :index="`${index+1}`"
              :key="`${index+1}`"
            >
              <i class="fa" :class="item.icon"></i>&nbsp;&nbsp;
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
      <el-menu
        :default-active="active"
        :unique-opened="true"
        :collapse="!isCollapse"
        :collapse-transition="false"
        :hide-timeout="0"
        class="el-menu-vertical-demo hidden-lg-and-up"
        :background-color="userInfo.role === 1 ? ckTitle[ck] ? ckTitle[ck].menu_bg : '#2e363f' : '#2e363f'"
        :text-color="userInfo.role === 1 ? ckTitle[ck] ? ckTitle[ck].text_color : '#939da8' : '#939da8'"
        active-text-color="#fff"
      >
        <template v-for="(item,index) in menuList">
          <template
            v-if="isShow(item)"
          >
            <el-submenu v-if="item.subMenu" :index="`${index+1}`" :key="`${index+1}`">
              <template slot="title">
                <i class="fa" :class="item.icon"></i>&nbsp;&nbsp;
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="(val,ind) in item.subMenu"
                  :key="ind"
                  :index="`${index+1}-${ind+1}`"
                  @click.native.stop="menuClick(val,`${index+1}-${ind+1}`)"
                >
                  <i class="fa fa-dot-circle-o"></i> &nbsp;
                  <el-badge
                    v-if="val.tip2 &&  (userInfo.chuID_1 || userInfo.chuID_2)  && documentNews"
                    :value="documentNews[val.tip2]"
                    :hidden="documentNews[val.tip2] == 0"
                    :max="99"
                    class="item"
                  >{{ val.title }}</el-badge>
                  <span v-else>{{ val.title }}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else @click.native="menuClick(item,`${index+1}`)" :index="`${index+1}`" :key="`${index+1}`">
              <i class="fa" :class="item.icon"></i>&nbsp;&nbsp;
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </template>
    <template v-if="isCollapse">
      <el-menu
        :default-active="active"
        :unique-opened="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        :hide-timeout="0"
        class="el-menu-vertical-demo"
        :background-color="userInfo.role === 1 ? ckTitle[ck] ? ckTitle[ck].menu_bg : '#2e363f' : '#2e363f'"
        :text-color="userInfo.role === 1 ? ckTitle[ck] ? ckTitle[ck].text_color : '#939da8' : '#939da8'"
        active-text-color="#fff"
      >
        <template v-for="(item,index) in menuList">
          <template
            v-if="isShow(item)"
          >
            <el-submenu v-if="item.subMenu" :index="`${index+1}`" :key="`${index+1}`">
              <template slot="title">
                <i class="fa" :class="item.icon"></i>&nbsp;&nbsp;
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="(val,ind) in item.subMenu"
                  :key="ind"
                  :index="`${index+1}-${ind+1}`"
                  @click.native.stop="menuClick(val,`${index+1}-${ind+1}`)"
                >
                  <i class="fa fa-dot-circle-o"></i> &nbsp;
                  <el-badge
                    v-if="val.tip2 &&  (userInfo.chuID_1 || userInfo.chuID_2) && documentNews"
                    :value="documentNews[val.tip2]"
                    :hidden="documentNews[val.tip2] == 0"
                    :max="99"
                    class="item"
                  >{{ val.title }}</el-badge>
                  <span v-else>{{ val.title }}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item
              v-else
              @click.native="menuClick(item,`${index+1}`)"
              :index="`${index+1}`"
              :key="`${index+1}`"
            >
              <i class="fa" :class="item.icon"></i>&nbsp;&nbsp;
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import  ckTitle from '@/assets/js/ckTitle.js'
import { clearHome } from '@/assets/js/clear.home.js'
import  { menuList } from '@/assets/js/menuList.js'

export default {
  name: 'aside-menu',
  data() {
    return {
      active: '1',
      ck: 1,
      ckTitle,
      menuList,
      is_yxb: false,
      yxb_auth_side: []
    }
  },
  computed: {
    ...mapState([
      'isCollapse',
      'showCollapse',
      'documentNews',
      'userInfo'
    ])
  },
  methods: {
    ...mapMutations(['editShowCollapse', 'editCrumbs']),
    init () {
      let ck_activeMenu = ''
      if (this.userInfo.role === 1) {
        let ck = sessionStorage.getItem('CK');
        if (ck) {
          if (`${ck}` === '2') {
            this.is_yxb = true
          }
          this.ck = ck
        }
        ck_activeMenu = sessionStorage.getItem('CK-activeMenu') || ''
      } else {
        let ck = sessionStorage.getItem('CK-T')
        if (`${ck}` === '2') {
          this.is_yxb = true
          let list = sessionStorage.getItem('yxb_auth_side')
          if (list) {
            this.yxb_auth_side =  JSON.parse(list)
          }
        }
        ck_activeMenu = sessionStorage.getItem('CK-T-activeMenu') || ''
      }

      this.active = ck_activeMenu|| '1'
      if (this.$cookie.get('crumbs')) {
        this.editCrumbs(this.$cookie.get('crumbs').split(','))
      } else {
        this.editCrumbs([''])
      }
      if (ck_activeMenu) {
        let index_ = ck_activeMenu.indexOf('-')
        if (index_ !== -1) {
          this.editCrumbs([
            this.menuList[ck_activeMenu.slice(0, index_) - 1].title,
            this.menuList[ck_activeMenu.slice(0, index_) - 1].subMenu[
              ck_activeMenu[index_ + 1] - 1
            ].title
          ])
        } else {
          this.editCrumbs([this.menuList[ck_activeMenu - 1].title])
        }
      }
    },
    menuClick(data, active) {
      sessionStorage.removeItem("PRO_IS_PXLX");
      this.editShowCollapse(1)
      this.$router.push(`${data.path}${this.is_yxb && data.yxb && data.yxb.wrap ? '/wrap' : ''}`)
      if (this.userInfo.role === 1) {
        sessionStorage.setItem('CK-activeMenu', active)
      } else {
        sessionStorage.setItem('CK-T-activeMenu', active)
      }
      if (!isNaN(active)) {
        if (active === '1') {
          this.$cookie.set('crumbs', [''])
          this.editCrumbs([''])
        } else {
          if (!sessionStorage.getItem('PRO_IS_SS')) {
            this.$cookie.set('crumbs', [data.title])
            this.editCrumbs([data.title])
          }
        }
      } else {
        this.$cookie.set('crumbs', [
          this.menuList[active.slice(0, active.indexOf('-')) - 1].title,
          data.title
        ])
        this.editCrumbs([
          this.menuList[active.slice(0, active.indexOf('-')) - 1].title,
          data.title
        ])
      }
    },
    isShow (Current) {
      const Role = this.userInfo.role
      const List = this.is_yxb ? this.yxb_auth_side : this.userInfo.auth_side
      if (this.userInfo.is_yjsy && Role === 1) {
        return Current.is_yjsy
      } else {
        if (this.is_yxb && Current.yxb || !this.is_yxb) {
          if (Role === 1 && Current.auth !== 2 && (this.ck === '2' ? Current.yxb && Current.yxb.role_no !== 1 : this.ck == Current.center_key)
          || Role === 2 && (this.vifAOrBPublic(Current.path, List) || this.vifAOrBPublic(Current.subMenu, List, 2))) {
            return true
          }
        }
      }
    }
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    clearHome({
      $cookie: this.$cookie
    })
  },
  watch: {
    $route(to) {
      const Route = this.$route
      let Act = ''
      this.menuList.forEach((item, index) => {
        if (Route.path.indexOf(item.path) !== -1) {
          if (item.subMenu) {
            item.subMenu.forEach((val, ind) => {
              if (Route.path.indexOf(val.path) !== -1) {
                Act = `${index + 1}-${ind + 1}`
              }
            })
          } else {
            Act = `${index + 1}`
          }
        }
      })
      if (to.query.wcoutindex) {
        this.active = Act
      }
    }
  }
}
</script>

<style scoped>
.aside-menu {
  height: 100%;
  margin-right: -24px;
  overflow-y: scroll;
  font-size: 22px;
}
.aside-menu i.fa {
  color: inherit;
  font-size: 1.2em;
}
</style>
