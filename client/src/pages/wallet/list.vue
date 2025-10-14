<template>
    <div class="wallet-list flex-between">
        <div class="wallet-list-left">
            <div class="flex-between total">
                <div class="flex-center item-center">
                    <img class="wh60" src="../../assets/images/order.png" alt />
                    <div>
                    <p>{{$t('wallet.orders')}}</p>
                    <p class="fz28 mt5">{{wallet.total_orders || 0}}<span v-if="lang == 'zh'">单</span></p>
                    </div>
                </div>
                <div class="flex-center item-center">
                    <img class="wh60" src="../../assets/images/invoice.png" alt />
                    <div>
                    <p>{{$t('wallet.total-spend')}}</p>
                    <p class="fz28 mt5" v-if="wallet">{{wallet.currency + wallet.total_money.toFixed(2) || 0}}</p>
                    </div>
                </div>
                <div class="flex-center item-center">
                    <img class="wh60" src="../../assets/images/money-bag.png" alt />
                    <div>
                    <p>{{$t('wallet.commissions')}}</p>
                    <p class="fz28 mt5">{{wallet.currency + wallet.rebate_fee || 0}}</p>
                    </div>
                </div>
            </div>
            <walletList :wallet="wallet"  v-on:showAccountEvent="showAccountEvent($event)" v-if="showWalletlist && token"></walletList>
            <div class="no-content text-center mt30"  v-if="!token && showWalletlist">
                <img src="../../assets/images/car-service.png" alt />
                <p class="fz12 color-green">{{$t('wallet.no-records')}}</p>
            </div>
            <div v-if="!showWalletlist">
                <div class="cursor mb10 mt20" @click="showWalletlist = true"><img class="el-icon-back" src="../../assets/images/backarrow.png"/> <span class="fz14 color-666 ml10">{{$t('wallet.back-transac')}}</span></div>
                <accountList></accountList>
            </div>
        </div>
        <div class="wallet-list-right" :class="{'en-height': lang=='en', 'zh-height': lang=='zh'}">
            <p><img src="../../assets/images/coins.png" alt=""></p>
            <p class="fz20 color-333 fw550 mt30">{{$t('wallet.monthly-commissions')}}：￥0</p>
            <p class="fz16 color-333">{{$t('p.commission-tips')}}</p>
            <!-- <el-button class="dowload-detail">{{$t('wallet.download')}}</el-button> -->
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import walletList from '@/components/walletList';
import accountList from '@/components/accountList';

export default {
    name: 'wallet-list',
    components: { walletList, accountList },
    data(){
        return {
            currentPage: 1,
            listTotal: 10,
            showWalletlist: true,
            wallet: '',
            isLoading: true,
            token: ''
        }
    },
    computed: {
    ...mapState({
      lang: state => state.lang
    }),
  },
    mounted() {
        this.getWallet();
        this.token = this.$cookie.get('access_token');
    },
    methods: {
        goWithdraw() {
           this.$router.push({ name: "withdraw" });
        },
        showAccountEvent: function(val) {
           this.showWalletlist = false; 
        },
        getWallet() {
            this.$axios.get(this.lang+'/wallet').then(res => {
                this.wallet = res.data.data;
                this.isLoading = false;
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .wallet-list  {
        width: 1200px;
        margin: 30px auto;

         .wallet-list-left {
            width: 790px;
              .total {
                .flex-center {
                    width: 250px;
                    height: 160px;
                    background:rgba(255,255,255,1);
                    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
                    border-radius: 2px;
                    div { margin-left: 15px; }
                    p { margin: 0; }
                }
            }
            .no-content {
                padding: 100px 30px 50px 30px;
                box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
                height: 300px;
            }
        }

        .en-height { height: 300px; }
        .zh-height { height: 240px; }

        .wallet-list-right {
            width: 320px;
            padding: 30px 20px;
            border-top: 6px solid #328C6E;
            background:rgba(255,255,255,1);
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
            border-radius: 2px;
            .dowload-detail {
                height: 46px;
                background: linear-gradient(360deg,rgba(75,157,99,1) 0%,rgba(50,140,110,1) 100%);
                border-radius: 23px;
                font-size: 16px;
                text-align: center;
                color: #fff;
                border: transparent;
                margin-top: 35px;
            }
        }
    }
   
</style>

