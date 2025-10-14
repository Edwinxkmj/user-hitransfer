<template>
    <div class="withdraw flex-between">
        <div class="left-content" v-loading="isloading">
            <div class="cursor mb10" @click="goList()"><img class="el-icon-back" src="../../assets/images/backarrow.png"/> <span class="fz14 color-666 ml10">{{$t('wallet.back-transac')}}</span></div>
            <div class="flex-between vacancies mt30">
                <span class="fz26 color-333">{{$t('wallet.withdrawl-title')}}</span>
                <span class="color-333"><span class="fz20">{{$t('wallet.balance')}}：</span><label class="fz26">{{withdrawInfo.currency + withdrawInfo.balance || 0}}</label></span>
            </div>
            <div v-if="withdrawInfo.currency == '$'">
                <div class="flex color-333 mt50">
                    <span class="fz20  title">{{$t('wallet.bank-account2')}}：</span>
                    <span class="fz16 fw500 min-title">Account Name</span>
                    <span class="fz16 max-width">{{withdrawInfo.bank_info.account_name}}</span>
                </div>
                <div class="flex color-333 mt10">
                    <span class="fz20  title">&nbsp;</span>
                    <span class="fz16 fw500 min-title">Bank Name</span>
                    <span class="fz16 max-width">{{withdrawInfo.bank_info.bank_name}}</span>
                </div>
                <div class="flex color-333 mt10">
                    <span class="fz20  title">&nbsp;</span>
                    <span class="fz16 fw500 min-title">BSB Number</span>
                    <span class="fz16 max-width">{{withdrawInfo.bank_info.bsb}}</span>
                </div>
                <div class="flex color-333 mt10">
                    <span class="fz20  title">&nbsp;</span>
                    <span class="fz16 fw500 min-title">Account Number</span>
                    <span class="fz16 max-width">{{withdrawInfo.bank_info.account_no}}</span>
                </div>
                <div class="flex mt50">
                    <span class="fz20  title">{{$t('wallet.accounting-time2')}}：</span> 
                    <span>{{$t('wallet.next-day')}}</span>
                </div>
                <div class="flex mt50">
                    <span class="fz20  title">{{$t('wallet.withdrawal-amount')}}：</span>
                    <el-input
                        style="width: 280px;"
                        :placeholder="$t('wallet.amount')"
                        v-model="money"
                        clearable>
                    </el-input>
                    <span class="fz20  ml10 mt5">{{$t('wallet.AUD')}}</span>
                </div>
                <div class="text-center mt50">
                    <el-botton @click="submitWithdraw" class="fz16 withdraw-btn cursor">{{$t('wallet.withdrawal-btn')}}</el-botton>
                </div>
            </div>
            <div v-if="withdrawInfo.currency == '¥'">
                <div class="flex color-333 mt50">
                    <span class="fz20  title">{{$t('wallet.bank-account2')}}：</span>
                    <span class="fz16 fw500 min-title">{{$t('wallet.bank-name')}}</span>
                    <span class="fz16 max-width">{{withdrawInfo.bank_info.account_name}}</span>
                </div>
                <div class="flex color-333 mt10">
                    <span class="fz20  title">&nbsp;</span>
                    <span class="fz16 fw500 min-title">{{$t('wallet.account-name2')}}</span>
                    <span class="fz16 max-width">{{withdrawInfo.bank_info.bank_name}}</span>
                </div>
                <div class="flex color-333 mt10">
                    <span class="fz20  title">&nbsp;</span>
                    <span class="fz16 fw500 min-title">{{$t('wallet.account-address')}}</span>
                    <span class="fz16 max-width">{{withdrawInfo.bank_info.abn || withdrawInfo.bank_info.bsb}}</span>
                </div>
                <div class="flex color-333 mt10">
                    <span class="fz20  title">&nbsp;</span>
                    <span class="fz16 fw500 min-title">{{$t('wallet.account-number')}}</span>
                    <span class="fz16 max-width">{{withdrawInfo.bank_info.account_no}}</span>
                </div>
                <div class="flex mt50">
                    <span class="fz20  title">{{$t('wallet.accounting-time2')}}：</span> 
                    <span>{{$t('wallet.next-day')}}</span>
                </div>
                <div class="flex mt50">
                    <span class="fz20  title">{{$t('wallet.withdrawal-amount')}}：</span>
                    <el-input
                        style="width: 280px;"
                        v-model="money"
                        :placeholder="$t('wallet.amount')"
                        clearable>
                    </el-input>
                    <span class="fz20  ml10 mt5">{{$t('wallet.CNY')}}</span>
                </div>
                <div class="text-center mt50">
                    <el-botton @click="submitWithdraw" class="fz16 withdraw-btn cursor">{{$t('wallet.withdrawal-btn')}}</el-botton>
                </div>
            </div>
        </div>
        <div class="right-content" :class="{'en-height': lang=='en', 'zh-height': lang=='zh'}">
            <p><img src="../../assets/images/coins.png" alt=""></p>
            <p class="fz20 color-333  mt30">{{$t('wallet.monthly-commissions')}}：{{withdrawInfo.currency + withdrawInfo.settle_money || 0}}</p>
            <p class="fz16 color-333">{{$t('p.commission-tips')}}</p>
            <!-- <el-button class="dowload-detail">{{$t('wallet.download')}}</el-button> -->
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    name: 'withdraw',
    data() {
        return {
            withdrawInfo: {},
            money: '',
            isloading: true,
        }
    },
    computed: {
        ...mapState({
            lang: state => state.lang
        }),
    },
    mounted(){
        this.getWithdraw();
    },
    methods: {
        getWithdraw(){
            this.$axios.get(this.lang+'/wallet/withdraw').then(res => {
                this.isloading = false;
                this.withdrawInfo = res.data.data;
            })
        },
        submitWithdraw(){
            console.log(this.money , this.withdrawInfo.balance)
            if (!this.money) {
                this.$message.error(this.$t('yz.null-amount'));
                return;
            }else if (Number(this.money) > Number(this.withdrawInfo.balance)) {
                this.$message.error(this.$t('yz.not-balance'));
                return;
            }
            this.$axios.post(this.lang+'/wallet/withdraw', {money: this.money}).then(res => {
                this.$message.success(this.$t('yz.withdrawal-success'));
                this.getWithdraw();
                this.money = '';
            })
        },
        goList() {
            this.$router.push({name: 'walletList'})
        }
    }
}
</script>
<style lang="scss" scoped>
    .withdraw {
        width: 1200px;
        margin: 30px auto;
        .left-content,
        .right-content {
            background: rgba(255,255,255,1);
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
            border-radius: 2px;
        }
        .left-content {
            width: 730px;
            height: 720px;
            padding: 30px;
            .vacancies {
                border-bottom: 1px solid #DCDCDC;
                padding-bottom: 20px;
            }
            .title {
                display: inline-block;
                width: 250px;
            }
            .min-title {
                display: inline-block;
                width: 240px;
            }
            .max-width {
                display: inline-block;
                max-width: 240px;
            }
            .withdraw-btn {
                margin: 30px auto;
                display: inline-block;
                width: 160px;
                height: 48px;
                line-height: 48px;
                text-align: center;
                background: linear-gradient(360deg,rgba(75,157,99,1) 0%,rgba(50,140,110,1) 100%);
                border-radius: 24px;
                color: #fff;
            }
        }
        .en-height { height: 300px; }
        .zh-height { height: 240px; }
        .right-content {
            width: 310px;
            padding: 30px;
            border-top: 6px solid #328C6E;
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


