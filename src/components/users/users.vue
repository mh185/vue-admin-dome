<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <!-- 首页 用户管理 用户列表 -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>
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
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-switch
            @change="cheangeMgState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            @click="showEditUserDia(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            @click="showDeleUserMsgBox(scope.row.id)"
          >删除</el-button>
          <el-button
            @click="showSetUserRoleDia(scope.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
          >分配角色</el-button>
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

    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">{{currUsername}}</el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- 如果select的绑定的数据的值 和 option的value一样 就会显示该option的label值 -->
          <el-select v-model="currRoleId">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in roles" :key="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
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
      dialogFormVisibleEdit: false,
      dialogFormVisibleRol: false,
      //添加用户的表单数据
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // currUserId: -1,
      formLabelWidth: "100px",
      //分配角色
      currRoleId: -1,
      currUserId: -1,
      currUsername: "",
      //保存所有的角色数据
      roles: [],
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //分配角色 - 修改发送请求
    async setRole() {
      // :id 要修改得用户id
      // 请求体中 rid 修改的新角色id
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId,
      });
      // console.log(res);
      // 关闭对话框
      this.dialogFormVisibleRol = false;
      this.getUserList();
    },
    //分配角色 - 打开对话框
    async showSetUserRoleDia(user) {
      this.currUsername = user.username;
      //给currUserId赋值
      this.currUserId = user.id;
      //获取所有的角色
      const res1 = await this.$http.get(`roles`);
      // console.log(res1);
      this.roles = res1.data.data;

      //获取当前用户的角色id
      const res = await this.$http.get(`users/${user.id}`);
      // console.log(res);

      //获取用户的角色id->rid
      this.currRoleId = res.data.data.rid;
      this.dialogFormVisibleRol = true;
    },
    //修改状态
    async cheangeMgState(user) {
      //发送请求
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg,
        });
      }
    },
    //编辑用户 - 发送请求
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      // console.log(res);
      // 1. 关闭对话框
      this.dialogFormVisibleEdit = false;
      // 2. 更新视图
      this.getUserList();
    },
    //编辑用户 - 显示对话框
    showEditUserDia(user) {
      // console.log(user);
      //获取用户数据
      this.form = user;

      this.dialogFormVisibleEdit = true;
    },
    //删除用户 - 打开消息盒子(config)
    showDeleUserMsgBox(userId) {
      this.$confirm("删除用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //发送删除请求 :id---->  用户id
          //1. data中找userId  x
          //2. 把userId以showDeleUserMsgBox参数形式传进来
          const res = await this.$http.delete(`users/${userId}`);
          console.log(res);
          if (res.data.meta.status === 200) {
            //删除用户后自动跳转到第一页
            this.pagenum = 1;
            //更新视图
            this.getUserList();
            // 提示
            this.$message({
              type: "success",
              message: res.data.meta.msg,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //添加用户 发送请求
    addUser() {
      // 2.关闭对话框
      this.dialogFormVisibleAdd = false;
      this.$http.post("users", this.form).then((res) => {
        // console.log(res);
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
      // 清空表单数据
      this.form = {};
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

      // console.log("发起请求");
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