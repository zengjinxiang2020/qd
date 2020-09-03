<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户ID" prop="uid">
            <el-input v-model="form.uid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品ID" prop="productId">
            <el-input v-model="form.productId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="类型(收藏(collect）、点赞(like))">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="某种类型的商品(普通商品、秒杀商品)">
            <el-input v-model="form.category" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="添加时间" prop="createTime">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="updateTime">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="isDel">
            <el-input v-model="form.isDel" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="id" />
        <el-table-column v-if="columns.visible('uid')" prop="uid" label="用户ID" />
        <el-table-column v-if="columns.visible('userName')" prop="uid" label="用户名" />
        <el-table-column v-if="columns.visible('productId')" prop="productId" label="商品ID" />
        <el-table-column v-if="columns.visible('product')" prop="product.name" label="商品名称" />
        <el-table-column ref="table" prop="product.image" label="商品图片">
          <template slot-scope="scope">
            <a :href="scope.row.image" style="color: #42b983" target="_blank"><img :src="scope.row.image" alt="点击打开" class="el-avatar"></a>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="消息类型">
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.type == 'collect'" :type="''">收藏</el-tag>
              <el-tag v-else :type=" 'info' ">足迹</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="添加时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="updateTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('isDel')" prop="isDel" label="isDel" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudYxStoreProductRelation from '@/api/yxStoreProductRelation'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from "@/components/material";

// crud交由presenter持有
const defaultCrud = CRUD({ title: 'ProductRelation', url: 'api/yxStoreProductRelation', type:'collect',sort: 'creat_time,desc', crudMethod: { ...crudYxStoreProductRelation }})
const defaultForm = { id: null, uid: null, productId: null, type: null, category: null, createTime: null, updateTime: null, isDel: null }
export default {
  name: 'YxStoreProductRelation',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'yxStoreProductRelation:add'],
        edit: ['admin', 'yxStoreProductRelation:edit'],
        del: ['admin', 'yxStoreProductRelation:del']
      },
      rules: {
        uid: [
          { required: true, message: '用户ID不能为空', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '商品ID不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '添加时间不能为空', trigger: 'blur' }
        ]
      }    }
  },
  watch: {
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }, // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
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
