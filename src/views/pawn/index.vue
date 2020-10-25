<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="典当名称">
            <el-input v-model="form.pawnName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图片">
            <el-input v-model="form.pawnPicture" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="所需积分">
            <el-input v-model="form.integral" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="典当金额">
            <el-input v-model="form.money" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.sort" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否可见">
            <el-input v-model="form.isVisible" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否可选">
            <el-input v-model="form.isOptional" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('pawnName')" prop="pawnName" label="典当名称" />
        <el-table-column v-if="columns.visible('pawnPicture')" prop="pawnPicture" label="图片" />
        <el-table-column v-if="columns.visible('integral')" prop="integral" label="所需积分" />
        <el-table-column v-if="columns.visible('money')" prop="money" label="典当金额" />
        <el-table-column v-if="columns.visible('sort')" prop="sort" label="排序" />
        <el-table-column v-if="columns.visible('isVisible')" prop="isVisible" label="是否可见" />
        <el-table-column v-if="columns.visible('isOptional')" prop="isOptional" label="是否可选" />
        <el-table-column v-permission="['admin','nxPawn:edit','nxPawn:del']" label="操作" width="150px" align="center">
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
import crudNxPawn from '@/api/nxPawn'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from "@/components/material";

// crud交由presenter持有
const defaultCrud = CRUD({ title: 'pawn', url: 'api/nxPawn', sort: 'id,desc', crudMethod: { ...crudNxPawn }})
const defaultForm = { id: null, pawnName: null, pawnPicture: null, integral: null, money: null, sort: null, isVisible: null, isOptional: null }
export default {
  name: 'NxPawn',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      
      permission: {
        add: ['admin', 'nxPawn:add'],
        edit: ['admin', 'nxPawn:edit'],
        del: ['admin', 'nxPawn:del']
      },
      rules: {
        id: [
          { required: true, message: '不能为空', trigger: 'blur' }
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
