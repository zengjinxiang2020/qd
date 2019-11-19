<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','YXSTOREPINK_ALL','YXSTOREPINK_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="id"/>
      <el-table-column prop="uid" label="用户id"/>
      <el-table-column prop="orderId" label="订单id 生成"/>
      <el-table-column prop="orderIdKey" label="订单id  数据库"/>
      <el-table-column prop="totalNum" label="购买商品个数"/>
      <el-table-column prop="totalPrice" label="购买总金额"/>
      <el-table-column prop="cid" label="拼团产品id"/>
      <el-table-column prop="pid" label="产品id"/>
      <el-table-column prop="people" label="拼图总人数"/>
      <el-table-column prop="price" label="拼团产品单价"/>
      <el-table-column prop="addTime" label="开始时间"/>
      <el-table-column prop="stopTime" label="stopTime"/>
      <el-table-column prop="kId" label="团长id 0为团长"/>
      <el-table-column prop="isTpl" label="是否发送模板消息0未发送1已发送"/>
      <el-table-column prop="isRefund" label="是否退款 0未退款 1已退款"/>
      <el-table-column prop="status" label="状态1进行中2已完成3未完成"/>
      <el-table-column v-if="checkPermission(['ADMIN','YXSTOREPINK_ALL','YXSTOREPINK_EDIT','YXSTOREPINK_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','YXSTOREPINK_ALL','YXSTOREPINK_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','YXSTOREPINK_ALL','YXSTOREPINK_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/yxStorePink'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/yxStorePink'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        uid: data.uid,
        orderId: data.orderId,
        orderIdKey: data.orderIdKey,
        totalNum: data.totalNum,
        totalPrice: data.totalPrice,
        cid: data.cid,
        pid: data.pid,
        people: data.people,
        price: data.price,
        addTime: data.addTime,
        stopTime: data.stopTime,
        kId: data.kId,
        isTpl: data.isTpl,
        isRefund: data.isRefund,
        status: data.status
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
