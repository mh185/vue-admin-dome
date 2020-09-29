<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 提示 -->
    <el-alert
      class="alert"
      title="添加商品信息"
      type="success"
      center
      show-icon
    ></el-alert>

    <!-- 步骤条 -->
    <el-steps
      :active="1 * active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 最外层是el-form -->
    <el-form
      label-position="top"
      label-width="80px"
      :model="form"
      style="height: 400px; overflow: auto"
    >
      <!-- 左侧tabs标签 -->
      <el-tabs
        @tab-click="tabChange()"
        class="tabs"
        v-model="active"
        tab-position="left"
      >
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader
              :options="options"
              v-model="selectedOptions"
              :props="defaultProp"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item
            :label="item.attr_name"
            v-for="(item, i) in arrDyparams"
            :key="i"
          >
            <!-- 复选框组 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                v-for="(item2, i) in item.attr_vals"
                :key="i"
                :label="item2"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <!-- 静态参数的数据 -->
          <el-form-item
            :label="item.attr_name"
            v-for="(item, i) in arrStaticparams"
            :key="i"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <!-- baseUrl axios发的请求 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <!-- 表单元素 -->
            <el-button class="add" @click="addGoods()" type="primary"
              >添加商品</el-button
            >
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- <el-form-item label="名称">
    <el-input v-model="formLabelAlign.name"></el-input>
    </el-form-item>-->
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      active: "1",
      // | 参数名          | 参数说明                                          | 备注     |
      // | --------------- | ------------------------------------------------- | -------- |
      // | goods_name      | 商品名称                                          | 不能为空 |
      // | goods_cat       | 以为','分割的分类列表                             | 不能为空 |
      // | goods_price     | 价格                                              | 不能为空 |
      // | goods_number    | 数量                                              | 不能为空 |
      // | goods_weight    | 重量                                              | 不能为空 |
      // | goods_introduce | 介绍                                              | 可以为空 |
      // | pics            | 上传的图片临时路径（对象）                        | 可以为空 |
      // | attrs           | 商品的参数（数组），包含 `动态参数` 和 `静态属性` | 可以为空 |
      //添加商品得表单数据
      // p251
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: [],
      },
      checkList: [],
      // 级联选择器绑定数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      //动态参数数组
      arrDyparams: [],
      //静态参数的数据数组
      arrStaticparams: [],
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    //添加商品 - 发送请求
    async addGoods() {
      //goods_cat  ->分类
      this.form.goods_cat = this.selectedOptions.join(",");

      //pics 在上传和移出图片时  进行赋值和删除[].findInede()

      //attrs[{attr_id:?,attr_value:?}]
      // 动态参数数组
      //遍历 + 取值 + 放在一个新数组
      // console.log(this.arrDyparams);
      let arr1 = this.arrDyparams.map((item) => {
        //item.arrt_id和item.attr_vals
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      // console.log(arr1);
      //静态参数数组
      let arr2 = this.arrStaticparams.map((item) => {
        //item.arrt_id和item.attr_vals
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      this.form.attrs = [...arr1, ...arr2];
      //在发请求之前 处理this.form中的未处理数据
      const res = await this.$http.post(`goods`, this.form);
      //回到商品列表页
      this.$router.push({ path: "goods" });
      // console.log(res);
      if (res.data.meta.status === 201) {
        this.$message.success(res.data.meta.msg);
      } else {
        this.$message.error(res.data.meta.msg);
      }
    },
    //图片上传时得相关方法
    //file形参里面是当前操作得图片得相关信息
    handlePreview(file) {},
    handleRemove(file) {
      //file.response.data.tmp_path
      // console.log("移出");
      // console.log(file);
      //先获取图片索引
      //findIndex((item)=>{}) 遍历 把符合条件的元素的索引进行返回
      let Index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(Index, 1);
      console.log(this.form.pics);
    },
    handleSuccess(file) {
      //file.data.tmp_path 图片上传临时路径
      // console.log("成功");
      // console.log(file);
      this.form.pics.push({
        pic: file.data.tmp_path,
      });
    },
    //点击不同的tab触发
    async tabChange() {
      //如果点击的是第二个tab同时 三级分类要有值
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          //提示
          this.$message.warning("请选择三级分类");
          return;
        }
        //获取数据
        //id -> 分类id
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        // console.log(res);
        this.arrDyparams = res.data.data;
        //this.arrDyparams每个对象.attr_vals字符串 -> 数组
        this.arrDyparams.forEach((item) => {
          //并不是所有的三级分类都有动态参数 -> ""->[]->v-for报错
          // if (item.attr_vals.length !== 0) {
          //   //this.arrDyparams每个对象.attr_vals字符串 -> 数组
          //   item.attr_vals = item.attr_vals.trim().split(",");
          // }
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
      } else if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          //提示
          this.$message.warning("请选择三级分类");
          return;
        }
        //获取静态参数数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        // console.log(res);
        this.arrStaticparams = res.data.data;
      }
    },
    // 级联选择器@change触发的方法
    handleChange() {},
    // 获取三级分类的信息 - 发送请求
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      this.options = res.data.data;
    },
  },
};
</script>

<style>
.alert {
  margin-top: 15px;
}
.tabs {
  margin-top: 15px;
}
.ql-editor {
  min-height: 300px;
}
.add {
  margin-bottom: 10px;
}
</style>