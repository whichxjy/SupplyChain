<template>
  <el-form ref="add-payment-form" :model="form">
    <el-form-item label="付款方">
      <el-select v-model="form.fromName" filterable placeholder="请选择" v-bind:loading="loading">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="收款方">
      <el-select v-model="form.toName" filterable placeholder="请选择" v-bind:loading="loading">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="付款金额（整数）">
      <el-input-number v-model="form.amount" :min="1" label="描述文字"></el-input-number>
    </el-form-item>
    <el-form-item label="最迟归还日期">
      <el-date-picker v-model="form.payBackEndTime" align="left" type="date" placeholder="选择日期"></el-date-picker>
    </el-form-item>
    <el-form-item label="交易描述">
      <el-input
        type="textarea"
        v-model="form.description"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入内容"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addPayment">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        fromName: "",
        toName: "",
        amount: 1,
        payBackEndTime: null,
        description: ""
      },
      loading: false,
      options: []
    }
  },
  mounted: function() {
    this.loading = true
    this.$http.get("/orgs").then(res => {
      const names = JSON.parse(res.request.response).names
      const options = names.map(name => {
        return {
          value: name,
          label: name
        }
      })
      this.$set(this, "options", options)
      this.loading = false
    })
  },
  methods: {
    addPayment: function() {
      if (this.form.fromName === "" || this.form.toName === "") {
        this.$message({
          message: "请选择公司或金融机构的名称",
          type: "warning"
        })
        return
      }
      if (this.form.fromName === this.form.toName) {
        this.$message({
          message: "付款方和首款方不能相同",
          type: "warning"
        })
        return
      }
      this.$http
        .post("/payment", {
          params: {
            fromName: this.form.fromName,
            toName: this.form.toName,
            amount: this.form.amount,
            payBackEndTime: Math.floor(
              this.form.payBackEndTime.getTime() / 1000
            ),
            description: this.form.description
          }
        })
        .then(res => {
          if (res.status == 204) {
            this.$message("提交成功")
          }
        })
        .catch(() => {
          this.$message.error("请求出错，请确保信息无误。")
        })
      this.resetForm()
    },
    resetForm() {
      this.form.fromName = ""
      this.form.toName = ""
      this.form.amount = 1
      this.form.payBackEndTime = null
      this.form.description = ""
    }
  }
}
</script>
