<template>
<el-form ref="fund-form" :model="form">
    <el-form-item label="融资方">
        <el-select v-model="form.fromName" filterable placeholder="请选择" v-bind:loading="loading">
            <el-option v-for="item in compOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="出资方（金融机构）">
        <el-select v-model="form.toName" filterable placeholder="请选择" v-bind:loading="loading">
            <el-option v-for="item in fiOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="融资金额（整数）">
        <el-input-number v-model="form.amount" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="交易描述">
        <el-input type="textarea" v-model="form.description" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容">
        </el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="fund">提交</el-button>
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
                description: ""
            },
            loading: false,
            compOptions: [],
            fiOptions: []
        };
    },
    mounted: function () {
        this.loading = true;
        this.$http.get("/orgs")
            .then(res => {
                const names = JSON.parse(res.request.response).names;
                const compOptions = names.map(name => {
                    return {
                        value: name,
                        label: name
                    }
                });
                this.$set(this, 'compOptions', compOptions);
                this.loading = false;
            });
        this.$http.get("/fis")
            .then(res => {
                const names = JSON.parse(res.request.response).names;
                const fiOptions = names.map(name => {
                    return {
                        value: name,
                        label: name
                    }
                });
                this.$set(this, 'fiOptions', fiOptions);
                this.loading = false;
            });
    },
    methods: {
        fund: function () {
            if (this.form.fromName === "" || this.form.toName === "") {
                this.$message({
                    message: "请选择公司或金融机构的名称",
                    type: 'warning'
                });
                return;
            }
            if (this.form.fromName === this.form.toName) {
                this.$message({
                    message: "融资方和出资方不能相同",
                    type: 'warning'
                });
                return;
            }
            this.$http.post("/fund", {
                    params: {
                        fromName: this.form.fromName,
                        toName: this.form.toName,
                        amount: this.form.amount,
                        description: this.form.description
                    }
                })
                .then(res => {
                    if (res.status == 204) {
                        this.$message("融资成功");
                    }
                })
                .catch(() => {
                    this.$message.error("请求出错，请确保信息无误。");
                });
            this.resetForm();
        },
        resetForm() {
            this.form.fromName = "";
            this.form.toName = "";
            this.form.amount = 1;
            this.form.description = "";
        }
    }
};
</script>
