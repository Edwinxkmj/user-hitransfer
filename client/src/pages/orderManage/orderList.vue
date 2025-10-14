<template>
    <div class="order-list">
        <div class="left-content">
            <div class="search" shadow="always">
                <h3 class="pt25">{{$t('order.bookings')}}</h3>
                 <el-row class="mt20">
                    <el-col :span="20">
                        <el-input
                            :placeholder="$t('order.order-number')"
                            v-model="form.out_trade_no">
                            <i slot="prefix" class="el-input__icon el-icon-s-unfold"></i>
                        </el-input>
                    </el-col>
                      <el-col :span="2" :offset="1">
                          <el-button type="primary" @click="getOrderList" :class="{'en-pd': lang == 'en', 'zh-pd': lang == 'zh'}" icon="el-icon-search">{{$t('order.search')}}</el-button>
                      </el-col>
                 </el-row>
            </div>
            <div class="status mt10" >
                <el-tabs @tab-click="handleClick">
                    <el-tab-pane :label="$t('wallet.all')" name=""></el-tab-pane>
                    <el-tab-pane :label="$t('order.unpaid')" name="1"></el-tab-pane>
                    <el-tab-pane :label="$t('order.pending')" name="2"></el-tab-pane>
                    <el-tab-pane :label="$t('order.processing')" name="3"></el-tab-pane>
                    <el-tab-pane :label="$t('order.completed')" name="4"></el-tab-pane>
                    <el-tab-pane :label="$t('order.return-cancel')" name="5"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="fz16 color-666 text-right mt20" >
                <span class="cursor sort" :class="{'active': form.sort == 'use_time_asc' || form.sort == 'use_time_desc'}" @click="sort(1)">{{$t('order.pick-up-time')}} <i class="el-icon-d-caret"></i></span>
                <span class="ml15 cursor sort" :class="{'active': form.sort == 'order_time_desc' || form.sort == 'order_time_asc'}" @click="sort(2)">{{$t('order.date-ordered')}} <i class="el-icon-d-caret"></i></span>
            </div>
            <div v-loading="isLoading" class="no-content text-center mt20" v-if="orderList.length == 0">
                <img src="../../assets/images/car-service.png" alt />
                <p class="fz12 color-green">{{$t('order.no-order')}}</p>
            </div>
            <div class="order" v-for="(item, index) in orderList" :key="index" >
                <div class="flex-between cursor" @click="goOrderDts(item.type, item.out_trade_no, item.status_text, item.use_time)">
                    <p>
                        <img v-if="item.type == 'transfer' && item.title.indexOf('接机') != -1" class="order-type-img" src="../../assets/images/airport2.png" alt=""> 
                        <img v-if="item.type == 'transfer' && item.title.indexOf('送机') != -1" class="order-type-img" src="../../assets/images/airportdropoff.png" alt=""> 
                        <span class="fz16 color-333 ml5 title">{{item.title}}</span>
                    </p>
                    <p><span class="status-btn green p-relative text-center fz16" :class="{'plf15': lang == 'en'}">{{item.status_text}}</span></p>
                </div>
                 <div class="flex-between">
                    <p><img class="wh20" src="../../assets/images/event.png" alt=""> &nbsp;<span class="fz16 color-333 ml10">{{item.use_time}}</span></p>
                    <p class="fz16 color-green">{{item.currency_symbol + item.total_fee}}</p>
                </div>
                <div class="flex-between fz16 oder-info mt30">
                    <p><label class="color-666 ">{{$t('order.client-name')}}</label> <span class="color-333">{{item.name}}</span></p>
                    <p><label class="color-666">{{$t('order.order-number')}}</label> <span class="color-333">{{item.out_trade_no}}</span></p>
                </div>
                 <div class="flex-between fz16 oder-info">
                    <p><label class="color-666">{{$t('order.phone-number')}}</label> <span class="color-333">{{item.mobile}}</span></p>
                    <p><label class="color-666">{{$t('order.date-ordered')}}</label> <span class="color-333">{{item.create_time}}</span></p>
                </div>
                <div class="flex-between fz14 mt30">
                    <p class="color-green cursor max-width" v-if="item.private_remark" @click="showPriveteR(item.out_trade_no, item.private_remark)">{{item.private_remark}} <i class="el-icon-edit"></i></p>
                    <p class="color-333 underline cursor" v-if="!item.private_remark"  @click="showPriveteR(item.out_trade_no)">{{$t('order.private-note')}}</p>
                    <p class="btns">
                        <span v-for="item2 in item.operate" :key="item2" @click="operateBtn(item2, item.out_trade_no, item)" :class="{'green': item2=='pay' || item2 == 'refund', 'gray': item2 == 'cancel' || item2 == 'urge'}">{{operate[item2]}}</span> 
                    </p>
                </div>
            </div>
            <div class="load-more cursor mt30" v-if="nextPage && orderList.length > 0" @click="loadMore()" >
                <span class="fz12 color-666">{{$t('order.more')}} <i class="el-icon-arrow-down"></i></span>
            </div><br><br>
            <!-- <pagination :current-page.sync="currentPage" :total="listTotal"></pagination> -->
            <div class="mt50"></div>
        </div>
        <div class="right-content" :class="{'zh-right-content': lang == 'zh', 'en-right-content': lang == 'en'}">
            <div class="rule">
                <h3>{{$t('order.refund-rules')}}</h3>
                <p>{{$t('order.refund-rules-tips1')}} </p>
                <p>{{$t('order.refund-rules-tips2')}} </p>
                <p>{{$t('order.refund-rules-tips3')}}  </p>
                <p>{{$t('order.refund-rules-tips4')}}</p>
                <p>{{$t('order.refund-rules-tips5')}}</p>
                <p>{{$t('order.refund-rules-tips6')}}</p>
                <p>{{$t('order.refund-rules-tips7')}}</p>
                <p>{{$t('order.refund-rules-tips8')}}</p>
                <p>{{$t('order.refund-rules-tips9')}}</p>
                <p>{{$t('order.refund-rules-tips10')}}</p>
            </div>
        </div>
        <!-- 私人备注 -->
        <el-dialog
            :title="$t('order.private-note')"
            :visible.sync="showPrivateRemark"
            width="360px"
            center>
            <el-input
                type="textarea"
                :placeholder="$t('order.private-note-pl')"
                v-model="privateRemarkValue"
                show-word-limit
                rows="3"
                ></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button class="custom-btn" type="" @click="savePrivateRemark">{{$t('m.ok')}}</el-button>
            </span>
        </el-dialog>
        
         <!-- 退款成功及确认取消 -->
        <el-dialog
            :title="cancelTitle"
            :visible.sync="showCancelOrder"
            width="360px"
            @close="bindCancel(2)"
            center>
            <p v-if="cancelTitle" class="fz14 color-333">
                <!-- <span v-if="cancelOrderInfo.is_order !== 0">{{$t('order.has-driver')}}</span> -->
                <span v-if="cancelOrderInfo.fee_cancel_time && lang == 'zh'" >行程开始{{cancelOrderInfo.fee_cancel_time.value}}{{cancelOrderInfo.fee_cancel_time.type}}前可免费取消，</span>
                <span v-if="cancelOrderInfo.fee_cancel_time && lang == 'en'">Free cancellation up to {{cancelOrderInfo.fee_cancel_time.value}} {{cancelOrderInfo.fee_cancel_time.type}} before pick-up.</span>
                <span> {{$t('order.refund-money')}}{{cancelOrderInfo.currency}}{{cancelOrderInfo.refund}}</span>
            </p>
            <span v-if="cancelTitle" slot="footer" class="dialog-footer cancel-footer">
                <el-button size="small" @click="showCancelOrder = false">{{$t('order.no')}}</el-button>
                <el-button size="small" class="mt10" type="danger" @click="bindCancel(1)">{{$t('order.y-cancel')}}</el-button>
            </span>
            <div v-if="!cancelTitle" class="refund-success text-center">
                <img src="../../assets/images/cancel-scucess.png" alt="">
                <p class="fz20 color-333 fw600">{{$t('order.refund-successful')}}</p>
                <p>{{$t('order.refund-tips')}}</p>
                <el-button size="medium" round @click="bindCancel(2)">{{$t('order.ok2')}}</el-button>
            </div>
        </el-dialog>
         
         <!-- 取消成功 -->
         <el-dialog
            :visible.sync="showNoRefundCancel"
            width="360px"
            center>
            <div class="text-center">
                <img src="../../assets/images/no-rerund.png" alt="">
                <p class="fz20 color-333 fw600">{{$t('order.cancel-successful')}}</p>
                <!-- <p v-if="lang == 'zh'">送您一张补偿优惠券，下次下单可以用哦~</p>
                <div class="flex-between item-center coupon mt10">
                    <img class="wh40 ml10" src="../../assets/images/coupons.png" alt="">
                    <div>
                        <p class="color-333 fw600"><span class="fz16">$</span><span class="fz30">50</span><span class="fz16">通用优惠券</span></p>
                        <p class="fz12 color-666">【补偿优惠券】</p>
                        <p class="fz12 color-666">有效期至2018年2月28日</p>
                    </div>
                    <div class="use-btn"><span class="fz14 color-fff">{{$t('order.get')}}</span></div>
                </div> -->
                <el-button class="no-redund-cancel cursor" size="medium" round @click="showNoRefundCancel = false">{{$t('order.ok2')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import pagination from '@/components/pagination/index'
export default {
    name: 'order-list',
    components: { pagination },
    data() {
        return {
            form: {
                create_time: '',
                use_time: '',
                out_trade_no: '',
                name: '',
                mobile: '',
                status: '',
                sort: ''
            },
            isLoading: true,
            orderList: [],
            nextPage: '',
            operate: {'cancel': this.$t('order.cancel-order'), 'pay': this.$t('order.pay'), 'refund': this.$t('order.return-money'), 'urge': this.$t('order.urge')},
            currentPage: 1,
            listTotal: 10,
            showPrivateRemark: false,
            privateRemarkValue: '',
            showCancelOrder: false,
            cancelTitle: this.$t('order.cancel-book'),
            showNoRefundCancel: false,
            cancelOrderInfo: {},
            btn_out_trade_no: ''
        }
    },
    mounted() {
        this.getOrderList();
    },
    computed: {
        ...mapState({
            lang: state => state.lang
        }),
    },
    methods: {
       handleClick(tab){
          this.form.status = tab.index;
          this.getOrderList(); 
       },
       sort(type) {
           if (type == 1) {
               if (this.form.sort != 'use_time_asc') {
                   this.form.sort = 'use_time_asc';  
               }else {
                   this.form.sort = 'use_time_desc';  
               }
           }else {
               if (this.form.sort != 'order_time_desc') {
                  this.form.sort = 'order_time_desc';
               }else{
                  this.form.sort = 'order_time_asc';
               }
           }
           this.getOrderList(); 
       },
       bindCancel(type) {
           if (type == 1) {
                this.confirmCancelOrder();
           }else {
                this.cancelTitle = this.$t('order.cancel-book');  
                this.showCancelOrder = false;
                // this.orderRefund();
           }
       },
       showPriveteR(out_trade_no, private_remark) {
           private_remark ? this.privateRemarkValue =  private_remark: this.privateRemarkValue = '';
           this.btn_out_trade_no = out_trade_no;
           this.showPrivateRemark = true;
       },
       // 私人备注
       savePrivateRemark() {
          if (!this.privateRemarkValue) {
              this.$message.error(this.$t('order.private-remark'));
              return;
          }
          this.$axios.post(this.lang+'/order/private-remark', {private_remark: this.privateRemarkValue, out_trade_no: this.btn_out_trade_no}).then((res) => {
            if (res.data.status == 1) {
                  this.$message.success(this.$t('order.private-remark-success'));
                  this.getOrderList(); 
                  this.showPrivateRemark = false;
             }else {
                  this.$message.error(res.message);
             }
          })
       },
       goOrderDts(type, out_trade_no, status_text, use_time) {
           if (type == 'transfer' || type == 'pointcar') {
             this.$router.push({path: '/index/orderDts',query:{ type: type,out_trade_no:out_trade_no}});
           }else if(type == 'charter' || type == 'day-charter') {
             this.$router.push({path: '/index/dayCarDts',query:{type: type, out_trade_no:out_trade_no, use_time: use_time}});
           }else if(type == 'private-custom') {
            this.$router.push({path: '/index/customizeDts',query:{type: type, out_trade_no:out_trade_no,status_text:status_text, use_time: use_time}});  
           }
       },
       operateBtn(type, out_trade_no, item) {
           this.btn_out_trade_no = out_trade_no;
           let money = item.currency_symbol + item.total_fee;
           if (type == 'pay') {
               sessionStorage.setItem('payParams', JSON.stringify({num :money, out_trade_no: out_trade_no}))
               this.$router.push({name: 'payorder'})
            }else if(type == 'cancel') {
               this.orderCancel(out_trade_no);
            }else if (type == 'refund') {
               this.orderRefund();
            }else if(type == 'urge') {
               this.orderUrgent();
            }
       },
       orderUrgent() { //催派订单
          this.$axios.post(this.lang+'/order/urgent', {'out_trade_no': this.btn_out_trade_no}).then((res) => {
                if (res.data.status == 1) {
                    this.$message.success(this.$t('order.urge-successful'));
                }
            })
       },
       orderRefund() { //退款
            this.$axios.post(this.lang+'/order/refund', {'out_trade_no': this.btn_out_trade_no}).then((res) => {
                if (res.data.status == 1) {
                    this.getOrderList(); 
                    this.cancelTitle = '';
                    this.showCancelOrder = true;    
                }
            })
       },
       confirmCancelOrder() { //确认取消
           this.$axios.post(this.lang + '/order/cancel-confirm', {'out_trade_no': this.btn_out_trade_no}).then((res) => {
             
              this.showCancelOrder = false;
              this.getOrderList(); 
           })
       },
       orderCancel(out_trade_no) { //取消订单
           let param = {'out_trade_no': out_trade_no};
           this.$axios.post(this.lang+'/order/cancel', param).then((res) => {
               if (res.data.data.need_alert == 0) {
                   this.showNoRefundCancel = true;
                   this.getOrderList();
               }else {
                   this.showCancelOrder = true;
                   this.cancelOrderInfo = res.data.data;
               }
           })
       },
       getOrderList() {
           this.orderList.length = 0;
           let url = `${this.lang}/order/list?create_time=${this.form.create_time}&create_time=${this.form.create_time}
                     &status=${this.form.status}&out_trade_no=${this.form.out_trade_no}&name=${this.form.name}
                     &mobile=${this.form.mobile}&sort=${this.form.sort}`;

           this.$axios.get(url).then(res => {
              this.isLoading = false;
              this.orderList = res.data.data.list;
              this.nextPage = res.data.data.next_page ? res.data.data.next_page : '';
           }, ()=> {
              this.isLoading = false;
           })
       },
       loadMore() {
           this.$axios.get(this.nextPage).then(res => {
              this.isLoading = false;
              this.orderList = this.orderList.concat(res.data.data.list);
              this.nextPage = res.data.data.next_page ? res.data.data.next_page : '';
           }, ()=> {
              this.isLoading = false;
           })
       } 
    }
}
</script>

<style lang="scss" scoped>
.custom-btn {
    width: 100%;
    border-radius: 4px;
    border: transparent;
    color: #fff !important;
    background: linear-gradient(#328C6E, #4B9D63);
    box-shadow: 0 2px 20px 0 rgba(51, 51, 51, 0.5);
  }
  .active {
      color: #4B9D63;
  }
.custom-btn:hover {color: #fff !important;} 
.order-list {
    display: flex;
    width: 1201px;
    margin: auto;
    h3 {
        font-size:24px;
        font-weight: 600;
        color:rgba(51,51,51,1);
        line-height:28px;
    }

     .no-content {
        padding: 100px 25px 25px 25px;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
        background:rgba(255,255,255,1);
        border-radius:2px;
        min-height: 300px;
    }

    .max-width {
        width: 480px;
        word-break: break-word;
    }
    
    .left-content {
        width: 790px;
        margin-top: 20px;
        .search { height: 156px; }
        .search,
        .status,
        .order {
            padding: 0 25px 0 25px;
            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
            background:rgba(255,255,255,1);
            border-radius:2px;
        }
        .el-button--primary {
            background: linear-gradient(#328C6E, #4B9D63);
            border: none;
            font-size: 16px;
        }
        .en-pd {
            padding: 11px 11px;
        }
        .zh-pd {
            padding: 11px 21px;
        }
        .sort:hover { color: #4B9D63; }
        .order:hover { background: #f1f1f1; }
        .order:hover .title { color: #4B9D63; }
        .el-button--primary:hover { color: #fff!important; }
        .order {
            margin: 20px 0;
            padding: 20px 25px;
            p {
                margin: 7px 0;
            }
            .order-type-img {
                width: 34px;
                height: 15px;
            }
            .green {
                color: #fff;
                background: linear-gradient(#328C6E,#4B9D63);
            }
            .yellow {
                color: #fff;
                background: #F9BD4F;
            }
            .left-gray {
                color: #fff;
                background: #999999;
            }
            .status-btn {
                left: 25px;
                display: inline-block;
                min-width: 116px;
                // width: 116px;
                height: 30px;
                line-height: 30px;
                color: #fff;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1); 
            }
            .btns {
                 span {
                    display: inline-block;
                    width: 80px;
                    height: 30px;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 13px;
                    margin-left: 10px;
                    cursor: pointer;
                }
                .gray {
                    color: #666;
                    border: 1px solid #999999;
                }
                .gree {
                    color: #38846A;
                    border: 1px solid #38846A;
                }
            }
            
            .oder-info {
                width: 80%;
                label {
                    display: inline-block;
                    width: 120px;
                }
                span {
                    display: inline-block;
                    width: 170px;
                }
            }
        }
        .load-more {
            text-align: center;
            height: 35px;
            line-height: 35px;
            background: #e5e8e7;
        }
        .load-more:hover {
            background: #e1f1e6;
        }
        .load-more:hover i {
            color: #4B9D63;
        }
    }
    .zh-right-content {
        height: 722px;
    }
    .en-right-content {
        height: 1052px;
    }
    .right-content {
        border-top: 6px solid #4B9D63;
        width: 370px;
        margin-left: 40px;
        margin-top: 45px;
        width:370px;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 10px 0px rgba(0,0,0,0.1);
        border-radius:2px;
        .rule {
            padding: 0 25px;
            p {
                font-size: 16px;
                color: #333;
                line-height: 22px;
                margin-bottom: 25px;
            }
        }
    }

    .cancel-footer .el-button {
        display: block;
        width: 100%;
        margin: 0;
    }
    .refund-success {
        img {
            width: 90px;
            height: 90px;   
        }
        .el-button {
            color: #38846A;
            font-size: 14px;
            width: 116px;
            text-align: center;
            height: 30px;
            line-height: 30px;
            padding: 0;
            margin-top: 35px;
            border: 1px solid #38846A;
        }
    }
    .no-redund-cancel {
        margin-top: 60px;
        width: 116px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        padding: 0;
    }
    .coupon {
        border-radius: 12px;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1); 
        p {
            margin: 2px 0;
            text-align: left;
        }
        .use-btn {
            background: rgba(249,189,79,1);
            border-radius:0px 12px 12px 0px;
            height: 90px;
            line-height: 90px;
            width: 62px;
        }
    }

    /deep/ {
        .el-input__inner:focus {
            border: 1px solid #4B9D63;
        }
        .el-tabs__item {
            font-size: 16px;
            height: 62px !important;
            padding: 10px 23px;
        }
        .el-tabs__item:hover,
        .el-tabs__item.is-active {
            color: #38846A;
        }
        .el-tabs__header {
            margin: 0 !important;
        }
        .el-tabs__item.is-active {
            font-weight: 600;
        }
         .el-tabs__nav-wrap::after {
            background-color: transparent;
        }
        .el-tabs__active-bar {
            background-color: #38846A;
            height: 4px;
        }
        .search .el-input__inner,
        .search .el-button {
            border-radius: 2px;
        }
    }
}
</style>

