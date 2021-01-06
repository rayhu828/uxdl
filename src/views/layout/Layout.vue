<template>
    <el-container>
        <el-header height="56px">
            <div class="left">
                <img src="@/assets/images/logo.png" class="logo" alt="logo">
            </div>
            <div class="right">
                <div class="user" v-if="LoginInfo">{{ LoginInfo.username }}</div>
                <div class="logout" @click="logout">退出</div>
            </div>
        </el-header>
        <el-container>
            <el-aside width="190px">
                <!-- 测导航 -->
                <el-menu
                    :default-active="avtivePath"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#202038"
                    text-color="#666"
                    active-text-color="#fff"
                    unique-opened
                    router
                    @select="select"
                >
                    <el-submenu index="management">
                        <div slot="title" :class="active === 'management' ? 'active' : ''">
                            <i class="slid_icon">
                                <img src="@/assets/images/1.png" alt="" class="icon">
                                <img src="@/assets/images/1active.png" alt="" class="active_icon">

                            </i>
                            <span>管理中心</span>
                        </div>
                        <el-menu-item index="/category">分类管理</el-menu-item>
                        <el-menu-item index="/tag">标签管理</el-menu-item>
                        <el-menu-item index="/user">用户管理</el-menu-item>
                        <el-menu-item index="/admin">管理员管理</el-menu-item>
                    </el-submenu>
                    <el-submenu index="material">
                        <div slot="title" :class="active === 'material' ? 'active' : ''">
                            <i class="slid_icon">
                                <img src="@/assets/images/2.png" alt="" class="icon">
                                <img src="@/assets/images/2active.png" alt="" class="active_icon">
                            </i>
                            <span>素材管理</span>
                        </div>
                        <el-menu-item index="/advertising">广告管理</el-menu-item>
                        <el-menu-item index="/material">素材管理</el-menu-item>
                    </el-submenu>
                    <el-submenu index="statistical">
                        <div slot="title" :class="active === 'statistical' ? 'active' : ''">
                            <i class="slid_icon">
                                <img src="@/assets/images/3.png" alt="" class="icon">
                                <img src="@/assets/images/3active.png" alt="" class="active_icon">

                            </i>
                            <span>统计分析</span>
                        </div>
                        <el-menu-item index="/statistical">统计分析</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import { removeStorage, setStorage, getStorage } from '@/utils/storage.js'
import { mapMutations } from 'vuex'
import { getLoginUser } from '@/api/request/user'
import globalConfig from '@/globalConfig.json'

export default {
  name: 'Layout',
  data () {
    return {
      active: getStorage(globalConfig.active) || 'statistical', // 一级导航激活状态
      avtivePath: getStorage(globalConfig.slideNavState) || '/statistical', // 二级导航激活状态
      LoginInfo: null // 登录人信息
    }
  },
  /**
     * 注册组件
     */
  components: {},
  /**
     * 实例创建完成
     */
  created () {
    this.initLoginUser()
  },
  /**
     * 实例挂载完成，请求数据，操作Dom时常用
     */
  mounted () {
  },
  computed: {},
  methods: {
    ...mapMutations(['setToken']),
    // switchClass () {
    //   const aslidAllUl = document.querySelectorAll('.el-aside el-submenu')
    //   console.log(aslidAllUl)
    // },
    handleOpen (key) {
      switch (key) {
        case 'material':
          this.active = key
          setStorage(globalConfig.active, key)
          break
        case 'management':
          this.active = key
          setStorage(globalConfig.active, key)
          break
        case 'statistical':
          this.active = key
          setStorage(globalConfig.active, key)
          break
        default:
          break
      }
    },
    handleClose () {
      this.active = ''
      this.avtivePath = ''
      setStorage(globalConfig.active, '')
      setStorage(globalConfig.slideNavState, '')
    },
    // 退出功能
    async logout () {
      const res = await this.$confirm('您确定退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(err => err)
      if (res === 'confirm') {
        removeStorage()
        this.setToken('')
        this.$router.push('/login')
        this.$message.closeAll()
        this.$message.success('退出成功')
      } else {
        return false
      }
    },
    select (index) {
      this.avtivePath = index
      setStorage(globalConfig.slideNavState, index)
    },
    async initLoginUser () {
      const { data: res } = await getLoginUser()
      if (res.code !== 0) return this.$message.error('获取登陆人信息失败')
      this.LoginInfo = res.data
    }
  }
}
</script>

<style lang="less" scoped>
@themeColor: #202038;

.el-container {
    height: 100%;
}

.el-aside,
.el-header {
    background: @themeColor;
}

.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #cccccc;
    font-size: 13px;

    .logo {
        margin-left: 50px;
    }

    .right {
        height: 100%;
        position: relative;
        display: flex;
        width: 110px;
        justify-content: space-between;
        align-items: center;

        &::before {
            content: "";
            width: 1px;
            height: 14px;
            background: #ccc;
            position: absolute;
            top: 50%;
            left: 64%;
            transform: translate(-50%, -50%);
        }

        .logout {
            line-height: 56px;
            cursor: pointer;
        }
    }
}

.el-aside {
    height: 100%;

    .el-menu {
        border-right: 0;
    }

    /deep/ .el-submenu__title {
        height: 34px;
        width: 160px;
        padding: 0 !important;
        //margin-left: 15px !important;
        margin-left: 20px;
        line-height: 34px;
        text-align: center;
        position: relative;
        i.slid_icon {
            position: absolute;
            left: 20px;
            img.active_icon{
                display: none;
            }
        }
        .active {
            height: 34px;
            background: #663ee7;
            border-radius: 3px;
            color: #fff;
            img.icon{
                display: none;
            }
            img.active_icon{
                display: inline-block !important;
            }
        }
        .el-icon-location {
            position: absolute;
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
        }
    }

    .el-submenu {
        padding: 10px 0;

        .el-menu-item {
            min-width: 190px;
            padding: 0 !important;
            text-align: center;
        }
    }
}

.el-main {
    padding-left: 50px;
    padding-right: 50px;
}
</style>
