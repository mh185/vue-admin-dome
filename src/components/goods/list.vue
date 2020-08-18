<template>
  <el-card>
    <my-bread level1="商城管理" level2="商品管理"></my-bread>
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
    <!-- 表格数据 -->
    <el-table :data="goodsList" border stripe class="tablestyle">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
      <el-table-column label="商品数量" prop="goods_number" width="70px"></el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="140px"></el-table-column>
      <el-table-column label="操作" width="130px">
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
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 4,
      //商品列表
      goodsList: [],
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
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
          console.log(res);
          this.goodsList = res.data.data.goods;
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