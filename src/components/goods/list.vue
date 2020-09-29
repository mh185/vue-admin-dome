<template>
  <el-card>
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
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
        <el-button @click="$router.push({path:'goodsadd'})" type="primary" class="searchBtn">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table :data="goodsList" border stripe class="tablestyle" height="400">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
      <el-table-column label="商品数量" prop="goods_number" width="70px"></el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="140px">{{add_time|dateFormat}}</el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeById(scope.row.goods_id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 40, 60]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 查询
      query: "",
      pagenum: 1,
      pagesize: 10,
      total: -1,
      //日期
      add_time: "",
      //商品列表
      goodsList: [],
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
    //删除商品 - 发送请求
    removeById(listId) {
      this.$confirm("删除用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //发送删除请求 :id---->  用户id
          const res = await this.$http.delete(`goods/${listId}`);
          // console.log(res);
          if (res.data.meta.status === 200) {
            //删除用户后自动跳转到第一页
            this.pagenum = 1;
            //更新视图
            this.getGoodList();
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
    //分页得方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getGoodList();
    },
    //清空搜索框 重新获取数据
    loadUserList() {
      this.getGoodList();
    },
    //搜索商品
    searchUser() {
      this.getGoodList();
    },
    //获取商品列表
    getGoodList() {
      this.$http
        .get(`goods`, {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize,
          },
        })
        .then((res) => {
          // console.log(res);
          this.goodsList = res.data.data.goods;
          this.total = res.data.data.total;
          this.add_time = res.data.data.goods.add_time;
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
.tablestyle {
  margin-top: 20px;
  font-size: 12px;
}
.page {
  margin-top: 10px;
}
</style>