<template>
  <el-card>
    <my-bread level1="商城管理" level2="商品分类"></my-bread>
    <el-button class="appBtn" type="primary">添加分类</el-button>
    <!-- 商品分类列表 -->
    <el-table :data="cateTable" border style="width: 100%" class="goods">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="cat_name" label="分类名称" width="290"></el-table-column>
      <el-table-column prop="name" label="是否有效" width="290"></el-table-column>
      <el-table-column prop="address" label="排序" width="290"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeById(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[3, 5, 7, 9]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      total: -1,
      pagenum: 1,
      pagesize: 5,
      cateTable: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //分页得方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getCateList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getCateList();
    },
    //获取商品分类列表
    getCateList() {
      this.$http
        .get(`categories`, {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
          },
        })
        .then((res) => {
          const {
            meta: { status, msg },
            data: { result, total },
          } = res.data;
          if (status === 200) {
            // 1. 给表格数据赋值
            this.cateTable = result;
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
.appBtn {
  margin-top: 15px;
}
.goods {
  margin-top: 15px;
}
.page {
  margin-top: 15px;
}
</style>