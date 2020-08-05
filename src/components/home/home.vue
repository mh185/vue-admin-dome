<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="22" class="middle">
          <div class="grid-content bg-purple-light">
            <h3>电商后台管理系统</h3>
          </div>
        </el-col>
        <el-col :span="2" class="loginout">
          <div class="grid-content bg-purple">
            <button class="btn">退出</button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 侧边栏导航 -->
        <el-menu unique-opened="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-location"></i>
                <span>用户列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">
                <i class="el-icon-location"></i>
                <span>角色列表</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="2-2">
                <i class="el-icon-location"></i>
                <span>权限列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商城管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="3-2">
                <i class="el-icon-location"></i>
                <span>分类参数</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="3-3">
                <i class="el-icon-location"></i>
                <span>商品分类</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">
                <i class="el-icon-location"></i>
                <span>订单列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">
                <i class="el-icon-location"></i>
                <span>数据报表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {};
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #373f41;
}
.aside {
  background-color: #d3dce6;
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
  width: 60px;
  height: 40px;
  background-color: #909399;
}
</style>