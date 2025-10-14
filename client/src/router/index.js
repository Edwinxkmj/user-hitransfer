import Vue from 'vue'
import Router from 'vue-router'
import index from '../pages/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/index/home',
      component: (resolve) => require(['@/pages/index.vue'], resolve),
    },
    {
      path: '/index',
      component: (resolve) => require(['@/pages/index.vue'], resolve),
      redirect: '/index/home',
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/index/home',
          name: "home",
          component: (resolve) => require(['@/pages/home.vue'], resolve)
        },
        {
          path: '/index/companyInfo',
          name: "companyInfo",
          component: () => import('@/pages/registerInfo/companyInfo')
        },
        {
          path: '/index/circuit',
          name: "circuit",
          component: () => import('@/pages/circuitChartered/circuitChartered')
        },
        {
          path: '/index/carDetails',
          name: "carDetails",
          component: () => import('@/pages/circuitChartered/carDetails')
        },
        {
          path: '/index/charter-order',
          name: "charterOrder",
          component: () => import('@/pages/circuitChartered/order')
        },
        {
          path: '/index/hot-place',
          name: "hotPlace",
          component: () => import('@/pages/circuitChartered/hotPlace')
        },
        {
          path: '/index/day-order',
          name: "dayCarOrder",
          component: () => import('@/pages/dayCar/order')
        },
        {
          path: '/index/airplane',
          name: "airplane",
          component: () => import('@/pages/airplane/airplane')
        },
        {
          path: '/index/appointment',
          name: "appointment",
          component: () => import('@/pages/appointment/appointment')
        },
        {
          path: '/index/daycar',
          name: "daycar",
          component: () => import('@/pages/dayCar/index')
        },
        {
          path: '/index/customize',
          name: "customize",
          component: () => import('@/pages/customize/index')
        },
        {
          path: '/index/order',
          name: "airOrder",
          component: () => import('@/pages/airplane/order')
        },
        {
          path: '/index/appointmentOrder',
          name: "appointmentOrder",
          component: () => import('@/pages/appointment/order')
        },
        {
          path: '/index/pay',
          name: "payorder",
          component: () => import('@/pages/payorder/payorder')
        },
          {
          path: '/index/orderlist',
          name: "orderList",
          component: () => import('@/pages/orderManage/orderList')
        },
        {
          path: '/index/orderdts',
          name: "orderDts",
          component: () => import('@/pages/orderManage/orderDts')
        },
          {
          path: '/index/customizedts',
          name: "customizeDts",
          component: () => import('@/pages/orderManage/customizeDts')
        },
         {
          path: '/index/daycardts',
          name: "dayCarDts",
          component: () => import('@/pages/orderManage/dayCarDts')
        },
        {
          path: '/index/account',
          name: "account",
          component: () => import('@/pages/account')
        },
        {
          path: '/index/coupons',
          name: "coupons",
          component: () => import('@/pages/coupons')
        },
        {
          path: '/index/walletlist',
          name: "walletList",
          component: () => import('@/pages/wallet/list')
        },
        {
          path: '/index/withdraw',
          name: "withdraw",
          component: () => import('@/pages/wallet/withdraw')
        },
        {
          path: '/index/help',
          name: "help",
          component: () => import('@/pages/help')
        },
        {
          path: '/index/success',
          name: "success",
          component: () => import('@/pages/payorder/success')
        },
        {
          path: '/index/user',
          name: "user",
          component: () => import('@/pages/login/index')
        }
      ]
    }
  ]
})
