<template>
  <el-dialog
  :close-on-click-modal="false"
  :before-close="cancelCU"
  :visible.sync="visible"
  :title="'添加'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="物流单号">
        <el-input v-model="form.deliverySn" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="form.state" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="售后状态">
        <el-input v-model="form.salesState" style="width: 370px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="cu === 2" type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // visible: {
    //   typeof: Boolean,
    //   default: false
    // }
  },
  data () {
    return {
      visible: false,
    }
  },
  methods: {
    cancel() {},
    submit() {}
  }
}
</script>

<style>

</style>