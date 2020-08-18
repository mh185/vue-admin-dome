<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="23" class="middle">
          <img class="img" src="./logo2.png" />
          <div class="grid-content bg-purple-light">
            <h3>哈哈哈后台管理系统</h3>
          </div>
        </el-col>
        <el-col :span="1" class="loginout">
          <div class="grid-content bg-purple">
            <input type="button" class="btn" @click.prevent="handleSignout()" value="退出" />
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 侧边栏导航 -->
        <!-- 开启路由模式为true -->
        <el-menu
          :unique-opened="true"
          :router="true"
          default-active="2"
          class="el-menu-vertical-demo"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="users">
                <i class="el-icon-location"></i>
                <span>用户列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="role">
                <i class="el-icon-location"></i>
                <span>角色列表</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="rights">
                <i class="el-icon-location"></i>
                <span>权限列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-cooperation"></i>
              <span>商城管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="list">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="params">
                <i class="el-icon-location"></i>
                <span>分类参数</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="cate">
                <i class="el-icon-location"></i>
                <span>商品分类</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="order">
                <i class="el-icon-location"></i>
                <span>订单列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-platform"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="reports">
                <i class="el-icon-location"></i>
                <span>数据报表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <!-- 容器 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  //newVue之前自动触发
  beforeCreate() {
    //获取token
    const token = localStorage.getItem("token");
    if (!token) {
      //token 没有 - 登录
      this.$router.push({ name: "login" });
    }
    //if token 有 -> 继续渲染组件
  },
  methods: {
    handleSignout() {
      // 1.清除token
      localStorage.clear();
      // 2.提示
      this.$message.success("退出成功");
      // 3.来到login组件
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
}
.header {
  background-color: #373f41;
}
.aside {
  background-color: #373f41;
}
.main {
  background-color: #e9eef3;
}
.middle {
  text-align: center;
}
.middle h3 {
  color: #fff;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
.loginout .btn {
  width: 70px;
  height: 40px;
  background-color: #909399;
  border: 1px solid black;
  border-radius: 5px;
  color: #fff;
  font-size: 15px;
}
.loginout .btn:hover {
  background-color: #dcdfe6;
}
.img {
  width: 50px;
  height: 50px;
  float: left;
  margin-top: 5px;
  margin-left: 30px;
}
</style>