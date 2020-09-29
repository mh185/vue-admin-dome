<template>
  <el-card>
    <!-- 1面包屑 -->
    <!-- 2封装的组件 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row class="addrolebtn">
      <el-col>
        <el-button @click="showAddUserDia()" type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table class="rolelist" :data="rolelist" style="width: 100%" border>
      <!-- 展开列 -->
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <!-- 一级权限 -->
          <el-row
            :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            v-for="(item1,i1) in scope.row.children"
            :key="i1"
          >
            <el-col :span="4">
              <!-- 传角色id 和 权限id -->
              <el-tag @close="deleRight(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row
                :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                v-for="(item2,i2) in item1.children"
                :key="i2"
              >
                <el-col :span="4">
                  <el-tag
                    @close="deleRight(scope.row,item2.id)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag
                    @close="deleRight(scope.row,item3.id)"
                    type="info"
                    closable
                    v-for="(item3,i) in item2.children"
                    :key="i"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 无权限提示 -->
          <span v-if="scope.row.children.length===0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="350"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="350"></el-table-column>
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
            @click="showSetRightDia(scope.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button @click="userAdd" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeeditUser()">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改权限对话框 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
      <!-- 树形结构 
      data->数据源[]
      show-checkbox -> 选择框
      node-key -> 每个节点唯一标识
      default-expanded-keys -> 默认展开[要展开的节点的id]  default-expand-all展开所有项
      default-checked-keys -> 要选择的节点的id
      props -> 配置项{label,children}
      -->
      <el-tree
        ref="tree"
        :data="treelist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrcheck"
        :props="defaultProps"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {
        roleName: "",
        roleDesc: "",
      },
      // 权限列表
      rolelist: [],
      //树结构权限列表
      treelist: [],
      //树结构的数据
      defaultProps: {
        label: "authName",
        children: "children",
      },
      //数组存放所有id
      // arrexpand: [],
      arrcheck: [],
      currRoleId: -1,
      formLabelWidth: "100px",
      // 添加用户对话框
      dialogFormVisibleAdd: false,
      // 编辑用户对话框
      dialogFormVisibleEdit: false,
      //分配权限对话框
      dialogFormVisibleRight: false,
    };
  },
  created() {
    this.getRolelist();
  },
  methods: {
    //修改权限 - 发送请求
    async setRoleRight() {
      // roles/:roleId/rights
      // roleId当前要修改权限的角色id
      // rids树形节点中 所有全选和半选的lable的id[]
      // 获取全选的id的数组arr1 getCheckedKeys()
      let arr1 = this.$refs.tree.getCheckedKeys();
      // 获取半选id的数组arr2 getHalfCheckedKeys()
      let arr2 = this.$refs.tree.getHalfCheckedKeys();
      // arr = arr1 + arr2
      // arr1.concat(arr2)
      // ES6 展开运算符 ...数组或者对象
      let arr = [...arr1, ...arr2];
      // console.log(arr1);
      // console.log(arr2);
      // console.log(arr);
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(","),
      });
      // console.log(res);
      // 更新视图
      this.getRolelist();
      // 关闭对话框
      this.dialogFormVisibleRight = false;
    },
    //分配权限 - 打开对话框
    async showSetRightDia(role) {
      // console.log(role);
      // 给currRoleId赋值
      this.currRoleId = role.id;
      //获取树形结构的权限数据
      const res = await this.$http.get(`rights/tree`);
      // console.log(res);
      this.treelist = res.data.data;
      //获取所有得id
      // var arrtemp1 = [];
      // this.treelist.forEach((item1) => {
      //   arrtemp1.push(item1.id);
      //   item1.children.forEach((item2) => {
      //     arrtemp1.push(item2.id);
      //     item2.children.forEach((item3) => {
      //       arrtemp1.push(item3.id);
      //     });
      //   });
      // });
      // console.log(arrtemp1);
      // this.arrexpand = arrtemp1;

      // 获取当前角色role的权限id
      let arrtemp2 = [];
      role.children.forEach((item1) => {
        // arrtemp2.push(item1.id);
        item1.children.forEach((item2) => {
          // arrtemp2.push(item2.id);
          item2.children.forEach((item3) => {
            arrtemp2.push(item3.id);
          });
        });
      });
      // console.log(arrtemp2);
      this.arrcheck = arrtemp2;
      this.dialogFormVisibleRight = true;
    },
    //取消权限
    async deleRight(role, rightId) {
      // roles/:roleId/rights/:rightId
      //roleId 当前角色ID
      //rightId 要删除权限id
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      // console.log(res);
      //删除成功 返回了200和改角色的剩余权限
      role.children = res.data.data;
    },
    //编辑角色 - 发送请求
    async editUser() {
      const res = await this.$http.put(`roles/${this.form.id}`, this.form);
      // 1. 关闭对话框
      this.dialogFormVisibleEdit = false;
      // 2. 更新视图
      this.getRolelist();
      this.form = {};
    },
    //编辑用户 - 关闭对话框
    closeeditUser() {
      this.dialogFormVisibleEdit = false;
      this.form = {};
    },
    //编辑角色 - 打开对话框
    showEditUserDia(role) {
      //获取用户数据
      this.form = role;
      this.dialogFormVisibleEdit = true;
    },
    //删除用户 - 打开消息盒子(config)
    showDeleUserMsgBox(roleId) {
      this.$confirm("删除用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //发送删除请求 :id---->  用户id
          //1. data中找roleId  x
          //2. 把roleId以showDeleUserMsgBox参数形式传进来
          const res = await this.$http.delete(`roles/${roleId}`);
          // console.log(res);
          if (res.data.meta.status === 200) {
            //删除用户后自动跳转到第一页
            this.pagenum = 1;
            //更新视图
            this.getRolelist();
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
    //添加角色 - 发送请求
    userAdd() {
      //关闭文本框
      this.dialogFormVisibleAdd = false;
      this.$http.post("roles", this.form).then((res) => {
        // console.log(res);
        const {
          meta: { status, msg },
          data,
        } = res.data;
        if (status === 201) {
          // 1.提示成功
          this.$message.success(msg);
          // 3.刷新视图
          this.getRolelist();
          // 4.清空文本框
          this.form = {};
        } else {
          this.$message.error(msg);
        }
      });
      this.form = {};
    },
    //添加角色 - 显示对话框
    showAddUserDia() {
      this.dialogFormVisibleAdd = true;
    },
    async getRolelist() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.rolelist = res.data.data;
    },
  },
};
</script>

<style>
.addrolebtn {
  margin-top: 20px;
}
.rolelist {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>