<template>
  <el-form ref="add-financial-inst-form" :model="form">
    <el-form-item label="金融机构名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="已认证">
      <el-switch v-model="form.certified"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addFinancialInst">添加</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data: function() {
    return {
      form: {
        name: "",
        certified: false
      }
    }
  },
  methods: {
    addFinancialInst: function() {
      if (this.name === "") {
        alert("请输入金融机构名称")
        return
      }
      const org = {
        name: this.form.name,
        isCompany: false,
        certified: this.form.certified
      }
      this.$http
        .post("/org", org)
        .then(() => {
          this.$message("成功添加金融机构")
        })
        .catch(err => {
          console.log(err)
        })
      this.resetForm()
    },
    resetForm() {
      this.form.name = ""
      this.form.certified = false
    }
  }
}
</script>
