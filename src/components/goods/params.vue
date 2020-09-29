<template>
  <el-card>
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert class="alert" title="只允许为第三级分类设置参数" type="error"></el-alert>

    <el-form class="formcas" label-position="left" label-width="80px">
      <!-- 级联选择器 -->
      <el-form-item label="商品分类">
        <!-- 级联选择器 -->
        <el-cascader
          :options="options"
          :show-all-levels="false"
          v-model="selectedOptions"
          :props="defaultProp"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>

    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <!-- 按钮 -->
        <el-button type="primary">设置动态参数</el-button>
        <!-- 表格 -->
        <el-table class="table" :data="arrDyparams" style="width: 100%" border>
          <el-table-column type="expand" label="#">
            <template slot-scope="scope">
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row.attr_vals,tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row.attr_vals)"
                @blur="handleInputConfirm(scope.row.attr_vals)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
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
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">静态参数</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择器绑定数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      arrDyparams: [],
      active: "1",
      list: [],
      inputVisible: false,
      inputValue: "",
      dynamicTags: [],
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    //点击x按钮
    handleClose(attr_vals, tag) {
      attr_vals.splice(attr_vals.indexOf(tag), 1);
    },
    //点击newtag按钮
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //失去焦点
    handleInputConfirm(attr_vals) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr_vals.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //tab切换时
    handleClick() {},
    // 级联选择器改变
    async handleChange() {
      if (this.selectedOptions.length === 3) {
        //获取动态参数
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        this.arrDyparams = res.data.data;
        this.arrDyparams.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
        console.log(this.arrDyparams);
      }
    },
    //获取三级分类数据
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      this.options = res.data.data;
    },
  },
};
</script>

<style scoped>
.alert {
  margin-top: 20px;
}
.formcas {
  margin-top: 15px;
}
.table {
  margin-top: 15px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>