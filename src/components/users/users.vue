<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <!-- 首页 用户管理 用户列表 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="inputSerch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" class="searchBtn">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table class="table" :data="userlist" style="width: 100%" border>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
      <el-table-column prop="mg_state" label="状态" width="180"></el-table-column>
      <el-table-column prop="address" label="操作"></el-table-column>
    </el-table>
    <!-- 分页 -->
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 5,
      //表格绑定的数据
      userlist: [],
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户列表得请求
    getUserList() {
      // query 查询参数  可以为空
      // pagenum 当前页码  不能为空
      // pagesize 每页显示条数  不能为空

      //需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      this.$http
        .get("/users", {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize,
          },
        })
        .then((res) => {
          console.log(res);
          // this.userlist = res.data.data.users;
          // console.log(this.userlist);
          const {
            meta: { status, msg },
            data: { users, total },
          } = res.data;
          if (status === 200) {
            // 1. 给表格数据赋值
            this.userlist = users;
            // 2. 给total赋值
            this.total = total;
            // 3. 提示
            this.$message.success(msg);
          } else {
            //提示
            this.$message.success(msg);
          }
        });
    },
  },
};
</script>

<style>
.box-card {
  height: 100%;
}
.inputSerch {
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
.searchBtn {
  margin-left: 15px;
}
.table {
  margin-top: 20px;
}
</style>