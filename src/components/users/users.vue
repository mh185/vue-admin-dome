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
        <el-input
          @clear="loadUserList()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="inputSerch"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <el-button @click="showAddUserDia()" type="primary" class="searchBtn">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table class="table" :data="userlist" style="width: 100%" border>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template>
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 对话框 -->
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      total: -1,
      pagenum: 1,
      pagesize: 4,
      //表格绑定的数据
      userlist: [],
      //添加对话框的属性
      dialogFormVisibleAdd: false,
      //添加用户的表单数据
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      formLabelWidth: "100px",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //添加用户 发送请求
    addUser() {
      // 2.关闭对话框
      this.dialogFormVisibleAdd = false;
      this.$http.post("users", this.form).then((res) => {
        console.log(res);
        const {
          meta: { status, msg },
          data,
        } = res.data;
        if (status === 201) {
          // 1.提示成功
          this.$message.success(msg);
          // 3.刷新视图
          this.getUserList();
          // 4.清空文本框
          this.form = {};
        } else {
          this.$message.error(msg);
        }
      });
    },
    //添加用户 显示对话框
    showAddUserDia() {
      this.dialogFormVisibleAdd = true;
    },
    //清空搜索框 重新获取数据
    loadUserList() {
      this.getUserList();
    },
    //搜索用户
    searchUser() {
      //按照input绑定的query参数 发请求
      this.getUserList();
    },
    //分页得方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUserList();
    },
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
          // console.log(res);
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
            // this.$message.success(msg);
          } else {
            //提示
            // this.$message.success(msg);
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
.page {
  margin-top: 10px;
}
</style>