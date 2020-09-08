import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Right from '@/components/rights/right.vue'
import Role from '@/components/rights/role.vue'
import Order from '@/components/order/order.vue'
import List from '@/components/goods/list.vue'
import Cate from '@/components/goods/cate.vue'
import Params from '@/components/goods/params.vue'
import Reports from '@/components/report/reports.vue'
import Welcome from '@/components/welcome.vue'
import GoodsAdd from '@/components/goods/goodsAdd.vue'

import {
  Message
} from 'element-ui';

Vue.use(Router)

const router = new Router({
  routes: [{
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      //默认页
      redirect: 'Welcome',
      children: [{
          name: '首页',
          path: 'welcome',
          component: Welcome
        }, {
          name: '用户列表',
          path: 'users',
          component: Users
        },
        {
          name: '权限列表',
          path: 'rights',
          component: Right
        },
        {
          name: '角色列表',
          path: 'roles',
          component: Role
        },
        {
          name: '订单列表',
          path: 'orders',
          component: Order
        },
        {
          name: '商品列表',
          path: 'goods',
          component: List
        },
        {
          name: '添加商品',
          path: 'goodsAdd',
          component: GoodsAdd
        },
        {
          name: '商品分类',
          path: 'categories',
          component: Cate
        },
        {
          name: '分类参数',
          path: 'params',
          component: Params
        },
        {
          name: '数据报表',
          path: 'reports',
          component: Reports
        }
      ]
    }
  ]
})
//在路由配置生效之前 统一判断token
//路由守卫 在路由配置生效之前
//路由/导航 守卫
//to -> 要去的路由配置
//from -> 当前的路由配置
router.beforeEach((to, from, next) => {
  // to  from  next
  // console.log(to);
  // 如果要去的是登录 -> next()
  if (to.path === '/login') {
    next()
  } else {
    // 如果要去的不是登录
    // 判断token
    const token = localStorage.getItem("token");
    if (!token) {
      // 如果没有token -> 登录
      // this.router.push({path: 'login'})
      // 提示
      Message.warning('请重新登录')
      router.push({
        path: 'login'
      })
      return
    }
    // 如果有 -> next()
    next()
  }


})

export default router
