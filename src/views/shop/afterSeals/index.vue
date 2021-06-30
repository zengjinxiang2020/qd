<template>
  <div class="afterSealsContainer">
    <div class="titleSearch">
      <el-input v-model="query.orderCode" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
      <el-date-picker
        v-model="searchTime"
        :default-time="['00:00:00','23:59:59']"
        type="daterange"
        range-separator=":"
        size="small"
        class="date-item"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <br>
      <el-select v-model="query.type"
        clearable placeholder="售后类型"
        class="filter-item"
        style="width: 130px">
        <el-option
        v-for="item in serviceTypeOptions"
        :key="item.key"
        :label="item.name"
        :value="item.key" />
      </el-select>
      <el-select v-model="query.salesState"
        clearable placeholder="售后状态"
        class="filter-item"
        style="width: 130px">
        <el-option
        v-for="item in salesOptions"
        :key="item.key"
        :label="item.name"
        :value="item.key" />
      </el-select>
      <el-select v-model="query.state"
        clearable placeholder="订单状态"
        class="filter-item"
        style="width: 130px">
        <el-option
        v-for="item in statusOptions"
        :key="item.key"
        :label="item.name"
        :value="item.key" />
      </el-select>
      <el-button size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <el-button
      size="mini"
      type="warning"
      icon="el-icon-refresh-left"
      @click="query.orderCode = query.type = query.salesState = query.state = ''; searchTime = []">重置</el-button>
    </div>
    <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
    <!-- <crudOperation :permission="permission" /> -->
    
    <!--表格渲染-->
    <el-table
    ref="table"
    v-loading="loading"
    :data="data"
    size="small"
    style="width: 100%;"
    @selection-change="val => {selections = val}">
    <!-- @selection-change="selectionChangeHandler" -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orderCode" label="订单号" />
      <el-table-column prop="refundAmount" label="退款金额" />
      <el-table-column prop="serviceType" label="服务类型" >
        <template slot-scope="scope">
          <span v-if="scope.row.serviceType === 0">仅退款</span>
          <span v-if="scope.row.serviceType === 1">退货退款</span>
        </template>
      </el-table-column>
      <el-table-column prop="reasons" label="申请原因" />
      <el-table-column prop="explains" label="说明" />
      <el-table-column prop="state" label="状态" >
        <template slot-scope="scope">
          <span v-if="scope.row.state === 0">等待审核</span>
          <span v-if="scope.row.state === 1">等待用户发货</span>
          <span v-if="scope.row.state === 2">用户已发货</span>
          <span v-if="scope.row.state === 3">退款成功</span>
        </template>
      </el-table-column>
      <el-table-column prop="salesState" label="售后状态" >
        <template slot-scope="scope">
          <span v-if="scope.row.salesState === 0" :style="'color: #42b983'">正常</span>
          <span v-if="scope.row.salesState === 1" :style="'color: #F56C6C'">用户已取消</span>
          <span v-if="scope.row.salesState === 2" :style="'color: #F56C6C'">已拒绝用户</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','yxStoreAfterSales:edit','yxStoreAfterSales:del']" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <!-- <udOperation
            :data="scope.row"
            :permission="permission"
          /> -->
          <el-button size="mini" type="success" v-if="scope.row.state === 0" @click="checkItem(scope.row)">审核</el-button>
          <el-button size="mini" type="primary" v-if="scope.row.state === 2" @click="toQuery">退款</el-button>
          <el-button size="mini" type="danger" v-if="scope.row.state === 3" @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 20px; float: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange" />

      <ADialog ref="addForm" :visible="addVisible"/>
  </div>
</template>

<script>
import initData from '@/mixins/crud'
import crudYxStoreAfterSales from '@/api/yxStoreAfterSales'
import ADialog from './addDialog.vue'
export default {
  name: 'YxStoreAfterSales',
  components: { ADialog },
  mixins: [initData],
  data() {
    return {
      addVisible: false,
      searchTime: [],
      permission: {
        add: ['admin', 'yxStoreAfterSales:add'],
        edit: ['admin', 'yxStoreAfterSales:edit'],
        del: ['admin', 'yxStoreAfterSales:del']
      },
      salesOptions: [
        { key: 0, name: '正常'},
        { key: 1, name: '用户已取消' },
        { key: 2, name: '已拒绝用户'}
      ],
      serviceTypeOptions: [
        { key: '', name: '全部' },
        { key: 0, name: '仅退款' },
        { key: 1, name: '退货退款' }
      ],
      statusOptions: [
        { key: 0, name: '待审核'},
        { key: 1, name: '等待用户发货'},
        { key: 2, name: '用户已发货'},
        { key: 3, name: '已完成'},
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'api/yxStoreAfterSales/sales/List'
      this.params = {
        page: this.page,
        size: this.size,
        
        serviceType: this.query.type || '', // 查询类型
        salesState: 0, // 售后状态
        state: '',
        orderCode: this.query.orderCode || '',
        // startingTime: this.searchTime[0] || '',
        // endTime: this.searchTime[1] || ''
      }
      return true
    },
    // 审核
    checkItem(row) {
      console.log(row)
      this.$refs.addForm.serviceType = row.serviceType

      this.$refs.addForm.form.salesId = row.id
      this.$refs.addForm.form.orderCode = row.orderCode

      this.$refs.addForm.visible = true
    },
    // 删除
    deleteItem() {}
  }
}


</script>

<style lang="scss" scoped>
.afterSealsContainer{
  padding: 12px 8px;
  .titleSearch {
    line-height: 40px;
    margin: 20px 0;
  }
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
}
</style>
