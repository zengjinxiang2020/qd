<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="800px">
          <el-form ref="form" :model="form" :rules="rules" size="small" label-width="200px">
              <el-form-item label="选择商品" prop="coverImgeUrl" label-width="80px">
                <cgood v-model="form.good" ></cgood>
              </el-form-item>
              <el-form-item label="商品小程序路径" prop="url" label-width="80px">
                <el-input v-model="form.url" style="width: 370px;" />
              </el-form-item>
    <!--          1：一口价（只需要传入price，price2不传）-->
    <!--          2：价格区间（price字段为左边界，price2字段为右边界，price和price2必传）-->
    <!--          3：显示折扣价（price字段为原价，price2字段为现价， price和price2必传）-->

              <el-form-item label="商品名称" prop="name" label-width="80px">
                <el-input v-model="form.name" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="价格类型" prop="priceType" label-width="80px">
                <el-radio-group v-model="form.priceType" >
                  <el-radio :label="1" class="radio">一口价</el-radio>
                  <el-radio :label="2">价格区间</el-radio>
                  <el-radio :label="3">显示折扣价</el-radio>
                </el-radio-group>
                </el-form-item>
                  <el-col v-if="form.priceType===1" v-bind="grid">
                    <el-form-item  label="一口价" prop="price" label-width="80px">
                      <el-input v-model="form.price" style="width: 200px;" />
                    </el-form-item>
                  </el-col>
                  <el-col v-if="form.priceType===2" v-bind="grid">
                    <el-form-item label="最低价格" prop="price" label-width="80px">
                      <el-input v-model="form.price"  style="width: 200px;"/>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="form.priceType===2" v-bind="grid">
                    <el-form-item label="最高价格" prop="price2" label-width="80px" >
                      <el-input v-model="form.price2"  style="width: 200px;"/>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="form.priceType===3" v-bind="grid">
                    <el-form-item label="市场价" prop="price" label-width="80px">
                      <el-input v-model="form.price" style="width: 200px;" />
                    </el-form-item>
                  </el-col>
                  <el-col v-if="form.priceType===3" v-bind="grid">
                    <el-form-item label="现价" prop="price2" label-width="80px">
                      <el-input v-model="form.price2"  style="width: 200px;"/>
                    </el-form-item>
                  </el-col>
            </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('goodsId')" prop="goodsId" label="直播商品id" />
        <el-table-column v-if="columns.visible('name')" prop="name" label="商品名称" />
        <el-table-column v-if="columns.visible('productId')" prop="productId" label="关联商品id" />
        <el-table-column v-if="columns.visible('coverImgUrl')" prop="coverImgUrl" label="商品" />
        <el-table-column v-if="columns.visible('url')" prop="url" label="商品小程序路径" />
        <el-table-column v-if="columns.visible('priceType')" prop="priceType" label="价格类型" >
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.type === 1" :type="''">一口价</el-tag>
              <el-tag v-else-if="scope.row.type === 2" :type="''">价格区间</el-tag>
              <el-tag v-else-if="scope.row.type === 3" :type="''">显示折扣价</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('price')" prop="price" label="price" />
        <el-table-column v-if="columns.visible('price2')" prop="price2" label="price2" />
        <el-table-column v-if="columns.visible('auditStatus')" prop="auditStatus" label="审核状态" >
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.auditStatus === 1" :type="''">推流</el-tag>
              <el-tag v-else :type="''">手机直播</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('thirdPartyTag')" prop="thirdPartyTag" label="1, 2：表示是为api添加商品，否则是直播控制台添加的商品" />
        <el-table-column v-permission="['admin','yxWechatLiveGoods:edit','yxWechatLiveGoods:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudYxWechatLiveGoods from '@/api/yxWechatLiveGoods'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from "@/components/material";
import cgood from '@/views/components/good'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '直播商品', url: 'api/yxWechatLiveGoods', sort: 'goods_id,desc', crudMethod: { ...crudYxWechatLiveGoods }})
const defaultForm = {   good: {productId: null,storeName: null,image: null}, goodsId: null, productId: null, coverImgeUrl: null, url: null, priceType: null, price: null, price2: null, name: null, thirdPartyTag: null, auditId: null, auditStatus: null }
export default {
  name: 'YxWechatLiveGoods',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList,cgood},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      grid: {
        xl: 8,
        lg: 12,
        md: 12,
        sm: 24,
        xs: 24
      },
      permission: {
        add: ['admin', 'yxWechatLiveGoods:add'],
        edit: ['admin', 'yxWechatLiveGoods:edit'],
        del: ['admin', 'yxWechatLiveGoods:del']
      },
      rules: {
        // coverImgUrl: [
        //   { required: true, message: '商品图片不能为空', trigger: 'blur' }
        // ],
        // url: [
        //   { required: true, message: '商品小程序路径不能为空', trigger: 'blur' }
        // ],
        // priceType: [
        //   { required: true, message: '价格类型不能为空', trigger: 'blur' }
        // ],
        // price: [
        //   { required: true, message: '不能为空', trigger: 'blur' }
        // ],
        // name: [
        //   { required: true, message: '商品名称不能为空', trigger: 'blur' }
        // ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '商品名称' }
      ]
    }
  },
  watch: {
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }else{
        delete this.crud.params.name
      }
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      this.form.good.productId = form.productId
      this.form.good.storeName = form.name
      this.form.good.image = form.coverImgeUrl
    },
    [CRUD.HOOK.beforeSubmit]() {
      console.log(this.form)
      this.form.productId = this.form.good.productId
      this.form.name = this.form.good.storeName
      this.form.coverImgeUrl = this.form.good.image
    },
  }
}



</script>

<style scoped>
  .table-img {
    display: inline-block;
    text-align: center;
    background: #ccc;
    color: #fff;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
</style>
