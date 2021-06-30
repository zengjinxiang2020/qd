<template>
  <el-dialog
  class="afterSealsAdd"
  :close-on-click-modal="false"
  :visible.sync="visible"
  :title="'添加'" width="500px">
    <div v-if="serviceType === 0">
      <span>该订单为仅退款订单，审核通过之后需进行退款，是否审核通过？</span>
    </div>
    <div v-if="serviceType === 1">
      <span>该订单为退货退款，请输入退货地址：</span>
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="收货人" prop="consignee">
          <el-input v-model="form.consignee" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" style="width: 370px;" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {salesCheck} from '@/api/yxStoreAfterSales.js'
export default {
  props: {
  },
  data () {
    return {
      visible: false,
      isShow: false,
      loading: false,
      serviceType: '',
      form: {
        salesId: '', // 售后id
        orderCode: '', // 订单编号
        approvalStatus: '', // 审核状态0成功1失败
        consignee: '', // 收货人
        phoneNumber: '', // 手机号
        address: '' // 地址
      },
      rules: {
        consignee: [{ required: true, message: '请输入', trigger: 'blur' }],
        phoneNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
        address: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
    }
  },
  methods: {
    cancel() {
      this.visible = false
      this.$refs['form'].resetFields()
    },
    async submit() {
      this.loading = true
      if (this.serviceType === 0) {
        consignee = ''
        phoneNumber = ''
        address = ''
      }
      this.form.approvalStatus = 0
      var res = await salesCheck(this.form)
      console.log(res)
      if (res.status === 200) {
        this.$message.success('审核成功')
      } else {
        this.$message.error(res.msg || '审核失败！')
      }
      this.loading = true
    }
  }
}
</script>

<style lang="scss" scoped>
.afterSealsAdd{
  span{
    line-height: 40px;
    font-size: 18px;
    font-weight: bold;
    margin: 25px;
  }
}
</style>