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
          <el-submenu :index="''+item1.order" v-for="(item1,index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>{{item1.authName}}</span>
            </template>

            <el-menu-item-group>
              <el-menu-item
                :index="item2.path"
                v-for="(item2,index) in item1.children"
                :key="index"
              >
                <i class="el-icon-location"></i>
                <span>{{item2.authName}}</span>
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
  data() {
    return {
      menus: [],
    };
  },
  //newVue之前自动触发
  beforeCreate() {
    //获取token
    // const token = localStorage.getItem("token");
    // if (!token) {
    // token 没有 - 登录
    //   this.$router.push({ name: "login" });
    // }
    //if token 有 -> 继续渲染组件
  },
  created() {
    this.getMenus();
  },
  methods: {
    // 获取导航数据
    async getMenus() {
      const res = await this.$http.get(`menus`);
      // console.log(res);
      this.menus = res.data.data;
    },
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