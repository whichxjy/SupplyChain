<template>
<el-menu class="main-nav" @select="handleSelect" :router="true" mode="horizontal">
    <el-submenu index="add">
        <template slot="title">
            添加
        </template>
        <el-menu-item index="add-company" :route="{ name: 'add-company'}">
            添加公司
        </el-menu-item>
        <el-menu-item index="add-financial-inst" :route="{ name: 'add-financial-inst'}">
            添加金融机构
        </el-menu-item>
    </el-submenu>
    <el-menu-item index="get-org" :route="{ name: 'get-org'}">
        查询组织信息
    </el-menu-item>
    <el-menu-item index="add-payment" :route="{ name: 'add-payment'}">
        签发应收账款
    </el-menu-item>
    <el-menu-item index="transfer-payment" :route="{ name: 'transfer-payment'}">
        转让应收账款
    </el-menu-item>
    <el-menu-item index="fund" :route="{ name: 'fund'}">
        融资
    </el-menu-item>
    <el-menu-item index="pay-back" :route="{ name: 'pay-back'}">
        还款
    </el-menu-item>
</el-menu>
</template>

<script>
export default {
    name: 'MainNav',
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        }
    }
}
</script>
