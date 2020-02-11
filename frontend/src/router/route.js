import Vue from 'vue'
import Router from 'vue-router'

import AddCompanyMenu from '../components/subviews/AddCompanyMenu'
import AddFinancialInstMenu from '../components/subviews/AddFinancialInstMenu'
import GetOrgMenu from '../components/subviews/GetOrgMenu'
import AddPaymentMenu from '../components/subviews/AddPaymentMenu'
import TransferPaymentMenu from '../components/subviews/TransferPaymentMenu'
import FundMenu from '../components/subviews/FundMenu'
import PayBackMenu from '../components/subviews/PayBackMenu'

Vue.use(Router)

const routes = [
  {
    path: '/add-company',
    component: AddCompanyMenu,
    name: 'add-company'
  },
  {
    path: '/add-financial-inst',
    component: AddFinancialInstMenu,
    name: 'add-financial-inst'
  },
  {
    path: '/get-org',
    component: GetOrgMenu,
    name: 'get-org'
  },
  {
    path: '/add-payment',
    component: AddPaymentMenu,
    name: 'add-payment'
  },
  {
    path: '/transfer-payment',
    component: TransferPaymentMenu,
    name: 'transfer-payment'
  },
  {
    path: '/fund',
    component: FundMenu,
    name: 'fund'
  },
  {
    path: '/pay-back',
    component: PayBackMenu,
    name: 'pay-back'
  }
]

export default new Router({
  routes: routes,
  mode: 'history'
})
