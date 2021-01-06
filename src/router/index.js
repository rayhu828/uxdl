import Vue from 'vue'
import VueRouter from 'vue-router'
import { getStorage } from '@/utils/storage.js'
import globalConfig from '@/globalConfig.json'
// router.js中,将Vue.use使用判断条件,生产环境不要使用Vue.use(Router)
// if (process.env.NODE_ENV === 'development') {
Vue.use(VueRouter)
// }
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    meta: '登录',
    component: () => import('@/views/Login')
  },
  {
    path: '/home',
    name: 'Home',
    meta: '首页',
    component: () => import('@/views/layout/Layout'),
    redirect: '/statistical',
    // 首页的所有子路由
    children: [
      // 1.=> 管理中心
      // 1.1 => 分类管理
      {
        path: '/category',
        meta: '分类管理',
        component: () => import('@/views/managementCenter/Category')
      },
      // 1.2 => 标签管理
      {
        path: '/tag',
        meta: '标签管理',
        component: () => import('@/views/managementCenter/tag/Tag')
      },
      // 1.3 => 用户管理
      {
        path: '/user',
        meta: '用户管理',
        component: () => import('@/views/managementCenter/user/User')
      },
      {
        path: '/user/:userId',
        meta: '用户数据',
        component: () => import('@/views/managementCenter/user/User_data')
      },
      // 1.4 => 管理员管理
      {
        path: '/admin',
        meta: '管理员管理',
        component: () => import('@/views/managementCenter/admin/Admin')
      },

      // 2. 素材管理
      // 2.1 => 广告管理
      {
        path: '/advertising',
        meta: '广告管理',
        component: () => import('@/views/material/Advertising')
      },
      // 2.2 => 素材管理
      {
        path: '/material',
        meta: '素材管理',
        component: () => import('@/views/material/Material')
      },

      // 3. => 统计分析
      {
        path: '/statistical',
        meta: '统计分析',
        component: () => import('@/views/StatisticalCenter/Statistical')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 导航首位
router.beforeEach((to, from, next) => {
  document.title = to.meta
  if (to.path === '/login') return next()
  // 判断是否存储用户token
  const token = getStorage(globalConfig.token)
  if (!token) return next('/login')
  next()
})
export default router
