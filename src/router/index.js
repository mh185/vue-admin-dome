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


Vue.use(Router)

export default new Router({
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
          path: 'role',
          component: Role
        },
        {
          name: '订单列表',
          path: 'order',
          component: Order
        },
        {
          name: '商品管理',
          path: 'list',
          component: List
        },
        {
          name: '商品分类',
          path: 'cate',
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
