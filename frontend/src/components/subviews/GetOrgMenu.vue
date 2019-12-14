<template>
<el-form ref="get-org-form" :model="form">
    <el-form-item label="公司或金融机构名称">
        <el-select v-model="form.name" filterable placeholder="请选择" v-bind:loading="loading">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="getReputation">查询</el-button>
    </el-form-item>
</el-form>
</template>

<script>
export default {
    data() {
        return {
            form: {
                name: ""
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
        getReputation: function () {
            if (this.form.name === "") {
                this.$message({
                    message: "请选择公司或金融机构的名称",
                    type: 'warning'
                });
                return;
            }
            this.$http.get("/org", {
                    params: {
                        name: this.form.name
                    }
                })
                .then(res => {
                    if (res.status == 200) {
                        const org = JSON.parse(res.request.response);
\\
                        const text = "信用积分为 " + org.reputation + " 分" + "，" +
                            "仍未支付的款项为 " + org.moneyToPay + " 元" + "，" +
                            "仍未收到的款项为 " + org.moneyToReceive + " 元。"
                        this.$alert(text, '具体信息', {
                            confirmButtonText: '确定'
                        });
                    }
                })
                .catch(() => {
                    this.$message.error("该组织不存在，请确保信息无误。");
                });
            this.resetForm();
        },
        resetForm() {
            this.form.name = "";
        }
    }
};
</script>
