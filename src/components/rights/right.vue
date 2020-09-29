<template>
  <el-card>
    <!-- 1面包屑 -->
    <!-- 2封装的组件 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 2表格 -->
    <el-table :data="rightlist" border class="rightTable" height="550">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <!-- scope.row.level 0 1 2 -->
          <span v-if="scope.row.level==='0'">
            <el-tag type>一级</el-tag>
          </span>
          <span v-if="scope.row.level==='1'">
            <el-tag type="success">二级</el-tag>
          </span>
          <span v-if="scope.row.level==='2'">
            <el-tag type="danger">三级</el-tag>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightlist: [],
    };
  },
  created() {
    this.getRightlist();
  },
  methods: {
    async getRightlist() {
      const res = await this.$http.get(`rights/list`);
      //   console.log(res);
      this.rightlist = res.data.data;
    },
  },
};
</script>

<style>
.rightTable {
  margin-top: 15px;
}
</style>