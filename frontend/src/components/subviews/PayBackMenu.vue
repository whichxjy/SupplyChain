<template>
<el-form ref="pay-back-form" :model="form">
    <el-form-item label="还款方">
        <el-select v-model="form.name" filterable placeholder="请选择" v-bind:loading="loading">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="还款金额（整数）">
        <el-input-number v-model="form.amount" :min="1" label="描述文字"></el-input-number>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="payBack">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
    </el-form-item>
</el-form>
</template>

<script>
export default {
    data() {
        return {
            form: {
                name,
                amount: 1
            },
            loading: false,
            options: []
        };
    },
    mounted: function () {
        this.loading = true;
        this.$http.get("/orgs")
            .then(res => {
                const names = JSON.parse(res.request.response).names;
                const options = names.map(name => {
                    return {
                        value: name,
                        label: name
                    }
                });
                this.$set(this, 'options', options);
                this.loading = false;
            });
    },
    methods: {
        payBack: function () {
            if (this.form.name === "") {
                this.$message({
                    message: "请选择公司或金融机构的名称",
                    type: 'warning'
                });
                return;
            }
            
            this.$http.delete("/payment", {
                    params: {
                        name: this.form.name,
                        amount: this.form.amount,
                        currentTime: Math.floor(Date.now() / 1000)
                    }
                })
                .then(res => {
                    if (res.status == 204) {
                        this.$message("还款成功");
                    }
                })
                .catch(() => {
                    this.$message.error("请求出错，请确保信息无误。");
                });
            this.resetForm();
        },
        resetForm() {
            this.form.name = "";
            this.form.amount = 1;
        }
    }
};
</script>