<template>
  <el-card>
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
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
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table class="table" :data="orderlist" style="width: 100%" border>
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="200"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="180"></el-table-column>
      <el-table-column label="是否付款" width="180">
        <template slot-scope="scope">
          <el-tag type="danger" size="mini" v-if="scope.row.pay_status">未付款</el-tag>
          <el-tag type="success" size="mini" v-else>已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="180"></el-table-column>
      <el-table-column prop="create_time" label="下单时间" width="180"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button size="mini" type="success" icon="el-icon-location" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // | 参数名               | 参数说明        | 备注     |
      // | -------------------- | --------------- | -------- |
      // | query                | 查询参数        | 可以为空 |
      // | pagenum              | 当前页码        | 不能为空 |
      // | pagesize             | 每页显示条数    | 不能为空 |
      // | user_id              | 用户 ID         | 可以为空 |
      // | pay_status           | 支付状态        | 可以为空 |
      // | is_send              | 是否发货        | 可以为空 |
      // | order_fapiao_title   | ['个人','公司'] | 可以为空 |
      // | order_fapiao_company | 公司名称        | 可以为空 |
      // | order_fapiao_content | 发票内容        | 可以为空 |
      // | consignee_addr       | 发货地址        | 可以为空 |
      query: "",
      pagenum: 1,
      pagesize: 4,
      user_id: "",
      pay_status: "",
      is_send: "",
      order_fapiao_title: "",
      order_fapiao_company: "",
      order_fapiao_content: "",
      consignee_addr: "",
      orderlist: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    //查询
    searchUser() {
      //按照input绑定的query参数 发请求
      this.getOrderList();
    },
    //获取订单列表
    getOrderList() {
      this.$http
        .get(`orders`, {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize,
            user_id: this.user_id,
            pay_status: this.pay_status,
            is_send: this.is_send,
            order_fapiao_title: this.order_fapiao_title,
            order_fapiao_company: this.order_fapiao_company,
            order_fapiao_content: this.order_fapiao_content,
            consignee_addr: this.consignee_addr,
          },
        })
        .then((res) => {
          console.log(res);
          const {
            meta: { status, msg },
            data: { goods, total },
          } = res.data;
          if (status === 200) {
            // 1. 给表格数据赋值
            this.orderlist = goods;
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