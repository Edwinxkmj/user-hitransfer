<template>
    <div class="account-list" v-loading="isLoading">
        <div v-if="withdrawLog.list">
            <div class="no-content text-center mt60" v-if="withdrawLog.list.length==0">
                <img src="../assets/images/car-service.png" alt />
                <p class="fz12 color-green">{{$t('wallet.no-records')}}</p>
            </div>
        </div>
        <div class="order" v-for="item in withdrawLog.list" :key="item.id">
            <div class="flex-between cursor">
                <p><span class="fz14 color-333">{{$t('wallet.withdrawal-amount')}}</span><br><span class="fz24 color-333 mt5">{{withdrawLog.currency}}{{item.money}}</span></p>
                <p><span class="status-btn p-relative text-center fz16" :class="{'gray': item.status == 1,'green': item.status == 2, 'orange': item.status == 3}">{{item.status_text}}</span></p>
            </div>
            <div class="flex-between fz16 oder-info mt30">
                <p><label class="color-666 ">{{$t('wallet.application-time')}}</label> <span class="color-333">{{item.create_time}}</span></p>
                <p><label class="color-666">{{$t('wallet.bank-account')}}</label> <span class="color-333">{{item.bank}}</span></p>
            </div>
            <div class="flex-between fz16 oder-info">
                <p><label class="color-666">{{$t('wallet.accounting-time')}}</label> <span class="color-333">{{item.pay_time}}</span></p>
                <p><label class="color-666">{{$t('wallet.account-name')}}</label> <span class="color-333">{{item.name}}</span></p>    
            </div>
            <div class="mt40" >
                <p class="fz14 color-666 cursor text-center" v-if="showDetail && item.id != showId" @click="showDetailFn(true, item.id)">{{$t('wallet.details')}} <i class="el-icon-arrow-down ml10"></i></p>
                <p class="fz14 color-666 cursor text-center" v-if="!showDetail" @click="showDetailFn(true, item.id)">{{$t('wallet.details')}} <i class="el-icon-arrow-down ml10"></i></p>
                <div class="account-detail mt20" v-if="showDetail && item.id == showId">
                    <p>
                        <span class="line"></span>
                        <span class="cir"></span>
                        <span class="fz16 color-333 ml10 fw550">{{$t('wallet.request-withdrawal')}}{{withdrawLog.currency}}{{item.money}}</span>
                        <span class="fz14 color-666 ml20">{{item.create_time}}</span>
                    </p>
                     <p v-if="item.status != 1">
                        <span class="line"></span>
                        <span class="cir"></span>
                        <span class="fz16 color-333 ml10 fw550">{{$t('wallet.processing')}}</span>
                    </p>
                     <p>
                        <span class="cir" v-if="item.status == 1"></span>
                        <img class="wh16 status-img" v-if="item.status == 3" src="../assets/images/failure.png" alt="">
                        <img class="wh16 status-img" v-if="item.status == 2" src="../assets/images/yes.png" alt="">
                        <span class="fz16 color-333 ml10">
                            <span :class="{'color-orange': item.status == 3, 'color-78A17D': item.status == 2, 'color-666': item.status == 1}">{{item.status_text}}</span>
                        </span>
                        <span class="fz14 color-666 ml5" v-if="item.status == 3 && item.operate_time">{{$t('wallet.time-failure')}}： {{item.operate_time}}<br></span>
                        <span class="fz14 color-666 ml105" v-if="item.status == 3">{{$t('wallet.reason')}}： {{item.reason}}</span>
                        <span class="fz14 color-666 ml23" v-if="item.status == 2">{{$t('wallet.remit-time')}}： {{item.operate_time}}<br></span>
                        <span class="fz14 color-666 ml105" v-if="item.status == 2">{{$t('wallet.remit-number')}}： {{item.ticket_no}}</span>
                    </p>
                </div>
                <p class="fz14 color-666 cursor text-center mt20" v-if="showDetail && item.id == showId"  @click="showDetailFn(false, item.id)">{{$t('wallet.close')}} <i class="el-icon-arrow-up ml10"></i></p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
   name: 'account-list',
   data() {
       return {
           isLoading: true,
           showDetail: false,
           withdrawLog: '',
           showId: ''
       }
   },
  computed: {
    ...mapState({
      lang: state => state.lang
    }),
  },
   mounted() {
       this.getWithdrawLog();
   },
   methods: {
       getWithdrawLog() {
           this.$axios.get(this.lang+'/wallet/withdraw-log').then(res => {
               this.withdrawLog = res.data.data;
               this.isLoading = false;
           })
       },
       showDetailFn(bool, id) {
           this.showId = id;
           this.showDetail = bool;
       }
    }  
}
</script>
<style lang="scss" scoped>
    .account-list {
        min-height: 680px;   
        padding-bottom: 40px;
    }
    .no-content {
        padding: 100px 25px 25px 25px;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
        background:rgba(255,255,255,1);
        border-radius:2px;
        min-height: 300px;
    }
    .order {
        padding: 0 25px 0 25px;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
        background:rgba(255,255,255,1);
        border-radius:2px;
        margin: 20px 0;
        padding: 20px 25px;
        p {
            margin: 7px 0;
        }
        .order-type-img {
            width: 34px;
            height: 15px;
        }
        .gray {
            background: #556080;
        }
        .green {
            background: linear-gradient(#328C6E,#4B9D63);
        }
        .orange {
            background: #F1604F;
        }
        .left-gray {
            background: #999999;
        }
        .status-btn {
            left: 25px;
            display: inline-block;
            width: 116px;
            height: 30px;
            line-height: 30px;
            color: #fff;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1); 
        }
        .account-detail {
            p {
                position: relative;
                height: 50px;
                .line {
                    position: absolute;
                    left: 5px;
                    top: 17px;
                    height: 45px;
                    border-right: 1px solid #999999;
                }
                .cir {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 100%;
                    border: 1px solid #666;
                }
                .erro {
                    margin-left: 210px;
                }
                .status-img {
                    position: relative;
                    right: 2px;
                    top: 2px;
                }
            }
        }
        
        .oder-info {
            width: 100%;
            label {
                display: inline-block;
                width: 140px;
            }
            span {
                display: inline-block;
                width: 190px;
            }
        }
    }
</style>


