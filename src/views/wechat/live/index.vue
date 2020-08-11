<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="800px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="直播间标题" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="背景图" prop="coverImg">
            <MaterialList v-model="form.coverImgArr" style="width: 370px" type="image" :num="1" :width="150" :height="150" />
          </el-form-item>
          <el-form-item label="分享图片" prop="shareImg">
            <MaterialList v-model="form.shareImgArr" style="width: 370px" type="image" :num="1" :width="150" :height="150" />
          </el-form-item>
          <el-form-item label="开始时间" prop="startDate">
            <el-date-picker v-model="form.startDate" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="预计结束时间" prop="endDate">
            <el-date-picker v-model="form.endDate" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="主播昵称" prop="anchorName">
            <el-input v-model="form.anchorName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="主播微信号" prop="anchorWechat">
            <el-input v-model="form.anchorWechat" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="主播头像" prop="anchorImg">
            <MaterialList v-model="form.anchorImgArr" style="width: 370px" type="image" :num="1" :width="150" :height="150" />
          </el-form-item>
          <el-form-item label="直播间类型" prop="type">
            <el-radio-group v-model="form.type" >
              <el-radio :label="1" class="radio">推流</el-radio>
              <el-radio :label="0">手机直播</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="横屏、竖屏" prop="screenType">
            <el-radio-group v-model="form.screenType" >
              <el-radio :label="1" class="radio">横屏</el-radio>
              <el-radio :label="0">竖屏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否关闭点赞" prop="closeLike">
            <el-radio-group v-model="form.closeLike" >
              <el-radio :label="1" class="radio">关闭</el-radio>
              <el-radio :label="0">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否关闭货架" prop="closeLike">
            <el-radio-group v-model="form.closeGoods" >
              <el-radio :label="1" class="radio">关闭</el-radio>
              <el-radio :label="0">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否关闭评论" prop="closeComment">
            <el-radio-group v-model="form.closeComment" >
              <el-radio :label="1" class="radio">关闭</el-radio>
              <el-radio :label="0">开启</el-radio>
            </el-radio-group>
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
        <el-table-column v-if="columns.visible('roomId')" prop="roomId" label="直播间id" />
        <el-table-column v-if="columns.visible('name')" prop="name" label="直播间标题" />
        <el-table-column v-if="columns.visible('coverImg')" prop="coverImg" label="背景图">
          <template slot-scope="scope">
            <a :href="scope.row.coverImge" style="color: #42b983" target="_blank"><img :src="scope.row.coverImg" alt="点击打开" class="el-avatar"></a>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('shareImg')" prop="shareImg" label="分享图片" >
          <template slot-scope="scope">
            <a :href="scope.row.shareImge" style="color: #42b983" target="_blank"><img :src="scope.row.shareImg" alt="点击打开" class="el-avatar"></a>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('liveStatus')" prop="liveStatus" label="直播间状态" />
        <el-table-column v-if="columns.visible('startTime')" prop="startTime" label="开始时间" />
        <el-table-column v-if="columns.visible('endTime')" prop="endTime" label="预计结束时间" />
        <el-table-column v-if="columns.visible('anchorName')" prop="anchorName" label="主播昵称" />
        <el-table-column v-if="columns.visible('anchorWechat')" prop="anchorWechat" label="主播微信号" />
        <el-table-column v-if="columns.visible('anchorImg')" prop="anchorImg" label="主播头像" >
          <template slot-scope="scope">
            <a :href="scope.row.anchorImge" style="color: #42b983" target="_blank"><img :src="scope.row.anchorImg" alt="点击打开" class="el-avatar"></a>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('type')" prop="type" label="直播类型" >
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.type === 1" :type="''">推流</el-tag>
              <el-tag v-else :type=" 'info' ">手机直播</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('screenType')" prop="screenType" label="横屏、竖屏" >
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.screenType === 1" :type="''">横屏</el-tag>
              <el-tag v-else :type=" 'info' ">竖屏</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('closeLike')" prop="closeLike" label="点赞" >
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.closeLike === 1" :type="''">关闭</el-tag>
              <el-tag v-else :type=" 'info' ">开启</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('closeGoods')" prop="closeLike" label="货架" >
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.closeGoods === 1" :type="''">关闭</el-tag>
              <el-tag v-else :type=" 'info' ">开启</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('closeComment')" prop="closeLike" label="评论" >
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.closeComment === 1" :type="''">关闭</el-tag>
              <el-tag v-else :type=" 'info' ">开启</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','yxWechatLive:edit','yxWechatLive:del']" label="操作" width="150px" align="center">
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
import crudYxWechatLive from '@/api/yxWechatLive'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import MaterialList from '@/components/material'

// crud交由presenter持有
const defaultCrud = CRUD({ title: 'wxlive', url: 'api/yxWechatLive', sort: 'roomId,desc', crudMethod: { ...crudYxWechatLive }})
const defaultForm = { roomId: null, name: null, coverImge: null, startDate: null, endDate : null,shareImge: null, liveStatus: null,  coverImgArr: [],shareImgArr: [],anchorImgArr: [],startTime: null, endTime: null, anchorName: null, anchorWechat: null, anchorImge: null, type: null, screenType: null, closeLike: null,closeGoods: null, closeComment: null }
export default {
  name: 'YxWechatLive',
  components: { pagination, crudOperation, rrOperation, udOperation ,MaterialList},
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {

      permission: {
        add: ['admin', 'yxWechatLive:add'],
        edit: ['admin', 'yxWechatLive:edit'],
        del: ['admin', 'yxWechatLive:del']
      },
      rules: {
        name: [
          { required: true, message: '直播间标题不能为空', trigger: 'blur' }
        ],
        coverImge: [
          { required: true, message: '背景图不能为空', trigger: 'blur' }
        ],
        shareImge: [
          { required: true, message: '分享图片不能为空', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '预计结束时间不能为空', trigger: 'blur' }
        ],
        anchorName: [
          { required: true, message: '主播昵称不能为空', trigger: 'blur' }
        ],
        anchorWechat: [
          { required: true, message: '主播微信号不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '直播间类型 1：推流 0：手机直播不能为空', trigger: 'blur' }
        ],
        screenType: [
          { required: true, message: '横屏、竖屏 【1：横屏，0：竖屏】不能为空', trigger: 'blur' }
        ],
        closeLike: [
          { required: true, message: '是否关闭货架 【0：开启，1：关闭】不能为空', trigger: 'blur' }
        ],
        closeComment: [
          { required: true, message: '是否关闭评论 【0：开启，1：关闭】不能为空', trigger: 'blur' }
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
    // 添加后  coverImgArr: [],shareImgArr: [],anchorImgArr: []
    [CRUD.HOOK.beforeSubmit]() {
      //console.log('hah:'+this.form.imageArr)
      this.form.coverImge = this.form.coverImgArr.join(',')
      this.form.shareImge = this.form.shareImgArr.join(',')
      this.form.anchorImge = this.form.anchorImgArr.join(',')
    },
    // 编辑前
    [CRUD.HOOK.beforeToEdit](crud, form) {
      form.imageArr = [form.image]
      form.shareImgArr = [form.image]
      form.anchorImgeArr = [form.image]
    }
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
